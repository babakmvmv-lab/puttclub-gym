/* ---------- بدن من: اندازه‌گیری سه‌سطحی (ISAK) + کاراکتر سه‌بعدی هم‌شکل بدن عضو ----------
   سطح ۱ پایه (خانه) · سطح ۲ مربی (طول، پهنا، دورهای تکمیلی) · سطح ۳ پیشرفته (۸ چربی زیرپوستی + ۳ عکس استاندارد)
   نمایشگر زنده: play/bench-press.html#view=body (postMessage) · تصویر ثابت صفحهٔ پیشرفت: رندر انباشته از همان نمایشگر */
const FD=[
 /* ---- tier 1 ---- */
 {k:'height',t:1,g:'پایه',l:'قد',u:'cm',r:[90,230],tip:'بدون کفش، پشت به دیوار، نگاه افقی؛ در دم عمیق',how:'پاشنه‌ها جفت و چسبیده به دیوار؛ پاشنه، باسن و پشت سر با دیوار تماس داشته باشند. سر در «صفحهٔ فرانکفورت» (گوشه چشم و سوراخ گوش در یک خط افقی). یک گونیا یا کتاب را روی بالاترین نقطهٔ سر بگذارید و در دم عمیق علامت بزنید.'},
 {k:'weight',t:1,g:'پایه',l:'وزن',u:'kg',r:[20,250],tip:'صبح، ناشتا، بعد از دستشویی، با حداقل لباس',how:'ترازوی دیجیتال روی سطح صاف و سفت. هر بار در همان ساعت و همان شرایط وزن کنید تا روند واقعی دیده شود.'},
 {k:'sit',t:1,g:'پایه',l:'قد نشسته',u:'cm',r:[45,135],x:1,tip:'روی سطح سفت، پشت صاف به دیوار؛ از نشیمن تا بالای سر',how:'روی یک جعبه یا نیمکت سفت بنشینید، دست‌ها روی ران، پشت و باسن به دیوار. فاصلهٔ سطح نشیمن تا بالای سر را (در دم عمیق) بخوانید. این عدد نسبت طول تنه به پا را دقیق می‌کند.'},
 {k:'span',t:1,g:'پایه',l:'فاصلهٔ دو دست',u:'cm',r:[90,240],x:1,tip:'دست‌ها کاملاً باز و افقی؛ نوک انگشت میانی تا نوک انگشت میانی',how:'پشت به دیوار بایستید، دست‌ها را در ارتفاع شانه کاملاً باز کنید و کف دست رو به جلو. فاصلهٔ نوک انگشت میانی دو دست را با متر روی دیوار بخوانید. این عدد طول دست‌ها و پهنای شانهٔ کاراکتر را تنظیم می‌کند.'},
 {k:'neck',t:1,g:'دورها',l:'گردن',u:'cm',r:[20,70],tip:'درست زیر برجستگی حنجره، عمود بر محور گردن',how:'سر صاف و نگاه افقی. متر درست زیر برجستگی حنجره (سیب آدم) و عمود بر محور گردن؛ کمی از جلو پایین‌تر از پشت. متر را فشار ندهید.'},
 {k:'chest',t:1,g:'دورها',l:'سینه',u:'cm',r:[50,190],tip:'آقایان روی خط نوک سینه، خانم‌ها پرترین قسمت؛ پایان بازدم عادی',how:'دست‌ها کمی از بدن فاصله بگیرند تا متر زیر بغل رد شود؛ بعد دست‌ها را رها کنید. متر کاملاً افقی (در آینه چک کنید). عدد را در پایان یک بازدم عادی بخوانید.'},
 {k:'waist',t:1,g:'دورها',l:'کمر',u:'cm',r:[40,190],tip:'وسط پایین‌ترین دنده و بالای استخوان لگن؛ شکم رها',how:'پایین‌ترین دندهٔ پهلو و بالای تاج استخوان لگن را با انگشت پیدا کنید؛ متر دقیقاً وسط این دو و افقی. شکم را تو نکشید؛ در پایان بازدم عادی بخوانید.'},
 {k:'hip',t:1,g:'دورها',l:'باسن',u:'cm',r:[50,190],tip:'برجسته‌ترین نقطهٔ باسن از نیم‌رخ؛ پاها جفت',how:'پاها جفت و عضلات باسن شل. از نیم‌رخ در آینه برجسته‌ترین نقطهٔ عقب باسن را پیدا کنید و متر را افقی دور آن بگیرید.'},
 {k:'biceps',t:1,g:'دورها',l:'بازو',u:'cm',r:[14,70],tip:'بازوی راست آویزان و رها، وسط سر شانه تا آرنج',how:'وسط فاصلهٔ برجستگی سر شانه (آکرومیون) تا نوک آرنج را علامت بزنید. دست آویزان و کاملاً شل؛ متر عمود بر محور بازو.'},
 {k:'thigh',t:1,g:'دورها',l:'ران',u:'cm',r:[25,110],tip:'۱ سانتی‌متر زیر چین باسن؛ وزن روی هر دو پا',how:'پاها کمی باز به اندازهٔ عرض لگن و وزن مساوی روی دو پا. متر ۱ سانتی‌متر زیر چین زیر باسنِ ران راست، عمود بر محور ران.'},
 {k:'calf',t:1,g:'دورها',l:'ساق',u:'cm',r:[18,70],tip:'پهن‌ترین قسمت ساق راست، ایستاده',how:'ایستاده با وزن مساوی. متر را بالا و پایین ببرید تا بیشترین دور ساق راست پیدا شود.'},
 /* ---- tier 2 ---- */
 {k:'uarmL',t:2,g:'طول‌ها',l:'بازو: آکرومیون تا آرنج',u:'cm',r:[15,50],x:1,tip:'لبهٔ بیرونی سر شانه تا سر استخوان رادیوس (آرنج بیرونی)',how:'ایستاده، دست آویزان. با آنتروپومتر یا متر غیرکشی از لبهٔ بیرونی‌ترین نقطهٔ آکرومیون تا لبهٔ بالایی سر رادیوس (فرورفتگی بیرون آرنج).'},
 {k:'farmL',t:2,g:'طول‌ها',l:'ساعد: آرنج تا مچ',u:'cm',r:[12,42],x:1,tip:'سر رادیوس تا زائدهٔ استیلوئید رادیوس (مچ سمت شست)',how:'از نقطهٔ رادیال (آرنج بیرونی) تا پایین‌ترین نقطهٔ زائدهٔ استیلوئید رادیوس در مچ، سمت شست.'},
 {k:'handL',t:2,g:'طول‌ها',l:'طول دست',u:'cm',r:[10,28],x:1,tip:'وسط خط مچ تا نوک انگشت میانی',how:'کف دست صاف رو به بالا؛ از وسط خطی که دو استیلوئید را به هم وصل می‌کند تا نوک انگشت میانی.'},
 {k:'thighL',t:2,g:'طول‌ها',l:'ران: تروکانتر تا زانو',u:'cm',r:[22,65],x:1,tip:'برجستگی تروکانتر بزرگ تا لبهٔ بیرونی کندیل تیبیا',how:'ایستاده. از بالاترین نقطهٔ تروکانتر بزرگ (برجستگی استخوانی بیرون لگن) تا لبهٔ بالایی-بیرونی درشت‌نی (تیبیال لترال) در زانو.'},
 {k:'shankL',t:2,g:'طول‌ها',l:'ساق: زانو تا قوزک داخلی',u:'cm',r:[22,60],x:1,tip:'لبهٔ داخلی تیبیا تا پایین قوزک داخلی',how:'نشسته، مچ روی ران مقابل. از لبهٔ بالایی-داخلی درشت‌نی (تیبیال مدیال) تا پایین‌ترین نقطهٔ قوزک داخلی (اسفیریون).'},
 {k:'footL',t:2,g:'طول‌ها',l:'طول پا',u:'cm',r:[14,35],x:1,tip:'عقب‌ترین نقطهٔ پاشنه تا نوک بلندترین انگشت',how:'ایستاده، وزن روی پا. از عقب‌ترین نقطهٔ پاشنه تا نوک بلندترین انگشت، موازی محور پا.'},
 {k:'biac',t:2,g:'پهناها (کولیس)',l:'پهنای شانه (بای‌آکرومیال)',u:'cm',r:[22,60],x:1,tip:'بین بیرونی‌ترین نقاط دو آکرومیون، از پشت',how:'از پشت سر فرد، کولیس بزرگ را روی بیرونی‌ترین نقاط دو آکرومیون بگذارید؛ فشار کم و ثابت. فرد شانه‌ها را شل نگه دارد.'},
 {k:'biil',t:2,g:'پهناها (کولیس)',l:'پهنای لگن (بای‌ایلیاک)',u:'cm',r:[18,48],x:1,tip:'بین بیرونی‌ترین نقاط دو تاج استخوان لگن',how:'از روبه‌رو یا پشت، شاخه‌های کولیس را با زاویهٔ ۴۵ درجه رو به بالا روی بیرونی‌ترین نقاط تاج‌های لگن فشار محکم بدهید (بافت نرم کنار برود).'},
 {k:'chestB',t:2,g:'پهناها (کولیس)',l:'پهنای سینه',u:'cm',r:[18,48],x:1,tip:'افقی در سطح وسط جناغ، روی دنده‌های کناری',how:'در سطح مزواسترنال (وسط جناغ، معادل دندهٔ چهارم)، شاخه‌ها روی بیرونی‌ترین نقاط دنده‌ها با زاویهٔ ۳۰ درجه به پایین؛ در پایان بازدم عادی.'},
 {k:'bicepsF',t:2,g:'دورهای تکمیلی',l:'بازو منقبض',u:'cm',r:[15,70],x:1,tip:'آرنج ۹۰°، بازو افقی جلو، بیشترین دور در انقباض',how:'بازوی راست افقی رو به جلو، آرنج حدود ۹۰ درجه و مشت گره. حداکثر انقباض؛ متر در بیشترین دور، عمود بر محور بازو.'},
 {k:'forearm',t:2,g:'دورهای تکمیلی',l:'ساعد',u:'cm',r:[14,60],tip:'بیشترین دور ساعد، دست رها و کف رو به جلو',how:'دست راست آویزان و شل، کف دست رو به جلو. بیشترین دور ساعد کمی پایین‌تر از آرنج.'},
 {k:'wrist',t:2,g:'دورهای تکمیلی',l:'مچ دست',u:'cm',r:[10,25],x:1,tip:'کمترین دور، درست بالای زائده‌های استیلوئید',how:'کمترین دور مچ، درست در سمت ساعدِ برجستگی‌های استخوانی مچ. نشانهٔ استخوان‌بندی (فریم) بدن است.'},
 {k:'midthigh',t:2,g:'دورهای تکمیلی',l:'وسط ران',u:'cm',r:[25,95],x:1,tip:'وسط فاصلهٔ تروکانتر تا زانو',how:'وسط فاصلهٔ تروکانتر تا تیبیال لترال را علامت بزنید؛ ایستاده با وزن مساوی، متر عمود بر محور ران.'},
 {k:'ankle',t:2,g:'دورهای تکمیلی',l:'مچ پا',u:'cm',r:[14,40],x:1,tip:'کمترین دور، بالای قوزک‌ها',how:'ایستاده؛ کمترین دور ساق، درست بالای قوزک‌ها.'},
 {k:'shoulder',t:2,g:'دورهای تکمیلی',l:'دور شانه',u:'cm',r:[70,175],x:1,tip:'افقی دور برجسته‌ترین قسمت دلتوئیدها، دست‌ها آویزان',how:'دست‌ها آویزان و شل. متر افقی دور برجسته‌ترین قسمت عضلات دلتوئید (پایین‌تر از سر شانه)، در پایان بازدم عادی.'},
 /* ---- tier 3 ---- */
 {k:'sf_triceps',t:3,g:'چربی زیرپوستی (کالیپر)',l:'پشت بازو',u:'mm',r:[2,60],x:1,tip:'پشت بازوی راست، وسط آکرومیون تا آرنج؛ چین عمودی',how:'دست آویزان. چین پوست را با شست و اشاره ۱ سانتی‌متر بالاتر از نقطه بلند کنید؛ کالیپر روی نقطه، ۲ ثانیه بعد بخوانید. دو بار، اگر اختلاف بیش از ۵٪ بود بار سوم.'},
 {k:'sf_subscap',t:3,g:'چربی زیرپوستی (کالیپر)',l:'زیر کتف',u:'mm',r:[2,60],x:1,tip:'۲ سانتی‌متر زیر زاویهٔ تحتانی کتف راست؛ چین مایل ۴۵°',how:'زاویهٔ پایینی کتف را پیدا کنید؛ ۲ سانتی‌متر پایین‌تر، چینی مایل رو به پایین و بیرون (خطوط طبیعی پوست).'},
 {k:'sf_biceps',t:3,g:'چربی زیرپوستی (کالیپر)',l:'جلوی بازو',u:'mm',r:[2,60],x:1,tip:'جلوی بازوی راست، هم‌سطح نقطهٔ پشت بازو؛ چین عمودی',how:'روی برجسته‌ترین قسمت جلوی بازو، هم‌سطح محل پشت بازو؛ چین عمودی.'},
 {k:'sf_iliac',t:3,g:'چربی زیرپوستی (کالیپر)',l:'بالای تاج لگن',u:'mm',r:[2,60],x:1,tip:'درست بالای تاج لگن در خط زیر بغل؛ چین تقریباً افقی',how:'دست راست روی سینه. درست بالای تاج استخوان لگن در خط میانی زیر بغل؛ چین کمی مایل رو به جلو و پایین.'},
 {k:'sf_supra',t:3,g:'چربی زیرپوستی (کالیپر)',l:'فوق خاری',u:'mm',r:[2,60],x:1,tip:'محل تقاطع خط زیر بغل جلو با خط بالای تاج لگن؛ چین مایل',how:'خطی از خار جلویی لگن به سمت زیر بغل جلویی؛ نقطه در تقاطع آن با سطح تاج لگن. چین مایل ۴۵ درجه رو به پایین و داخل.'},
 {k:'sf_abd',t:3,g:'چربی زیرپوستی (کالیپر)',l:'شکم',u:'mm',r:[2,70],x:1,tip:'۵ سانتی‌متر سمت راست ناف؛ چین عمودی',how:'۵ سانتی‌متر سمت راست مرکز ناف؛ چین عمودی. عضلات شکم شل، تنفس عادی.'},
 {k:'sf_thigh',t:3,g:'چربی زیرپوستی (کالیپر)',l:'جلوی ران',u:'mm',r:[2,70],x:1,tip:'وسط چین کشاله تا لبهٔ بالای کشکک؛ نشسته، چین عمودی',how:'نشسته، زانو ۹۰ درجه. وسط فاصلهٔ چین کشاله تا لبهٔ بالایی کشکک؛ چین عمودی (اگر سخت بود، فرد ران را با دو دست بالا نگه دارد).'},
 {k:'sf_calf',t:3,g:'چربی زیرپوستی (کالیپر)',l:'داخل ساق',u:'mm',r:[2,60],x:1,tip:'سمت داخل ساق راست در بیشترین دور؛ چین عمودی',how:'پا روی جعبه، زانو ۹۰ درجه. در سطح بیشترین دور ساق، سمت داخلی؛ چین عمودی.'}
];
const FDK=Object.fromEntries(FD.map(f=>[f.k,f]));
const TIERS=[[1,'پایه','در خانه'],[2,'مربی','طول و پهنا'],[3,'پیشرفته','کالیپر و عکس']];
const SF8=['sf_triceps','sf_subscap','sf_biceps','sf_iliac','sf_supra','sf_abd','sf_thigh','sf_calf'];
const CARRY=['sit','span','uarmL','farmL','handL','thighL','shankL','footL','biac','biil','chestB','wrist','ankle']; // bones: keep from the last measurement
const PHK=['w_chest','d_chest','w_waist','d_waist','w_hip','d_hip'];

