let historyIconKey='',historySearch='',historyPeriod='all',historyOwner='';
function historyDate(item){return Number.isFinite(item.timestamp)&&!Number.isNaN(new Date(item.timestamp).getTime())?item.timestamp:0;}
function historyPeriodStart(period){const now=new Date();if(period==='today'){now.setHours(0,0,0,0);return now.getTime()}if(period==='week')return Date.now()-7*86400000;if(period==='month')return Date.now()-28*86400000;return 0;}
function historyDayLabel(stamp){if(!stamp)return 'Registros antigos';const day=new Date(stamp),today=new Date();today.setHours(0,0,0,0);const yesterday=new Date(today);yesterday.setDate(yesterday.getDate()-1);if(day>=today)return 'Hoje';if(day>=yesterday)return 'Ontem';return day.toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});}
function renderHistoryPage(){
 let page=$('#history-page');if(!page){page=el('main');page.id='history-page';document.body.append(page)}
 const active=state.tabs.find(t=>t.id===state.active);page.hidden=active?.internal!=='history';if(page.hidden)return;
 if(historyOwner!==profileNamespace){historyOwner=profileNamespace;historySearch='';historyPeriod='all'}
 let migrated=false;history=history.map(item=>{if(item.id)return item;migrated=true;return {...item,id:crypto.randomUUID()}});if(migrated)save('history',history);
 const signature=profileNamespace+'|'+state.active+'|'+JSON.stringify(history);if(page.dataset.signature===signature){refreshBookmarkIcons();return}page.dataset.signature=signature;page.replaceChildren();
 const shell=el('div',undefined,'history-shell'),top=el('div',undefined,'section-head'),title=el('h1',undefined,'settings-section-title');title.append(settingsIcon('history'),el('span','Histórico'));top.append(title,settingsActionButton('Limpar dados de navegação',showPrivacySettings,'remove','primary'));
 shell.append(top,el('p','Encontre páginas visitadas, abra um site novamente ou remova registros específicos.','manager-intro muted'));
 const toolbar=el('div',undefined,'manager-toolbar'),search=el('input'),period=el('select'),count=el('p','','manager-count'),list=el('div',undefined,'history-list');
 search.type='search';search.className='field manager-search';search.placeholder='Pesquisar título ou endereço';search.setAttribute('aria-label','Pesquisar no histórico');search.value=historySearch;
 period.className='field manager-sort';period.setAttribute('aria-label','Filtrar período do histórico');for(const [value,label]of [['all','Todo o período'],['today','Hoje'],['week','Últimos 7 dias'],['month','Últimas 4 semanas']]){const option=el('option',label);option.value=value;period.append(option)}period.value=historyPeriod;count.setAttribute('role','status');count.setAttribute('aria-live','polite');toolbar.append(search,period);shell.append(toolbar,count,list);page.append(shell);
 const draw=()=>{
  list.replaceChildren();const query=settingsSearchText(historySearch).trim(),since=historyPeriodStart(historyPeriod),shown=history.filter(item=>(!since||historyDate(item)>=since)&&settingsSearchText([item.title,item.url].join(' ')).includes(query)).sort((a,b)=>historyDate(b)-historyDate(a));
  count.textContent=shown.length+' '+(shown.length===1?'página encontrada':'páginas encontradas');let lastDay='';
  for(const item of shown){
   const stamp=historyDate(item),dayKey=stamp?new Date(stamp).toLocaleDateString('pt-BR'):'legacy';if(dayKey!==lastDay){list.append(el('h2',historyDayLabel(stamp),'history-day'));lastDay=dayKey}
   const row=el('article',undefined,'row history-row'),link=button('',()=>call('navigate',item.url),'bookmark-open'),copy=el('span',undefined,'history-item-copy');copy.append(el('strong',item.title||item.url),el('span',item.url));link.append(bookmarkIcon(item),copy);link.title=item.url;link.oncontextmenu=event=>{event.preventDefault();event.stopPropagation();call('history-item-menu',{url:item.url,id:item.id})};
   const time=el('time',stamp?new Date(stamp).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}):item.date||'Data não registrada');if(stamp)time.dateTime=new Date(stamp).toISOString();time.title=stamp?new Date(stamp).toLocaleString('pt-BR'):'Registro importado sem horário';
   const remove=settingsActionButton('Remover',()=>{history=history.filter(entry=>entry.id!==item.id);save('history',history);renderHistoryPage()},'remove','history-remove');remove.setAttribute('aria-label','Remover '+(item.title||item.url)+' do histórico');row.append(link,time,remove);list.append(row);
  }
  if(!shown.length)list.append(settingsEmptyState(history.length?'Nenhuma página encontrada':'Seu histórico está vazio',history.length?'Tente outro título, endereço ou período.':'As páginas que você visitar aparecerão aqui.','history'));
  refreshBookmarkIcons();
 };
 search.oninput=()=>{historySearch=search.value;draw()};period.onchange=()=>{historyPeriod=period.value;draw()};search.onkeydown=event=>{if(event.key==='Escape'&&search.value){event.preventDefault();historySearch='';search.value='';draw()}};draw();
 const key=profileNamespace+'|'+history.map(item=>item.url).join('|');if(key!==historyIconKey){historyIconKey=key;call('shortcut-icons',history.map(item=>item.url))}
}
function showPrivacySettings(){const body=showTools('Limpar dados de navegação');renderPrivacySettings(body);}
function renderPrivacySettings(body){
 const form=el('form');form.className='privacy-form';const period=el('select');period.className='field';period.id='clear-data-period';period.setAttribute('aria-label','Período para limpar');for(const [value,label]of [['hour','Última hora'],['day','Últimas 24 horas'],['week','Últimos 7 dias'],['month','Últimas 4 semanas'],['all','Todo o período']]){const option=el('option',label);option.value=value;period.append(option)}period.value='all';const label=el('label','Período');label.htmlFor=period.id;form.append(label,period);
 const checks={};for(const [key,label]of [['history','Histórico de navegação'],['cookies','Cookies criados/alterados no período'],['cache','Imagens e arquivos em cache (todo o período)'],['siteData','Armazenamento dos sites (todo o período)'],['passwords','Senhas salvas/importadas'],['downloads','Lista de downloads (preserva arquivos)']]){const row=el('label',undefined,'settings-row'),input=el('input'),text=el('span',undefined,'privacy-option-label');input.type='checkbox';input.checked=['history','cache'].includes(key);checks[key]=input;text.append(settingsIcon(key==='history'?'history':key==='passwords'?'passwords':key==='downloads'?'import':'privacy'),el('span',label));row.append(text,input);form.append(row)}
 const feedback=el('p','','manager-feedback muted');feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');const submit=el('button','Revisar e limpar','primary settings-icon-action');settingsButtonLabel(submit,'Revisar e limpar','remove');submit.type='submit';
 const updateSelection=()=>{const selected=Object.values(checks).filter(input=>input.checked&&!input.disabled).length;submit.disabled=!selected;submit.title=selected?'Revisar os '+selected+' tipos de dados selecionados':'Selecione pelo menos um tipo de dado'};
 period.onchange=()=>{for(const key of ['cache','siteData']){checks[key].disabled=period.value!=='all';if(checks[key].disabled)checks[key].checked=false}updateSelection()};for(const input of Object.values(checks))input.onchange=updateSelection;
 form.append(el('p','Cookies antigos sem data são removidos em “Todo o período”. Cache e armazenamento dos sites podem ser limpos nesse período. Favoritos, temas e login do EmbeeWeby são preservados.','muted'),submit,feedback);
 form.onsubmit=async event=>{
  event.preventDefault();const types=Object.fromEntries(Object.entries(checks).map(([key,input])=>[key,input.checked&&!input.disabled]));if(!Object.values(types).some(Boolean)){feedback.textContent='Selecione ao menos um tipo de dado.';return}const owner=profileNamespace;submit.disabled=true;
  try{const result=await call('clear-browsing-data',{range:period.value,types});if(owner!==profileNamespace||!body.isConnected)return;if(!result?.ok){feedback.textContent=result?.message||'Não foi possível limpar os dados.';return}if(result.canceled){feedback.textContent='Limpeza cancelada.';return}
   if(result.types.includes('history')){history=history.filter(item=>{const stamp=historyDate(item);return result.since?stamp<result.since||stamp>result.until:false});save('history',history)}feedback.textContent='Dados selecionados removidos.';renderHistoryPage();
  }catch{if(owner===profileNamespace&&body.isConnected)feedback.textContent='Não foi possível limpar os dados. Tente novamente.'}finally{if(body.isConnected)updateSelection()}
 };
 body.append(form);updateSelection();
}
function initHistoryTools(){const button=$('[data-panel="history"]');button.onclick=()=>call('history-open');button.oncontextmenu=event=>{event.preventDefault();event.stopPropagation();call('history-menu')};api?.onCommand(command=>{if(command?.type==='history-remove'){history=history.filter(item=>item.id!==command.id);save('history',history);renderHistoryPage()}});}
