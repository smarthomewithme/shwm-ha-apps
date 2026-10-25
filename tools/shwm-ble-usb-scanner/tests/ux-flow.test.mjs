import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../site/index.html',import.meta.url),'utf8');
const js=readFileSync(new URL('../site/app.mjs',import.meta.url),'utf8');
const firmware=readFileSync(new URL('../scanner/src/main.cpp',import.meta.url),'utf8');
test('one board selector supplies both scanner and YAML',()=>{assert.equal((html.match(/id="board"/g)||[]).length,1);assert.equal((html.match(/id="install-board"/g)||[]).length,0);assert.doesNotMatch(js,/['"]#install-board['"]/);assert.match(js,/getBoard\(\$\('#board'\)\.value\)/);});
test('RAW and Decoded are technical read-only previews, not paste targets',()=>{assert.match(html,/<details><summary>Advanced: original data \(RAW\) and decoded details/);assert.match(html,/you do not paste anything between them/);assert.equal((html.match(/id="capture"/g)||[]).length,1);});
test('live BLE scanning uses a verified scanner firmware instead of example data',()=>{
 assert.match(html,/id="connect">Scan nearby BLE<\/button>/);
 assert.doesNotMatch(html,/id="demo"|Try LC026 example/);
 assert.match(js,/sendSerialCommand\('SCAN'\)/);
 assert.match(js,/obj\.firmware!=='SHWM BLE USB Scanner'/);
 assert.match(js,/if\(frame&&!frame\.hello\)/);
 assert.match(js,/if\(!selected && lc\?\.stable\) selected=frame\.mac/);
 assert.match(js,/if\(!d\?\.lc\?\.stable\|\|!b\)/);
 assert.match(html,/only the independently validated LC026 scale profile/i);
});
test('copy and download are disabled before generation',()=>{assert.match(html,/id="copy" disabled/);assert.match(html,/id="download" disabled/);assert.match(js,/\$\('#copy'\)\.disabled=false/);});

test('firmware starts scanning only on SCAN and responds with scan-state JSON',()=>{
 assert.match(firmware,/strcmp\(command, "SCAN"\) == 0/);
 assert.match(firmware,/scanRequested = true/);
 assert.match(firmware,/strcmp\(command, "STOP"\) == 0/);
 assert.match(firmware,/scanRequested = false/);
 assert.match(firmware,/scan_state/);
});
