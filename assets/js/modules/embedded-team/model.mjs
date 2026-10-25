import {createPipeline,transition,compatible} from '../zynq-7000/model.mjs';
export const projectItems=[
  {path:'app/src/main.c',kind:'git',reason:'Maintain application logic in Git so the next engineer can review and rebuild it.'},
  {path:'hardware/build.tcl + constraints/board.xdc',kind:'git',reason:'Maintain the design recipe and constraints together. An isolated project-entry file is not the full hardware source set.'},
  {path:'platform/domain-settings.tcl',kind:'git',reason:'Keep reproducible platform/domain settings as maintained inputs.'},
  {path:'platform/generated/xparameters.h',kind:'generated',reason:'Under this project policy, regenerate this support header from maintained inputs instead of hand-editing it as the design authority.'},
  {path:'handoff/design-v2.xsa',kind:'artifact',reason:'The policy publishes a versioned handoff artifact with its source revision. It is not application source.'},
  {path:'app/Debug/app.elf',kind:'artifact',reason:'The release keeps the produced ELF with its build context. Rebuild it from maintained source and configuration.'},
  {path:'The program already in CPU memory',kind:'target',reason:'This is target state, not a host source file. A new host ELF does not update it automatically.'}
];
export function createContract(){
  const pipeline=createPipeline();pipeline.hardware=2;pipeline.bitstream=2;
  return {pipeline,inspected:false,accepted:false};
}
export function contractAction(state,action){
  const next=structuredClone(state);
  if(action==='inspect')next.inspected=true;
  else if(action==='select-xsa')next.pipeline=transition(next.pipeline,'export-xsa').state;
  else if(action==='platform')next.pipeline=transition(next.pipeline,'platform').state;
  else if(action==='build')next.pipeline=transition(next.pipeline,'build-app').state;
  else if(action==='accept'){
    if(!next.inspected||!compatible(next.pipeline))return {state,ok:false,message:'The filename is not evidence of compatibility. Inspect the handoff and align the XSA, platform/BSP, ELF, and bitstream before accepting the package.'};
    next.accepted=true;
  }else throw new Error('Unknown handoff action');
  if(action!=='accept')next.accepted=false;
  return {state:next,ok:true};
}
export const diagnosticCases=[
  {id:'build',title:'A source edit does not appear',needed:['source','host'],repair:'build',initial:{source:2,host:1,memory:1,boot:1},observations:{source:'The intended source is v2.',host:'The host ELF still contains application v1.',memory:'CPU memory still contains v1.',boot:'The persistent boot example contains v1.'},explanation:'The first mismatch is source → host ELF. Rebuild the application first; a later load will still be needed.'},
  {id:'load',title:'The new host ELF is ready',needed:['host','memory'],repair:'load',initial:{source:2,host:2,memory:1,boot:1},observations:{source:'The intended source is v2.',host:'The host ELF is application v2.',memory:'CPU memory still contains v1.',boot:'Boot storage still contains the old example.'},explanation:'The first mismatch is host ELF → loaded memory. Rebuilding the same host inputs again does not load the program.'},
  {id:'boot',title:'It worked until the power cycle',needed:['memory','boot'],repair:'boot',initial:{source:2,host:2,memory:1,boot:1},observations:{source:'The intended source is v2.',host:'The host ELF is application v2.',memory:'Run history: JTAG ran v2; after power-on the program became v1.',boot:'The persistent boot setup still selects v1.'},explanation:'The run history isolates the startup path. Update and verify the board-specific boot setup; another temporary JTAG run would not establish persistence.'}
];
export function createDiagnosis(index=0){return {index,seen:[],values:{...diagnosticCases[index].initial},repaired:false};}
export function inspectDiagnosis(state,layer){return {...state,seen:[...new Set([...state.seen,layer])]};}
export function repairDiagnosis(state,action){
  const item=diagnosticCases[state.index];
  if(!item.needed.every(layer=>state.seen.includes(layer)))return {state,ok:false,message:'Collect the relevant observations before selecting the first repair.'};
  if(action!==item.repair)return {state,ok:false,message:action==='build'?'A rebuild changes a host artifact. It does not by itself load memory or establish power-on contents.':action==='load'?'A load copies an available artifact. It cannot repair a stale build or establish persistent boot contents.':'Boot work is not the first repair when the intended host artifact has not been built or loaded.'};
  const next=structuredClone(state);next.repaired=true;
  if(action==='build')next.values.host=2;
  if(action==='load')next.values.memory=2;
  if(action==='boot'){next.values.boot=2;next.values.memory=2;}
  return {state:next,ok:true,message:item.explanation};
}
export function createDelivery(){return {hardware:2,configuration:1,bsp:2,elf:2,bitstream:2,clean:false,sources:false,environment:false,evidence:null,ready:false};}
export function deliveryAction(state,action){
  const next=structuredClone(state);next.ready=false;
  switch(action){
    case 'sources':next.sources=true;break;
    case 'environment':next.environment=true;break;
    case 'configure':next.configuration=next.hardware;next.clean=false;break;
    case 'clean':next.bsp=next.configuration;next.elf=next.bsp;next.clean=true;break;
    case 'evidence':next.evidence='model-only';break;
    case 'claim-boot':next.evidence='unverified-physical-pass';break;
    case 'validate':{
      const versions=next.configuration===next.hardware&&next.bsp===next.hardware&&next.elf===next.hardware&&next.bitstream===next.hardware;
      if(!versions||!next.clean||!next.sources||!next.environment||next.evidence!=='model-only')return {state,ok:false,message:'The handoff needs maintained matching configuration, a clean rebuild, source and environment records, and an honest statement of verification limits.'};
      next.ready=true;break;
    }
    default:throw new Error('Unknown delivery action');
  }
  return {state:next,ok:true};
}
