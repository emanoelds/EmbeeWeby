const {CancellationToken}=require('builder-util-runtime');
const {app,shell,safeStorage}=require('electron');
const {autoUpdater}=require('electron-updater');
const fs=require('node:fs');
const path=require('node:path');

function createUpdates(notify){
  let config={};
  try{config=JSON.parse(fs.readFileSync(path.join(__dirname,'release-config.json'),'utf8'))}catch{}
  const connected=/^[a-z0-9][a-z0-9-]*$/i.test(config.githubOwner||'')&&/^[a-z0-9_.-]+$/i.test(config.githubRepo||'');
  const isPrivate=config.private===true;
  const releaseUrl=connected?`https://github.com/${config.githubOwner}/${config.githubRepo}/releases/latest`:null;
  const credentialsUrl='https://github.com/settings/personal-access-tokens/new';
  const tokenFile=path.join(app.getPath('userData'),'private-update-access.bin');
  let memoryToken='',secure=false,authorized=!isPrivate,disposed=false;
  const secureReady=safeStorage.isAsyncEncryptionAvailable().then(value=>{secure=value&&!(process.platform==='linux'&&safeStorage.getSelectedStorageBackend()==='basic_text');return secure}).catch(()=>false);
  async function readToken(){await secureReady;if(memoryToken)return memoryToken;if(!secure)return '';try{const result=await safeStorage.decryptStringAsync(fs.readFileSync(tokenFile));memoryToken=result.result;return memoryToken}catch{return ''}}
  async function saveToken(token){await secureReady;if(secure){fs.mkdirSync(path.dirname(tokenFile),{recursive:true});const temp=tokenFile+'.tmp';fs.writeFileSync(temp,await safeStorage.encryptStringAsync(token),{mode:0o600});fs.renameSync(temp,tokenFile)}memoryToken=token;}
  function canInstall(){return Boolean(app.isPackaged)}
  let status={version:app.getVersion(),phase:connected?'connected':'unconfigured',releaseUrl,private:isPrivate,authorized,automatic:false,message:connected?(isPrivate?'Canal privado conectado. Autorize este computador para consultar as versões.':'Canal de publicação conectado.'):'Canal de publicação ainda não conectado.'};
  const emit=patch=>{if(disposed)return;status={...status,authorized,automatic:canInstall(),secureCredential:secure,...patch};notify(status)};
  let busy=false,downloadToken=null,downloaded=[];
  autoUpdater.autoDownload=false;
  autoUpdater.autoInstallOnAppQuit=false;
  autoUpdater.allowDowngrade=false;
  autoUpdater.allowPrerelease=false;
  autoUpdater.on('checking-for-update',()=>emit({phase:'checking',message:'Verificando atualizações…'}));
  autoUpdater.on('update-available',info=>emit({phase:'manual',message:'Versão '+info.version+' disponível. Clique em Baixar para iniciar o download.',available:info.version}));
  autoUpdater.on('download-progress',progress=>emit({phase:'downloading',percent:Math.round(progress.percent||0),message:'Baixando atualização: '+Math.round(progress.percent||0)+'%'}));
  autoUpdater.on('update-downloaded',info=>emit({phase:'downloaded',percent:100,message:'Versão '+info.version+' baixada. Preparando instalação…'}));
  autoUpdater.on('update-not-available',()=>emit({phase:'current',message:'Você está usando a versão mais recente.',available:null,checkedAt:new Date().toISOString()}));
  autoUpdater.on('error',()=>emit({phase:'error',message:isPrivate?'Não foi possível consultar o canal privado. Confira o acesso ao GitHub e tente novamente.':'Não foi possível consultar o canal agora.'}));
  async function setupFeed(){if(!connected)return false;const token=isPrivate?await readToken():'';authorized=!isPrivate||Boolean(token);if(!authorized){emit({phase:'auth-required',message:'Canal privado conectado. Autorize este computador para consultar as versões.'});return false}autoUpdater.setFeedURL({provider:'github',owner:config.githubOwner,repo:config.githubRepo,private:isPrivate,...(token?{token}:{})});autoUpdater.autoDownload=false;autoUpdater.autoInstallOnAppQuit=false;return true}
  async function check(){if(busy)return status;if(!connected){emit({phase:'unconfigured',message:'Canal de publicação ainda não conectado.'});return status}try{busy=true;if(!await setupFeed())return status;if(!app.isPackaged){emit({phase:'development',message:'Canal conectado e acesso autorizado. A consulta de versões está disponível no aplicativo instalado.'});return status}await autoUpdater.checkForUpdates()}catch{emit({phase:'error',message:'Não foi possível consultar o canal. Confira sua conexão e autorização.'})}finally{busy=false}return status}
  async function authorize(token){try{if(!connected||!isPrivate)throw Error('Canal privado não configurado.');if(typeof token!=='string'||token.length<20||token.length>255||/\s/.test(token))throw Error('Informe um token de acesso válido do GitHub.');const options={headers:{Authorization:'Bearer '+token,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'},signal:AbortSignal.timeout(15000)};const url=`https://api.github.com/repos/${config.githubOwner}/${config.githubRepo}/releases?per_page=1`;const result=await fetch(url,options);if(!result.ok)throw Error('O token não permite ler as versões deste repositório. Use acesso de leitura a Contents no EmbeeWebi.');await result.body?.cancel();await saveToken(token);authorized=true;await setupFeed();emit({phase:'connected',message:secure?'Acesso ao canal privado autorizado e salvo no cofre do sistema.':'Acesso autorizado somente nesta sessão; o sistema não oferece um cofre seguro.'});return {ok:true}}catch(e){return {ok:false,message:e.message||'Não foi possível autorizar o computador.'}}}
  async function disconnect(){downloadToken?.cancel();downloaded=[];memoryToken='';authorized=!isPrivate;autoUpdater.autoDownload=false;autoUpdater.autoInstallOnAppQuit=false;try{fs.unlinkSync(tokenFile)}catch{}emit({phase:'auth-required',message:'Autorização deste computador removida.'});return {ok:true}}
  async function download(){if(busy)return status;if(!status.available){emit({phase:'error',message:'Verifique as atualizações antes de baixar.'});return status}try{busy=true;if(!await setupFeed())return status;downloaded=[];downloadToken=new CancellationToken();emit({phase:'downloading',percent:0,message:'Iniciando download da atualização…'});downloaded=await autoUpdater.downloadUpdate(downloadToken);if(!downloaded.length)throw Error('Download vazio');emit({phase:'installing',percent:100,message:'Download validado. Fechando o EmbeeWeby para instalar e reabrir…'});if(app.isPackaged)autoUpdater.quitAndInstall(false,true);}catch{emit({phase:downloadToken?.cancelled?'manual':'error',message:downloadToken?.cancelled?'Download cancelado. Você pode tentar novamente.':'Não foi possível baixar ou validar a atualização. Confira o acesso e tente novamente.'});}finally{downloadToken=null;busy=false}return status}
  function cancel(){downloadToken?.cancel();return status}
  function showDownloaded(){const file=downloaded.find(file=>typeof file==='string'&&fs.existsSync(file));if(file)shell.showItemInFolder(file);return {ok:Boolean(file)}}
  return {status:()=>status,download,cancel,showDownloaded,start(){if(connected)setupFeed().catch(()=>{})},check,authorize,disconnect,open(){if(releaseUrl)return shell.openExternal(releaseUrl)},help(){return shell.openExternal(credentialsUrl)},install(){},dispose(){disposed=true}};
}
module.exports={createUpdates};
