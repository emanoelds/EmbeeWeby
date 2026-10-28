function pageTranslation(action,payload){
 const key='__embeeTranslation',state=globalThis[key]||(globalThis[key]={nodes:new Map(),next:0});
 if(action==='restore'){for(const item of state.nodes.values())if(item.node.isConnected&&item.node.nodeValue===item.translated)item.node.nodeValue=item.original;state.nodes.clear();return true;}
 if(action==='apply'){let count=0;for(const item of payload){const old=state.nodes.get(item.id);if(old&&old.node.isConnected&&(old.node.nodeValue===old.original||old.node.nodeValue===old.translated)){old.node.nodeValue=item.text;old.translated=item.text;count++;}}return count;}
 const items=[];let size=0,truncated=false;const walker=document.createTreeWalker(document.body||document.documentElement,NodeFilter.SHOW_TEXT);let node;
 while(node=walker.nextNode()){const parent=node.parentElement,text=node.nodeValue;if(!parent||!text.trim()||!/[\p{L}]/u.test(text)||parent.closest('script,style,noscript,textarea,input,select,option,code,pre,[contenteditable],[translate="no"],.notranslate,[hidden],[aria-hidden="true"]'))continue;
 const style=getComputedStyle(parent);if(style.display==='none'||style.visibility==='hidden'||!parent.getClientRects().length)continue;
 let old=[...state.nodes.values()].find(v=>v.node===node);if(old&&node.nodeValue!==old.original&&node.nodeValue!==old.translated){state.nodes.delete(old.id);old=null;}
 const original=old?.original||text;if(original.length>4000)continue;if(items.length>=2000||size+original.length>160000){truncated=true;break;}
 if(!old){const id=String(++state.next);old={id,node,original};state.nodes.set(id,old);}items.push({id:old.id,text:original});size+=original.length;
 }
 return {items,truncated};
}
module.exports={pageTranslation};
