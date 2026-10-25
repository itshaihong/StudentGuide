import {activityKey,resumeKey,resumeLocation} from './activity.mjs';
import {completedIds} from './curriculum.mjs';
const catalog=JSON.parse(document.getElementById('curriculum-data').textContent);
const base=document.body.dataset.baseurl||'';
function update(){
 const topic=catalog.topics.find(t=>t.id===document.body.dataset.topic);if(!topic)return;
 let count=0;
 try{
  for(const module of topic.modules){
   const saved=JSON.parse(localStorage.getItem(activityKey(module.id))||'{}');
   const complete=completedIds(saved?.completed,module.lessons);count+=complete.size;
   const label=document.querySelector(`[data-module-progress="${module.id}"]`);if(label)label.textContent=`${complete.size} of ${module.lessons.length} chapters practiced`;
   for(const lesson of module.lessons){
    const link=document.querySelector(`[data-lesson-id="${lesson.id}"]`);if(!link)continue;
    const done=complete.has(lesson.id);link.classList.toggle('completed',done);
    link.querySelector('.chapter-status').textContent=done?'✓ Practiced':'Not practiced';
   }
  }
  const resume=resumeLocation(topic,JSON.parse(localStorage.getItem(resumeKey(topic.id))||'null'));
  const panel=document.getElementById('topic-resume');
  if(resume&&panel){panel.hidden=false;const link=panel.querySelector('a');link.href=base+resume.url;link.textContent=`Continue: ${resume.lesson.title} →`;}
  document.getElementById('topic-progress').textContent=`${count} of ${topic.modules.reduce((n,m)=>n+m.lessons.length,0)} chapters practiced · saved in this browser`;
 }catch{document.getElementById('topic-progress').textContent='Browser storage is unavailable. You can still explore every chapter.';}
}
update();window.addEventListener('pageshow',update);window.addEventListener('storage',update);
