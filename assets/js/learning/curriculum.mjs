export function modulesIn(catalog) {
  return catalog.topics.flatMap(topic=>topic.modules.map(module=>({...module,topicId:topic.id,topicTitle:topic.title,topicUrl:topic.url})));
}
export function completedIds(saved,lessons) {
  const known=new Set(lessons.map(lesson=>lesson.id));
  return new Set(Array.isArray(saved)?saved.map(value=>typeof value==='number'?lessons[value]?.id:value).filter(id=>known.has(id)):[]);
}
