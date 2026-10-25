/** Compare stable state displays, not arbitrary DOM or animation frames. */
export function changedKeys(before, after) {
  return Object.keys(after).filter(key => Object.hasOwn(before,key) && before[key] !== after[key]);
}

function readDisplay(element) {
  const copy=element.cloneNode(true);
  copy.querySelectorAll('.change-marker').forEach(node=>node.remove());
  return copy.textContent.replace(/\s+/g,' ').trim();
}
export function captureDisplays(root) {
  return Object.fromEntries([...root.querySelectorAll('[data-state]')].map(node=>[node.dataset.state,readDisplay(node)]));
}
export function highlightChanges(root,before) {
  const changed=new Set(changedKeys(before,captureDisplays(root)));
  root.querySelectorAll('[data-state]').forEach(node=>{
    if(!changed.has(node.dataset.state))return;
    node.classList.add('state-changed');
    const marker=document.createElement('span');
    marker.className='change-marker';
    marker.textContent='Changed';
    node.append(marker);
  });
  return [...changed];
}