/* ---------- body composition ---------- */
function isMale(){const g=String(S.prof&&S.prof.gender||'');if(/زن|خانم|دختر|female|^f/i.test(g))return false;if(/مرد|آقا|پسر|male|^m/i.test(g))return true;const k=pk();return k==='m'||k==='t';}
function ageNow(){const a=S.prof&&S.prof.age;if(a>0)return a;const k=pk();return k==='g'||k==='t'?14:30;}
const DW={m:[[17,1.1620,.0630],[20,1.1631,.0632],[30,1.1422,.0544],[40,1.1620,.0700],[50,1.1715,.0779]],f:[[17,1.1549,.0678],[20,1.1599,.0717],[30,1.1423,.0632],[40,1.1333,.0612],[50,1.1339,.0645]]};
const BFM={dw:'دورنین–ورسلی (۴ چین پوستی) + سیری',slaughter:'اسلاتر (نوجوانان، ۲ چین پوستی)',navy:'روش نیروی دریایی آمریکا (دورها)',deur:'دورنبرگ (از BMI و سن — تقریبی)',deurc:'دورنبرگ کودکان و نوجوانان (تقریبی)'};
function bodyFat(m){
  if(!m)return null;const x=m.extra||{},age=ageNow(),male=isMale(),v=k=>m[k]!=null?m[k]:x[k];
  const sf=SF8.reduce((o,k)=>(v(k)>0&&(o[k]=v(k)),o),{});
  if(age>=17&&sf.sf_biceps&&sf.sf_triceps&&sf.sf_subscap&&sf.sf_iliac){
    const T=DW[male?'m':'f'];let c=T[0];T.forEach(r=>{if(age>=r[0])c=r;});
    const D=c[1]-c[2]*Math.log10(sf.sf_biceps+sf.sf_triceps+sf.sf_subscap+sf.sf_iliac);return {v:clamp(495/D-450,2,60),m:'dw'};}
  if(age<17&&sf.sf_triceps&&sf.sf_calf){const s=sf.sf_triceps+sf.sf_calf;
    const bf=male?(s<=35?.735*s+1.0:.783*s+1.6):(s<=35?.610*s+5.1:.546*s+9.7);return {v:clamp(bf,2,60),m:'slaughter'};}
  if(age>=17){const n=navy(m);if(n&&n>2&&n<65)return {v:n,m:'navy'};}
  if(m.height&&m.weight){const bmi=m.weight/Math.pow(m.height/100,2);
    if(age<17)return {v:clamp(1.51*bmi-.70*age-3.6*(male?1:0)+1.4,3,55),m:'deurc'};
    return {v:clamp(1.20*bmi+.23*age-10.8*(male?1:0)-5.4,3,60),m:'deur'};}
  return null;}
