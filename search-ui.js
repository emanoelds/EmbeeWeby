function initSearchSuggestions(){
 let current=null,items=[],selected=-1,revision=0,timer,composing=false;
 const popup=el('div',undefined,'search-suggestions');popup.id='search-suggestions';popup.role='listbox';popup.hidden=true;document.body.append(popup);
 function close(){clearTimeout(timer);revision++;popup.hidden=true;popup.replaceChildren();if(current){current.setAttribute('aria-expanded','false');current.removeAttribute('aria-activedescendant')}current=null;items=[];selected=-1;call('overlay',Boolean(document.querySelector('#panel').open));}
 function position(){if(!current)return;const rect=current.closest('form').getBoundingClientRect();popup.style.left=rect.left+'px';popup.style.top=(rect.bottom+6)+'px';popup.style.width=rect.width+'px';}
 function choose(index){const item=items[index];if(!item)return;close();call('navigate',item.value);}
 function draw(input,query,remote=[]){
  if(document.activeElement!==input||input.value.trim()!==query)return;
  current=input;items=[];selected=-1;const used=new Set();
  const add=(label,value,kind)=>{const key=value.toLowerCase();if(!used.has(key)&&items.length<8){items.push({label,value,kind});used.add(key)}};
  add(query,query,'Pesquisar no Google');
  const term=query.toLocaleLowerCase();
  for(const entry of [...favorites.map(x=>({...x,kind:'Favorito'})),...history.map(x=>({...x,kind:'Histórico'}))]){if((entry.title+' '+entry.url).toLocaleLowerCase().includes(term))add(entry.title||entry.url,entry.url,entry.kind);if(items.length>=4)break}
  for(const text of remote)add(text,text,'Sugestão do Google');
  popup.replaceChildren();items.forEach((item,i)=>{const row=button('',()=>choose(i),'suggestion-row');row.id='search-option-'+i;row.role='option';row.tabIndex=-1;row.setAttribute('aria-selected','false');const icon=el('span',item.kind==='Histórico'?'◷':item.kind==='Favorito'?'☆':'⌕','suggestion-symbol');const text=el('span',item.label,'suggestion-text');text.append(el('small',item.kind==='Histórico'||item.kind==='Favorito'?item.value:item.kind));row.append(icon,text);row.addEventListener('pointerdown',event=>event.preventDefault());popup.append(row)});
  popup.hidden=false;input.setAttribute('aria-expanded','true');position();call('overlay',true);
 }
 function update(input){clearTimeout(timer);const version=++revision,q=input.value.trim();if(composing||!q){close();return}draw(input,q);if(prefs.searchSuggestions===false)return;timer=setTimeout(async()=>{const result=await call('search-suggest',q);if(version===revision&&Array.isArray(result))draw(input,q,result)},260);}
 for(const input of [$('#address'),$('#search')]){
  input.setAttribute('role','combobox');input.setAttribute('aria-autocomplete','list');input.setAttribute('aria-controls',popup.id);input.setAttribute('aria-expanded','false');input.autocomplete='off';input.spellcheck=false;
  input.addEventListener('input',()=>update(input));input.addEventListener('compositionstart',()=>{composing=true;close()});input.addEventListener('compositionend',()=>{composing=false;update(input)});
  input.addEventListener('keydown',event=>{if(event.isComposing||composing)return;if(event.key==='Escape'&&current===input){event.preventDefault();close();return}if(popup.hidden||current!==input)return;if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();selected=(selected+(event.key==='ArrowDown'?1:-1)+items.length)%items.length;Array.from(popup.children).forEach((node,i)=>node.setAttribute('aria-selected',String(i===selected)));input.setAttribute('aria-activedescendant','search-option-'+selected);popup.children[selected].scrollIntoView({block:'nearest'});}if(event.key==='Enter'&&selected>=0){event.preventDefault();event.stopImmediatePropagation();choose(selected)}});
  input.addEventListener('blur',()=>{if(current===input)close()});input.closest('form').addEventListener('submit',()=>close());
 }
 document.addEventListener('pointerdown',event=>{if(current&&!popup.contains(event.target)&&event.target!==current)close()});window.addEventListener('resize',position);$('#home-page').addEventListener('scroll',position);document.addEventListener('search-suggestions-close',close);
}
function searchSuggestionSettings(body){
 body.append(el('h3','Sugestões de pesquisa'));
 const label=el('label'),toggle=el('input');toggle.type='checkbox';toggle.checked=prefs.searchSuggestions!==false;toggle.onchange=()=>{prefs.searchSuggestions=toggle.checked;save('prefs',prefs);document.dispatchEvent(new Event('search-suggestions-close'))};label.append(toggle,document.createTextNode(' Mostrar sugestões online do Google'));body.append(label,el('p','Ao digitar uma pesquisa, o texto é enviado ao Google para obter sugestões. Endereços, histórico e favoritos não são enviados por esse recurso. Desative para usar apenas sugestões locais.','muted'));
}

