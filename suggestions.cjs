// Only search text is sent to the fixed suggestion endpoint; no browsing cookies.
function createSuggestions(fetchImpl=fetch){
 let controller,lastRequest=0;
 return async function suggest(raw){
  controller?.abort();controller=null;
  if(typeof raw!=='string')return [];
  const q=raw.trim();
  if(q.length<2||q.length>160||/[:/@\\]|\b(?:localhost|\d{1,3}(?:\.\d{1,3}){3})\b|\.[a-z]{2,}(?:\s|$)/i.test(q))return [];
  const now=Date.now();if(now-lastRequest<180)return [];lastRequest=now;
  const request=new AbortController();controller=request;
  const timeout=setTimeout(()=>request.abort(),3000);
  try{
   const response=await fetchImpl('https://suggestqueries.google.com/complete/search?client=firefox&hl=pt-BR&q='+encodeURIComponent(q),{credentials:'omit',redirect:'error',signal:request.signal});
   if(!response.ok)return [];
   const reader=response.body.getReader(),chunks=[];let length=0;
   while(true){const part=await reader.read();if(part.done)break;length+=part.value.byteLength;if(length>65536){await reader.cancel();return []}chunks.push(Buffer.from(part.value))}
   const result=JSON.parse(Buffer.concat(chunks).toString('utf8'));
   return Array.isArray(result?.[1])?result[1].filter(x=>typeof x==='string'&&x.length<=200).slice(0,6):[];
  }catch{return []}finally{clearTimeout(timeout);if(controller===request)controller=null}
 };
}
module.exports={createSuggestions};