function sumSF(m){const x=m&&m.extra||{};if(!SF8.every(k=>x[k]>0))return null;return SF8.reduce((a,k)=>a+x[k],0);}
function tierOf(m){const x=m&&m.extra||{};if(SF8.some(k=>x[k]>0)||PHK.some(k=>x[k]>0))return 3;if(FD.some(f=>f.t===2&&(x[f.k]>0||(f.k==='forearm'&&m.forearm))))return 2;return 1;}
/* inputs for the 3D fit (cm/kg) */
function fitInput(m){if(!m)return {};const T={},x=m.extra||{};
  MF.forEach(([f])=>{if(m[f]>0)T[f]=+m[f];});
  Object.keys(x).forEach(k=>{if(typeof x[k]==='number'&&k!=='tier'&&k!=='age'&&k!=='bf'&&!k.startsWith('sf_')&&k!=='bicepsF'&&k!=='shoulder')T[k]=x[k];});
  if(x.sf_iliac)T.sf_iliac=x.sf_iliac;
  const bf=bodyFat(m);if(bf)T.bf=Math.round(bf.v*10)/10;
  return T;}
const fitKey=m=>{const T=fitInput(m),s=pk()+JSON.stringify(Object.keys(T).sort().map(k=>[k,T[k]]));let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return 'b'+(h>>>0).toString(36);};

