const $=selector=>document.querySelector(selector),el=(tag,text,cls)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(cls)node.className=cls;return node},button=(label,action,cls)=>{const node=el('button',label,cls);node.type='button';node.onclick=action;return node};
let state={downloads:[]},prefs={reduced:false},profileNamespace='popup';
function reducedMotion(){return matchMedia('(prefers-reduced-motion: reduce)').matches}
function settingsIcon(name){const paths={export:'M12 3v12M7 10l5 5 5-5M4 16v5h16v-5',remove:'M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7M14 10v7',folder:'M3 6h7l2 3h9v12H3z',eye:'M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0',search:'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14M16 16l5 5',check:'M4 12l5 5L20 5'};const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');svg.classList.add('settings-icon');const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d',paths[name]||paths.export);svg.append(path);return svg}
function browserIcon(name){return settingsIcon(name==='close'?'remove':name)}
async function call(action,data){if(action!=='download-action')return {ok:false};return window.embeeDownloads.call(data)}
function toolMessage(message){const node=document.querySelector('.downloads-feedback');if(node)node.textContent=message}
function settingsButtonLabel(node,label,icon){node.replaceChildren(settingsIcon(icon),el('span',label));return node}
document.body.classList.add('downloads-popup');prefs.reduced=new URLSearchParams(location.search).get('reduced')==='1';document.body.classList.toggle('reduced',prefs.reduced);document.body.classList.toggle('light',new URLSearchParams(location.search).get('light')==='1');
const content=$('#downloads-popup-list');
window.embeeDownloads.onState(downloads=>{state.downloads=Array.isArray(downloads)?downloads:[];paintDownloads()});
$('#downloads-popup-close').onclick=()=>window.embeeDownloads.call({action:'close'});
$('#downloads-popup-manager').onclick=()=>window.embeeDownloads.call({action:'manager'});
window.embeeDownloads.call({action:'init'}).then(result=>{if(result?.ok){state.downloads=result.downloads;renderDownloadsManager(content,{compact:true})}else content.append(el('p',result?.message||'Downloads indisponíveis.'))});
