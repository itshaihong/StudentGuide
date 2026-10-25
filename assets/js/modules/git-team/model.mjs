const copy=state=>structuredClone(state);
export function threeWay(base,ours,theirs){
  const files={},conflicts=[];
  for(const key of new Set([...Object.keys(base),...Object.keys(ours),...Object.keys(theirs)])){
    if(ours[key]===theirs[key])files[key]=ours[key];
    else if(ours[key]===base[key])files[key]=theirs[key];
    else if(theirs[key]===base[key])files[key]=ours[key];
    else conflicts.push(key);
  }
  return {files,conflicts};
}
export function createTeam(){return {
  commits:{a:{parents:[],files:{statusReport:false,samplerSafe:false}}},
  main:'a',feature:null,current:'main',remoteMain:'a',trackingMain:'a',sharedFeature:null,checked:null
};}
export function teamAction(state,action){
  const next=copy(state);
  switch(action){
    case 'branch':next.feature??=next.main;next.current='feature/status';break;
    case 'feature':
      if(next.current!=='feature/status'||next.feature!=='a')return {state,ok:false,message:'Create the feature branch before making its example commit.'};
      next.commits.b={parents:['a'],files:{statusReport:true,samplerSafe:false}};next.feature='b';next.checked=null;break;
    case 'teammate':next.commits.c={parents:['a'],files:{statusReport:false,samplerSafe:true}};next.remoteMain='c';break;
    case 'fetch':next.trackingMain=next.remoteMain;break;
    case 'ff-only':
      if(next.feature==='b'&&next.trackingMain==='c')return {state,ok:false,message:'The histories diverged. A fast-forward cannot move the feature pointer to main without dropping its separate commit. Inspect the changes and use the team’s chosen integration method.'};
      return {state,ok:false,message:'Fetch and inspect both branch tips before selecting an integration method.'};
    case 'merge':{
      if(next.feature!=='b'||next.trackingMain!=='c')return {state,ok:false,message:'This checkpoint needs feature commit b and fetched origin/main at c.'};
      const result=threeWay(next.commits.a.files,next.commits.b.files,next.commits.c.files);
      if(result.conflicts.length)return {state,ok:false,message:'The example needs content resolution.'};
      next.commits.m={parents:['b','c'],files:result.files};next.feature='m';next.checked=null;break;
    }
    case 'test':{
      const files=next.commits[next.feature||next.main].files;
      if(!files.statusReport||!files.samplerSafe)return {state,ok:false,message:'The integration check needs both the status report and the sampler fix. A feature-only result does not satisfy the team task.'};
      next.checked=next.feature;break;
    }
    case 'push':
      if(next.checked!==next.feature||!next.checked)return {state,ok:false,message:'Run the integration checks on this exact feature tip before sharing the handoff.'};
      next.sharedFeature=next.feature;break;
    default:throw new Error('Unknown team action');
  }
  return {state:next,ok:true};
}
export function preparedTeam(integrated=false){
  let state=createTeam();
  for(const action of ['branch','feature','teammate',...(integrated?['fetch','merge']:[])])state=teamAction(state,action).state;
  return state;
}
export function createConflict(){return {choice:null,config:null,checked:false,committed:false};}
export function resolveConflict(state,choice){
  const configs={ours:{report:500,sample:500},theirs:{report:250,sample:250},split:{report:500,sample:250}};
  if(!configs[choice])throw new Error('Unknown resolution');
  return {...state,choice,config:configs[choice],checked:false,committed:false};
}
export function checkConflict(state){
  const ok=state.config?.report===500&&state.config?.sample===250;
  return {state:{...state,checked:ok},ok};
}
export function finishConflict(state){return {state:state.checked?{...state,committed:true}:state,ok:state.checked};}
