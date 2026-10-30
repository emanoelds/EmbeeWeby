const fs=require('node:fs'),path=require('node:path');
function applyWindowsBranding({app,window,shell,resourcesPath=process.resourcesPath,platform=process.platform}){
 if(platform!=='win32'||!app.isPackaged)return {updated:0};
 const icon=path.join(resourcesPath,'app-icon-'+app.getVersion()+'.ico');if(!fs.existsSync(icon))return {updated:0};
 const executable=app.getPath('exe'),appId='com.embeewebi.browser';
 window.setAppDetails({appId,appIconPath:icon,appIconIndex:0,relaunchCommand:'"'+executable+'"',relaunchDisplayName:'EmbeeWeby'});
 const roots=[app.getPath('desktop'),path.join(app.getPath('appData'),'Microsoft','Windows','Start Menu','Programs'),path.join(app.getPath('appData'),'Microsoft','Internet Explorer','Quick Launch','User Pinned','TaskBar')];let updated=0;
 for(const root of roots)for(const name of ['EmbeeWeby.lnk','EmbeeWebi.lnk']){const file=path.join(root,name);if(!fs.existsSync(file))continue;try{const current=shell.readShortcutLink(file);if(path.resolve(current.target).toLowerCase()!==path.resolve(executable).toLowerCase())continue;if(current.icon===icon&&current.iconIndex===0)continue;if(shell.writeShortcutLink(file,'update',{icon,iconIndex:0,appUserModelId:appId}))updated++}catch{}}
 return {updated,icon};
}
module.exports={applyWindowsBranding};
