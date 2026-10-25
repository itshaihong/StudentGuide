import {button,lab,heading,question,bindQuiz,preserveFocus,reflection,escape} from '../../learning/ui.mjs';
import {createPipeline,transition,status,compatible} from './model.mjs';

export function mount(chapter,root,api) {
  if(chapter===0)return roles(root,api);
  if(chapter===1)return fileMap(root,api);
  if(chapter===2)return pipeline(root,api,'application');
  if(chapter===3)return pipeline(root,api,'hardware');
  if(chapter===4)return pipeline(root,api,'load');
  return boot(root,api);
}

function roles(root,api) {
  let focus='ps',explored=new Set();
  function draw() {
    preserveFocus(root,heading('One device. Two kinds of work.','With STM32, you are used to a CPU executing your compiled program. Zynq adds programmable logic: circuitry configured for a different kind of job.')+
      lab('PS ↔ PL',`<div class="role-map"><div class="role-box"><strong>PS</strong><h3>Processing system</h3><p>Arm CPU cores run your application. Existing PS peripherals provide interfaces such as UART.</p></div><span class="role-bridge" aria-label="connected">↔</span><div class="role-box pl"><strong>PL</strong><h3>Programmable logic</h3><p>Configurable circuitry implements hardware. A PL peripheral can expose registers for the PS to access.</p></div></div><div class="lab-actions">${button('focus-ps','Follow a C instruction',focus==='ps'?'primary':'secondary')}${button('focus-pl','Follow a GPIO hardware change',focus==='pl'?'primary':'secondary')}</div><div class="terminal" style="margin-top:18px">${focus==='ps'?'Application C → compile & link → ELF → PS memory\nThe CPU executes instructions.':'Hardware design → implement → bitstream → PL configuration\nThe configured circuit behaves as hardware.'}</div><p class="storage-note">A simple PS-only design can work without a PL bitstream. Here the PL example is a separate, illustrative GPIO circuit.</p>`)+
      question('roles','You add a driver call in C. Does that create the missing GPIO circuit in PL?',['Yes. The compiler turns this driver call into the PL circuit.','No. The driver uses an interface that the hardware design must provide.','Only if the C source file is placed in a folder named PL.'])+
      '<div class="callout"><strong>Bridge from STM32.</strong> HAL drivers and board-support code help software interact with hardware. They overlap in purpose but are not interchangeable names. On Zynq, the software platform and its drivers must correspond to the hardware design.</div>');
    root.querySelector('#focus-ps').onclick=()=>{focus='ps';explored.add('ps');draw();api.feedback('The ELF contains the application program for the CPU. It is not a PL configuration.','info');};
    root.querySelector('#focus-pl').onclick=()=>{focus='pl';explored.add('pl');draw();api.feedback('The bitstream configures programmable logic. A driver does not manufacture that circuit.','info');};
    bindQuiz(root,'roles',1,['An ordinary driver call is compiled as CPU software. A hardware design and its configuration are separate.','Exactly. Software can use a register interface once the required hardware exists and is configured.','A folder name changes neither the target processor nor the kind of artifact produced.'],api,ok=>{if(ok&&explored.size===2)api.complete();else if(ok)api.feedback('Correct. Follow both paths once to compare their artifacts, then confirm the answer.','info');});
    root.querySelector('#reset-lab').onclick=()=>{focus='ps';explored.clear();draw();api.feedback('Both paths are ready to explore again.','info');};
  }
  draw();
}

