import { useState } from 'react';
import { CustomTools } from '../home-extra';
import { Seo } from '../seo';
import { t, tv, L } from '../i18n';
import { Check } from 'lucide-react';
import { SERVICES, PACKS, TECH, IMG, PACK_IMG } from '../data';
import { Reveal, Img, Head, Swipe } from '../ui';
import { Inside, Process, FinalCTA } from '../sections';
import { Catalog, CATALOG_COUNT } from '../brand';
import { CATALOG } from '../data';
import { ScrollText, RevealImg, spot } from '../fx';

export default function Services() {
  const [pack, setPack] = useState(0); const p = PACKS[pack];
  return (
    <>
      <Seo title={tv({ fr: 'Services web au Maroc : création de site, SEO, applications | Digilago', en: 'Web services in Morocco: websites, SEO, apps | Digilago', ar: 'خدمات الويب في المغرب: تصميم المواقع، تحسين محركات البحث، التطبيقات | ديجيلاغو' })} description={tv({ fr: '19 services pour les entreprises marocaines : sites vitrines, boutiques en ligne, réservation, applications, fiche Google, SEO local, GEO, hébergement et maintenance.', en: '19 services for Moroccan businesses: showcase sites, online stores, bookings, apps, Google profile, local SEO, GEO, hosting and maintenance.', ar: '19 خدمة للشركات المغربية: مواقع تعريفية، متاجر إلكترونية، أنظمة حجز، تطبيقات، ملف Google، تحسين محلي لمحركات البحث، GEO، استضافة وصيانة.' })} crumbs={[[t('Accueil'), '/'], [t('Services'), '/services']]} />
      <section className="dark relative overflow-hidden pt-36 pb-32 lg:pt-48 lg:pb-44">
        <div className="wrap grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6"><Reveal><p className="kicker">{t('Services')}</p></Reveal><ScrollText auto as="h1" text={t('Trois expertises, un seul interlocuteur.')} className="mt-5 text-[clamp(2.34rem,5.22vw,4.68rem)] leading-[1]" /><Reveal delay={0.5}><p className="mt-7 text-[19px] text-white/75 max-w-[50ch]">{tv({ fr: `${CATALOG_COUNT} services réunis en trois expertises : concevoir, faire trouver, faire tourner. Pour chacun, vous savez ce qui est inclus et ce que vous y gagnez.`, en: `${CATALOG_COUNT} services across three areas of expertise: build, get found, keep running. For each one, you know exactly what’s included and what you gain.`, ar: `${CATALOG_COUNT} خدمة ضمن ثلاث خبرات: التصميم والتطوير، الظهور الرقمي، والتشغيل. لكل خدمة، تعرف بدقة ما تتضمنه وما ستكسبه.` })}</p></Reveal></div>
          <RevealImg eager src={IMG.design} alt={t('Maquettes de site en cours de conception')} className="lg:col-span-6" />
        </div>
      </section>

      {/* Navigation entre les trois expertises */}
      <div className="sticky top-[76px] z-40 bg-nuit/90 backdrop-blur-md border-y border-white/10"><div className="wrap flex gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{CATALOG.map((g) => <a key={g.id} href={`#${g.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(g.id)?.scrollIntoView({ behavior: 'smooth' }); }} className="shrink-0 h-10 px-4 d-shape ring-1 ring-white/15 text-[14px] flex items-center gap-2 hover:ring-safran hover:text-safran transition-colors">{t(g.title)}<span className="text-brume text-[12px] tabular-nums">{g.items.length}</span></a>)}</div></div>

      <Catalog />

      {/* Outils sur-mesure : captures réelles */}
      <CustomTools />


      <section className="dark py-32 md:py-40 lg:py-52"><div className="wrap">
        <Head kicker={t('En pratique')} title={t('Ce que nos clients vivent au quotidien.')} /><Swipe className="mt-10 md:mt-12" item="w-[72%] sm:w-[46%]">{([[IMG.whatsapp, 'Des réservations reçues sur WhatsApp'], [IMG.search, 'Votre entreprise en tête sur Google'], [IMG.app, 'Un agenda en ligne pour vos rendez-vous']] as const).map(([src, cap], i) => (
          <Reveal key={cap} delay={i * 0.08}><figure><RevealImg src={src} alt={t(cap)} ratio="aspect-[4/5]" /><figcaption className="mt-4 font-display text-[18px]">{t(cap)}</figcaption></figure></Reveal>
        ))}</Swipe>
        <div className="mt-24"><Head kicker={t('Standard')} title={t('Inclus dans chaque projet, sans supplément.')} /><div className="mt-10"><Inside /></div></div>
      </div></section>

      <section className="light py-32 md:py-40 lg:py-52"><div className="wrap grid lg:grid-cols-12 gap-14">
        <div className="lg:col-span-4"><Head sm kicker={t('Anatomie d’un projet')} title={t('De votre premier message au lancement.')} /><RevealImg src={IMG.workshop} alt={t('Atelier de conception avec maquettes au tableau')} className="mt-10 hidden lg:block" /></div>
        <div className="lg:col-span-8 lg:pt-4"><Process /></div>
      </div></section>

      <section id="packs" className="light py-32 md:py-40 lg:py-52 border-t border-encre/10 scroll-mt-20"><div className="wrap">
        <Head kicker={t('Offres par secteur')} title={t('Une offre pour chaque secteur.')} lead={t('Chaque offre réunit ce dont votre métier a besoin. Le prix est annoncé par écrit avant de commencer, selon la complexité du projet.')} />
        <div className="mt-10 flex gap-2 overflow-x-auto -mx-5 px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:overflow-visible md:mx-0 md:px-0" role="tablist" aria-label={t('Offres')}>{PACKS.map((x, i) => <button key={x.id} role="tab" aria-selected={pack === i} onClick={() => setPack(i)} className={`h-11 px-5 shrink-0 d-shape text-[15px] transition-colors ${pack === i ? 'bg-nuit text-white' : 'bg-white ring-1 ring-encre/10 hover:ring-encre/30'}`}>{t(x.name.replace('Pack ', ''))}</button>)}</div>
        <Reveal key={p.id} className="mt-8"><div className="grid lg:grid-cols-12 rounded-3xl bg-white ring-1 ring-encre/8 overflow-hidden">
          <div className="lg:col-span-5 min-h-[340px] p-8 md:p-10 bg-nuit text-white relative overflow-hidden flex flex-col justify-end"><Img src={PACK_IMG[p.id]} alt={t(p.name.replace('Pack ', ''))} tone={p.color} className="absolute inset-0 w-full h-full object-cover" /><span className="absolute inset-0 bg-gradient-to-t from-nuit via-nuit/60 to-nuit/10" /><p className="relative kicker">{t(p.for)}</p><h3 className="relative mt-3 text-[clamp(1.8rem,3.06vw,2.7rem)]">{t(p.name.replace('Pack ', ''))}</h3><button onClick={() => document.getElementById('demarrer')?.scrollIntoView({ behavior: 'smooth' })} className="relative btn btn-safran mt-8">{t('Demander cette offre')}</button></div>
          <ul className="lg:col-span-7 p-8 md:p-10 grid sm:grid-cols-2 gap-5">{p.items.map((it) => <li key={it} className="flex gap-3"><Check size={20} className="text-[#0E8FA0] shrink-0 mt-0.5" />{t(it)}</li>)}</ul>
        </div></Reveal>
      </div></section>

      <section id="technologie" className="dark relative overflow-hidden py-32 md:py-40 lg:py-52 scroll-mt-20">
        <Img src={IMG.servers} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" /><div className="absolute inset-0 bg-gradient-to-b from-nuit via-nuit/90 to-nuit" />
        <div className="wrap relative"><Head kicker={t('Technologie')} title={t('Une technologie de premier plan pour votre entreprise.')} lead={t('Des outils modernes, rapides et maintenus, choisis pour que votre site reste performant dans cinq ans.')} />
          <Swipe dark cols="md:grid-cols-2 lg:grid-cols-3" className="mt-12 md:mt-14" item="w-[84%] sm:w-[55%]">{TECH.map((tk, i) => (
            <Reveal key={tk.group} delay={(i % 3) * 0.05} className="h-full"><article onMouseMove={spot} className="spot h-full rounded-2xl bg-nuit-2/80 backdrop-blur ring-1 ring-white/10 p-7"><h3 className="text-[21px]">{t(tk.group)}</h3><p className="mt-2 text-[15px] text-brume">{t(tk.text)}</p><ul className="mt-5 flex flex-wrap gap-2">{tk.items.map((x) => <li key={x} className="px-3 py-1.5 rounded-lg bg-nuit ring-1 ring-white/10 font-mono text-[12.5px] text-white/85">{t(x)}</li>)}</ul></article></Reveal>
          ))}</Swipe>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
