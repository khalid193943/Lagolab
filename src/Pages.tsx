import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ArrowRight, ArrowUpRight, Check, X, Cpu, Lightbulb, ShoppingCart, Phone, Mail, MessageCircle, Gauge } from 'lucide-react';
import { SECTORS, SERVICES, WORK, PACKS, TECH, AGENCY, CONTACT, LABS, Sector } from './data';
import { Reveal, Eyebrow, Title, DemoSite } from './App';
import { Library } from './Library';
import { AutoShowcase } from './Showcase';

const Hero = ({ eyebrow, title, lead, children }: { eyebrow: string; title: React.ReactNode; lead?: string; children?: React.ReactNode }) => (
  <section className="relative pt-36 pb-20 lg:pt-44 lg:pb-28 overflow-hidden"><div className="absolute inset-0 grid-bg" /><div className="absolute -inset-x-20 -top-40 h-[600px] aurora" />
    <div className="wrap relative max-w-[900px]"><Reveal><Eyebrow>{eyebrow}</Eyebrow></Reveal><Reveal delay={0.1}><h1 className="mt-7 text-[clamp(3rem,6.4vw,6.6rem)] leading-[0.94]">{title}</h1></Reveal>{lead && <Reveal delay={0.2}><p className="mt-8 text-[1.2rem] leading-relaxed text-white/65 max-w-[56ch]">{lead}</p></Reveal>}{children && <Reveal delay={0.3} className="mt-10 flex flex-wrap gap-3">{children}</Reveal>}</div>
  </section>
);
const Cta = () => (
  <section className="py-24"><div className="wrap"><div className="relative rounded-[36px] overflow-hidden p-8 md:p-14 bg-gradient-to-br from-navy via-[#0A2340] to-ink ring-1 ring-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-8"><div className="absolute -right-20 -top-20 w-[380px] h-[380px] rounded-full bg-gold/25 blur-3xl" /><div className="relative"><Eyebrow>0 dirham avant validation</Eyebrow><h2 className="mt-5 text-[clamp(2.2rem,4vw,3.8rem)] leading-[1]">Voyez votre site <span className="italic text-gold">dans 72 heures.</span></h2></div><Link to="/web/contact" className="relative btn btn-gold">Ma première version gratuite <ArrowRight size={17} /></Link></div></div></section>
);

/* ------------------------------ Agence ------------------------------ */
export const Agence = () => (
  <main>
    <Hero eyebrow="L’agence" title={<>Née à El Jadida. <span className="italic text-gold">Tournée vers tout le Maroc.</span></>} lead={AGENCY.story} />
    <section className="wrap grid lg:grid-cols-2 gap-5 pb-28">
      {[['Notre objectif', AGENCY.mission, 'from-[#1B2233] to-ink ring-gold/40'], ['Notre vision', AGENCY.vision, 'glass']].map(([t, d, c], i) => <Reveal key={String(t)} delay={i * 0.1} className={`rounded-[30px] p-9 md:p-12 ${String(c).startsWith('from') ? 'bg-gradient-to-br ring-1 ' + c : c}`}><Eyebrow>{t}</Eyebrow><p className="mt-6 text-[clamp(1.5rem,2.4vw,2.2rem)] leading-[1.25] font-display">{d}</p></Reveal>)}
    </section>
    <section className="py-28 bg-paper text-ink"><div className="wrap"><Reveal className="max-w-[820px]"><p className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.22em] text-navy"><span className="w-1.5 h-1.5 rounded-full bg-gold" />Ce qui nous guide</p><h2 className="mt-6 text-[clamp(2.4rem,4.6vw,4.6rem)] leading-[0.98]">Quatre engagements, <span className="italic text-navy">tenus sur chaque projet.</span></h2></Reveal>
      <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{AGENCY.values.map(([t, d], i) => <Reveal key={t} delay={i * 0.08} className="rounded-[26px] bg-white p-8 shadow-[0_30px_60px_-40px_rgba(12,14,18,0.35)]"><span className="font-display text-[2.6rem] text-gold leading-none">0{i + 1}</span><h3 className="mt-6 text-[1.7rem] leading-tight">{t}</h3><p className="mt-3 text-ink/65 text-[15px]">{d}</p></Reveal>)}</div>
      <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6 pt-10 border-t border-ink/10">{AGENCY.numbers.map(([n, l], i) => <Reveal key={l} delay={i * 0.06}><p className="font-display text-[3.6rem] leading-none text-navy">{n}</p><p className="mt-2 text-ink/65">{l}</p></Reveal>)}</div>
    </div></section>
    <Cta />
  </main>
);

