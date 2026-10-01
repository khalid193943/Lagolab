import re, json, os
from recolor import recolor
from radius import soften
from skygen import sky, dayclouds
import start_page
from anicons import AI, NAME2K, CSS as ICSS
HEAD=open('head.html').read()
BODY=open('body.html').read()
CSSP=start_page.CSS+open('css_pages.txt').read()+'\n'+open('css_anim.txt').read()+ICSS+open('css_big.txt').read()+open('css_clip.txt').read()+open('css_nowhite.txt').read()+open('css_clouds.txt').read()+open('css_seams.txt').read()+open('css_guides.txt').read()+open('css_inner2.txt').read()+open('css_final.txt').read()+open('css_show.txt').read()+open('css_styles.txt').read()+open('css_tech.txt').read()+open('css_moment.txt').read()+open('css_menu.txt').read()+'''
.art{font-size:calc(18 * var(--u));line-height:1.75;color:#24375C}
.art h2{margin:calc(56 * var(--u)) 0 calc(16 * var(--u));font-family:Sora,sans-serif;font-weight:500;font-size:calc(34 * var(--u));line-height:1.15;letter-spacing:-.035em;color:#0E214E}
.art h2:first-child{margin-top:0}
.art p{margin:0 0 calc(16 * var(--u))}
.art ul{list-style:none;margin:0 0 calc(18 * var(--u));padding:0;display:flex;flex-direction:column;gap:calc(12 * var(--u))}
.art li{position:relative;padding:calc(16 * var(--u)) calc(20 * var(--u)) calc(16 * var(--u)) calc(52 * var(--u));border-radius:calc(14 * var(--u));background:rgba(47,132,236,.06)}
.art li::before{content:"";position:absolute;left:calc(20 * var(--u));top:calc(24 * var(--u));width:calc(14 * var(--u));height:calc(14 * var(--u));border-radius:50%;background:#1F57C7;box-shadow:0 0 0 calc(5 * var(--u)) rgba(31,87,199,.14)}
.art .art-note{padding:calc(18 * var(--u)) calc(22 * var(--u));border-radius:calc(14 * var(--u));background:#0E214E;color:#DCE8FF;font-size:calc(16.5 * var(--u))}
.gd-grid.one{grid-template-columns:1fr;width:calc(640 * var(--u))}
[data-mode="M"] .art{font-size:calc(16 * var(--u))}
[data-mode="M"] .art h2{font-size:calc(25 * var(--u))}

.legal h3{margin:calc(34 * var(--u)) 0 calc(8 * var(--u));font-family:Sora,sans-serif;font-weight:500;font-size:calc(26 * var(--u));letter-spacing:-.03em}
.legal p{margin:0;font-size:calc(16.5 * var(--u));line-height:1.7;color:#3A4E72}
.legal em{font-style:normal;color:#B8436B}

#daybg.pgsky{position:fixed;inset:0;z-index:0;pointer-events:none;background:#EAF3FE}
.pg{background:transparent!important}
.pg > section:not(.dk):not(.phero),.pg > .sband{background:transparent!important}

/* ================= Le mur suspendu ================= */
.hang{position:relative;padding:0 calc(24 * var(--u)) calc(130 * var(--u));overflow:hidden}
.hang-cols{position:relative;height:calc(560 * var(--u));display:flex;justify-content:center;gap:calc(16 * var(--u));-webkit-mask-image:linear-gradient(180deg,#000 42%,rgba(0,0,0,.2) 68%,transparent 84%);mask-image:linear-gradient(180deg,#000 42%,rgba(0,0,0,.2) 68%,transparent 84%)}
.hcol{flex:none;width:calc(132 * var(--u));will-change:transform}
.hin{display:flex;flex-direction:column;gap:calc(16 * var(--u));transform:translateY(-120%);transition:transform 1.6s cubic-bezier(.16,1,.3,1);transition-delay:var(--d)}
.hang.in .hin{transform:none}
.ht{position:relative;width:100%;aspect-ratio:4/5;border-radius:calc(14 * var(--u));overflow:hidden;background:#fff;box-shadow:0 0 0 1px rgba(7,32,33,.06),0 calc(24 * var(--u)) calc(40 * var(--u)) calc(-24 * var(--u)) rgba(7,32,33,.45);transition:transform .5s cubic-bezier(.16,1,.3,1),box-shadow .5s}
.ht.ghost{background:linear-gradient(180deg,rgba(255,255,255,.95),rgba(255,255,255,.35));box-shadow:0 0 0 1px rgba(7,32,33,.035)}
.ht img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:top;transition:transform 1.2s cubic-bezier(.16,1,.3,1)}
.ht:not(.ghost):hover{box-shadow:0 0 0 1.5px #64F662,0 calc(40 * var(--u)) calc(70 * var(--u)) calc(-24 * var(--u)) rgba(7,32,33,.55);z-index:3}
.ht:not(.ghost):hover img{transform:scale(1.08)}
.ht.mt{background:var(--bg)}
.ht.mt .mc-art{position:absolute;inset:calc(8 * var(--u));margin:0;border-radius:calc(10 * var(--u))}
.ht .lb{position:absolute;left:calc(8 * var(--u));bottom:calc(8 * var(--u));z-index:2;padding:calc(4 * var(--u)) calc(9 * var(--u));border-radius:999px;background:rgba(255,255,255,.94);color:#072021;font-size:calc(10.5 * var(--u));font-weight:500;white-space:nowrap;box-shadow:0 calc(6 * var(--u)) calc(14 * var(--u)) calc(-6 * var(--u)) rgba(0,0,0,.35);opacity:0;transform:translateY(6px);transition:opacity .35s,transform .45s cubic-bezier(.16,1,.3,1)}
.ht:hover .lb{opacity:1;transform:none}
.hang-sh{position:relative;z-index:2;margin-top:calc(-110 * var(--u))}
.hang-cta{display:inline-flex;align-items:center;gap:calc(10 * var(--u));height:calc(52 * var(--u));padding:0 calc(24 * var(--u));border-radius:999px;background:#072021;color:#fff;font-size:calc(14.5 * var(--u));font-weight:500;margin-top:calc(8 * var(--u));transition:background .3s}
.hang-cta:hover{background:#1FA34A}
.hang-cta svg{width:calc(14 * var(--u))}
[data-mode="M"] .hcol:nth-child(n+6){display:none}
[data-mode="M"] .hcol{width:calc(66 * var(--u))}
[data-mode="M"] .hang-cols{gap:calc(8 * var(--u));height:calc(340 * var(--u))}
[data-mode="M"] .hin{gap:calc(8 * var(--u))}
[data-mode="M"] .hang-sh{margin-top:calc(-50 * var(--u))}
[data-mode="M"] .ht .lb{display:none}


.sv{grid-template-columns:calc(96 * var(--u)) 1fr!important}
.sv-i{width:calc(96 * var(--u))!important;height:calc(96 * var(--u))!important}
.sv-i .ai{width:calc(54 * var(--u))!important;height:calc(54 * var(--u))!important}
.chan .ci{width:calc(76 * var(--u))!important;height:calc(76 * var(--u))!important}
.chan .ci .ai{width:calc(40 * var(--u));height:calc(40 * var(--u))}
.chan a:not(.main) .ci{background:radial-gradient(circle at 30% 20%,#1E4A3E,#072021 70%)!important;color:#64F662!important}
[data-mode="M"] .sv-i{width:calc(72 * var(--u))!important;height:calc(72 * var(--u))!important}
'''
T=json.load(open('trust_imgs.json'))
def grab(start, end):
    a=BODY.index(start); z=BODY.index(end,a)+len(end); return BODY[a:z]
