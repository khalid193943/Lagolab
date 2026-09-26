import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ArrowRight, ArrowUpRight, Check, Star, MapPin, Search, Sparkles, Phone, MessageCircle, Mail, Plus, X, Zap, ShieldCheck, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AutoShowcase } from './Showcase';
import { Library, LiveFrame } from './Library';
import { LIBRARY } from './data';
import { SECTORS, SERVICES, WORK, STEPS, FAQ, CONTACT, PACKS, Sector } from './data';

const EASE = [0.16, 1, 0.3, 1] as const;
export const Reveal = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 30, filter: 'blur(8px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 1, delay, ease: EASE }}>{children}</motion.div>;
};
export const Eyebrow = ({ children }: { children: React.ReactNode }) => <p className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.22em] text-gold"><span className="w-1.5 h-1.5 rounded-full bg-gold" />{children}</p>;
export const Title = ({ eyebrow, title, lead, center }: { eyebrow: string; title: React.ReactNode; lead?: string; center?: boolean }) => (
  <Reveal className={`max-w-[820px] ${center ? 'mx-auto text-center' : ''}`}>
    <Eyebrow>{eyebrow}</Eyebrow>
    <h2 className="mt-6 text-[clamp(2.6rem,5.2vw,5.2rem)] leading-[0.98]">{title}</h2>
    {lead && <p className={`mt-6 text-[1.15rem] leading-relaxed text-white/60 max-w-[58ch] ${center ? 'mx-auto' : ''}`}>{lead}</p>}
  </Reveal>
);

