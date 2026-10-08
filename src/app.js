'use strict';
/* PuttClub Gym — web app shell (Apple Fitness–style, Persian RTL)
   Auth: Supabase (same accounts as the academy panel — password changes / new users apply automatically).
   Data: dedicated database (schema «gym») through the single server gateway rpc/gym_api; device copy + offline queue.
   Access: «اشتراک‌ها ← ماتریس دسترسی ← باشگاه پات کلاب» per plan, enforced on the server and mirrored in the UI. */
const CFG={url:'https://iultwqtzvrysugfxwshw.supabase.co',key:'sb_publishable_058vN6QjD4sUC9Mam5izUg__vjKt9d0',domain:'members.puttclub.ir',ver:'1.1.0'};
/*GEO*/
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const fa=v=>String(v).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]);
const nf=(v,d=0)=>(v==null||isNaN(v))?'—':Number(v).toLocaleString('fa-IR',{maximumFractionDigits:d,minimumFractionDigits:0});
const nf1=v=>nf(v,1);
const en=s=>String(s==null?'':s).replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[٫,،/]/g,'.').trim();
const num=s=>{const v=parseFloat(en(s));return isFinite(v)?v:null;};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const DAY=864e5;
const fmtLong=new Intl.DateTimeFormat('fa-IR-u-ca-persian',{weekday:'long',day:'numeric',month:'long'});
const fmtDM=new Intl.DateTimeFormat('fa-IR-u-ca-persian',{day:'numeric',month:'long',year:'numeric'});
const fmtDS=new Intl.DateTimeFormat('fa-IR-u-ca-persian',{day:'numeric',month:'short'});
const fmtD=new Intl.DateTimeFormat('fa-IR-u-ca-persian',{day:'numeric'});
const WDS=['ش','ی','د','س','چ','پ','ج'],WDL=['شنبه','یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنجشنبه','جمعه'];
const dayStart=d=>{const x=new Date(d);x.setHours(0,0,0,0);return x;};
const wIdx=d=>(new Date(d).getDay()+1)%7;           // Saturday = 0
const weekStart=d=>{const x=dayStart(d);return new Date(x-wIdx(x)*DAY);};
const mmss=s=>{s=Math.max(0,Math.round(s));return fa(Math.floor(s/60)+':'+String(s%60).padStart(2,'0'));};
const hhmmss=s=>{s=Math.max(0,Math.floor(s));const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return fa((h?h+':':'')+String(m).padStart(h?2:1,'0')+':'+String(x).padStart(2,'0'));};
const e1=(kg,r)=>kg>0&&r>0?kg*(1+Math.min(r,12)/30):0;   // Epley

/* ---------- exercise library (only what is built) & programs ---------- */
const EX={bench:{name:'پرس سینه با هالتر',en:'Barbell Bench Press',eq:'هالتر · نیمکت تخت',
  mus:[['سینه‌ای بزرگ','chest',1],['دلتوئید قدامی','delt',.5],['سه‌سر بازو','tri',.5]],stab:'کتف، مرکز بدن، پاها',
  cues:['پنج نقطهٔ تماس: سر، کتف‌ها و باسن روی نیمکت؛ دو پا محکم روی زمین','کتف‌ها جمع و پایین، قفسهٔ سینه باز','آرنج‌ها حدود ۴۵ تا ۷۰ درجه نسبت به تنه','میله تا خط نوک سینه و برگشت در مسیر J به بالای شانه‌ها','مچ صاف بالای آرنج؛ دم هنگام پایین آمدن، بازدم هنگام فشار'],
  golf:'قدرت فشاری بالاتنه و ثبات کتف، انتقال نیرو در داون‌سوئینگ و کنترل چوب در لحظهٔ ضربه را بهتر می‌کند. روز «سرعت میله» توان انفجاری را برای سرعت سر چوب می‌سازد.'}};
const PLANS={
 m:{name:'قدرت و توان گلف',lvl:'بزرگسال · متوسط',bar:20,weeks:8,days:{0:{t:'قدرت',ex:'bench',sets:4,reps:6,kg:70,rpe:'۸',tempo:'۲-۱-۱',rest:120},2:{t:'حجم',ex:'bench',sets:3,reps:10,kg:57.5,rpe:'۷',tempo:'۳-۰-۱',rest:90},5:{t:'سرعت میله',ex:'bench',sets:5,reps:3,kg:50,rpe:'۶',tempo:'انفجاری',rest:90}}},
 f:{name:'قدرت و فرم گلف',lvl:'بزرگسال · متوسط',bar:15,weeks:8,days:{0:{t:'قدرت',ex:'bench',sets:3,reps:8,kg:35,rpe:'۷',tempo:'۲-۱-۱',rest:90},2:{t:'حجم',ex:'bench',sets:3,reps:12,kg:27.5,rpe:'۷',tempo:'۳-۰-۱',rest:75},5:{t:'سرعت میله',ex:'bench',sets:5,reps:3,kg:25,rpe:'۶',tempo:'انفجاری',rest:75}}},
 g:{name:'پایهٔ قدرت نوجوان',lvl:'نوجوان · مبتدی',bar:10,weeks:8,guard:true,days:{0:{t:'تکنیک و قدرت',ex:'bench',sets:2,reps:12,kg:15,rpe:'۵–۶',tempo:'۲-۱-۲',rest:60},2:{t:'کنترل',ex:'bench',sets:2,reps:10,kg:15,rpe:'۵',tempo:'۲-۱-۲',rest:60},5:{t:'تکنیک',ex:'bench',sets:3,reps:6,kg:10,rpe:'۴–۵',tempo:'۲-۱-۲',rest:60}}}
};
PLANS.t=PLANS.g;
const CHAR={m:'آقا · بزرگسال',f:'خانم · بزرگسال',g:'دختر · نوجوان',t:'پسر · نوجوان'};
const MF=[['height','قد','cm'],['weight','وزن','kg'],['neck','گردن','cm'],['biceps','بازو','cm'],['forearm','ساعد','cm'],['chest','سینه','cm'],['waist','کمر','cm'],['hip','باسن','cm'],['thigh','ران','cm'],['calf','ساق','cm']];

/* ---------- storage ---------- */
const LS={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch(e){return d;}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}},del(k){try{localStorage.removeItem(k);}catch(e){}}};
const S={sess:LS.get('pcgym.session',null),prof:LS.get('pcgym.profile',null),srv:LS.get('pcgym.srv',null),boot:null,data:null,tab:'summary',seg:'meas',mi:-1,day:wIdx(new Date()),skin:'fig'};
function dataKey(){return 'pcgym.data.'+(S.prof?S.prof.user:'_');}
function loadData(){S.data=Object.assign({v:1,logs:[],meas:[],active:null,start:null,pk:null,set:{sound:true,vib:true}},LS.get(dataKey(),{}));
  if(!S.data.start)S.data.start=weekStart(new Date()).toISOString();saveData();}
function saveData(){LS.set(dataKey(),S.data);}
const pk=()=>S.data&&S.data.pk||S.prof&&S.prof.pk||'m';
const plan=()=>S.srv&&(S.srv.assigned||(S.srv.templates&&S.srv.templates[pk()]))||PLANS[pk()];
/* access matrix («باشگاه پات کلاب»): absent = on; a parent off hides all its children; demo sees everything */
const can=id=>{const a=S.prof&&S.prof.acc;if(!a||S.prof.demo)return true;const f=a.feats||{},ps=id.split('.');for(let i=1;i<=ps.length;i++){if(f[ps.slice(0,i).join('.')]===false)return false;}return true;};
const TABF={summary:'gym.summary',train:'gym.train',progress:'gym.progress'};
const tabOk=t=>!TABF[t]||can(TABF[t]);
const lockCard=t=>`<div class="sec"><div class="card locked">${IC.lock.replace('width="12" height="12"','width="22" height="22"')}<b>${t}</b><p>این بخش در اشتراک فعلی شما فعال نیست. برای ارتقا با آکادمی پات‌کلاب تماس بگیرید.</p></div></div>`;

