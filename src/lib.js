
/* ---------- exercise library («کتابخانهٔ حرکات») — categories → equipment → exercise ---------- */
Object.keys(LIBX).forEach(k=>{EX[k]=Object.assign({},EX[k]||{},LIBX[k]);});
const KIND=[['free','وزنهٔ آزاد','Free Weights'],['machine','دستگاه','Machines'],['cable','سیم‌کش','Cables'],['body','وزن بدن','Bodyweight']];
/* «soon»: the professional roadmap per category (shown greyed until its 3D model is built) */
const CATS=[
 {id:'chest',fa:'سینه',en:'Chest',soon:{}},
 {id:'back',fa:'پشت',en:'Back',soon:{}},
 {id:'shoulders',fa:'سرشانه',en:'Shoulders',soon:{}},
 {id:'arms',fa:'بازو',en:'Arms',soon:{}},
 {id:'legs',fa:'پا و باسن',en:'Legs & Glutes',soon:{}},
 {id:'core',fa:'شکم و پهلو',en:'Core & Obliques',soon:{}},
 {id:'golf',fa:'توان چرخشی گلف',en:'Golf Rotation & Power',soon:{}}
];
const EQI={ /* gold line icons per equipment */
 'هالتر':'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 24h36"/><rect x="10" y="14" width="5" height="20" rx="1.5"/><rect x="33" y="14" width="5" height="20" rx="1.5"/><path d="M15.5 18v12M32.5 18v12"/></svg>',
 'دمبل':'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M17 24h14"/><path d="M8 17l4-2h3v18h-3l-4-2z"/><path d="M40 17l-4-2h-3v18h3l4-2z"/></svg>',
 'فلای دمبل':'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M8 30c4-12 28-12 32 0" stroke-dasharray="2 4"/><path d="M5 31h7M5 28v6M12 28v6M36 31h7M36 28v6M43 28v6"/><circle cx="24" cy="15" r="3"/></svg>',
 'اسمیت':'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 6v36M36 6v36M8 42h32"/><path d="M6 20h36"/><rect x="8" y="15" width="3" height="10" rx="1"/><rect x="37" y="15" width="3" height="10" rx="1"/></svg>',
 machine:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M14 42V8h6v34M10 42h28"/><rect x="24" y="12" width="10" height="16" rx="2"/><path d="M24 17h10M24 22h10"/></svg>',
 cable:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="24" cy="9" r="4"/><path d="M24 13v20"/><path d="M18 33h12l-2 6h-8z"/><path d="M10 42h28"/></svg>',
 body:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="9" r="4"/><path d="M24 14v14M14 20l10-3 10 3M18 42l6-14 6 14"/></svg>'
};
const CATI={ /* category tile glyphs */
 chest:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 20c6-4 14-5 22-2 8-3 16-2 22 2l-2 16c-4 6-12 8-20 4-8 4-16 2-20-4z"/><path d="M32 18v24"/></svg>',
 back:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M32 8v48"/><path d="M14 16c6 2 12 2 18 0 6 2 12 2 18 0l-4 26-14 8-14-8z"/></svg>',
 shoulders:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="32" cy="14" r="6"/><path d="M8 34c2-10 10-14 24-14s22 4 24 14"/><path d="M16 30v22M48 30v22"/></svg>',
 arms:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 50l10-18c2-10 10-18 18-16 6 2 6 10 0 12l-8 2-6 20z"/><path d="M40 16c6-4 12 0 12 6"/></svg>',
 legs:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 8l-2 22 4 14-2 12h8l2-12-2-14 2-22"/><path d="M42 8l2 22-4 14 2 12h-8"/></svg>',
 core:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="20" y="10" width="24" height="44" rx="10"/><path d="M32 12v40M21 24h22M21 34h22M22 44h20"/></svg>',
 golf:'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 54V10l20 8-20 8"/><path d="M10 48c10-4 34-4 44 0" stroke-dasharray="3 4"/><circle cx="46" cy="44" r="3"/></svg>'
};
const eqKey=x=>(EX[x]&&EX[x].q)?EX[x].q:/^db_/.test(x)?'db':/^smith/.test(x)?'smith':/^machine_/.test(x)?'stack':/^cable_/.test(x)?'cable':/^(pushup|dip)/.test(x)?'bw':'bb';
const catEx=c=>Object.keys(EX).filter(k=>EX[k].cat===c&&EX[k].model).sort((a,b)=>(EX[a].sort||0)-(EX[b].sort||0));
const PLATESET=[20,15,10,5,2.5,1.25],SMITH_BAR=15;
/* exact plate breakdown for a programmed weight — the 3D player builds the same split */
function loadInfo(x,kg){
  const q=eqKey(x);if(q==='db')return {q,txt:`دو دمبل ${nf1(kg)} کیلویی`,short:'دمبل'};
  if(q==='db1')return {q,txt:`یک دمبل ${nf1(kg)} کیلویی`,short:'دمبل'};
  if(q==='ball')return {q,txt:`مدیسین‌بال ${nf1(kg)} کیلویی`,short:'مدیسین‌بال'};
  if(q==='bwdb')return kg<=0?{q,short:'وزن بدن',txt:'فقط وزن بدن'}:{q,short:'وزن بدن',txt:`وزن بدن + دو دمبل ${nf1(kg)} کیلویی`};
  if(q==='pl'){if(kg<=0)return {q,short:'لندماین',txt:'میلهٔ خالی'};let r=kg+1e-6;const pl=[];for(const p of PLATESET)while(r>=p){pl.push(p);r-=p;}return {q,short:'لندماین',txt:`صفحه روی میله · ${pl.map(nf1).join(' + ')}`};}
  if(q==='stack'||q==='cable'){const st=(EX[x]&&EX[x].st)||5,pin=Math.max(1,Math.min(20,Math.floor(kg/st+1e-6))),ad=kg-pin*st>=st/2-1e-6?st/2:0,got=pin*st+ad,two=/cross/.test(x);
    return {q,short:q==='cable'||(EX[x]&&EX[x].kind==='cable')?'سیم‌کش':'دستگاه',txt:`${two?'هر سیم‌کش · ':''}پین روی ${nf(pin*st)}${ad?' + وزنهٔ کمکی '+nf1(ad):''}`+(Math.abs(got-kg)>.01?` (نزدیک‌ترین: ${nf1(got)} کیلو)`:'')};}
  if(q==='bw'){if(kg<=0)return {q,short:'وزن بدن',txt:'فقط وزن بدن'};let s=kg+1e-6;const pl=[];for(const p of PLATESET)while(s>=p){pl.push(p);s-=p;}
    return {q,short:'وزن بدن',txt:`وزن بدن + ${pl.map(nf1).join(' + ')} ${/^dip|pullup/.test(x)?'با کمربند وزنه':/^pushup/.test(x)?'روی پشت':'روی بدن'}`};}
  const bar=q==='smith'?SMITH_BAR:plan().bar,bn=q==='smith'?'میلهٔ اسمیت':'هالتر';
  let s=(kg-bar)/2+1e-6;if(s<=0)return {q,bar,txt:`فقط ${bn} ${nf(bar)} کیلویی`,short:bn};
  const pl=[];for(const p of PLATESET)while(s>=p){pl.push(p);s-=p;}
  const got=bar+2*pl.reduce((a,b)=>a+b,0);
  return {q,bar,pl,short:bn,txt:`${bn} ${nf(bar)} + هر طرف ${pl.map(nf1).join(' + ')}`+(Math.abs(got-kg)>.01?` (نزدیک‌ترین: ${nf1(got)} کیلو)`:'')};
}
function defKg(x){
  const P=plan();for(const d of Object.values(P.days||{}))if(d.ex===x&&d.kg)return d.kg;
  const k=pk(),q=eqKey(x),fly=/fly/.test(x);if(EX[x]&&EX[x].def)return EX[x].def[k]??EX[x].def.m;
  const T8={machine_press:{m:45,f:25,g:15,t:15},machine_fly:{m:35,f:20,g:10,t:10},cable_cross_high:{m:15,f:7.5,g:5,t:5},cable_cross_low:{m:12.5,f:7.5,g:5,t:5},cable_fly_single:{m:12.5,f:7.5,g:5,t:5}};
  if(q==='bw')return 0;if(T8[x])return T8[x][k]||T8[x].m;
  const T={bb:{m:70,f:35,g:15,t:15},smith:{m:60,f:30,g:15,t:15},db:{m:22.5,f:10,g:6,t:6},fly:{m:14,f:6,g:4,t:4}};
  return T[fly?'fly':q][k]||T[fly?'fly':q].m;
}
function inPlan(x){return Object.values(plan().days||{}).some(d=>d.ex===x);}

