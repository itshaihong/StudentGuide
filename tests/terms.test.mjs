import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {abbreviationsIn} from '../assets/js/learning/terms.mjs';
const terms=JSON.parse(fs.readFileSync(new URL('../_data/terms.json',import.meta.url)));
test('abbreviation notes recognize separate block labels and do not require preferred glossary terms',()=>{
 const found=abbreviationsIn(['Reset experiment','XSA contents','Inspect','Platform / BSP','Inspect','ELF hardware input'],terms);
 assert.deepEqual(found.map(t=>t.expansion),['Xilinx Shell Archive','Board Support Package','Executable and Linkable Format']);
 assert.deepEqual(abbreviationsIn(['PS','Processing System','PL'],terms).map(t=>t.expansion),['Programmable Logic']);
 assert.deepEqual(abbreviationsIn(['DISPLAY','HELFLABEL'],terms),[]);
});