/* ---------- auth (Supabase GoTrue + RLS: member reads only their own account) ---------- */
async function api(path,{method='GET',body,token}={}){
  const h={apikey:CFG.key,'Content-Type':'application/json'};if(token)h.Authorization='Bearer '+token;
  const r=await fetch(CFG.url+path,{method,headers:h,body:body?JSON.stringify(body):undefined});
  const t=await r.text();let j=null;try{j=t?JSON.parse(t):null;}catch(e){}
  if(!r.ok){const e=new Error((j&&(j.msg||j.message||j.error_description))||('HTTP '+r.status));e.status=r.status;throw e;}
  return j;
}
function norm(raw){return{access_token:raw.access_token,refresh_token:raw.refresh_token,expires_at:Date.now()+(raw.expires_in||3600)*1000,uid:raw.user&&raw.user.id};}
async function token(){
  if(!S.sess)return null;
  if(S.sess.expires_at-Date.now()<90000){
    try{const raw=await api('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:{refresh_token:S.sess.refresh_token}});S.sess=Object.assign(norm(raw),{uid:S.sess.uid});LS.set('pcgym.session',S.sess);}
    catch(e){if(e.status===400||e.status===401){signOut('نشست منقضی شد؛ دوباره وارد شوید.');return null;}}
  }
  return S.sess.access_token;
}
function ageOf(b){if(!b)return null;const d=new Date(b);if(isNaN(d))return null;const n=new Date();let a=n.getFullYear()-d.getFullYear();if(n<new Date(n.getFullYear(),d.getMonth(),d.getDate()))a--;return a;}
function pkFor(g,age){const fem=/زن|خانم|دختر|f/i.test(g||'');const teen=age!=null&&age<18;return fem?(teen?'g':'f'):(teen?'t':'m');}
async function signIn(user,pass){
  const u=en(user).toLowerCase();
  if(!u||!pass)throw new Error('نام کاربری و رمز عبور را وارد کنید.');
  let raw;
  try{raw=await api('/auth/v1/token?grant_type=password',{method:'POST',body:{email:u.includes('@')?u:u+'@'+CFG.domain,password:String(pass)}});}
  catch(e){if(/banned/i.test(e.message))throw new Error('این حساب غیرفعال است.');if(e.status===400||e.status===401)throw new Error('نام کاربری یا رمز عبور اشتباه است.');throw new Error('اتصال به سرور برقرار نشد؛ اینترنت را بررسی کنید.');}
  const sess=norm(raw);
  let j;
  try{j=await rpc('bootstrap',{},sess.access_token);}
  catch(e){api('/auth/v1/logout?scope=local',{method:'POST',token:sess.access_token}).catch(()=>{});throw new Error('اتصال به سرور برقرار نشد؛ اینترنت را بررسی کنید.');}
  const err=applyBoot(j);
  if(err){api('/auth/v1/logout?scope=local',{method:'POST',token:sess.access_token}).catch(()=>{});S.prof=null;S.srv=null;throw new Error(err);}
  S.sess=sess;S.boot=j;
  LS.set('pcgym.session',S.sess);LS.set('pcgym.profile',S.prof);LS.set('pcgym.srv',S.srv);
}
/* ---------- gym database (schema «gym» via rpc/gym_api) ---------- */
const REASON={no_account:'این حساب در آکادمی تعریف نشده است؛ با مدیر تماس بگیرید.',inactive:'این حساب غیرفعال است.',
  expired:'اشتراک شما در آکادمی به پایان رسیده است؛ برای تمدید با آکادمی تماس بگیرید.',no_subscription:'برای این حساب اشتراک فعالی ثبت نشده است؛ با آکادمی تماس بگیرید.',
  scheduled:'اشتراک شما هنوز شروع نشده است.',past_due:'اشتراک شما در انتظار پرداخت است.'};
const PLAN_FA={trial:'آزمایشی',starter:'Starter',professional:'Professional',business:'Business',enterprise:'Enterprise'};
async function rpc(action,payload,tok){tok=tok||await token();if(!tok){const e=new Error('auth');e.status=401;throw e;}
  return api('/rest/v1/rpc/gym_api',{method:'POST',token:tok,body:{p_action:action,p_payload:payload||{}}});}
function applyBoot(j){
  const a=(j&&j.access)||{};
  if(!a.allowed)return REASON[a.reason]||'دسترسی به باشگاه ممکن نیست؛ با آکادمی تماس بگیرید.';
  if(!(a.feats&&a.feats.gym))return `باشگاه پات کلاب در اشتراک «${PLAN_FA[a.plan]||a.plan||'فعلی'}» شما فعال نیست؛ برای ارتقا با آکادمی تماس بگیرید.`;
  const p=j.profile||{},age=ageOf(p.birth);
  S.prof={user:p.username,name:p.name||p.username,family:p.family||'',role:p.role,gender:p.gender||'',age,hcp:p.hcp!=null&&p.hcp!==''?p.hcp:null,photo:p.photo||'',pk:pkFor(p.gender,age),acc:a};
  S.srv={assigned:j.assigned||null,templates:j.templates||{},exercises:j.exercises||{},at:Date.now()};
  applyEx();return '';
}
function applyEx(){const x=S.srv&&S.srv.exercises;if(x)Object.keys(x).forEach(k=>{EX[k]=Object.assign({},EX[k]||{},x[k]);});}
const mid=p=>p+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
/* server = source of truth; device keeps sample data («نمونه») and anything still waiting in the queue */
function mergeServer(j){const D=S.data;if(!D||!j)return;const q=SYNC.q();
  const pend=new Set(q.filter(o=>/_save$/.test(o.a)).map(o=>o.p.id)),del=new Set(q.filter(o=>/_delete$/.test(o.a)).map(o=>o.p.id));
  if(!LS.get('pcgym.mig.'+S.prof.user,false)){ /* one-time upload of training logged on this device before the database existed */
    const sw=new Set((j.workouts||[]).map(w=>w.id)),sm=new Set((j.meas||[]).map(m=>m.id));
    D.logs.filter(l=>!l.s&&!sw.has(l.id)).forEach(l=>{SYNC.add('workout_save',wPayload(l),true);pend.add(l.id);});
    D.meas.filter(m=>!m.s).forEach(m=>{if(!m.id)m.id='M'+Date.parse(m.date).toString(36);if(!sm.has(m.id)){SYNC.add('meas_save',m,true);pend.add(m.id);}});
    LS.set('pcgym.mig.'+S.prof.user,true);}
  const by=(a,b)=>a.date<b.date?-1:1;
  D.logs=(j.workouts||[]).filter(w=>!pend.has(w.id)).concat(D.logs.filter(l=>l.s||pend.has(l.id))).filter(l=>!del.has(l.id)).sort(by);
  D.meas=(j.meas||[]).filter(m=>!pend.has(m.id)).concat(D.meas.filter(m=>m.s||pend.has(m.id))).filter(m=>!del.has(m.id)).sort(by);
  const st=j.settings||{};if(st.sound!=null)D.set.sound=!!st.sound;if(st.vib!=null)D.set.vib=!!st.vib;if(st.character)D.pk=st.character;
  if(S.mi>=D.meas.length)S.mi=-1;saveData();SYNC.flush();}
const wPayload=l=>({id:l.id,date:l.date,day:l.day,ex:l.ex,dur:l.dur||0,sets:l.sets,pid:l.pid||null});
let refreshing=false,lastRefresh=0;
async function refresh(){if(!S.sess||refreshing)return;refreshing=true;
  try{const j=await rpc('bootstrap');const err=applyBoot(j);
    if(err){if(S.data&&S.data.active)saveData();signOut(err);return;}
    LS.set('pcgym.profile',S.prof);LS.set('pcgym.srv',S.srv);mergeServer(j);lastRefresh=Date.now();SYNC.state=SYNC.q().length?SYNC.state:'ok';SYNC.last=Date.now();
    applyTabs();if(!$('#push').classList.contains('on'))go(tabOk(S.tab)?S.tab:firstTab());}
  catch(e){if(e.status!==401)SYNC.state='offline';updSync();}
  finally{refreshing=false;}}
function demo(){S.sess=null;S.prof={user:'demo',name:'مهمان',role:'demo',gender:'مرد',age:40,hcp:12,photo:'',pk:'m',demo:true};LS.set('pcgym.profile',S.prof);}
function signOut(msg){const t=S.sess&&S.sess.access_token;if(t)api('/auth/v1/logout?scope=local',{method:'POST',token:t}).catch(()=>{});
  S.sess=null;S.prof=null;S.srv=null;LS.del('pcgym.session');LS.del('pcgym.profile');LS.del('pcgym.srv');closePlayer();closePush();showLogin(msg||'');}
/* cloud sync — waiting for DB approval; kept on device until then */
const SYNC={state:'idle',last:0,busy:false,
  key(){return 'pcgym.q.'+(S.prof?S.prof.user:'_');},q(){return LS.get(this.key(),[]);},save(q){LS.set(this.key(),q);},
  add(a,p,noFlush){if(!S.sess||!S.prof||S.prof.demo)return;const q=this.q().filter(o=>!(o.a===a&&p.id&&o.p.id===p.id));q.push({a,p});this.save(q);updSync();if(!noFlush)this.flush();},
  async flush(){if(this.busy||!S.sess||!S.prof)return;this.busy=true;
    try{for(;;){const q=this.q();if(!q.length){this.state='ok';break;}const o=q[0];let r;
      try{r=await rpc(o.a,o.p);}catch(e){this.state=e.status===401?'auth':'offline';break;}
      if(r&&r.ok){if(r.workout)swap(S.data.logs,r.workout);if(r.meas)swap(S.data.meas,r.meas);if(r.workout||r.meas)saveData();}
      else if(r&&r.err==='feature_off')toast('این بخش در اشتراک شما فعال نیست؛ ذخیره در دیتابیس انجام نشد.',3600);
      const q2=this.q(),k=JSON.stringify(o),i=q2.findIndex(x=>JSON.stringify(x)===k);if(i>=0){q2.splice(i,1);this.save(q2);}
      this.last=Date.now();}}
    finally{this.busy=false;updSync();}}};
function swap(arr,rec){const i=arr.findIndex(x=>x.id===rec.id);if(i>=0)arr[i]=Object.assign({},rec);}
function syncText(){if(!S.prof||S.prof.demo)return 'حالت نمایشی — داده‌ها فقط روی همین دستگاه می‌مانند.';
  const n=SYNC.q().length,t=SYNC.last?new Intl.DateTimeFormat('fa-IR',{hour:'2-digit',minute:'2-digit'}).format(new Date(SYNC.last)):'';
  if(n)return `${nf(n)} مورد روی دستگاه منتظر ارسال است${SYNC.state==='offline'?' — با وصل شدن اینترنت خودکار ارسال می‌شود':''}.`;
  if(SYNC.state==='offline')return 'آفلاین — آخرین نسخهٔ ذخیره‌شده نمایش داده می‌شود.';
  return 'همگام با دیتابیس باشگاه پات کلاب'+(t?` · آخرین همگام‌سازی ${t}`:'')+'.';}
function updSync(){const e=$('#syncst');if(e){e.textContent=syncText();e.classList.toggle('warn',!!SYNC.q().length||SYNC.state==='offline');}}

/* ---------- sample data («نمونه») ---------- */
const BASE={m:{height:181,weight:84.6,neck:41.5,biceps:36.4,forearm:31,chest:103.5,waist:89,hip:101,thigh:58.6,calf:38},f:{height:168,weight:61.2,neck:32,biceps:27,forearm:23.5,chest:88.5,waist:69.5,hip:95.5,thigh:54.5,calf:35},g:{height:158,weight:48.5,neck:30,biceps:23,forearm:21,chest:78,waist:63,hip:86,thigh:48,calf:32},t:{height:155,weight:46.5,neck:31,biceps:23.5,forearm:22,chest:77,waist:64.5,hip:82,thigh:45,calf:31}};
const TREND={height:0,weight:-.55,neck:-.15,biceps:.25,forearm:.1,chest:.45,waist:-.8,hip:-.3,thigh:.2,calf:.05};
function genSample(){
  const P=plan(),k=pk(),logs=[],meas=[],ws=weekStart(new Date()),today=wIdx(new Date());
  for(let w=6;w>=0;w--)for(const di of Object.keys(P.days).map(Number)){
    if(w===0&&di>=today)continue;
    const d=P.days[di],st=new Date(+ws-w*7*DAY+di*DAY+18.5*36e5),f=1-.012*w-(w===4?.01:0);
    const kg=Math.round(d.kg*f/2.5)*2.5;
    const sets=Array.from({length:d.sets},(_,i)=>({kg,reps:d.reps-(i===d.sets-1&&w%3===1?1:0),done:true}));
    logs.push(mkLog({date:st.toISOString(),day:di,ex:d.ex,sets,dur:(d.sets*(d.rest+40))+180,s:1}));
  }
  for(let i=4;i>=0;i--){const m={date:new Date(+dayStart(new Date())-i*21*DAY+9*36e5).toISOString(),s:1};
    MF.forEach(([f])=>{const b=BASE[k][f];m[f]=Math.round((b+TREND[f]*(4-i)*(b>60?1:.6)+(i===2&&f==='weight'?.6:0))*2)/2;});meas.push(m);}
  return{logs,meas};
}
function setSample(on){const D=S.data;D.logs=D.logs.filter(l=>!l.s);D.meas=D.meas.filter(m=>!m.s);
  if(on){const g=genSample();D.logs=D.logs.concat(g.logs).sort((a,b)=>a.date<b.date?-1:1);D.meas=D.meas.concat(g.meas).sort((a,b)=>a.date<b.date?-1:1);}
  D.sample=!!on;saveData();S.mi=-1;}
const hasSample=()=>S.data&&(S.data.logs.some(l=>l.s)||S.data.meas.some(m=>m.s));
function mkLog(o){const done=o.sets.filter(s=>s.done&&s.kg>0&&s.reps>0);o.vol=done.reduce((a,s)=>a+s.kg*s.reps,0);o.e1rm=done.reduce((a,s)=>Math.max(a,e1(s.kg,s.reps)),0);o.nsets=done.length;o.id=o.id||('L'+Date.parse(o.date).toString(36)+Math.random().toString(36).slice(2,6));return o;}

/* ---------- analytics ---------- */
function weekLogs(off=0){const a=+weekStart(new Date())-off*7*DAY,b=a+7*DAY;return S.data.logs.filter(l=>{const t=Date.parse(l.date);return t>=a&&t<b;});}
function planWeek(){const P=plan();let sets=0,vol=0;Object.values(P.days).forEach(d=>{sets+=d.sets;vol+=d.sets*d.reps*d.kg;});return{sets,vol,n:Object.keys(P.days).length};}
function recovery(){const L=S.data.logs;if(!L.length)return 100;const last=L[L.length-1];const h=(Date.now()-Date.parse(last.date))/36e5;const hard=clamp(last.vol/(planWeek().vol/3||1),.5,1.6);return Math.round(clamp(100-(42*hard)*Math.exp(-h/26),0,100));}
function acwr(){const now=Date.now();const v=d=>S.data.logs.filter(l=>now-Date.parse(l.date)<d*DAY).reduce((a,l)=>a+l.vol,0);const a=v(7),c=v(28)/4;if(!c)return null;return a/c;}
function bestE1(){return S.data.logs.reduce((a,l)=>Math.max(a,l.e1rm||0),0);}
function prs(){let best=0;const out=[];S.data.logs.forEach(l=>{if(l.e1rm>best+.01){if(best>0)out.push(l);best=l.e1rm;}});return out;}
function weeklyVols(n=6){return Array.from({length:n},(_,i)=>weekLogs(n-1-i).reduce((a,l)=>a+l.vol,0));}
function sessionsSeries(){const m=new Map();S.data.logs.forEach(l=>{if(!(l.e1rm>0))return;const k=+weekStart(l.date);const o=m.get(k);if(!o||l.e1rm>o.v)m.set(k,{t:Date.parse(l.date),v:l.e1rm});});return [...m.values()].sort((a,b)=>a.t-b.t);}
function lastFor(day,ex){const L=S.data.logs;for(let i=L.length-1;i>=0;i--){if(L[i].ex===ex&&L[i].day===day)return L[i];}for(let i=L.length-1;i>=0;i--){if(L[i].ex===ex)return L[i];}return null;}
function navy(m){if(!m||!m.height||!m.neck||!m.waist)return null;const male=pk()==='m'||pk()==='t';
  if(male){const d=m.waist-m.neck;if(d<=0)return null;return 495/(1.0324-.19077*Math.log10(d)+.15456*Math.log10(m.height))-450;}
  if(!m.hip)return null;const d=m.waist+m.hip-m.neck;if(d<=0)return null;return 495/(1.29579-.35004*Math.log10(d)+.221*Math.log10(m.height))-450;}
function awards(){const L=S.data.logs,P=plan(),n=Object.keys(P.days).length;
  const byW={};L.forEach(l=>{const k=+weekStart(l.date);byW[k]=(byW[k]||new Set()).add(l.day);});const full=Object.keys(byW).sort().map(k=>byW[k].size>=n);
  let run=0,maxRun=0;full.forEach(f=>{run=f?run+1:0;maxRun=Math.max(maxRun,run);});
  const first=L.find(l=>l.e1rm>0),pr=prs();
  return[
   {id:'tee',n:'اولین تی‌آف',d:'اولین جلسه ثبت شد',ok:L.length>0,ic:'tee'},
   {id:'par',n:'پارِ هفته',d:'همهٔ جلسات یک هفته',ok:full.some(Boolean),ic:'flag'},
   {id:'birdie',n:'بردی',d:'اولین رکورد شخصی',ok:pr.length>0,ic:'bird'},
   {id:'eagle',n:'ایگل',d:'+۵ کیلو رکورد تخمینی',ok:!!first&&bestE1()-first.e1rm>=5,ic:'eagle'},
   {id:'alb',n:'آلباتروس',d:'۱۲ جلسهٔ کامل',ok:L.length>=12,ic:'12'},
   {id:'hio',n:'هول‌این‌وان',d:'۴ هفتهٔ پیاپی کامل',ok:maxRun>=4,ic:'hio'}];}

/* ---------- svg components ---------- */
let gid=0;
function rings(vals,size=132,sw){sw=sw||size*.118;const gap=sw*.16,cols=[['--r1','--r1b'],['--r2','--r2b'],['--r3','--r3b']];let defs='',body='';
  vals.forEach((v,i)=>{const r=size/2-sw/2-i*(sw+gap),C=2*Math.PI*r,p=Math.max(0,v||0),cap=Math.min(p,1),id='rg'+(++gid);
    defs+=`<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(${cols[i][1]})"/><stop offset="1" stop-color="var(${cols[i][0]})"/></linearGradient>`;
    body+=`<circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(${cols[i][0]})" stroke-opacity=".2" stroke-width="${sw}"/>`;
    body+=`<circle class="ra" cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="url(#${id})" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C}" data-off="${C*(1-cap)+(cap>=1?0:0)}" transform="rotate(-90 ${size/2} ${size/2})" ${cap<=0?'opacity="0"':''}/>`;
    if(p>1){const q=Math.min(p-1,.98);body+=`<circle class="ra" cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(${cols[i][1]})" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C}" data-off="${C*(1-q)}" transform="rotate(-90 ${size/2} ${size/2})" style="filter:drop-shadow(0 0 3px rgba(0,0,0,.6))"/>`;}
  });
  return `<svg class="rings" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><defs>${defs}</defs>${body}</svg>`;}
function animRings(root){requestAnimationFrame(()=>requestAnimationFrame(()=>$$('circle.ra',root).forEach(c=>c.style.strokeDashoffset=c.dataset.off)));}
function spark(vals,w=140,h=44,col='var(--r2)',fill=true){if(vals.length<2)return `<svg width="${w}" height="${h}"><line x1="0" x2="${w}" y1="${h-4}" y2="${h-4}" stroke="rgba(255,255,255,.12)" stroke-dasharray="3 4"/></svg>`;
  const mn=Math.min(...vals),mx=Math.max(...vals),rg=mx-mn||1,X=i=>w-(i/(vals.length-1))*w,Y=v=>h-4-(v-mn)/rg*(h-10);
  const pts=vals.map((v,i)=>[X(i),Y(v)]);let d='M'+pts[0].join(' ');for(let i=1;i<pts.length;i++){const p=pts[i-1],q=pts[i],cx=(p[0]+q[0])/2;d+=` C${cx} ${p[1]} ${cx} ${q[1]} ${q[0]} ${q[1]}`;}
  const id='sp'+(++gid);const last=pts[pts.length-1];
  return `<svg class="spk" width="100%" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${col}" stop-opacity=".35"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></linearGradient></defs>${fill?`<path d="${d} L${last[0]} ${h} L${w} ${h} Z" fill="url(#${id})"/>`:''}<path d="${d}" fill="none" stroke="${col}" stroke-width="2.2" stroke-linecap="round" vector-effect="non-scaling-stroke"/><circle cx="${last[0]}" cy="${last[1]}" r="3.2" fill="${col}"/></svg>`;}
function bars(vals,w=140,h=46,col='var(--r2)'){const mx=Math.max(...vals,1),n=vals.length,bw=w/n*.56;
  return `<svg class="spk" width="100%" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">${vals.map((v,i)=>{const bh=Math.max(3,v/mx*(h-4));const x=w-(i+1)*(w/n)+(w/n-bw)/2;return `<rect x="${x}" y="${h-bh}" width="${bw}" height="${bh}" rx="${Math.min(4,bw/2)}" fill="${col}" opacity="${i===n-1?1:.42}"/>`;}).join('')}</svg>`;}
function gauge(v,col='var(--r3)'){const r=34,C=Math.PI*r;return `<svg width="100%" height="60" viewBox="0 0 92 56"><path d="M12 48 A34 34 0 0 1 80 48" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="9" stroke-linecap="round"/><path class="ga" d="M12 48 A34 34 0 0 1 80 48" fill="none" stroke="${col}" stroke-width="9" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-clamp(v,0,100)/100)}"/></svg>`;}
const IC={
 sum:'<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="14" cy="14" r="11"/><path d="M14 7.5a6.5 6.5 0 1 1-6.5 6.5" /><circle cx="14" cy="14" r="2.2" fill="currentColor" stroke="none"/></svg>',
 train:'<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14h20"/><rect x="6" y="8.5" width="3.6" height="11" rx="1.2"/><rect x="18.4" y="8.5" width="3.6" height="11" rx="1.2"/><path d="M3 11.5v5M25 11.5v5"/></svg>',
 prog:'<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="5.5" r="2.4"/><path d="M11 9v8m0 0-3 7m3-7 3 7M7 12.5h8"/><path d="M19.5 6v16" stroke-dasharray="2 2.6"/><path d="M18 6h3M18 22h3"/></svg>',
 me:'<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="14" cy="14" r="11"/><circle cx="14" cy="11.5" r="3.8"/><path d="M7.6 21.6c1.6-2.6 3.8-3.8 6.4-3.8s4.8 1.2 6.4 3.8"/></svg>',
 play:'<svg width="22" height="22" viewBox="0 0 24 24"><path d="M7 4.8v14.4c0 .8.9 1.3 1.6.9l11.3-7.2c.6-.4.6-1.3 0-1.7L8.6 3.9C7.9 3.5 7 4 7 4.8z" fill="#1a1405"/></svg>',
 cube:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 2.8 20 7.3v9.4L12 21.2 4 16.7V7.3z"/><path d="M4 7.3l8 4.5 8-4.5M12 11.8v9.4"/></svg>',
 chevL:'<svg width="10" height="17" viewBox="0 0 10 17" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2 2 8.5 8 15"/></svg>',
 chevR:'<svg width="10" height="17" viewBox="0 0 10 17" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 2l6 6.5L2 15"/></svg>',
 check:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5 10 17.5 19 7"/></svg>',
 x:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
 plus:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
 shield:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e9b44c" stroke-width="1.8" stroke-linecap="round"><path d="M12 2l9 4v6c0 5-4 9-9 10-5-1-9-5-9-10V6z"/><path d="M12 8v5M12 16.5v.5"/></svg>',
 flag:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6 21V3"/><path d="M6 3.5l11 3.6L6 11"/><ellipse cx="9" cy="21" rx="5" ry="1.2"/></svg>',
 up:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5.5 11.5 12 5l6.5 6.5"/></svg>',
 down:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5.5 12.5 12 19l6.5-6.5"/></svg>',
 moon:'<svg width="46" height="46" viewBox="0 0 48 48" fill="none" stroke="var(--r3)" stroke-width="2.2" stroke-linecap="round"><path d="M33 31.5A14 14 0 0 1 19.5 13a14 14 0 1 0 13.5 18.5z"/><path d="M34 11v6M31 14h6" stroke="var(--gold)"/></svg>',
 lock:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
 timer:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4l2.5 2M9.5 2.5h5"/></svg>',
 trash:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff6b5e" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/></svg>'};
function medal(ic,id){const g='md'+id;
  const glyph={tee:'<path d="M50 30v26M44 56h12" stroke="#2a1d05" stroke-width="3.4" stroke-linecap="round"/><circle cx="50" cy="25" r="7" fill="#fff8e6" stroke="#2a1d05" stroke-width="2"/>',
   flag:'<path d="M42 66V30" stroke="#2a1d05" stroke-width="3.4" stroke-linecap="round"/><path d="M43 31l20 7-20 7z" fill="#2a1d05"/><ellipse cx="48" cy="66" rx="10" ry="2.6" fill="#2a1d05" opacity=".5"/>',
   bird:'<path d="M27 47c7-9 15-10 23-2 8-8 16-7 23 2-8-3-15-1-23 8-8-9-15-11-23-8z" fill="#2a1d05"/>',
   eagle:'<path d="M22 44c9-11 19-12 28-3 9-9 19-8 28 3-10-4-19-1-28 10-9-11-18-14-28-10z" fill="#2a1d05"/><path d="M50 25l2.4 5 5.4.6-4 3.7 1.1 5.3-4.9-2.7-4.9 2.7 1.1-5.3-4-3.7 5.4-.6z" fill="#2a1d05"/>',
   '12':'<text x="50" y="59" text-anchor="middle" font-size="26" font-weight="800" fill="#2a1d05" font-family="Vazirmatn,system-ui">۱۲</text>',
   hio:'<circle cx="50" cy="52" r="11" fill="#2a1d05"/><circle cx="50" cy="37" r="7" fill="#fff8e6" stroke="#2a1d05" stroke-width="2"/>'}[ic];
  let dots='';for(let i=0;i<14;i++){const a=i/14*Math.PI*2;dots+=`<circle cx="${50+Math.cos(a)*35.5}" cy="${50+Math.sin(a)*35.5}" r="1.3" fill="#7a5a17" opacity=".55"/>`;}
  return `<svg viewBox="0 0 100 100"><defs><radialGradient id="${g}" cx="38%" cy="30%" r="75%"><stop offset="0" stop-color="#fff2c4"/><stop offset=".45" stop-color="#e8c264"/><stop offset="1" stop-color="#8d6519"/></radialGradient><linearGradient id="${g}r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f5a43"/><stop offset="1" stop-color="#0a2a1f"/></linearGradient></defs><circle cx="50" cy="50" r="47" fill="url(#${g}r)"/><circle cx="50" cy="50" r="41" fill="url(#${g})"/><circle cx="50" cy="50" r="31" fill="none" stroke="#7a5a17" stroke-opacity=".5" stroke-width="1"/>${dots}${glyph}</svg>`;}

/* ---------- common UI ---------- */
function avatar(){const p=S.prof||{};return p.photo?`<img src="${esc(p.photo)}" alt="">`:esc((p.name||'؟').trim().charAt(0));}
function header(title){const d=fmtLong.format(new Date());return `<div class="nb">${title}</div><header class="lt"><div class="date">${d}${hasSample()?'<span class="pill-s">دادهٔ نمونه</span>':''}</div><div class="row"><h1>${title}</h1><button class="avatar" data-act="tab" data-t="me" aria-label="پروفایل">${avatar()}</button></div></header>`;}
function toast(html,ms=2600){const t=$('#toast');t.innerHTML=html;t.classList.add('on');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('on'),ms);}
function haptic(ms=12){if(S.data&&S.data.set.vib&&navigator.vibrate)try{navigator.vibrate(ms);}catch(e){}}

/* ---------- tab: summary («خلاصه») ---------- */
function nextSession(){const P=plan(),t=wIdx(new Date()),days=Object.keys(P.days).map(Number).sort((a,b)=>a-b);
  const doneToday=weekLogs().some(l=>l.day===t);
  if(P.days[t]&&!doneToday)return{di:t,when:'امروز',today:true};
  for(const d of days)if(d>t)return{di:d,when:WDL[d]};
  return{di:days[0],when:WDL[days[0]]+' هفتهٔ بعد'};}
function vSummary(){
  const pw=planWeek(),wl=weekLogs(),sets=wl.reduce((a,l)=>a+l.nsets,0),vol=wl.reduce((a,l)=>a+l.vol,0),rec=recovery();
  const ns=nextSession(),P=plan(),d=P.days[ns.di],ex=EX[d.ex],k=pk();
  const vols=weeklyVols(6),ser=sessionsSeries(),best=bestE1(),firstE=ser.length?ser[0].v:0;
  const ac=acwr(),acL=ac==null?'—':ac<.8?'کم':ac>1.3?'بالا':'متعادل',acC=ac==null?'':ac>1.3?'cu':'c2';
  const days=new Set(wl.map(l=>l.day)),today=wIdx(new Date());
  const lastM=S.data.meas[S.data.meas.length-1],prevM=S.data.meas[S.data.meas.length-2];
  const trends=[];
  if(ser.length>1){const a=ser[ser.length-1].v,b=ser[ser.length-2].v;trends.push({ic:a>=b?'up':'down',c:a>=b?'c1':'cn',t:'رکورد تخمینی پرس',v:nf1(best)+' kg'});}
  if(vols[4]&&vols[3])trends.push({ic:vols[4]>=vols[3]?'up':'down',c:vols[4]>=vols[3]?'c2':'cn',t:'حجم هفتهٔ گذشته',v:nf(vols[4])+' kg'});
  if(lastM&&prevM){[['weight','وزن بدن','kg'],['waist','دور کمر','cm']].forEach(([f,t,u])=>{if(lastM[f]!=null&&prevM[f]!=null)trends.push({ic:lastM[f]<=prevM[f]?'down':'up',c:lastM[f]<=prevM[f]?'c3':'cu',t,v:nf1(lastM[f])+' '+u});});}
  const aw=awards();
  const sec=[];
  if(can('gym.summary.rings'))sec.push(`
  <div class="sec" style="margin-top:8px"><div class="card tap act" data-act="tab" data-t="train">
    ${rings([pw.sets?sets/pw.sets:0,pw.vol?vol/pw.vol:0,rec/100],136)}
    <div class="stats">
      <div><b>تمرین</b><span class="c1 num">${nf(sets)}/${nf(pw.sets)}<small>ست</small></span></div>
      <div><b>حجم</b><span class="c2 num">${nf(vol)}/${nf(pw.vol)}<small>kg</small></span></div>
      <div><b>ریکاوری</b><span class="c3 num">${nf(rec)}<small>٪</small></span></div>
    </div></div></div>`);
  if(can('gym.summary.next'))sec.push(`
  <div class="sec"><h3>${ns.today?'تمرین امروز':'جلسهٔ بعدی'}<small>${esc(P.name)}</small></h3>
   <div class="hero" data-act="session" data-d="${ns.di}">
    <img src="assets/hero_${k}.webp" alt="" fetchpriority="high">
    <div class="gr"></div>
    <div class="top"><span class="chip gold">${ns.when}</span>${can('gym.player.form')?`<button class="chip" data-act="player" aria-label="نمایش سه‌بعدی">${IC.cube}سه‌بعدی</button>`:''}</div>
    <div class="bt"><div><div class="k">روز ${esc(d.t)} · PuttClub Gym</div><h4>${ex.name}</h4><p class="num">${nf(d.sets)} ست × ${nf(d.reps)} تکرار · ${nf1(d.kg)} کیلوگرم · RPE ${d.rpe}</p></div>
     <span class="play">${IC.play}</span></div>
   </div></div>`);
  if(can('gym.summary.metrics'))sec.push(`
  <div class="sec"><h3>معیارها</h3><div class="grid2">
   <div class="card"><div class="mt c1">جلسات هفته</div><div class="mv num">${nf(days.size)}<small>از ${nf(pw.n)}</small></div>
    <div class="wd">${WDS.map((w,i)=>`<i class="${days.has(i)?'dn':P.days[i]?'pl':''} ${i===today?'td':''}"><b></b>${w}</i>`).join('')}</div></div>
   <div class="card"><div class="mt c1">رکورد تخمینی</div><div class="mv num">${best?nf1(best):'—'}<small>kg</small></div>${spark(ser.slice(-10).map(x=>x.v),140,40,'var(--r1)')}<div class="mc">یک‌تکرار بیشینه · اپلی</div></div>
   <div class="card"><div class="mt c2">حجم هفتگی</div><div class="mv num">${nf(vols[5])}<small>kg</small></div>${bars(vols,140,40,'var(--r2)')}<div class="mc">۶ هفتهٔ اخیر</div></div>
   <div class="card"><div class="mt c3">آمادگی</div><div class="mv num">${nf(rec)}<small>از ۱۰۰</small></div>${gauge(rec)}<div class="mc" style="margin-top:-6px">${rec>=85?'آماده برای فشار':rec>=60?'تمرین متوسط':'روز سبک'}</div></div>
   <div class="card"><div class="mt c2">بار تمرینی</div><div class="mv ${acC}" style="font-size:24px">${acL}</div><div class="mc num">نسبت ۷ به ۲۸ روز: ${ac==null?'—':nf(ac,2)}</div>${spark(vols.map((v,i,a)=>(a[i]+(a[i-1]||a[i]))/2),140,30,'var(--r2)',false)}</div>
   <div class="card"><div class="mt cg">هندیکپ گلف</div><div class="mv num">${S.prof&&S.prof.hcp!=null?nf(S.prof.hcp):'—'}</div><div class="mc">آکادمی گلف پات‌کلاب</div><div style="margin-top:10px;color:var(--gold)">${IC.flag}</div></div>
  </div></div>
`);
  if(can('gym.summary.trends'))sec.push(`
  <div class="sec"><h3>روندها</h3><div class="list">${trends.length?trends.map(t=>`<div class="li"><span class="ic ${t.c}" style="background:rgba(255,255,255,.06)">${IC[t.ic]}</span><div class="tx"><b>${t.t}</b><span>نسبت به دورهٔ قبل</span></div><div class="vl ${t.c} num">${t.v}</div></div>`).join(''):`<div class="li"><div class="tx"><b>هنوز روندی نیست</b><span>با ثبت چند جلسه و اندازه‌گیری، روندها اینجا ظاهر می‌شوند.</span></div></div>`}</div></div>
`);
  if(can('gym.summary.awards'))sec.push(`
  <div class="sec"><h3>جوایز<small>${nf(aw.filter(a=>a.ok).length)} از ${nf(aw.length)}</small></h3><div class="aw">${aw.map((a,i)=>`<div class="a ${a.ok?'':'lock'}">${medal(a.ic,i)}<b>${a.n}</b><span>${a.d}</span></div>`).join('')}</div></div>
`);
  return header('خلاصه')+(sec.length?sec.join(''):lockCard('خلاصه'))+`
  <div class="foot">PuttClub Gym · آکادمی گلف پات‌کلاب</div>`;}

/* ---------- tab: training («تمرین») ---------- */
function vTrain(){
  const P=plan(),k=pk(),ws=weekStart(new Date()),today=wIdx(new Date()),wl=weekLogs(),done=new Set(wl.map(l=>l.day));
  const wk=clamp(Math.floor((Date.now()-Date.parse(P.start||S.data.start))/(7*DAY))+1,1,P.weeks);
  const cP=can('gym.train.program'),cS=can('gym.train.session');
  if(!cP&&!cS)return header('تمرین')+lockCard('تمرین');
  const sel=S.day,d=P.days[sel],ex=d&&EX[d.ex],selDate=new Date(+ws+sel*DAY);
  const logged=wl.find(l=>l.day===sel);
  return header('تمرین')+(cP?`
  <div class="ws">${WDS.map((w,i)=>`<button data-act="day" data-d="${i}" class="${i===sel?'sel':''} ${i===today?'td':''} ${done.has(i)?'dn':P.days[i]?'pl':''}">${w}<b class="num">${fmtD.format(new Date(+ws+i*DAY))}</b><i></i></button>`).join('')}</div>
  <div class="sec" style="margin-top:16px"><div class="card">
    <div style="display:flex;justify-content:space-between;align-items:center"><div><div class="mt cg">برنامهٔ من</div><div style="font-size:20px;font-weight:850;margin-top:4px">${esc(P.name)}</div><div class="mc">${esc(P.lvl)} · ${nf(Object.keys(P.days).length)} جلسه در هفته</div></div>
    <div style="text-align:center"><div class="num" style="font-size:26px;font-weight:850">${nf(wk)}<span style="font-size:13px;color:var(--t2)">/${nf(P.weeks)}</span></div><div class="mc" style="margin:0">هفته</div></div></div>
    <div class="prog"><i style="width:${wk/P.weeks*100}%"></i></div>
    <div class="mc" style="margin-top:10px">${P.template===false?`برنامهٔ اختصاصی مربی${P.start?' — از '+fmtDM.format(new Date(P.start)):''}`:`برنامهٔ پیش‌فرض آکادمی برای ${CHAR[k]} — پس از تعیین برنامه توسط مربی، همین‌جا جایگزین می‌شود.`}</div>
  </div></div>`:'')+`
  <div class="sec"><h3>${WDL[sel]} <small class="num" style="color:var(--t2)">${fmtDS.format(selDate)}</small></h3>
  ${d?`<div class="card tap" data-act="session" data-d="${sel}"><div class="exrow"><div class="th"><img src="assets/hero_${k}.webp" alt=""></div>
     <div class="tx"><b>${ex.name}</b><span class="num">روز ${esc(d.t)} · ${nf(d.sets)} ست × ${nf(d.reps)} تکرار · ${nf1(d.kg)} کیلو</span><div class="tags">${ex.mus.map(m=>`<i>${m[0]}</i>`).join('')}${logged?'<i class="g">انجام شد</i>':''}</div></div><span class="chev">${IC.chevL}</span></div></div>
     ${cS?`<button class="btn-gold" style="width:100%;margin-top:12px" data-act="session" data-d="${sel}">${logged?'مشاهده و جلسهٔ دوباره':'شروع جلسه'}</button>`:''}`
   :`<div class="card rest-day">${IC.moon}<b>روز ریکاوری</b><p>بدن در استراحت قوی‌تر می‌شود. پیشنهاد: ۲۰ دقیقه پیاده‌روی سبک و تمرین‌های تحرک ستون فقرات سینه‌ای و لگن برای چرخش بهتر سوئینگ.</p></div>`}
  </div>
  ${cP?`<div class="sec"><h3>کتابخانهٔ حرکات</h3><div class="card"><div class="mc" style="margin:0">فقط حرکاتی که مربی در برنامه‌ات قرار می‌دهد اینجا فعال می‌شوند.</div>
   <div class="soon">${['سینه','پشت','پا','شانه','مرکز بدن','چرخش گلف'].map(c=>`<i>${IC.lock}${c}</i>`).join('')}</div></div></div>`:''}`;}

/* ---------- tab: progress («پیشرفت») ---------- */
function vProgress(){
  const SG=[['meas','اندازه‌ها','gym.progress.meas'],['str','قدرت','gym.progress.strength'],['mus','عضلات','gym.progress.muscles']].filter(x=>can(x[2]));
  if(!SG.length)return header('پیشرفت')+lockCard('پیشرفت');
  if(!SG.some(x=>x[0]===S.seg))S.seg=SG[0][0];
  const seg=S.seg;
  let body='';
  if(seg==='meas')body=vMeas();else if(seg==='str')body=vStrength();else body=vMuscles();
  return header('پیشرفت')+(SG.length<2?'':`<div class="seg">${SG.map(([k,t])=>`<button data-act="seg" data-s="${k}" class="${seg===k?'on':''}">${t}</button>`).join('')}</div>`)+body;}
function vMeas(){
  const M=S.data.meas,n=M.length;if(S.mi<0||S.mi>=n)S.mi=n-1;
  const m=M[S.mi]||null,pv=S.mi>0?M[S.mi-1]:null,bf=navy(m),bmi=m&&m.height&&m.weight?m.weight/Math.pow(m.height/100,2):null;
  const wser=M.map(x=>x.weight).filter(v=>v!=null);
  return `<div class="mhead"><button data-act="mprev" ${S.mi>0?'':'disabled'} aria-label="قبلی">${IC.chevR}</button><div class="d num">${m?fmtDM.format(new Date(m.date)):'اندازه‌گیری ندارید'}</div><button data-act="mnext" ${S.mi<n-1?'':'disabled'} aria-label="بعدی">${IC.chevL}</button></div>
  <div class="mstage" id="mstage"><div class="glow"></div>
   <img class="fig" id="figA" src="assets/fig_${pk()}.webp" alt="" style="opacity:${S.skin==='fig'||!can('gym.player.anatomy')?1:0}"><img class="fig" id="figB" src="assets/mus_${pk()}.webp" alt="" style="opacity:${S.skin==='mus'&&can('gym.player.anatomy')?1:0}" loading="lazy">
   <svg class="ov" id="mov"></svg><div id="mcards"></div>
   ${can('gym.player.anatomy')?`<div class="mtog"><button data-act="skin" data-s="fig" class="${S.skin==='fig'?'on':''}">بدن</button><button data-act="skin" data-s="mus" class="${S.skin==='mus'?'on':''}">عضلات</button></div>`:''}
  </div>
  <div class="sec" style="margin-top:14px"><button class="btn-gold" style="width:100%" data-act="mnew">${IC.plus} ثبت اندازه‌گیری جدید</button></div>
  <div class="sec"><h3>ترکیب بدن</h3><div class="grid2">
   <div class="card"><div class="mt c1">درصد چربی</div><div class="mv num">${bf?nf1(bf):'—'}<small>٪</small></div><div class="mc">روش نیروی دریایی آمریکا${pk()==='g'||pk()==='t'?' · برای نوجوانان تقریبی':''}</div></div>
   <div class="card"><div class="mt c3">شاخص تودهٔ بدن</div><div class="mv num">${bmi?nf1(bmi):'—'}</div><div class="mc">${bmi?(bmi<18.5?'کمتر از نرمال':bmi<25?'نرمال':bmi<30?'بالاتر از نرمال':'بالا'):'قد و وزن را ثبت کنید'}</div></div>
   <div class="card"><div class="mt c2">تودهٔ بدون چربی</div><div class="mv num">${bf&&m.weight?nf1(m.weight*(1-bf/100)):'—'}<small>kg</small></div><div class="mc">وزن × (۱ − چربی)</div></div>
   <div class="card"><div class="mt cg">روند وزن</div><div class="mv num">${m&&m.weight?nf1(m.weight):'—'}<small>kg</small></div>${spark(wser.slice(-8),140,36,'var(--gold)')}</div>
  </div></div>
  ${m&&!m.s?`<div class="sec"><button class="btn-ghost" style="width:100%" data-act="mdel">${'حذف این اندازه‌گیری'}</button></div>`:''}`;}
function drawStage(){
  const st=$('#mstage');if(!st)return;const k=pk(),g=GEO[k],W=st.clientWidth;const H=Math.round(clamp(W*1.92,620,1060));st.style.height=H+'px';
  const imgH=Math.round((g.c[1]-g.c[0])*1440),s=H*.965/imgH,left=W*.655-400*s,top=H*.012;
  $$('img.fig',st).forEach(im=>{im.style.left=left+'px';im.style.top=top+'px';im.style.width=800*s+'px';im.style.height=imgH*s+'px';});
  const X=f=>left+f*800*s,Y=f=>top+(f-g.c[0])*1440*s;
  const M=S.data.meas,m=M[S.mi]||null,pv=S.mi>0?M[S.mi-1]:null;
  const n=MF.length,rowH=(H-14)/n,cw=Math.min(132,W*.335),bh=clamp(rowH-36,30,38);
  let cards='',paths='';
  const horizon=Y(.5);
  MF.forEach(([f,lab,u],i)=>{
    const y0=10+i*rowH+(rowH-bh-20)*.55,cy=y0+20+bh/2,v=m?m[f]:null,p=pv?pv[f]:null,dl=v!=null&&p!=null?Math.round((v-p)*10)/10:null;
    cards+=`<div class="mcard" style="top:${y0}px;width:${cw}px"><div class="l">${lab}</div><div class="b" style="height:${bh}px;align-items:center"><b class="num">${v!=null?Number(v).toFixed(1):'—'}</b><small>${u}</small></div></div>`;
    if(dl)cards+=`<div class="mdelta ${dl>0?'cu':'cd'}" style="left:${12+cw+6}px;top:${cy-8}px">${dl>0?'▲ +':'▼ −'}${Math.abs(dl).toFixed(1)} ${u}</div>`;
    const site=g[f];if(!site)return;
    const ys=Y(site[0]),xl=X(site[1]),xr=X(site[2]),w=xr-xl,bow=w*.2*clamp((horizon-ys)/(H*.35),-1,1);
    paths+=`<path d="M${xl} ${ys} Q${(xl+xr)/2} ${ys-bow*2} ${xr} ${ys}" stroke-dasharray="4 3.2" />`;
    const ex=12+cw,c1=xl-Math.max(26,(xl-ex)*.55),c2=ex+Math.max(26,(xl-ex)*.45);
    paths+=`<path d="M${xl} ${ys} C${c1} ${ys} ${c2} ${cy} ${ex} ${cy}" stroke-width="1.1" opacity=".9"/><circle cx="${xl}" cy="${ys}" r="2.6" fill="var(--line)" stroke="none"/>`;
  });
  $('#mov').innerHTML=`<g fill="none" stroke="var(--line)" stroke-width="1.4" stroke-linecap="round">${paths}</g>`;
  $('#mcards').innerHTML=cards;
}
function vStrength(){
  const ser=sessionsSeries(),L=S.data.logs,best=bestE1(),pr=prs(),vols=weeklyVols(8);
  const W=320,H=150;let chart='';
  if(ser.length>1){const mn=Math.min(...ser.map(x=>x.v))*.97,mx=Math.max(...ser.map(x=>x.v))*1.02,t0=ser[0].t,t1=ser[ser.length-1].t||t0+1;
    const X=t=>W-12-(t-t0)/((t1-t0)||1)*(W-40),Y=v=>H-22-(v-mn)/((mx-mn)||1)*(H-40);
    let d='';ser.forEach((p,i)=>{d+=(i?' L':'M')+X(p.t).toFixed(1)+' '+Y(p.v).toFixed(1);});
    const prT=new Set(pr.map(l=>Date.parse(l.date)));
    chart=`<svg class="chart" width="100%" viewBox="0 0 ${W} ${H}"><defs><linearGradient id="sg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--r1)" stop-opacity=".3"/><stop offset="1" stop-color="var(--r1)" stop-opacity="0"/></linearGradient></defs>
     ${[0,.5,1].map(f=>{const v=mn+(mx-mn)*f;return `<line x1="28" x2="${W}" y1="${Y(v)}" y2="${Y(v)}" stroke="rgba(255,255,255,.07)"/><text x="0" y="${Y(v)+3}">${nf(v)}</text>`;}).join('')}
     <path d="${d} L${X(t1)} ${H-22} L${X(t0)} ${H-22}Z" fill="url(#sg1)"/><path d="${d}" fill="none" stroke="var(--r1)" stroke-width="2.4" stroke-linejoin="round"/>
     ${ser.map(p=>prT.has(p.t)?`<circle cx="${X(p.t)}" cy="${Y(p.v)}" r="4.5" fill="#000" stroke="var(--r1b)" stroke-width="2"/>`:'').join('')}
     <text x="${W-12}" y="${H-4}" text-anchor="end">${fmtDS.format(new Date(t0))}</text><text x="40" y="${H-4}">${fmtDS.format(new Date(t1))}</text></svg>`;}
  else chart='<div class="mc" style="padding:24px 0;text-align:center">برای نمودار، دست‌کم دو جلسه ثبت کنید.</div>';
  return `<div class="sec" style="margin-top:16px"><div class="card"><div class="mt c1">پرس سینه · رکورد تخمینی</div><div class="mv num">${best?nf1(best):'—'}<small>kg</small></div><div class="mc">دایره‌ها رکوردهای شخصی (بردی) هستند</div>${chart}</div></div>
  <div class="sec"><div class="grid2"><div class="card"><div class="mt c2">حجم ۸ هفته</div><div class="mv num">${nf(vols.reduce((a,b)=>a+b,0))}<small>kg</small></div>${bars(vols,140,40)}</div>
   <div class="card"><div class="mt c1">رکوردها</div><div class="mv num">${nf(pr.length)}</div><div class="mc">${pr.length?'آخرین: '+fmtDS.format(new Date(pr[pr.length-1].date)):'هنوز رکوردی نیست'}</div></div></div></div>
  <div class="sec hist"><h3>سابقهٔ جلسات</h3><div class="list">${L.length?L.slice(-12).reverse().map(l=>{const bs=l.sets.filter(s=>s.done).sort((a,b)=>e1(b.kg,b.reps)-e1(a.kg,a.reps))[0];return `<div class="li"><span class="ic" style="background:rgba(242,193,78,.12);color:var(--r1)">${IC.train.replace('<svg','<svg width="20" height="20"')}</span><div class="tx"><b>${EX[l.ex].name}${l.s?' <span class="pill-s">نمونه</span>':''}</b><span class="num">${fmtLong.format(new Date(l.date))} · ${nf(l.nsets)} ست · بهترین ${bs?nf1(bs.kg)+'×'+nf(bs.reps):'—'}</span></div><div class="vl num c2">${nf(l.vol)}<small style="font-size:11px;color:var(--t2)"> kg</small></div></div>`;}).join(''):'<div class="li"><div class="tx"><b>جلسه‌ای ثبت نشده</b><span>از تب تمرین، اولین جلسه را شروع کنید.</span></div></div>'}</div></div>`;}
function vMuscles(){
  const wl=weekLogs(),k=pk(),teen=k==='g'||k==='t',lo=teen?4:10,hi=teen?10:20;
  const sets={chest:0,delt:0,tri:0};wl.forEach(l=>EX[l.ex].mus.forEach(([n,id,f])=>sets[id]+=l.nsets*f));
  const rows=[['سینه‌ای بزرگ','chest','var(--r1)'],['دلتوئید قدامی','delt','var(--r2)'],['سه‌سر بازو','tri','var(--r3)']];
  const rec=recovery();
  return `<div class="sec" style="margin-top:16px"><div class="card" style="padding:0;overflow:hidden"><div style="position:relative;height:340px;background:radial-gradient(60% 60% at 50% 30%,rgba(233,196,106,.1),transparent 70%)">
     <img src="assets/mus_${k}.webp" alt="" style="position:absolute;left:50%;top:6px;height:330px;transform:translateX(-50%)">
     <div style="position:absolute;top:14px;right:16px"><div class="mt c3">ریکاوری عضلات هدف</div><div class="mv num">${nf(rec)}<small>٪</small></div></div>
     </div><div class="mc" style="padding:0 16px 14px;margin:0">رنگ گرم‌تر یعنی فشار بیشتر در پرس سینه — نمای آناتومی دقیق PuttClub Gym</div></div></div>
  <div class="sec"><h3>ست‌های این هفته</h3><div class="card" style="padding:6px 16px">${rows.map(([n,id,c])=>{const v=sets[id];return `<div class="mbar"><b>${n}</b><div class="tr"><i style="width:${clamp(v/hi*100,0,100)}%;background:${c}"></i><em style="inset-inline-start:${lo/hi*100}%"></em></div><span class="num">${nf1(v)}/${nf(hi)}</span></div>`;}).join('')}</div>
   <div class="mc" style="margin:10px 4px 0">خط‌چین: حداقل ست مؤثر هفتگی (${nf(lo)}). ست‌های کمکی به‌صورت کسری شمرده می‌شوند.</div></div>`;}

/* ---------- tab: me («من») ---------- */
function vMe(){
  const p=S.prof||{},k=pk(),last=S.data.meas[S.data.meas.length-1];
  const row=(t,v)=>`<div class="li"><div class="tx"><b>${t}</b></div><div class="vl num" style="font-weight:600;color:var(--t2);direction:rtl">${v}</div></div>`;
  const tg=(id,t,on,sub)=>`<div class="li"><div class="tx"><b>${t}</b>${sub?`<span>${sub}</span>`:''}</div><button class="tg ${on?'on':''}" data-act="${id}" aria-label="${t}"></button></div>`;
  const standalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone;
  return header('من')+`
  <div class="pf"><div class="avatar">${avatar()}</div><h2>${esc(p.name)} ${esc(p.family||'')}</h2><p>@${esc(p.user)}</p>
   <div style="display:flex;gap:8px;justify-content:center;margin-top:12px">${p.hcp!=null?`<span class="chip">${IC.flag.replace('width="20" height="20"','width="14" height="14"')} هندیکپ ${nf(p.hcp)}</span>`:''}<span class="chip">${p.role==='admin'?'مدیر':p.demo?'حالت نمایشی':'عضو آکادمی'}</span></div></div>
  <div class="sec"><h3>کاراکتر من</h3><div class="card"><div class="mc" style="margin:0">بدن سه‌بعدی تو در باشگاه و صفحهٔ پیشرفت — به‌صورت خودکار از جنسیت و سن انتخاب شده است.</div>
   <div class="chars">${['m','f','t','g'].map(c=>`<button data-act="char" data-c="${c}" class="${c===k?'on':''}"><img src="assets/fig_${c}.webp" alt="" loading="lazy">${CHAR[c].split(' · ')[0]}<br><small style="font-weight:500;opacity:.7">${CHAR[c].split(' · ')[1]}</small></button>`).join('')}</div></div></div>
  <div class="sec"><h3>مشخصات</h3><div class="list">${p.acc?row('اشتراک',p.acc.staff?'مدیر · دسترسی کامل':esc(PLAN_FA[p.acc.plan]||p.acc.plan||'—')+(p.acc.end?' · تا '+fmtDM.format(new Date(String(p.acc.end).slice(0,10)+'T12:00:00')):'')):''}${row('سن',p.age!=null?nf(p.age)+' سال':'—')}${row('جنسیت',esc(p.gender||'—'))}${row('قد',last&&last.height?nf1(last.height)+' cm':'—')}${row('وزن',last&&last.weight?nf1(last.weight)+' kg':'—')}</div></div>
  <div class="sec"><h3>تنظیمات</h3><div class="list">${tg('tsound','صدای پایان استراحت',S.data.set.sound)}${tg('tvib','لرزش',S.data.set.vib,'در دستگاه‌های پشتیبانی‌شده')}${tg('tsample','دادهٔ نمونه',hasSample(),'برای دیدن نمودارها؛ با برچسب «نمونه»')}</div></div>
  <div class="sec"><h3>همگام‌سازی</h3><div class="card"><div class="mc sync" id="syncst" style="margin:0;line-height:1.9">${esc(syncText())}</div></div></div>
  ${standalone?'':`<div class="sec"><h3>نصب روی گوشی</h3><div class="card"><div class="mc" style="margin:0;line-height:2">آیفون: در Safari دکمهٔ «اشتراک‌گذاری» ← «Add to Home Screen».<br>اندروید: منوی مرورگر ← «نصب برنامه».</div></div></div>`}
  <div class="sec"><div class="list"><button class="li" style="width:100%" data-act="logout"><div class="tx"><b class="danger">خروج از حساب</b></div></button></div></div>
  <div class="foot">PuttClub Gym نسخهٔ ${fa(CFG.ver)}<br>بدن‌ها: Microsoft Rocketbox (MIT) · آناتومی: Z-Anatomy و BodyParts3D (CC BY-SA)<br><a href="play/CREDITS.txt" style="color:var(--t3)">منابع و مجوزها</a></div>`;}

/* ---------- render & navigation ---------- */
const VIEWS={summary:vSummary,train:vTrain,progress:vProgress,me:vMe};
function render(t){if(!S.data||!S.prof)return;t=t||S.tab;const el=$('#t-'+t);const y=el.scrollTop;el.innerHTML=VIEWS[t]();el.scrollTop=y;animRings(el);if(t==='progress'&&S.seg==='meas')drawStage();}
function firstTab(){return ['summary','train','progress'].find(tabOk)||'me';}
function applyTabs(){$$('#tabbar button').forEach(b=>{b.style.display=tabOk(b.dataset.t)?'':'none';});}
function go(t){if(!S.data||!S.prof)return;if(!tabOk(t))t=firstTab();S.tab=t;$$('.tab').forEach(e=>e.classList.toggle('on',e.id==='t-'+t));$$('#tabbar button').forEach(b=>b.classList.toggle('on',b.dataset.t===t));render(t);}
function onScroll(e){const el=e.target;if(!el.classList||!el.classList.contains('tab'))return;const nb=$('.nb',el);if(nb)nb.classList.toggle('on',el.scrollTop>52);}

/* ---------- session (push screen) ---------- */
let clockT=null;
function openSession(di){
  if(!can('gym.train.session')){toast('ثبت جلسه در اشتراک شما فعال نیست');return;}
  const P=plan(),d=P.days[di];if(!d)return;
  let A=S.data.active;
  if(!A||A.day!==di){
    if(A&&A.sets.some(s=>s.done)&&!confirm('یک جلسهٔ نیمه‌تمام دارید. آن را کنار بگذاریم و جلسهٔ جدید شروع شود؟'))di=A.day;
    else{A=S.data.active={start:new Date().toISOString(),day:di,ex:d.ex,sets:Array.from({length:d.sets},()=>({kg:d.kg,reps:d.reps,done:false}))};saveData();}
  }
  renderSession();$('#push').classList.add('on');$('#tabbar').classList.add('off');
  clearInterval(clockT);clockT=setInterval(()=>{const c=$('#clock');if(c&&S.data.active)c.textContent=hhmmss((Date.now()-Date.parse(S.data.active.start))/1000);},1000);
}
function closePush(){$('#push').classList.remove('on');$('#tabbar').classList.remove('off');clearInterval(clockT);stopRest();render();}
function renderSession(){
  const A=S.data.active;if(!A)return;const P=plan(),d=P.days[A.day],ex=EX[A.ex],k=pk(),prev=lastFor(A.day,A.ex);
  const plate=(kg)=>{const side=(kg-P.bar)/2;return side>0?`هر طرف ${nf1(side)} کیلو + هالتر ${nf(P.bar)} کیلویی`:`فقط هالتر ${nf(P.bar)} کیلویی`;};
  $('#push').innerHTML=`<div class="bar" id="pbar"><button class="bk" data-act="back">${IC.chevR}<span>بازگشت</span></button><div class="clock" id="clock">${hhmmss((Date.now()-Date.parse(A.start))/1000)}</div></div>
  <div class="body" id="pbody">
   <div class="sx-hero"><img src="assets/hero_${k}.webp" alt=""><div class="gr"></div>${can('gym.player.form')?`<button class="chip p3" data-act="player">${IC.cube} نمایش سه‌بعدی فرم صحیح</button>`:''}</div>
   <div class="sx-t"><div class="k">روز ${esc(d.t)} · ${WDL[A.day]}</div><h2>${ex.name}</h2><div class="en">${ex.en} · ${ex.eq}</div>
    <div class="tags">${ex.mus.map((m,i)=>`<i class="${i?'':'g'}">${m[0]}</i>`).join('')}</div>
    <div class="rx num"><div><small>ست × تکرار</small><b>${nf(d.sets)} × ${nf(d.reps)}</b></div><div><small>بار</small><b>${nf1(d.kg)} kg</b></div><div><small>سختی هدف</small><b>RPE ${d.rpe}</b></div><div><small>تمپو</small><b>${d.tempo}</b></div><div><small>استراحت</small><b>${mmss(d.rest)}</b></div><div><small>هالتر</small><b>${nf(P.bar)} kg</b></div></div></div>
   ${P.guard?`<div class="guard">${IC.shield}<div><b>گاردریل نوجوان فعال است.</b> شدت حداکثر ۶۰٪، هیچ ستی تا ناتوانی نمی‌رود و حضور مربی یا کمک‌دهنده الزامی است.</div></div>`:''}
   <div class="sets"><div class="hd"><span>ست</span><span>قبلی</span><span>کیلوگرم</span><span>تکرار</span><span>✓</span></div>
    ${A.sets.map((s,i)=>{const p=prev&&prev.sets[i];return `<div class="sr ${s.done?'ok':''}" data-i="${i}"><span class="n">${nf(i+1)}</span><span class="pv">${p?fa(p.kg)+'×'+fa(p.reps):'—'}</span><input inputmode="decimal" data-f="kg" value="${fa(s.kg)}" aria-label="کیلوگرم ست ${fa(i+1)}"><input inputmode="numeric" data-f="reps" value="${fa(s.reps)}" aria-label="تکرار ست ${fa(i+1)}"><button class="ck" data-act="check" data-i="${i}" aria-label="ثبت ست">${IC.check}</button></div>`;}).join('')}
    <button class="addset" data-act="addset">${IC.plus} افزودن ست</button><div class="plates">${plate(d.kg)}</div></div>
   <div class="sec cues"><h3>نکات فرم</h3><div class="card"><ol>${ex.cues.map(c=>`<li>${c}</li>`).join('')}</ol><div class="mc" style="margin-top:8px">ثبات‌دهنده‌ها: ${ex.stab}</div></div></div>
   <div class="sec"><h3>چرا برای گلف؟</h3><div class="card golfn"><span style="color:var(--gold);flex:none;margin-top:4px">${IC.flag}</span><div>${ex.golf}</div></div></div>
   ${A.sets.some(s=>s.done)?'':`<div class="sec"><button class="btn-ghost" style="width:100%;color:var(--t2)" data-act="discard">لغو جلسه</button></div>`}
  </div>
  <div class="sfoot">${can('gym.train.timer')?`<button class="sq" data-act="resttoggle" aria-label="تایمر استراحت" style="color:var(--gold)">${IC.timer}</button>`:''}<button class="btn-gold" data-act="finish">پایان تمرین</button></div>`;
  $('#pbody').addEventListener('scroll',e=>$('#pbar').classList.toggle('sc',e.target.scrollTop>10),{passive:true});
}
function setInput(e){const t=e.target;if(!t.dataset||!t.dataset.f)return;const r=t.closest('.sr');const A=S.data.active;if(!A||!r)return;const v=num(t.value);A.sets[+r.dataset.i][t.dataset.f]=v==null?0:v;saveData();}
/* rest timer */
let restEnd=0,restDur=0,restT=null,actx=null;
function beep(){if(!S.data.set.sound)return;try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();const t=actx.currentTime;[0,.18].forEach((o,i)=>{const g=actx.createGain(),os=actx.createOscillator();os.type='sine';os.frequency.value=i?1320:880;g.gain.setValueAtTime(0,t+o);g.gain.linearRampToValueAtTime(.18,t+o+.02);g.gain.exponentialRampToValueAtTime(.001,t+o+.35);os.connect(g).connect(actx.destination);os.start(t+o);os.stop(t+o+.4);});}catch(e){}}
function startRest(sec){restDur=sec;restEnd=Date.now()+sec*1000;$('#rest').classList.add('on');tickRest();clearInterval(restT);restT=setInterval(tickRest,250);try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();actx.resume&&actx.resume();}catch(e){}}
function stopRest(){clearInterval(restT);$('#rest').classList.remove('on');}
function tickRest(){const left=(restEnd-Date.now())/1000;if(left<=0){stopRest();beep();haptic([60,60,60]);toast('⏱ استراحت تمام شد — ست بعدی');return;}
  $('#rest .t').textContent=mmss(left);const C=2*Math.PI*15;$('#rest .ra2').style.strokeDashoffset=C*(1-left/restDur);}
