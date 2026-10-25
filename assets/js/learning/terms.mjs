let definitions={};
let preferred=[];
export function setTerms(data,ids=[]) { definitions=data; preferred=ids; }
const regexEscape=value=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');

export function abbreviationsIn(fragments,data){
  const content=fragments.join(' ');
  return Object.values(data).filter(term=>term.expansion&&term.match.some(word=>/^[A-Z]{2,}$/.test(word)&&new RegExp(`\\b${word}\\b`).test(content))&&!content.toLowerCase().includes(term.expansion.toLowerCase()));
}

export function explainTerms(root) {
  const missing=[];
  for(const id of preferred) {
    const term=definitions[id];
    if(!term || root.querySelector(`[data-term="${id}"]`))continue;
    const pattern=new RegExp(`\\b(${term.match.map(regexEscape).join('|')})\\b`,'i');
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    let text;
    let inserted=false;
    while((text=walker.nextNode())) {
      if(text.parentElement.closest('button,a,code,pre,h1,h2,h3,h4,details:not([open]),.terminal,.diff-panel,.term-definition,.acronym-notes,[role="status"]'))continue;
      const found=pattern.exec(text.textContent);
      if(!found)continue;
      const button=document.createElement('button');
      button.type='button';button.className='term-toggle';button.dataset.term=id;
      button.id=`term-${id}`;button.textContent=found[0];
      button.setAttribute('aria-label',`Explain ${term.title}`);
      button.setAttribute('aria-expanded','false');
      const after=text.splitText(found.index);
      after.splitText(found[0].length);
      after.replaceWith(button);
      inserted=true;
      break;
    }
    if(!inserted)missing.push(id);
  }
  if(missing.length){
    const line=document.createElement('p');line.className='term-references';line.append('Terms in this chapter:');
    for(const id of missing){const button=document.createElement('button');button.type='button';button.className='term-toggle';button.dataset.term=id;button.id=`term-${id}`;button.textContent=definitions[id].title;button.setAttribute('aria-label',`Explain ${definitions[id].title}`);button.setAttribute('aria-expanded','false');line.append(button);}
    (root.querySelector('.lesson-intro')||root.firstElementChild).insertAdjacentElement('afterend',line);
  }
  const visible=root.cloneNode(true);
  visible.querySelectorAll('details:not([open])').forEach(node=>node.remove());
  const fragments=[];const textWalker=document.createTreeWalker(visible,NodeFilter.SHOW_TEXT);
  let fragment;while((fragment=textWalker.nextNode()))fragments.push(fragment.textContent);
  const expansions=abbreviationsIn(fragments,definitions);
  if(expansions.length){
    const note=document.createElement('p');note.className='acronym-notes';
    note.append('Abbreviations: ');
    expansions.forEach((term,i)=>{const span=document.createElement('span');span.textContent=`${term.match.find(word=>/^[A-Z]{2,}$/.test(word))} — ${term.expansion}`;if(i)note.append(' · ');note.append(span);});
    (root.querySelector('.lesson-intro')||root.firstElementChild).insertAdjacentElement('afterend',note);
  }

}

export function bindTerms(root) {
  function close(returnFocus=false) {
    const opener=root.querySelector('.term-toggle[aria-expanded="true"]');
    root.querySelector('.term-definition')?.remove();
    opener?.setAttribute('aria-expanded','false');
    opener?.removeAttribute('aria-controls');
    if(returnFocus)opener?.focus({preventScroll:true});
  }
  function click(event) {
    if(event.target.closest('.close-definition')){close(true);return;}
    const button=event.target.closest('[data-term]');
    if(!button || !root.contains(button))return;
    const open=button.getAttribute('aria-expanded')==='true';close();
    if(open)return;
    const term=definitions[button.dataset.term];if(!term)return;
    const panel=document.createElement('aside');
    panel.className='term-definition';panel.id=`definition-${button.dataset.term}`;
    panel.setAttribute('aria-labelledby',`definition-title-${button.dataset.term}`);
    const title=document.createElement('strong');title.id=`definition-title-${button.dataset.term}`;title.textContent=term.title;
    const description=document.createElement('p');description.textContent=term.definition;
    const example=document.createElement('p');example.className='definition-example';example.textContent=`In this project: ${term.example}`;
    const dismiss=document.createElement('button');dismiss.className='close-definition text-button';dismiss.type='button';dismiss.textContent='Close explanation';
    panel.append(title,description,example,dismiss);
    const anchor=button.closest('p,li,.callout,.lesson-card') || button.parentElement;
    anchor.insertAdjacentElement('afterend',panel);
    button.setAttribute('aria-expanded','true');button.setAttribute('aria-controls',panel.id);
  }
  function keydown(event){if(event.key==='Escape')close(true);}
  root.addEventListener('click',click);root.addEventListener('keydown',keydown);
  return ()=>{root.removeEventListener('click',click);root.removeEventListener('keydown',keydown);close();};
}