/* ------------------------------ Technologie ------------------------------ */
const Ring = ({ v, label, delay }: { v: number; label: string; delay: number }) => {
  const reduce = useReducedMotion(); const r = 44, c = 2 * Math.PI * r;
  return <div className="flex flex-col items-center gap-3"><svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90"><circle cx="50" cy="50" r={r} stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="none" /><motion.circle cx="50" cy="50" r={r} stroke="#A8E063" strokeWidth="8" strokeLinecap="round" fill="none" strokeDasharray={c} initial={reduce ? false : { strokeDashoffset: c }} whileInView={{ strokeDashoffset: c * (1 - v / 100) }} viewport={{ once: true }} transition={{ duration: 1.6, delay, ease: [0.16, 1, 0.3, 1] }} /></svg><span className="-mt-[5.5rem] font-display text-[2rem]">{v}</span><span className="mt-10 text-[13px] text-white/55">{label}</span></div>;
};
export const Technologie = () => (
  <main>
    <Hero eyebrow="Technologie" title={<>Construit avec les outils <span className="italic text-gold">de 2027, pas de 2015.</span></>} lead="La plupart des sites au Maroc sont encore assemblés sur des modèles lents et fragiles. Nous écrivons chaque site avec le JavaScript le plus récent, hébergé au plus près de vos clients, lisible par Google et par les IA." />
    <section className="wrap pb-24"><Reveal className="glass rounded-[30px] p-8 md:p-12 grid md:grid-cols-[1fr_auto] gap-10 items-center"><div><p className="inline-flex items-center gap-2 text-gold"><Gauge size={18} /> Score Lighthouse visé sur chaque livraison</p><p className="mt-4 text-white/65 max-w-[52ch]">Performance, accessibilité, bonnes pratiques et SEO : quatre scores mesurés par Google. Un site rapide se classe mieux et convertit plus.</p></div><div className="flex gap-6">{[['Performance', 0], ['Accessibilité', 0.1], ['Bonnes pratiques', 0.2], ['SEO', 0.3]].map(([l, d]) => <Ring key={String(l)} v={100} label={String(l)} delay={Number(d)} />)}</div></Reveal></section>
    <section className="wrap pb-28 grid lg:grid-cols-2 gap-4">
      {TECH.map((t, i) => <Reveal key={t.group} delay={(i % 2) * 0.08} className="glass rounded-[28px] p-8"><Eyebrow>{t.group}</Eyebrow><p className="mt-4 text-white/65">{t.text}</p><ul className="mt-6 flex flex-wrap gap-2">{t.items.map((x) => <li key={x} className="px-3.5 py-1.5 rounded-full text-[14px] bg-white/[0.06] ring-1 ring-white/10">{x}</li>)}</ul></Reveal>)}
    </section>
    <section className="py-28 bg-paper text-ink"><div className="wrap"><Reveal className="max-w-[820px]"><p className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.22em] text-navy"><span className="w-1.5 h-1.5 rounded-full bg-gold" />Concrètement</p><h2 className="mt-6 text-[clamp(2.4rem,4.6vw,4.6rem)] leading-[0.98]">Ce que la technologie <span className="italic text-navy">change pour vous.</span></h2></Reveal>
      <div className="mt-14 grid md:grid-cols-3 gap-4">{[['Chargé en moins d’une seconde', 'Sur un téléphone en 4G, votre client voit votre page avant d’avoir le temps de partir.'], ['Trouvé par Google et par les IA', 'Données structurées, textes lisibles par les machines, fiche Google reliée : vous existez partout.'], ['Prêt pour la suite', 'Réservation, paiement, application mobile : le socle est fait pour grandir sans tout refaire.']].map(([t, d], i) => <Reveal key={t} delay={i * 0.08} className="rounded-[26px] bg-white p-8"><Check size={22} className="text-navy" /><h3 className="mt-5 text-[1.7rem] leading-tight">{t}</h3><p className="mt-3 text-ink/65 text-[15px]">{d}</p></Reveal>)}</div></div></section>
    <Cta />
  </main>
);