FOOT=grab('<footer class="foot" id="foot">','</footer>')
SHEET=grab('<div class="sheet fsm" id="sheet"','El Jadida, pour tout le Maroc</span></p></div></div>')
FNAV=grab('<nav class="fnav" id="fnav"','</nav>')
DOCK=''
GRAIN='<div class="grain" aria-hidden="true"></div><div class="cur" id="cur" aria-hidden="true"><i></i></div>'
ARW='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square"/></svg>'
ARWD='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="#04140F" stroke-width="1.5" stroke-linecap="square"/></svg>'
def I(d): return f'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="{d}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
IC={'globe':'M12 21a9 9 0 100-18 9 9 0 000 18zM3 12h18M12 3c2.5 2.5 3.8 5.6 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.6-3.8-9S9.5 5.5 12 3z','cart':'M3 4h2l2.2 10.2a1.5 1.5 0 001.5 1.2h8.6a1.5 1.5 0 001.5-1.1L21 8H6.2M9 20h.01M17 20h.01','phone':'M8 3h8a1 1 0 011 1v16a1 1 0 01-1 1H8a1 1 0 01-1-1V4a1 1 0 011-1zM11 18h2','pen':'M15 5l4 4M4 20l1-4L16 5l3 3L8 19l-4 1zM13 7l4 4','pin':'M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.8 12 21 12 21zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z','search':'M11 18a7 7 0 100-14 7 7 0 000 14zM20 20l-4-4','bot':'M12 4v3M7 7h10a2 2 0 012 2v7a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2zM9.5 12h.01M14.5 12h.01M9 15.5h6','mega':'M4 10v4a1 1 0 001 1h2l5 4V5L7 9H5a1 1 0 00-1 1zM16 9a4 4 0 010 6','puzzle':'M10 4a2 2 0 114 0v2h3a1 1 0 011 1v3h-2a2 2 0 100 4h2v3a1 1 0 01-1 1h-3v-2a2 2 0 10-4 0v2H7a1 1 0 01-1-1v-3h2a2 2 0 100-4H6V7a1 1 0 011-1h3V4z','server':'M5 4h14a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1zM5 14h14a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4a1 1 0 011-1zM8 7h.01M8 17h.01','chat':'M20 12a8 8 0 01-11.6 7.1L4 20l1-4.2A8 8 0 1120 12zM9 11h.01M12 11h.01M15 11h.01','bolt':'M13 3L5 14h6l-1 7 8-11h-6l1-7z','call':'M5 4h3l1.5 4.5-2 1.2a11 11 0 005.8 5.8l1.2-2L19 15v3a2 2 0 01-2.2 2A15 15 0 013 6.2 2 2 0 015 4z','mail':'M4 6h16v12H4zM4 7l8 6 8-6'}
def sh(label,l1,l2,txt,dark=False):
    return f'<div class="sh{" dark" if dark else ""}"><span class="pill rv"><span class="ic"></span>{label}</span><h2 class="rv d1"><span class="l"><span class="li">{l1}</span></span><span class="l"><span class="li grad">{l2}</span></span></h2>{f"<p class=\"rv d2\">{txt}</p>" if txt else ""}</div>'
def phero(eyebrow,l1,l2,lead,extra='',cta='Démarrer mon projet',href='demarrer.html'):
    return f'''<header class="phero">{sky('page')}<div class="skyfade" aria-hidden="true"></div><p class="eyebrow in"><i class="live" aria-hidden="true"></i><span>{eyebrow}</span></p><h1 class="hin"><span class="l"><span class="lx">{l1}</span></span><span class="l"><span class="grad">{l2}</span></span></h1><p class="lead in2 hin">{lead}</p><div class="hcta in2"><a href="{href}" class="cta mono"><span class="arw">{ARWD}</span><span class="lbl">{cta}</span></a><a href="https://wa.me/212649953813" class="ghost" target="_blank" rel="noopener noreferrer">Écrire sur WhatsApp{ARW}</a></div>{extra}</header>'''
def sband(words):
    r1=''.join(f'<span class="{"it" if i%2 else ""}">{w}</span><span class="s">✦</span>' for i,w in enumerate(words))
    r2=''.join(f'<span class="o">{w}</span><span class="s">✦</span>' for w in reversed(words))
    return f'<div class="sband" aria-hidden="true"><div class="row" data-d="-1">{r1*3}</div><div class="row" data-d="1">{r2*3}</div></div>'
def cband(l1,em,btn='Démarrer mon projet',href='demarrer.html'):
    return f'<section class="blk"><div class="cband rv"><h3>{l1}<br><em>{em}</em></h3><a href="{href}">{btn}{ARW}</a></div></section>'
def faq(items): return '<div class="faq w nar mt">'+''.join(f'<details class="rv"><summary>{q}<i aria-hidden="true"></i></summary><p>{a}</p></details>' for q,a in items)+'</div>'
FAQ=[('Combien coûte un projet avec Digilago ?','Le prix dépend de ce dont vous avez besoin : une présence en ligne complète (site, fiche Google, référencement) reste volontairement accessible, puis le budget évolue avec la complexité (réservation, boutique, application, plateforme). Il est toujours annoncé par écrit avant de commencer.'),
('Que se passe-t-il après mon premier message ?','Nous vous rappelons le jour même pour un échange de dix minutes. Sous 72 heures, vous recevez le lien de votre première version. Vous nous faites vos retours, nous ajustons, puis nous mettons en ligne, créons votre fiche Google et vous formons en trente minutes.'),
('Et si le résultat ne me plaît pas ?','Vous ne payez rien. Nous réalisons d’abord une première version de votre site, et vous ne vous engagez que si elle vous convainc.'),
('Qu’est-ce que la visibilité dans les IA (GEO) ?','Le Generative Engine Optimization consiste à faire connaître votre entreprise aux assistants comme ChatGPT, Gemini ou Perplexity, afin qu’ils la recommandent lorsqu’on leur demande « un bon dentiste à Rabat » ou « un club de padel ouvert ce soir ».'),
('Travaillez-vous en dehors d’El Jadida ?','Oui. Notre équipe est basée à El Jadida et accompagne des entreprises dans tout le Maroc, ainsi que des clients à l’étranger. Tout se fait à distance, avec des rendez-vous sur place quand c’est utile.'),
('Le site sera-t-il disponible en arabe ?','Oui. La version arabe est incluse dans la présence en ligne complète. L’anglais est proposé pour le tourisme et les clientèles internationales.'),
('Qui s’occupe du site après le lancement ?','Nous. Hébergement, sécurité, sauvegardes et mises à jour sont pris en charge. Vous gardez la main sur vos contenus depuis un espace simple, et notre équipe reste joignable sur WhatsApp.')]
STEPS=[('01','Vous nous donnez un nom','Le nom de votre entreprise et votre ville. C’est tout ce qu’il faut pour commencer.'),('02','Première version en 72 h','Un vrai site, avec vos informations, vos couleurs et vos textes.'),('03','Vous validez, on affine','Vous ne payez que si elle vous plaît. Trois séries de retouches incluses.'),('04','En ligne, et trouvé','Site, fiche Google, SEO et IA : vous apparaissez là où l’on vous cherche.')]
def steps(): return '<div class="st4 w mt">'+''.join(f'<div class="rv"><b>{n}</b><h5>{t}</h5><p>{d}</p></div>' for n,t,d in STEPS)+'</div>'

