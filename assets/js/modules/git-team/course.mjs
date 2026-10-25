import {heading,lab,button,question,bindQuiz,preserveFocus,reflection} from '../../learning/ui.mjs';
import {createTeam,teamAction,preparedTeam,createConflict,resolveConflict,checkConflict,finishConflict} from './model.mjs';

function graph(s){
  const files=s.commits[s.feature||s.main].files;
  return `<div class="branch-graph" aria-label="Simplified commit graph"><div class="graph-lane"><span>Shared history</span><code>a ${s.remoteMain==='c'?'→ c · sampler fix':''}</code></div><div class="graph-lane" data-state="feature-tip"><span>Your feature</span><code>a ${s.feature&&s.feature!=='a'?'→ b · status report':''}${s.feature==='m'?' → m · integrates b + c':''}</code></div></div><div class="state-grid"><div class="state-card" data-state="tracking"><h3>origin/main</h3><strong>${s.trackingMain}</strong><p>Your local remote-tracking reference</p></div><div class="state-card" data-state="working"><h3>Working feature</h3><strong>${s.feature||s.main}</strong><p>Status report: ${files.statusReport?'present':'absent'}<br>Sampler fix: ${files.samplerSafe?'present':'absent'}</p></div><div class="state-card" data-state="shared"><h3>Shared feature</h3><strong>${s.sharedFeature||'—'}</strong><p>${s.sharedFeature?'Available for teammate review':'Not pushed in this checkpoint'}</p></div></div>`;
}
export function mount(chapter,root,api){
  if(chapter===0)return branches(root,api);
  if(chapter===1)return fetchAndMerge(root,api);
  if(chapter===2)return conflict(root,api);
  return handoff(root,api);
}
function branches(root,api){
  let state=createTeam(),answer=false;
  function draw(){
    preserveFocus(root,heading('Give each change a place.','Your teammate is fixing the sampler while you add a status report. Start both from commit a. A branch names a line of work; a clone owns a separate working copy.')+
      lab('Two engineers, one repository',graph(state)+`<div class="lab-actions">${button('team-branch','Create feature/status','primary',!!state.feature)}${button('team-feature','Commit the status report','secondary',state.feature!=='a')}${button('team-teammate','Teammate pushes sampler fix','secondary',state.feature!=='b'||state.remoteMain==='c')}</div><p class="storage-note">Main in your clone remains at a. The remote can advance independently of both your feature and your local main.</p>`)+
      question('separate','Creating feature/status did which of these?',['Named a separate line of commits in this clone.','Made a second clone with a live connection to every teammate’s editor.','Copied and synchronized every working file on the team.']));
    for(const [id,action,text] of [['team-branch','branch','The branch starts at a. No second clone was created.'],['team-feature','feature','Your feature is now b. Local main is still a.'],['team-teammate','teammate','The teammate shared c. Your working feature and origin/main have not updated themselves.']])root.querySelector(`#${id}`).onclick=()=>{const result=teamAction(state,action);state=result.state;draw();api.feedback(text,'info');done();};
    bindQuiz(root,'separate',0,['Right. Branches and clones solve different parts of team work.','A branch is not a second clone and does not synchronize editors.','Working files stay local to their clone.'],api,ok=>{answer=ok;done();});
    root.querySelector('#reset-lab').onclick=()=>{state=createTeam();answer=false;draw();api.feedback('Both engineers are back at the common starting point.','info');};
  }
  function done(){if(answer&&state.feature==='b'&&state.remoteMain==='c')api.complete();}
  draw();
}
function fetchAndMerge(root,api){
  let state=preparedTeam(),answer=false;
  function draw(){
    preserveFocus(root,heading('Fetch first. Integrate deliberately.','Your feature is b. The teammate shared c from the same ancestor. Fetch updates what this clone knows; merging is a separate decision that combines the work.')+
      lab('Observe the two operations',graph(state)+`<div class="lab-actions">${button('fetch-main','Fetch origin','primary',state.trackingMain==='c')}${button('try-ff','Try pull --ff-only','secondary',state.trackingMain!=='c'||state.feature==='m')}${button('merge-main','Merge fetched origin/main','secondary',state.trackingMain!=='c'||state.feature==='m')}</div><p class="pipeline-caption">In this checkpoint, the status-report file and sampler file changed independently. The merge commit m keeps b and c as parents. It does not move your local main.</p>`)+
      question('fetched','Immediately after fetch, before merging, what changed?',['The working feature automatically gained the sampler fix.','origin/main advanced to c; your working feature stayed at b.','Your uncommitted files were uploaded to the remote.']));
    for(const [id,action] of [['fetch-main','fetch'],['try-ff','ff-only'],['merge-main','merge']])root.querySelector(`#${id}`).onclick=()=>{const result=teamAction(state,action);state=result.state;draw();api.feedback(result.message||(action==='fetch'?'origin/main now records c. Your feature files still reflect b.':'The feature now includes both changes in m. A successful content merge still needs tests.'),result.ok?'info':'error');done();};
    bindQuiz(root,'fetched',1,['Fetch does not integrate the remote change into your current working branch.','Exactly. Knowing about a change and integrating it are separate operations.','Fetch receives remote objects and reference updates; it does not upload your working files.'],api,ok=>{answer=ok;done();});
    root.querySelector('#reset-lab').onclick=()=>{state=preparedTeam();answer=false;draw();api.feedback('The feature is b and the local remote-tracking reference is a again.','info');};
  }
  function done(){if(answer&&state.feature==='m')api.complete();}
  draw();
}
function conflict(root,api){
  let state=createConflict();
  function draw(){
    preserveFocus(root,heading('Resolve the behavior, not just the markers.','A second integration checkpoint changes the same interval on both branches. Your report must update every 500 ms; the teammate’s sampler must run every 250 ms. A single shared interval cannot satisfy both requirements.')+
      lab('A meaningful conflict',`<div class="snapshot-comparison"><div><span class="snapshot-label">Your feature</span><div class="terminal">poll_interval_ms = 500;\n// report cadence</div></div><div><span class="snapshot-label">Fetched main</span><div class="terminal">poll_interval_ms = 250;\n// sampler cadence</div></div></div><div class="lab-actions">${button('keep-ours','Keep ours')}${button('keep-theirs','Keep theirs')}${button('split-config','Separate the two responsibilities','primary')}</div><div class="terminal" style="margin-top:22px" data-state="resolution">${state.config?`report_interval_ms = ${state.config.report};\nsample_interval_ms = ${state.config.sample};`:'Unresolved: decide what the combined program must do.'}</div><div class="lab-actions">${button('test-resolution','Check both requirements','secondary',!state.config)}${button('record-merge','Record the merge','primary',!state.checked||state.committed)}</div><p data-state="resolution-check" class="storage-note">${state.committed?'Merge recorded with both parents.':state.checked?'Both cadence requirements pass.':'The proposed resolution has not passed both requirements.'}</p>`)+
      '<section class="lesson-card"><h2>Conflict-free text is only the first check.</h2><p>Choosing one side can remove the markers while dropping the other engineer’s intent. Understand the two callers, update their separate settings, and test both behaviors before finishing the merge.</p></section>');
    for(const [id,choice] of [['keep-ours','ours'],['keep-theirs','theirs'],['split-config','split']])root.querySelector(`#${id}`).onclick=()=>{state=resolveConflict(state,choice);draw();api.feedback('The text is resolved. Now check whether both requested behaviors survived.','info');};
    root.querySelector('#test-resolution').onclick=()=>{const result=checkConflict(state);state=result.state;draw();api.feedback(result.ok?'The report stays at 500 ms and the sampler runs at 250 ms. Both requirements survive this resolution.':'One cadence was copied into both roles. The combined text is clean, but it does not satisfy both requirements. Separate the settings and check again.',result.ok?'success':'error');};
    root.querySelector('#record-merge').onclick=()=>{const result=finishConflict(state);state=result.state;draw();if(result.ok){api.feedback('The resolved merge records the integration. Its two parents preserve where the two requirements came from.');api.complete();}};
    root.querySelector('#reset-lab').onclick=()=>{state=createConflict();draw();api.feedback('The conflict is unresolved again.','info');};
  }
  draw();
}
function handoff(root,api){
  let state=preparedTeam(true);
  function draw(){
    preserveFocus(root,heading('Share evidence with the result.','This checkpoint starts with the two changes integrated. Check the feature tip before sharing it. A teammate needs a reproducible revision, the intent, and the checks—not just “it works on my machine.”')+
      lab('Integration handoff',graph(state)+`<div class="lab-actions">${button('test-integration','Run both integration checks','primary')}${button('push-integration','Push the checked feature','secondary',state.checked!==state.feature||state.sharedFeature===state.feature)}</div><p data-state="team-check" class="storage-note">${state.checked?'Status report and sampler checks pass for m.':'No integration check recorded for this feature tip.'}</p><div class="callout">A push shares commits. The teammate’s existing working copy still needs its own update. A pull request is the next place to review the proposed integration on GitHub.</div>`));
    root.querySelector('#test-integration').onclick=()=>{const result=teamAction(state,'test');state=result.state;draw();api.feedback(result.ok?'Both behavior checks pass for commit m. A code change after this check would need fresh evidence.':result.message,result.ok?'success':'error');};
    root.querySelector('#push-integration').onclick=()=>{const result=teamAction(state,'push');state=result.state;draw();api.feedback(result.ok?'The checked feature is shared for review. No teammate working files were silently replaced.':result.message,result.ok?'success':'error');};
    root.querySelector('#reset-lab').onclick=()=>{state=preparedTeam(true);draw();api.feedback('The integrated feature is untested and unshared again.','info');};
    reflection(root,api,'git-team','What should the next engineer know about the integrated change, its revision, and its checks? Why was fetch alone insufficient?',()=>{if(state.sharedFeature!==state.feature){api.feedback('Check and share the integrated feature before writing its handoff.','info');return false;}return true;});
  }
  draw();
}
