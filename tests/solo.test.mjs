import test from 'node:test';
import assert from 'node:assert/strict';
import {createSolo,soloAction} from '../assets/js/modules/git-solo/model.mjs';
test('initialization creates management state without recording a snapshot',()=>{
  const original=createSolo(),result=soloAction(original,'init').state;
  assert.equal(result.initialized,true);assert.equal(result.commits.length,0);assert.equal(result.index,null);
  assert.deepEqual(result.working,original.working);assert.equal(original.initialized,false);
});
test('a recorded solo baseline stays separate from a later working edit',()=>{
  let s=createSolo();
  assert.equal(soloAction(s,'commit').ok,false);
  for(const action of ['init','stage','commit','edit'])s=soloAction(s,action).state;
  assert.match(s.working.source,/500/);assert.match(s.index.source,/1000/);assert.match(s.commits[0].snapshot.source,/1000/);
});