function finish(){
  const A=S.data.active;if(!A)return;const done=A.sets.filter(s=>s.done&&s.kg>0&&s.reps>0);
  if(!done.length){if(confirm('هیچ ستی ثبت نشده. جلسه لغو شود؟')){S.data.active=null;saveData();closePush();}return;}
  const before=bestE1(),awBefore=awards().filter(a=>a.ok).map(a=>a.id);
  const log=mkLog({date:A.start,day:A.day,ex:A.ex,pid:plan().id||null,sets:A.sets.map(s=>({kg:s.kg,reps:s.reps,done:!!s.done})),dur:Math.round((Date.now()-Date.parse(A.start))/1000)});
  S.data.logs.push(log);S.data.logs.sort((a,b)=>a.date<b.date?-1:1);S.data.active=null;saveData();SYNC.add('workout_save',wPayload(log));
  const pr=before>0&&log.e1rm>before+.01,newAw=awards().filter(a=>a.ok&&!awBefore.includes(a.id));
  closePush();
  const pw=planWeek(),wl=weekLogs(),sets=wl.reduce((a,l)=>a+l.nsets,0),vol=wl.reduce((a,l)=>a+l.vol,0);
  sheet(`<div style="display:flex;justify-content:center;margin:6px 0 10px">${rings([pw.sets?sets/pw.sets:0,pw.vol?vol/pw.vol:0,recovery()/100],120)}</div>
   <h3>${pr?'بردی! رکورد شخصی جدید':'آفرین، جلسه ثبت شد'}</h3><p class="s">${EX[log.ex].name} · ${fmtLong.format(new Date(log.date))}</p>
   <div class="sumg num"><div><small>مدت</small><b>${hhmmss(log.dur)}</b></div><div><small>حجم کل</small><b>${nf(log.vol)} <span style="font-size:13px">kg</span></b></div><div><small>ست‌ها</small><b>${nf(log.nsets)}</b></div><div><small>رکورد تخمینی</small><b class="${pr?'c1':''}">${nf1(log.e1rm)} <span style="font-size:13px">kg</span></b></div></div>
   ${newAw.length?`<div class="aw" style="justify-content:center;margin:0 0 12px">${newAw.map((a,i)=>`<div class="a">${medal(a.ic,'n'+i)}<b>${a.n}</b><span>${a.d}</span></div>`).join('')}</div>`:''}
   <button class="btn-gold" style="width:100%" data-act="sheetclose">تمام</button>`);
  setTimeout(()=>animRings($('#sheet')),60);
}
/* ---------- 3D player (lazy, full screen) ---------- */
const PLAYER_BYTES=14.9e6;let playerWarm=false;
async function openPlayer(){
  if(!can('gym.player.form')){toast('نمایش سه‌بعدی در اشتراک شما فعال نیست');return;}
  const pl=$('#player'),k=pk();
  pl.innerHTML=`<div class="ld" id="pld"><img class="bg" src="assets/hero_${k}.webp" alt=""><div class="c"><svg width="74" height="74" viewBox="0 0 74 74"><circle cx="37" cy="37" r="32" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="5"/><circle id="pring" cx="37" cy="37" r="32" fill="none" stroke="var(--gold)" stroke-width="5" stroke-linecap="round" stroke-dasharray="201" stroke-dashoffset="201" transform="rotate(-90 37 37)" style="transition:stroke-dashoffset .3s"/><image href="assets/emblem.webp" x="21" y="21" width="32" height="32"/></svg><b>در حال ورود به PuttClub Gym</b><span id="ptxt">آماده‌سازی صحنهٔ سه‌بعدی…</span></div></div>
   <div class="top"><button class="gbtn" data-act="closeplayer" aria-label="بستن">${IC.x}</button><div class="tt">پرس سینه با هالتر<small>${CHAR[k]}</small></div><span style="width:40px"></span></div>`;
  pl.classList.add('on');
  const src='play/bench-press.html?embed=1&p='+k+(can('gym.player.anatomy')?'':'&mus=0');
  if(!playerWarm){try{const r=await fetch('play/bench-press.html',{cache:'default'});if(r.body&&r.body.getReader){const rd=r.body.getReader();let got=0;for(;;){const {done,value}=await rd.read();if(done)break;got+=value.length;const f=Math.min(.99,got/PLAYER_BYTES);const pr=$('#pring');if(!pr)return;pr.style.strokeDashoffset=201*(1-f);$('#ptxt').textContent=fa(Math.round(f*100))+'٪ · بار اول کمی طول می‌کشد';}}else await r.blob();playerWarm=true;}catch(e){}}
  if(!pl.classList.contains('on'))return;
  const pr=$('#pring');if(pr)pr.style.strokeDashoffset=0;$('#ptxt')&&($('#ptxt').textContent='ساخت صحنه و نورپردازی…');
  const f=document.createElement('iframe');f.src=src;f.allow='fullscreen';f.title='PuttClub Gym 3D';
  f.onload=()=>setTimeout(()=>{f.classList.add('rd');const l=$('#pld');if(l){l.style.opacity=0;setTimeout(()=>l.remove(),600);}},900);
  pl.appendChild(f);
}
function closePlayer(){const pl=$('#player');if(!pl.classList.contains('on'))return;pl.classList.remove('on');setTimeout(()=>{if(!pl.classList.contains('on'))pl.innerHTML='';},400);}
/* ---------- sheet ---------- */
function sheet(html){const s=$('#sheet');s.innerHTML=`<div class="bk" data-act="sheetclose"></div><div class="pn"><div class="grab"></div>${html}</div>`;requestAnimationFrame(()=>s.classList.add('on'));}
function closeSheet(){const s=$('#sheet');s.classList.remove('on');setTimeout(()=>{if(!s.classList.contains('on'))s.innerHTML='';},450);render();}
function measForm(){const last=S.data.meas[S.data.meas.length-1]||{};
  sheet(`<h3>اندازه‌گیری جدید</h3><p class="s">${fmtDM.format(new Date())} · سانتی‌متر و کیلوگرم</p><form id="mform"><div class="fgrid">${MF.map(([f,l,u])=>`<label><span>${l} (${u})</span><input name="${f}" inputmode="decimal" placeholder="${last[f]!=null?fa(last[f]):'—'}"></label>`).join('')}</div>
   <div class="mc" style="margin:12px 2px">نکته: صبح، ناشتا و با متر نواری غیرکشی اندازه بگیرید. خالی‌ها از اندازهٔ قبلی برداشته می‌شوند.</div><button class="btn-gold" style="width:100%" type="submit">ذخیره</button></form>`);
  $('#mform').addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(e.target),m={id:mid('M'),date:new Date().toISOString()};let any=false;
    MF.forEach(([f])=>{const v=num(fd.get(f));if(v!=null&&v>0){m[f]=v;any=true;}else if(last[f]!=null&&!last.s)m[f]=last[f];});
    if(!any){toast('دست‌کم یک اندازه وارد کنید');return;}S.data.meas.push(m);saveData();SYNC.add('meas_save',m);S.mi=S.data.meas.length-1;closeSheet();toast('اندازه‌گیری ذخیره شد');});}

