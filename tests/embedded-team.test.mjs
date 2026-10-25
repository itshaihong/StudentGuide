import test from 'node:test';
import assert from 'node:assert/strict';
import {createContract,contractAction,createDiagnosis,inspectDiagnosis,repairDiagnosis,diagnosticCases,createDelivery,deliveryAction} from '../assets/js/modules/embedded-team/model.mjs';

test('a v2 filename cannot make stale hardware support acceptable',()=>{
  const initial=createContract();assert.equal(contractAction(initial,'accept').ok,false);
  let state=contractAction(initial,'inspect').state;
  state=contractAction(state,'build').state;assert.equal(contractAction(state,'accept').ok,false);
  for(const action of ['select-xsa','platform','build','accept']){const result=contractAction(state,action);assert.equal(result.ok,true);state=result.state;}
  assert.equal(state.accepted,true);assert.equal(initial.pipeline.xsa,1);
});
test('diagnosis requires relevant observations rather than an unexplained lucky action',()=>{
  assert.equal(repairDiagnosis(createDiagnosis(0),'build').ok,false);
  let state=inspectDiagnosis(createDiagnosis(0),'source');state=inspectDiagnosis(state,'host');
  assert.equal(repairDiagnosis(state,'load').ok,false);
  const fixed=repairDiagnosis(state,'build');assert.equal(fixed.ok,true);
  assert.equal(fixed.state.values.host,2);assert.equal(fixed.state.values.memory,1);
});
test('loaded-state and power-on failures use different observations and repairs',()=>{
  for(const index of [1,2]){
    let state=createDiagnosis(index);
    for(const layer of diagnosticCases[index].needed)state=inspectDiagnosis(state,layer);
    assert.equal(repairDiagnosis(state,index===1?'boot':'load').ok,false);
    const result=repairDiagnosis(state,diagnosticCases[index].repair);
    assert.equal(result.ok,true);assert.equal(result.state.values.memory,2);
  }
});
test('a clean rebuild exposes stale maintained configuration despite current local output',()=>{
  const initial=createDelivery();assert.equal(initial.bsp,2);
  const clean=deliveryAction(initial,'clean').state;
  assert.equal(clean.bsp,1);assert.equal(clean.elf,1);assert.equal(deliveryAction(clean,'validate').ok,false);
  assert.equal(initial.bsp,2);
});
test('a delivery needs reproducible inputs and honest verification limits',()=>{
  let s=createDelivery();
  for(const action of ['configure','clean','sources','environment','claim-boot'])s=deliveryAction(s,action).state;
  assert.equal(deliveryAction(s,'validate').ok,false);
  s=deliveryAction(s,'evidence').state;
  assert.equal(deliveryAction(s,'validate').state.ready,true);
  const edited=deliveryAction(s,'configure').state;
  assert.equal(deliveryAction(edited,'validate').ok,false);
});
