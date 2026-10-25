import {button,lab,heading,question,bindQuiz,preserveFocus,reflection,escape} from '../../learning/ui.mjs';
import {files,createGit,preparedGit,stage,unstage,editBlink,check,commit,push,branch,changes} from './model.mjs';

export function mount(chapter,root,api) {
  if(chapter===0) return workspace(root,api);
  if(chapter===1) return review(root,api);
  if(chapter===2) return snapshot(root,api);
  if(chapter===3) return checkpoint(root,api);
  return recovery(root,api);
}
function workspace(root,api) {
  let inspected=false;
  function draw() {
    preserveFocus(root,heading('First, find your feet.','An AI can edit a local folder, a cloud workspace, or a different clone. Before reviewing its work, establish which copy you are looking at.')+
      lab('YOUR STARTING POINT',`<p>You asked an AI in your laptop editor to change an LED interval from 1000 ms to 500 ms. This is a synthetic teaching project.</p><div class="terminal" data-state="workspace-status"><span class="muted">Current computer</span>  my-laptop\n<span class="muted">Current folder</span>    ~/projects/led-lab\n<span class="muted">Remote</span>            example.invalid/team/led-lab.git\n\n<span class="prompt">$</span> ${inspected ? 'git status\nOn branch main\n\nChanges not staged:\n  modified: src/blink.c\n  modified: tests/blink_test.c\n  modified: README.md\n\nUntracked files:\n  build/blink.elf\n  local-secret.example.txt' : '▌'}</div><div class="lab-actions">${button('inspect-status','Inspect git status','primary')}</div>`,false)+
      question('workspace','Which copy contains the working changes shown here?',['The clone at ~/projects/led-lab on my-laptop.','Every clone connected to this remote, immediately.','Only the repository stored on the remote server.'])+
      '<div class="callout"><strong>Three places, three jobs.</strong> The working files are what your editor changes. Local Git data lives in .git/. A remote is another repository. Sharing a commit does not silently update someone else’s working files.</div>');
    root.querySelector('#inspect-status').onclick=()=>{inspected=true;draw();api.feedback('These are changes in this clone. Modified does not mean staged, committed, or shared.','info');};
    bindQuiz(root,'workspace',0,["Yes. The path and computer identify this clone. You can now inspect its changes.","A clone has its own working files and local history. Other clones need their own fetch or integration steps.","A remote repository does not contain this editor's uncommitted working changes."],api,ok=>{if(ok&&inspected)api.complete();else if(ok)api.feedback('Correct location. Inspect git status once to see the state of this clone.','info');});
  }
  draw();
}