# ------------------------------------------------------------ TECHNIQUE : standards et outils
TSPEC=[('Performance','perf',['Core Web Vitals au vert','Affichage en moins de 2,5 s','Images WebP et AVIF','Chargement différé','CDN mondial']),
('Référencement et IA','seo',['Balisage Schema.org (JSON-LD)','hreflang ar, fr, en','sitemap.xml et robots.txt','Fichier llms.txt pour les IA','Suivi Google Search Console']),
('Sécurité et fiabilité','sec',['HTTPS (TLS) sur tout le site','Sauvegardes automatiques','Mises à jour de sécurité','Surveillance de disponibilité','Accessibilité WCAG 2.1'])]
TIC={'perf':'<path d="M4 16a8 8 0 1116 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M12 16l4-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="16" r="1.6" fill="currentColor"/>',
'seo':'<circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M15.5 15.5L20 20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M8.5 11l1.8 1.8 3.2-3.6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
'sec':'<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 12l2 2 4-4.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'}
TOOLS=[('React','Interfaces','Re','#1F57C7'),('Next.js','Sites rapides','N','#0E214E'),('TypeScript','Code fiable','TS','#2F6BFF'),('Tailwind CSS','Design system','Tw','#0EA5E9'),('Node.js','Serveur','No','#15803D'),('PostgreSQL','Données','Pg','#1E40AF'),
('Supabase','Back-end','Sb','#16A34A'),('Vercel','Hébergement','V','#0E214E'),('Cloudflare','CDN et sécurité','Cf','#EA7A1A'),('Expo','Applications mobiles','Ex','#334155'),('WhatsApp API','Messagerie','Wa','#15803D'),('CMI','Paiement en ligne','CMI','#A16207'),
('Google Business','Fiche Google','GB','#2F6BFF'),('Search Console','Référencement','SC','#1F57C7'),('Google Analytics 4','Mesure','GA4','#EA7A1A'),('Schema.org','Données structurées','{}','#7C3AED'),('Claude et Gemini','Intelligence artificielle','IA','#BE185D'),('Playwright','Tests automatiques','Pw','#475569')]
def tech_block(title1,title2,lead,with_specs=True):
    import math
    rings=[(TOOLS[0:5],150,70),(TOOLS[5:11],225,95),(TOOLS[11:18],300,130)]
    orb=''
    for ri,(items,r,dur) in enumerate(rings):
        chips=''
        for i,(n,d,m,c) in enumerate(items):
            a=360*i/len(items)+ri*18
            delay=-(a/360.0)*dur
            chips+=f'<span class="oc" style="--r:calc({r} * var(--u));animation-delay:{delay:.2f}s"><span class="ocx"><em class="oci" style="--c:{c}">{m}</em><b>{n}</b></span></span>'
        orb+=f'<div class="orb-r r{ri}" style="--d:{dur}s;width:calc({2*r} * var(--u));height:calc({2*r} * var(--u))"><div class="orb-c">{chips}</div></div>'
    core='<div class="orb-core"><svg viewBox="14 8 38 48" aria-hidden="true"><rect x="16" y="10" width="8" height="44" rx="1.5" fill="#fff"/><path d="M28 10 A22 22 0 0 1 28 54 Z" fill="#fff"/></svg><span>Digilago</span></div>'
    term_lines=['<b class="tc">$</b> digilago deploy <em>--site</em> votre-marque.ma','<span class="tk">✓</span> Design adapté à votre identité : logo, couleurs, typographie','<span class="tk">✓</span> Trois langues : français, anglais, arabe (hreflang)','<span class="tk">✓</span> Images converties en WebP et AVIF','<span class="tk">✓</span> Données structurées Schema.org ajoutées','<span class="tk">✓</span> Fichier llms.txt prêt pour les assistants IA','<span class="tk">✓</span> Tests automatiques réussis','<span class="tk">✓</span> En ligne sur le CDN, HTTPS actif','<b class="go">→</b> votre-marque.ma est en ligne.']
    term='<div class="term"><div class="term-bar"><i></i><i></i><i></i><span>build, votre-marque.ma</span></div><div class="term-body">'+''.join(f'<p style="--k:{k}">{l}</p>' for k,l in enumerate(term_lines))+'<p class="cur"><b class="tc">$</b> <span></span></p></div></div>'
    dials=''.join(f'<div class="dial"><span class="dl-w"><svg viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="19" class="dl-bg"/><circle cx="22" cy="22" r="19" class="dl-fg"/></svg><b>100</b></span><small>{t}</small></div>' for t in ['Performance','Accessibilité','Bonnes pratiques','Référencement'])
    specs=''.join(f'<div class="tsp2 rv"><span class="tsp-ic"><svg viewBox="0 0 24 24" aria-hidden="true">{TIC[k]}</svg></span><b>{t}</b><ul>{"".join(f"<li>{x}</li>" for x in items)}</ul></div>' for t,k,items in TSPEC) if with_specs else ''
    return (f'<section class="blk dk tech tech2">{sh("Sous le capot",title1,title2,lead,True)}'
            f'<div class="tx-grid"><div class="orb rv" aria-label="Nos technologies">{orb}{core}<div class="orb-glow"></div></div>'
            f'<div class="tx-side rv d1">{term}<div class="dials"><div class="dials-h"><span>Objectif à chaque livraison</span><em>Google Lighthouse</em></div><div class="dials-row">{dials}</div></div></div></div>'
            + (f'<div class="tsp2-grid">{specs}</div>' if specs else '')
            + '<p class="tech-note rv">Les noms cités sont des marques de leurs propriétaires respectifs.</p></section>')

# ------------------------------------------------------------ SERVICES
PIL=[('concevoir','01','Concevoir','<em>sur mesure.</em>','Des sites et des outils dessinés pour votre métier, puis codés à la main. Rapides, beaux sur téléphone, faits pour convertir.',[
 ('globe','Sites web sur mesure','Code écrit à la main, rapide, beau sur téléphone. Aucun modèle générique.',['Design unique','Trois langues','Formulaires et WhatsApp','Pages optimisées pour Google'],'Entreprises, cabinets, écoles, hôtels'),
 ('cart','Boutiques en ligne','Un catalogue clair et un parcours d’achat simple, pensés pour le Maroc.',['Catalogue et panier','Paiement à la livraison','Suivi des commandes','Gestion des stocks'],'Commerces, artisans, marques'),
 ('phone','Applications mobiles','Réservations, fidélité, commandes : votre service dans la poche du client.',['iOS et Android','Notifications','Espace client','Publication sur les stores'],'Salles de sport, restaurants, réseaux'),
 ('pen','Branding et logo','Une identité nette, reconnaissable, cohérente partout.',['Logo et déclinaisons','Couleurs et typographies','Charte simple','Supports réseaux sociaux'],'Nouvelles marques, rebranding')]),
('trouver','02','Faire trouver','<em>partout.</em>','Là où vos clients cherchent vraiment : Google, la carte, les réseaux et les assistants IA.',[
 ('pin','Fiche Google Business','Vous apparaissez sur la carte, avec vos horaires, vos photos et vos avis.',['Création ou reprise','Photos et catégories','Réponses aux avis','Publications régulières'],'Toute entreprise qui reçoit des clients'),
 ('search','Référencement SEO','En tête des recherches de votre ville et de votre métier, durablement.',['Audit et mots-clés','Pages locales','Contenus optimisés','Suivi des positions'],'Entreprises qui veulent durer sur Google'),
 ('bot','Visibilité dans les IA','ChatGPT, Gemini et Perplexity vous citent quand on leur demande conseil.',['Données structurées','Présence cohérente','Pages de réponses','Suivi des citations'],'Métiers où l’on demande un conseil'),
 ('mega','Publicité en ligne','Google et Meta, ciblées sur votre quartier et votre clientèle.',['Campagnes locales','Visuels et textes','Budget maîtrisé','Rapport mensuel'],'Lancements, offres, saisons')]),
('tourner','03','Faire tourner','<em>sans effort.</em>','Votre activité tourne, même quand vous dormez. Nous restons à vos côtés après le lancement.',[
 ('puzzle','Extensions et intégrations','Réservation, WhatsApp, paiement, agenda, tableaux de bord.',['Prise de rendez-vous','Paiement en ligne','Agenda partagé','Connexions à vos outils'],'Cliniques, salons, clubs, services'),
 ('chat','WhatsApp automatisé','Réponses, relances et devis envoyés sans y penser.',['Messages d’accueil','Relances automatiques','Devis par WhatsApp','Boîte partagée'],'Entreprises qui reçoivent beaucoup de messages'),
 ('server','Hébergement et maintenance','Rapide, sécurisé, sauvegardé. Tout est surveillé pour vous.',['Hébergement rapide','Certificat de sécurité','Sauvegardes','Mises à jour'],'Tous nos clients'),
 ('bolt','Support le jour même','Une équipe à El Jadida, joignable, qui répond vite.',['WhatsApp direct','Modifications rapides','Suivi mensuel','Conseils'],'Tous nos clients')])]
pil_html=''
for pid,n,t,em,d,svs in PIL:
    cards=''.join(f'<article class="sv rv"><span class="sv-i icotile">{AI(NAME2K[nm])}</span><div><h4>{nm}</h4><p>{ds}</p><ul>{"".join(f"<li>{x}</li>" for x in inc)}</ul><span class="for">Idéal pour : <b>{fo}</b></span></div></article>' for k,nm,ds,inc,fo in svs)
    pil_html+=f'<section class="blk" id="{pid}"><div class="pil w"><div class="pil-l rv"><span class="pil-big" aria-hidden="true">{n}</span><span class="pil-n">{n} / 03</span><h3>{t}<br>{em}</h3><p>{d}</p></div><div class="pil-r">{cards}</div></div></section>'
INCL=['Les textes en trois langues','Les photos et visuels','La fiche Google','Le référencement','La visibilité dans les IA','L’hébergement','Les sauvegardes','Les mises à jour','Le suivi mensuel','Le certificat de sécurité','La formation de 30 minutes','Un contact WhatsApp direct']
services_main=phero('Services','Tout ce qu’il faut','pour être trouvé, et choisi.','Sites, Google, IA, applications, automatisations : une seule équipe, un seul interlocuteur, un prix écrit avant de commencer.',
 '<nav class="anchors in2" aria-label="Sur cette page"><a href="#concevoir"><span>01</span>Concevoir</a><a href="#trouver"><span>02</span>Faire trouver</a><a href="#tourner"><span>03</span>Faire tourner</a><a href="#methode"><span>04</span>Méthode</a><a href="#faq"><span>05</span>Questions</a></nav>')
