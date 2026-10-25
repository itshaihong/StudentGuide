/** Conceptual instruction stepping and a one-bit PL circuit, not a Zynq emulator. */
export function createExecution(){return {loaded:false,configured:false,pc:0,request:0,control:0,enable:1,steps:0,writes:0,inputChanges:0,last:'Ready to load software and configure hardware.'};}
export function outputOf(s){return s.configured?s.control & s.enable:null;}
export function executionAction(state,action){
  const s={...state};
  if(action==='load'){
    s.loaded=true;s.pc=0;s.request=0;s.last='Application ELF loaded into target program memory. The PL configuration did not change.';
  }else if(action==='configure'){
    s.configured=true;s.control=0;s.last='Bitstream configured the register, AND logic, and connections. The CPU program did not execute.';
  }else if(action==='step'){
    if(!s.loaded)return {state,ok:false,message:'Load the application ELF before stepping its instructions.'};
    if(s.pc===0){s.request=1;s.pc=1;s.steps++;s.last='The CPU executed request = 1. This changed a software value, not the PL control register.';}
    else if(s.pc===1){
      if(!s.configured)return {state,ok:false,message:'The model stops before the register write: the required PL peripheral is not configured. A C driver call cannot create it. Configure the PL, then step again.'};
      s.control=s.request;s.pc=2;s.steps++;s.writes++;s.last='The CPU wrote 1 through the PS–PL interface into the circuit’s control register. The configured AND logic now evaluates both inputs.';
    }else return {state,ok:false,message:'The CPU is paused after the write. Toggle the hardware input and watch the PL output without another instruction.'};
  }else if(action==='toggle'){
    s.enable=1-s.enable;s.inputChanges++;s.last=s.configured?'The external enable input changed. The configured AND logic responds without another CPU instruction.':'The external input changed, but this model has no configured PL circuit to evaluate it yet.';
  }else throw new Error('Unknown execution action');
  return {state:s,ok:true,message:s.last};
}