/* ---------- player URL (offline package blob when available) ---------- */
let BV_URL=null;
async function bodyPlayerURL(){
  const PP='play/bench-press.html';
  if(BV_URL)return BV_URL;
  try{if(PK.meta[PP]&&PKG.files[PP]&&PK.meta[PP]===PKG.files[PP][0]){const v=await pkGet(PP);if(v){BV_URL=URL.createObjectURL(new Blob([v],{type:'text/html'}));return BV_URL;}}}catch(e){}
  return AU(PP);}
function bodyFrame(parentEl,css,onMsg){
  const f=document.createElement('iframe');f.title='بدن سه‌بعدی من';f.setAttribute('allow','fullscreen');if(css)f.style.cssText=css;
  const h=e=>{if(e.source!==f.contentWindow)return;const d=e.data;if(!d||d.src!=='pcbody')return;onMsg(d);};
  addEventListener('message',h);f._off=()=>removeEventListener('message',h);
  f.send=m=>{try{f.contentWindow.postMessage(Object.assign({src:'pcgym'},m),'*');}catch(e){}};
  bodyPlayerURL().then(u=>{f.src=u+'#embed=1&view=body&p='+pk();});parentEl.appendChild(f);return f;}

/* ---------- still images (Progress → measurements): rendered by a hidden player, cached in IndexedDB ---------- */
const BS={mem:new Map(),q:[],busy:false,frame:null,idle:null,
  db:null,
  open(){return this.db||(this.db=new Promise((res,rej)=>{const r=indexedDB.open('pcgym-still',1);r.onupgradeneeded=()=>r.result.createObjectStore('s');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);}));},
  async get(k){if(this.mem.has(k))return this.mem.get(k);try{const db=await this.open();const v=await new Promise(res=>{const t=db.transaction('s').objectStore('s').get(k);t.onsuccess=()=>res(t.result||null);t.onerror=()=>res(null);});if(v)this.mem.set(k,v);return v;}catch(e){return null;}},
  async put(k,v){this.mem.set(k,v);try{const db=await this.open();const st=db.transaction('s','readwrite').objectStore('s');st.put(v,k);
    const keys=await new Promise(res=>{const r=st.getAllKeys();r.onsuccess=()=>res(r.result||[]);r.onerror=()=>res([]);});
    if(keys.length>16){const all=await Promise.all(keys.map(kk=>this.get(kk).then(o=>[kk,o&&o.t||0])));all.sort((a,b)=>a[1]-b[1]).slice(0,keys.length-16).forEach(([kk])=>{db.transaction('s','readwrite').objectStore('s').delete(kk);this.mem.delete(kk);});}}catch(e){}},
  want(m){if(!m||!can('gym.player.form')||window.PC_NOSTILL)return;const k=fitKey(m);if(this.mem.has(k)||this.q.some(j=>j.k===k))return;
    this.get(k).then(v=>{if(v){if(S.tab==='progress')drawStage();return;}this.q.push({k,m});this.pump();});},
  pump(){if(this.busy||!this.q.length)return;this.busy=true;clearTimeout(this.idle);const job=this.q.shift();
    const run=()=>this.frame.send({t:'still',id:job.k,p:pk(),m:fitInput(job.m),w:360,h:720});
    const done=v=>{clearTimeout(job.to);this.busy=false;if(v)this.put(job.k,v).then(()=>{if(S.tab==='progress'&&S.seg==='meas')drawStage();});
      if(this.q.length)this.pump();else this.idle=setTimeout(()=>this.kill(),20000);};
    job.to=setTimeout(()=>{this.kill();done(null);},150000);
    if(this.frame&&this.frame._ready){run();this.frame._job=[job,done];return;}
    this.kill();
    this.frame=bodyFrame(document.body,'position:fixed;left:0;top:0;width:360px;height:720px;border:0;opacity:.01;pointer-events:none;z-index:-1',d=>{
      const f=this.frame;if(d.t==='ready'){f._ready=true;run();}
      else if(d.t==='still'&&f._job&&d.id===f._job[0].k){const [j,cb]=f._job;f._job=null;cb({url:d.url,sites:d.sites,w:d.w,h:d.h,t:Date.now()});}
      else if(d.t==='err'&&f._job){const cb=f._job[1];f._job=null;cb(null);}});
    this.frame._job=[job,done];},
  kill(){if(this.frame){this.frame._off();this.frame.remove();this.frame=null;}},
  stop(){this.q=[];const j=this.frame&&this.frame._job;if(j)clearTimeout(j[0].to);this.busy=false;clearTimeout(this.idle);this.kill();}
};

