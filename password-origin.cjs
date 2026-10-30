function loginOrigin(value){try{const u=new URL(value);return ['http:','https:'].includes(u.protocol)&&!u.username&&!u.password?u:null}catch{return null}}
function passwordMatchesSite(saved,current){const a=loginOrigin(saved),b=loginOrigin(current);return Boolean(a&&b&&b.protocol==='https:'&&a.hostname===b.hostname&&a.port===b.port&&(a.protocol===b.protocol||a.protocol==='http:'))}
module.exports={loginOrigin,passwordMatchesSite};
