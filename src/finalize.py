import re, os, hashlib, base64, io, sys
from PIL import Image
import tinycss2, rcssmin, rjsmin
SRC=os.environ.get('DEV_DIR','../dev')
OUT=os.environ.get('SITE_DIR','../site')
os.makedirs(OUT+'/assets',exist_ok=True)
pages=[f for f in os.listdir(SRC) if f.endswith('.html')]
def extract_images(html):
    def rep(m):
        b64=m.group(2); raw=base64.b64decode(b64); hsh=hashlib.md5(raw).hexdigest()[:10]
        path=f'assets/{hsh}.webp'
        if not os.path.exists(f'{OUT}/{path}'):
            im=Image.open(io.BytesIO(raw)).convert('RGB'); im.thumbnail((1280,1280)); im.save(f'{OUT}/{path}','WEBP',quality=78,method=6)
        return m.group(1)+path+m.group(3)
    html=re.sub(r'(src=")data:image/(?:jpeg|jpg|png);base64,([A-Za-z0-9+/=]+)(")',rep,html)
    def repw(m):
        b64=m.group(2); raw=base64.b64decode(b64); hsh=hashlib.md5(raw).hexdigest()[:10]; path=f'assets/{hsh}.webp'
        if not os.path.exists(f'{OUT}/{path}'): open(f'{OUT}/{path}','wb').write(raw)
        return m.group(1)+path+m.group(3)
    html=re.sub(r'(src="|poster="|url\(")data:image/webp;base64,([A-Za-z0-9+/=]+)("\)|")',repw,html)
    def repv(m):
        raw=base64.b64decode(m.group(2)); hsh=hashlib.md5(raw).hexdigest()[:10]; path=f'assets/{hsh}.mp4'
        if not os.path.exists(f'{OUT}/{path}'): open(f'{OUT}/{path}','wb').write(raw)
        return m.group(1)+path+m.group(3)
    def repm(m):
        raw=base64.b64decode(m.group(3)); ext='webm' if m.group(2)=='webm' else 'mp4'; hsh=hashlib.md5(raw).hexdigest()[:10]; path=f'assets/{hsh}.{ext}'
        if not os.path.exists(f'{OUT}/{path}'): open(f'{OUT}/{path}','wb').write(raw)
        return m.group(1)+path+m.group(4)
    return re.sub(r'(src=")data:video/(mp4|webm);base64,([A-Za-z0-9+/=]+)(")',repm,html)
def used_tokens(html_wo_style):
    classes=set()
    for m in re.finditer(r'class="([^"]*)"',html_wo_style):
        classes.update(m.group(1).split())
    ids=set(re.findall(r'\sid="([^"]+)"',html_wo_style))
    # noms présents dans les scripts (classes ajoutées dynamiquement)
    scripts=' '.join(re.findall(r'<script[^>]*>(.*?)</script>',html_wo_style,flags=re.S))
    words=set(re.findall(r'[A-Za-z_][A-Za-z0-9_-]*',scripts))
    return classes,ids,words
def prune_css(css,classes,ids,words):
    rules=tinycss2.parse_stylesheet(css,skip_whitespace=True,skip_comments=True)
    out=[]
    def keep_selector(sel):
        for c in re.findall(r'\.(-?[A-Za-z_][A-Za-z0-9_-]*)',sel):
            if c not in classes and c not in words: return False
        for i in re.findall(r'#(-?[A-Za-z_][A-Za-z0-9_-]*)',sel):
            if i not in ids and i not in words: return False
        return True
    def handle(rules):
        res=[]
        for r in rules:
            if r.type=='qualified-rule':
                sel=tinycss2.serialize(r.prelude)
                parts=[p.strip() for p in re.split(r',(?![^(]*\))',sel)]
                kept=[p for p in parts if keep_selector(p)]
                if kept: res.append(','.join(kept)+'{'+tinycss2.serialize(r.content)+'}')
            elif r.type=='at-rule':
                name=r.lower_at_keyword
                if r.content is None: res.append('@'+name+' '+tinycss2.serialize(r.prelude)+';')
                elif name in ('media','supports'):
                    inner=handle(tinycss2.parse_rule_list(r.content,skip_whitespace=True,skip_comments=True))
                    if inner: res.append('@'+name+' '+tinycss2.serialize(r.prelude).strip()+'{'+''.join(inner)+'}')
                else: res.append('@'+name+' '+tinycss2.serialize(r.prelude).strip()+'{'+tinycss2.serialize(r.content)+'}')
        return res
    return ''.join(handle(rules))
def shrink_paths(html):
    # les tracés de la carte du monde : une décimale suffit
    def rep(m):
        d=re.sub(r'(\d+\.\d\d+)',lambda x:f'{float(x.group(1)):.1f}',m.group(2))
        return m.group(1)+d+m.group(3)
    return re.sub(r'(<path id="(?:landPath|bordPath|maPath)" d=")([^"]+)(")',rep,html)
report=[]
for p in pages:
    html=open(f'{SRC}/{p}').read()
    n0=len(html)
    html=extract_images(html)
    html=shrink_paths(html)
    # CSS
    m=re.search(r'<style>(.*?)</style>',html,flags=re.S)
    css=m.group(1)
    body=html[:m.start()]+html[m.end():]
    classes,ids,words=used_tokens(body)
    css2=prune_css(css,classes,ids,words)
    css2=rcssmin.cssmin(css2)
    html=html[:m.start()]+'<style>'+css2+'</style>'+html[m.end():]
    # JS
    def jsrep(mm): return '<script>'+rjsmin.jsmin(mm.group(1))+'</script>'
    html=re.sub(r'<script>(.*?)</script>',jsrep,html,flags=re.S)
    html=re.sub(r'\n\s*\n','\n',html)
    open(f'{OUT}/{p}','w').write(html)
    report.append((p,n0//1024,len(html)//1024,len(css)//1024,len(css2)//1024))
for r in report: print('%-24s %5d KB -> %5d KB   css %4d -> %4d KB'%r)
print('assets:',len(os.listdir(OUT+'/assets')),'files', sum(os.path.getsize(f'{OUT}/assets/{f}') for f in os.listdir(OUT+'/assets'))//1024,'KB')