services_main+=sband(['Concevoir','Faire trouver','Faire tourner','Sites web','Google','Intelligence artificielle'])+pil_html
services_main+=tech_block('Nos standards techniques,','sur chaque projet.','Ce que vous ne voyez pas, mais que Google, les IA et vos clients ressentent : vitesse, sécurité et structure.')
services_main+=f'<section class="blk dk">{sh("Inclus","Dans chaque projet,","tout est compris.","Pas d’options cachées : voici ce que comprend une présence en ligne complète.",True)}<div class="incl w mt">{"".join(f"<div class=\"rv\">{x}</div>" for x in INCL)}</div></section>'
services_main+=f'<section class="blk" id="methode">{sh("Méthode","Du premier message","à vos premiers clients.","Quatre étapes, sans réunion interminable ni jargon.")}{steps()}</section>'
services_main+=f'<section class="blk">{sh("Tarifs","Un prix clair,","écrit avant de commencer.","Chaque projet est différent : le prix est annoncé par écrit avant le moindre engagement.")}<div class="eng w mt"><div class="rv"><b>Écrit</b><h5>Un prix annoncé d’avance</h5><p>Vous savez exactement ce que vous payez, et pour quoi, avant de commencer.</p></div><div class="rv d1"><b>0 MAD</b><h5>Si le résultat ne vous plaît pas</h5><p>Vous découvrez une première version avant tout engagement.</p></div><div class="rv d2"><b>Aucun</b><h5>Frais caché</h5><p>Hébergement, sécurité et suivi sont clairement détaillés.</p></div></div></section>'
services_main+=f'<section class="blk" id="faq">{sh("Questions","Vous vous demandez","sûrement ceci.","")}{faq(FAQ)}</section>'
services_main+=cband('Un projet en tête ?','Parlons-en aujourd’hui.')


# ------------------------------------------------------------ Mur suspendu (inspiration « Trusted by »)
MCP={'clinic':('#F4FAFB','#0E2E36','#1F8A9A','#CDEFF3','rings'),'riad':('#F6EEE4','#3A2418','#B5562F','#E9C9A5','arches'),'factory':('#15181B','#F2F2EE','#F29A3E','#2A2F35','blocks'),'law':('#0F1B2D','#EFE8DA','#C9A45C','#1A2A42','cols'),'padel':('#0D2A4A','#EAF4FF','#C6F24E','#1C4E80','court'),'caftan':('#1E1430','#F3EAD8','#D8B46A','#2E6B55','zel'),'resto':('#F3F6FA','#10243A','#2F6FB0','#DCE8F5','plates'),'spa':('#FBF3F3','#3E2327','#C77D86','#F2D7DA','blobs')}
COLS=[(-70,[('g',),('i','agc','École privée')]),
      (-10,[('g',),('m','clinic','Clinique'),('i','admin','Outil sur mesure')]),
      (-40,[('g',),('m','riad','Riad')]),
      (-110,[('g',),('g',),('i','angebleu','Groupe scolaire')]),
      (-20,[('g',),('m','factory','Industrie'),('m','resto','Restaurant')]),
      (-90,[('g',),('i','marronniers','Crèche et école')]),
      (-30,[('g',),('m','padel','Club de sport'),('i','devis','Devis intelligent')]),
      (-60,[('g',),('m','caftan','Artisanat')]),
      (-100,[('g',),('g',),('i','site','Site Digilago'),('m','spa','Beauté')])]
def htile(t):
    if t[0]=='g': return '<div class="ht ghost"></div>'
    if t[0]=='i': return f'<div class="ht"><img src="{T[t[1]]}" alt="" loading="lazy" draggable="false"><span class="lb">{t[2]}</span></div>'
    bg,fg,ac,ac2,art=MCP[t[1]]
    return f'<div class="ht mt" style="--bg:{bg};--fg:{fg};--ac:{ac};--ac2:{ac2}"><div class="mc-art a-{art}"></div><span class="lb">{t[2]}</span></div>'
hcols=''.join(f'<div class="hcol" data-y="{y}" data-k="{0.05+0.02*(i%4)}" style="--d:{i*0.07:.2f}s"><div class="hin">{"".join(htile(t) for t in tiles)}</div></div>' for i,(y,tiles) in enumerate(COLS))
HANG=f"""<section class="hang" id="hang" aria-labelledby="t-hang"><div class="hang-cols" aria-hidden="true">{hcols}</div><div class="sh hang-sh"><span class="pill rv"><span class="ic"></span>Tous les métiers</span><h2 id="t-hang" class="rv d1"><span class="l"><span class="li">Écoles, cliniques, commerces :</span></span><span class="l"><span class="li grad">chacun mérite sa vitrine.</span></span></h2><p class="rv d2">Des écrans pensés pour chaque métier, et des entreprises qui nous ont confié leur présence en ligne.</p><a href="demarrer.html" class="hang-cta rv d3">Démarrer mon projet{ARW}</a></div></section>"""

# ------------------------------------------------------------ RÉALISATIONS
PROJ=[('agc','ecoles','École privée, El Jadida','Académie Georges Claude','Site bilingue, parcours d’inscription, fiche Google.'),('angebleu','ecoles','Groupe scolaire, El Jadida','Ange Bleu','Un site ambitieux, tourné vers la robotique et le numérique.'),('marronniers','ecoles','Crèche et école, El Jadida','Les Marronniers','Deux campus, réservation de visites, univers chaleureux.'),
('admin','outils','Outil sur mesure','Tableau de bord Digilago','Demandes, clients, projets et finances au même endroit.'),('devis','outils','Outil sur mesure','Devis intelligent','Des devis clairs, envoyés et suivis en quelques minutes.'),('whatsapp','outils','Outil sur mesure','WhatsApp automatisé','Plusieurs numéros, réponses automatiques, envois groupés.'),
('projets','outils','Outil sur mesure','Suivi de projets','Chaque projet, chaque étape, chaque échéance, en un coup d’œil.'),('site','sites','Site vitrine','Site Digilago','Notre propre vitrine, trilingue, rapide et référencée.')]
pgrid=''.join(f'<article class="pc rv" data-cat="{c}"><div class="pc-img mask"><img src="{T[k]}" alt="{n}" loading="lazy"></div><div class="pc-b"><small>{s}</small><b>{n}</b><p>{d}</p></div></article>' for k,c,s,n,d in PROJ)
LABS=[('Réserve','SaaS, sport','Prototype','Réservation de terrains de padel et de foot par créneau, paiement ou WhatsApp, planning en temps réel.','#2D5BFF'),('Pupitre','SaaS, éducation','En développement','L’espace administration des écoles : actualités, pré-inscriptions, messages, agenda.','#7C3AED'),('Rendez','SaaS, santé','Prototype','Prise de rendez-vous en ligne pour cabinets et cliniques, rappels WhatsApp, agenda partagé.','#0EA5E9'),('Forge','IA, web','Recherche','Notre chaîne interne : à partir d’un nom et d’un métier, une première version de site en 72 heures.','#F59E0B')]
labs=''.join(f'<article class="lab rv" style="--c:{c}"><i></i><span class="st">{st}</span><small>{k}</small><b>{n}</b><p>{d}</p></article>' for n,k,st,d,c in LABS)
marq=open('marquee.html').read()
real_main=phero('Idées de sites','Votre site, imaginé','pour vous.','Ces exemples sont des idées, pas des modèles à copier. Votre site sera conçu autour de votre identité : votre nom, votre logo, vos couleurs, vos photos. Et il ira encore plus loin.',open('landings/search.html').read(),'Voir les exemples','#styles')
real_main+=open('landings/styles.html').read().replace('<section class="blk l3" id="ecrans">',open('landings/moment.html').read()+'<section class="blk l3" id="ecrans">',1)
real_main+=f'<section class="blk">{sh("Étape 2","De l’exemple","à votre site.","Un exemple n’est qu’un point de départ : voici comment il devient le vôtre.")}<div class="st4 w mt"><div class="rv"><b>01</b><h5>Vous choisissez un style</h5><p>Un exemple de votre domaine, ou simplement une ambiance qui vous plaît.</p></div><div class="rv"><b>02</b><h5>On l’adapte à votre marque</h5><p>Votre logo, vos couleurs, vos textes, vos photos et vos services.</p></div><div class="rv"><b>03</b><h5>Première version en 72 h</h5><p>Vous validez, on affine. Vous ne payez que si elle vous plaît.</p></div><div class="rv"><b>04</b><h5>En ligne, et trouvé</h5><p>Site, fiche Google, référencement et IA : vos clients vous trouvent.</p></div></div></section>'
real_main+=tech_block('Chaque nouveau site','va plus loin que le précédent.','Les exemples montrent un style. Sous le capot, chaque projet profite de nos derniers standards : vitesse, référencement, sécurité.')
real_main+=cband('Votre domaine n’est pas dans la liste ?','On crée votre style sur mesure.')

