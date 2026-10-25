import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {modulesIn,completedIds} from '../assets/js/learning/curriculum.mjs';
import {controllerLoaders} from '../assets/js/learning/registry.mjs';
import {changedKeys} from '../assets/js/learning/changes.mjs';
const catalog=JSON.parse(readFileSync(new URL('../_data/curriculum.json',import.meta.url)));
const terms=JSON.parse(readFileSync(new URL('../_data/terms.json',import.meta.url)));
const modules=modulesIn(catalog);

test('the two topics have three coherent modules with valid routes and prerequisites',()=>{
  assert.equal(catalog.version,2);assert.equal(catalog.topics.length,2);assert.equal(modules.length,6);
  const ids=new Set();
  for(const topic of catalog.topics){
    assert.equal(topic.modules.length,3);const earlier=new Set();
    for(const module of topic.modules){
      assert.equal(ids.has(module.id),false);ids.add(module.id);
      assert.ok(module.story.length>80);assert.ok(module.outcome.length>60);
      assert.ok(module.lessons.length>=3&&module.lessons.length<=5);
      assert.ok(existsSync(new URL(`..${module.url}index.md`,import.meta.url)));
      for(const prerequisite of module.prerequisites)assert.ok(earlier.has(prerequisite));
      earlier.add(module.id);
    }
  }
});
test('every chapter resolves to an actual controller and contextual definitions',async()=>{
  const loaded=Object.fromEntries(await Promise.all(Object.entries(controllerLoaders).map(async([id,load])=>[id,await load()])));
  for(const module of modules){
    assert.equal(new Set(module.lessons.map(l=>l.id)).size,module.lessons.length);
    for(const lesson of module.lessons){
      assert.equal(typeof loaded[lesson.controller]?.mount,'function');
      assert.ok(Number.isInteger(lesson.station)&&lesson.station>=0);
      assert.ok(lesson.context.length>40);assert.ok(lesson.terms.length>=2&&lesson.terms.length<=4);
      for(const id of lesson.terms){assert.ok(terms[id],id);assert.ok(terms[id].definition.length>40);assert.ok(terms[id].example.length>30);}
    }
  }
});
test('stable activity IDs survive chapter order changes without assigning unknown progress',()=>{
  const lessons=[{id:'second'},{id:'first'}];
  assert.deepEqual([...completedIds(['first','unknown'],lessons)],['first']);
  assert.deepEqual([...completedIds([0],lessons)],['second']);
  assert.equal(completedIds(null,lessons).size,0);
});
test('change feedback identifies only genuinely changed existing displays',()=>{
  assert.deepEqual(changedKeys({working:'500',index:'500'},{working:'250',index:'500'}),['working']);
  assert.deepEqual(changedKeys({working:'250'},{working:'250',new:'500'}),[]);
});