const artifacts=[
  {id:'source',name:'main.c',kind:'Source',path:'app/src/main.c',producer:'You and your editor',consumer:'Compiler and application build',edit:'Edit the application here.',explanation:'This is application logic. Changing a string does not itself change the hardware configuration.'},
  {id:'xsa',name:'design.xsa',kind:'Handoff',path:'handoff/design.xsa',producer:'Vivado hardware export',consumer:'Vitis Classic platform creation or update',edit:'Regenerate from the hardware design; do not treat it as your application source.',explanation:'The handoff describes the hardware to the software tools. Bitstream inclusion depends on export options; this lab shows it separately.'},
  {id:'bsp',name:'BSP',kind:'Generated support',path:'platform / standalone domain / BSP',producer:'Platform and domain configuration with the selected drivers',consumer:'Application build and application code',edit:'Change reproducible settings or maintained driver sources, rather than patching generated headers.',explanation:'Support information and drivers depend on the hardware and software environment. They do not generate a complete application.'},
  {id:'linker',name:'lscript.ld',kind:'Configuration',path:'app/src/lscript.ld (illustrative)',producer:'Linker-script generation or a maintained project configuration',consumer:'Linker',edit:'Edit intentionally when you understand the target memory map.',explanation:'The linker script maps program sections to target memory. It does not decide which host folder contains your project.'},
  {id:'elf',name:'app.elf',kind:'Build output',path:'app/Debug/app.elf (illustrative)',producer:'Compile and link application sources with platform support',consumer:'Debugger / loader, or a board-specific boot packaging flow',edit:'Rebuild from source and configuration.',explanation:'An ELF on your computer is a file. Loading it creates program content in target memory; it does not automatically update boot storage.'},
  {id:'bit',name:'design.bit',kind:'Hardware output',path:'hardware / implementation output / design.bit',producer:'Vivado hardware implementation and bitstream generation',consumer:'PL programming or a board-specific boot flow',edit:'Regenerate from hardware sources and settings.',explanation:'The bitstream configures PL. It is different from the application ELF and needs to match the intended hardware design.'}
];
function fileMap(root,api) {
  let active='source',seen=new Set(['source']);
  function draw() {
    const f=artifacts.find(a=>a.id===active);
    preserveFocus(root,heading('Every file has a next reader.','An IDE’s project tree is a view, not the entire disk. Click each artifact to ask where it is, who produces it, who consumes it, and whether you should edit it.')+
      lab('FILE FIELD GUIDE',`<div class="artifact-grid">${artifacts.map(a=>`<button class="artifact-card ${active===a.id?'active':''}" id="artifact-${a.id}" type="button" aria-pressed="${active===a.id}"><code>${a.name}</code><small>${a.kind}${seen.has(a.id)?' · explored':''}</small></button>`).join('')}</div><div class="artifact-detail"><h3>${f.name} <span class="pill">${f.kind}</span></h3><p><strong>Illustrative location:</strong> <code>${f.path}</code></p><p><strong>Producer:</strong> ${f.producer}<br><strong>Next reader:</strong> ${f.consumer}</p><p>${f.edit} ${f.explanation}</p></div><p class="storage-note">Paths are teaching examples, not guarantees for every project or configuration. In Classic, a platform combines hardware information with software domains; a standalone domain targets a processor with its software support.</p>`)+
      question('linker','Your application is linked into DDR rather than another target memory region. Which file explains that placement?',['The folder containing main.c.','The linker script and the target memory configuration.','The filename of the PL bitstream.']));
    artifacts.forEach(f=>{root.querySelector(`#artifact-${f.id}`).onclick=()=>{active=f.id;seen.add(f.id);draw();};});
    bindQuiz(root,'linker',1,['A host folder locates source on your computer; it does not choose target memory placement.','Yes. The linker script assigns program sections to regions in the target memory map.','A bitstream filename does not map application sections into target CPU memory.'],api,ok=>{if(ok&&seen.size===artifacts.length)api.complete();else if(ok)api.feedback(`Right. Explore the remaining ${artifacts.length-seen.size} file cards before moving on.`,'info');});
    root.querySelector('#reset-lab').onclick=()=>{active='source';seen=new Set(['source']);draw();api.feedback('File cards reset.','info');};
  }
  draw();
}

