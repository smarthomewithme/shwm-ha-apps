import { normalizeAdvertisement, decodeLC026, parseLine, toTheengs, espHomeScaleYAML } from './core.mjs';

const $ = selector => document.querySelector(selector);
const byMac = new Map();
let port=null, reader=null, stop=false, moduleDecoder=null, selected='';
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
  const previous=byMac.get(frame.mac); const lc=decodeLC026(frame); const theengs=decodeWithTheengs(frame);
  const record={frame,count:(previous?.count||0)+1,lc:lc||previous?.lc||null,
   theengs:theengs||previous?.theengs||null,updated:new Date()};
  if(byMac.size>=150&&!byMac.has(frame.mac))byMac.delete(byMac.keys().next().value);
  byMac.set(frame.mac,record);
  render();
}
function render(){
 const host=$('#devices');
 if(!byMac.size){host.innerHTML='<tr><td colspan="5">No devices yet. Install the scanner, connect USB, then wake up a BLE sensor.</td></tr>';return;}
 const items=[...byMac.values()].sort((a,b)=>b.updated-a.updated);
 host.innerHTML=items.map(item=>{
  const x=item.frame,decoded=item.lc?`${item.lc.weight_kg.toFixed(2)} kg ${item.lc.stable?'(stable)':'(changing)'}`:
  item.theengs?`${escape(item.theengs.model||item.theengs.model_id||item.theengs.brand||'Theengs recognized')}`:'Unrecognized RAW';
  return `<tr><td><button type="button" data-mac="${escape(x.mac)}">${escape(x.mac)}</button></td>`+
    `<td>${escape(x.name||'—')}</td><td>${escape(x.rssi)}</td><td>${escape(decoded)}</td><td>${item.count}</td></tr>`;
 }).join('');
 [...host.querySelectorAll('[data-mac]')].forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.mac;showSelection();}));
 if(selected)showSelection();
}
function showSelection(){const r=byMac.get(selected);if(!r)return;
 $('#selected').textContent=`Device: ${selected} | RSSI ${r.frame.rssi}`;
 $('#raw').textContent=JSON.stringify(r.frame,null,2);
 $('#decoded').textContent=JSON.stringify({shwm_lc026:r.lc,theengs:r.theengs},null,2);
 $('#make-yaml').disabled=!(r.lc&&r.lc.stable);
 $('#yaml').value='';
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
$('#firmware-notice').textContent='The scanner installer is available only after two firmware builds are generated and hosted under /firmware/bin/. Do NOT flash an arbitrary .bin file.';
fetch('./firmware/manifest.json',{cache:'no-cache'}).then(r=>r.json()).then(async manifest=>{
 const parts=manifest.builds.flatMap(x=>x.parts);
 const checks=await Promise.all(parts.map(async x=>{
   const res=await fetch(new URL(x.path, new URL('./firmware/', location.href)).href,{method:'HEAD'});
   return res.ok && Number(res.headers.get('content-length')||0)>100000;
 }));
 if(checks.every(Boolean)){document.querySelector('#install-wrapper').hidden=false;
  $('#firmware-notice').textContent='Firmware images found. Click Install BLE Scanner, then reconnect USB in Step 2.';
 } else {$('#firmware-notice').textContent='Scanner binaries not deployed yet. Installer is disabled until verified builds are hosted.';}
}).catch(()=>{$('#firmware-notice').textContent='Scanner binaries not deployed yet. Install step unavailable.'});
initTheengs();render();