/* ---------- measurement page ---------- */
const MP={on:false,tier:1,vals:{},frame:null,ready:false,model:null,fitT:null,fitId:0,foc:null,ph:{},stillCb:null};
function mpLast(){const M=S.data.meas;return M[M.length-1]||null;}
function mpPlaceholder(k){const l=mpLast();if(!l)return '';const v=FDK[k]&&FDK[k].x?(l.extra||{})[k]:l[k];return v!=null?nf1(v):'';}
function mpMeas(final){ // current entries (+ carried values) → measurement object
  const l=mpLast()||{},lx=l.extra||{},m={},x={};
  FD.forEach(f=>{const v=MP.vals[f.k];const ok=v!=null&&v>=f.r[0]&&v<=f.r[1];
    if(f.x){if(ok)x[f.k]=v;else if(CARRY.includes(f.k)&&lx[f.k]!=null)x[f.k]=lx[f.k];}
    else{if(ok)m[f.k]=v;else if(l[f.k]!=null&&!l.s)m[f.k]=l[f.k];}});
  PHK.forEach(k=>{if(MP.ph.res&&MP.ph.res[k]>0)x[k]=Math.round(MP.ph.res[k]*10)/10;});
  m.extra=x;
  if(final){const bf=bodyFat(m);if(bf){x.bf=Math.round(bf.v*10)/10;x.bfm=bf.m;}x.tier=tierOf(m);const a=S.prof&&S.prof.age;if(a>0)x.age=a;}
  return m;}
function openMeasPage(){
  if(!can('gym.progress.meas')){toast('اندازه‌گیری در اشتراک شما فعال نیست');return;}
  MP.on=true;MP.vals={};MP.ph={};MP.model=null;MP.ready=false;MP.tier=1;
  const el=document.getElementById('mpage')||(()=>{const d=document.createElement('div');d.id='mpage';document.getElementById('app')?document.getElementById('app').appendChild(d):document.body.appendChild(d);return d;})();
  el.innerHTML=`<div class="mp-top"><button class="bk" data-act="mpclose">${IC.chevR}<span>بازگشت</span></button><div class="tt">اندازه‌گیری بدن<small>${fmtDM.format(new Date())}</small></div><button class="sv" data-act="mpsave">ذخیره</button></div>
   <div class="mp-view" id="mpview"><div class="mp-ld" id="mpld"><span class="sp"></span>ساخت بدن سه‌بعدی…</div><div class="mp-cap" id="mpcap"></div><div class="mp-st" id="mpst"></div>
    <div class="mp-vb"><button data-act="mpv" data-v="front">جلو</button><button data-act="mpv" data-v="side">پهلو</button><button data-act="mpv" data-v="back">پشت</button></div></div>
   <div class="mp-tabs">${TIERS.map(([t,n,s])=>`<button data-act="mpt" data-t="${t}" class="${t===1?'on':''}"><b>${fa(t)} · ${n}</b><small>${s}</small></button>`).join('')}</div>
   <div class="mp-body" id="mpbody"></div>`;
  el.classList.add('on');$('#tabbar').classList.add('off');
  mpRender();
  if(can('gym.player.form')&&!window.PC_NOSTILL){
    MP.frame=bodyFrame($('#mpview'),'',d=>{
      if(d.t==='ready'){MP.ready=true;$('#mpld')&&$('#mpld').remove();mpFit(true);}
      else if(d.t==='busy')$('#mpst').classList.add('on');
      else if(d.t==='fitted'){if(d.id===MP.fitId){$('#mpst').classList.remove('on');MP.model=d.model;mpResults();}}
      else if(d.t==='still'&&MP.stillCb){const cb=MP.stillCb;MP.stillCb=null;cb(d);}
      else if(d.t==='err'){$('#mpst').classList.remove('on');toast('شکل‌دهی بدن ممکن نشد: '+esc(d.m||''));}});
    MP.frame.className='mp-if';
  }else $('#mpld').textContent='نمای سه‌بعدی در اشتراک شما فعال نیست';
}
function closeMeasPage(){const el=$('#mpage');if(!el)return;MP.on=false;el.classList.remove('on');$('#tabbar').classList.remove('off');
  setTimeout(()=>{if(!MP.on){if(MP.frame){MP.frame._off();}el.innerHTML='';MP.frame=null;}},420);render();}
let mpT=null;
function mpFit(now){if(!MP.frame||!MP.ready)return;clearTimeout(mpT);mpT=setTimeout(()=>{const T=fitInput(mpMeas(false));const s=JSON.stringify(T);if(s===MP.fitT)return;MP.fitT=s;MP.fitId++;MP.frame.send({t:'fit',id:MP.fitId,p:pk(),m:T});},now?0:650);}
function fieldHTML(f){const v=MP.vals[f.k];
  return `<div class="mf${MP.foc===f.k?' foc':''}" data-k="${f.k}"><div class="lb"><b>${f.l}</b><span>${f.tip}</span></div>
   <div class="in"><input data-k="${f.k}" inputmode="decimal" enterkeyhint="next" autocomplete="off" value="${v!=null?fa(v):''}" placeholder="${mpPlaceholder(f.k)||'—'}"><i>${f.u==='cm'?'سانتی‌متر':f.u==='kg'?'کیلو':'میلی‌متر'}</i></div>
   <button class="hw" data-act="mphow" data-k="${f.k}" aria-label="راهنما">؟</button><div class="how">${f.how}</div></div>`;}