/* ---------- actions ---------- */
const ACT={
 tab:a=>go(a.dataset.t),day:a=>{S.day=+a.dataset.d;render('train');},seg:a=>{S.seg=a.dataset.s;render('progress');},
 session:(a,e)=>{if(e.target.closest('[data-act="player"]'))return;openSession(+a.dataset.d);},
 player:(a,e)=>{e.stopPropagation();openPlayer();},closeplayer:closePlayer,back:closePush,
 check:a=>{const A=S.data.active,i=+a.dataset.i,s=A.sets[i];const r=a.closest('.sr');$$('input',r).forEach(inp=>{const v=num(inp.value);s[inp.dataset.f]=v==null?0:v;});
   s.done=!s.done;saveData();r.classList.toggle('ok',s.done);haptic(15);if(s.done&&can('gym.train.timer')){startRest(plan().days[A.day].rest);}},
 addset:()=>{const A=S.data.active,l=A.sets[A.sets.length-1]||{kg:plan().days[A.day].kg,reps:plan().days[A.day].reps};A.sets.push({kg:l.kg,reps:l.reps,done:false});saveData();const y=$('#pbody').scrollTop;renderSession();$('#pbody').scrollTop=y;},
 finish,discard:()=>{S.data.active=null;saveData();closePush();},
 resttoggle:()=>{if($('#rest').classList.contains('on'))stopRest();else startRest(plan().days[S.data.active.day].rest);},
 rminus:()=>{restEnd-=15000;restDur=Math.max(5,restDur-15);tickRest();},rplus:()=>{restEnd+=15000;restDur+=15;tickRest();},rskip:stopRest,
 sheetclose:closeSheet,mnew:measForm,mprev:()=>{S.mi--;render('progress');},mnext:()=>{S.mi++;render('progress');},
 mdel:()=>{if(confirm('این اندازه‌گیری حذف شود؟')){const dm=S.data.meas[S.mi];if(dm&&dm.id)SYNC.add('meas_delete',{id:dm.id});S.data.meas.splice(S.mi,1);saveData();S.mi=-1;render('progress');}},
 skin:a=>{S.skin=a.dataset.s;$('#figA').style.opacity=S.skin==='fig'?1:0;$('#figB').style.opacity=S.skin==='mus'?1:0;$$('.mtog button').forEach(b=>b.classList.toggle('on',b.dataset.s===S.skin));},
 char:a=>{S.data.pk=a.dataset.c;saveData();SYNC.add('settings_save',{character:a.dataset.c});render('me');toast('کاراکتر تغییر کرد: '+CHAR[a.dataset.c]);},
 tsound:()=>{S.data.set.sound=!S.data.set.sound;saveData();SYNC.add('settings_save',{sound:S.data.set.sound});render('me');},tvib:()=>{S.data.set.vib=!S.data.set.vib;saveData();SYNC.add('settings_save',{vib:S.data.set.vib});render('me');},
 tsample:()=>{setSample(!hasSample());render('me');toast(hasSample()?'دادهٔ نمونه اضافه شد':'دادهٔ نمونه حذف شد');},
 logout:()=>{if(confirm('از حساب خارج می‌شوید؟'))signOut();}};
