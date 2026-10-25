import {button,lab,heading,question,bindQuiz,preserveFocus} from '../../learning/ui.mjs';
import {createExecution,executionAction,outputOf} from './execution-model.mjs';

export function roles(root,api){
  let s=createExecution(),sawIndependentLogic=false;
  function draw(){
    const output=outputOf(s);
    preserveFocus(root,heading('Software executes. A circuit responds.','Both sides are hardware. The Processing System (PS) contains fixed CPU hardware that executes software. The Programmable Logic (PL) becomes the digital circuit described by its configuration.')+
      lab('Inside a Zynq system',`
      <div class="build-lanes" aria-label="Two separate build paths">
        <div class="build-lane"><strong>Software path</strong><p>C source → compile & link → application ELF</p><span class="flow-down" aria-hidden="true">↓</span><span>Load into target program memory</span>${button('load-program',s.loaded?'Reload application ELF':'1. Load application ELF','primary')}</div>
        <div class="build-lane"><strong>Hardware path</strong><p>Hardware design → implement → bitstream</p><span class="flow-down" aria-hidden="true">↓</span><span>Configure logic and connections in PL</span>${button('configure-logic',s.configured?'Reconfigure PL':'2. Configure PL')}</div>
      </div>
      <div class="soc-frame"><p class="soc-label">Zynq device · two cooperating hardware subsystems</p>
        <div class="soc-columns">
          <section class="soc-panel ps-panel" aria-labelledby="ps-heading"><h3 id="ps-heading">PS <span>Processing System</span></h3><p>Fixed CPU cores and peripherals</p>
            <div class="program-memory" data-state="program-memory"><strong>Application in target memory</strong><p>${s.loaded?'Loaded from the ELF':'No application loaded in this model'}</p><ol class="instruction-list" aria-label="Illustrative program">${['request = 1;','write_control(request);','Pause CPU stepping'].map((line,i)=>`<li class="${s.loaded&&s.pc===i?'instruction-active':''}"><code>${line}</code>${s.loaded&&s.pc===i?'<span>← next</span>':''}</li>`).join('')}</ol></div>
            <div class="cpu-core" data-state="cpu-core"><strong>CPU · Central Processing Unit</strong><p>${!s.loaded?'Waiting for software':s.pc===2?'Paused after the register write':'Paused before the next instruction'}</p><p>Instructions executed: <b>${s.steps}</b> · software request: <b>${s.request}</b></p></div>
            ${button('step-cpu','3. Step CPU instruction','primary',!s.loaded||s.pc===2)}
          </section>
          <section class="soc-panel pl-panel ${s.configured?'configured':'unconfigured'}" aria-labelledby="pl-heading"><h3 id="pl-heading">PL <span>Programmable Logic</span></h3><p data-state="logic-config">${s.configured?'Configured digital circuit':'Awaiting a bitstream configuration'}</p>
            <div class="logic-register" data-state="control-register"><strong>Memory-mapped control register</strong><p>Stored bit: <b>${s.configured?s.control:'—'}</b></p></div>
            <div class="logic-circuit" aria-label="Control bit AND external enable produces the output">
              <div class="signal-inputs"><div data-state="control-input">Control <b>${s.configured?s.control:'—'}</b></div><div data-state="enable-input">External enable <b>${s.enable}</b></div></div>
              <div class="gate-symbol" aria-hidden="true"><svg viewBox="0 0 180 120"><path class="circuit-wire" d="M0 30H55 M0 90H55 M135 60H180"/><path class="and-gate" d="M55 10H85 A50 50 0 0 1 85 110H55Z"/></svg><strong>AND</strong></div>
              <div class="logic-output ${output===1?'signal-high':''}" data-state="logic-output"><span>Output</span><strong>${output===null?'—':output}</strong><span>${output===null?'Unconfigured':output?'High':'Low'}</span></div>
            </div><p class="logic-equation">Output = control AND enable</p>
            ${button('toggle-enable',`Toggle external enable (now ${s.enable})`)}
          </section>
        </div>
        <div class="soc-bus" data-state="register-bus"><strong>PS → PL · memory-mapped register write</strong><p>${s.writes?`${s.writes} write accepted. The circuit’s stored control bit is ${s.control}.`:'No register write yet. Software must access a circuit that exists.'}</p></div>
      </div>
      <p class="experiment-status" data-state="execution-result" aria-live="polite">${s.last}</p>
      <div class="experiment-challenge"><strong>Try it:</strong> load the program, step before configuring PL, then configure and complete the write. With the CPU paused, toggle the external enable.</div>
      <details class="diagram-notes"><summary>Read this diagram</summary><p>The ELF (Executable and Linkable Format) holds the CPU program. The bitstream configures digital hardware; it is not a sequence of CPU instructions.</p><p>The register and AND gate are one illustrative PL design. PL can also implement clocked circuits, state machines, and parallel datapaths. This example abstracts bus timing, clocks, resets, addresses, and electrical details. Target memory may be on-chip or external; it is not all inside the PS.</p><p>A PS-only application can work without a PL bitstream. This experiment deliberately uses a PL peripheral. It is a conceptual model, not a physical board test.</p></details>`)+
      question('roles','You add a driver call in C. Does that create the missing digital circuit in PL?',['Yes. The compiler turns this driver call into the PL circuit.','No. The driver uses an interface that the hardware design must provide.','Only if the C source is placed in a folder named PL.']));
    for(const [id,action]of [['load-program','load'],['configure-logic','configure'],['step-cpu','step'],['toggle-enable','toggle']])root.querySelector(`#${id}`).onclick=()=>{
      const before=outputOf(s),steps=s.steps,result=executionAction(s,action);s=result.state;
      if(action==='toggle'&&s.pc===2&&before!==outputOf(s)&&s.steps===steps)sawIndependentLogic=true;
      draw();api.feedback(result.message,result.ok?'info':'error');
    };
    bindQuiz(root,'roles',1,['An ordinary driver call is CPU software. A hardware design and configuration supply the PL circuit.','Exactly. The PS executes software, and the configured PL implements the digital logic that software can access.','A folder name does not change the target processor or create a circuit.'],api,ok=>{if(ok&&s.writes>0&&sawIndependentLogic)api.complete();else if(ok)api.feedback('Correct. Complete the register write, then change the hardware input with the CPU paused to observe both kinds of behavior.','info');});
    root.querySelector('#reset-lab').onclick=()=>{s=createExecution();sawIndependentLogic=false;draw();api.feedback('The application and PL configuration are unloaded in this model again.','info');};
  }
  draw();
}
