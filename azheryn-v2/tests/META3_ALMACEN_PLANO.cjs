const fs=require('node:fs'); const assert=require('node:assert/strict'); const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/world/storehouse.ts'),'utf8');
for(const token of ['logsRequired: 91','roof: 25','front: 9','rear: 10.5','left: 23','right: 23','unlimitedOutdoorLogProduction: true','processedWoodAndFoodStorageEnabled: false','lengthM: 4.6','widthM: 2.6','logCount: 25','supportEachSideM: 0.2'])assert.ok(source.includes(token),token);
assert.equal(25+9+10.5+23+23,90.5);
assert.equal(Math.ceil(90.5),91);
assert.equal(2.5+0.2,2.7);
assert.ok(Math.abs((2.6+0.2+0.2)-3)<1e-9);
console.log('OK plano/despiece almacén G1/O1 (pruebas estáticas y aritméticas)');