function pipelineHtml(s,includeBoard=true) {
  const current=status(s);
  const nodes=[['hardware','Hardware sources',`design v${s.hardware}`],['xsa','XSA handoff',`hardware v${s.xsa}`],['platform','Platform & BSP',`hardware v${s.bsp}`],['elf','Application ELF',`source v${s.elf.source} / hardware v${s.elf.hardware}`],['bitstream','PL bitstream',`hardware v${s.bitstream}`],['running','Loaded on board',`source v${s.running.source} / hardware v${s.running.hardware} / PL v${s.running.bitstream}`]];
  return `<div class="pipeline-grid">${nodes.map(([id,title,version],i)=>`<div class="pipeline-node ${current[id]?'':'stale'}" data-node="${id}"><span class="node-step">${String(i+1).padStart(2,'0')}</span><strong>${title}</strong><code>${version}</code><span class="node-badge">${current[id]?'✓ Matches intended design':'! Needs attention'}</span></div>`).join('')}</div>${includeBoard?`<div class="board-state"><div><h3>CPU memory · loaded program</h3><strong>“${s.running.source===1?'Hello':'Hello, Zynq'}”</strong><p>Application source v${s.running.source}</p></div><div><h3>PL configuration</h3><strong>Hardware v${s.running.bitstream}</strong><p class="${current.running?'':'warning'}">${current.running?'Loaded artifacts match this example.':'Loaded artifacts differ from the intended design.'}</p></div></div>`:''}`;
}
function pipeline(root,api,mode) {
  let state=createPipeline(),changed=false,quiz=false;
  if(mode==='load'){
    for(const action of ['edit-hardware','export-xsa','platform','build-app','bitstream'])state=transition(state,action).state;
  }
  const config={
    application:{title:'Change software. Watch what stays put.',intro:'This example changes only the application’s greeting. Predict the affected artifacts, then rebuild and load. There is no reason to change the hardware for this edit.',task:'Change “Hello” to “Hello, Zynq”. Then make the new greeting appear in the loaded CPU program.',question:'Which artifact can stay unchanged for this application-only edit?',answers:['The application ELF.','The PL bitstream.','The program already loaded in CPU memory.'],correct:1,feedback:['The new source needs a new ELF before it can be loaded.','Right. The hardware design did not change, so this example keeps the same bitstream.','CPU memory still holds the previously loaded program until a load or boot operation replaces it.']},
    hardware:{title:'A hardware change has downstream readers.',intro:'In this particular scenario, the software-visible GPIO interface changed. A new ELF built from stale platform information can still carry old assumptions. Inspect the versions as you repair the chain.',task:'Apply hardware interface v2. Export its handoff, update the software platform, rebuild the application and bitstream, and load matching artifacts.',question:'The hardware interface is v2, but the BSP still describes v1. Is rebuilding only the application enough?',answers:['Yes. A new ELF is always enough.','No. First align the platform and BSP with the new hardware handoff.','Yes, if I rename the old XSA to v2.xsa.'],correct:1,feedback:['Recompiling against the old platform can preserve old hardware assumptions. Watch the ELF’s hardware version.','Exactly. The application needs software support corresponding to the changed interface.','Renaming a file does not update its hardware information or rebuild its consumers.']},
    load:{title:'Built does not mean loaded.',intro:'This station starts with a complete, matching v2 build on your computer. The board still has v1. Follow the load step, then identify what the new files do and do not prove.',task:'Load the matching host artifacts and inspect the separate CPU and PL state.',question:'You generated a v2 bitstream on your computer. What proves the board is using v2?',answers:['The new file exists in the build folder.','The application compiled successfully.','The correct artifacts were loaded and the board’s behavior was checked.'],correct:2,feedback:['Generating a host file does not program the board. The loaded configuration can remain old.','An application build alone does not verify which PL configuration is loaded.','Yes. Loading is a distinct step, and a real project still needs observed board behavior. This simulation only illustrates version alignment.']}
  }[mode];
  function done(){if(status(state).running&&changed&&quiz)api.complete();}
  function draw() {
    preserveFocus(root,heading(config.title,config.intro)+'<div class="callout"><strong>Your task:</strong> '+config.task+'</div>'+lab('ARTIFACT PIPELINE',pipelineHtml(state)+`<div class="lab-actions">${mode==='load'?'':button('apply-change',mode==='application'?'Change greeting in main.c':'Change GPIO interface to v2','primary',changed)}${mode==='hardware'?button('export-xsa','Export XSA')+button('update-platform','Update platform & BSP'):''}${mode==='load'?'':button('build-app','Build application')}${mode==='hardware'?button('generate-bit','Generate bitstream'):''}${button('load-board','Load over JTAG',mode==='load'?'primary':'secondary')}</div><p class="pipeline-caption">Dependencies: hardware → XSA → platform/BSP → application ELF; hardware → bitstream. Loading consumes the host artifacts. Version labels expose this example’s dependencies, not every real incremental-build rule.</p>`)+question('pipeline',config.question,config.answers));
    if(mode!=='load')root.querySelector('#apply-change').onclick=()=>{state=transition(state,mode==='application'?'edit-app':'edit-hardware').state;changed=true;draw();api.feedback(mode==='application'?'Only application source changed. The existing ELF and loaded program are now old. The hardware artifacts still match.':'The intended hardware interface is now v2. Follow the old downstream artifacts to find what needs updating.','info');};
    if(mode==='hardware'){
      root.querySelector('#export-xsa').onclick=()=>act('export-xsa','The exported handoff now describes the current hardware. Existing software support has not updated itself.');
      root.querySelector('#update-platform').onclick=()=>act('platform','The platform and BSP now use the exported XSA. Check whether that XSA actually matches the intended hardware.');
      root.querySelector('#generate-bit').onclick=()=>act('bitstream','The host bitstream now represents the current hardware. The board’s loaded PL configuration is separate.');
    }
    if(mode!=='load')root.querySelector('#build-app').onclick=()=>{
      state=transition(state,'build-app').state;
      const stale=!status(state).elf;draw();
      api.feedback(stale?'The build produced an ELF, but its hardware assumptions are still old. Export the current XSA, update the platform/BSP, then build again.':'The host ELF now matches the source and the hardware described by its BSP. The loaded program did not change.',stale?'error':'info');done();
    };
    root.querySelector('#load-board').onclick=()=>{
      state=transition(state,'load').state;if(mode==='load')changed=true;draw();
      api.feedback(status(state).running?'The illustrated CPU program and PL configuration now match the intended versions. This is a simulated load, not a physical board test.':'The load copied the available host artifacts, but they are still old or inconsistent. Loading cannot repair a stale build.',status(state).running?'success':'error');done();
    };
    bindQuiz(root,'pipeline',config.correct,config.feedback,api,ok=>{quiz=ok;if(ok)done();});
    root.querySelector('#reset-lab').onclick=()=>{state=createPipeline();changed=false;quiz=false;if(mode==='load')for(const action of ['edit-hardware','export-xsa','platform','build-app','bitstream'])state=transition(state,action).state;draw();api.feedback('This station is back at its stated initial versions.','info');};
  }
  function act(action,text){state=transition(state,action).state;draw();api.feedback(text,'info');done();}
  draw();
}

