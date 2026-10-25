import test from 'node:test';
import assert from 'node:assert/strict';
import {createExecution,executionAction,outputOf} from '../assets/js/modules/zynq-7000/execution-model.mjs';
const apply=(s,...actions)=>actions.reduce((state,a)=>executionAction(state,a).state,s);
test('CPU software runs locally but cannot write a missing PL peripheral',()=>{
 const initial=createExecution();const s=apply(initial,'load','step');
 assert.equal(s.request,1);assert.equal(s.control,0);assert.equal(s.configured,false);assert.equal(outputOf(s),null);
 const blocked=executionAction(s,'step');assert.equal(blocked.ok,false);assert.deepEqual(blocked.state,s);assert.equal(initial.loaded,false);
});
test('configuration creates the circuit without executing the CPU program',()=>{
 const s=apply(createExecution(),'configure');assert.equal(s.steps,0);assert.equal(s.loaded,false);assert.equal(outputOf(s),0);
 const written=apply(s,'load','step','step');assert.equal(written.control,1);assert.equal(outputOf(written),1);
});
test('configured combinational logic responds to its input while CPU stays paused',()=>{
 const s=apply(createExecution(),'load','configure','step','step');const changed=apply(s,'toggle');
 assert.equal(outputOf(changed),0);assert.equal(changed.pc,2);assert.equal(changed.steps,s.steps);assert.equal(changed.control,1);
 assert.equal(outputOf(apply(changed,'toggle')),1);assert.equal(executionAction(changed,'step').ok,false);
});
