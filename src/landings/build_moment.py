"""Section « C'est le bon moment » : utilisée sur l'accueil et sur la page des idées de sites."""
import os
H=os.path.dirname(os.path.abspath(__file__))
NE='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square"/></svg>'
SR='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 16l4.5 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
PH='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>'
ML='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 7l9 6 9-6" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>'
def row(cls,name,sub,rank,stars):
    st='★'*stars+'<i>'+'★'*(5-stars)+'</i>'
    return f'<div class="mrw {cls}"><span class="mrw-av"></span><span class="mrw-tx"><b>{name}</b><small>{sub}</small><em>{st}</em></span><span class="mrw-rk">{rank}</span></div>'
def build():
    pts=[('Vos clients cherchent déjà sur leur téléphone',''),('Ailleurs, la première place se paie cher',''),('Au Maroc, elle est encore libre','')]
    ol=''.join(f'<li class="rv d{i+1}"><span class="mom-n">0{i+1}</span><span><b>{t}</b></span></li>' for i,(t,d) in enumerate(pts))
    rows=row('c1','Auto-école du centre','Ouvert, ferme à 19:00','',3)+row('c2','Permis Express','Horaires non renseignés','',2)+row('c3','Auto-école de la gare','Pas de site web','',0)+row('yours','Votre auto-école','Site, photos, horaires, tarifs','1er',5)
    return f'''<section class="blk mom" id="moment"><div class="mom-card w">
<div class="mom-txt"><span class="mom-k rv"><i></i>Le bon moment</span><h2 class="rv d1">C’est maintenant, <em>pas quand tout le monde y sera.</em></h2><p class="rv d2">Vos clients vous cherchent sur leur téléphone. Soyez le premier qu’ils trouvent.</p><ol class="mom-pts">{ol}</ol>
<div class="mom-cta rv d3"><a class="mom-go" href="guide-bon-moment-maroc.html">Lire pourquoi, 5 min{NE}</a><a class="mom-gh" href="demarrer.html">Démarrer mon projet</a></div></div>
<div class="mom-vis rv d2" aria-hidden="true"><div class="mom-ph"><i class="mom-btn b1"></i><i class="mom-btn b2"></i><i class="mom-btn b3"></i><div class="mom-scr"><span class="mom-isl"></span><div class="mom-st"><b>9:41</b><span class="mom-sig"><i></i><i></i><i></i><i></i></span><span class="mom-bat"><i></i></span></div><div class="mom-g"><span class="mom-gl"><i></i><i></i><i></i><i></i></span></div><div class="mom-sb">{SR}<span class="mom-q">auto-école<i></i></span><span class="mom-mic"></span></div><div class="mom-tabs"><b>Tous</b><span>Maps</span><span>Images</span><span>Vidéos</span></div><div class="mom-list">{rows}</div><div class="mom-note"><b>Le client vous choisit</b><span>et passe à l’action</span></div><span class="mom-home"></span></div></div>
<span class="mom-pop p1">{PH}<b>Appel entrant</b><small>Futur élève</small></span><span class="mom-pop p2">{ML}<b>Nouvelle inscription</b><small>Nom, numéro, e-mail</small></span></div>
</div></section>'''
if __name__=='__main__':
    open(os.path.join(H,'moment.html'),'w').write(build()); print('moment.html écrit')