/* ------------------------------ Services ------------------------------ */
export const Services = () => (
  <main>
    <Hero eyebrow="Services" title={<>Tout ce qu’il faut pour exister en ligne, <span className="italic text-gold">et pour grandir.</span></>} lead="Du site vitrine à la plateforme sur-mesure : un seul interlocuteur, une même exigence." />
    <section className="wrap pb-24"><ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.07] rounded-[28px] overflow-hidden">{SERVICES.map((s, i) => <li key={s.title} className="bg-ink p-8 hover:bg-ink-2 transition-colors"><Reveal delay={(i % 3) * 0.06}><s.Icon size={26} className="text-gold" /><h3 className="mt-6 text-[1.8rem] leading-tight">{s.title}</h3><p className="mt-3 text-white/60 text-[15px]">{s.text}</p></Reveal></li>)}</ul></section>
    <section className="wrap pb-28 grid lg:grid-cols-3 gap-4">
      {[[Cpu, 'SaaS & applications', 'Votre propre logiciel : réservations, planning, facturation, espace clients ou membres. Hébergé, sécurisé, évolutif. Vous le louez à vos propres clients si vous le souhaitez.', '#4DA3FF', ['Web et mobile', 'Tableaux de bord', 'Abonnements']], [Lightbulb, 'Ideas Lab', 'Vous avez une idée d’application ou de service ? Nous la prototypons en deux semaines, avec de vrais écrans, pour la tester avant d’investir.', '#F2B441', ['Prototype cliquable', 'Test utilisateurs', 'Feuille de route']], [ShoppingCart, 'E-commerce', 'Une boutique qui vend partout au Maroc : catalogue, paiement à la livraison ou par carte, suivi des commandes, publicité ciblée.', '#F4A099', ['Paiement CMI', 'Livraison', 'Publicité Meta et Google']]].map(([I, t, d, c, tags]: any, i) => (
        <Reveal key={t} delay={i * 0.1} className="group rounded-[30px] p-9 relative overflow-hidden bg-gradient-to-b from-[#161A23] to-ink ring-1 ring-white/10 hover:ring-white/25 transition-all"><div className="absolute -right-14 -top-14 w-52 h-52 rounded-full blur-3xl opacity-25" style={{ background: c }} /><I size={30} style={{ color: c }} /><h3 className="mt-8 text-[2.2rem] leading-none">{t}</h3><p className="mt-4 text-white/65">{d}</p><ul className="mt-6 flex flex-wrap gap-2">{tags.map((x: string) => <li key={x} className="px-3 py-1 rounded-full text-[13px] bg-white/[0.06]">{x}</li>)}</ul></Reveal>
      ))}
    </section>
    <Cta />
  </main>
);

