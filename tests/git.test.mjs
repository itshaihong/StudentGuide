import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {files,createGit,preparedGit,stage,unstage,editBlink,check,commit,push,branch,changes} from '../assets/js/modules/git/model.mjs';

test('staging captures selected content without changing working files or the original state',()=>{
  const initial=createGit();
  const staged=stage(initial,['blink']);
  assert.equal(staged.index.blink,initial.working.blink);
  assert.deepEqual(staged.working,initial.working);
  assert.equal(initial.index.blink,files[0].before);
  assert.equal(staged.index.readme,initial.head.readme);
  assert.deepEqual(changes(staged).map(f=>f.id),['blink']);
});
test('a later edit stays outside an existing staged snapshot',()=>{
  const edited=editBlink(preparedGit());
  assert.match(edited.working.blink,/250/);
  assert.match(edited.index.blink,/500/);
  assert.match(stage(edited,['blink']).index.blink,/250/);
});
test('unstaging preserves the later working edit',()=>{
  const state=unstage(editBlink(preparedGit()),'blink');
  assert.match(state.index.blink,/1000/);
  assert.match(state.working.blink,/250/);
});
test('the scenario check rejects unrelated edits and mismatched implementation and test',()=>{
  assert.equal(check(stage(createGit(),files.map(f=>f.id))).ok,false);
  assert.equal(check(stage(editBlink(preparedGit()),['blink'])).ok,false);
  assert.equal(check(preparedGit()).ok,true);
});
test('commits require a checked snapshot; restaging invalidates the check',()=>{
  assert.equal(commit(preparedGit()).ok,false);
  const checked=check(preparedGit()).state;
  assert.equal(commit(stage(checked,['readme'])).ok,false);
});
test('commit records index contents while later working edits and remote remain separate',()=>{
  const checked=check(preparedGit()).state;
  const result=commit(editBlink(checked));
  assert.equal(result.ok,true);
  assert.match(result.state.head.blink,/500/);
  assert.match(result.state.working.blink,/250/);
  assert.equal(result.state.remote,1);
  assert.equal(result.state.commits.length,2);
  assert.equal(changes(result.state).length,0);
  const shared=push(branch(result.state));
  assert.equal(shared.remote,2);
  assert.equal(shared.branch,'experiment/led-interval');
  assert.match(shared.commits[1].snapshot.blink,/500/);
});
test('the key snapshot behavior agrees with real Git in an isolated repository',()=>{
  const dir=mkdtempSync(join(tmpdir(),'studentguide-git-'));
  const git=(...args)=>execFileSync('git',['-c','core.hooksPath=/dev/null','-c','commit.gpgsign=false','-c','user.name=StudentGuide Test','-c','user.email=test@example.invalid',...args],{cwd:dir,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
  try {
    git('init');writeFileSync(join(dir,'blink.c'),'1000\n');git('add','blink.c');git('commit','-m','Initial');
    writeFileSync(join(dir,'blink.c'),'500\n');git('add','blink.c');writeFileSync(join(dir,'blink.c'),'250\n');
    assert.equal(git('show',':blink.c'),'500');
    git('commit','-m','Change interval');
    assert.equal(git('show','HEAD:blink.c'),'500');
    assert.match(git('diff'),/\+250/);
  } finally {rmSync(dir,{recursive:true,force:true});}
});