function mpRender(){
  const b=$('#mpbody');if(!b)return;const t=MP.tier;const groups=[];FD.filter(f=>f.t===t).forEach(f=>{let g=groups.find(x=>x.g===f.g);if(!g)groups.push(g={g:f.g,f:[]});g.f.push(f);});
  const intro={1:'صبح، ناشتا، با حداقل لباس و متر نواری غیرکشی. همه دورها افقی و بدون فشار؛ دورهای تنه در پایان بازدم عادی. هر اندازه را دو بار بگیرید و میانگین بزنید (اگر بیش از ۵ میلی‌متر اختلاف داشت، بار سوم). با لمس هر کادر، محل دقیق روی بدن سه‌بعدی نشان داده می‌شود.',
    2:'این سطح بهتر است توسط مربی و با کولیس آنتروپومتری انجام شود. طول‌ها و پهناها استخوان‌بندی کاراکتر را دقیق می‌کنند و در بزرگسالان کافی است سالی یک بار تکرار شوند.',
    3:'چربی زیرپوستی با کالیپر (Harpenden/Lange)، سمت راست بدن، چین با شست و اشاره ۱ سانتی‌متر بالاتر از نقطه؛ ۲ ثانیه بعد بخوانید. سه عکس استاندارد شکل مقطع تنه را دقیق می‌کند — عکس‌ها فقط روی همین گوشی تحلیل می‌شوند و هرگز ارسال یا ذخیره نمی‌شوند.'}[t];
  b.innerHTML=`<div class="mp-intro">${intro}</div>`+groups.map(g=>`<h4>${g.g}</h4><div class="mfl">${g.f.map(fieldHTML).join('')}</div>`).join('')
   +(t===3?photoHTML():'')+`<div id="mpres"></div><button class="btn-gold mp-save" data-act="mpsave">ذخیرهٔ اندازه‌گیری</button><div class="mp-foot">روش‌ها: ISAK (انجمن بین‌المللی پیشبرد کینانتروپومتری) · ${BFM.dw}</div>`;
  $$('#mpbody input[data-k]').forEach(inp=>{
    inp.addEventListener('focus',()=>mpFocus(inp.dataset.k));
    inp.addEventListener('input',()=>{const k=inp.dataset.k,f=FDK[k],v=num(inp.value);MP.vals[k]=v;const bad=v!=null&&(v<f.r[0]||v>f.r[1]);inp.closest('.mf').classList.toggle('bad',bad);mpFit();mpResults();});
    inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();const all=$$('#mpbody input[data-k]');const i=all.indexOf(inp);if(all[i+1])all[i+1].focus();else inp.blur();}});});
  $$('#mpbody input[type=file]').forEach(inp=>inp.addEventListener('change',()=>photoPick(inp)));
  mpResults();}
function mpFocus(k){MP.foc=k;$$('#mpbody .mf').forEach(e=>e.classList.toggle('foc',e.dataset.k===k));const f=FDK[k];
  const c=$('#mpcap');if(c&&f){c.innerHTML=`<b>${f.l}</b>${f.tip}`;c.classList.add('on');}
  if(MP.frame&&MP.ready)MP.frame.send({t:'guide',k});}
function mpResults(){
  const el=$('#mpres');if(!el)return;const m=mpMeas(true),x=m.extra||{},bf=bodyFat(m),H=m.height,Wt=m.weight;
  const bmi=H&&Wt?Wt/Math.pow(H/100,2):null,fm=bf&&Wt?Wt*bf.v/100:null,lm=fm!=null?Wt-fm:null,ffmi=lm&&H?lm/Math.pow(H/100,2)+6.1*(1.8-H/100):null;
  const whr=m.waist&&m.hip?m.waist/m.hip:null,whtr=m.waist&&H?m.waist/H:null,s8=sumSF(m);
  const ama=x.sf_triceps&&m.biceps?Math.pow(m.biceps-Math.PI*x.sf_triceps/10,2)/(4*Math.PI)-(isMale()?10:6.5):null;
  const tier=tierOf(m),acc={1:'±۲–۴ سانتی‌متر',2:'±۱–۲ سانتی‌متر',3:'±۱ سانتی‌متر'}[tier];
  const mk=MP.model&&MP.model.vol?MP.model.vol*495/((bf?bf.v:20)+450):null; // model volume × Siri density
  const card=(c,t,v,u,s)=>`<div class="card"><div class="mt ${c}">${t}</div><div class="mv num">${v}<small>${u||''}</small></div>${s?`<div class="mc">${s}</div>`:''}</div>`;
  el.innerHTML=`<h4>نتیجه</h4><div class="grid2">
   ${card('c1','درصد چربی',bf?nf1(bf.v):'—','٪',bf?BFM[bf.m]:'قد، وزن و دور گردن/کمر را وارد کنید')}
   ${card('c2','تودهٔ بدون چربی',lm!=null?nf1(lm):'—','kg',fm!=null?'چربی '+nf1(fm)+' کیلو':'')}
   ${card('c3','شاخص تودهٔ بدن',bmi?nf1(bmi):'—','',ffmi?'FFMI '+nf1(ffmi):'')}
   ${card('cg','کمر به قد',whtr?nf(whtr,2):'—','',whtr?(whtr<.5?'سالم (کمتر از ۰٫۵)':whtr<.6?'افزایش خطر':'خطر بالا'):'')}
   ${whr?card('c1','کمر به باسن',nf(whr,2),'',(isMale()?whr<.9:whr<.85)?'مطلوب':'بالاتر از حد توصیه'):''}
   ${s8?card('c2','مجموع ۸ چین پوستی',nf1(s8),'mm','شاخص استاندارد ISAK برای پیگیری چربی'):''}
   ${ama?card('c3','سطح عضلهٔ بازو',nf1(ama),'cm²','از دور بازو و چین پشت بازو'):''}
   ${card('cg','دقت شکل کاراکتر',acc,'',mk&&Wt?`وزن مدل ${nf1(mk)} کیلو در برابر ${nf1(Wt)}`:'سطح '+fa(tier)+' از ۳')}
  </div>`;}
