const {Menu,clipboard}=require('electron');
const valid=url=>{try{return ['https:','http:'].includes(new URL(url).protocol)}catch{return false}};
function pageMenu(wc,p,{window,open,search,bookmark}){
 const items=[],add=(label,click,enabled=true)=>items.push({label,click,enabled}),sep=()=>{if(items.length)items.push({type:'separator'})};
 if(p.isEditable){for(const [flag,label,method] of [['canUndo','Desfazer','undo'],['canRedo','Refazer','redo'],['canCut','Recortar','cut'],['canCopy','Copiar','copy'],['canPaste','Colar','paste'],['canSelectAll','Selecionar tudo','selectAll']])add(label,()=>wc[method](),Boolean(p.editFlags?.[flag]));sep();}
 if(valid(p.linkURL)){add('Abrir link em nova aba',()=>open(p.linkURL));add('Copiar endereço do link',()=>clipboard.writeText(p.linkURL));add('Salvar link como…',()=>wc.downloadURL(p.linkURL));sep();}
 if(p.mediaType==='image'&&valid(p.srcURL)){add('Abrir imagem em nova aba',()=>open(p.srcURL));add('Salvar imagem como…',()=>wc.downloadURL(p.srcURL));add('Copiar imagem',()=>wc.copyImageAt(p.x,p.y));add('Copiar endereço da imagem',()=>clipboard.writeText(p.srcURL));sep();}
 if(['video','audio'].includes(p.mediaType)&&valid(p.srcURL)){add('Abrir mídia em nova aba',()=>open(p.srcURL));add('Salvar mídia como…',()=>wc.downloadURL(p.srcURL));add('Copiar endereço da mídia',()=>clipboard.writeText(p.srcURL));sep();}
 const text=String(p.selectionText||'').trim();if(text){if(!p.isEditable)add('Copiar texto selecionado',()=>clipboard.writeText(text));add('Pesquisar seleção no Google',()=>open(search(text.slice(0,2048))));sep();}
 add('Voltar',()=>wc.navigationHistory.goBack(),wc.navigationHistory.canGoBack());add('Avançar',()=>wc.navigationHistory.goForward(),wc.navigationHistory.canGoForward());add('Recarregar',()=>wc.reload());add('Recarregar sem cache',()=>wc.reloadIgnoringCache());sep();
 add('Favoritar página',bookmark);add('Copiar endereço da página',()=>clipboard.writeText(wc.getURL()));add('Salvar página como…',async()=>{const {dialog}=require('electron');const r=await dialog.showSaveDialog(window,{defaultPath:'pagina.html',filters:[{name:'Página HTML completa',extensions:['html']}]});if(!r.canceled)await wc.savePage(r.filePath,'HTMLComplete').catch(()=>{});});add('Imprimir…',()=>wc.print());
 items.push({label:'Zoom',submenu:[{label:'Aumentar',click:()=>wc.setZoomLevel(Math.min(5,wc.getZoomLevel()+.5))},{label:'Diminuir',click:()=>wc.setZoomLevel(Math.max(-5,wc.getZoomLevel()-.5))},{label:'Restaurar 100%',click:()=>wc.setZoomLevel(0)}]});
 add('Inspecionar elemento',()=>wc.inspectElement(p.x,p.y));Menu.buildFromTemplate(items).popup({window});
}
function shellMenu(window,p,command){
 if(p.isEditable){Menu.buildFromTemplate([{role:'undo',label:'Desfazer'},{role:'redo',label:'Refazer'},{type:'separator'},{role:'cut',label:'Recortar'},{role:'copy',label:'Copiar'},{role:'paste',label:'Colar'},{role:'selectAll',label:'Selecionar tudo'}]).popup({window});return;}
 Menu.buildFromTemplate(['Nova aba','Personalizar navegação','Temas e personagens','Mostrar/ocultar menu lateral','Favoritos','Histórico','Downloads','Configurações'].map((label,i)=>({label,click:()=>command(['new','navigation','themes','sidebar','bookmarks','history','downloads','settings'][i])}))).popup({window});
}
module.exports={pageMenu,shellMenu};