# ------------------------------------------------------------ À PROPOS
TL=[('Au début','Les premiers sites','Des vitrines pour des commerçants et des indépendants. Le métier s’apprend projet après projet.'),('Ensuite','Les applications mobiles','Des applications iOS et Android, de l’idée à la publication sur les stores.'),('Puis','Le commerce en ligne','Des boutiques complètes : catalogue, paiement, livraison, gestion des commandes.'),('Plus loin','Les outils pour développeurs','Des outils techniques pour d’autres équipes : automatisation, intégrations, API.'),('Encore','Le SaaS et les idées','Tester des idées, construire des produits de zéro, les mettre entre les mains de vrais utilisateurs.'),('Enfin','Les systèmes complets','Des plateformes entières et des design systems : cohérents, documentés, faits pour durer.')]
tl=''.join(f'<div class="rv"><small>{k}</small><h5>{t}</h5><p>{d}</p></div>' for k,t,d in TL)+'<div class="now rv"><small>Aujourd’hui</small><h5>Digilago</h5><p>Toute cette expérience réunie dans une société, au service des entreprises qui veulent être trouvées.</p></div>'
VALS=[('Exigence','Aucun modèle générique. Chaque ligne de code est écrite pour son propriétaire.'),('Résultats','Un site existe pour être trouvé et générer des contacts. Tout est mesuré dans ce sens.'),('Transparence','Vous ne payez que si le résultat vous plaît, prix annoncé avant de commencer, aucun frais caché.'),('Durée','Nous restons après le lancement : hébergement, sécurité, évolutions.')]
vals=''.join(f'<div class="val rv"><span>0{i+1}</span><b>{v}</b><p>{d}</p></div>' for i,(v,d) in enumerate(VALS))
OBJ=[('Je n’y connais rien en informatique.','Vous n’avez rien à connaître. Donnez-nous le nom de votre entreprise et votre ville : nous nous occupons du reste, et nous vous formons en trente minutes.'),('C’est trop cher pour moi.','Une présence en ligne complète reste volontairement accessible. Le prix est écrit avant de commencer, et vous ne payez que si la première version vous plaît.'),('Je n’ai pas le temps.','Dix minutes au téléphone suffisent. En 72 heures, votre site est prêt à être validé.')]
obj=''.join(f'<div class="rv"><q>{q}</q><p>{a}</p></div>' for q,a in OBJ)
STACK=['React','Next.js','TypeScript','Supabase','PostgreSQL','Stripe et CMI','WhatsApp API','Claude','Gemini','Vercel','Cloudflare','Expo']
about_main=phero('À propos de Digilago','Né à El Jadida.','Pensé pour le monde.','Donner à chaque entreprise marocaine, de l’artisan au groupe, une présence en ligne à la hauteur de son savoir-faire.',
 '<div class="stats in2"><div><b>11 ans</b><span>de terrain avant Digilago</span></div><div><b>72 h</b><span>pour une première version</span></div><div><b>0 MAD</b><span>si le résultat ne vous plaît pas</span></div><div><b>100 %</b><span>code écrit à la main</span></div></div>','Parlons de votre projet')
about_main+=f'''<section class="blk">{sh("Notre histoire","Onze ans de terrain,","devenus Digilago.","")}<div class="story2 w mt"><div class="rv"><p class="big wreveal">Digilago est née à El Jadida d’un constat simple : le savoir-faire des entreprises marocaines est immense, leur visibilité en ligne ne l’est pas encore.</p><p style="margin-top:calc(24 * var(--u));font-size:calc(16.5 * var(--u));line-height:1.7;color:var(--grey)">Nous avons commencé avec des écoles, puis des commerces, des cliniques et des cabinets. Chaque projet est construit à la main, avec les technologies d’aujourd’hui et l’exigence d’un grand groupe.</p></div><div class="tl" id="tl"><span class="tl-fill" id="tlFill"></span>{tl}</div></div></section>'''
about_main+=sband(['Exigence','Résultats','Transparence','Durée','El Jadida','Le monde'])
about_main+=f'''<section class="blk"><div class="mv w"><div class="rv"><small>Notre mission</small><p class="wreveal">Donner à chaque entreprise marocaine une présence en ligne à la hauteur de son savoir-faire.</p></div><div class="rv d1"><small>Notre vision</small><p class="wreveal">Aujourd’hui, on choisit un restaurant, un médecin ou un fournisseur en quelques secondes, sur Google ou auprès d’une IA. Notre rôle : faire en sorte que la réponse soit vous.</p></div></div></section>'''
about_main+=f'<section class="blk">{sh("Nos valeurs","Quatre promesses,","tenues à chaque projet.","")}<div class="vals w mt">{vals}</div></section>'
about_main+=f'<section class="blk dk">{sh("Vos freins","Vous hésitez ?","C’est normal.","Voici les trois phrases que nous entendons le plus souvent, et nos réponses.",True)}<div class="obj w mt">{obj}</div></section>'
about_main+=f'''<section class="blk">{sh("Le partage des tâches","Avec Digilago,","nous faisons presque tout.","")}<div class="share w mt"><div class="rv"><small>Ce que vous faites</small><h4>Trois choses.</h4><ol><li>Nous donner le nom de votre entreprise et votre ville</li><li>Valider la première version</li><li>Accueillir vos nouveaux clients</li></ol></div><div class="rv d1"><small>Ce que nous faisons pour vous</small><h4>Presque tout le reste.</h4><ul>{"".join(f"<li>{x}</li>" for x in ["Le design","Le code","Les textes en trois langues","Les photos et visuels","La fiche Google","Le référencement","La visibilité dans les IA","L’hébergement","Les sauvegardes","Les mises à jour","Le suivi mensuel"])}</ul></div></div></section>'''
about_main+=tech_block('Les outils','des grandes équipes.','Les mêmes technologies que les meilleures entreprises du web, au service des entreprises marocaines.',False)
about_main+=cband('Faisons connaissance.','Un café, un appel, un message.','Nous contacter','contact.html')

# ------------------------------------------------------------ CONTACT
MET=['École ou crèche','Clinique ou cabinet','Restaurant ou café','Hôtel ou riad','Commerce ou boutique','Industrie','Juridique ou conseil','Immobilier','Sport et loisirs','Beauté et bien-être','Tourisme','Autre']
SVS=['Site web','Fiche Google','Référencement','Visibilité IA','Boutique en ligne','Application','Branding','WhatsApp automatisé']
chan=f'''<div class="chan w"><a class="main rv" href="https://wa.me/212649953813" target="_blank" rel="noopener noreferrer"><span class="ci icotile">{AI("chat")}</span><b>WhatsApp</b><span>Le plus rapide : réponse le jour même.</span><small>+212 6 49 95 38 13</small></a><a class="rv d1" href="tel:+212649953813"><span class="ci icotile">{AI("call")}</span><b>Appeler</b><span>Du lundi au samedi, de 9 h à 19 h.</span><small>+212 6 49 95 38 13</small></a><a class="rv d2" href="mailto:contact@digilago.ma"><span class="ci icotile">{AI("mail")}</span><b>E-mail</b><span>Pour les cahiers des charges et documents.</span><small>contact@digilago.ma</small></a><a class="rv d3" href="https://www.google.com/maps/search/?api=1&amp;query=Digilago%20El%20Jadida" target="_blank" rel="noopener noreferrer"><span class="ci icotile">{AI("pin")}</span><b>Le studio</b><span>À El Jadida, sur rendez-vous.</span><small>Ouvrir dans Google Maps</small></a></div>'''
form=f'''<form class="cform rv" id="cform" novalidate><label>Votre nom<input name="nom" required autocomplete="name" placeholder="Prénom et nom"></label><label>Votre entreprise<input name="ent" autocomplete="organization" placeholder="Nom de l’entreprise"></label><label>Votre métier<select name="met">{"".join(f"<option>{m}</option>" for m in MET)}</select></label><label>Votre ville<input name="ville" placeholder="El Jadida, Casablanca…"></label><label class="full">Téléphone ou WhatsApp<input name="tel" type="tel" autocomplete="tel" placeholder="+212 6 …"></label><div class="full"><label style="margin-bottom:calc(10 * var(--u))">Ce qui vous intéresse</label><div class="svs">{"".join(f"<button type=\"button\" aria-pressed=\"false\">{s}</button>" for s in SVS)}</div></div><label class="full">Votre message<textarea name="msg" placeholder="Parlez-nous de votre projet, en quelques mots."></textarea></label><div class="ok2" id="ok2" role="status">Merci ! WhatsApp s’ouvre avec votre message prêt à envoyer. Si rien ne s’ouvre, écrivez-nous au +212 6 49 95 38 13.</div><div class="send"><small>Votre message s’ouvre dans WhatsApp, prêt à envoyer.</small><button type="submit">Envoyer ma demande{I(IC["chat"])}</button></div></form>'''
nextc='<aside class="nextc rv d1"><h4>Et <em>ensuite ?</em></h4><ol><li><div><b>On vous rappelle le jour même</b><span>Un échange de dix minutes pour comprendre votre besoin.</span></div></li><li><div><b>Votre première version en 72 h</b><span>Un lien vers un vrai site, avec vos informations.</span></div></li><li><div><b>Vous validez, on met en ligne</b><span>Fiche Google, référencement et formation de trente minutes.</span></div></li></ol><div class="hours"><span>Lundi au samedi</span><b>9 h à 19 h</b></div></aside>'
contact_main=phero('Contact','Parlons de','votre projet.','Réponse le jour même, du lundi au samedi. Un appel de dix minutes suffit pour commencer.','','Écrire maintenant','#form')
contact_main+=f'<section class="blk">{chan}</section>'
contact_main+=sband(['WhatsApp','Téléphone','E-mail','Le studio','Réponse le jour même'])
contact_main+=f'<section class="blk" id="form" style="padding-top:0">{sh("Votre demande","Quelques mots","suffisent.","Remplissez ce qui vous paraît utile. Rien n’est obligatoire, sauf votre nom.")}<div class="cgrid w mt">{form}{nextc}</div></section>'
contact_main+=f'<section class="blk">{sh("Questions","Avant de nous","écrire.","")}{faq(FAQ[:3]+FAQ[4:6])}</section>'

