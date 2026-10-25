export const files = [
  {id:'blink', path:'src/blink.c', before:'const unsigned blink_interval_ms = 1000;', after:'const unsigned blink_interval_ms = 500;', note:'The requested LED interval change.',tracked:true},
  {id:'test', path:'tests/blink_test.c', before:'assert(blink_interval_ms == 1000);', after:'assert(blink_interval_ms == 500);', note:'The corresponding test expectation.',tracked:true},
  {id:'readme', path:'README.md', before:'Connect the board before running the demo.', after:'', note:'An accidental deletion unrelated to the requested change.',tracked:true},
  {id:'build', path:'build/blink.elf', before:null, after:'[synthetic rebuildable binary]', note:'This project rebuilds its output, so its policy excludes this artifact.',tracked:false},
  {id:'local', path:'local-secret.example.txt', before:null, after:'DEMO_TOKEN=FAKE_NOT_A_REAL_SECRET', note:'Explicitly fake local data. Excluded from this example commit.',tracked:false}
];
const copy = (state) => structuredClone(state);
const signature = (value) => JSON.stringify(value);
export function createGit() {
  const head = Object.fromEntries(files.map(f => [f.id,f.before]));
  return {head, index:{...head}, working:Object.fromEntries(files.map(f => [f.id,f.after])), branch:'main', commits:[{id:'c0',message:'Initial example',snapshot:{...head}}], remote:1, checked:null};
}
export function stage(state, ids) {
  const next=copy(state);
  for (const id of ids) { if (!files.some(f=>f.id===id)) throw new Error('Unknown file'); next.index[id]=next.working[id]; }
  next.checked=null;
  return next;
}
export function unstage(state,id) {const next=copy(state);next.index[id]=next.head[id];next.checked=null;return next;}
export function editBlink(state,value=250) {const next=copy(state);next.working.blink=`const unsigned blink_interval_ms = ${value};`;return next;}
export function changes(state,area='index') {return files.filter(f=>state[area][f.id]!==state.head[f.id]);}
export function check(state) {
  const next=copy(state);
  const intended = files.filter(f=>f.id==='blink'||f.id==='test');
  const correct = intended.every(f=>next.index[f.id]===f.after) && files.filter(f=>!intended.includes(f)).every(f=>next.index[f.id]===next.head[f.id]);
  next.checked=correct ? signature(next.index) : null;
  return {state:next,ok:correct};
}
export function commit(state) {
  if (state.checked!==signature(state.index) || !changes(state).length) return {state,ok:false};
  const next=copy(state);next.head={...next.index};
  next.commits.push({id:`c${next.commits.length}`,message:'Change LED interval to 500 ms',snapshot:{...next.index}});
  next.checked=null;
  return {state:next,ok:true};
}
export function push(state) {const next=copy(state);next.remote=next.commits.length;return next;}
export function branch(state) {const next=copy(state);next.branch='experiment/led-interval';return next;}
export function preparedGit() {return stage(createGit(),['blink','test']);}
