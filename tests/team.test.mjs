import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {createTeam,preparedTeam,teamAction,threeWay,createConflict,resolveConflict,checkConflict,finishConflict} from '../assets/js/modules/git-team/model.mjs';

test('a teammate push and a fetch do not replace the feature working state',()=>{
  const initial=preparedTeam();
  assert.equal(initial.remoteMain,'c');assert.equal(initial.trackingMain,'a');assert.equal(initial.feature,'b');
  const fetched=teamAction(initial,'fetch').state;
  assert.equal(fetched.trackingMain,'c');assert.equal(fetched.feature,'b');assert.equal(fetched.main,'a');
  assert.deepEqual(fetched.commits.b.files,{statusReport:true,samplerSafe:false});
  assert.equal(initial.trackingMain,'a');
});
test('diverged histories reject a fast-forward and preserve both branches',()=>{
  const s=teamAction(preparedTeam(),'fetch').state;
  const result=teamAction(s,'ff-only');assert.equal(result.ok,false);assert.deepEqual(result.state,s);
});
test('a three-way merge combines independent changes and records both parents',()=>{
  const s=preparedTeam(true);
  assert.deepEqual(s.commits.m.parents,['b','c']);
  assert.deepEqual(s.commits.m.files,{statusReport:true,samplerSafe:true});
  assert.equal(s.main,'a');assert.equal(s.remoteMain,'c');
});
test('both changing the same scalar differently needs a conflict decision',()=>{
  const merged=threeWay({interval:1000},{interval:500},{interval:250});
  assert.deepEqual(merged.conflicts,['interval']);
  assert.equal(Object.hasOwn(merged.files,'interval'),false);
});
test('a clean-looking one-side resolution fails the behavioral requirements',()=>{
  for(const side of ['ours','theirs']){
    const checked=checkConflict(resolveConflict(createConflict(),side));
    assert.equal(checked.ok,false);assert.equal(finishConflict(checked.state).ok,false);
  }
  const correct=checkConflict(resolveConflict(createConflict(),'split'));
  assert.equal(correct.ok,true);assert.equal(finishConflict(correct.state).state.committed,true);
});
test('sharing a handoff requires tests on the integrated revision',()=>{
  assert.equal(teamAction(preparedTeam(),'test').ok,false);
  assert.equal(teamAction(preparedTeam(true),'push').ok,false);
  const checked=teamAction(preparedTeam(true),'test').state;
  assert.equal(teamAction(checked,'push').state.sharedFeature,'m');
});
test('independent-file integration and its two parents agree with real Git',()=>{
  const dir=mkdtempSync(join(tmpdir(),'studentguide-team-'));
  const git=(...args)=>execFileSync('git',['-c','core.hooksPath=/dev/null','-c','commit.gpgsign=false','-c','user.name=StudentGuide Test','-c','user.email=test@example.invalid',...args],{cwd:dir,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
  try{
    git('init','-b','main');writeFileSync(join(dir,'status.txt'),'basic\n');writeFileSync(join(dir,'sampler.txt'),'old\n');git('add','.');git('commit','-m','Base');
    git('switch','-c','feature/status');writeFileSync(join(dir,'status.txt'),'structured\n');git('commit','-am','Status report');
    git('switch','main');writeFileSync(join(dir,'sampler.txt'),'safe\n');git('commit','-am','Sampler fix');
    git('switch','feature/status');git('merge','main','--no-edit');
    assert.equal(git('show','HEAD:status.txt'),'structured');assert.equal(git('show','HEAD:sampler.txt'),'safe');
    assert.equal(git('show','-s','--format=%P','HEAD').split(' ').length,2);
  }finally{rmSync(dir,{recursive:true,force:true});}
});
