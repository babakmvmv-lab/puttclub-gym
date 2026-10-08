#!/usr/bin/env python3
"""Builds ~/gym-app/index.html from src/ (inline CSS + JS + geometry). Run from anywhere."""
import os,re,json
R=os.path.expanduser('~/gym-app')
sh=open(f'{R}/src/shell.html').read(); css=open(f'{R}/src/app.css').read(); js=open(f'{R}/src/app.js').read()
# cache-busting: تصویر عوض شود → آدرس عوض می‌شود (کش مرورگر/Pages نسخهٔ قدیمی را نشان ندهد)
import hashlib as _h
_fh=lambda *ps:_h.sha1(b''.join(open(f'{R}/'+p,'rb').read() for p in ps)).hexdigest()[:8]
_lv=_fh('assets/login_bg.webp'); css=css.replace('url(assets/login_bg.webp)',f'url(assets/login_bg.webp?v={_lv})'); sh=sh.replace('href="assets/login_bg.webp"',f'href="assets/login_bg.webp?v={_lv}"')
_iv=_fh('icons/apple-touch-icon.png','icons/icon-192.png','icons/favicon-64.png'); sh=sh.replace('href="icons/apple-touch-icon.png"',f'href="icons/apple-touch-icon.png?v={_iv}"').replace('href="icons/favicon-64.png"',f'href="icons/favicon-64.png?v={_iv}"')
assert js.count('/*CV*/')==1; js=js.replace('/*CV*/',_fh(*[f'assets/char_{k}.webp' for k in 'mftg']))
geo=open(f'{R}/.geo.js').read()
assert js.count('/*GEO*/')==1; js=js.replace('/*GEO*/',geo)
# tab icons: reuse the IC table from app.js
for k in ['sum','train','prog','me']:
    m=re.search(r"\n %s:'(<svg.*?</svg>)'"%k,js); assert m,k
    sh=sh.replace(f'/*IC_{k}*/',m.group(1))
sh=sh.replace('/*CSS*/',css).replace('/*JS*/',js.replace('</script','<\\/script'))
open(f'{R}/index.html','w').write(sh)
print('index.html',round(len(sh.encode())/1024,1),'KB')

import hashlib
h=lambda p:hashlib.sha1(open(p,'rb').read()).hexdigest()[:10]
assets=sorted(os.path.join(dp,f) for dp,_,fs in os.walk(f'{R}/assets') for f in fs)
v=hashlib.sha1((h(f'{R}/index.html')+''.join(h(a) for a in assets)).encode()).hexdigest()[:10]
sw=open(f'{R}/src/sw.js').read().replace('/*V*/',v).replace('/*PV*/',h(f'{R}/play/bench-press.html'))
open(f'{R}/sw.js','w').write(sw); print('sw',v)
