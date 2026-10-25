import test from 'node:test';
import assert from 'node:assert/strict';
import {promptParts,checkPrompt,acceptsCount,createReview,reviewAction,reviewReady,preparedReview} from '../assets/js/modules/github-ai/model.mjs';

test('bounded AI context rejects secret material and irrelevant broad scope',()=>{
  const required=promptParts.filter(p=>p.required).map(p=>p.id);
  assert.equal(checkPrompt(required).ok,true);
  assert.equal(checkPrompt([...required,'secrets']).ok,false);
  assert.equal(checkPrompt([...required,'rewrite']).ok,false);
  assert.equal(checkPrompt(required.slice(1)).ok,false);
});
test('a passing weak test does not satisfy a boundary-sensitive review',()=>{
  const weak=reviewAction(createReview(),'ci').state;
  assert.equal(weak.ci.ok,true);assert.equal(reviewReady(weak),false);
  assert.equal(reviewAction(weak,'approve').ok,false);
});
test('independent boundary checks expose the exclusive-upper-bound defect',()=>{
  let s=reviewAction(createReview(),'boundaries').state;s=reviewAction(s,'ci').state;
  assert.equal(s.ci.ok,false);
  assert.deepEqual(s.ci.cases.filter(c=>c.expected!==c.actual).map(c=>c.value),[10]);
  assert.equal(acceptsCount(1,true),true);assert.equal(acceptsCount(10,true),true);
  for(const value of [0,11,1.5,NaN])assert.equal(acceptsCount(value,true),false);
});
test('a patch leaves old CI and review evidence visibly stale',()=>{
  const checked=preparedReview();assert.equal(reviewReady(checked),true);
  const edited=reviewAction(checked,'docs').state;
  assert.equal(edited.ci.revision,checked.revision);assert.equal(edited.revision,checked.revision+1);
  assert.equal(reviewReady(edited),false);assert.equal(reviewAction(edited,'merge').ok,false);
  const ci=reviewAction(edited,'ci').state;assert.equal(reviewAction(ci,'merge').ok,false);
  const approved=reviewAction(ci,'approve').state;assert.equal(reviewAction(approved,'merge').ok,true);
});
test('release identity must point to the intended merged revision',()=>{
  const merged=reviewAction(preparedReview(),'merge').state;
  assert.equal(reviewAction(merged,'tag',1).ok,false);assert.equal(reviewAction(merged,'release').ok,false);
  const tagged=reviewAction(merged,'tag',merged.merged).state;
  assert.equal(reviewAction(tagged,'release').state.released,true);
  assert.equal(merged.tagged,null);
});
