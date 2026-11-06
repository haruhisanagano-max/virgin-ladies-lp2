/* 設定URLだけを使用。未設定・仮URL・危険なスキームはリンクにしません。 */
(function(root){
 'use strict';
 function resolve(value,kind='web') {
  if(typeof value!=='string'||!value.trim())return null;
  const v=value.trim();
  if(/[\u0000-\u0020\u007f\\]/.test(v))return null;
  if(kind!=='line'&&/^\/(?!\/)/.test(v))return v;
  try {
   const u=new URL(v);
   if(u.protocol!=='https:'||u.username||u.password)return null;
   if(/(^|\.)(example\.(com|org|net)|invalid|localhost)$/.test(u.hostname))return null;
   if(kind==='line'&&!/^(line\.me|lin\.ee|liff\.line\.me)$/.test(u.hostname))return null;
   return u.href;
  }catch{return null;}
 }
 root.LP_LINKS=Object.freeze({resolve});
})(window);
