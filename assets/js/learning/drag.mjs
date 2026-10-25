/** Native drag/drop is an alternate gesture for the same domain action as buttons. */
export function bindDrag(root,onDrop,{copy=false}={}){
 let active=null;
 const sources=[...root.querySelectorAll('[data-drag-id]')];
 for(const source of sources){
  source.draggable=true;
  source.addEventListener('dragstart',event=>{active=source.dataset.dragId;event.dataTransfer.setData('text/plain',active);event.dataTransfer.effectAllowed=copy?'copy':'move';});
  source.addEventListener('dragend',()=>{active=null;root.querySelectorAll('.drag-over').forEach(n=>n.classList.remove('drag-over'));});
 }
 for(const target of root.querySelectorAll('[data-drop-id]')){
  target.addEventListener('dragover',event=>{if(!active)return;event.preventDefault();event.dataTransfer.dropEffect=copy?'copy':'move';target.classList.add('drag-over');});
  target.addEventListener('dragleave',event=>{if(!target.contains(event.relatedTarget))target.classList.remove('drag-over');});
  target.addEventListener('drop',event=>{event.preventDefault();target.classList.remove('drag-over');if(!active||!sources.some(n=>n.dataset.dragId===active))return;const id=active;active=null;onDrop(id,target.dataset.dropId);});
 }
}
