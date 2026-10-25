const clone = (state) => structuredClone(state);
export function createPipeline() {return {hardware:1,xsa:1,platform:1,bsp:1,source:1,elf:{hardware:1,source:1},bitstream:1,running:{hardware:1,source:1,bitstream:1},boot:{hardware:1,source:1,bitstream:1}};}
export function transition(state,action) {
  const next=clone(state);
  switch(action) {
    case 'edit-app': next.source++;break;
    case 'edit-hardware':next.hardware++;break;
    case 'export-xsa':next.xsa=next.hardware;break;
    case 'platform':next.platform=next.xsa;next.bsp=next.xsa;break;
    case 'build-app':next.elf={hardware:next.bsp,source:next.source};break;
    case 'bitstream':next.bitstream=next.hardware;break;
    case 'load':next.running={...next.elf,bitstream:next.bitstream};break;
    case 'package':if(!compatible(next)) return {state,ok:false};next.boot={...next.elf,bitstream:next.bitstream};break;
    case 'power':next.running={...next.boot};break;
    default:throw new Error('Unknown pipeline action');
  }
  return {state:next,ok:true};
}
export function status(s) {return {
  hardware:true,xsa:s.xsa===s.hardware,platform:s.platform===s.hardware&&s.bsp===s.hardware,
  elf:s.elf.hardware===s.hardware&&s.elf.source===s.source,bitstream:s.bitstream===s.hardware,
  running:s.running.hardware===s.hardware&&s.running.source===s.source&&s.running.bitstream===s.hardware,
  boot:s.boot.hardware===s.hardware&&s.boot.source===s.source&&s.boot.bitstream===s.hardware
};}
export function compatible(s) {const current=status(s);return current.xsa&&current.platform&&current.elf&&current.bitstream;}
