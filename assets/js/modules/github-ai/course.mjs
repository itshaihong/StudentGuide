import {heading,lab,button,question,bindQuiz,preserveFocus,reflection,escape} from '../../learning/ui.mjs';
import {promptParts,checkPrompt,createReview,reviewAction,preparedReview,reviewReady,acceptsCount} from './model.mjs';

export function mount(chapter,root,api){
  if(chapter===0)return surfaces(root,api);
  if(chapter===1)return context(root,api);
  if(chapter===2)return review(root,api);
  return release(root,api);
}
const surfacesData={
  code:{title:'Code & README',text:'Read the repository, setup instructions, conventions, and source. Git still records commits; this surface makes the project discoverable.',url:'https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes'},
  issues:{title:'Issues',text:'Issue #42: support a sample count from 1 through 10, inclusive. Reject 0 and 11. Preserve the existing diagnostics output. This is the acceptance contract for the change.',url:'https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-an-issue'},
  prs:{title:'Pull requests',text:'Compare the proposed branch with its base. Discuss the diff, request review, and examine checks before integrating. Opening this record does not merge the change.',url:'https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request'},
  actions:{title:'Actions',text:'Inspect which workflow, job, and step ran against which commit. A failed boundary test should lead to its output and inputs, not a blind rerun.',url:'https://docs.github.com/en/actions/get-started/understand-github-actions'},
  releases:{title:'Releases',text:'Find the named version, its tag, change notes, and any delivery assets. Match it to the revision and environment you intend to use.',url:'https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases'}
};
function surfaces(root,api){
  let active='code',task=0,solved=new Set();
  const tasks=[{text:'Find the inclusive range requested for the sample-count change.',surface:'issues'},{text:'Find the proposed branch diff and review discussion.',surface:'prs'},{text:'Find the job output for a failed automated check.',surface:'actions'},{text:'Find the delivered version and change notes.',surface:'releases'}];
  function draw(){
    const shown=surfacesData[active];
    preserveFocus(root,heading('Git records the work. GitHub coordinates it.','Your repository already has commits. GitHub adds places to explain intent, review a proposed integration, automate checks, and identify a delivery. Find the right surface for each task.')+
      lab('Navigate the project',`<p><strong>Task ${task+1} of ${tasks.length}:</strong> ${tasks[task].text}</p><div class="lab-actions repo-tabs">${Object.entries(surfacesData).map(([id,item])=>button(`surface-${id}`,item.title,id===active?'primary':'secondary')).join('')}</div><section class="repository-panel" data-state="repository-surface"><h3>${shown.title}</h3><p>${shown.text}</p><a href="${shown.url}">How to try this in your own repository ↗</a></section><p class="storage-note">${solved.size} of ${tasks.length} tasks located. These are teaching panels, not a connection to a real GitHub repository.</p>`));
    Object.keys(surfacesData).forEach(id=>{root.querySelector(`#surface-${id}`).onclick=()=>{
      active=id;
      if(id===tasks[task].surface){solved.add(task);if(task<tasks.length-1)task++;draw();api.feedback(solved.size===tasks.length?'You located the important project surfaces. GitHub coordinates work around the history managed by Git.':'That is the right place. Read its example, then locate the next task.');if(solved.size===tasks.length)api.complete();}
      else{draw();api.feedback(`This surface is useful for ${id==='code'?'reading files and setup':shownPurpose(id)}. The current task needs a different project record.`,'info');}
    };});
    root.querySelector('#reset-lab').onclick=()=>{active='code';task=0;solved.clear();draw();api.feedback('The project navigation task starts again.','info');};
  }
  draw();
}
function shownPurpose(id){return {issues:'defining and tracking the request',prs:'reviewing a proposed integration',actions:'inspecting automated execution',releases:'finding a named delivery'}[id];}
function context(root,api){
  let selected=new Set(),ready=false,bugFound=false;
  function draw(){
    preserveFocus(root,heading('Give AI a task you can verify.','The issue defines an inclusive range of 1 through 10. Assemble relevant context and constraints before requesting a small patch. You remain responsible for the proposal and the evidence used to accept it.')+
      lab('Prepare a bounded request',`${promptParts.map(p=>`<label class="file-check"><input type="checkbox" id="context-${p.id}" ${selected.has(p.id)?'checked':''}><span>${p.label}</span></label>`).join('')}<div class="lab-actions">${button('assemble-prompt','Build the request','primary')}</div><div class="terminal" style="margin-top:22px" data-state="ai-request">${ready?'Implement issue #42 in the sample-count validator.\nAccept integers 1 through 10, inclusive. Reject 0 and 11.\nInspect the relevant source, tests, README, and project instructions.\nKeep the patch scoped. Explain your changes and test the boundaries.\nDo not include local credentials or unrelated rewrites.':'Select the context that makes the request clear, scoped, and independently checkable.'}</div><p class="storage-note">No prompt is sent to an AI service. The proposal below is an original synthetic example.</p>${ready?'<div class="diff-panel"><div class="diff-heading">AI proposal · src/sample_count.js</div><div class="diff-line added">+ return Number.isInteger(count) &amp;&amp; count &gt;= 1 &amp;&amp; count &lt; 10;</div><p class="diff-note">Suggested test: expect(acceptsCount(5)).toBe(true)</p></div>':''}`)+
      question('ai-bug','What must you challenge in this proposal?',['It rejects 10, even though the request includes 10.','It uses a small patch instead of rewriting all the files.','Nothing: one passing example proves the full range.']));
    promptParts.forEach(p=>{root.querySelector(`#context-${p.id}`).onchange=e=>{e.target.checked?selected.add(p.id):selected.delete(p.id);};});
    root.querySelector('#assemble-prompt').onclick=()=>{
      const result=checkPrompt([...selected]);ready=result.ok;draw();
      api.feedback(result.ok?'The request has a goal, relevant context, boundaries, scope, and checks. Now inspect the actual proposed behavior.':result.forbidden.length?'Local credentials and broad unrelated rewrites are outside this task. Keep the request relevant and do not send secret material.':`The request is missing ${result.missing.length} important context or verification constraints. Include the expected behavior, relevant files, conventions, scope, and boundary checks.`,result.ok?'info':'error');done();
    };
    bindQuiz(root,'ai-bug',0,['Exactly. The comparison is exclusive at 10. An independent boundary check can expose a plausible-looking mistake.','A bounded patch helps review; size alone is not the defect here.','A test of 5 does not cover either boundary. AI-generated tests can repeat the same misunderstanding as the implementation.'],api,ok=>{bugFound=ok;done();});
    root.querySelector('#reset-lab').onclick=()=>{selected.clear();ready=false;bugFound=false;draw();api.feedback('The request and proposal checkpoint reset.','info');};
  }
  function done(){if(ready&&bugFound)api.complete();}
  draw();
}
function evidenceCards(s){return `<div class="state-grid"><div class="state-card" data-state="review-head"><h3>Proposed revision</h3><strong>r${s.revision}</strong><p>Inclusive upper boundary: ${s.inclusive?'yes':'no'}</p></div><div class="state-card ${s.ci?.revision===s.revision&&s.ci.ok?'current':'stale'}" data-state="ci-result"><h3>Automated checks</h3><strong>${s.ci?s.ci.ok?'Pass':'Fail':'—'}</strong><p>${s.ci?`Tested r${s.ci.revision}${s.ci.revision!==s.revision?' · old revision':''}`:'Not run'}<br>${s.boundaries?'Boundary cases included':'Only the middle example'}</p></div><div class="state-card" data-state="review-approval"><h3>Review</h3><strong>${s.reviewed?`r${s.reviewed}`:'—'}</strong><p>${s.reviewed===s.revision?'Current proposal reviewed':'Current proposal still needs review'}</p></div></div>`;}
function checksOutput(s){return s.ci?s.ci.cases.map(c=>`${c.expected===c.actual?'PASS':'FAIL'}  count=${c.value}  expected ${c.expected} / got ${c.actual}`).join('\n'):'Run the supplied checks to inspect their actual coverage.';}
function review(root,api){
  let state=createReview(),sawFailure=false,probeValue='10',probeResult=null;
  function draw(){
    preserveFocus(root,heading('A green check is evidence of something specific.','The AI proposal tests only the middle of the range. Run it, add the missing boundaries, inspect the failure, and repair the validator. CI and review must refer to the current revision.')+
      lab('Inspect the checks, then the result',evidenceCards(state)+`<form class="input-experiment" id="probe-form"><label for="probe-count">Try a sample count<input id="probe-count" type="number" step="any" required value="${escape(probeValue)}"></label><button class="button secondary" type="submit">Test this input</button></form><p data-state="probe-result" class="experiment-status">${probeResult===null?'Expected contract: accept integers 1 through 10, inclusive.':`For ${probeValue}: expected ${probeResult.expected?'accept':'reject'}, proposal r${probeResult.revision} ${probeResult.actual?'accepts':'rejects'}. ${probeResult.expected===probeResult.actual?'This case agrees.':'Mismatch found.'}`}</p><div class="terminal" data-state="ci-log">${checksOutput(state)}</div><div class="lab-actions">${button('run-ci','Run example CI','primary')}${button('add-boundaries','Add the boundary cases','secondary',state.boundaries)}${button('fix-validator','Fix the inclusive upper boundary','secondary',!sawFailure||state.inclusive)}${button('approve-revision','Review this revision','secondary',!reviewReady(state))}</div><p class="storage-note">These synchronous example checks run on the small teaching predicate. They do not launch a real GitHub Actions runner.</p>`)+
      '<section class="lesson-card"><h2>AI changes the pace, not the ownership.</h2><p>Use AI to inspect a failure, propose a bounded fix, or explain an unfamiliar file. Preserve human acceptance criteria and independent tests. A review suggestion, confident explanation, or passing narrow test is not proof of the full behavior.</p></section>');
    root.querySelector('#probe-form').onsubmit=event=>{event.preventDefault();const input=root.querySelector('#probe-count');if(!input.reportValidity())return;probeValue=input.value;const value=Number(probeValue);probeResult={revision:state.revision,actual:acceptsCount(value,state.inclusive),expected:acceptsCount(value,true)};draw();api.feedback(probeResult.expected===probeResult.actual?'This input agrees with the contract. One example does not cover the whole range.':'This input exposes a mismatch. Add independent boundary checks before accepting the patch.',probeResult.expected===probeResult.actual?'info':'error');};
    for(const [id,action] of [['run-ci','ci'],['add-boundaries','boundaries'],['fix-validator','fix'],['approve-revision','approve']])root.querySelector(`#${id}`).onclick=()=>{
      const result=reviewAction(state,action);state=result.state;
      if(action==='ci'&&state.boundaries&&!state.ci.ok)sawFailure=true;
      draw();
      if(!result.ok)api.feedback(result.message,'error');
      else if(action==='ci')api.feedback(!state.boundaries?'The middle example passes, but neither boundary is checked. Improve the test contract before approving.':state.ci.ok?'All supplied boundary cases pass for this revision. Review the same revision before continuing.':'Count 10 fails. Inspect the upper-bound comparison and repair it.','info');
      else api.feedback(action==='approve'?'The current proposal is reviewed with matching check evidence.':action==='boundaries'?'The new tests changed the revision. Any earlier green result is now old evidence.':'The validator now accepts 10. Run the checks again; an edit does not update the old CI result.','info');
      if(state.reviewed===state.revision&&sawFailure)api.complete();
    };
    root.querySelector('#reset-lab').onclick=()=>{state=createReview();sawFailure=false;probeValue='10';probeResult=null;draw();api.feedback('The original weak check and exclusive upper boundary are restored.','info');};
  }
  draw();
}
function release(root,api){
  let state=preparedReview();
  function draw(){
    preserveFocus(root,heading('Finish the handoff, not just the chat.','The corrected proposal is checked and reviewed. A final README clarification is requested. Make that edit, refresh the evidence, then associate the delivery with the intended merged revision.')+
      lab('Current revision → reviewed delivery',evidenceCards(state)+`<div class="lab-actions">${button('update-readme','Add the README clarification','primary',state.docsUpdated)}${button('release-ci','Run checks on this revision')}${button('release-review','Confirm review of this revision','secondary',!reviewReady(state))}${button('merge-pr','Merge the reviewed proposal','secondary',!state.docsUpdated||state.merged!==null)}</div><div class="state-grid"><div class="state-card" data-state="merged-revision"><h3>Merged revision</h3><strong>${state.merged?`r${state.merged}`:'—'}</strong><p>The project’s checked integration</p></div><div class="state-card" data-state="release-tag"><h3>Release tag</h3><strong>${state.tagged?`r${state.tagged}`:'—'}</strong><p>Which revision identifies this delivery?</p></div><div class="state-card" data-state="release-state"><h3>Delivery notes</h3><strong>${state.released?'Ready':'—'}</strong><p>${state.released?'Range, revision, checks, and limits recorded':'Not prepared'}</p></div></div><div class="lab-actions">${button('tag-old','Try tagging the old r1','secondary',!state.merged)}${button('tag-current','Tag the tested merged revision','secondary',!state.merged)}${button('prepare-release','Prepare release notes','primary',!state.tagged||state.released)}</div><p class="storage-note">The release note records: inclusive range 1–10, the tested revision, boundary checks, and remaining limits. No real PR, tag, or release is created.</p>`)+
      '<section class="lesson-card"><h2>What to try on GitHub next</h2><p>In a repository you own, open an issue with observable criteria, create a small branch, and propose a PR with its checks. Inspect an Actions job log and the revision it tested. Explore workflow templates and releases after the basic loop makes sense. AI can help explain and draft; availability and permissions depend on your account and project.</p><p><a href="https://docs.github.com/en/get-started/using-github/github-flow">Try the GitHub flow ↗</a> · <a href="https://docs.github.com/en/actions/get-started/quickstart">Explore an Actions workflow ↗</a> · <a href="https://docs.github.com/en/copilot/responsible-use/code-review">Read AI review limits ↗</a></p></section>');
    for(const [id,action,target] of [['update-readme','docs'],['release-ci','ci'],['release-review','approve'],['merge-pr','merge'],['tag-old','tag',1],['tag-current','tag',state.merged],['prepare-release','release']])root.querySelector(`#${id}`).onclick=()=>{
      const result=reviewAction(state,action,target);state=result.state;draw();
      api.feedback(result.message||(action==='docs'?'The README edit created a new revision. The previous checks and review remain evidence about the old revision.':action==='merge'?'The reviewed revision is integrated. The tag should identify that revision.':action==='tag'?'The tag identifies the intended tested integration.':action==='release'?'The delivery now has a traceable revision, behavior summary, and check evidence.':'This evidence now corresponds to the current revision.'),result.ok?'info':'error');
    };
    root.querySelector('#reset-lab').onclick=()=>{state=preparedReview();draw();api.feedback('The release starts before the final README clarification.','info');};
    reflection(root,api,'github-ai','Which responsibilities stay with you when AI writes the patch? Explain how the issue, diff, current checks, review, and release revision fit together.',()=>{if(!state.released){api.feedback('Complete the checked and reviewed delivery before finishing its handoff reflection.','info');return false;}return true;});
  }
  draw();
}
