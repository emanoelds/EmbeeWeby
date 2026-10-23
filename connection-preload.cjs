const {ipcRenderer}=require('electron');
window.addEventListener('DOMContentLoaded',()=>{document.querySelector('#close-connection')?.addEventListener('click',event=>{event.preventDefault();ipcRenderer.send('connection-popover-close')});});