/* ------------------------------ Réalisations ------------------------------ */
export const Realisations = () => {
  const [demo, setDemo] = useState<Sector | null>(null);
  return (
    <main>
      <Hero eyebrow="Réalisations" title={<>Des sites en service, <span className="italic text-gold">et un concept pour chaque métier.</span></>} lead="Trois établissements accompagnés de bout en bout, puis une bibliothèque de vingt-sept concepts : chaque métier voit à quoi ressemblerait son site." />
      <section className="wrap pb-16"><AutoShowcase items={WORK.map((w) => ({ key: w.name.toLowerCase().replace(/[^a-z]+/g, '-'), title: w.name, subtitle: `${w.sector} · ${w.place}`, url: w.url || undefined, color: w.color, render: () => <img src={w.img} alt={`Site ${w.name}`} className="w-full h-full object-cover object-top" /> }))} /></section>
      <section className="wrap pb-24 grid lg:grid-cols-3 gap-5">
        {WORK.map((w, i) => <Reveal key={w.name} delay={i * 0.08}><a href={w.url || '/web/contact'} target={w.url ? '_blank' : undefined} rel="noopener noreferrer" className="group block"><div className="rounded-[26px] overflow-hidden glass p-2"><div className="rounded-[20px] overflow-hidden aspect-[16/10]"><img src={w.img} alt={`Site ${w.name}`} className="w-full h-full object-cover object-top transition-transform duration-[1600ms] group-hover:scale-[1.04]" loading="lazy" /></div></div><p className="mt-5 text-[12px] uppercase tracking-[0.18em]" style={{ color: w.color }}>{w.sector} · {w.place}</p><h3 className="mt-2 text-[2rem] leading-none">{w.name}</h3><ul className="mt-4 flex flex-wrap gap-2">{w.tags.map((t) => <li key={t} className="px-3 py-1 rounded-full text-[13px] bg-white/[0.06] text-white/70">{t}</li>)}</ul></a></Reveal>)}
      </section>
      <section className="wrap pb-28"><Title eyebrow="Bibliothèque" title={<>Vingt-sept métiers, <span className="italic text-gold">vingt-sept sites qui bougent.</span></>} lead="Survolez un site : il défile. Cliquez : sa fiche s’ouvre, avec son logo, sa ville, son bouton principal et tout ce qu’il contient. Ce sont des concepts par métier : le vôtre recevra votre nom, vos photos et vos couleurs." />
        <div className="mt-12"><Library /></div>
      </section>
      <Cta />
      <AnimatePresence>{demo && <motion.div className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-md flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDemo(null)}><motion.div className="w-full max-w-[860px]" initial={{ y: 30 }} animate={{ y: 0 }} exit={{ y: 20, opacity: 0 }} onClick={(e) => e.stopPropagation()}><div className="flex items-center justify-between mb-4"><p className="text-white/70">Démo sectorielle · <span className="text-white">{demo.name}</span></p><button onClick={() => setDemo(null)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center" aria-label="Fermer"><X size={18} /></button></div><DemoSite s={demo} /><div className="mt-5 flex flex-wrap items-center justify-between gap-4"><p className="text-[14px] text-white/55">Exemple de structure : votre site reçoit votre nom, vos photos, vos couleurs.</p><Link to="/web/contact" className="btn btn-gold">Le même pour mon entreprise <ArrowRight size={17} /></Link></div></motion.div></motion.div>}</AnimatePresence>
    </main>
  );
};

/* ------------------------------ Packs ------------------------------ */
export const Packs = () => (
  <main>
    <Hero eyebrow="Packs par métier" title={<>Chaque métier a son pack. <span className="italic text-gold">Aucun n’a de surprise.</span></>} lead="Les prix dépendent de votre projet ; nous les chiffrons après un court échange. Ce qui ne change jamais : vous voyez une première version gratuite avant de décider." />
    <section className="wrap pb-28 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {PACKS.map((p, i) => <Reveal key={p.id} delay={(i % 3) * 0.08} className={`group rounded-[28px] p-8 relative overflow-hidden hover:-translate-y-1 transition-transform ${p.id === 'saas' ? 'bg-gradient-to-br from-[#1B2233] to-ink ring-1 ring-gold/40 lg:col-span-3 lg:grid lg:grid-cols-2 lg:gap-10' : 'glass'}`}><div className="absolute -right-12 -top-12 w-44 h-44 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" style={{ background: p.color }} /><div><p className="text-[12px] uppercase tracking-[0.18em]" style={{ color: p.color }}>{p.for}</p><h3 className="mt-3 text-[2.2rem] leading-none">{p.name}</h3><Link to="/web/contact" className="mt-8 hidden lg:inline-flex btn btn-ghost">Demander ce pack <ArrowRight size={16} /></Link></div><ul className="mt-6 lg:mt-0 space-y-2.5 text-[15px] text-white/75">{p.items.map((it) => <li key={it} className="flex gap-2.5"><Check size={16} className="shrink-0 mt-0.5" style={{ color: p.color }} />{it}</li>)}</ul><Link to="/web/contact" className="mt-8 inline-flex lg:hidden items-center gap-1.5 text-[14px] text-gold">Demander ce pack <ArrowRight size={15} /></Link></Reveal>)}
    </section>
    <Cta />
  </main>
);

/* ------------------------------ Contact ------------------------------ */
export const Contact = () => {
  const [f, setF] = useState({ name: '', city: '', phone: '', sector: 'Écoles', msg: '' });
  const text = encodeURIComponent(`Bonjour Digilago, je veux ma première version gratuite.\nEntreprise : ${f.name}\nVille : ${f.city}\nSecteur : ${f.sector}\nTéléphone : ${f.phone}\n${f.msg}`);
  const cls = 'h-12 rounded-2xl bg-white/[0.06] border border-white/10 px-4 placeholder:text-white/40 focus:outline-none focus:border-gold';
  return (
    <main>
      <Hero eyebrow="Démarrer" title={<>Donnez-nous un nom. <span className="italic text-gold">Le reste, c’est notre travail.</span></>} lead="Le nom de votre entreprise, votre ville, votre métier. Vous recevez une première version en 72 heures, gratuitement." />
      <section className="wrap pb-28 grid lg:grid-cols-12 gap-10">
        <Reveal className="lg:col-span-5 space-y-5"><div className="glass rounded-[26px] p-7"><Eyebrow>Nous joindre</Eyebrow><a href={`tel:${CONTACT.tel}`} className="mt-5 flex items-center gap-3 text-[1.3rem] hover:text-gold"><Phone size={20} className="text-gold" />{CONTACT.phone}</a><a href={`mailto:${CONTACT.email}`} className="mt-3 flex items-center gap-3 text-[1.1rem] hover:text-gold"><Mail size={20} className="text-gold" />{CONTACT.email}</a><a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="mt-6 btn btn-ghost"><MessageCircle size={17} /> Écrire sur WhatsApp</a></div><div className="glass rounded-[26px] p-7 text-white/65 text-[15px]">Réponse le jour même, du lundi au samedi. Digilago est basée à El Jadida et travaille partout au Maroc, à distance ou sur place.</div></Reveal>
        <Reveal delay={0.1} className="lg:col-span-7"><form className="glass rounded-[30px] p-7 md:p-10 grid sm:grid-cols-2 gap-3" onSubmit={(e) => { e.preventDefault(); window.open(`https://wa.me/212649953813?text=${text}`, '_blank'); }}>
          <input required placeholder="Nom de votre entreprise" className={cls} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /><input required placeholder="Ville" className={cls} value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} />
          <input placeholder="Téléphone" className={cls} value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /><select className={cls} value={f.sector} onChange={(e) => setF({ ...f, sector: e.target.value })}>{SECTORS.map((s) => <option key={s.id} className="text-ink">{s.short}</option>)}<option className="text-ink">SaaS / application</option><option className="text-ink">Autre</option></select>
          <textarea placeholder="Votre projet en quelques mots (facultatif)" rows={4} className={`${cls} sm:col-span-2 h-auto py-3`} value={f.msg} onChange={(e) => setF({ ...f, msg: e.target.value })} />
          <button className="btn btn-gold justify-center sm:col-span-2 mt-2">Recevoir ma première version <ArrowRight size={17} /></button><p className="sm:col-span-2 text-[12.5px] text-white/45 text-center">Envoi par WhatsApp · première version sous 72 h · 0 dirham avant validation</p>
        </form></Reveal>
      </section>
    </main>
  );
};