# ------------------------------------------------------------ script commun
JS=r'''<script>
(function(){
  var $ = function(id){ return document.getElementById(id); }, root = document.documentElement;
  var RMZ = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function lay(){ var W = root.clientWidth, H = window.innerHeight, M = W < 760 || W / H < 0.78, u = M ? W / 390 : Math.min(W / 1440, Math.max(H, 760) / 900); root.dataset.mode = M ? 'M' : 'D'; root.style.setProperty('--u', u + 'px'); (function(){ var g = document.getElementById('giant'); if (!g) return; var W = document.documentElement.clientWidth, pad = W < 760 ? 40 : Math.min(96, W * 0.066); g.style.fontSize = '100px'; var w = g.getBoundingClientRect().width || 1; g.style.fontSize = (100 * (W - pad * 2) / w) + 'px'; })(); }
  lay(); window.addEventListener('resize', lay); if (document.fonts && document.fonts.ready) document.fonts.ready.then(lay);
  $('fnav').classList.add('on');
  var here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.fnav .fl a').forEach(function(a){ if (a.getAttribute('href') === here) a.classList.add('cur-p'); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(es){ es.forEach(function(en){ if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }); }, { threshold: 0.15 });
    document.querySelectorAll('.rv, .ai').forEach(function(el){ io.observe(el); });
    var fo = new IntersectionObserver(function(es){ es.forEach(function(en){ if (en.isIntersecting) $('foot').classList.add('open'); }); }, { threshold: 0.3 }); fo.observe($('foot'));
  } else { document.querySelectorAll('.rv').forEach(function(el){ el.classList.add('in'); }); }
  /* curseur et boutons magnétiques */
  var fine = window.matchMedia && matchMedia('(pointer:fine)').matches, cur = $('cur'), cx = -100, cy = -100, tx = -100, ty = -100;
  if (fine && cur) {
    window.addEventListener('pointermove', function(e){ tx = e.clientX; ty = e.clientY; cur.classList.add('on'); var t = e.target.closest && e.target.closest('a, button, select, input, textarea, summary'); cur.classList.toggle('big', !!t); }, { passive: true });
    (function loop(){ cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2; cur.style.transform = 'translate(' + cx + 'px,' + cy + 'px)'; requestAnimationFrame(loop); })();
    document.querySelectorAll('.cta, .cband a, .foot .wa').forEach(function(el){
      el.style.transition = 'transform .45s cubic-bezier(.16,1,.3,1)';
      el.addEventListener('pointermove', function(e){ var r = el.getBoundingClientRect(); el.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.2) + 'px,' + ((e.clientY - r.top - r.height / 2) * 0.3) + 'px)'; });
      el.addEventListener('pointerleave', function(){ el.style.transform = ''; });
    });
  } else if (cur) cur.remove();

  /* ---------- Animations riches ---------- */
  var prog = document.createElement('div'); prog.className = 'prog'; document.body.appendChild(prog);
  /* décalage automatique des apparitions dans chaque groupe */
  document.querySelectorAll('.rv').forEach(function(el){ var sib = Array.prototype.filter.call(el.parentElement.children, function(c){ return c.classList.contains('rv'); }); el.style.setProperty('--i', Math.max(0, sib.indexOf(el))); });
  /* images qui se dévoilent */
  if ('IntersectionObserver' in window) {
    var mo = new IntersectionObserver(function(es){ es.forEach(function(en){ if (en.isIntersecting) { en.target._mask.classList.add('in'); mo.unobserve(en.target); } }); }, { threshold: 0.15 });
    document.querySelectorAll('.mask').forEach(function(el){ var p = el.parentElement; p._mask = el; mo.observe(p); });
    /* chiffres qui comptent */
    var co = new IntersectionObserver(function(es){ es.forEach(function(en){ if (!en.isIntersecting) return; co.unobserve(en.target); var el = en.target, txt = el.textContent, m = txt.match(/^(\d+)(.*)$/); if (!m) return; var to = +m[1], rest = m[2], t0 = performance.now(); (function tick(now){ var k = Math.min(1, (now - t0) / 1400), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(to * e) + rest; if (k < 1) requestAnimationFrame(tick); })(t0); }); }, { threshold: 0.6 });
    document.querySelectorAll('.stats b').forEach(function(el){ co.observe(el); });
  }
  /* mots qui s'allument au défilement */
  var wr = document.querySelectorAll('.wreveal');
  wr.forEach(function(p){ p.innerHTML = p.textContent.split(/(\s+)/).map(function(w){ return /\s+/.test(w) ? w : '<span class="wd">' + w + '</span>'; }).join(''); });
  /* inclinaison au survol */
  if (fine) document.querySelectorAll('.lab, .chan a, .sv, .pc, .eng > div, .obj > div').forEach(function(el){
    el.classList.add('tilt');
    el.addEventListener('pointermove', function(e){ var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; el.style.transform = 'perspective(900px) rotateY(' + (x * 7) + 'deg) rotateX(' + (-y * 7) + 'deg) translateY(-4px)'; });
    el.addEventListener('pointerleave', function(){ el.style.transform = ''; });
  });
  var hero = document.querySelector('.phero'), hin = document.querySelectorAll('.phero .hin, .phero .hcta, .phero .anchors, .phero .stats'), rows = document.querySelectorAll('.sband .row'), bigs = document.querySelectorAll('.pil-big'), cb = document.querySelectorAll('.cband'), st4 = document.querySelector('.st4');
  function scene(){
    var sy = window.scrollY, H = window.innerHeight, doc = document.documentElement.scrollHeight - H;
    prog.style.transform = 'scaleX(' + (doc > 0 ? sy / doc : 0) + ')';
    if (hero) { var hh = hero.offsetHeight, p = Math.min(1, sy / hh); hero.style.setProperty('--py', (sy * 0.35) + 'px'); hin.forEach(function(el, i){ el.style.transform = 'translateY(' + (-sy * (0.12 + i * 0.05)) + 'px)'; el.style.opacity = Math.max(0, 1 - p * (1.3 + i * 0.2)); }); }
    rows.forEach(function(r){ var rr = r.getBoundingClientRect(); if (rr.bottom < -200 || rr.top > H + 200) return; var d = +r.dataset.d, off = (rr.top - H) * 0.6 * d; r.style.transform = 'translateX(' + (d < 0 ? off : -r.scrollWidth / 3 + off) + 'px)'; });
    bigs.forEach(function(b){ var r = b.parentElement.getBoundingClientRect(); b.style.transform = 'translateY(' + ((r.top - H * 0.3) * -0.25) + 'px)'; });
    cb.forEach(function(c){ var r = c.getBoundingClientRect(), k = Math.max(0, Math.min(1, (H - r.top) / (H * 0.7))); c.style.transform = 'scale(' + (0.86 + 0.14 * k) + ')'; c.style.borderRadius = (54 - 30 * k) * parseFloat(getComputedStyle(root).getPropertyValue('--u')) + 'px'; });
    if (st4) { var r4 = st4.getBoundingClientRect(); st4.style.setProperty('--sx', Math.max(0, Math.min(1, (H * 0.85 - r4.top) / (H * 0.5)))); }
    wr.forEach(function(p){ var r = p.getBoundingClientRect(), k = Math.max(0, Math.min(1, (H * 0.85 - r.top) / (r.height + H * 0.35))), ws = p.querySelectorAll('.wd'), n = Math.floor(k * ws.length * 1.05); ws.forEach(function(w, i){ w.classList.toggle('on', i < n); }); });
  }
  var ticking = false; window.addEventListener('scroll', function(){ if (!ticking) { ticking = true; requestAnimationFrame(function(){ scene(); ticking = false; }); } }, { passive: true });
  window.addEventListener('resize', scene); scene();


  /* ---------- Points bleus qui montent, comme dans le pied de page ---------- */
  function addPollen(el, n){
    if (!el || el.querySelector(':scope > .pollen')) return;
    var d = document.createElement('div'); d.className = 'pollen'; d.setAttribute('aria-hidden', 'true');
    for (var k = 0; k < n; k++) { var i = document.createElement('i'); i.style.left = (Math.random() * 98 + 1).toFixed(1) + '%'; i.style.animationDelay = (-Math.random() * 14).toFixed(1) + 's'; i.style.animationDuration = (9 + Math.random() * 8).toFixed(1) + 's'; i.style.setProperty('--s', (0.5 + Math.random() * 0.9).toFixed(2)); d.appendChild(i); }
    el.insertBefore(d, el.firstChild);
  }

  document.querySelectorAll('.blk.dk').forEach(function(el){ addPollen(el, 24); });


  /* ---------- Le mur suspendu : les colonnes descendent, flottent et suivent le défilement ---------- */
  var hang = document.getElementById('hang');
  if (hang) {
    var hcols = hang.querySelectorAll('.hcol');
    if ('IntersectionObserver' in window) { var ho = new IntersectionObserver(function(es){ es.forEach(function(en){ if (en.isIntersecting) { hang.classList.add('in'); ho.disconnect(); } }); }, { threshold: 0.15 }); ho.observe(hang); } else hang.classList.add('in');
    (function float(now){
      var r = hang.getBoundingClientRect(), H = window.innerHeight, uu = parseFloat(getComputedStyle(root).getPropertyValue('--u')) || 1;
      if (r.bottom > 0 && r.top < H) {
        var t = now / 1000;
        hcols.forEach(function(c, i){ var y = (+c.dataset.y) * uu + Math.sin(t * 0.9 + i * 1.3) * 7 * uu + (r.top - H * 0.3) * -(+c.dataset.k); c.style.transform = 'translateY(' + y.toFixed(1) + 'px)'; });
      }
      requestAnimationFrame(float);
    })(performance.now());
    if (fine) hang.querySelectorAll('.ht:not(.ghost)').forEach(function(el){
      el.addEventListener('pointermove', function(e){ var b = el.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - 0.5, y = (e.clientY - b.top) / b.height - 0.5; el.style.transform = 'perspective(700px) rotateY(' + (x * 18) + 'deg) rotateX(' + (-y * 18) + 'deg) scale(1.08)'; });
      el.addEventListener('pointerleave', function(){ el.style.transform = ''; });
    });
  }


  /* nuages du ciel : parallaxe douce */
  var DCL = document.querySelectorAll('#dayclouds .cl');
  function cloudsStep(){ var sy = window.scrollY, H = window.innerHeight, span = H * 1.9; DCL.forEach(function(c){ var y = ((+c.dataset.y * H - sy * +c.dataset.f) % span + span) % span - H * 0.45; c.style.top = y.toFixed(1) + 'px'; }); }
  window.addEventListener('scroll', function(){ requestAnimationFrame(cloudsStep); }, { passive: true }); cloudsStep();

__STARTJS__
  /* menu téléphone */
  var sheet = $('sheet'), mb = $('mb');
  function setMenu(on){ sheet.classList.toggle('open', on); if (mb) mb.setAttribute('aria-expanded', on ? 'true' : 'false'); root.style.overflow = on ? 'hidden' : ''; }
  if (mb) mb.addEventListener('click', function(){ setMenu(true); });
  sheet.querySelectorAll('.fsm-nav a').forEach(function(a){ a.addEventListener('click', function(){ setMenu(false); }); });
  $('closeBtn').addEventListener('click', function(){ setMenu(false); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') setMenu(false); });
  /* frise : elle se remplit au défilement */
  var tl = $('tl');
  if (tl) { var items = tl.querySelectorAll(':scope > div'); window.addEventListener('scroll', function(){ var r = tl.getBoundingClientRect(), p = Math.max(0, Math.min(1, (window.innerHeight * 0.6 - r.top) / r.height)); $('tlFill').style.height = (p * (r.height - 12)) + 'px'; items.forEach(function(it){ it.classList.toggle('on', it.getBoundingClientRect().top < window.innerHeight * 0.6); }); }, { passive: true }); }
  /* filtres des réalisations */
  document.querySelectorAll('.flt button').forEach(function(b){ b.addEventListener('click', function(){ document.querySelectorAll('.flt button').forEach(function(x){ x.classList.toggle('on', x === b); }); var f = b.dataset.f; document.querySelectorAll('#pgrid .pc').forEach(function(p){ p.classList.toggle('hide', f !== 'all' && p.dataset.cat !== f); }); }); });
  /* formulaire : la demande part sur WhatsApp */
  var form = $('cform');
  if (form) {
    form.querySelectorAll('.svs button').forEach(function(b){ b.addEventListener('click', function(){ b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); }); });
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var f = form.elements, nom = f.nom.value.trim();
      if (!nom) { f.nom.focus(); f.nom.style.boxShadow = 'inset 0 0 0 2px #E23B2E'; return; }
      var svs = Array.prototype.filter.call(form.querySelectorAll('.svs button'), function(b){ return b.getAttribute('aria-pressed') === 'true'; }).map(function(b){ return b.textContent; });
      var lines = ['Bonjour Digilago,', '', 'Nom : ' + nom];
      if (f.ent.value.trim()) lines.push('Entreprise : ' + f.ent.value.trim());
      lines.push('Métier : ' + f.met.value);
      if (f.ville.value.trim()) lines.push('Ville : ' + f.ville.value.trim());
      if (f.tel.value.trim()) lines.push('Téléphone : ' + f.tel.value.trim());
      if (svs.length) lines.push('Intéressé par : ' + svs.join(', '));
      if (f.msg.value.trim()) lines.push('', f.msg.value.trim());
      try { var api = (document.documentElement.getAttribute('data-api') || '').replace(/\/$/, ''); if (api) fetch(api + '/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: nom, company: f.ent.value.trim(), phone: f.tel.value.trim(), need: f.met.value + (svs.length ? ' : ' + svs.join(', ') : ''), message: f.msg.value.trim(), source: 'Formulaire de contact' }), keepalive: true }).catch(function(){}); } catch (e) {}
      window.open('https://wa.me/212649953813?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
      $('ok2').classList.add('on');
    });
  }
})();
</script>'''

