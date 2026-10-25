import test from 'node:test';
import assert from 'node:assert/strict';
import {createPipeline,transition,status,compatible} from '../assets/js/modules/zynq-7000/model.mjs';
const apply=(s,...actions)=>actions.reduce((state,action)=>transition(state,action).state,s);

test('application-only edits leave the hardware artifacts current',()=>{
  const initial=createPipeline();
  const edited=apply(initial,'edit-app');
  assert.equal(initial.source,1);
  assert.equal(edited.source,2);
  assert.equal(status(edited).xsa,true);
  assert.equal(status(edited).bitstream,true);
  assert.equal(status(edited).elf,false);
  assert.equal(status(edited).running,false);
  const built=apply(edited,'build-app');
  assert.equal(status(built).elf,true);
  assert.equal(status(built).running,false);
  assert.equal(status(apply(built,'load')).running,true);
});
test('rebuilding against an old BSP preserves the hardware mismatch',()=>{
  const state=apply(createPipeline(),'edit-hardware','build-app','bitstream','load');
  assert.equal(state.elf.hardware,1);
  assert.equal(state.bitstream,2);
  assert.equal(status(state).running,false);
  assert.equal(compatible(state),false);
});
test('updating a platform does not silently rebuild an existing ELF or load the board',()=>{
  const state=apply(createPipeline(),'edit-hardware','export-xsa','platform');
  assert.equal(state.bsp,2);
  assert.equal(state.elf.hardware,1);
  assert.equal(status(state).elf,false);
  assert.equal(status(state).running,false);
});
test('the hardware-change repair chain produces aligned artifacts and a separate load step',()=>{
  const state=apply(createPipeline(),'edit-hardware','export-xsa','platform','build-app','bitstream');
  assert.equal(compatible(state),true);
  assert.equal(status(state).running,false);
  const loaded=apply(state,'load');
  assert.equal(status(loaded).running,true);
  assert.equal(status(loaded).boot,false);
});
test('JTAG-loaded application disappears on power cycle until boot setup is updated',()=>{
  const loaded=apply(createPipeline(),'edit-app','build-app','load');
  assert.equal(loaded.running.source,2);
  const powered=apply(loaded,'power');
  assert.equal(powered.running.source,1);
  assert.equal(powered.elf.source,2);
  const installed=apply(powered,'package','power');
  assert.equal(installed.running.source,2);
  assert.equal(status(installed).boot,true);
});
test('boot packaging rejects inconsistent host artifacts without mutating state',()=>{
  const bad=apply(createPipeline(),'edit-hardware','build-app');
  const result=transition(bad,'package');
  assert.equal(result.ok,false);
  assert.deepEqual(result.state,bad);
  assert.equal(result.state.boot.hardware,1);
});
