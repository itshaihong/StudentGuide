const baseline={source:'const unsigned blink_interval_ms = 1000;',test:'assert(blink_interval_ms == 1000);',readme:'Connect the board before running the demo.'};
export function createSolo(){return {initialized:false,working:{...baseline},index:null,commits:[]};}
export function soloAction(state,action){
  const next=structuredClone(state);
  if(action==='init'){next.initialized=true;return {state:next,ok:true};}
  if(!next.initialized)return {state,ok:false,message:'Initialize Git management for this existing folder first.'};
  if(action==='stage'){next.index={...next.working};return {state:next,ok:true};}
  if(action==='commit'){
    if(!next.index)return {state,ok:false,message:'Select the baseline content for the index before committing.'};
    next.commits.push({id:'c0',snapshot:{...next.index}});return {state:next,ok:true};
  }
  if(action==='edit'){
    if(!next.commits.length)return {state,ok:false,message:'Record the known starting point before trying the change.'};
    next.working.source='const unsigned blink_interval_ms = 500;';return {state:next,ok:true};
  }
  throw new Error('Unknown solo action');
}
