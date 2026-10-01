"""Construit la section « Voici à quoi votre site peut ressembler » : un carrousel par domaine."""
import json, base64, os
H=os.path.dirname(os.path.abspath(__file__))
def b64(path, mime): return f'data:{mime};base64,'+base64.b64encode(open(os.path.join(H,path),'rb').read()).decode()
med=json.load(open(os.path.join(H,'medical.json')))
T=json.load(open(os.path.join(H,'..','trust_imgs.json')))
edu=[{'name':'Académie Georges Claude','kind':'École privée, El Jadida','url':'academie-georgesclaude.ma','src':T['agc'],'tag':'Client Digilago'},
     {'name':'École de musique','kind':'Conservatoire et cours','url':'ecole-de-musique.ma','video':b64('ecole-musique.mp4','video/mp4'),'webm':b64('ecole-musique.webm','video/webm'),'poster':b64('ecole-musique-poster.webp','image/webp'),'tag':'Modèle'},
     {'name':'Groupe scolaire Ange Bleu','kind':'École, El Jadida','url':'angebleu.ma','src':T['angebleu'],'tag':'Client Digilago'},
     {'name':'École internationale','kind':'Établissement scolaire','url':'ecole-internationale.ma','src':b64('ecole-internationale.webp','image/webp'),'tag':'Modèle'},
     {'name':'Les Marronniers','kind':'Crèche et école, El Jadida','url':'lesmarronniers.ma','src':b64('les-marronniers.webp','image/webp'),'tag':'Client Digilago'},
     {'name':'Jardin Ange Bleu','kind':'Crèche et maternelle, El Jadida','url':'jardin-angebleu.ma','src':b64('jardin-ange-bleu.webp','image/webp'),'tag':'Client Digilago'}]
LOCK='<svg viewBox="0 0 12 12" aria-hidden="true"><rect x="2.5" y="5.2" width="7" height="5.3" rx="1.2" fill="currentColor"/><path d="M4 5.2V3.8a2 2 0 014 0v1.4" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>'
SCROLL='<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="5" y="2" width="6" height="10" rx="3" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M8 4.5v2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M5.5 13.5L8 15l2.5-1.5" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>'
PLAY='<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.3" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M6.6 5.4l4 2.6-4 2.6z" fill="currentColor"/></svg>'
PAUSE='<svg viewBox="0 0 16 16" aria-hidden="true" class="i-pause"><rect x="4" y="3" width="3" height="10" rx="1" fill="currentColor"/><rect x="9" y="3" width="3" height="10" rx="1" fill="currentColor"/></svg><svg viewBox="0 0 16 16" aria-hidden="true" class="i-play"><path d="M5 3l8 5-8 5z" fill="currentColor"/></svg>'
def card(d,i):
    if 'video' in d:
        view=f'<div class="lp-view"><video poster="{d["poster"]}" muted loop playsinline preload="metadata" aria-label="Vidéo de démonstration : {d["name"]}"><source src="{d["webm"]}" type="video/webm"><source src="{d["video"]}" type="video/mp4"></video></div>'
        hint=f'<span class="lp-hint vid">{PLAY}<em>Aperçu vidéo</em></span>'; cls='lp wide lpv'
    else:
        view=f'<div class="lp-view"><img src="{d["src"]}" alt="Aperçu du site : {d["name"]}" loading="{"eager" if i==0 else "lazy"}" decoding="async" draggable="false"></div>'
        hint=f'<span class="lp-hint">{SCROLL}<em>Parcourir la page</em></span>'; cls='lp'
    return f'<figure class="{cls}" tabindex="0"><div class="lp-win"><div class="lp-bar"><i></i><i></i><i></i><span>{LOCK}{d["url"]}</span></div>{view}{hint}</div><figcaption><b>{d["name"]}</b><small>{d["kind"]}</small><i>{d.get("tag","Modèle")}</i></figcaption></figure>'
def cat(n,title,em,items,count_label,cid):
    return f'<div class="scat" data-cat="{cid}"><div class="sc-head"><div class="sc-t"><span class="sc-n">{n}</span><h3>{title} <em>{em}</em></h3></div><div class="sc-meta"><span>{count_label}</span><button type="button" class="sc-play" aria-label="Mettre en pause le défilement" aria-pressed="false">{PAUSE}</button></div></div><div class="sc-wrap"><div class="sc-row">{"".join(card(d,i) for i,d in enumerate(items))}</div></div></div>'
soon=''.join(f'<span>{x}</span>' for x in ['Restauration','Hôtellerie','Commerce','Immobilier','Sport et loisirs','Beauté et bien-être','Industrie','Juridique'])
def build():
    return f'''<section class="sec show" id="showcase" aria-labelledby="t-show"><div class="sh"><span class="pill rv"><span class="ic"></span>Nos modèles</span><h2 id="t-show" class="rv d1"><span class="l"><span class="li">Voici à quoi</span></span><span class="l"><span class="li grad">votre site peut ressembler.</span></span></h2><p class="rv d2">Des sites pensés pour chaque métier. Survolez une page, ou touchez-la sur téléphone, pour la parcourir de haut en bas.</p></div>
{cat('01','Santé et médical','des sites qui rassurent vos patients.',med,f'{len(med)} modèles','medical')}
{cat('02','Éducation','des écoles qui donnent envie d’inscrire.',edu,f'{len(edu)} sites','education')}
<div class="sc-soon rv"><b>Bientôt ici</b>{soon}</div></section>'''
if __name__=='__main__':
    open(os.path.join(H,'showcase.html'),'w').write(build()); print('showcase.html écrit')
