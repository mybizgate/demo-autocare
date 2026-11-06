(function(){
'use strict';
const toggle=document.querySelector('[data-menu-toggle]');
const menu=document.querySelector('[data-menu]');
const form=document.querySelector('[data-booking-form]');
const service=document.querySelector('[data-service]');
const date=document.querySelector('[data-date]');
const status=document.querySelector('[data-form-status]');
const year=document.querySelector('[data-year]');
const config={brand:document.documentElement.dataset.brand||'Auto Care & Services',whatsapp:'601158121239',storageKey:'autocare_'+(document.documentElement.dataset.theme||'demo')};
if(year) year.textContent=String(new Date().getFullYear());
if(date){const t=new Date();const local=new Date(t.getTime()-t.getTimezoneOffset()*60000);date.min=local.toISOString().slice(0,10);}
if(toggle && menu){
 const setMenu=(open)=>{menu.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');};
 toggle.addEventListener('click',()=>setMenu(!menu.classList.contains('open')));
 menu.addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false)});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});
}
document.querySelectorAll('[data-select-service]').forEach(btn=>btn.addEventListener('click',e=>{
 e.preventDefault(); if(!service)return; service.value=btn.dataset.selectService||'';
 document.querySelector('#booking')?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
 service.focus({preventScroll:true});
}));
form?.addEventListener('submit',e=>{
 e.preventDefault(); if(!form.reportValidity())return;
 const d=Object.fromEntries(new FormData(form).entries());
 const message=[config.brand+' · appointment enquiry', 'Name: '+d.name,'Phone: '+d.phone,'Vehicle: '+d.vehicle,'Service: '+d.service, 'Preferred date: '+d.date,'Preferred time: '+d.time,'Notes: '+(d.notes||'-')].join('\n');
 try {localStorage.setItem(config.storageKey,JSON.stringify({...d,createdAt:new Date().toISOString()}));} catch(err) { /* private browsing may block storage */ }
 const url='https://wa.me/'+config.whatsapp+'?text='+encodeURIComponent(message);
 if(status)status.textContent='Opening WhatsApp. If blocked, use the link below.';
 const backup=document.querySelector('[data-wa-backup]'); if(backup){backup.href=url; backup.hidden=false;}
 const opened=window.open(url,'_blank','noopener'); if(!opened){if(status)status.textContent='Your enquiry is ready. Tap the WhatsApp link to continue.';}
});
})();
