// Shared by the shell and main process: selected address text is not always a full URL.
function parseNavigationDrop(value,allowSearch=false){
 if(typeof value!=='string'||value.length>8192)return null;
 const text=value.trim();if(!text||/[\u0000-\u001f\u007f]/.test(text))return null;
 if(/^https?:\/\//i.test(text)){try{const u=new URL(text);return !u.username&&!u.password?{url:u.href}:null}catch{return null}}
 if(/^[a-z][a-z\d+.-]*:\/\//i.test(text))return null;
 if(!/\s/.test(text))try{const u=new URL('https://'+text);if(!u.username&&!u.password&&(u.hostname==='localhost'||u.hostname.includes('.')||/^\[[\da-f:]+\]$/i.test(u.hostname)))return {url:u.href}}catch{}
 if(/^[a-z][a-z\d+.-]*:/i.test(text)||text.startsWith('//'))return null;
 return allowSearch?{text}:null;
}
if(typeof module!=='undefined')module.exports={parseNavigationDrop};
