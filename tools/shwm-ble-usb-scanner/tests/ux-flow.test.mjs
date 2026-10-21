import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../site/index.html',import.meta.url),'utf8');
const js=readFileSync(new URL('../site/app.mjs',import.meta.url),'utf8');
test('one board selector supplies both scanner and YAML',()=>{assert.equal((html.match(/id="board"/g)||[]).length,1);assert.equal((html.match(/id="install-board"/g)||[]).length,0);assert.doesNotMatch(js,/['"]#install-board['"]/);assert.match(js,/getBoard\(\$\('#board'\)\.value\)/);});
test('RAW and Decoded are technical read-only previews, not paste targets',()=>{assert.match(html,/<details><summary>Advanced: original data \(RAW\) and decoded details/);assert.match(html,/you do not paste anything between them/);assert.equal((html.match(/id="capture"/g)||[]).length,1);});
test('example auto-selects verified LC026; other BLE profiles do not get generated YAML',()=>{assert.match(js,/if\(!selected && lc\?\.stable\) selected=frame\.mac/);assert.match(js,/if\(!d\?\.lc\?\.stable\|\|!b\)/);assert.match(html,/only the independently validated LC026 scale profile/i);});
test('copy and download are disabled before generation',()=>{assert.match(html,/id="copy" disabled/);assert.match(html,/id="download" disabled/);assert.match(js,/\$\('#copy'\)\.disabled=false/);});
