import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeAdvertisement, decodeLC026, espHomeScaleYAML, parseLine,toTheengs,BOARD_CATALOG,getBoard,summarizeDecoded} from '../site/core.mjs';
const frame={type:'adv',mac:'AA:BB:CC:DD:EE:FF',rssi:-80,manufacturerdata:'C022221A17700A0125AABBCCDDEEFF',manufacturerpayload:'221A17700A0125AABBCCDDEEFF',manufacturerid:'0x22C0'};
test('scanner JSONL is parsed',()=>{const r=parseLine(JSON.stringify(frame));assert.equal(r.mac,frame.mac);assert.equal(r.manufacturerid,'0X22C0')});
test('stable LC026 87.30 kg',()=>{const w=decodeLC026(normalizeAdvertisement(frame));assert.equal(w.weight_kg,87.30);assert.equal(w.stable,true)});
test('unknown packet remains unknown',()=>{const w=decodeLC026(normalizeAdvertisement({...frame,manufacturerpayload:'01020304'}));assert.equal(w,null)});
test('MAC spoofing not accepted',()=>{const w=decodeLC026(normalizeAdvertisement({...frame,mac:'AA:BB:CC:DD:EE:00'}));assert.equal(w,null)});
test('unstable flags not stable',()=>{const w=decodeLC026(normalizeAdvertisement({...frame,manufacturerpayload:'221A17700A0124AABBCCDDEEFF'}));assert.equal(w.stable,false)});
test('Theengs canonical JSON payload fields',()=>{const v=toTheengs(normalizeAdvertisement(frame));assert.equal(v.manufacturerdata,'C022221A17700A0125AABBCCDDEEFF');assert.equal(v.id,frame.mac)});
test('YAML full output has correct MAC, OTA and secrets and selects actual board',()=>{const y=espHomeScaleYAML(frame.mac,'seeed_xiao_esp32c3');assert.match(y,/board: seeed_xiao_esp32c3/);assert.match(y,/AA:BB:CC:DD:EE:FF/);assert.match(y,/!secret wifi_password/);assert.match(y,/ota:/)});
test('board/MAC injection rejected',()=>{assert.throws(()=>espHomeScaleYAML('DROP;TABLES'));assert.throws(()=>espHomeScaleYAML(frame.mac,'strange_board'))});
test('six supported board families are BLE-capable ESP32 targets',()=>{
  assert.equal(BOARD_CATALOG.length,6);
  assert.equal(new Set(BOARD_CATALOG.map(x=>x.id)).size,6);
  assert.deepEqual(new Set(BOARD_CATALOG.map(x=>x.chipFamily)),new Set(['ESP32','ESP32-C3','ESP32-S3']));
  assert.equal(getBoard('esp32-s3-devkitc-1').chipFamily,'ESP32-S3');
  assert.equal(getBoard('esp32-s2-saola-1'),null);
});
test('every supported board generates its own ESPHome YAML header',()=>{
  for (const board of BOARD_CATALOG){
    const y=espHomeScaleYAML(frame.mac,board.id);
    assert.match(y,new RegExp('board: '+board.id.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  }
});
test('known Theengs readings show real measurements and units',()=>{
  const summary=summarizeDecoded({model:'Qingping CGG1',tempc:22.4,hum:52,batt:89},null);
  assert.match(summary,/22.4 °C/);assert.match(summary,/52 % RH/);
  assert.match(summary,/89 % battery/);
  assert.equal(summarizeDecoded(null,null),'Unrecognized RAW');
});
test('LC026 stable summary overrides generic Theengs guess',()=>{
  const reading=decodeLC026(normalizeAdvertisement(frame));
  assert.match(summarizeDecoded({model:'Other'},reading),/87.30 kg · stable/);
});
