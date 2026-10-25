import {clearReflectionDraft,setCheckpointContext,escape} from './ui.mjs';
import {setTerms,bindTerms} from './terms.mjs';
import {modulesIn,completedIds} from './curriculum.mjs';
import {controllerLoaders} from './registry.mjs';

const catalog=JSON.parse(document.getElementById('curriculum-data').textContent);
const definitions=JSON.parse(document.getElementById('terms-data').textContent);
const allModules=modulesIn(catalog);
const module=allModules.find(item=>item.id===document.body.dataset.module);
const course=document.body.dataset.course;
const legacyTitles={git:['Locate your workspace','Review & stage','Catch the snapshot','Commit & share','Recover & explain'],'zynq-7000':['Two kinds of work','Meet the files','Change the application','Update the hardware','Load the right artifacts','Run is not boot']};
const legacyTerms={git:[['clone','working-tree'],['diff','staging'],['staging','commit'],['branch','remote'],['head','revert']],'zynq-7000':[['ps','pl'],['xsa','bsp','elf'],['elf','bitstream'],['platform','bsp'],['jtag','bitstream'],['boot','jtag']]};
const lessons=module?.lessons || legacyTitles[course].map((title,i)=>({id:`legacy-${i}`,title,controller:course,station:i,terms:legacyTerms[course][i]}));
const root=document.getElementById('lesson-root');
const key=module?`studentguide:activity:v2:${module.id}`:`studentguide:activity:v1:${course}`;
let saved={},storageAvailable=true;
try{saved=JSON.parse(localStorage.getItem(key)||'{}')||{};}catch{storageAvailable=false;}
let completed=completedIds(saved.completed,lessons);
let reflectionText=typeof saved.reflection==='string'?saved.reflection.slice(0,2000):'';
let chapter=0;
const feedback=document.getElementById('lesson-feedback');
const loaded=new Map(await Promise.all([...new Set(lessons.map(l=>l.controller))].map(async id=>[id,await controllerLoaders[id]()] )));
bindTerms(root);

function persist(){
  const record=module?[...completed]:[...completed].map(id=>lessons.findIndex(l=>l.id===id));
  try{localStorage.setItem(key,JSON.stringify({completed:record,reflection:reflectionText}));}catch{storageAvailable=false;}
}
function navigation(){
  document.getElementById('chapter-nav').innerHTML=lessons.map((lesson,i)=>`<a href="#chapter-${i+1}" class="chapter-link ${completed.has(lesson.id)?'completed':''}" ${i===chapter?'aria-current="step"':''}><span class="chapter-index">${completed.has(lesson.id)?'✓':String(i+1).padStart(2,'0')}</span><span>${escape(lesson.title)}${completed.has(lesson.id)?'<span class="sr-only"> (practiced)</span>':''}</span></a>`).join('');
  const progress=document.getElementById('course-progress');progress.max=lessons.length;progress.value=completed.size;
  document.getElementById('progress-label').textContent=`${completed.size} of ${lessons.length} chapters practiced${storageAvailable?'':' · session only'}`;
  document.getElementById('chapter-position').textContent=`Chapter ${chapter+1} of ${lessons.length}`;
  document.getElementById('previous-chapter').disabled=chapter===0;
  const next=document.getElementById('next-chapter');
  next.disabled=chapter===lessons.length-1||!completed.has(lessons[chapter].id);
  next.textContent=chapter===lessons.length-1?'Last chapter':'Next chapter →';
  document.getElementById('chapter-hint').textContent=completed.has(lessons[chapter].id)?'Practiced. Revisit any time.':'Try the experiment and check your thinking.';
  const followup=document.getElementById('module-followup');
  followup.hidden=chapter!==lessons.length-1;
  if(!followup.hidden){
    const topic=catalog.topics.find(t=>t.id===(module?.topicId||course));
    const index=topic.modules.findIndex(m=>m.id===module?.id);
    const nextModule=module?topic.modules[index+1]:topic.modules[0];
    const base=document.body.dataset.baseurl||'';
    followup.innerHTML=nextModule?`<h2>Continue the project</h2><p>${escape(nextModule.outcome)}</p><a class="button primary" href="${base}${nextModule.url}">${escape(nextModule.title)} →</a>`:`<h2>Take the workflow into your own project</h2><p>Use a fresh example without the hints. Your activity record does not establish independent mastery.</p><a href="${base}${topic.url}">Revisit this topic →</a>`;
  }
}
const api={
  module,
  feedback(text,tone='success'){
    const context=document.activeElement?.closest('.lesson-card')||root.querySelector('.lab');
    if(context&&root.contains(context))context.insertAdjacentElement('afterend',feedback);else root.insertAdjacentElement('afterend',feedback);
    feedback.hidden=false;feedback.dataset.tone=tone;feedback.textContent=text;
    feedback.classList.remove('feedback-enter');void feedback.offsetWidth;feedback.classList.add('feedback-enter');
  },
  complete(){completed.add(lessons[chapter].id);persist();navigation();},
  readReflection(){return reflectionText;},
  saveReflection(text){reflectionText=text;persist();}
};
function showChapter(focus=false){
  feedback.hidden=true;feedback.textContent='';
  const match=location.hash.match(/^#chapter-(\d+)$/);
  chapter=match?Math.min(lessons.length-1,Math.max(0,Number(match[1])-1)):0;
  const lesson=lessons[chapter];
  setCheckpointContext(lesson.context||'');setTerms(definitions,lesson.terms||[]);
  loaded.get(lesson.controller).mount(lesson.station,root,api);
  navigation();
  if(focus)document.getElementById('lesson-title')?.focus({preventScroll:false});
}
document.getElementById('previous-chapter').onclick=()=>{if(chapter>0)location.hash=`chapter-${chapter}`;};
document.getElementById('next-chapter').onclick=()=>{if(chapter<lessons.length-1&&completed.has(lessons[chapter].id))location.hash=`chapter-${chapter+2}`;};
window.addEventListener('hashchange',()=>{if(location.hash==='#main')return;document.getElementById('course-menu').open=false;showChapter(true);});
document.getElementById('reset-course').onclick=()=>{
  const dialog=document.createElement('dialog');dialog.className='reset-dialog';dialog.setAttribute('aria-labelledby','reset-heading');
  dialog.innerHTML='<h2 id="reset-heading">Start fresh?</h2><p>This clears only this module’s activity and reflection in this browser.</p><div class="lab-actions"><button class="button secondary" id="cancel-reset" autofocus>Keep my activity</button><button class="button primary" id="confirm-reset">Reset this module</button></div>';
  document.body.append(dialog);
  dialog.addEventListener('close',()=>{dialog.remove();document.getElementById('reset-course').focus();});
  dialog.querySelector('#cancel-reset').onclick=()=>dialog.close();
  dialog.querySelector('#confirm-reset').onclick=()=>{
    completed=new Set();reflectionText='';const draft=root.querySelector('#reflection');if(draft)draft.value='';
    clearReflectionDraft(root);persist();dialog.close();
    if(location.hash!=='#chapter-1')location.hash='#chapter-1';else showChapter(true);
  };
  dialog.showModal();
};
showChapter();
