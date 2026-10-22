const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('embee',{call:(action,data)=>ipcRenderer.invoke('browser',action,data),onState:fn=>ipcRenderer.on('state',(_,state)=>fn(state))});