/* ------------------------------ Digilago — la maison mère ------------------------------ */
export const Group = () => (
  <main>
    <section className="relative pt-40 pb-24 lg:pt-48 lg:pb-32 overflow-hidden"><div className="absolute inset-0 grid-bg" /><div className="absolute -inset-x-20 -top-40 h-[700px] aurora" />
      <div className="wrap relative">
        <Reveal><Eyebrow>Groupe Digilago · El Jadida · Maroc</Eyebrow></Reveal>
        <Reveal delay={0.1}><h1 className="mt-6 text-[clamp(2.8rem,6.4vw,7rem)] leading-[0.94] max-w-[20ch]">Nous rendons les entreprises marocaines <span className="italic text-gold">trouvables,</span> et nous construisons nos propres produits.</h1></Reveal>
        <Reveal delay={0.2}><p className="mt-8 text-[1.2rem] leading-relaxed text-white/65 max-w-[56ch]">{AGENCY.mission}</p></Reveal>
      </div>
    </section>
    {/* Les deux portes */}
    <section className="wrap pb-28 grid lg:grid-cols-2 gap-5">
      <Reveal className="group relative rounded-[36px] overflow-hidden p-9 md:p-14 min-h-[480px] flex flex-col justify-end bg-gradient-to-br from-[#1B2233] to-ink ring-1 ring-gold/40"><div className="absolute -right-20 -top-20 w-[420px] h-[420px] rounded-full bg-gold/25 blur-3xl group-hover:bg-gold/40 transition-colors" /><p className="relative eyebrow text-gold text-[12px] uppercase tracking-[0.22em]">Digilago · Présence en ligne</p><p className="relative mt-4 font-display text-[clamp(3rem,6vw,5.6rem)] leading-none">Être trouvé<span className="text-gold">.</span></p><p className="relative mt-5 text-white/70 max-w-[42ch]">Sites web, fiche Google, référencement classique et par IA, e-commerce. Première version en 72 heures, 0 dirham avant validation.</p><Link to="/web" className="relative btn btn-gold mt-8 w-fit">Découvrir la présence en ligne <ArrowRight size={17} /></Link></Reveal>
      <Reveal delay={0.1} className="group relative rounded-[36px] overflow-hidden p-9 md:p-14 min-h-[480px] flex flex-col justify-end bg-[#F4F6FF] text-ink ring-1 ring-black/5"><div className="absolute -right-20 -top-20 w-[420px] h-[420px] rounded-full bg-[#7C3AED]/25 blur-3xl group-hover:bg-[#2D5BFF]/35 transition-colors" /><div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(rgba(45,91,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(45,91,255,0.08) 1px, transparent 1px)', backgroundSize: '48px 48px' }} /><p className="relative text-[12px] uppercase tracking-[0.22em] text-[#2D5BFF]">Digilago Labs · Nos propres produits</p><p className="relative mt-4 font-display text-[clamp(3rem,6vw,5.6rem)] leading-none text-ink">Inventer<span className="text-[#2D5BFF]">.</span></p><p className="relative mt-5 text-ink/65 max-w-[42ch]">Applications, SaaS et outils d’intelligence artificielle, nés des besoins vus chez nos clients. Le laboratoire du groupe.</p><Link to="/labs" className="relative btn mt-8 w-fit bg-ink text-white hover:bg-[#2D5BFF]">Entrer au Labs <ArrowRight size={17} /></Link></Reveal>
    </section>
    {/* Histoire, vision, valeurs, chiffres */}
    <section id="groupe" className="wrap pb-28 grid lg:grid-cols-2 gap-5 scroll-mt-28">
      <Reveal className="glass rounded-[30px] p-9 md:p-12"><Eyebrow>Notre histoire</Eyebrow><p className="mt-6 text-[1.15rem] leading-relaxed text-white/75">{AGENCY.story}</p></Reveal>
      <Reveal delay={0.1} className="glass rounded-[30px] p-9 md:p-12"><Eyebrow>Notre vision</Eyebrow><p className="mt-6 font-display text-[clamp(1.4rem,2.2vw,2rem)] leading-[1.25]">{AGENCY.vision}</p></Reveal>
    </section>
    <section className="py-28 bg-paper text-ink"><div className="wrap"><Reveal className="max-w-[820px]"><p className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.22em] text-navy"><span className="w-1.5 h-1.5 rounded-full bg-gold" />Ce qui nous guide</p><h2 className="mt-6 text-[clamp(2.4rem,4.6vw,4.6rem)] leading-[0.98]">Quatre engagements, <span className="italic text-navy">dans les deux maisons.</span></h2></Reveal>
      <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{AGENCY.values.map(([t, d], i) => <Reveal key={t} delay={i * 0.08} className="rounded-[26px] bg-white p-8 shadow-[0_30px_60px_-40px_rgba(12,14,18,0.35)]"><span className="font-display text-[2.6rem] text-gold leading-none">0{i + 1}</span><h3 className="mt-6 text-[1.7rem] leading-tight">{t}</h3><p className="mt-3 text-ink/65 text-[15px]">{d}</p></Reveal>)}</div>
      <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6 pt-10 border-t border-ink/10">{AGENCY.numbers.map(([n, l], i) => <Reveal key={l} delay={i * 0.06}><p className="font-display text-[3.6rem] leading-none text-navy">{n}</p><p className="mt-2 text-ink/65">{l}</p></Reveal>)}</div>
    </div></section>
    <section id="contact" className="py-24 scroll-mt-28"><div className="wrap"><div className="relative rounded-[36px] overflow-hidden p-8 md:p-14 bg-gradient-to-br from-navy via-[#0A2340] to-ink ring-1 ring-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-8"><div className="absolute -right-20 -top-20 w-[380px] h-[380px] rounded-full bg-gold/25 blur-3xl" /><div className="relative"><Eyebrow>Parler au groupe</Eyebrow><h2 className="mt-5 text-[clamp(2.2rem,4vw,3.8rem)] leading-[1]">Un projet, une idée, <span className="italic text-gold">un partenariat ?</span></h2></div><div className="relative flex flex-wrap gap-3"><a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-gold">WhatsApp <MessageCircle size={17} /></a><a href={`mailto:${CONTACT.email}`} className="btn btn-ghost">{CONTACT.email}</a></div></div></div></section>
  </main>
);