function review(root,api) {
  let state=createGit(),active='blink',selected=new Set(),area='working';
  function draw() {
    const file=files.find(f=>f.id===active);
    const before=area==='working'?state.index[active]:state.head[active];
    const after=state[area][active];
    const unchanged=before===after;
    const staged=changes(state);
    const stagedHtml=staged.length?staged.map(f=>`<div class="diff-line">${escape(f.path)}<br><span class="code-gold">${escape(state.index[f.id]??'[removed]')}</span></div>`).join(''):'<span class="muted">No changes staged. Your next commit has no new content yet.</span>';
    preserveFocus(root,heading('Choose the change you mean.','The AI made the requested edit—and touched a few other things. Inspect the differences, choose a coherent change, and review the snapshot before committing.')+
      '<div class="callout"><strong>Your task:</strong> change the LED interval to 500 ms and update its test. Keep the unrelated README text. This example’s policy excludes rebuildable output and local-only data.</div>'+
      lab('REVIEW WORKBENCH',`<div class="file-workbench"><div class="file-list" aria-label="Inspect a file">${files.map(f=>`<button type="button" id="file-${f.id}" class="file-button ${active===f.id?'selected':''}" aria-pressed="${active===f.id}">${escape(f.path)} <span class="file-status">${f.tracked?'M':'?'}</span></button>`).join('')}</div><div class="diff-panel" data-state="file-diff"><div class="diff-heading">${area==='working'?'git diff · index → working file':'git diff --staged · HEAD → index'}</div>${unchanged?'<div class="diff-line">No difference in this view.</div>':`${before!==null?`<div class="diff-line removed">− ${escape(before||'[empty]')}</div>`:''}${after!==null?`<div class="diff-line added">+ ${escape(after||'[empty]')}</div>`:''}`}<p class="diff-note">${escape(file.note)}${!file.tracked?' New, untracked files are shown here for inspection; ordinary git diff does not show them.':''}</p></div></div><div class="lab-actions">${button('working-view','Working diff',area==='working'?'primary':'secondary')}${button('staged-view','Staged diff',area==='index'?'primary':'secondary')}</div><h3 style="margin-top:26px">Select files for the snapshot</h3>${files.map(f=>`<label class="file-check" data-state="file-${f.id}"><input type="checkbox" id="select-${f.id}" ${selected.has(f.id)?'checked':''}><code>${escape(f.path)}</code>${state.index[f.id]!==state.head[f.id]?'<span class="pill">staged</span>':''}</label>`).join('')}<div class="lab-actions">${button('stage-files','Stage selected','primary')}${button('unstage-files','Unstage selected')}</div><span class="snapshot-label" style="margin-top:25px">The snapshot for your next commit · ${staged.length} changed files</span><div class="terminal" data-state="staged-snapshot">${stagedHtml}</div><div class="lab-actions">${button('check-snapshot','Review & run example check','primary')}</div><p class="storage-note">The check examines this synthetic snapshot. It does not compile C or run a real test suite.</p>`)+
      '<section class="lesson-card"><h3>Read the difference before the filename.</h3><p>A test can belong with its implementation. An unrelated deletion can hide in a familiar file. Generated files follow the project’s policy. And .gitignore is a tracking convenience, not a way to protect secrets or stop tracking a file already committed.</p></section>');
    files.forEach(f=>{
      root.querySelector(`#file-${f.id}`).onclick=()=>{active=f.id;draw();};
      root.querySelector(`#select-${f.id}`).onchange=e=>{e.target.checked?selected.add(f.id):selected.delete(f.id);};
    });
    root.querySelector('#working-view').onclick=()=>{area='working';draw();};
    root.querySelector('#staged-view').onclick=()=>{area='index';draw();};
    root.querySelector('#stage-files').onclick=()=>{if(!selected.size){api.feedback('Select at least one file, then inspect what its content adds to the staged snapshot.','info');return;}state=stage(state,[...selected]);area='index';draw();api.feedback('The selected contents are now captured in the index. The working files stayed in place. Inspect the staged snapshot below.','info');};
    root.querySelector('#unstage-files').onclick=()=>{selected.forEach(id=>{state=unstage(state,id);});draw();api.feedback('Selected paths now match HEAD in the index. Your working edits are still present.','info');};
    root.querySelector('#check-snapshot').onclick=()=>{
      const result=check(state);state=result.state;
      if(result.ok){api.feedback('Good scope: the 500 ms implementation and matching test are staged. The unrelated deletion, output, and fake local data are excluded. The synthetic check passes.');api.complete();}
      else{const extra=changes(state).filter(f=>!['blink','test'].includes(f.id));api.feedback(extra.length?`There is unrelated content staged: ${extra.map(f=>f.path).join(', ')}. Select those paths and unstage them, then inspect again.`:'The requested implementation and its matching test need to be staged together. Inspect both differences before checking again.','error');}
    };
    root.querySelector('#reset-lab').onclick=()=>{state=createGit();active='blink';selected.clear();area='working';draw();api.feedback('The experiment is back at its initial file states.','info');};
  }
  draw();
}

