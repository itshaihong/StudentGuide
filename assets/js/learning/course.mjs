import {clearReflectionDraft} from './ui.mjs';

const catalog = {
  git: ['Locate your workspace','Review & stage','Catch the snapshot','Commit & share','Recover & explain'],
  'zynq-7000': ['Two kinds of work','Meet the files','Change the application','Update the hardware','Load the right artifacts','Run is not boot']
};
const course = document.body.dataset.course;
const titles = catalog[course];
const root = document.getElementById('lesson-root');
const key = `studentguide:activity:v1:${course}`;
let saved = {};
let storageAvailable = true;
try { saved = JSON.parse(localStorage.getItem(key) || '{}') || {}; } catch { storageAvailable = false; }
let completed = new Set(Array.isArray(saved.completed) ? saved.completed.filter(i => Number.isInteger(i) && i >= 0 && i < titles.length) : []);
let reflectionText = typeof saved.reflection === 'string' ? saved.reflection.slice(0,2000) : '';
let chapter = 0;
let dispose = () => {};
const feedback = document.getElementById('lesson-feedback');

function persist() {
  try { localStorage.setItem(key, JSON.stringify({completed:[...completed], reflection:reflectionText})); }
  catch { storageAvailable = false; }
}
function navigation() {
  document.getElementById('chapter-nav').innerHTML = titles.map((title,i) => `<a href="#chapter-${i+1}" class="chapter-link ${completed.has(i) ? 'completed' : ''}" ${i === chapter ? 'aria-current="step"' : ''}><span class="chapter-index">${completed.has(i) ? '✓' : String(i+1).padStart(2,'0')}</span><span>${title}${completed.has(i) ? '<span class="sr-only"> (practiced)</span>' : ''}</span></a>`).join('');
  document.getElementById('course-progress').value = completed.size;
  document.getElementById('progress-label').textContent = `${completed.size} of ${titles.length} chapters practiced${storageAvailable ? '' : ' · session only'}`;
  document.getElementById('chapter-position').textContent = `Chapter ${chapter+1} of ${titles.length}`;
  document.getElementById('previous-chapter').disabled = chapter === 0;
  const next = document.getElementById('next-chapter');
  next.disabled = chapter === titles.length-1 || !completed.has(chapter);
  next.textContent = chapter === titles.length-1 ? 'Last chapter' : 'Next chapter →';
  document.getElementById('chapter-hint').textContent = completed.has(chapter) ? 'Practiced. Revisit any time.' : 'Try the experiment and check your thinking.';
}
const api = {
  feedback(text,tone='success') {
    const context = document.activeElement?.closest('.lesson-card') || root.querySelector('.lab');
    if (context && root.contains(context)) context.insertAdjacentElement('afterend',feedback);
    else root.insertAdjacentElement('afterend',feedback);
    feedback.hidden = false; feedback.dataset.tone = tone; feedback.textContent = text;
  },
  complete() { completed.add(chapter); persist(); navigation(); },
  readReflection() { return reflectionText; },
  saveReflection(text) { reflectionText=text; persist(); }
};
const controllers = course === 'git' ? await import('../modules/git/course.mjs') : await import('../modules/zynq-7000/course.mjs');

function showChapter(focus = false) {
  dispose();
  feedback.hidden = true;
  feedback.textContent = '';
  const match = location.hash.match(/^#chapter-(\d+)$/);
  chapter = match ? Math.min(titles.length-1,Math.max(0,Number(match[1])-1)) : 0;
  const cleanup = controllers.mount(chapter, root, api);
  dispose = typeof cleanup === 'function' ? cleanup : () => {};
  navigation();
  if (focus) document.getElementById('lesson-title')?.focus({preventScroll:false});
}
document.getElementById('previous-chapter').addEventListener('click', () => { if (chapter > 0) location.hash = `chapter-${chapter}`; });
document.getElementById('next-chapter').addEventListener('click', () => { if (chapter < titles.length-1 && completed.has(chapter)) location.hash = `chapter-${chapter+2}`; });
window.addEventListener('hashchange', () => {
  if (location.hash === '#main') return;
  document.getElementById('course-menu').open = false;
  showChapter(true);
});
document.getElementById('reset-course').addEventListener('click', () => {
  const dialog = document.createElement('dialog');
  dialog.className = 'reset-dialog';
  dialog.setAttribute('aria-labelledby','reset-heading');
  dialog.innerHTML = '<h2 id="reset-heading">Start fresh?</h2><p>This clears only this course’s activity and reflection in this browser.</p><div class="lab-actions"><button class="button secondary" id="cancel-reset" autofocus>Keep my activity</button><button class="button primary" id="confirm-reset">Reset this course</button></div>';
  document.body.append(dialog);
  dialog.addEventListener('close', () => { dialog.remove(); document.getElementById('reset-course').focus(); });
  dialog.querySelector('#cancel-reset').addEventListener('click', () => dialog.close());
  dialog.querySelector('#confirm-reset').addEventListener('click', () => {
    completed = new Set(); reflectionText = '';
    const draft = root.querySelector('#reflection');
    if (draft) draft.value = '';
    clearReflectionDraft(root); persist(); dialog.close();
    if (location.hash !== '#chapter-1') location.hash = '#chapter-1'; else showChapter(true);
  });
  dialog.showModal();
});
showChapter();