async function mpSave(){
  const m=mpMeas(true);let any=false;MF.forEach(([f])=>{if(MP.vals[f]>0)any=true;});FD.forEach(f=>{if(f.x&&MP.vals[f.k]>0)any=true;});if(MP.ph.res)any=true;
  if(!any){toast('دست‌کم یک اندازه وارد کنید');return;}
  const bad=FD.filter(f=>MP.vals[f.k]!=null&&(MP.vals[f.k]<f.r[0]||MP.vals[f.k]>f.r[1]));if(bad.length){toast(`«${bad[0].l}» خارج از محدودهٔ معقول است`);return;}
  m.id=mid('M');m.date=new Date().toISOString();if(!Object.keys(m.extra).length)delete m.extra;
  S.data.meas.push(m);saveData();SYNC.add('meas_save',m);S.mi=S.data.meas.length-1;S.seg='meas';
  // the visible viewer already shows this exact body → capture its still for the Progress page
  if(MP.frame&&MP.ready&&!window.PC_NOSTILL){const btns=$$('[data-act=mpsave]');btns.forEach(b=>{b.disabled=true;b.textContent='ذخیرهٔ تصویر بدن…';});
    const k=fitKey(m);await new Promise(res=>{const to=setTimeout(()=>{MP.stillCb=null;res();},40000);
      MP.stillCb=d=>{clearTimeout(to);BS.put(k,{url:d.url,sites:d.sites,w:d.w,h:d.h,t:Date.now()}).then(res);};
      MP.frame.send({t:'still',id:k,p:pk(),m:fitInput(m),w:360,h:720});});}
  closeMeasPage();toast('اندازه‌گیری ذخیره شد');}

