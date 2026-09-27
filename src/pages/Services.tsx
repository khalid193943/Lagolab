import { useState } from 'react';
import { Check } from 'lucide-react';
import { SERVICES, PACKS, TECH, IMG } from '../data';
import { Reveal, Img, Head } from '../ui';
import { Pillars, Inside, Process, FinalCTA } from '../sections';

export default function Services() {
  const [pack, setPack] = useState(0); const p = PACKS[pack];
  return (
    <>
      <section className="dark relative overflow-hidden pt-36 pb-20 lg:pt-44 lg:pb-28">
        <div className="wrap grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6"><Reveal><p className="kicker">Services</p><h1 className="mt-4 text-[clamp(2.6rem,5.8vw,5.2rem)] font-bold tracking-[-0.05em] leading-[0.98]">Concevoir. Faire trouver. Faire tourner.</h1><p className="mt-6 text-[19px] text-white/80 max-w-[50ch]">Dix services, trois pôles, un seul interlocuteur. Vous savez à chaque étape ce qui est fait, par qui, et ce que vous recevez.</p></Reveal></div>
          <Reveal delay={0.1} className="lg:col-span-6"><div className="relative aspect-[4/3] rounded-3xl overflow-hidden"><Img src={IMG.design} alt="Maquettes de site en cours de conception" eager className="absolute inset-0 w-full h-full object-cover" /></div></Reveal>
        </div>
      </section>

      <section className="light py-24 lg:py-32"><div className="wrap"><Head kicker="Nos trois pôles" title="Chaque pôle a des livrables précis." /><div className="mt-14"><Pillars /></div></div></section>

      <section className="dark py-24 lg:py-32"><div className="wrap">
        <Head kicker="Le détail" title="Dix services, réunis ou à la carte." lead="La plupart de nos clients commencent par le site et la fiche Google, puis ajoutent le reste quand l’activité grandit." />
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">{SERVICES.map((s, i) => (
          <Reveal key={s.title} delay={(i % 5) * 0.04} className="h-full"><article className="h-full rounded-2xl bg-nuit-2 ring-1 ring-white/8 p-6"><span className="w-11 h-11 rounded-xl bg-nuit-3 text-cyan flex items-center justify-center"><s.Icon size={20} /></span><h3 className="mt-5 text-[18px] leading-snug">{s.title}</h3><p className="mt-2 text-[15px] text-brume">{s.text}</p></article></Reveal>
        ))}</div>
        <div className="mt-24"><Head title="Inclus dans chaque projet." /><div className="mt-10"><Inside /></div></div>
      </div></section>

      <section className="light py-24 lg:py-32"><div className="wrap grid lg:grid-cols-12 gap-14">
        <div className="lg:col-span-4"><Head sm kicker="Anatomie d’un projet" title="Ce qui se passe entre votre message et la mise en ligne." /><Reveal delay={0.1}><div className="mt-10 relative aspect-[4/3] rounded-3xl overflow-hidden hidden lg:block"><Img src={IMG.client} alt="Présentation d’un site à une cliente" className="absolute inset-0 w-full h-full object-cover" /></div></Reveal></div>
        <div className="lg:col-span-8 lg:pt-4"><Process /></div>
      </div></section>

      <section id="packs" className="light py-24 lg:py-32 border-t border-encre/10 scroll-mt-20"><div className="wrap">
        <Head kicker="Packs par métier" title="Un point de départ pensé pour votre secteur." lead="Chaque pack réunit ce dont votre métier a besoin. Le prix est annoncé avant de commencer, selon la complexité." />
        <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Packs">{PACKS.map((x, i) => <button key={x.id} role="tab" aria-selected={pack === i} onClick={() => setPack(i)} className={`h-11 px-5 rounded-full text-[15px] transition-colors ${pack === i ? 'bg-nuit text-white' : 'bg-white ring-1 ring-encre/10 hover:ring-encre/30'}`}>{x.name.replace('Pack ', '')}</button>)}</div>
        <Reveal key={p.id} className="mt-8"><div className="grid lg:grid-cols-12 rounded-3xl bg-white ring-1 ring-encre/8 overflow-hidden">
          <div className="lg:col-span-5 p-8 md:p-10 bg-nuit text-white relative overflow-hidden"><span className="absolute -right-16 -top-16 w-56 h-56 rounded-full blur-3xl opacity-40" style={{ background: p.color }} /><p className="relative kicker">{p.for}</p><h3 className="relative mt-3 text-[clamp(2rem,3.4vw,3rem)]">{p.name}</h3><button onClick={() => document.getElementById('demarrer')?.scrollIntoView({ behavior: 'smooth' })} className="relative btn btn-safran mt-8">Demander ce pack</button></div>
          <ul className="lg:col-span-7 p-8 md:p-10 grid sm:grid-cols-2 gap-5">{p.items.map((it) => <li key={it} className="flex gap-3"><Check size={20} className="text-[#0E8FA0] shrink-0 mt-0.5" />{it}</li>)}</ul>
        </div></Reveal>
      </div></section>

      <section id="technologie" className="dark relative overflow-hidden py-24 lg:py-32 scroll-mt-20">
        <Img src={IMG.servers} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" /><div className="absolute inset-0 bg-gradient-to-b from-nuit via-nuit/90 to-nuit" />
        <div className="wrap relative"><Head kicker="Technologie" title="Les outils des grandes plateformes, au service de votre entreprise." lead="Nous choisissons des technologies modernes, rapides et maintenues. Votre site ne vieillira pas en deux ans." />
          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-4">{TECH.map((t, i) => (
            <Reveal key={t.group} delay={(i % 3) * 0.05} className="h-full"><article className="h-full rounded-2xl bg-nuit-2/80 backdrop-blur ring-1 ring-white/10 p-7"><h3 className="text-[21px]">{t.group}</h3><p className="mt-2 text-[15px] text-brume">{t.text}</p><ul className="mt-5 flex flex-wrap gap-2">{t.items.map((x) => <li key={x} className="px-3 py-1.5 rounded-lg bg-nuit ring-1 ring-white/10 font-mono text-[12.5px] text-white/85">{x}</li>)}</ul></article></Reveal>
          ))}</div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
