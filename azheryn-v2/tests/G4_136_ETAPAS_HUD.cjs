const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const view=fs.readFileSync(path.join(__dirname,'../src/ui/WorldView.tsx'),'utf8');
const css=fs.readFileSync(path.join(__dirname,'../src/index.css'),'utf8');
test('HUD muestra porcentaje calculado desde troncos instalados y meta oficial',()=>{assert.match(view,/Math\.round\(100 \* Math\.min\(STOREHOUSE_G1\.logsRequired/);assert.match(view,/buildingProgress\.committed\}\/\{STOREHOUSE_G1\.logsRequired\}/)});
test('HUD diferencia visualmente paredes, techo y almacén completo',()=>{assert.match(view,/buildingProgress\.committed >= 66/);for(const stage of ['walls','roof','complete'])assert.match(css,new RegExp('strategy-progress-'+stage+' progress'))});