/* ---------- tier 3: photos → torso widths & depths (MediaPipe, on-device) ---------- */
function photoHTML(){const card=(v,t,s)=>{const p=MP.ph[v];return `<label class="phc ${p&&p.ok?'ok':p&&p.err?'er':''}"><input type="file" accept="image/*" capture="environment" data-ph="${v}">
  ${p&&p.thumb?`<img src="${p.thumb}" alt="">`:`<svg viewBox="0 0 40 60" width="34" height="50"><circle cx="20" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M20 15v22M20 37l-7 18M20 37l7 18M20 20l${v==='side'?'0 12':'-11 10'}M20 20l${v==='side'?'0 12':'11 10'}" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`}
  <b>${t}</b><small>${p&&p.msg?p.msg:s}</small></label>`;};
  const r=MP.ph.res;
  return `<h4>سه عکس استاندارد</h4><div class="mp-intro">فاصلهٔ ۳ متر، دوربین در ارتفاع ناف و کاملاً عمودی، دیوار ساده و روشن، لباس چسبان (مثل لباس ورزشی)، تمام بدن از سر تا پا در کادر. روبه‌رو و پشت: دست‌ها ۳۰ درجه از بدن باز. نیم‌رخ: دست‌ها افقی رو به جلو. ابتدا قد را در سطح پایه وارد کنید.</div>
   <div class="phg">${card('front','روبه‌رو','پاها به عرض لگن')}${card('side','نیم‌رخ راست','دست‌ها رو به جلو')}${card('back','پشت','مثل روبه‌رو')}</div>
   ${r?`<div class="card phr"><div class="mt c3">مقطع تنه از عکس</div><div class="tb">${[['chest','سینه'],['waist','کمر'],['hip','باسن']].map(([k,n])=>`<div><b>${n}</b><span>پهنا ${r['w_'+k]?nf1(r['w_'+k]):'—'} · عمق ${r['d_'+k]?nf1(r['d_'+k]):'—'}</span></div>`).join('')}</div><div class="mc">سانتی‌متر · برای شکل مقطع کاراکتر (بیضی واقعی تنه) استفاده می‌شود.</div></div>`:''}`;}
let MPV=null;
async function mpVision(){
  if(MPV)return MPV;
  MPV=(async()=>{const base=new URL('vendor/mp/',location.href).href;
    const mod=await import(base+'vision_bundle.mjs');
    const fs=await mod.FilesetResolver.forVisionTasks(base+'wasm');
    const opt=d=>({baseOptions:{modelAssetPath:base+'pose_landmarker_full.task',delegate:d},canvas:d==='GPU'?document.createElement('canvas'):undefined,runningMode:'IMAGE',numPoses:1,outputSegmentationMasks:true});
    try{return await mod.PoseLandmarker.createFromOptions(fs,opt('GPU'));}catch(e){return await mod.PoseLandmarker.createFromOptions(fs,opt('CPU'));}})();
  MPV.catch(()=>{MPV=null;});return MPV;}
function imgLoad(file){return new Promise((res,rej)=>{const u=URL.createObjectURL(file),im=new Image();im.onload=()=>res({im,u});im.onerror=rej;im.src=u;});}
async function photoPick(inp){
  const v=inp.dataset.ph,file=inp.files&&inp.files[0];if(!file)return;
  const H=MP.vals.height||(mpLast()||{}).height;if(!H){toast('اول قد را در سطح «پایه» وارد کنید');return;}
  MP.ph[v]={msg:'در حال بارگذاری مدل تحلیل تصویر…'};mpRender();
  try{const {im,u}=await imgLoad(file);
    const sc=Math.min(1,1280/Math.max(im.width,im.height)),cv=document.createElement('canvas');cv.width=Math.round(im.width*sc);cv.height=Math.round(im.height*sc);cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height);URL.revokeObjectURL(u);
    const tc=document.createElement('canvas');tc.height=120;tc.width=Math.round(120*cv.width/cv.height);tc.getContext('2d').drawImage(cv,0,0,tc.width,tc.height);
    const det=await mpVision();MP.ph[v]={msg:'در حال تحلیل…',thumb:tc.toDataURL('image/jpeg',.7)};mpRender();
    const r=det.detect(cv);
    const out=analyzePhoto(v,r,cv.width,cv.height,H);r.segmentationMasks&&r.segmentationMasks.forEach(mk=>mk.close&&mk.close());
    MP.ph[v]=Object.assign({thumb:MP.ph[v].thumb},out);
  }catch(e){console.error(e);MP.ph[v]={err:1,msg:'تحلیل ممکن نشد'+(MPV?'':' (مدل بارگذاری نشد)')};}
  photoCombine();mpRender();mpFit();}
/* silhouette run containing x at row y */
function runAt(mask,W,y,x){y=Math.round(y);x=Math.round(x);if(y<0||y>=mask.h)return null;const row=y*W;if(mask.d[row+x]<.5){let best=null;for(let d=1;d<W*.06;d++){if(x-d>=0&&mask.d[row+x-d]>=.5){best=x-d;break;}if(x+d<W&&mask.d[row+x+d]>=.5){best=x+d;break;}}if(best==null)return null;x=best;}
  let a=x,b=x;while(a>0&&mask.d[row+a-1]>=.5)a--;while(b<W-1&&mask.d[row+b+1]>=.5)b++;return [a,b];}
function analyzePhoto(v,r,W,Hh,heightCm){
  const L=r.landmarks&&r.landmarks[0],M=r.segmentationMasks&&r.segmentationMasks[0];
  if(!L||!M)return {err:1,msg:'بدن در عکس پیدا نشد'};
  const d=M.getAsFloat32Array(),mask={d,h:M.height},mw=M.width;if(mw!==W){/* masks match the input size */}
  const P=i=>({x:L[i].x*W,y:L[i].y*Hh,v:L[i].visibility==null?1:L[i].visibility});
  // top of head / feet from the mask; checks
  let top=-1,bot=-1;for(let y=0;y<mask.h&&top<0;y++){let c=0;for(let x=0;x<mw;x++)if(d[y*mw+x]>=.5)c++;if(c>2)top=y;}
  for(let y=mask.h-1;y>=0&&bot<0;y--){let c=0;for(let x=0;x<mw;x++)if(d[y*mw+x]>=.5)c++;if(c>2)bot=y;}
  if(top<=1||bot>=mask.h-2)return {err:1,msg:'سر یا پاها بیرون از کادر است'};
  const ph=bot-top;if(ph<Hh*.5)return {err:1,msg:'فاصله زیاد است؛ بدن باید بیش از نیمی از ارتفاع عکس باشد'};
  const sL=P(11),sR=P(12),hL=P(23),hR=P(24),key=[11,12,23,24,27,28].map(P);
  if(key.some(p=>p.v<.5))return {err:1,msg:'شانه‌ها، لگن یا مچ پاها واضح نیستند'};
  const cm=heightCm/ph;
  if(v!=='side'){const tilt=Math.abs(Math.atan2(sL.y-sR.y,sL.x-sR.x)*180/Math.PI);if(Math.min(tilt,180-tilt)>6)return {err:1,msg:'شانه‌ها کج است؛ صاف و رو به دوربین بایستید'};
    const wl=P(15),wr=P(16);const hipW=Math.abs(hL.x-hR.x);const el=P(13),er=P(14);if(Math.abs(wl.x-wr.x)<hipW*1.6||Math.abs(el.x-er.x)<Math.abs(sL.x-sR.x)*1.08)return {err:1,msg:'دست‌ها را ۳۰ درجه از بدن باز کنید'};}
  // level heights from the fitted model (fractions of stature); fallback anthropometric ratios
  const lm=MP.model&&MP.model.lm,Hm=MP.model&&MP.model.height;
  const fr=k=>lm&&Hm?lm[k]/Hm:{chest:.72,waist:.62,hip:.50}[k];
  const cx=v==='side'?((sL.x+sR.x)/2*.5+(hL.x+hR.x)/2*.5):(sL.x+sR.x+hL.x+hR.x)/4;
  const out={ok:1,msg:'تحلیل شد ✓'};
  for(const k of ['chest','waist','hip']){const y=bot-fr(k)*ph;let best=null;
    for(let dy=-2;dy<=2;dy++){const rr=runAt(mask,mw,y+dy,cx);if(rr){const w=(rr[1]-rr[0])*cm;if(best==null||w<best)best=w;}} // min of 5 rows → ignores stray arm pixels touching the torso
    if(best&&v!=='side'&&k==='chest')best=Math.min(best,Math.abs(sL.x-sR.x)*cm*1.05); // arms touching the ribcage → clip to the shoulder joints
    if(best)out[(v==='side'?'d_':'w_')+k]=best;}
  // sanity: torso can't be wider than 0.4·height or narrower than 0.1·height
  for(const k of Object.keys(out))if(/^[wd]_/.test(k)&&(out[k]>heightCm*.4||out[k]<heightCm*.08)){delete out[k];}
  return out;}
function photoCombine(){const f=MP.ph.front,s=MP.ph.side,b=MP.ph.back,res={};
  for(const k of ['chest','waist','hip']){const ws=[f,b].filter(p=>p&&p.ok&&p['w_'+k]).map(p=>p['w_'+k]);if(ws.length)res['w_'+k]=ws.reduce((a,c)=>a+c,0)/ws.length;if(s&&s.ok&&s['d_'+k])res['d_'+k]=s['d_'+k];}
  MP.ph.res=Object.keys(res).length?res:null;}

/* ---------- actions ---------- */
Object.assign(ACT,{
  mnew:openMeasPage,mpclose:closeMeasPage,mpsave:()=>mpSave(),
  mpt:a=>{MP.tier=+a.dataset.t;$$('.mp-tabs button').forEach(b=>b.classList.toggle('on',b===a));mpRender();$('#mpbody').scrollTop=0;},
  mphow:a=>{const e=a.closest('.mf');e.classList.toggle('open');mpFocus(a.dataset.k);},
  mpv:a=>{if(MP.frame&&MP.ready)MP.frame.send({t:'view',v:a.dataset.v});}
});