/* ------------------------------ Lago Labs ------------------------------ */
export const Labs = () => {
  const [idea, setIdea] = useState({ name: '', idea: '' });
  return (
    <main>
      <section className="relative pt-40 pb-24 lg:pt-48 lg:pb-28 overflow-hidden"><div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'linear-gradient(rgba(45,91,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(45,91,255,0.07) 1px, transparent 1px)', backgroundSize: '56px 56px', maskImage: 'radial-gradient(70% 60% at 50% 20%, #000 30%, transparent 75%)' }} /><div className="absolute -top-40 left-1/3 w-[600px] h-[600px] rounded-full bg-[#7C3AED]/20 blur-3xl" /><div className="absolute top-20 -right-20 w-[500px] h-[500px] rounded-full bg-[#2D5BFF]/20 blur-3xl" />
        <div className="wrap relative"><Reveal><p className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.22em] text-[#2D5BFF]"><span className="w-1.5 h-1.5 rounded-full bg-[#2D5BFF]" />Digilago Labs · le laboratoire du groupe</p></Reveal><Reveal delay={0.1}><h1 className="mt-6 text-[clamp(2.8rem,6.4vw,7rem)] leading-[0.94] max-w-[18ch]">Nous construisons aussi <span className="italic text-[#2D5BFF]">nos propres produits.</span></h1></Reveal><Reveal delay={0.2}><p className="mt-8 text-[1.2rem] leading-relaxed text-ink/65 max-w-[56ch]">{LABS.lead}</p></Reveal></div>
      </section>
      <section id="projets" className="wrap pb-24 scroll-mt-28"><Reveal><p className="text-[12px] uppercase tracking-[0.22em] text-[#2D5BFF]">En cours au laboratoire</p><h2 className="mt-4 text-[clamp(2.2rem,4.2vw,4rem)] leading-[1]">Quatre projets, <span className="italic text-[#7C3AED]">quatre besoins vus sur le terrain.</span></h2></Reveal>
        <div className="mt-12 grid md:grid-cols-2 gap-4">{LABS.projects.map((p, i) => <Reveal key={p.name} delay={(i % 2) * 0.08} className="group rounded-[28px] bg-white p-8 ring-1 ring-black/5 shadow-[0_30px_60px_-40px_rgba(12,14,18,0.25)] hover:-translate-y-1 transition-transform relative overflow-hidden"><div className="absolute -right-14 -top-14 w-48 h-48 rounded-full blur-3xl opacity-25" style={{ background: p.color }} /><div className="relative flex items-center justify-between gap-4"><span className="font-mono text-[12px] text-ink/55">{p.kind}</span><span className="px-3 py-1 rounded-full text-[12px] text-white" style={{ background: p.color }}>{p.status}</span></div><h3 className="relative mt-6 text-[2.4rem] leading-none">{p.name}</h3><p className="relative mt-4 text-ink/65">{p.text}</p></Reveal>)}</div>
        <p className="mt-6 text-[13px] text-ink/45">Les noms et l’état d’avancement sont ceux du laboratoire : aucun de ces produits n’est encore commercialisé.</p>
      </section>
      <section id="methode" className="wrap pb-24 scroll-mt-28"><Reveal><p className="text-[12px] uppercase tracking-[0.22em] text-[#2D5BFF]">Comment on construit</p><h2 className="mt-4 text-[clamp(2.2rem,4.2vw,4rem)] leading-[1]">Du besoin au produit, <span className="italic text-[#7C3AED]">sans brûler d’étape.</span></h2></Reveal><ol className="mt-12 grid md:grid-cols-4 gap-4">{LABS.how.map(([n, t, d], i) => <Reveal key={n} delay={i * 0.08} className="rounded-[26px] bg-white p-8 ring-1 ring-black/5"><span className="font-mono text-[2.2rem] text-[#2D5BFF]">{n}</span><h3 className="mt-6 text-[1.6rem] leading-tight">{t}</h3><p className="mt-3 text-ink/65 text-[15px]">{d}</p></Reveal>)}</ol></section>
      <section className="wrap pb-24"><Reveal className="rounded-[30px] bg-ink text-white p-9 md:p-12 grid lg:grid-cols-12 gap-10 items-center"><div className="lg:col-span-5"><p className="text-[12px] uppercase tracking-[0.22em] text-[#8FA8FF]">Ce que nous utilisons</p><h2 className="mt-4 text-[2.4rem] leading-none">Le même socle que <span className="italic text-[#8FA8FF]">les meilleurs produits du monde.</span></h2></div><ul className="lg:col-span-7 flex flex-wrap gap-2">{LABS.stack.map((s) => <li key={s} className="font-mono px-3.5 py-1.5 rounded-full text-[13px] bg-white/[0.08] ring-1 ring-white/10">{s}</li>)}</ul></Reveal></section>
      <section id="ideas" className="wrap pb-28 scroll-mt-28"><div className="rounded-[36px] p-8 md:p-14 bg-gradient-to-br from-[#2D5BFF] to-[#7C3AED] text-white grid lg:grid-cols-2 gap-10 items-center"><div><p className="text-[12px] uppercase tracking-[0.22em] text-white/70">Ideas Lab</p><h2 className="mt-4 text-[clamp(2.2rem,4vw,3.8rem)] leading-[1]">Vous avez une idée d’application ?</h2><p className="mt-5 text-white/80 max-w-[44ch]">Nous la prototypons en deux semaines, avec de vrais écrans, pour la tester avant d’investir. Parlons-en.</p></div>
        <form className="bg-white/10 backdrop-blur rounded-[26px] p-6 md:p-8 grid gap-3" onSubmit={(e) => { e.preventDefault(); window.open(`https://wa.me/212649953813?text=${encodeURIComponent(`Bonjour Digilago Labs, j’ai une idée.\nNom : ${idea.name}\nIdée : ${idea.idea}`)}`, '_blank'); }}><input required placeholder="Votre nom" className="h-12 rounded-2xl bg-white/15 border border-white/20 px-4 placeholder:text-white/60 focus:outline-none focus:border-white" value={idea.name} onChange={(e) => setIdea({ ...idea, name: e.target.value })} /><textarea required rows={4} placeholder="Votre idée, en quelques lignes" className="rounded-2xl bg-white/15 border border-white/20 px-4 py-3 placeholder:text-white/60 focus:outline-none focus:border-white" value={idea.idea} onChange={(e) => setIdea({ ...idea, idea: e.target.value })} /><button className="btn bg-white text-ink justify-center mt-2">Envoyer au Labs <ArrowRight size={17} /></button></form></div></section>
    </main>
  );
};
