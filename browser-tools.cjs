const {openPrintPreview}=require('./print-preview.cjs');
const {dialog,clipboard,nativeImage}=require('electron');
const fs=require('node:fs/promises');
const QRCode=require('qrcode');
const safe=url=>{try{return ['http:','https:'].includes(new URL(url).protocol)}catch{return false}};
function createBrowserTools({window,current,command,navigate}){
 const page=()=>{const tab=current();return tab&&!tab.internal&&!tab.internalHome?tab.view?.webContents:undefined};
 async function capture(full=false){const wc=page()||window.webContents;if(!full)return wc.capturePage();let attached=false;try{if(wc.debugger.isAttached())throw Error('Feche as ferramentas de desenvolvimento antes da captura completa.');wc.debugger.attach('1.3');attached=true;const metrics=await wc.debugger.sendCommand('Page.getLayoutMetrics'),size=metrics.cssContentSize;if(size.width*size.height>64000000||size.width>32768||size.height>32768)throw Error('Esta página é grande demais para uma única imagem. Use a captura da área visível ou salve em PDF.');const result=await wc.debugger.sendCommand('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width:Math.ceil(size.width),height:Math.ceil(size.height),scale:1}});return nativeImage.createFromBuffer(Buffer.from(result.data,'base64'));}finally{if(attached)wc.debugger.detach();}}
 async function save(bytes,name,extensions){const result=await dialog.showSaveDialog(window,{defaultPath:name,filters:[{name:extensions.join(', ').toUpperCase(),extensions}]});if(!result.canceled){await fs.writeFile(result.filePath,bytes);return {ok:true,saved:true}}return {ok:true,canceled:true};}
 async function run(action,data){try{const wc=page();switch(action){
 case 'print':if(!wc)throw Error('Abra uma página de site para imprimir.');return openPrintPreview(window,wc);
 case 'pdf':if(!wc)throw Error('Abra uma página para salvar em PDF.');return save(await wc.printToPDF({printBackground:true,preferCSSPageSize:true}),'EmbeeWeby.pdf',['pdf']);
 case 'save-page':if(!wc)throw Error('Abra uma página para salvar.');{const r=await dialog.showSaveDialog(window,{defaultPath:'pagina.html',filters:[{name:'Página HTML completa',extensions:['html']}]});if(!r.canceled)await wc.savePage(r.filePath,'HTMLComplete');return {ok:true,canceled:r.canceled};}
 case 'capture-visible':case 'capture-full':return save((await capture(action==='capture-full')).toPNG(),'EmbeeWeby.png',['png']);
 case 'capture-copy':clipboard.writeImage(await capture());return {ok:true};
 case 'qr':{const url=wc?.getURL();if(!safe(url))throw Error('Abra um site para criar o QR Code.');if(url.length>2000)throw Error('O endereço é longo demais para este QR Code.');return {ok:true,url,image:await QRCode.toDataURL(url,{errorCorrectionLevel:'M',margin:4,width:512,color:{dark:'#000000',light:'#ffffff'}})};}
 case 'qr-save':{const result=await run('qr');if(!result.ok)return result;return save(Buffer.from(result.image.split(',')[1],'base64'),'EmbeeWeby-QR.png',['png']);}
 case 'copy-url':clipboard.writeText(wc?.getURL()||'');return {ok:true};
 case 'paste-go':{const text=clipboard.readText().slice(0,4096).trim();if(text)navigate(current(),text);return {ok:true};}
 case 'cut':case 'copy':case 'paste':case 'pasteAndMatchStyle':case 'selectAll':case 'undo':case 'redo':{const target=window.webContents.isFocused()?window.webContents:wc;target?.[action]();return {ok:true};}
 case 'find':if(wc&&typeof data?.text==='string'){if(data.text.trim())wc.findInPage(data.text.slice(0,1000),{forward:data.forward!==false,findNext:Boolean(data.next),matchCase:false});else wc.stopFindInPage('clearSelection');}return {ok:true};
 case 'find-close':wc?.stopFindInPage('clearSelection');return {ok:true};
 case 'zoom-in':case 'zoom-out':case 'zoom-reset':if(wc)wc.setZoomLevel(action==='zoom-reset'?0:Math.max(-5,Math.min(5,wc.getZoomLevel()+(action==='zoom-in'?.5:-.5))));return {ok:true};
 case 'fullscreen':window.setFullScreen(!window.isFullScreen());return {ok:true};
 default:return {ok:false,message:'Ferramenta indisponível.'};
 }}catch(e){return {ok:false,message:e.message||'Não foi possível concluir esta ação.'}}}
 return {run};
}
module.exports={createBrowserTools};
