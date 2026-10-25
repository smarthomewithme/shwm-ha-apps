import { normalizeAdvertisement, decodeLC026, parseLine, toTheengs, espHomeScaleYAML, BOARD_CATALOG, getBoard, SCANNER_BOARDS, summarizeDecoded } from './core.mjs?v=0.5.1-20261025';

const $ = selector => document.querySelector(selector);
const byMac = new Map();
let port=null, reader=null, stop=false, moduleDecoder=null, selected='', packetCount=0, pendingRender=null;
let flashCheckSeq=0, lastShownMac='', lastSelectionStatus='';
const status=(str, kind='info')=>{$('#status').textContent=str;$('#status').dataset.kind=kind;};
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const setLiveButton=(live)=>{$('#connect').textContent=live?'Stop scanning':'Scan nearby BLE';};

async function initTheengs(){
  $('#engine').textContent='Loading official Theengs WASM…';
  try {
    const mod=await import('./vendor/theengs_decoder_wasm.mjs');
    const factory=mod.default||mod.createTheengsDecoderModule;
    if(typeof factory!=='function') throw new Error('Theengs WASM factory unavailable');
    const runtime=await factory({ locateFile:(file)=>new URL(`./vendor/${file}`,import.meta.url).href });
    moduleDecoder=new runtime.TheengsDecoder();
    $('#engine').textContent='Theengs WASM ready + SHWM LC026';
  } catch(e) {
    $('#engine').textContent='Theengs WASM unavailable — SHWM LC026 decoder only';
    $('#engine').title=String(e.message||e);
  }
}
function decodeWithTheengs(frame) {
  if(!moduleDecoder || !(frame.manufacturerdata||frame.servicedata)) return null;
  try {const output=moduleDecoder.decodeBLE(JSON.stringify(toTheengs(frame)));
    if(!output) return null;const obj=JSON.parse(output);
    if(!obj || Object.keys(obj).length===0) return null;
    return obj;
  } catch {return null;}
}
function accept(obj) {
  const frame=normalizeAdvertisement(obj);if(!frame)return;
  packetCount++;
  const previous=byMac.get(frame.mac); const lc=decodeLC026(frame); const theengs=decodeWithTheengs(frame);
  const record={frame,count:(previous?.count||0)+1,lc:lc||previous?.lc||null,
   theengs:theengs||previous?.theengs||null,updated:new Date()};
  if(byMac.size>=150&&!byMac.has(frame.mac))byMac.delete(byMac.keys().next().value);
  byMac.set(frame.mac,record);
  if(!selected && lc?.stable) selected=frame.mac; // Auto-select verified scale for beginners.
  if(pendingRender===null) pendingRender=setTimeout(()=>{pendingRender=null;render();},140);
}
function render(){
 const host=$('#devices');
 const recognized=[...byMac.values()].filter(v=>v.lc||v.theengs).length;
 $('#rx-count').textContent=String(packetCount);
 $('#known-count').textContent=String(recognized);
 $('#last-packet').textContent=packetCount?'latest '+new Date().toLocaleTimeString():'waiting for BLE advertisements';
 const items=[...byMac.values()].filter(x=>!$('#recognized-only').checked||x.lc||x.theengs)
   .sort((a,b)=>b.updated-a.updated).slice(0,150);
 if(!items.length){host.innerHTML='<tr><td colspan="6">No live BLE devices yet. Click Scan nearby BLE, select the ESP32 port and wake your device; advanced filters may hide unknown devices.</td></tr>';return;}
 host.innerHTML=items.map(item=>{
  const x=item.frame;
  const summary=summarizeDecoded(item.theengs,item.lc);
  const last=item.updated.toLocaleTimeString();
  return `<tr><td><button type="button" data-mac="${escape(x.mac)}">Select</button> <small>${escape(x.mac)}</small></td>`+
    `<td>${escape(x.name||'—')}</td><td>${escape(x.rssi)}</td><td>${escape(summary)}</td><td>${item.count}</td><td>${escape(last)}</td></tr>`;
 }).join('');
 [...host.querySelectorAll('[data-mac]')].forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.mac;showSelection();}));
 if(selected)showSelection();
}
$('#recognized-only').addEventListener('change',render);
function showSelection(){
 const r=byMac.get(selected); if(!r)return;
 const b=getBoard($('#board').value), reading=summarizeDecoded(r.theengs,r.lc);
 $('#selected').textContent='Selected: '+(r.lc?'LC026-compatible scale':(r.frame.name||'Bluetooth device'))+' ('+selected+')';
 $('#raw').textContent=JSON.stringify(r.frame,null,2);
 $('#decoded').textContent=JSON.stringify({shwm_lc026:r.lc,theengs:r.theengs},null,2);
 if(r.lc?.stable) $('#reading').textContent='✓ Stable weight: '+r.lc.weight_kg.toFixed(2)+' kg';
 else if(r.lc) $('#reading').textContent='Scale detected, but the measurement is still moving. Wait until it is stable.';
 else if(r.theengs) $('#reading').textContent='Recognized: '+reading;
 else $('#reading').textContent='Bluetooth data captured, but this device is not yet recognized.';
 $('#make-yaml').disabled=!(r.lc?.stable&&b);
 if(lastShownMac!==selected){ $('#yaml').value='';$('#copy').disabled=true;$('#download').disabled=true;lastShownMac=selected; }
 const note=r.lc?.stable?'Ready! Click Generate ESPHome YAML. The code will use '+(b?.label||'your ESP32')+'.':r.lc?'Wait for the LC026 reading to become stable.':r.theengs?'Theengs recognizes this device, but we have no verified ESPHome YAML template for it yet.':'This BLE message is not yet supported for YAML generation. Do not guess a device profile.';
 $('#yaml-note').textContent=note;$('#yaml-note').dataset.kind=r.lc?.stable?'ok':'warn';
 const state=r.lc?(r.lc.stable?'lc-stable':'lc-pending'):(r.theengs?'theengs':'unknown');
 if(state!==lastSelectionStatus){
   lastSelectionStatus=state;
   if(r.theengs&&!r.lc) status('Device recognized; no verified YAML template for this model yet.','warn');
   else if(r.lc&&!r.lc.stable)status('LC026 detected. Waiting for a stable reading.','warn');
   else if(r.lc)status('Stable LC026 reading ready. Continue to Step 3.','ok');
   else status('Bluetooth data captured. Decoder for this device is not yet verified.','warn');
 }
}
function parseTextInput(str){
 let count=0;
 for(const line of str.split(/\r?\n/)) {
  if(line.length>4000)continue;
  const obj=parseLine(line);
  if(obj&&!obj.hello){accept(obj);count++}
 }
 return count;
}
function addLines(raw){const el=$('#capture');el.value=(el.value+raw+'\n').slice(-60000);parseTextInput(raw);}
async function sendSerialCommand(command) {
 if (!port?.writable) return false;
 let writer;
 try {
  writer=port.writable.getWriter();
  await writer.write(new TextEncoder().encode(command+'\n'));
  return true;
 } finally {if(writer)writer.releaseLock();}
}
async function connectSerial(){
 if(reader){
  stop=true;
  try{await sendSerialCommand('STOP')}catch{}
  try{await reader.cancel()}catch{}
  return;
 }
 if(!window.isSecureContext||!('serial' in navigator)){
  status('Live scan needs Web Serial: open this HTTPS app in desktop Chrome or Edge and connect an ESP32 over USB.','warn');return;
 }
 let timeoutId=null, scannerIdentified=false, sawPacket=false, commandSent=false;
 try{
  port=await navigator.serial.requestPort();
  await port.open({baudRate:115200});
  stop=false;
  byMac.clear();selected='';packetCount=0;lastShownMac='';lastSelectionStatus='';
  $('#raw').textContent='No device selected';$('#decoded').textContent='No device selected';
  $('#selected').textContent='Waiting for a live BLE device';
  $('#reading').textContent='Waiting for nearby BLE advertisements…';
  $('#yaml').value='';$('#copy').disabled=true;$('#download').disabled=true;$('#make-yaml').disabled=true;
  render();
  setLiveButton(true);
  status('USB connected. Checking for SHWM BLE Scanner firmware (not standard ESPHome)…');
  timeoutId=setTimeout(()=>{
    if(stop)return;
    if(!scannerIdentified&&!sawPacket)status('No SHWM Scanner data received. Is the TEMPORARY scanner firmware installed? Standard ESPHome logs cannot be read as BLE packets. Check port and USB cable.','warn');
    else if(!sawPacket)status('Scanner is connected but no BLE advertisements have arrived. Wake your device and move it closer to the ESP32.','warn');
  },8500);
  const decoder=new TextDecoder();let buffer='';
  reader=port.readable.getReader();
  while(!stop){
   const {value,done}=await reader.read();if(done)break;
   buffer+=decoder.decode(value,{stream:true});
   if(buffer.length>100000){buffer='';status('USB stream overflow; input buffer reset.','warn');}
   const lines=buffer.split(/\r?\n/);buffer=lines.pop()||'';
   for(const line of lines){
    if(!line.trim()||line.length>4000)continue;
    let obj;try{obj=JSON.parse(line);}catch{continue;}
    if(obj?.type==='hello'){
     if(obj.firmware!=='SHWM BLE USB Scanner'){
      status('Connected USB device sent an unknown greeting. SHWM scanner firmware required.','warn');continue;
     }
     scannerIdentified=true;
     if(!commandSent){
      commandSent=true;
      try{await sendSerialCommand('SCAN');status('SHWM Scanner detected. Starting nearby Bluetooth scan…','ok');}
      catch(err){status('Scanner detected, but SCAN command failed: '+String(err.message||err),'warn');}
     }
     continue;
    }
    if(obj?.type==='scan_state'){
     if(obj.state==='scanning')status('BLE scan running. Step on the scale and watch the device list update live.','ok');
     else if(obj.state==='stopped')status('BLE scan stopped.');
     continue;
    }
    const frame=parseLine(line);
    if(frame&&!frame.hello){
     sawPacket=true;
     if(!scannerIdentified){scannerIdentified=true;status('Live BLE packets received. Older scanner firmware detected; decoding now.','ok');}
     addLines(line);
    }
   }
  }
 }catch(err){
  status('Live scan could not start: '+String(err.message||err)+'. Choose the correct ESP32 USB port and install SHWM scanner firmware from Step 1.','warn');
 }finally{
  if(timeoutId!==null)clearTimeout(timeoutId);
  const stoppedByUser=stop;
  if(reader){try{reader.releaseLock()}catch{}reader=null;}
  if(port){try{await port.close()}catch{}port=null;}
  stop=false;setLiveButton(false);
  if(stoppedByUser)status('BLE scan stopped. Click Scan nearby BLE to start again.');
 }
}
$('#connect').addEventListener('click',connectSerial);
$('#import').addEventListener('click',()=>{const n=parseTextInput($('#capture').value);status(n?`${n} scanner messages imported. Select a device below.`:'No valid SHWM Scanner JSON lines found. Check the data format.',n?'ok':'warn');});
$('#make-yaml').addEventListener('click',()=>{
 const d=byMac.get(selected),b=getBoard($('#board').value);
 if(!d?.lc?.stable||!b){status('Choose a verified, stable LC026 reading and your board first.','warn');return;}
 try{
   $('#yaml').value=espHomeScaleYAML(selected,b.id);
   $('#copy').disabled=false;$('#download').disabled=false;
   $('#yaml-note').textContent='YAML ready for '+b.label+'. Click Copy YAML, then paste it into ESPHome Device Builder and validate/compile.';
   $('#yaml-note').dataset.kind='ok';
   status('YAML ready. Copy the code in Step 3.','ok');
 }catch(e){status('Could not generate YAML: '+String(e.message||e),'warn');}
});
$('#copy').addEventListener('click',async()=>{const y=$('#yaml').value;if(!y){status('Generate YAML first.','warn');return;}try{await navigator.clipboard.writeText(y);status('Copied! Paste this YAML into ESPHome Device Builder.','ok')}catch{$('#yaml').focus();$('#yaml').select();status('YAML selected. Press Ctrl+C to copy.','warn')}});
$('#download').addEventListener('click',()=>{const text=$('#yaml').value;if(!text)return;
 const u=URL.createObjectURL(new Blob([text],{type:'text/yaml;charset=utf-8'}));const a=document.createElement('a');a.href=u;a.download='shwm-lc026-final-esphome.yaml';a.click();setTimeout(()=>URL.revokeObjectURL(u),3000);
});
// Board choices are intentionally restricted to models compiled by the isolated CI build.
// Separate manifests prevent ESP Web Tools silently picking the wrong board within one chip family.
function fillFinalBoardOptions(query){
 const sel=$('#board'), previous=sel.value||'esp32dev';
 const q=String(query||'').trim().toLowerCase();
 const matches=BOARD_CATALOG.filter(b=>!q||b.id.toLowerCase().includes(q)||b.label.toLowerCase().includes(q)||b.chipFamily.toLowerCase().includes(q));
 // Keep the previously selected target visible even when the filter excludes it.
 const visible=matches.some(b=>b.id===previous)?matches:[...matches,...BOARD_CATALOG.filter(b=>b.id===previous)];
 const groups=['ESP32','ESP32-C3','ESP32-S3'];
 sel.innerHTML=groups.map(f=>{
  const list=visible.filter(b=>b.chipFamily===f);
  return list.length?`<optgroup label="${f} — ${list.length} matching">${list.map(b=>`<option value="${b.id}">${escape(b.label)} ${b.scanner?'[scanner + YAML]':'[YAML preview only]'}</option>`).join('')}</optgroup>`:'';
 }).join('');
 if(visible.length)sel.value=previous;
 $('#board-catalog-count').textContent=String(BOARD_CATALOG.length);
 $('#board-scan-count').textContent=String(SCANNER_BOARDS.length);
 $('#board-search-status').textContent=matches.length+' matching board model'+(matches.length===1?'':'s')+'.';
}
function initializeBoardSelectors(){
 fillFinalBoardOptions('');
 $('#board-search').addEventListener('input',e=>fillFinalBoardOptions(e.target.value));
 $('#board').addEventListener('change',()=>{
   updateBoardWarning();
   void verifySelectedFirmware();
   if($('#yaml').value && selected && byMac.get(selected)?.lc?.stable){
     $('#yaml').value=espHomeScaleYAML(selected,$('#board').value);
     $('#yaml-note').textContent='Updated YAML for '+getBoard($('#board').value).label+'. Copy it again before compiling.';
   }
   if(selected) showSelection();
 });
 updateBoardWarning();
}
function updateBoardWarning(){
 const b=getBoard($('#board').value);
 $('#board-confirm').textContent=b?b.label:'the board selected in Step 1';
 $('#board-warning').textContent=b?'Selected: '+b.label+' ('+b.chipFamily+', '+b.usb+'). Confirm the hardware and USB port before flashing.':'Choose your exact board first.';
 $('#board-note').textContent=b
   ? b.scanner?'Scanner installer available for '+b.label+'. You can scan via USB and generate verified LC026 YAML.':'YAML preview only for '+b.label+'. There is no tested one-click BLE scanner for this model; use a supported ESP32 scanner or import a compatible capture instead.'
   : 'Select a board to continue.';
}
async function verifySelectedFirmware(){
 const seq=++flashCheckSeq;
 const b=getBoard($('#board').value);
 const wrapper=$('#install-wrapper');
 wrapper.hidden=true;
 if(!b||!b.scanner){$('#firmware-notice').textContent='No one-click BLE Scanner for this board. You may still preview the verified LC026 YAML using imported BLE recordings (live scanning needs a supported ESP32).';return;}
 if(!window.isSecureContext){$('#firmware-notice').textContent='Open this tool over HTTPS to enable USB firmware flashing.';return;}
 const path='./firmware/manifests/'+b.id+'.json';
 $('#flash-tool').setAttribute('manifest',path);
 $('#firmware-notice').textContent='Checking precompiled firmware for '+b.label+'…';
 try{
   const url=new URL(path,window.location.href);
   const response=await fetch(url.href,{cache:'no-store'});
   if(!response.ok)throw new Error('manifest HTTP '+response.status);
   const manifest=await response.json();
   if(!Array.isArray(manifest.builds)||manifest.builds.length!==1)throw new Error('manifest must contain one build');
   const build=manifest.builds[0];
   if(build.chipFamily!==b.chipFamily || !Array.isArray(build.parts)||build.parts.length!==1)
     throw new Error('board/chip manifest mismatch');
   const binary=new URL(build.parts[0].path,url);
   if(binary.origin!==window.location.origin)throw new Error('firmware origin mismatch');
   const head=await fetch(binary.href,{method:'HEAD',cache:'no-store'});
   if(!head.ok || Number(head.headers.get('content-length')||0)<100000)throw new Error('firmware missing');
   // Fail closed when the ESP Web Tools script is blocked or not yet registered.
   if(!window.customElements)throw new Error('browser has no custom-element support');
   if(!window.customElements.get('esp-web-install-button')){
     await Promise.race([
       window.customElements.whenDefined('esp-web-install-button'),
       new Promise((_,reject)=>setTimeout(()=>reject(new Error('ESP Web Tools installer script unavailable')),7000))
     ]);
   }
   if(seq!==flashCheckSeq)return;
   wrapper.hidden=false;
   $('#firmware-notice').textContent='Ready: precompiled BLE scanner for '+b.label+'. Verify the model before installing.';
 }catch(err){
   if(seq!==flashCheckSeq)return;
   $('#firmware-notice').textContent='Installer disabled: '+String(err.message||err)+'. Run the CI build and deploy its exact firmware files first.';
 }
}
// Progressive enhancement: the board dropdown is already populated in HTML.
// If module initialization fails, keep every board selectable and show a clear error.
try {
 initializeBoardSelectors();
 void verifySelectedFirmware();
 void initTheengs();
 render();
} catch(err) {
 const boardNote=$('#board-note');
 if(boardNote) boardNote.textContent='Scanner app initialization failed: '+String(err?.message||err)+'. The board list remains available. Reload or open the full generator in a new tab.';
 const firmwareNote=$('#firmware-notice');
 if(firmwareNote) firmwareNote.textContent='Scanner controls unavailable until the app finishes initializing.';
 console.error('SHWM BLE app initialization failure',err);
}
