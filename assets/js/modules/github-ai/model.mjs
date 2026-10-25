const clone=state=>structuredClone(state);
export const promptParts=[
  {id:'goal',label:'The problem and inclusive range: 1 through 10',required:true},
  {id:'paths',label:'The validator and its tests, with relevant context',required:true},
  {id:'conventions',label:'Project conventions and maintained instructions',required:true},
  {id:'verification',label:'Boundary checks for 0, 1, 10, and 11',required:true},
  {id:'scope',label:'Limit the patch and explain any unrelated change',required:true},
  {id:'secrets',label:'Local credentials from .env',required:false},
  {id:'rewrite',label:'Permission to rewrite unrelated parts of the repository',required:false}
];
export function checkPrompt(ids){
  const chosen=new Set(ids);
  const forbidden=['secrets','rewrite'].filter(id=>chosen.has(id));
  const missing=promptParts.filter(p=>p.required&&!chosen.has(p.id)).map(p=>p.id);
  return {ok:!forbidden.length&&!missing.length,forbidden,missing};
}
export function acceptsCount(count,inclusive){return Number.isInteger(count)&&count>=1&&(inclusive?count<=10:count<10);}
export function createReview(){return {revision:1,inclusive:false,boundaries:false,ci:null,reviewed:null,merged:null,tagged:null,released:false,docsUpdated:false};}
export function reviewAction(state,action,target){
  const next=clone(state);
  switch(action){
    case 'boundaries':if(!next.boundaries){next.boundaries=true;next.revision++;}break;
    case 'fix':if(!next.inclusive){next.inclusive=true;next.revision++;}break;
    case 'docs':if(!next.docsUpdated){next.docsUpdated=true;next.revision++;}break;
    case 'ci':{
      const inputs=next.boundaries?[0,1,5,10,11]:[5];
      const cases=inputs.map(value=>({value,expected:value>=1&&value<=10,actual:acceptsCount(value,next.inclusive)}));
      next.ci={revision:next.revision,ok:cases.every(item=>item.expected===item.actual),cases};break;
    }
    case 'approve':
      if(!reviewReady(next))return {state,ok:false,message:'Review needs the full boundary checks passing for the current revision. A green old or incomplete check is insufficient.'};
      next.reviewed=next.revision;break;
    case 'merge':
      if(!reviewReady(next)||next.reviewed!==next.revision)return {state,ok:false,message:'The current revision needs passing checks and current review before this project permits merging.'};
      next.merged=next.revision;break;
    case 'tag':
      if(next.merged===null||target!==next.merged)return {state,ok:false,message:'The release tag must identify the intended tested, merged revision, rather than the older proposal.'};
      next.tagged=target;break;
    case 'release':
      if(next.tagged!==next.merged||next.merged===null)return {state,ok:false,message:'Choose the tested merged revision for the tag before preparing this release.'};
      next.released=true;break;
    default:throw new Error('Unknown review action');
  }
  return {state:next,ok:true};
}
export function reviewReady(s){return Boolean(s.boundaries&&s.ci?.ok&&s.ci.revision===s.revision);}
export function preparedReview(){let s=createReview();for(const action of ['boundaries','fix','ci','approve'])s=reviewAction(s,action).state;return s;}
