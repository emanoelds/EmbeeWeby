const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('embee',{call:(action,data)=>ipcRenderer.invoke('browser',action,data),onCommand:fn=>ipcRenderer.on('command',(_,command)=>fn(command)),onState:fn=>ipcRenderer.on('state',(_,state)=>fn(state))});