JS=JS.replace('__STARTJS__', start_page.JS+open('js_show.txt').read()+open('js_styles.txt').read()+open('js_tech.txt').read()+open('js_moment.txt').read()+'''
  /* ---------- Barre d'application (téléphone) ---------- */
  (function(){
    var d = document.getElementById('dock'); if (!d) return;
    var here = location.pathname.split('/').pop() || 'index.html';
    d.querySelectorAll('a[data-p]').forEach(function(a){ if (a.dataset.p === here) a.classList.add('cur'); });
    var home = !!document.getElementById('hero');
    function tick(){ var y = window.scrollY, lim = home ? window.innerHeight * 0.9 : 160; d.classList.toggle('on', y > lim); }
    window.addEventListener('scroll', function(){ requestAnimationFrame(tick); }, { passive: true }); tick();
  })();
''')
def page(fname,title,desc,main):
    h=HEAD.replace('<title>Digilago | L’infrastructure digitale des entreprises marocaines</title>',f'<title>{title}</title>')
    h=re.sub(r'<meta name="description" content="[^"]*">',f'<meta name="description" content="{desc}">',h,count=1)
    h=h.replace('<!--LOCALFONTS-->','<!--LOCALFONTS-->')
    i=h.index('@media (prefers-reduced-motion: reduce){.grain')
    h=h[:i]+CSSP+'\n'+h[i:]
    fnav=FNAV if 'id="mb"' in FNAV else FNAV.replace('</nav>','<button type="button" class="mb" id="mb" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="sheet"><svg viewBox="0 0 18 18" aria-hidden="true"><path d="M2 6h14M2 12h14" stroke="#fff" stroke-width="1.6"/></svg></button></nav>')
    body=f'<body>\n{GRAIN}\n<div id="daybg" class="pgsky" aria-hidden="true">{dayclouds()}</div>\n{DOCK}\n{fnav}\n<main class="pg light" id="main">{main}</main>\n{FOOT}\n{SHEET}\n{JS}\n</body>\n</html>\n'
    return h+body