function snapshot(root,api) {
  let state=preparedGit(),sawMismatch=false;
  function draw() {
    preserveFocus(root,heading('Staging captures a moment.','This station starts with the 500 ms implementation and test staged. Now change the working file again. Watch the two versions stop matching.')+
      lab('SNAPSHOT EXPERIMENT',`<div class="snapshot-comparison"><div data-state="working-snapshot"><span class="snapshot-label">Working file · editor</span><div class="terminal">${escape(state.working.blink)}</div></div><div data-state="index-snapshot"><span class="snapshot-label">Index · next commit</span><div class="terminal">${escape(state.index.blink)}</div></div></div><div class="lab-actions">${button('edit-again','Edit working interval to 250 ms','primary',state.working.blink.includes('250'))}${button('stage-again','Stage blink.c again','secondary',!sawMismatch)}</div><p class="pipeline-caption">Each click models one action. Stage again deliberately replaces the index version with the current working content. The test still expects 500 ms.</p>`)+
      question('snapshot','Immediately after the first edit, before staging again, what would a commit capture for blink.c?',['The staged 500 ms version.','The working 250 ms version, because staging follows the editor.','Neither version: editing removes the file from the index.'])+
      '<div class="callout">A file can have both staged and unstaged changes. A normal commit uses the index. Working changes made after staging need another deliberate add if you want them included.</div>');
    root.querySelector('#edit-again').onclick=()=>{state=editBlink(state);sawMismatch=true;draw();api.feedback('The editor now says 250 ms. The index still says 500 ms. That mismatch is the key observation.','info');};
    root.querySelector('#stage-again').onclick=()=>{state=stage(state,['blink']);draw();api.feedback('This second add captured 250 ms. The test snapshot still expects 500 ms: restaging one file does not update related files or prove correctness.','info');};
    bindQuiz(root,'snapshot',0,['Exactly: the first edit changed the working file, while the earlier staged snapshot stayed at 500 ms. A later add is a separate action.','The index is not a live mirror. The later edit remains unstaged until another add captures it.','The original staged content stays in the index. Editing does not automatically remove it.'],api,ok=>{if(ok&&sawMismatch)api.complete();else if(ok)api.feedback('That is the right prediction. Make the edit once and inspect both states to test it.','info');});
    root.querySelector('#reset-lab').onclick=()=>{state=preparedGit();sawMismatch=false;draw();api.feedback('Restored the 500 ms staged example.','info');};
  }
  draw();
}

function checkpoint(root,api) {
  let state=preparedGit(),checked=false,predicted=false;
  function done(){if(state.remote===2&&state.branch!=='main'&&predicted)api.complete();}
  function draw() {
    preserveFocus(root,heading('A checkpoint, then a conversation.','This station starts with the intended 500 ms snapshot staged again. Create a branch for the experiment, check the snapshot, commit locally, and then share it.')+
      lab('LOCAL → REMOTE',`<div class="branch-strip"><span class="snapshot-label">Current branch</span><span class="branch-token" data-state="current-branch">${state.branch}</span>${button('create-branch','Create experiment branch','secondary',state.branch!=='main')}</div><div class="state-grid"><div class="state-card" data-state="staged-count"><h3>Staged changes</h3><strong>${changes(state).length}</strong><p>File snapshots ready for the next commit</p></div><div class="state-card" data-state="local-history"><h3>Local history</h3><strong>${state.commits.length}</strong><p>Commits recorded in this clone</p></div><div data-state="remote-history" class="state-card ${state.remote<state.commits.length?'stale':'current'}"><h3>Remote history</h3><strong>${state.remote}</strong><p>${state.remote<state.commits.length?'Your new checkpoint is not shared yet.':'This example branch is in sync.'}</p></div></div><div class="terminal"><span class="prompt">$</span> git log --oneline\n${state.commits.slice().reverse().map(c=>`${c.id}  ${c.message}`).join('\n')}</div><div class="lab-actions">${button('check-commit',checked?'✓ Snapshot check passed':'1. Check staged snapshot','secondary',state.commits.length>1||state.branch==='main')}${button('make-commit','2. Commit locally','primary',!checked||state.commits.length>1)}${button('push-commit','3. Push this branch','secondary',state.commits.length===1||state.remote===state.commits.length)}</div><p class="storage-note">The checks and remote are simulated. No files or credentials leave your browser.</p>`)+
      question('sharing','You pushed the checkpoint. What happened to a teammate’s existing working files?',['Nothing automatically. Their clone needs its own update steps.','Their open files were silently replaced with yours.','Your staged changes moved directly into their editor.'])+
      '<section class="lesson-card"><h3>Get the direction right.</h3><p><code>push</code> updates remote references with local commits. <code>fetch</code> brings remote objects and reference updates into your clone without integrating them into your working branch. <code>pull</code> fetches and then integrates according to its options. A pull request is a hosting collaboration feature, not a Git commit.</p></section>');
    root.querySelector('#create-branch').onclick=()=>{state=branch(state);draw();api.feedback('The example now uses experiment/led-interval. Creating a branch does not make another copy of every working file.','info');};
    root.querySelector('#check-commit').onclick=()=>{const result=check(state);state=result.state;checked=result.ok;draw();api.feedback('The intended source and test snapshots are coherent. The synthetic scenario check passes.');};
    root.querySelector('#make-commit').onclick=()=>{const result=commit(state);state=result.state;draw();api.feedback(result.ok?'A local checkpoint was added. Staged changes now match HEAD; unrelated working edits remain. The remote still has only the initial commit.':'Check the exact staged snapshot before committing.',result.ok?'success':'error');};
    root.querySelector('#push-commit').onclick=()=>{state=push(state);draw();api.feedback('This example branch is shared. The remote history now includes your local checkpoint. Other clones have not silently changed.');done();};
    bindQuiz(root,'sharing',0,['Right. Sharing commits and updating another clone’s working files are different operations.','A push updates the remote. It does not control another clone’s working files.','The index belongs to your clone; it is not a shared live folder.'],api,ok=>{predicted=ok;if(ok)done();});
    root.querySelector('#reset-lab').onclick=()=>{state=preparedGit();checked=false;predicted=false;draw();api.feedback('Restored the uncommitted example.','info');};
  }
  draw();
}

