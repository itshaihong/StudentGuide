import {heading,lab,button,preserveFocus,reflection,escape} from '../../learning/ui.mjs';
import {projectItems,createContract,contractAction,diagnosticCases,createDiagnosis,inspectDiagnosis,repairDiagnosis,createDelivery,deliveryAction} from './model.mjs';

export function mount(chapter,root,api){
  if(chapter===0)return sources(root,api);
  if(chapter===1)return contract(root,api);
  if(chapter===2)return diagnosis(root,api);
  return delivery(root,api);
}
function sources(root,api){
  let current=0,classified=new Set();
  const choices=[['git','Maintain in Git'],['artifact','Versioned delivery artifact'],['generated','Regenerate locally'],['target','State on the target']];
  function draw(){
    const item=projectItems[current];
    preserveFocus(root,heading('Share the inputs, not a mysterious folder.','This team keeps maintained source and settings in Git. It supplies release artifacts with their revisions, regenerates local support output, and records board state separately. Classify the files under that explicit policy.')+
      lab('Prepare a rebuildable source set',`<p>Item ${current+1} of ${projectItems.length}</p><div class="artifact-inspection" data-state="source-item"><code>${escape(item.path)}</code><p>${classified.has(current)?item.reason:'Which responsibility does this item have in the handoff?'}</p></div><div class="lab-actions">${choices.map(([id,label])=>button(`classify-${id}`,label)).join('')}</div><div class="lab-actions">${button('source-previous','← Previous item','secondary',current===0)}${button('source-next','Next item →','primary',!classified.has(current)||current===projectItems.length-1)}</div><p class="storage-note">${classified.size} of ${projectItems.length} responsibilities identified. This policy does not claim that all generated files are forbidden in every Git project.</p>`)+
      '<section class="lesson-card"><h2>A project entry is not all its inputs.</h2><p>Keep the maintained design recipe, constraints, relevant configuration, and application source. Document how to generate the platform support. A teammate should not depend on your machine’s cache or a hand-edited generated header.</p></section>');
    for(const [id]of choices)root.querySelector(`#classify-${id}`).onclick=()=>{
      if(id===item.kind){classified.add(current);draw();api.feedback(item.reason);if(classified.size===projectItems.length)api.complete();}
      else api.feedback(id==='git'?'Ask whether this is maintained input, produced output, or target state. The project’s policy assigns different responsibilities to each.':`Under this project policy, this item is ${choices.find(([key])=>key===item.kind)[1].toLowerCase()}. ${item.reason}`,'error');
    };
    root.querySelector('#source-previous').onclick=()=>{current--;draw();};
    root.querySelector('#source-next').onclick=()=>{current++;draw();};
    root.querySelector('#reset-lab').onclick=()=>{current=0;classified.clear();draw();api.feedback('The source ownership decisions reset.','info');};
  }
  draw();
}
function contract(root,api){
  let state=createContract();
  function draw(){
    const p=state.pipeline;
    const version=value=>state.inspected?`v${value}`:'Inspect';
    preserveFocus(root,heading('A name is not a hardware contract.','The teammate’s package is labelled design-final-v2. The intended GPIO interface is hardware v2, but the software support may still describe an older handoff. Check the contents and their consumers before accepting it.')+
      lab('Review the handoff manifest',`<div class="state-grid"><div class="state-card" data-state="contract-xsa"><h3>XSA contents</h3><strong>${version(p.xsa)}</strong><p>Filename: design-final-v2.xsa</p></div><div class="state-card" data-state="contract-bsp"><h3>Platform / BSP</h3><strong>${version(p.bsp)}</strong><p>The software environment’s hardware information</p></div><div class="state-card" data-state="contract-elf"><h3>ELF hardware input</h3><strong>${version(p.elf.hardware)}</strong><p>Compiled using that BSP</p></div></div><div class="lab-actions">${button('inspect-contract','Inspect package contents','primary')}${button('select-contract','Select the verified v2 XSA','secondary',!state.inspected)}${button('contract-platform','Update platform & BSP','secondary',!state.inspected)}${button('contract-build','Rebuild the application','secondary',!state.inspected)}${button('accept-contract','Accept the handoff')}</div><p class="pipeline-caption">The supplied bitstream is v2 in this checkpoint. The handoff uses a standalone domain. Host compatibility is distinct from a physical load or power-on test.</p><p data-state="contract-accepted" class="storage-note">${state.accepted?'Host contract accepted. Physical board execution remains unverified.':'The package has not been accepted.'}</p>`));
    for(const [id,action]of [['inspect-contract','inspect'],['select-contract','select-xsa'],['contract-platform','platform'],['contract-build','build'],['accept-contract','accept']])root.querySelector(`#${id}`).onclick=()=>{
      const result=contractAction(state,action);state=result.state;draw();
      api.feedback(result.message||(action==='inspect'?'The filename says v2, but the XSA and software support describe v1. Use content and build inputs as evidence.':action==='accept'?'The host artifacts now agree with the intended hardware. Record the remaining physical verification separately.':'The selected consumer updated. Inspect the remaining versions before accepting the package.'),result.ok?'info':'error');
    };
    root.querySelector('#reset-lab').onclick=()=>{state=createContract();draw();api.feedback('The misleading filename and stale support are restored.','info');};
    reflection(root,api,'zynq-handoff','What must match in a hardware/software handoff, and why does a filename or successful application rebuild not prove the whole contract?',()=>{if(!state.accepted){api.feedback('Inspect and align the host contract before finishing this handoff.','info');return false;}return true;});
  }
  draw();
}
function diagnosis(root,api){
  let state=createDiagnosis(),solved=new Set();
  const layers=[['source','Source'],['host','Host ELF'],['memory','Loaded/run history'],['boot','Boot setup']];
  function draw(){
    const item=diagnosticCases[state.index];
    preserveFocus(root,heading('Find the first failing layer.','Do not rebuild everything at random. Gather observations, compare the versions at the boundary, and choose the next repair. These cases distinguish source, host output, loaded memory, and power-on behavior.')+
      lab('A small diagnostic investigation',`<div class="lab-actions">${diagnosticCases.map((c,i)=>button(`diagnosis-${i}`,`${solved.has(i)?'✓ ':''}${c.title}`,state.index===i?'primary':'secondary')).join('')}</div><div class="lab-actions">${layers.map(([id,label])=>button(`inspect-${id}`,`Inspect ${label.toLowerCase()}`)).join('')}</div><div class="terminal" style="margin-top:22px" data-state="observations">${state.seen.length?state.seen.map(layer=>item.observations[layer]).join('\n'):'Collect the observations needed to locate the first mismatch.'}</div><div class="state-grid"><div class="state-card" data-state="diagnostic-host"><h3>Host ELF</h3><strong>v${state.values.host}</strong><p>Intended source is v2</p></div><div class="state-card" data-state="diagnostic-memory"><h3>CPU memory</h3><strong>v${state.values.memory}</strong><p>Loaded application</p></div><div class="state-card" data-state="diagnostic-boot"><h3>Boot setup</h3><strong>v${state.values.boot}</strong><p>Persistent example</p></div></div><div class="lab-actions">${button('repair-build','Rebuild application')}${button('repair-load','Load matching ELF')}${button('repair-boot','Update boot setup & check power-on')}</div><p class="storage-note">${solved.size} of ${diagnosticCases.length} first mismatches identified. A first repair can reveal a later step; it is not proof of a complete physical system.</p>`));
    diagnosticCases.forEach((c,i)=>{root.querySelector(`#diagnosis-${i}`).onclick=()=>{state=createDiagnosis(i);draw();};});
    layers.forEach(([id])=>{root.querySelector(`#inspect-${id}`).onclick=()=>{state=inspectDiagnosis(state,id);draw();};});
    for(const action of ['build','load','boot'])root.querySelector(`#repair-${action}`).onclick=()=>{
      const result=repairDiagnosis(state,action);state=result.state;
      if(result.ok)solved.add(state.index);draw();api.feedback(result.message,result.ok?'success':'error');if(solved.size===diagnosticCases.length)api.complete();
    };
    root.querySelector('#reset-lab').onclick=()=>{state=createDiagnosis();solved.clear();draw();api.feedback('Diagnostic observations and decisions reset.','info');};
  }
  draw();
}
function delivery(root,api){
  let state=createDelivery();
  function draw(){
    preserveFocus(root,heading('Make the delivery reproducible.','The current generated BSP says v2, but the maintained configuration still says v1. A teammate must be able to recreate the result from the recorded inputs. Run a clean rebuild to expose hidden local assumptions.')+
      lab('Build the teammate handoff',`<div class="state-grid"><div class="state-card" data-state="maintained-config"><h3>Maintained configuration</h3><strong>v${state.configuration}</strong><p>Intended hardware: v2</p></div><div class="state-card" data-state="delivery-bsp"><h3>Generated support</h3><strong>v${state.bsp}</strong><p>${state.clean?'Created by the latest clean rebuild':'Existing local output'}</p></div><div class="state-card" data-state="delivery-elf"><h3>Application ELF</h3><strong>v${state.elf}</strong><p>Hardware assumptions used by the build</p></div></div><div class="lab-actions">${button('clean-delivery','Simulate a clean rebuild','primary')}${button('configure-delivery','Update maintained configuration to v2')}</div><div class="repository-panel" data-state="manifest"><h3>Delivery manifest</h3><p>Source revisions: ${state.sources?'firmware fw-b7 / hardware hw-h2 (illustrative IDs)':'not recorded'}</p><p>Environment: ${state.environment?'Classic 2023.2 / standalone; board not selected':'not recorded'}</p><p>Verification: ${state.evidence==='model-only'?'Model alignment checked; physical run and boot unverified':state.evidence==='unverified-physical-pass'?'Claims a physical boot pass without observations':'not recorded'}</p><p>Review state: ${state.ready?'Ready for teammate reproduction and bench planning':'Incomplete'}</p></div><div class="lab-actions">${button('record-sources','Record source revisions')}${button('record-environment','Record tool & target assumptions')}${button('record-evidence','Record the actual verification limits')}${button('claim-boot','Try treating build success as boot proof')}${button('validate-delivery','Check the handoff','primary')}</div><p class="storage-note">The board remains unselected. This delivery can describe the model and plan physical verification; it cannot honestly claim an actual board run.</p>`));
    for(const [id,action]of [['clean-delivery','clean'],['configure-delivery','configure'],['record-sources','sources'],['record-environment','environment'],['record-evidence','evidence'],['claim-boot','claim-boot'],['validate-delivery','validate']])root.querySelector(`#${id}`).onclick=()=>{
      const result=deliveryAction(state,action);state=result.state;draw();
      api.feedback(result.message||(action==='clean'?(state.bsp===1?'The clean rebuild recreated v1 support from the old maintained settings. The previous local v2 output was not a reproducible source of truth.':'The clean rebuild now reproduces support and application assumptions for hardware v2.'):action==='claim-boot'?'A build result does not provide physical boot observations. Correct the verification statement before handing this to another engineer.':action==='validate'?'The handoff is ready for teammate reproduction and planning, with physical verification explicitly pending.':'The manifest or maintained input updated. Recheck that the recorded versions and evidence agree.'),result.ok?'info':'error');
    };
    root.querySelector('#reset-lab').onclick=()=>{state=createDelivery();draw();api.feedback('The stale maintained settings and undocumented local output are restored.','info');};
    reflection(root,api,'zynq-delivery','What would you hand to another engineer so they can reproduce this result? Distinguish maintained inputs, artifacts, versions, and observations still needed on the real board.',()=>{if(!state.ready){api.feedback('Complete the reproducible handoff check before finishing the reflection.','info');return false;}return true;});
  }
  draw();
}
