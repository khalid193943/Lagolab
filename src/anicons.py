# Icônes animées : chaque icône a ses propres pièces et son propre mouvement
P='class="p" pathLength="1"'
ICONS={
'globe':f'<circle {P} cx="24" cy="24" r="16"/><ellipse {P} class="p mer" cx="24" cy="24" rx="7" ry="16"/><path {P} d="M8 24h32M11 16h26M11 32h26"/>',
'cart':f'<g class="mv"><path {P} d="M5 9h5l4.5 21h20l4.5-15H13"/><circle class="wh" cx="18" cy="37" r="3"/><circle class="wh" cx="32" cy="37" r="3"/><path {P} class="p box" d="M20 17h10v8H20z"/></g>',
'phone':f'<rect {P} x="14" y="5" width="20" height="38" rx="4.5"/><path {P} d="M21 38h6"/><path {P} class="p ln" d="M19 16h10M19 21h7M19 26h9"/><circle class="dot" cx="31" cy="9" r="3.2"/>',
'pen':f'<path {P} class="p nib" d="M31 7l10 10-18 18-11 2 2-11z"/><path {P} class="p ink" d="M7 43c6-3 10 2 16-1s8 1 14-1"/>',
'pin':f'<g class="drop"><path {P} d="M24 39s12-10.6 12-19.5a12 12 0 00-24 0C12 28.4 24 39 24 39z"/><circle {P} cx="24" cy="19.5" r="4.5"/></g><ellipse class="sh" cx="24" cy="43.5" rx="6" ry="1.6"/>',
'search':f'<g class="lens"><circle {P} cx="20" cy="20" r="10"/><path {P} d="M27.5 27.5L38 38"/><path {P} class="p gl" d="M15 17.5a6 6 0 015.5-4"/></g>',
'bot':f'<path {P} d="M24 7v5"/><circle class="ant" cx="24" cy="6" r="2.4"/><rect {P} x="10" y="12" width="28" height="24" rx="7"/><g class="eyes"><circle cx="18.5" cy="23" r="2.6"/><circle cx="29.5" cy="23" r="2.6"/></g><path {P} d="M18.5 30h11"/>',
'mega':f'<path {P} d="M7 20v8a2 2 0 002 2h4l12 8V10L13 18H9a2 2 0 00-2 2z"/><path {P} class="p w1" d="M31 19a6 6 0 010 10"/><path {P} class="p w2" d="M35.5 14.5a12 12 0 010 19"/>',
'puzzle':f'<path {P} d="M7 14h14v7a3 3 0 110 6v9H7z"/><path {P} class="p pc" d="M26 14h15v22H26v-9a3 3 0 100-6z"/>',
'chat':f'<path {P} d="M40 23a15 15 0 01-21.7 13.3L9 39l2.3-8A15 15 0 1140 23z"/><g class="dots"><circle cx="18" cy="23" r="2.1"/><circle cx="24.5" cy="23" r="2.1"/><circle cx="31" cy="23" r="2.1"/></g>',
'server':f'<rect {P} x="8" y="8" width="32" height="13" rx="3.5"/><rect {P} x="8" y="27" width="32" height="13" rx="3.5"/><circle class="l1" cx="14.5" cy="14.5" r="1.9"/><circle class="l2" cx="14.5" cy="33.5" r="1.9"/><path {P} d="M22 14.5h12M22 33.5h12"/>',
'bolt':f'<path {P} class="p bolt" d="M26.5 5L11 27h11.5l-2 16L37 20H25.5z"/>',
'call':f'<path {P} class="p hs" d="M14 8h6l3 8-4 3a20 20 0 0010 10l3-4 8 3v6a4 4 0 01-4.4 4A30 30 0 0110 12.4 4 4 0 0114 8z"/><path {P} class="p w1" d="M30 9a9 9 0 019 9"/><path {P} class="p w2" d="M30 3a15 15 0 0115 15"/>',
'mail':f'<g class="mv2"><rect {P} x="6" y="12" width="36" height="25" rx="3.5"/><path {P} class="p flap" d="M6 14l18 13 18-13"/></g>'}
def AI(k): return f'<svg class="ai ai-{k}" viewBox="0 0 48 48" aria-hidden="true">{ICONS[k]}</svg>'
NAME2K={'Sites web sur mesure':'globe','Boutiques en ligne':'cart','Applications mobiles':'phone','Branding et logo':'pen','Fiche Google Business':'pin','Référencement SEO':'search','Visibilité dans les IA':'bot','Publicité en ligne':'mega','Extensions et intégrations':'puzzle','WhatsApp automatisé':'chat','Hébergement et maintenance':'server','Support le jour même':'bolt'}
CSS=r'''
/* ================= Icônes vivantes ================= */
.ai{overflow:visible}
.ai .p{fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1 1;stroke-dashoffset:1;transition:stroke-dashoffset 1.4s cubic-bezier(.65,0,.35,1)}
.ai.in .p{stroke-dashoffset:0}
.ai .p:nth-of-type(2){transition-delay:.15s}.ai .p:nth-of-type(3){transition-delay:.3s}
.ai circle:not(.p),.ai .eyes circle,.ai .dots circle{fill:currentColor}
.ai *{transform-box:fill-box;transform-origin:center}
.ai.in .mer{animation:aiMer 4s ease-in-out 1.4s infinite}
@keyframes aiMer{0%,100%{transform:scaleX(1)}50%{transform:scaleX(.12)}}
.ai.in .mv{animation:aiCart 2.6s ease-in-out 1.4s infinite}
@keyframes aiCart{0%,100%{transform:translateX(-2px)}50%{transform:translateX(3px)}}
.ai.in .box{animation:aiBob 1.3s ease-in-out 1.4s infinite}
@keyframes aiBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-2.5px)}}
.ai .wh{fill:currentColor}
.ai.in .dot{animation:aiPulse 1.8s ease-out 1.4s infinite}
@keyframes aiPulse{0%{transform:scale(1);opacity:1}60%{transform:scale(1.6);opacity:.35}100%{transform:scale(1);opacity:1}}
.ai .dot{fill:#64F662!important}
.ai.in .ln{animation:aiLn 2.4s ease-in-out 1.6s infinite}
@keyframes aiLn{0%,100%{opacity:1}50%{opacity:.35}}
.ai.in .nib{transform-origin:20% 90%;animation:aiNib 1.6s ease-in-out 1.4s infinite}
@keyframes aiNib{0%,100%{transform:rotate(0)}50%{transform:rotate(-8deg) translateX(-2px)}}
.ai.in .ink{animation:aiInk 3.2s ease-in-out 1.6s infinite}
@keyframes aiInk{0%{stroke-dashoffset:1}45%,70%{stroke-dashoffset:0}100%{stroke-dashoffset:-1}}
.ai.in .drop{animation:aiDrop 1.8s cubic-bezier(.3,0,.3,1) 1.4s infinite}
@keyframes aiDrop{0%,100%{transform:translateY(0)}45%{transform:translateY(-6px)}}
.ai .sh{fill:currentColor;opacity:.3}
.ai.in .sh{animation:aiSh 1.8s cubic-bezier(.3,0,.3,1) 1.4s infinite}
@keyframes aiSh{0%,100%{transform:scaleX(1);opacity:.35}45%{transform:scaleX(.55);opacity:.15}}
.ai.in .lens{animation:aiLens 3.6s ease-in-out 1.4s infinite}
@keyframes aiLens{0%,100%{transform:translate(0,0)}25%{transform:translate(4px,-2px)}50%{transform:translate(1px,3px)}75%{transform:translate(-3px,0)}}
.ai.in .eyes circle{animation:aiBlink 3.4s ease-in-out 1.4s infinite}
@keyframes aiBlink{0%,44%,52%,100%{transform:scaleY(1)}48%{transform:scaleY(.1)}}
.ai.in .ant{animation:aiPulse 1.6s ease-out 1.4s infinite;fill:#64F662!important}
.ai.in .w1,.ai.in .w2{animation:aiWave 1.8s ease-in-out 1.6s infinite}
.ai.in .w2{animation-delay:1.9s}
@keyframes aiWave{0%,100%{opacity:.15}40%{opacity:1}}
.ai.in .pc{animation:aiSnap 2.6s cubic-bezier(.34,1.56,.64,1) 1.4s infinite}
@keyframes aiSnap{0%,15%{transform:translateX(7px)}45%,100%{transform:translateX(0)}}
.ai.in .dots circle{animation:aiType 1.2s ease-in-out 1.4s infinite}
.ai.in .dots circle:nth-child(2){animation-delay:1.55s}.ai.in .dots circle:nth-child(3){animation-delay:1.7s}
@keyframes aiType{0%,100%{transform:translateY(0);opacity:.5}40%{transform:translateY(-3.5px);opacity:1}}
.ai.in .l1{animation:aiLed 1.4s steps(1) 1.4s infinite;fill:#64F662!important}
.ai.in .l2{animation:aiLed 1.4s steps(1) 2.1s infinite;fill:#64F662!important}
@keyframes aiLed{0%{opacity:1}50%{opacity:.2}}
.ai.in .bolt{animation:aiBolt 2.4s ease-in-out 1.4s infinite}
@keyframes aiBolt{0%,70%,100%{filter:none;transform:scale(1)}78%{filter:drop-shadow(0 0 6px #64F662);transform:scale(1.12)}86%{transform:scale(.96)}}
.ai.in .hs{transform-origin:40% 60%;animation:aiRing 2.2s ease-in-out 1.4s infinite}
@keyframes aiRing{0%,40%,100%{transform:rotate(0)}5%,15%,25%{transform:rotate(-10deg)}10%,20%,30%{transform:rotate(10deg)}}
.ai.in .mv2{animation:aiBob 2.4s ease-in-out 1.4s infinite}
.ai.in .flap{transform-origin:50% 0;animation:aiFlap 2.4s ease-in-out 1.6s infinite}
@keyframes aiFlap{0%,100%{transform:scaleY(1)}50%{transform:scaleY(-.35)}}
/* les tuiles des icônes, plus grandes et lumineuses */
.icotile{position:relative;display:flex;align-items:center;justify-content:center;border-radius:calc(26 * var(--u));background:radial-gradient(circle at 30% 20%,#1E4A3E,#072021 70%);color:#64F662;box-shadow:inset 0 0 0 1px rgba(100,246,98,.3),inset 0 calc(10 * var(--u)) calc(24 * var(--u)) rgba(255,255,255,.06),0 calc(20 * var(--u)) calc(40 * var(--u)) calc(-18 * var(--u)) rgba(7,32,33,.6),0 0 calc(40 * var(--u)) calc(-10 * var(--u)) rgba(100,246,98,.45)}
.icotile::after{content:"";position:absolute;inset:0;border-radius:inherit;background:linear-gradient(135deg,rgba(255,255,255,.12),transparent 45%);pointer-events:none}
'''