function recovery(root,api) {
  let scenario=0,solved=new Set(),transfer=false;
  const scenarios=[
    {title:'I staged the wrong change. Keep my working edit.',correct:0,after:'Index: back to HEAD (1000 ms). Working file: still 250 ms.',reason:'restore --staged resets the index version to HEAD here, while preserving the working edit.'},
    {title:'I want to discard the later working edit and keep the staged 500 ms version.',correct:1,after:'Index: still 500 ms. Working file: restored to 500 ms.',reason:'Plain restore copies the index into the working file here. The unstaged 250 ms edit is discarded.'},
    {title:'A shared commit needs reversing without erasing its place in history.',correct:2,after:'Shared history: c0 → c1 → c2 (reverses c1). The previous record remains.',reason:'revert creates a new commit that reverses a prior change. Unstaging or restoring a working file would not reverse the shared commit.'}
  ];
  function draw() {
    const current=scenarios[scenario];
    preserveFocus(root,heading('Undo the right layer.','“Undo” can mean changing the index, discarding a working edit, or reversing a commit. Start with the state you want to affect. These buttons operate only on teaching examples.')+
      lab('THREE RECOVERY SITUATIONS',`<p>For the first two situations: HEAD is 1000 ms, the index is 500 ms, and the later working edit is 250 ms.</p><div class="lab-actions">${[0,1,2].map(i=>button(`case-${i}`,`${solved.has(i)?'✓ ':''}Situation ${i+1}`,scenario===i?'primary':'secondary')).join('')}</div><h3 style="margin-top:22px">${current.title}</h3><div class="choice-grid">${['git restore --staged src/blink.c','git restore src/blink.c','git revert &lt;shared-commit&gt;'].map((text,i)=>`<button type="button" class="choice" id="recover-${i}"><span class="choice-marker" aria-hidden="true">${i+1}</span><code>${text}</code></button>`).join('')}</div><div class="terminal" data-state="recovery-result">${solved.has(scenario)?escape(current.after):'Choose the action that matches this situation.'}</div><p class="storage-note">In a real project, plain restore can discard uncommitted work. Inspect your differences first.</p>`)+
      question('transfer','A teammate has a committed 500 ms version and an uncommitted 250 ms edit. They push. Which blink.c version reaches the remote in that commit?',['250 ms, because it is the newest working file.','Both versions, because Git sends the whole working directory.','500 ms, because that is the content recorded in the commit.']));
    [0,1,2].forEach(i=>{root.querySelector(`#case-${i}`).onclick=()=>{scenario=i;draw();};root.querySelector(`#recover-${i}`).onclick=()=>{
      if(i===current.correct){solved.add(scenario);draw();api.feedback(`${current.reason} ${solved.size} of 3 situations explored.`);}
      else api.feedback(i===0?'Unstaging changes the index. It does not discard the working edit or reverse an existing commit.':i===1?'Plain restore changes the working file from the index here. It discards the later working edit, without changing shared history.':'Revert adds a reverse commit. It is not an operation for removing a staged or uncommitted change.','error');
    };});
    root.querySelector('#reset-lab').onclick=()=>{scenario=0;solved.clear();transfer=false;draw();api.feedback('Recovery situations and answers reset.','info');};
    bindQuiz(root,'transfer',2,['Push shares commits, not the newest uncommitted working content.','The working directory and index do not get transmitted as a live folder.','Yes. The 500 ms snapshot is in the shared commit; the 250 ms edit remains in that clone.'],api,ok=>{transfer=ok;});
    reflection(root,api,'git','Why can a working file, a staged snapshot, and a shared commit contain three different versions?',()=>{
      if(solved.size!==3||!transfer){api.feedback('Explore all three recovery situations and answer the new push example before finishing. Your explanation can then connect the pieces.','info');return false;}return true;
    });
  }
  draw();
}
