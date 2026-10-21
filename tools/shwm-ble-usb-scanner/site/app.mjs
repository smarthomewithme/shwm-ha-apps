import { normalizeAdvertisement, decodeLC026, parseLine, toTheengs, espHomeScaleYAML, BOARD_CATALOG, getBoard, summarizeDecoded } from './core.mjs';

const $ = selector => document.querySelector(selector);
const byMac = new Map();
let port=null, reader=null, stop=false, moduleDecoder=null, selected='', packetCount=0, pendingRender=null;
let flashCheckSeq=0, lastShownMac='', lastSelectionStatus='';
let sample={type:'adv',mac:'AA:BB:CC:DD:EE:FF',rssi:-73,name:'',
  manufacturerdata:'C022221A17700A0125AABBCCDDEEFF',manufacturerpayload:'221A17700A0125AABBCCDDEEFF',manufacturerid:'0x22C0',servicedata:'',servicedatauuid:''};
const status=(str, kind='info')=>{$('#status').textContent=str;$('#status').dataset.kind=kind;};
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const setLiveButton=(live)=>{$('#connect').textContent=live?'Disconnect USB':'Connect and scan live';};

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
 if(!items.length){host.innerHTML='<tr><td colspan="6">No matching devices yet. Connect USB and wake up your BLE sensor, or disable the recognized-only filter.</td></tr>';return;}
 host.innerHTML=items.map(item=>{
  const x=item.frame;
  const summary=summarizeDecoded(item.theengs,item.lc);
  const last=item.updated.toLocaleTimeString();
  return `<tr><td><button type="button" data-mac="${escape(x.mac)}">${escape(x.mac)}</button></td>`+
    `<td>${escape(x.name||'—')}</td><td>${escape(x.rssi)}</td><td>${escape(summary)}</td><td>${item.count}</td><td>${escape(last)}</td></tr>`;
 }).join('');
 [...host.querySelectorAll('[data-mac]')].forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.mac;showSelection();}));
 if(selected)showSelection();
}
$('#recognized-only').addEventListener('change',render);
function showSelection(){const r=byMac.get(selected);if(!r)return;
 $('#selected').textContent=`Device: ${selected} | RSSI ${r.frame.rssi}`;
 $('#raw').textContent=JSON.stringify(r.frame,null,2);
 $('#decoded').textContent=JSON.stringify({shwm_lc026:r.lc,theengs:r.theengs},null,2);
 $('#make-yaml').disabled=!(r.lc&&r.lc.stable);
 if(lastShownMac!==selected){ $('#yaml').value=''; lastShownMac=selected; }
 const state=r.lc?(r.lc.stable?'lc-stable':'lc-pending'):(r.theengs?'theengs':'unknown');
 if(state===lastSelectionStatus)return;
 lastSelectionStatus=state;
 if(r.theengs&&!r.lc)status('Recognized via Theengs; this profile does not yet have a verified ESPHome YAML generator.','warn');
 else if(r.lc&&!r.lc.stable)status('LC026 detected. Wait for stable measurement before creating YAML.','warn');
 else if(r.lc)status('Stable LC026 found. Generate ESPHome YAML.','ok');
 else status('RAW captured but no verified decoder. Do not guess values.','warn');
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
async function connectSerial(){
 if(reader){stop=true;try{await reader.cancel()}catch{};return;}
 if(!window.isSecureContext||!('serial' in navigator)){status('Web Serial unavailable. Open HTTPS in Chrome or Edge on a desktop computer.','warn');return;}
 try{
  port=await navigator.serial.requestPort();await port.open({baudRate:115200});stop=false;
  setLiveButton(true);status('USB connected. Scanner must already be installed. Wake your BLE device.','ok');
  const decoder=new TextDecoder();let buffer='';reader=port.readable.getReader();
  while(!stop){let {value,done}=await reader.read();if(done)break;
   buffer+=decoder.decode(value,{stream:true});
   if(buffer.length>100000){buffer='';status('USB stream overflow; input buffer reset.','warn');}
   const lines=buffer.split(/\r?\n/);buffer=lines.pop()||'';
   for(const line of lines){if(!line.trim()||line.length>4000)continue;const obj=parseLine(line);if(obj?.hello){status('SHWM BLE Scanner detected. Scan running.','ok');continue;}if(obj)addLines(line);}
  }
 }catch(err){status(`USB error: ${err.message||err}`, 'warn');}
 finally{
  if(reader){try{reader.releaseLock()}catch{}reader=null}
  if(port){try{await port.close()}catch{}port=null}
  stop=false;setLiveButton(false);
 }
}
$('#connect').addEventListener('click',connectSerial);
$('#demo').addEventListener('click',()=>{accept(sample);status('Example LC026 frame loaded (simulation, not live USB data).','ok');});
$('#import').addEventListener('click',()=>{let n=parseTextInput($('#capture').value);status(`${n} JSONL packets imported.`);});
$('#make-yaml').addEventListener('click',()=>{const d=byMac.get(selected);
 if(!d?.lc?.stable)return;$('#yaml').value=espHomeScaleYAML(selected,$('#board').value);
 status('ESPHome YAML generated (LC026 profile). Validate and COMPILE it in ESPHome Device Builder.','ok');
});
$('#copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('#yaml').value);status('YAML copied.','ok')}catch{status('Select YAML and press Ctrl+C to copy.','warn')}});
$('#download').addEventListener('click',()=>{const text=$('#yaml').value;if(!text)return;
 const u=URL.createObjectURL(new Blob([text],{type:'text/yaml;charset=utf-8'}));const a=document.createElement('a');a.href=u;a.download='shwm-lc026-final-esphome.yaml';a.click();setTimeout(()=>URL.revokeObjectURL(u),3000);
});
// Board choices are intentionally restricted to models compiled by the isolated CI build.
// Separate manifests prevent ESP Web Tools silently picking the wrong board within one chip family.
function initializeBoardSelectors(){
 const options=BOARD_CATALOG.map(b=>`<option value="${b.id}">${escape(b.label)}</option>`).join('');
 $('#install-board').innerHTML=options;
 $('#board').innerHTML=options;
 $('#install-board').addEventListener('change',()=>{
   $('#board').value=$('#install-board').value;
   updateBoardWarning();
   void verifySelectedFirmware();
 });
 $('#board').addEventListener('change',()=>{
   $('#board-note').textContent='Final ESPHome target: '+(getBoard($('#board').value)?.label||'unsupported board')+
      '. Flashing the final ESPHome firmware replaces your temporary USB scanner.';
   if($('#yaml').value && selected && byMac.get(selected)?.lc?.stable)
      $('#yaml').value=espHomeScaleYAML(selected,$('#board').value);
 });
 updateBoardWarning();
}
function updateBoardWarning(){
 const b=getBoard($('#install-board').value);
 $('#board-warning').textContent=b
   ? 'Selected '+b.label+' ('+b.chipFamily+', '+b.usb+'). IMPORTANT: confirm the correct USB port. Installing a scanner REPLACES any existing firmware.'
   : 'Choose an explicitly supported board first.';
 $('#board-note').textContent='Final ESPHome target: '+(getBoard($('#board').value)?.label||'not selected');
}
async function verifySelectedFirmware(){
 const seq=++flashCheckSeq;
 const b=getBoard($('#install-board').value);
 const wrapper=$('#install-wrapper');
 wrapper.hidden=true;
 if(!b){$('#firmware-notice').textContent='Unsupported board.';return;}
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
   if(seq!==flashCheckSeq)return;
   wrapper.hidden=false;
   $('#firmware-notice').textContent='Ready: precompiled BLE scanner for '+b.label+'. Verify the model before installing.';
 }catch(err){
   if(seq!==flashCheckSeq)return;
   $('#firmware-notice').textContent='Installer disabled: '+String(err.message||err)+'. Run the CI build and deploy its exact firmware files first.';
 }
}
initializeBoardSelectors();
void verifySelectedFirmware();
initTheengs();
render();