document.addEventListener('click',e=>{const a=e.target.closest('[data-act]');if(!a)return;const f=ACT[a.dataset.act];if(f){e.preventDefault();f(a,e);}});
document.addEventListener('input',setInput);
document.addEventListener('focusin',e=>{if(e.target.matches&&e.target.matches('.sr input'))setTimeout(()=>e.target.select(),0);});
document.addEventListener('scroll',onScroll,true);
addEventListener('resize',()=>{if(S.tab==='progress'&&S.seg==='meas')drawStage();});

/* ---------- boot ---------- */
function showLogin(msg){$('#login').classList.remove('hide');$('#lerr').textContent=msg||'';$('#tabbar').classList.add('off');}
function enter(){$('#login').classList.add('hide');applyEx();loadData();if(S.prof.demo&&!S.data.seeded){setSample(true);S.data.seeded=true;saveData();}
  if(S.boot){mergeServer(S.boot);S.boot=null;lastRefresh=SYNC.last=Date.now();SYNC.state='ok';}else if(S.sess)refresh();
  applyTabs();$('#tabbar').classList.remove('off');go(S.tab);if(S.data.active)setTimeout(()=>toast('جلسهٔ نیمه‌تمام داری — از تب تمرین ادامه بده'),900);}
$('#lform').addEventListener('submit',async e=>{e.preventDefault();const b=$('#lbtn');b.disabled=true;b.innerHTML='<span class="spin"></span>';$('#lerr').textContent='';
  try{await signIn($('#lu').value,$('#lp').value);enter();}catch(err){$('#lerr').textContent=err.message;}finally{b.disabled=false;b.textContent='ورود';}});
$('#ldemo').addEventListener('click',()=>{demo();enter();});
if(S.prof&&(S.sess||S.prof.demo))enter();else showLogin('');
/* live: access-matrix / program / data changes from the academy arrive without re-login */
addEventListener('online',()=>{SYNC.flush();refresh();});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&S.sess&&Date.now()-lastRefresh>60000)refresh();});
setInterval(()=>{if(document.visibilityState==='visible'&&S.sess&&Date.now()-lastRefresh>300000)refresh();},60000);
if('serviceWorker' in navigator&&location.protocol==='https:'){navigator.serviceWorker.register('sw.js').catch(()=>{});
  let reloaded=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(reloaded||(S.data&&S.data.active))return;reloaded=true;location.reload();});}