start_main=phero('Démarrer un projet','Votre projet commence','ici, maintenant.','Six petites étapes, deux minutes. Pas de jargon, pas d’engagement : vous validez seulement la première version.','<p class="sk-hint in2">Faites défiler pour commencer</p>','Commencer','#wzSec')+start_page.build()+cband('Une question avant ?','On en parle simplement.','Nous contacter','contact.html')

LEG=lambda title,items: '<section class="blk"><div class="w nar legal">'+''.join(f'<h3 class="rv">{t}</h3><p class="rv d1">{d}</p>' for t,d in items)+'</div></section>'
ML=[('Éditeur du site','Digilago, société de services numériques, El Jadida, Maroc. Contact : contact@digilago.ma, +212 6 49 95 38 13. <em>[À compléter : forme juridique, capital, RC, ICE, siège social.]</em>'),
('Directeur de la publication','<em>[À compléter : nom du gérant.]</em>'),('Hébergement','<em>[À compléter : nom et adresse de l’hébergeur.]</em>'),
('Propriété intellectuelle','L’ensemble du site (textes, visuels, code, marque Digilago) est protégé. Toute reproduction sans accord écrit est interdite. Les captures de sites clients sont présentées avec leur accord.'),
('Crédits','Site conçu et codé à El Jadida par Digilago.')]
CF=[('Ce que nous collectons','Les informations que vous nous transmettez volontairement par le formulaire de contact, la page « Démarrer un projet » ou WhatsApp : nom, entreprise, ville, téléphone, e-mail et votre message.'),
('Pourquoi','Pour vous répondre, préparer votre première version et suivre votre projet. Nous n’utilisons jamais vos informations à d’autres fins et ne les vendons à personne.'),
('Combien de temps','Le temps de traiter votre demande et, si vous devenez client, la durée de notre collaboration. Vous pouvez demander leur suppression à tout moment.'),
('Vos droits','Vous pouvez accéder à vos données, les corriger ou demander leur suppression en écrivant à contact@digilago.ma. Conformément à la loi 09-08 relative à la protection des données personnelles au Maroc. <em>[À vérifier avec votre conseil.]</em>'),
('Cookies','Ce site n’utilise pas de cookies publicitaires. Seuls des réglages techniques peuvent être enregistrés dans votre navigateur.')]
legal_main=phero('Informations légales','Mentions','légales.','Qui édite ce site, et dans quel cadre.','','Nous contacter','contact.html')+LEG('Mentions légales',ML)
conf_main=phero('Confidentialité','Vos données,','en confiance.','Ce que nous collectons, pourquoi, et vos droits.','','Nous contacter','contact.html')+LEG('Confidentialité',CF)

# ------------------------------------------------------------ GUIDES
import json as _gj
ARTS=_gj.load(open('guides/articles.json')); GFILE=_gj.load(open('guides/files.json'))
import subprocess as _sp; _sp.run(['python3','guides/build_cards.py'],check=True)
GCARDS=open('guides/cards.html').read().replace('class="gd rv','class="gd light rv')
def art_page(a):
    t=a['title']; cut=t.find(' au Maroc')
    l1,l2=(t[:cut],t[cut+1:]) if cut>0 else (t,'')
    body=''
    for bl in a['blocks']:
        body+=f'<h2 class="rv">{bl["h"]}</h2>'
        body+=''.join(f'<p class="rv">{p}</p>' for p in bl['p'])
        if bl['list']: body+='<ul class="rv">'+''.join(f'<li>{x}</li>' for x in bl['list'])+'</ul>'
        body+=''.join(f'<p class="rv art-note">{p}</p>' for p in bl['after'])
    others=[x for x in ARTS if x['slug']!=a['slug']][:2]
    import json as j2
    ld={"@context":"https://schema.org","@graph":[{"@type":"Article","headline":a['title'],"description":a['desc'],"datePublished":a['date'],"inLanguage":"fr-MA","author":{"@type":"Organization","name":"Digilago"},"publisher":{"@type":"Organization","name":"Digilago"}},{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":ans}} for q,ans in a['faq']]}]}
    main=phero(f'Guide, {a["read"]} min de lecture',l1,l2 or ' ',a['desc'],'','Démarrer mon projet','demarrer.html')
    main+=f'<section class="blk art-wrap"><article class="art w nar">{body}</article></section>'
    main+=f'<section class="blk" id="faq">{sh("Questions","En bref,","les réponses.","")}{faq(a["faq"])}</section>'
    oc=''.join([c for c in GCARDS.split('</a>') if GFILE[o['slug']] in c][0]+'</a>' for o in others)
    main+=f'<section class="blk">{sh("À lire aussi","Un autre guide","pour avancer.","")}<div class="gd-grid">{oc}</div></section>'
    main+=cband('Prêt à passer à l’action ?','Première version en 72 heures.')
    main+=f'<script type="application/ld+json">{j2.dumps(ld,ensure_ascii=False)}</script>'
    return main
guides_main=phero('Guides','Tout comprendre','pour être trouvé en ligne.','Des guides clairs pour les entreprises marocaines : prix d’un site web, référencement local, fiche Google et visibilité dans les IA.','','Démarrer mon projet','demarrer.html')
guides_main+=f'<section class="blk">{sh("Nos guides","Comprendre","avant de décider.","")}<div class="gd-grid">{GCARDS}</div></section>'+cband('Une question précise ?','On vous répond aujourd’hui.','Nous contacter','contact.html')
GPAGES=[('guides.html','Guides : création de site, SEO et IA au Maroc | Digilago','Des guides clairs pour les entreprises marocaines : prix d’un site web, référencement local, fiche Google, visibilité dans ChatGPT et les IA.',guides_main)]
for a in ARTS: GPAGES.append((GFILE[a['slug']],a['title']+' | Digilago',a['desc'],art_page(a)))

nf_main=phero('Erreur 404','Cette page','s’est envolée.','Elle a peut-être changé d’adresse. Revenons sur terre, tout le reste est bien là.','','Retour à l’accueil','index.html')+cband('Vous cherchiez quelque chose ?','On vous répond aujourd’hui.','Nous contacter','contact.html')
PAGES=GPAGES+[('404.html','Page introuvable | Digilago','Cette page n’existe pas ou a changé d’adresse.',nf_main),('mentions-legales.html','Mentions légales | Digilago','Mentions légales du site Digilago.',legal_main),('confidentialite.html','Confidentialité | Digilago','Politique de confidentialité du site Digilago.',conf_main),('demarrer.html','Démarrer un projet | Digilago, agence web à El Jadida','Lancez votre projet en deux minutes : site web, fiche Google, visibilité IA. Première version en 72 heures.',start_main),('services.html','Services | Digilago, agence web à El Jadida','Sites web sur mesure, fiche Google, référencement, visibilité dans les IA, applications et automatisations pour les entreprises marocaines.',services_main),
('realisations.html','Un site pour chaque métier : exemples par secteur | Digilago','Choisissez votre domaine et découvrez un exemple de site : santé, éducation, restauration, commerce… Le vôtre sera adapté à votre logo et à vos couleurs.',real_main),
('a-propos.html','À propos | Digilago, agence web à El Jadida','Onze ans de terrain devenus Digilago : notre histoire, notre mission et nos valeurs.',about_main),
('contact.html','Contact | Digilago, agence web à El Jadida','Parlons de votre projet : WhatsApp, téléphone ou e-mail. Réponse le jour même.',contact_main)]
OUT=os.environ.get('DEV_DIR','../dev'); os.makedirs(OUT,exist_ok=True)
for fn,t,d,m in PAGES:
    html=soften(recolor(page(fn,t,d,m)))
    html=re.sub(r'(\d) h\b', '\\1\u00a0h', html)
    html=html.replace('<html lang="fr">','<html lang="fr" data-api="'+os.environ.get('GESTION_URL','')+'">',1)
    open(os.path.join(OUT,fn),'w').write(html.replace('<!--LOCALFONTS-->',''))
    print(fn, len(html)//1024,'KB')
