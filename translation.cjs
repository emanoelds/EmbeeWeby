const {isIP}=require('node:net');
const languages=[['pt','Português'],['en','Inglês'],['es','Espanhol'],['fr','Francês'],['de','Alemão'],['it','Italiano'],['ja','Japonês'],['ko','Coreano'],['zh-CN','Chinês (simplificado)']];
function translationURL(value,language='pt'){
 if(!languages.some(([id])=>id===language))throw Error('Idioma de tradução inválido.');
 let u;try{u=new URL(value)}catch{throw Error('Abra um site para traduzir.');}
 const host=u.hostname.toLowerCase().replace(/\.$/,'');
 if(!['http:','https:'].includes(u.protocol)||u.username||u.password||u.href.length>8192||isIP(host)||host.includes(':')||!host.includes('.')||['localhost','local','internal','test','invalid'].some(s=>host===s||host.endsWith('.'+s)))throw Error('A tradução está disponível para sites públicos HTTP ou HTTPS, sem credenciais no endereço.');
 u.hash='';const target=new URL('https://translate.google.com/translate');target.searchParams.set('sl','auto');target.searchParams.set('tl',language);target.searchParams.set('u',u.href);return target.href;
}
async function translatePage({url,language='pt',window,dialog,open,isCurrent=()=>true}){
 let target;try{target=translationURL(url,language)}catch(error){await dialog.showMessageBox(window,{type:'info',title:'Traduzir site',message:error.message});return {ok:false};}
 const result=await dialog.showMessageBox(window,{type:'question',title:'Traduzir site',message:'Traduzir para '+languages.find(([id])=>id===language)[1]+'?',detail:'O endereço completo desta página será enviado ao Google Tradutor. A versão traduzida será aberta em uma nova aba. Sites com login e páginas privadas podem não ser traduzidos.',buttons:['Traduzir','Cancelar'],defaultId:0,cancelId:1,noLink:true});
 if(result.response!==0||!isCurrent())return {ok:false,canceled:true};open(target);return {ok:true};
}
module.exports={languages,translationURL,translatePage};
