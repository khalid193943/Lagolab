import { useState } from 'react';
import { Check } from 'lucide-react';
import { SERVICES, PACKS, TECH, IMG, PACK_IMG } from '../data';
import { Reveal, Img, Head } from '../ui';
import { Pillars, Inside, Process, FinalCTA } from '../sections';
import { ScrollText, RevealImg, spot } from '../fx';

export default function Services() {
  const [pack, setPack] = useState(0); const p = PACKS[pack];
  return (
    <>
      <section className="dark relative overflow-hidden pt-36 pb-20 lg:pt-44 lg:pb-28">
        <div className="wrap grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6"><Reveal><p className="kicker">Services</p></Reveal><ScrollText auto as="h1" text="Trois expertises, un seul interlocuteur." className="mt-5 text-[clamp(2.6rem,5.8vw,5.2rem)] leading-[1]" /><Reveal delay={0.5}><p className="mt-7 text-[19px] text-white/75 max-w-[50ch]">Dix services réunis en trois pôles : concevoir, faire trouver, faire tourner. À chaque étape, vous savez ce qui est fait, par qui, et ce que vous recevez.</p></Reveal></div>
          <RevealImg eager src={IMG.design} alt="Maquettes de site en cours de conception" className="lg:col-span-6" />
        </div>
      </section>

      <section className="light py-24 lg:py-32"><div className="wrap"><Head kicker="Expertises" title="Ce que nous livrons, noir sur blanc." /><div className="mt-14"><Pillars /></div></div></section>

      <section className="dark py-24 lg:py-32"><div className="wrap">
        <Head kicker="Catalogue" title="Dix services, à la carte ou réunis." lead="La plupart de nos clients commencent par le site et la fiche Google, puis étendent leur dispositif au rythme de leur croissance." />
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">{SERVICES.map((s, i) => (
          <Reveal key={s.title} delay={(i % 5) * 0.04} className="h-full"><article onMouseMove={spot} className="spot h-full rounded-2xl bg-nuit-2 ring-1 ring-white/8 p-6"><span className="w-11 h-11 rounded-xl bg-nuit-3 text-cyan flex items-center justify-center"><s.Icon size={20} /></span><h3 className="mt-5 text-[18px] leading-snug">{s.title}</h3><p className="mt-2 text-[15px] text-brume">{s.text}</p></article></Reveal>
        ))}</div>
        <div className="mt-24 grid md:grid-cols-3 gap-5">{([[IMG.whatsapp, 'Des réservations reçues sur WhatsApp'], [IMG.search, 'Votre entreprise en tête sur Google'], [IMG.app, 'Un agenda en ligne pour vos rendez-vous']] as const).map(([src, t], i) => (
          <Reveal key={t} delay={i * 0.08}><figure><RevealImg src={src} alt={t} ratio="aspect-[4/5]" /><figcaption className="mt-4 font-display text-[18px]">{t}</figcaption></figure></Reveal>
        ))}</div>
        <div className="mt-24"><Head kicker="Standard" title="Inclus dans chaque projet, sans supplément." /><div className="mt-10"><Inside /></div></div>
      </div></section>

      <section className="light py-24 lg:py-32"><div className="wrap grid lg:grid-cols-12 gap-14">
        <div className="lg:col-span-4"><Head sm kicker="Anatomie d’un projet" title="De votre premier message au lancement." /><RevealImg src={IMG.workshop} alt="Atelier de conception avec maquettes au tableau" className="mt-10 hidden lg:block" /></div>
        <div className="lg:col-span-8 lg:pt-4"><Process /></div>
      </div></section>

      <section id="packs" className="light py-24 lg:py-32 border-t border-encre/10 scroll-mt-20"><div className="wrap">
        <Head kicker="Offres par secteur" title="Une offre pour chaque secteur." lead="Chaque offre réunit ce dont votre métier a besoin. Le prix est annoncé par écrit avant de commencer, selon la complexité du projet." />
        <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Packs">{PACKS.map((x, i) => <button key={x.id} role="tab" aria-selected={pack === i} onClick={() => setPack(i)} className={`h-11 px-5 rounded-full text-[15px] transition-colors ${pack === i ? 'bg-nuit text-white' : 'bg-white ring-1 ring-encre/10 hover:ring-encre/30'}`}>{x.name.replace('Pack ', '')}</button>)}</div>
        <Reveal key={p.id} className="mt-8"><div className="grid lg:grid-cols-12 rounded-3xl bg-white ring-1 ring-encre/8 overflow-hidden">
          <div className="lg:col-span-5 min-h-[340px] p-8 md:p-10 bg-nuit text-white relative overflow-hidden flex flex-col justify-end"><Img src={PACK_IMG[p.id]} alt={p.name} tone={p.color} className="absolute inset-0 w-full h-full object-cover" /><span className="absolute inset-0 bg-gradient-to-t from-nuit via-nuit/60 to-nuit/10" /><p className="relative kicker">{p.for}</p><h3 className="relative mt-3 text-[clamp(2rem,3.4vw,3rem)]">{p.name.replace('Pack ', 'Offre ')}</h3><button onClick={() => document.getElementById('demarrer')?.scrollIntoView({ behavior: 'smooth' })} className="relative btn btn-safran mt-8">Demander cette offre</button></div>
          <ul className="lg:col-span-7 p-8 md:p-10 grid sm:grid-cols-2 gap-5">{p.items.map((it) => <li key={it} className="flex gap-3"><Check size={20} className="text-[#0E8FA0] shrink-0 mt-0.5" />{it}</li>)}</ul>
        </div></Reveal>
      </div></section>

      <section id="technologie" className="dark relative overflow-hidden py-24 lg:py-32 scroll-mt-20">
        <Img src={IMG.servers} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" /><div className="absolute inset-0 bg-gradient-to-b from-nuit via-nuit/90 to-nuit" />
        <div className="wrap relative"><Head kicker="Technologie" title="Une technologie de premier plan pour votre entreprise." lead="Des outils modernes, rapides et maintenus, choisis pour que votre site reste performant dans cinq ans." />
          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-4">{TECH.map((t, i) => (
            <Reveal key={t.group} delay={(i % 3) * 0.05} className="h-full"><article onMouseMove={spot} className="spot h-full rounded-2xl bg-nuit-2/80 backdrop-blur ring-1 ring-white/10 p-7"><h3 className="text-[21px]">{t.group}</h3><p className="mt-2 text-[15px] text-brume">{t.text}</p><ul className="mt-5 flex flex-wrap gap-2">{t.items.map((x) => <li key={x} className="px-3 py-1.5 rounded-lg bg-nuit ring-1 ring-white/10 font-mono text-[12.5px] text-white/85">{x}</li>)}</ul></article></Reveal>
          ))}</div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
