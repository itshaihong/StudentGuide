import test from 'node:test';
import assert from 'node:assert/strict';
import {lastChapter,resumeLocation} from '../assets/js/learning/activity.mjs';
const module={id:'a',url:'/modules/a/',lessons:[{id:'first',title:'First'},{id:'second',title:'Second'}]};
const topic={modules:[module]};
test('resume uses known stable chapter IDs rather than stored or untrusted URLs',()=>{
 assert.equal(lastChapter(module,{lastLesson:'second'}),1);
 assert.equal(lastChapter(module,{lastLesson:'removed'}),0);
 assert.equal(resumeLocation(topic,{moduleId:'a',lessonId:'second',url:'https://unrelated.invalid'}).url,'/modules/a/#chapter-2');
 assert.equal(resumeLocation(topic,{moduleId:'removed',lessonId:'second'}),null);
 assert.equal(resumeLocation(topic,{moduleId:'a',lessonId:'removed'}),null);
});