function boot(root,api) {
  let state=transition(createPipeline(),'edit-app').state;
  state=transition(state,'build-app').state;
  state=transition(state,'load').state;
  let sawOldBoot=false,packaged=false,bootedNew=false,quiz=false;
  function draw() {
    preserveFocus(root,heading('Run is not the same as boot.','You loaded application v2 over JTAG. The boot setup still contains v1. A power cycle is a useful way to expose the difference—here, without needing a physical board.')+
      lab('HOST FILE → MEMORY → PERSISTENT BOOT',`<div class="state-grid"><div class="state-card"><h3>Host ELF</h3><strong>v${state.elf.source}</strong><p>A file on the computer</p></div><div class="state-card ${state.running.source===state.elf.source?'current':'stale'}"><h3>CPU memory</h3><strong>v${state.running.source}</strong><p>The loaded program: “${state.running.source===1?'Hello':'Hello, Zynq'}”</p></div><div class="state-card ${state.boot.source===state.elf.source?'current':'stale'}"><h3>Boot setup</h3><strong>v${state.boot.source}</strong><p>What this model loads at power-on</p></div></div><div class="lab-actions">${button('power-cycle','Power cycle the model','primary')}${button('prepare-boot','Prepare & install example boot setup','secondary',!sawOldBoot||packaged)}</div><p class="storage-note">The model assumes a valid boot setup already exists and can be replaced. Real boot packaging, boot components, storage, and board switches must be verified for the actual board. This button is not a universal Bootgen procedure.</p>`)+
      question('boot','A teammate says, “It ran through JTAG, so it will start itself tomorrow.” What is missing?',['Nothing: a successful debug run permanently updates boot storage.','Evidence that the matching boot contents and board boot settings are in place.','A different name for the same ELF file.']));
    root.querySelector('#power-cycle').onclick=()=>{
      state=transition(state,'power').state;
      if(state.running.source===1)sawOldBoot=true;
      if(packaged&&state.running.source===2)bootedNew=true;
      draw();api.feedback(state.running.source===1?'The old greeting came back. Power-on used the v1 boot setup, not the v2 ELF sitting on your computer.':'The new greeting survived this simulated power cycle because the boot setup was updated. A real board still needs this observation to be checked.',state.running.source===1?'info':'success');
    };
    root.querySelector('#prepare-boot').onclick=()=>{
      const result=transition(state,'package');state=result.state;packaged=result.ok;draw();api.feedback(result.ok?'The model’s persistent boot setup now references the matching host artifacts. Power cycle again to test the difference.':'The host artifacts are inconsistent. Repair them before preparing boot contents.',result.ok?'info':'error');
    };
    root.querySelector('#reset-lab').onclick=()=>{state=createPipeline();for(const action of ['edit-app','build-app','load'])state=transition(state,action).state;sawOldBoot=false;packaged=false;bootedNew=false;quiz=false;draw();api.feedback('The JTAG-loaded program is v2 and boot setup is v1 again.','info');};
    bindQuiz(root,'boot',1,['JTAG loading and updating persistent boot contents are separate operations.','Exactly. A debug run does not establish the contents or configuration used at power-on.','A filename change does not change the loaded program or the persistent boot setup.'],api,ok=>{quiz=ok;});
    reflection(root,api,'zynq-7000','You changed the application and loaded it over JTAG. Explain how the host ELF, CPU memory, PL configuration, and boot setup can tell different stories.',()=>{
      if(!sawOldBoot||!packaged||!bootedNew||!quiz){api.feedback('Observe the old program after a power cycle, update the example boot setup, power cycle again, and answer the final question before finishing.','info');return false;}return true;
    });
  }
  draw();
}
