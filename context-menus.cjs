const {buildBrowserMenu}=require('./menu-icons.cjs');
const {clipboard}=require('electron');
const {languages}=require('./translation.cjs');
const translationMenu=command=>({label:'Traduzir site',submenu:languages.map(([id,label])=>({label,click:()=>command('translate:'+id)}))});
const valid=url=>{try{return ['https:','http:'].includes(new URL(url).protocol)}catch{return false}};
const editActions = [
 ['canUndo', 'Desfazer', 'undo'],
 ['canRedo', 'Refazer', 'redo'],
 ['canCut', 'Recortar', 'cut'],
 ['canCopy', 'Copiar', 'copy'],
 ['canPaste', 'Colar', 'paste'],
 ['canPaste', 'Colar sem formatação', 'pasteAndMatchStyle'],
 ['canSelectAll', 'Selecionar tudo', 'selectAll']
];

function pageMenu(wc,p,{window,open,search,bookmark,tool=()=>{},command=()=>{},translateSelection=()=>{}}){
 const items=[],add=(label,click,enabled=true)=>items.push({label,click,enabled}),sep=()=>{if(items.length)items.push({type:'separator'})};
 const popup = () => { if (items.length) buildBrowserMenu(items).popup({window}); };
 if (p.isEditable) {
  for (const [flag, label, method] of editActions) {
   if (p.editFlags?.[flag]) add(label, () => wc[method]());
  }
  popup();
  return;
 }
 if(valid(p.linkURL)){add('Abrir link em nova aba',()=>open(p.linkURL));add('Copiar endereço do link',()=>clipboard.writeText(p.linkURL));add('Salvar link como…',()=>wc.downloadURL(p.linkURL));sep();}
 if(p.mediaType==='image'&&valid(p.srcURL)){add('Abrir imagem em nova aba',()=>open(p.srcURL));add('Salvar imagem como…',()=>wc.downloadURL(p.srcURL));add('Copiar imagem',()=>wc.copyImageAt(p.x,p.y));add('Copiar endereço da imagem',()=>clipboard.writeText(p.srcURL));sep();}
 if(['video','audio'].includes(p.mediaType)&&valid(p.srcURL)){add('Abrir mídia em nova aba',()=>open(p.srcURL));add('Salvar mídia como…',()=>wc.downloadURL(p.srcURL));add('Copiar endereço da mídia',()=>clipboard.writeText(p.srcURL));sep();}
 const text = String(p.selectionText || '').trim();
 if (text) {
  add('Copiar', () => wc.copy());
  add('Traduzir seleção para português', () => translateSelection(text, 'pt'));
  items.push({label:'Traduzir seleção para…',submenu:languages.map(([id,label])=>({label,click:()=>translateSelection(text,id)}))});
  add('Pesquisar seleção na web', () => open(search(text.slice(0, 2048))));
  add('Salvar seleção nas notas', () => command({type:'selection-note',text:text.slice(0,15000)}));
  sep();
 }
 if (items.length) {
  if (items.at(-1).type === 'separator') items.pop();
  popup();
  return;
 }
 if (wc.navigationHistory.canGoBack()) add('Voltar',()=>wc.navigationHistory.goBack());
 if (wc.navigationHistory.canGoForward()) add('Avançar',()=>wc.navigationHistory.goForward());add('Recarregar',()=>wc.reload());sep();
 add('Favoritar página',bookmark);add('Copiar endereço da página',()=>clipboard.writeText(wc.getURL()));add('Salvar página como…',async()=>{const {dialog}=require('electron');const r=await dialog.showSaveDialog(window,{defaultPath:'pagina.html',filters:[{name:'Página HTML completa',extensions:['html']}]});if(!r.canceled)await wc.savePage(r.filePath,'HTMLComplete').catch(()=>{});});items.push(translationMenu(command));add('Imprimir…',()=>tool('print'));
 items.push({label:'Zoom',submenu:[{label:'Aumentar',click:()=>wc.setZoomLevel(Math.min(5,wc.getZoomLevel()+.5))},{label:'Diminuir',click:()=>wc.setZoomLevel(Math.max(-5,wc.getZoomLevel()-.5))},{label:'Restaurar 100%',click:()=>wc.setZoomLevel(0)}]});
 add('Criar QR Code desta página',()=>command('qr'));add('Capturar área visível…',()=>tool('capture-visible'));add('Capturar página completa…',()=>tool('capture-full'));add('Copiar captura da página',()=>tool('capture-copy'));add('Salvar em PDF…',()=>tool('pdf'));add('Buscar na página…',()=>command('find'));add('Inspecionar elemento',()=>{if(wc.isDestroyed())return;if(!wc.isDevToolsOpened())wc.openDevTools({mode:'detach'});wc.inspectElement(Math.max(0,Math.round(p.x)),Math.max(0,Math.round(p.y)))});buildBrowserMenu(items).popup({window});
}
function shellMenu(window,p,command){
 if (p.isEditable) {
  const items = editActions.filter(([flag]) => p.editFlags?.[flag]).map(([,label,role]) => ({label,role}));
  if (p.editFlags?.canPaste && p.address) items.push({label:'Colar e acessar/pesquisar',click:()=>command('paste-go')});
  if (items.length) buildBrowserMenu(items).popup({window});
  return;
 }
 if(String(p.selectionText||'').trim()){buildBrowserMenu([{role:'copy',label:'Copiar'},{role:'selectAll',label:'Selecionar tudo'}]).popup({window});return;}
 const entry=(label,id)=>({label,click:()=>command(id)}),sep={type:'separator'};
 if (p.region) {
  const items = [entry('Nova aba','new'), entry('Reabrir aba fechada','reopen')];
  if (p.region === 'home') items.push(sep, entry('Temas e personagens','themes'), entry('Personalizar navegação','navigation'));
  if (p.region === 'toolbar') items.push(sep, entry('Personalizar navegação','navigation'), entry('Mostrar/ocultar menu lateral','sidebar'));
  items.push(entry('Configurações','settings'));
  buildBrowserMenu(items).popup({window});
  return;
 }
 buildBrowserMenu([entry('Nova aba','new'),entry('Reabrir aba fechada','reopen'),entry('Duplicar aba','duplicate-tab'),entry('Silenciar / ativar som da aba','mute-tab'),sep,{label:'Editar',submenu:[entry('Desfazer','undo'),entry('Refazer','redo'),entry('Recortar','cut'),entry('Copiar','copy'),entry('Colar','paste'),entry('Colar sem formatação','pasteAndMatchStyle'),entry('Selecionar tudo','selectAll'),entry('Colar e acessar/pesquisar','paste-go')]},entry('Buscar na página…','find'),{label:'Zoom',submenu:[entry('Aumentar','zoom-in'),entry('Diminuir','zoom-out'),entry('Restaurar 100%','zoom-reset')]},entry('Tela cheia','fullscreen'),entry('Transmitir tela…','cast'),translationMenu(command),entry('Mostrar texto original','translate-original'),entry('Extensões','extensions'),sep,entry('Copiar endereço da página','copy-url'),entry('Criar QR Code','qr'),entry('Ler QR Code…','qr-reader'),{label:'Capturar página',submenu:[entry('Salvar área visível…','capture-visible'),entry('Salvar página completa…','capture-full'),entry('Copiar captura','capture-copy')]},entry('Salvar página como…','save-page'),entry('Salvar em PDF…','pdf'),entry('Imprimir…','print'),sep,entry('Personalizar navegação','navigation'),entry('Temas e personagens','themes'),entry('Mostrar/ocultar menu lateral','sidebar'),entry('Favoritos','bookmarks'),entry('Histórico','history'),entry('Downloads','downloads'),entry('Bloco de notas','notes'),entry('Configurações','settings'),entry('Atalhos de teclado','shortcuts')]).popup({window});
}
module.exports={pageMenu,shellMenu};
