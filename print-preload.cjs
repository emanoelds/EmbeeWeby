const {contextBridge,ipcRenderer}=require('electron');contextBridge.exposeInMainWorld('embeePrint',{call:(action,data)=>ipcRenderer.invoke('print-preview',action,data)});
