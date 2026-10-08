#!/usr/bin/env python3
"""Builds ~/gym-app/index.html from src/ (inline CSS + JS + geometry). Run from anywhere."""
import os,re,json
R=os.path.expanduser('~/gym-app')
sh=open(f'{R}/src/shell.html').read(); css=open(f'{R}/src/app.css').read(); js=open(f'{R}/src/app.js').read()+'\n'+open(f'{R}/src/body.js').read()
# cache-busting: تصویر عوض شود → آدرس عوض می‌شود (کش مرورگر/Pages نسخهٔ قدیمی را نشان ندهد)
import hashlib as _h
_fh=lambda *ps:_h.sha1(b''.join(open(f'{R}/'+p,'rb').read() for p in ps)).hexdigest()[:8]
_iv=_fh('icons/apple-touch-icon.png','icons/icon-192.png','icons/favicon-64.png'); sh=sh.replace('href="icons/apple-touch-icon.png"',f'href="icons/apple-touch-icon.png?v={_iv}"').replace('href="icons/favicon-64.png"',f'href="icons/favicon-64.png?v={_iv}"')
# offline package: every heavy file with content hash + size; version.json is read fresh by the app
_pk={}
for _d in ['assets','play']:
    for _f in sorted(os.listdir(f'{R}/{_d}')):
        if _f.endswith(('.webp','.png','.jpg','.html')):
            _b=open(f'{R}/{_d}/{_f}','rb').read();_pk[f'{_d}/{_f}']=[_h.sha1(_b).hexdigest()[:10],len(_b)]
_code=_h.sha1((sh+css+js+json.dumps(_pk,sort_keys=True)).encode()).hexdigest()[:10]
assert js.count('/*CODEV*/')==1 and js.count('/*PKGFILES*/')==1
js=js.replace('/*CODEV*/',_code).replace('/*PKGFILES*/',json.dumps(_pk,separators=(',',':')))
json.dump({'code':_code,'files':_pk},open(f'{R}/version.json','w'),separators=(',',':'))
print('package',len(_pk),'files',round(sum(v[1] for v in _pk.values())/1048576,1),'MB · code',_code)
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
