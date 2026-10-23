const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
function cleanSession(value){const list=Array.isArray(value?.tabs)?value.tabs:[];const tabs=list.slice(0,200).map(t=>{if(['settings','history'].includes(t?.internal))return {internal:t.internal};try{const url=new URL(t?.url);if(['http:','https:'].includes(url.protocol)&&url.href.length<=8192)return {url:url.href}}catch{}return {url:''}});return {tabs,active:Math.max(0,Math.min(tabs.length-1,Number.isInteger(value?.active)?value.active:0))};}
function sessionFile(directory,owner){return path.join(directory,'sessions',crypto.createHash('sha256').update(owner||'local').digest('hex').slice(0,24)+'.json')}
function loadSession(directory,owner){try{return cleanSession(JSON.parse(fs.readFileSync(sessionFile(directory,owner),'utf8')))}catch{return {tabs:[],active:0}}}
function saveSession(directory,owner,value){try{const file=sessionFile(directory,owner);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file+'.tmp',JSON.stringify(cleanSession(value)));fs.renameSync(file+'.tmp',file);return true}catch{return false}}
module.exports={cleanSession,loadSession,saveSession};
