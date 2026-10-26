const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('embeeDownloads',{call:data=>ipcRenderer.invoke('downloads-popup',data),onState:fn=>ipcRenderer.on('downloads-state',(_event,data)=>fn(data))});
