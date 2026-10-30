// Local procedural animation. No network, image copies, or page-content access.
(()=>{
'use strict';
const profiles=[
 [['Chakra e folhas','wind','#ffb336','#56afff'],['Chidori','electric','#bba1ff','#75d4ff'],['Pétalas de cerejeira','petal','#ff9ec6','#ffdee8'],['Raikiri','electric','#a0ddff','#e0efff'],['Corvos e brasas','feather','#eb5363','#a98fe0'],['Punhos dos Leões Gêmeos','aura','#a4bfff','#e5c9ff']],
 [['Vento do Grand Line','wind','#ffcc67','#ffffff'],['Cortes de espada','slash','#77eaaf','#d9a6ff'],['Clima e relâmpagos','electric','#ffbb54','#8de5ff'],['Pétalas da Hana Hana','petal','#b79aff','#eed4ff'],['Diable Jambe','flame','#ff963e','#fff2a6'],['Mera Mera','flame','#ff6c35','#ffd576']],
 [['Respiração da Água','water','#53dcf4','#b6f9ff'],['Chamas da Arte Demoníaca','flame','#ff7fb9','#ffd2ec'],['Respiração do Trovão','electric','#ffe16c','#fff7c2'],['Dança das Borboletas','butterfly','#c0a3ff','#92e7d3'],['Respiração das Chamas','flame','#ff782f','#ffe696'],['Respiração da Fera','slash','#83c5e8','#d9efff']],
 [['Infinito e energia amaldiçoada','infinity','#65dfff','#be8dff'],['Impacto Negro','electric','#ff5a78','#bc416a'],['Jardim das Sombras','shadow','#6587c0','#afa6ff'],['Ressonância','rune','#e2a05d','#f66488'],['Santuário Malevolente','slash','#ff506a','#bf6d96'],['Energia de Rika','aura','#aab5ff','#d6c9ff'],['Restrição Celestial','speed','#8ac7b4','#d1b4ed']],
 [['Aura de ki','aura','#ffc552','#ff963e'],['Orgulho Saiyajin','aura','#739fff','#cfb1ff'],['Ki Namekuseijin','aura','#a5e478','#b29aff'],['Energia do Futuro','electric','#93c8ff','#d5b5ff'],['Poder Oculto','aura','#f0c56b','#b491ff'],['Voo e controle de ki','wind','#e4b5ff','#a9e5ff']],
 [['Asas da Liberdade','feather','#d68289','#b9d1c9'],['Lâminas e velocidade','speed','#c2e3dd','#ffffff'],['Vapor do Colossal','steam','#f4cb93','#e9e9dc'],['Vapor Titã','steam','#dba96f','#aad0a1'],['Expedição e sinalizadores','spark','#c7d6aa','#edb96c']],
 [['Chamas Negras','shadow','#9f7bf5','#ce9df2'],['Luz da Deusa','feather','#fff3b6','#c9e1ff'],['Criação da Terra','stone','#dab16e','#c9d58c'],['Pó de Fada e Chastiefol','leaf','#9aebc2','#ffe0a0'],['Energia da Raposa','spark','#f38f9f','#e8d7ed']],
 [['Vento de Axel','wind','#95d7ae','#e1dba7'],['Nature’s Beauty','water','#81dfff','#c5baff'],['Explosion','rune','#ff784e','#ffdc81'],['Luz da Cruzada','spark','#ffe39b','#d4e5f1']],
 [['Faíscas de motosserra','spark','#ffa15b','#ffe5a1'],['Armas de Sangue','slash','#f67e9b','#ffbecb'],['Contrato da Raposa','shadow','#abc8eb','#f1f4ff'],['Olhar do Controle','rune','#ffae84','#f6d889']],
 [['Onda de um soco sério','speed','#ffdd72','#fff4cc'],['Núcleo de Incineração','electric','#ffc36c','#f9e6c9'],['Tornado Psíquico','wind','#79f0b4','#d4ffe9'],['Fluxo de Água','water','#a7d5ff','#e1ebff']]
];
function resolve(){
 if(theme.custom?.enabled){const brand=theme.custom.brand;return {name:brand==='embeesign'?'Selo digital e circuitos de certificação':brand?'Colmeia tecnológica':'Luzes do seu tema',kind:brand?'tech':'aura',a:theme.custom.accent||'#ffce40',b:theme.custom.secondary||'#8edfff'};}
 const p=profiles[theme.universe]?.[theme.character]||['Energia do universo','aura','#faca69','#c6dfff'];
 const result={name:p[0],kind:p[1],a:p[2],b:p[3]};
 const art=selectedArtwork(theme.universe,theme.character),form=((art?.id||'')+' '+(art?.name||'')).toLowerCase();
 if(theme.universe===4){if(/blue|azul/.test(form))Object.assign(result,{a:'#4bcaff',b:'#b3f2ff',name:'Aura Super Saiyajin Blue'});else if(/ultra|instinto|beast/.test(form))Object.assign(result,{a:'#e1e8ff',b:'#ad86ff',kind:'electric',name:'Aura prateada e relâmpagos'});else if(/super saiy|ssj|saiyajin|majin|hope/.test(form))Object.assign(result,{a:'#ffe36e',b:'#fff6c2',kind:'electric',name:'Aura Super Saiyajin'});else if(/orange|laranja/.test(form))Object.assign(result,{a:'#ffa442',b:'#ffe0a0',name:'Aura Orange Piccolo'});}
 if(theme.universe===1&&theme.character===0&&/gear.?5|gear.?five|nika/.test(form))Object.assign(result,{kind:'steam',a:'#ffffff',b:'#e2c3ff',name:'Nuvens de Gear 5'});
 if(theme.universe===2&&theme.character===0&&/hinokami|fogo|solar/.test(form))Object.assign(result,{kind:'flame',a:'#ff873c',b:'#ffdb7d',name:'Hinokami Kagura'});
 return result;
}
let canvas,ctx,home,profile,key='',particles=[],frame=0,last=0,time=0,width=1,height=1,scale=1,draws=0,focused=true;
const trail=[];const pointer={x:0,y:0},motion=matchMedia('(prefers-reduced-motion: reduce)');
const rand=(a,b)=>a+Math.random()*(b-a),tau=Math.PI*2;
function quality(){return cleanPresentation(prefs.presentation).quality}function budget(){return quality()==='eco'?{fps:24,count:40,pixels:1500000,dpr:1.25}:quality()==='cinema'?{fps:45,count:130,pixels:3300000,dpr:1.75}:{fps:30,count:85,pixels:2600000,dpr:1.5}}
function resize(){if(!canvas)return;const r=home.getBoundingClientRect();width=Math.max(1,r.width);height=Math.max(1,Math.min(r.height,innerHeight));scale=Math.min(devicePixelRatio||1,budget().dpr,Math.sqrt(budget().pixels/(width*height)));canvas.width=Math.ceil(width*scale);canvas.height=Math.ceil(height*scale);canvas.style.height=height+'px';ctx.setTransform(scale,0,0,scale,0,0);}
function spawn(initial=false){return {x:Math.random()*width,y:initial?Math.random()*height:height+rand(15,90),size:rand(1.2,4.5),vx:rand(-.15,.25),vy:rand(.25,.9),phase:rand(0,tau),spin:rand(-1,1),life:rand(.2,1),color:Math.random()>.45?profile.a:profile.b};}
function visible(){return home&&!home.hidden&&!document.hidden&&focused&&!document.body.classList.contains('site-fullscreen')&&home.getBoundingClientRect().bottom>0;}
function enabled(){return !prefs.reduced&&!motion.matches&&cleanPresentation(prefs.presentation).effects>0;}
function stop(){cancelAnimationFrame(frame);frame=0;last=0;if(ctx)ctx.clearRect(0,0,width,height);}
function reconcile(){if(!canvas)return;if(enabled()&&visible()){canvas.hidden=false;if(!frame)frame=requestAnimationFrame(tick);}else{canvas.hidden=true;stop();}}
function glow(x,y,r,color,alpha){ctx.globalAlpha=alpha;const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color+'66');g.addColorStop(.35,color+'22');g.addColorStop(1,color+'00');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);}
function stroke(points,color,alpha=1,line=1){ctx.globalAlpha=alpha;ctx.strokeStyle=color;ctx.lineWidth=line;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();}
function ring(x,y,r,color,phase,segments=0){ctx.strokeStyle=color;ctx.lineWidth=1;ctx.beginPath();if(segments){for(let i=0;i<=segments;i++){const a=i*tau/segments+phase;const px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}}else ctx.ellipse(x,y,r,r*.38,phase,0,tau);ctx.stroke();}
function atmosphere(t,intensity){
 const x=width*.76+pointer.x*10,y=height*.46+pointer.y*7,r=Math.min(width,height)*.35,pulse=.86+Math.sin(t*.65)*.14;
 glow(x,y,r,profile.a,.34*intensity*pulse);glow(x+r*.6,y-r*.4,r*.7,profile.b,.23*intensity);
 ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.17*intensity;
 if(['infinity','rune','tech','water','wind'].includes(profile.kind)){
  for(let i=0;i<3;i++){ctx.globalAlpha=(.17-i*.03)*intensity;ring(x,y,r*(.48+i*.23),i%2?profile.b:profile.a,t*(i%2?-.09:.07)+i*.7,profile.kind==='tech'?8:profile.kind==='rune'?12:0);}
 }
 if(['aura','flame','shadow','electric','steam'].includes(profile.kind)){
  for(let i=0;i<5;i++){const offset=Math.sin(t*.5+i)*r*.07;ctx.globalAlpha=(profile.kind==='steam'?.045:.08)*intensity;ctx.strokeStyle=i%2?profile.b:profile.a;ctx.lineWidth=profile.kind==='steam'?25:2;ctx.beginPath();ctx.moveTo(x-r*.55+i*r*.27,y+r*.8);ctx.bezierCurveTo(x-r+i*r*.3+offset,y+r*.1,x+r*.65-i*r*.24,y-r*.3,x+offset+(i-2)*r*.12,y-r*.9);ctx.stroke();}
 }
 if(['speed','slash','electric'].includes(profile.kind))for(let i=0;i<4;i++){const f=(t*.13+i*.25)%1,yy=height*(.15+f*.75),xx=width*(.55+f*.25);stroke([[xx-100,yy+35],[xx+90,yy-28]],profile.b,Math.sin(f*Math.PI)*.17*intensity,1);}
 ctx.globalCompositeOperation='source-over';
}
function energy(t,intensity,settings){
 const x=width*.76,y=height*.46,r=Math.min(width,height)*.4;ctx.globalCompositeOperation='lighter';
 if(settings.rays)for(let i=0;i<(settings.quality==='eco'?3:6);i++){const a=-2.7+i*.36+Math.sin(t*.12+i)*.13;const g=ctx.createLinearGradient(x,y,x+Math.cos(a)*r*1.6,y+Math.sin(a)*r*1.6);g.addColorStop(0,profile.a+'44');g.addColorStop(1,profile.b+'00');ctx.fillStyle=g;ctx.globalAlpha=.12*intensity;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(a-.06)*r*1.6,y+Math.sin(a-.06)*r*1.6);ctx.lineTo(x+Math.cos(a+.06)*r*1.6,y+Math.sin(a+.06)*r*1.6);ctx.fill()}
 if(settings.pulses)for(let i=0;i<2;i++){const phase=(t*.12+i*.5)%1;ctx.globalAlpha=Math.sin(phase*Math.PI)*.13*intensity;ring(x,y,r*(.2+phase),i?profile.b:profile.a,t*.08)}
 if(settings.arcs){for(let k=0;k<(settings.quality==='eco'?1:3);k++){const points=[];for(let i=0;i<=24;i++){const a=i/24*Math.PI*1.4+t*.12+k*2,rr=r*(.5+k*.16)+Math.sin(i*2+t*1.5+k)*r*.024;points.push([x+Math.cos(a)*rr,y+Math.sin(a)*rr*.8])}stroke(points,k%2?profile.b:profile.a,.13*intensity,1)}}
 if(settings.pointerTrail){const now=performance.now();while(trail.length&&now-trail[0].time>600)trail.shift();for(const p of trail)glow(p.x*width,p.y*height,18,profile.a,(1-(now-p.time)/600)*.22*intensity)}else trail.length=0;
 ctx.globalCompositeOperation='source-over';
}
function particle(p,t,dt,intensity){
 p.y-=p.vy*dt;p.x+=(p.vx+Math.sin(t*.6+p.phase)*.18)*dt;
 if(p.y< -50||p.x< -60||p.x>width+60)Object.assign(p,spawn());
 const x=p.x+Math.sin(t*.8+p.phase)*14,y=p.y,s=p.size,kind=profile.kind;
 // Leave the reading column calm; the brighter field surrounds the artwork.
 const zone=x<width*.42?.3:1,fade=Math.max(0,Math.min(1,(height-y)/80,y/55));
 ctx.globalAlpha=(.32+Math.sin(t+p.phase)*.2)*intensity*zone*fade;ctx.fillStyle=p.color;ctx.strokeStyle=p.color;ctx.lineWidth=.9;
 ctx.save();ctx.translate(x,y);ctx.rotate(p.phase+t*p.spin*.2);
 if(['petal','leaf','feather','butterfly'].includes(kind)){
  const wing=kind==='butterfly'?Math.sin(t*4+p.phase)*.65+.8:1;
  ctx.beginPath();ctx.ellipse(-s*.6,0,s*1.6*wing,s*.65,.45,0,tau);ctx.fill();
  if(kind==='butterfly'){ctx.beginPath();ctx.ellipse(s*.6,0,s*1.6*wing,s*.65,-.45,0,tau);ctx.fill();}else{ctx.globalAlpha*=.6;stroke([[-s*1.4,0],[s*1.4,0]],profile.b,ctx.globalAlpha,.6);}
 }else if(kind==='electric'){
  const n=Math.sin(t*2+p.phase);ctx.beginPath();ctx.moveTo(-s*2,-s*3);ctx.lineTo(s*.3,-s);ctx.lineTo(-s*.5,0);ctx.lineTo(s*2,s*3+n*s);ctx.stroke();
 }else if(kind==='rune'||kind==='tech'){
  ring(0,0,s*2,p.color,t*.2,kind==='tech'?8:4);if(kind==='rune')stroke([[-s*2,0],[s*2,0]],p.color,ctx.globalAlpha,.8);
 }else if(kind==='water'){
  ctx.beginPath();ctx.ellipse(0,0,s*1.5,s*.55,0,0,tau);ctx.stroke();
 }else if(kind==='slash'||kind==='speed'){
  stroke([[-s*5,s],[s*4,-s]],p.color,ctx.globalAlpha,kind==='speed'?.7:1.1);
 }else if(kind==='stone'){
  ctx.beginPath();ctx.moveTo(-s,s);ctx.lineTo(-s*.8,-s);ctx.lineTo(s*.6,-s*.8);ctx.lineTo(s,s*.7);ctx.closePath();ctx.fill();
 }else if(kind==='steam'||kind==='shadow'){
  const g=ctx.createRadialGradient(0,0,0,0,0,s*5);g.addColorStop(0,p.color+'60');g.addColorStop(1,p.color+'00');ctx.fillStyle=g;ctx.fillRect(-s*5,-s*5,s*10,s*10);
 }else{
  ctx.beginPath();ctx.ellipse(0,0,kind==='flame'?s*.5:s*.65,kind==='flame'?s*2.5:s*.65,0,0,tau);ctx.fill();
  if(p.life>.75){ctx.globalAlpha*=.2;ctx.beginPath();ctx.arc(0,0,s*2.3,0,tau);ctx.fill();}
 }
 ctx.restore();
}
function tick(now){frame=0;if(!enabled()||!visible()){reconcile();return;}frame=requestAnimationFrame(tick);if(last&&now-last<1000/budget().fps)return;
 const delta=last?Math.min(60,now-last):33;last=now;const settings=cleanPresentation(prefs.presentation),speed=settings.speed==='slow'?.6:settings.speed==='fast'?1.45:1;
 time+=delta*.001*speed;const dt=delta/16.667*speed,intensity=settings.effects/100*(prefs.light?.76:1);
 ctx.clearRect(0,0,width,height);if(settings.auras)atmosphere(time,intensity);energy(time,intensity,settings);for(const p of particles)particle(p,time,dt,intensity);ctx.globalAlpha=1;draws++;
}
function sync(){
 if(!home){home=document.querySelector('#home-page');if(!home)return;const wallpaper=document.createElement('div');wallpaper.className='theme-wallpaper-viewport';wallpaper.setAttribute('aria-hidden','true');home.prepend(wallpaper);canvas=document.createElement('canvas');canvas.id='theme-particles';canvas.setAttribute('aria-hidden','true');canvas.setAttribute('role','presentation');home.prepend(canvas);ctx=canvas.getContext('2d',{alpha:true});if(!ctx){canvas.remove();canvas=null;return;}
  new ResizeObserver(resize).observe(home);new MutationObserver(reconcile).observe(home,{attributes:true,attributeFilter:['hidden']});new MutationObserver(reconcile).observe(document.body,{attributes:true,attributeFilter:['class']});resize();
 }
 if(!canvas)return;profile=resolve();const next=JSON.stringify([profile,quality()]),changed=next!==key;if(changed){key=next;resize();time=0;particles=Array.from({length:Math.min(budget().count,Math.max(35,Math.round(width*height/16000)*(quality()==='cinema'?1.5:1)))},()=>spawn(true));canvas.dataset.effect=profile.name;canvas.dataset.kind=profile.kind;}
 reconcile();
}
addEventListener('resize',resize,{passive:true});document.addEventListener('visibilitychange',reconcile);motion.addEventListener('change',reconcile);
addEventListener('blur',()=>{focused=false;reconcile()});addEventListener('focus',()=>{focused=true;reconcile()});
addEventListener('pointermove',e=>{pointer.x=e.clientX/innerWidth-.5;pointer.y=e.clientY/innerHeight-.5;if(home&&!home.hidden&&enabled()&&cleanPresentation(prefs.presentation).pointerTrail){const r=home.getBoundingClientRect();if(e.clientY>=r.top){trail.push({x:(e.clientX-r.left)/width,y:(e.clientY-r.top)/height,time:performance.now()});if(trail.length>14)trail.shift()}}},{passive:true});addEventListener('pagehide',stop);
window.EmbeeThemeEffects={sync,resolve,status:()=>({effect:profile?.name,kind:profile?.kind,running:!!frame,particles:particles.length,draws,width:canvas?.width,height:canvas?.height})};
})();
