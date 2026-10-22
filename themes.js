// Local wallpapers and character palettes; no network requests are needed.
const animeScenes=[
 {id:'naruto',label:'Aldeia da Folha ao pôr do sol',symbol:'忍',headline:'Seu caminho ninja começa aqui.',colors:[['#f98419','#245ca6','Chama laranja e azul do traje ninja'],['#9678ed','#ab243a','Violeta e vermelho Uchiha'],['#ed79a0','#a52b49','Rosa de cerejeira e vermelho'],['#91a2ad','#647b55','Prata, verde do colete e azul profundo']]},
 {id:'one-piece',label:'Um novo horizonte no Grand Line',symbol:'海',headline:'O próximo horizonte espera por você.',colors:[['#ed3945','#e8b849','Vermelho, palha dourada e azul do mar'],['#56b86b','#b94343','Verde, aço e detalhes carmesim'],['#f7962c','#4bbad9','Laranja, tangerina e azul oceano'],['#9d70d5','#357eaf','Violeta e azul profundo']]},
 {id:'demon-slayer',label:'Glicínias sob a luz da lua',symbol:'滅',headline:'Encontre força para seguir em frente.',colors:[['#35b88e','#172f2b','Verde e preto em padrão xadrez'],['#ed8eac','#7c403e','Rosa do quimono e vermelho escuro'],['#efb92d','#fff0c2','Amarelo, branco e luz de trovão'],['#ac8ae4','#83caba','Lilás e verde das asas de borboleta']]},
 {id:'jujutsu',label:'Tóquio envolta em energia amaldiçoada',symbol:'呪',headline:'Transforme sua energia em descoberta.',colors:[['#64cfff','#9b86ee','Azul luminoso e violeta do infinito'],['#ee718b','#bf313a','Rosa, vermelho e uniforme escuro'],['#6b91b5','#274a67','Azul profundo e sombras'],['#dd8548','#a93945','Cobre, vermelho e azul marinho']]},
 {id:'dragon-ball',label:'Um vale entre montanhas e esferas',symbol:'龍',headline:'Há sempre um novo limite a superar.',colors:[['#fa8d22','#2866d4','Laranja do gi e azul intenso'],['#538ded','#e8c762','Azul real, branco e dourado da armadura'],['#7ab953','#9669c7','Verde e roxo do traje']]},
 {id:'titan',label:'Além das muralhas',symbol:'翼',headline:'Explore o mundo além das muralhas.',colors:[['#c64d54','#68725e','Vermelho do cachecol e verde militar'],['#92a388','#bfc7cd','Verde da capa, prata e cinza'],['#ddbc76','#6a967b','Dourado e verde da tropa']]}
];
function applyAnimeScene(universeIndex,characterIndex){
 const scene=animeScenes[universeIndex]||animeScenes[0],palette=scene.colors[characterIndex]||scene.colors[0];
 document.body.dataset.anime=scene.id;document.body.dataset.character=String(characterIndex);
 const root=document.documentElement.style;
 root.setProperty('--wallpaper',`url("assets/themes/${scene.id}.png")`);
 root.setProperty('--secondary',palette[1]);root.setProperty('--scene-pattern',scene.id==='demon-slayer'&&characterIndex===0?'repeating-conic-gradient(#35b88e22 0% 25%,transparent 0% 50%)':'none');
 const title=document.querySelector('.hero h1');if(title)title.textContent=scene.headline;
 const copy=document.querySelector('.hero-copy>p');if(copy)copy.textContent=scene.label+' · '+palette[2]+'.';
 const mark=document.querySelector('.art-jp');if(mark)mark.textContent=scene.symbol;
 const caption=document.querySelector('.art-caption');if(caption)caption.textContent=scene.label;
 const art=document.querySelector('.art');if(art)art.setAttribute('aria-label',scene.label);
}

