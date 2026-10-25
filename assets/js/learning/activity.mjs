export const activityKey=id=>`studentguide:activity:v2:${id}`;
export const resumeKey=id=>`studentguide:resume:v2:${id}`;
export function lastChapter(module,record){const index=module.lessons.findIndex(l=>l.id===record?.lastLesson);return index<0?0:index;}
export function resumeLocation(topic,record){
 const module=topic.modules.find(m=>m.id===record?.moduleId);
 const index=module?.lessons.findIndex(l=>l.id===record?.lessonId)??-1;
 return index<0?null:{module,lesson:module.lessons[index],url:`${module.url}#chapter-${index+1}`};
}
