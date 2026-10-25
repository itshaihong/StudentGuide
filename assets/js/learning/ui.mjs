export const escape = (value) => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const button = (id, label, style = 'secondary', disabled = false) => `<button type="button" class="button ${style}" id="${id}" ${disabled ? 'disabled' : ''}>${label}</button>`;
export const lab = (title, body, reset = true) => `<section class="lab" aria-label="${title}"><div class="lab-toolbar"><span class="lab-label">${title}</span>${reset ? '<button class="toolbar-button" type="button" id="reset-lab">↺ Reset experiment</button>' : '<span class="pill">SYNTHETIC EXAMPLE</span>'}</div><div class="lab-body">${body}</div></section>`;
export const heading = (title, text) => `<h1 class="lesson-heading" id="lesson-title" tabindex="-1">${title}</h1><p class="lesson-intro">${text}</p>`;
export const question = (id, title, answers) => `<section class="lesson-card" aria-labelledby="${id}-title"><span class="task-label">Check your thinking</span><h3 id="${id}-title">${title}</h3><div class="choice-grid">${answers.map((text, i) => `<button type="button" class="choice" id="${id}-${i}" data-quiz="${id}" data-answer="${i}"><span class="choice-marker" aria-hidden="true">${String.fromCharCode(65+i)}</span><span>${text}</span></button>`).join('')}</div></section>`;

const drafts = new WeakMap();
export function clearReflectionDraft(root) { drafts.delete(root); }

export function preserveFocus(root, html) {
  const draft = root.querySelector('#reflection');
  if (draft) drafts.set(root,draft.value);
  const active = root.contains(document.activeElement) ? document.activeElement.id : '';
  root.innerHTML = html;
  if (active) document.getElementById(active)?.focus({preventScroll:true});
}

export function bindQuiz(root, id, correct, explanations, api, after = () => {}) {
  root.querySelectorAll(`[data-quiz="${id}"]`).forEach(button => {
    button.addEventListener('click', () => {
      const answer = Number(button.dataset.answer);
      root.querySelectorAll(`[data-quiz="${id}"]`).forEach(other => {
        other.classList.remove('correct','wrong');
        other.removeAttribute('aria-pressed');
      });
      button.classList.add(answer === correct ? 'correct' : 'wrong');
      button.setAttribute('aria-pressed','true');
      api.feedback(explanations[answer], answer === correct ? 'success' : 'error');
      after(answer === correct);
    });
  });
}

export function reflection(root, api, moduleId, prompt, onFinish) {
  const saved = drafts.get(root) ?? api.readReflection();
  root.insertAdjacentHTML('beforeend', `<section class="lesson-card"><span class="task-label">Put it in your own words</span><h3>One last small explanation.</h3><label class="reflection-label" for="reflection">${prompt}</label><textarea id="reflection" maxlength="2000" placeholder="Explain the relationship, not just the command or filename…">${escape(saved)}</textarea><p class="storage-note">Saved only when you choose to save, in this browser. This explanation is not automatically graded.</p><div class="lab-actions">${button('save-reflection','Save reflection & finish','primary')}</div><div id="completion"></div></section>`);
  root.querySelector('#save-reflection').addEventListener('click', () => {
    const text = root.querySelector('#reflection').value.trim();
    if (text.length < 20) {
      api.feedback('Add a sentence about why the steps matter. There is no automatic grading; this is a place to capture your reasoning.', 'info');
      root.querySelector('#reflection').focus();
      return;
    }
    if (!onFinish()) return;
    api.saveReflection(text);
    api.complete();
    root.querySelector('#completion').innerHTML = `<div class="completion-banner"><h3>Your reflection is captured.</h3><p>This chapter's activity is recorded here. To check your understanding, explain a new example without the hints, or compare your reflection with a peer. You can revisit any chapter.</p></div>`;
    api.feedback('Reflection saved for this browser session. Your practice record is separate from evidence of independent understanding.');
  });
}