/* -------------------- Simulateur : Google + réponse IA -------------------- */
const useTyping = (text: string, speed = 38) => {
  const [out, setOut] = useState(''); const reduce = useReducedMotion();
  useEffect(() => { if (reduce) { setOut(text); return; } setOut(''); let i = 0; const id = window.setInterval(() => { i++; setOut(text.slice(0, i)); if (i >= text.length) window.clearInterval(id); }, speed); return () => window.clearInterval(id); }, [text, reduce]);
  return out;
};
const Simulator = () => {
  const list = SECTORS.slice(0, 8);
  const [k, setK] = useState(0); const [auto, setAuto] = useState(true); const [phase, setPhase] = useState<'before' | 'after'>('before');
  const s = list[k]; const typed = useTyping(s.query);
  useEffect(() => { setPhase('before'); const a = window.setTimeout(() => setPhase('after'), s.query.length * 38 + 1400); return () => window.clearTimeout(a); }, [k]);
  useEffect(() => { if (!auto) return; const id = window.setInterval(() => setK((x) => (x + 1) % list.length), 7600); return () => window.clearInterval(id); }, [auto]);
  const rows = phase === 'before'
    ? [{ n: 'Un concurrent', d: 'Site web · Réservation en ligne', r: '4,7', c: 124, you: false }, { n: 'Un autre concurrent', d: 'Fiche Google · Ouvert', r: '4,5', c: 61, you: false }, { n: s.you, d: 'Aucun site · Aucune fiche', r: '—', c: 0, you: true, lost: true }]
    : [{ n: s.you, d: `Site Digilago · ${s.cta}`, r: '4,9', c: 212, you: true }, { n: 'Un concurrent', d: 'Site web · Réservation en ligne', r: '4,7', c: 124, you: false }, { n: 'Un autre concurrent', d: 'Fiche Google · Ouvert', r: '4,5', c: 61, you: false }];
  return (
    <div className="relative min-w-0 max-w-full">
      <div className="flex flex-wrap gap-2 mb-4">{list.map((x, i) => <button key={x.id} onClick={() => { setK(i); setAuto(false); }} className={`h-9 px-3.5 rounded-full text-[13px] transition-all ${i === k ? 'bg-white text-ink' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}>{x.short}</button>)}</div>
      <div className="rounded-[28px] overflow-hidden bg-[#F8F9FB] text-[#1F2328] shadow-[0_60px_120px_-40px_rgba(0,0,0,0.9)] ring-1 ring-white/10">
        <div className="px-5 pt-5 pb-4 border-b border-black/5">
          <div className="flex items-center gap-3 h-12 rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)] px-4"><Search size={18} className="text-[#5F6368]" /><span className="text-[15px]">{typed}<span className="caret">|</span></span></div>
        </div>
        <div className="p-5 space-y-2.5 min-h-[252px]">
          <AnimatePresence mode="popLayout" initial={false}>
            {rows.map((r) => (
              <motion.div layout key={r.n} initial={{ opacity: 0, y: 12 }} animate={{ opacity: (r as any).lost ? 0.45 : 1, y: 0 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                className={`flex items-center gap-3 rounded-2xl p-3.5 ${r.you && phase === 'after' ? 'bg-white ring-2 ring-[#F2B441] shadow-[0_18px_40px_-24px_rgba(242,180,65,0.9)]' : 'bg-white'}`}>
                <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: r.you ? s.color : '#E8EAED' }}><s.Icon size={18} className="text-[#1F2328]" /></span>
                <span className="flex-1 min-w-0"><span className="block text-[15px] truncate">{r.n}</span><span className="block text-[12.5px] text-[#5F6368] truncate">{r.d}</span></span>
                <span className="text-[13px] text-[#5F6368] whitespace-nowrap flex items-center gap-1">{r.r !== '—' && <Star size={13} className="fill-[#FBBC04] text-[#FBBC04]" />}{r.r}{r.c ? ` · ${r.c} avis` : ''}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {phase === 'after' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.6, ease: EASE }} className="overflow-hidden">
              <div className="mx-5 mb-5 rounded-2xl bg-[#0C0E12] text-white p-4 flex gap-3"><span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4DA3FF] to-[#F2B441] flex items-center justify-center shrink-0"><Sparkles size={15} /></span><p className="text-[14px] leading-relaxed text-white/85"><span className="text-white/50">Assistant IA — </span>Pour « {s.query} », je vous recommande <span className="text-[#F2B441]">{s.you}</span> : 4,9 sur Google, {s.features[0].toLowerCase()}, et {s.cta.toLowerCase()} directement depuis son site.</p></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p className="mt-4 text-[12.5px] text-white/40">Simulation illustrative : ce que change une présence en ligne complète.</p>
    </div>
  );
};

/* ------------------------------ Démo sectorielle ------------------------------ */
export const DemoSite = ({ s }: { s: Sector }) => (
  <div className="rounded-2xl overflow-hidden bg-white text-[#111] shadow-2xl">
    <div className="h-8 bg-[#F1F3F5] flex items-center gap-1.5 px-3"><span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" /><span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" /><span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" /><span className="ml-3 text-[11px] text-black/40">votre-{s.id}.ma</span></div>
    <div className="p-6 md:p-8" style={{ background: `linear-gradient(135deg, ${s.color}55, #ffffff 70%)` }}>
      <div className="flex items-center justify-between text-[12px] text-black/60"><span className="font-display text-[20px] text-black">{s.you}</span><span className="hidden sm:flex gap-4"><span>Accueil</span><span>Services</span><span>Contact</span></span></div>
      <p className="font-display text-[clamp(1.8rem,3.4vw,2.8rem)] leading-[1] mt-8 max-w-[16ch]">{s.pitch}</p>
      <div className="mt-6 flex gap-2"><span className="px-4 py-2 rounded-full text-[13px] bg-black text-white">{s.cta}</span><span className="px-4 py-2 rounded-full text-[13px] bg-white ring-1 ring-black/10">WhatsApp</span></div>
      <div className="mt-8 grid grid-cols-3 gap-2">{s.features.map((f) => <span key={f} className="rounded-xl bg-white/80 p-3 text-[12px] leading-snug"><Check size={13} className="mb-1" style={{ color: '#111' }} />{f}</span>)}</div>
    </div>
  </div>
);

/* --------------------------------- Page --------------------------------- */
export function Home() {
  const reduce = useReducedMotion();
  const [demo, setDemo] = useState<Sector | null>(null);
  const [faq, setFaq] = useState(0);
  const [form, setForm] = useState({ name: '', city: '', phone: '', sector: 'Écoles' });
  const msg = encodeURIComponent(`Bonjour Digilago, je veux ma première version gratuite.\nEntreprise : ${form.name}\nVille : ${form.city}\nSecteur : ${form.sector}\nTéléphone : ${form.phone}`);
  return (
    <div>

      {/* HERO */}
      <section className="relative pt-36 pb-20 lg:pt-44 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 grid-bg" /><div className="absolute -inset-x-20 -top-40 h-[700px] aurora" />
        <div className="wrap relative">
          <Reveal><Eyebrow>Agence digitale · Maroc</Eyebrow></Reveal>
          {/* Le titre prend toute la largeur, sur deux lignes */}
          <Reveal delay={0.1}><h1 className="mt-6 text-[clamp(2.6rem,5.7vw,6.2rem)] leading-[0.96] max-w-[22ch]">Si l’on ne vous trouve pas en ligne, <span className="italic text-gold">on choisit quelqu’un d’autre.</span></h1></Reveal>
          <div className="mt-12 lg:mt-16 grid lg:grid-cols-12 gap-12 lg:gap-10 items-start">
            <div className="lg:col-span-5 min-w-0">
              <Reveal delay={0.2}><p className="text-[1.15rem] leading-relaxed text-white/65 max-w-[46ch]">Site web, fiche Google, référencement classique et par IA : Digilago rend votre entreprise visible là où vos clients cherchent — partout au Maroc, dans tous les métiers.</p></Reveal>
              <Reveal delay={0.3} className="mt-8 flex flex-wrap gap-3"><a href="#demarrer" className="btn btn-gold">Voir ma première version gratuite <ArrowRight size={17} /></a><Link to="/web/realisations" className="btn btn-ghost">Nos réalisations</Link></Reveal>
              <Reveal delay={0.4}><ul className="mt-10 grid gap-3 text-[14px] text-white/70">{[[Zap, 'Première version en 72 h'], [ShieldCheck, '0 dirham avant validation'], [Code2, 'Code écrit à la main, sans modèle']].map(([I, t]: any) => <li key={t} className="flex items-center gap-2.5"><I size={17} className="text-gold" />{t}</li>)}</ul></Reveal>
            </div>
            <Reveal delay={0.3} className="lg:col-span-7 min-w-0"><Simulator /></Reveal>
          </div>
        </div>
      </section>

      {/* CONFIANCE */}
      <section className="py-10 border-b hairline"><div className="wrap flex flex-col md:flex-row md:items-center gap-6 md:gap-12 text-white/50 text-[14px]"><span className="shrink-0">Ils nous ont confié leur présence en ligne</span><div className="flex flex-wrap items-center gap-x-10 gap-y-3 font-display text-[1.5rem] text-white/80">{WORK.map((w) => <span key={w.name}>{w.name}</span>)}<span className="text-[14px] font-sans text-white/40">Écoles · El Jadida</span></div></div></section>

      {/* EST-CE CHER ? */}
      <section id="prix" className="py-28 lg:py-40 border-b hairline">
        <div className="wrap">
          <Title eyebrow="Parlons argent, sans chiffres" title={<>Une présence en ligne n’est pas chère. <span className="italic text-gold">C’est son absence qui coûte.</span></>} lead="Chaque jour sans site ni fiche Google, des clients qui vous cherchaient appellent le concurrent qui s’affiche. Le prix, lui, dépend de votre métier et de la complexité : un site vitrine coûte bien moins qu’une application de réservation. Dans tous les cas, il est juste, annoncé avant de commencer, et sans frais cachés." />
          <div className="mt-16 grid lg:grid-cols-3 gap-4">
            {[['Ce que coûte l’absence', ['Des clients qui appellent le concurrent visible', 'Des avis Google qui vont ailleurs', 'Une réputation que vous ne contrôlez pas', 'Des recommandations d’IA sans vous'], '#F4A099'], ['Ce que vous payez', ['Un prix selon votre métier et la complexité', 'Annoncé avant de commencer, jamais après', 'Domaine, hébergement et sécurité gérés', 'Rien tant que la première version ne vous plaît pas'], '#F2B441'], ['Ce que vous gardez', ['Votre site, votre nom de domaine, vos données', 'Un site qui vous appartient, pas un abonnement piège', 'Le droit de tout modifier, ou de partir', 'Un interlocuteur joignable après la mise en ligne'], '#A8E063']].map(([t, items, c]: any, i) => (
              <Reveal key={t} delay={i * 0.1} className="glass rounded-[28px] p-8 relative overflow-hidden"><div className="absolute -right-12 -top-12 w-44 h-44 rounded-full blur-3xl opacity-20" style={{ background: c }} /><h3 className="text-[2rem] leading-none">{t}</h3><ul className="mt-6 space-y-3 text-[15px] text-white/75">{items.map((x: string) => <li key={x} className="flex gap-2.5"><Check size={16} className="shrink-0 mt-0.5" style={{ color: c }} />{x}</li>)}</ul></Reveal>
            ))}
          </div>
          {/* Ce qui ne change jamais */}
          <Reveal delay={0.2} className="mt-8 rounded-[28px] bg-gradient-to-br from-[#1B2233] to-ink ring-1 ring-gold/30 p-8 md:p-10 grid md:grid-cols-[1fr_auto] gap-8 items-center">
            <div><p className="text-[12px] uppercase tracking-[0.2em] text-gold">Ce qui ne change jamais, quel que soit le pack</p><ul className="mt-5 grid sm:grid-cols-2 gap-x-8 gap-y-3 text-[15px] text-white/85">{['Première version gratuite en 72 h', '0 dirham avant validation', 'Trois séries de retouches incluses', 'Vous restez propriétaire de tout', 'Livraison clés en main', 'Un interlocuteur joignable après'].map((g) => <li key={g} className="flex gap-2.5"><ShieldCheck size={16} className="text-gold shrink-0 mt-0.5" />{g}</li>)}</ul></div>
            <Link to="/web/contact" className="btn btn-gold shrink-0">Demander mon prix <ArrowRight size={17} /></Link>
          </Reveal>
        </div>
      </section>

      {/* MÉTIERS EN DÉFILEMENT */}
      <section className="py-10 border-y hairline marquee-wrap"><div className="marquee" style={{ ['--d' as any]: '60s' }}>{[0, 1].map((r) => <div key={r} className="flex items-center gap-12 pr-12">{SECTORS.map((s) => <span key={s.id + r} className="flex items-center gap-4 font-display text-[clamp(2rem,3.4vw,3.2rem)] text-white/85 whitespace-nowrap"><s.Icon size={26} style={{ color: s.color }} />{s.name}</span>)}</div>)}</div></section>

      {/* POURQUOI */}
      <section id="pourquoi" className="py-28 lg:py-40">
        <div className="wrap">
          <Title eyebrow="Pourquoi être en ligne" title={<>Vos clients vous cherchent <span className="italic text-gold">à trois endroits.</span></>} lead="Avant d’appeler, de réserver ou de se déplacer, presque tout le monde tape quelques mots sur Google ou pose la question à une IA. Une entreprise absente de ces trois endroits n’existe pas à ce moment-là." />
          <div className="mt-16 grid md:grid-cols-3 gap-4">
            {[[Search, 'Google', 'Les résultats de recherche', 'Un site rapide et bien référencé, en tête pour votre métier et votre ville.', '#4DA3FF'], [MapPin, 'Google Maps', 'La carte et les avis', 'Une fiche complète : horaires, photos, avis, itinéraire, appel direct.', '#A8C08C'], [Sparkles, 'Les IA', 'ChatGPT, Gemini, Perplexity', 'Les assistants citent les entreprises qu’ils connaissent. Le GEO fait de vous l’une d’elles.', '#F2B441']].map(([I, t, s, d, c]: any, i) => (
              <Reveal key={t} delay={i * 0.1} className="group glass rounded-[28px] p-8 relative overflow-hidden min-h-[320px] flex flex-col">
                <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full blur-3xl opacity-25 group-hover:opacity-45 transition-opacity" style={{ background: c }} />
                <span className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${c}22`, color: c }}><I size={26} /></span>
                <p className="mt-auto pt-10 text-[13px] uppercase tracking-[0.18em] text-white/45">{s}</p><h3 className="mt-2 text-[2.6rem] leading-none">{t}</h3><p className="mt-4 text-white/65">{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-28 lg:py-40 bg-ink-2/60 border-y hairline">
        <div className="wrap grid lg:grid-cols-12 gap-14">
          <div className="lg:col-span-4 lg:sticky lg:top-28 self-start"><Title eyebrow="Services" title={<>Toute votre présence, <span className="italic text-gold">d’une seule main.</span></>} lead="Un interlocuteur, un prix clair, et tout ce qu’il faut pour exister sérieusement en ligne." /></div>
          <ul className="lg:col-span-8 grid sm:grid-cols-2 gap-px bg-white/[0.07] rounded-[28px] overflow-hidden">
            {SERVICES.map((s, i) => <li key={s.title} className="bg-ink p-8 group hover:bg-ink-2 transition-colors"><Reveal delay={(i % 2) * 0.08}><s.Icon size={28} className="text-gold transition-transform group-hover:-translate-y-1" /><h3 className="mt-6 text-[1.9rem] leading-tight">{s.title}</h3><p className="mt-3 text-white/60 text-[15px]">{s.text}</p></Reveal></li>)}
          </ul>
        </div>
      </section>

      {/* SECTEURS */}
      <section id="secteurs" className="py-28 lg:py-40">
        <div className="wrap">
          <Title eyebrow="Tous les métiers" title={<>Un site pensé pour <span className="italic text-gold">votre métier.</span></>} lead="Un club de padel ne vend pas comme une clinique. Chaque secteur a ses questions, ses gestes, son bouton principal. Ouvrez une démo pour voir ce que recevrait une entreprise de votre domaine." />
          <div className="mt-14"><AutoShowcase interval={4200} items={LIBRARY.map((c) => ({ key: c.name.toLowerCase().replace(/[^a-z0-9]+/g, ''), title: c.name, subtitle: `${c.sector} · ${c.city}`, color: c.color, render: () => <img src={c.img} alt={`Site ${c.name}`} className="w-full h-full object-cover object-top" /> }))} /></div>
          <div className="mt-20"><Library compact /></div>
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SECTORS.map((s, i) => (
              <Reveal key={s.id} delay={(i % 4) * 0.06}>
                <button onClick={() => setDemo(s)} className="group w-full text-left rounded-[24px] p-6 glass hover:bg-white/[0.08] transition-all hover:-translate-y-1 relative overflow-hidden h-full">
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity" style={{ background: s.color }} />
                  <span className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${s.color}22`, color: s.color }}><s.Icon size={22} /></span>
                  <h3 className="mt-6 text-[1.7rem] leading-tight">{s.name}</h3><p className="mt-2 text-[14.5px] text-white/55">{s.pitch}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-[14px] text-white/80 group-hover:text-gold transition-colors">Voir la démo <ArrowUpRight size={15} /></span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* RÉALISATIONS */}
      <section id="realisations" className="py-28 lg:py-40 border-t hairline">
        <div className="wrap">
          <Title eyebrow="Réalisations" title={<>Des sites déjà en service, <span className="italic text-gold">pensés un par un.</span></>} lead="Les aperçus défilent d’eux-mêmes ; survolez pour faire une pause, cliquez pour choisir." />
          <div className="mt-14"><AutoShowcase items={WORK.map((w) => ({ key: w.name.toLowerCase().replace(/[^a-z]+/g, '-'), title: w.name, subtitle: `${w.sector} · ${w.place}`, url: w.url || undefined, color: w.color, render: () => <img src={w.img} alt={`Site ${w.name}`} className="w-full h-full object-cover object-top" /> }))} /></div>
          <Reveal className="mt-10"><Link to="/web/realisations" className="btn btn-ghost">Toutes les réalisations et démos <ArrowUpRight size={16} /></Link></Reveal>
        </div>
      </section>

      {/* MÉTHODE */}
      <section id="methode" className="py-28 lg:py-40 bg-paper text-ink">
        <div className="wrap">
          <Reveal className="max-w-[820px]"><p className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.22em] text-navy"><span className="w-1.5 h-1.5 rounded-full bg-gold" />Méthode</p><h2 className="mt-6 text-[clamp(2.6rem,5.2vw,5.2rem)] leading-[0.98]">Vous voyez votre site <span className="italic text-navy">avant de payer.</span></h2></Reveal>
          <ol className="mt-16 grid md:grid-cols-4 gap-4">
            {STEPS.map((s, i) => <Reveal key={s.n} delay={i * 0.1} className="rounded-[26px] bg-white p-8 shadow-[0_30px_60px_-40px_rgba(12,14,18,0.35)]"><span className="font-display text-[3.6rem] leading-none text-gold">{s.n}</span><h3 className="mt-8 text-[1.8rem] leading-tight">{s.title}</h3><p className="mt-3 text-ink/65 text-[15px]">{s.text}</p></Reveal>)}
          </ol>
        </div>
      </section>

      {/* PACKS */}
      <section id="packs" className="py-28 lg:py-40">
        <div className="wrap">
          <Title center eyebrow="Packs par métier" title={<>Un pack pensé pour <span className="italic text-gold">votre activité.</span></>} lead="Sport, santé, éducation, hospitalité, commerce, services ou sur-mesure : chaque pack réunit ce qui fait venir des clients dans votre métier. Vous voyez d’abord une première version, gratuitement." />
          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PACKS.slice(0, 6).map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 0.08} className="group glass rounded-[28px] p-8 relative overflow-hidden hover:-translate-y-1 transition-transform">
                <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" style={{ background: p.color }} />
                <p className="text-[12px] uppercase tracking-[0.18em]" style={{ color: p.color }}>{p.for}</p>
                <h3 className="mt-3 text-[2.1rem] leading-none">{p.name}</h3>
                <ul className="mt-6 space-y-2.5 text-[15px] text-white/75">{p.items.slice(0, 4).map((it) => <li key={it} className="flex gap-2.5"><Check size={16} className="shrink-0 mt-0.5" style={{ color: p.color }} />{it}</li>)}</ul>
                <Link to="/web/packs" className="mt-8 inline-flex items-center gap-1.5 text-[14px] text-white/80 group-hover:text-gold transition-colors">Voir le pack complet <ArrowUpRight size={15} /></Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-28 lg:py-36 border-t hairline">
        <div className="wrap grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4"><Title eyebrow="Questions" title={<>Ce qu’on nous <span className="italic text-gold">demande souvent.</span></>} /></div>
          <div className="lg:col-span-8 divide-y divide-white/10 border-y border-white/10">
            {FAQ.map((f, i) => (
              <div key={f.q}>
                <button onClick={() => setFaq(faq === i ? -1 : i)} className="w-full flex items-center justify-between gap-6 py-6 text-left"><span className="text-[1.25rem]">{f.q}</span><span className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${faq === i ? 'bg-gold text-ink rotate-45' : 'bg-white/10'}`}><Plus size={16} /></span></button>
                <AnimatePresence initial={false}>{faq === i && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden text-white/60 pb-6 max-w-[64ch]">{f.a}</motion.p>}</AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DÉMARRER */}
      <section id="demarrer" className="py-24 lg:py-32">
        <div className="wrap">
          <div className="relative rounded-[36px] overflow-hidden p-8 md:p-16 bg-gradient-to-br from-navy via-[#0A2340] to-ink ring-1 ring-white/10">
            <div className="absolute inset-0 grid-bg opacity-60" /><div className="absolute -right-20 -top-20 w-[420px] h-[420px] rounded-full bg-gold/25 blur-3xl" />
            <div className="relative grid lg:grid-cols-2 gap-12 items-center">
              <div><Eyebrow>0 dirham avant validation</Eyebrow><h2 className="mt-6 text-[clamp(2.6rem,5vw,5rem)] leading-[0.98]">Voyez votre site <span className="italic text-gold">dans 72 heures.</span></h2><p className="mt-6 text-white/70 max-w-[46ch]">Donnez-nous le nom de votre entreprise. Nous construisons une première version, vous décidez ensuite.</p>
                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-white/80"><a href={`tel:${CONTACT.tel}`} className="flex items-center gap-2 hover:text-gold"><Phone size={16} />{CONTACT.phone}</a><a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 hover:text-gold"><Mail size={16} />{CONTACT.email}</a></div></div>
              <form className="glass rounded-[26px] p-6 md:p-8 grid gap-3" onSubmit={(e) => { e.preventDefault(); window.open(`https://wa.me/212649953813?text=${msg}`, '_blank'); }}>
                {[['name', 'Nom de votre entreprise'], ['city', 'Ville'], ['phone', 'Téléphone']].map(([k, p]) => <input key={k} required={k !== 'phone'} placeholder={p} value={(form as any)[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="h-12 rounded-2xl bg-white/[0.06] border border-white/10 px-4 placeholder:text-white/40 focus:outline-none focus:border-gold" />)}
                <select value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value })} className="h-12 rounded-2xl bg-white/[0.06] border border-white/10 px-4 focus:outline-none focus:border-gold">{SECTORS.map((s) => <option key={s.id} className="text-ink">{s.short}</option>)}<option className="text-ink">Autre</option></select>
                <button className="btn btn-gold justify-center mt-2">Recevoir ma première version <ArrowRight size={17} /></button>
                <p className="text-[12.5px] text-white/45 text-center">Envoi par WhatsApp · réponse le jour même</p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Modale démo */}
      <AnimatePresence>{demo && (
        <motion.div className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-md flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDemo(null)}>
          <motion.div className="w-full max-w-[860px]" initial={{ y: 30, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 26 }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4"><p className="text-white/70">Démo sectorielle · <span className="text-white">{demo.name}</span></p><button onClick={() => setDemo(null)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center" aria-label="Fermer"><X size={18} /></button></div>
            <DemoSite s={demo} />
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4"><p className="text-[14px] text-white/55">Exemple de structure. Votre site reçoit votre nom, vos photos, vos couleurs et vos textes.</p><a href="#demarrer" onClick={() => setDemo(null)} className="btn btn-gold">Le même pour mon entreprise <ArrowRight size={17} /></a></div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>
    </div>
  );
}