/* train tab block: category grid */
function vLibrary(){
  return `<div class="sec"><h3>کتابخانهٔ حرکات <small style="color:var(--t2)">Exercise Library</small></h3><div class="lb-grid">${CATS.map(c=>{const n=catEx(c.id).length;
    return `<button class="lb-cat ${n?'on':''}" data-act="lbcat" data-c="${c.id}"><span class="gl">${CATI[c.id]}</span><b>${c.fa}</b><small>${c.en}</small><i class="num">${n?`${nf(n)} حرکت · سه‌بعدی`:'به‌زودی'}</i></button>`;}).join('')}</div></div>`;
}
function openLib(cid){
  const c=CATS.find(z=>z.id===cid);if(!c)return;S.lib=cid;
  const xs=catEx(cid),n=xs.length;
  const row=x=>{const e=EX[x];return `<button class="lb-r" data-act="lbex" data-x="${x}"><span class="ic">${EQI[e.grp]||EQI[e.kind]||EQI.machine}</span><span class="tx"><b>${e.name}</b><small>${e.en}</small></span>${inPlan(x)?'<i class="pl">در برنامه</i>':''}<i class="b3">3D</i><span class="chev">${IC.chevL}</span></button>`;};
  const soonRow=(t,kd)=>`<div class="lb-r off"><span class="ic">${EQI[kd]||EQI.machine}</span><span class="tx"><b>${t}</b></span><i class="sn">به‌زودی</i></div>`;
  const secs=KIND.map(([kd,fa,en])=>{
    const mine=xs.filter(x=>EX[x].kind===kd),grps=[...new Set(mine.map(x=>EX[x].grp))],soon=(c.soon&&c.soon[kd])||[];
    if(!mine.length&&!soon.length)return '';
    return `<div class="sec"><h3>${fa} <small style="color:var(--t2)">${en}</small></h3>${grps.map(g=>`<div class="lb-g">${g}</div><div class="card lb-list">${mine.filter(x=>EX[x].grp===g).map(row).join('')}</div>`).join('')}
      ${soon.length?`${mine.length?'<div class="lb-g">در حال ساخت</div>':''}<div class="card lb-list">${soon.map(t=>soonRow(t,kd)).join('')}</div>`:''}</div>`;}).join('');
  $('#push').innerHTML=`<div class="bar" id="pbar"><button class="bk" data-act="back">${IC.chevR}<span>بازگشت</span></button><div class="clock">${c.fa}</div></div>
  <div class="body" id="pbody"><div class="lb-hd"><span class="gl">${CATI[c.id]}</span><div><div class="k">کتابخانهٔ حرکات</div><h2>${c.fa} <small>${c.en}</small></h2>
   <div class="mc">${n?`${nf(n)} حرکت با نمایش سه‌بعدی — به ترتیب نوع تجهیزات`:'حرکات این دسته در حال ساخت است'}</div></div></div>${secs}<div style="height:30px"></div></div>`;
  $('#push').classList.add('on');$('#tabbar').classList.add('off');
  $('#pbody').addEventListener('scroll',e=>$('#pbar').classList.toggle('sc',e.target.scrollTop>10),{passive:true});
}
/* exercise sheet: details + exact load picker + 3D */
const LX={x:null,kg:0};
function lxStep(kg,q,d,x){const dbq=q==='db'||q==='db1'||q==='bwdb';const st=dbq?(kg+(d>0?0:-.01)<20?1:2.5):q==='ball'?1:(q==='stack'||q==='cable')?((x&&EX[x]&&EX[x].st)||5)/2:2.5;let v=Math.round((kg+d*st)/st)*st;if(dbq&&v>20&&v<22.5)v=d>0?22.5:20;return v;}
function lxPaint(){const i=loadInfo(LX.x,LX.kg);const a=$('#lxkg'),b=$('#lxpl');if(a)a.textContent=nf1(LX.kg);if(b)b.textContent=i.txt;}
function openEx(x){
  const e=EX[x];if(!e)return;LX.x=x;LX.kg=defKg(x);
  sheet(`<div class="lx"><div class="k">${e.eq}</div><h2>${e.name}</h2><div class="en">${e.en}</div>
   <div class="tags">${(e.mus||[]).map((m,i)=>`<i class="${i?'':'g'}">${m[0]}</i>`).join('')}</div>
   <div class="lx-w"><button class="sq" data-act="lxk" data-d="-1" aria-label="کمتر">−</button><div class="v"><b class="num"><span id="lxkg"></span> <small>kg</small></b><small id="lxpl"></small></div><button class="sq" data-act="lxk" data-d="1" aria-label="بیشتر">${IC.plus}</button></div>
   ${can('gym.player.form')?`<button class="btn-gold" style="width:100%" data-act="lxplay">${IC.cube} نمایش سه‌بعدی با همین وزنه</button>`:''}
   <h3>نکات فرم</h3><ol>${(e.cues||[]).map(c=>`<li>${c}</li>`).join('')}</ol><div class="mc">ثبات‌دهنده‌ها: ${e.stab||'—'}</div>
   <h3>چرا برای گلف؟</h3><p class="golfp">${e.golf||''}</p></div>`);
  lxPaint();
}
/* session → player: the weight of the current set */
function sessCtx(){const A=S.data.active;if(!A)return {};const d=plan().days[A.day]||{},s=A.sets.find(z=>!z.done)||A.sets[0]||{};return {ex:A.ex,kg:s.kg||d.kg,reps:s.reps||d.reps};}
Object.assign(ACT,{
  lbcat:a=>openLib(a.dataset.c),
  lbex:a=>openEx(a.dataset.x),
  lxk:a=>{const q=eqKey(LX.x),st=(EX[LX.x]&&EX[LX.x].st)||5;LX.kg=Math.max(q==='db'||q==='db1'||q==='ball'?1:q==='bw'||q==='bwdb'||q==='pl'?0:q==='stack'||q==='cable'?st:(q==='smith'?SMITH_BAR:plan().bar),Math.min(300,lxStep(LX.kg,q,+a.dataset.d,LX.x)));lxPaint();},
  lxplay:()=>{const o={ex:LX.x,kg:LX.kg};closeSheet();openPlayer(o);}
});
