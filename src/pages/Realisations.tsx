/**
 * Réalisations : bandeau d'en-tête, projets phares en accordéon (image qui change à droite),
 * études de cas détaillées (L'idée / Ce que nous avons fait / Le résultat), puis grille de projets
 * par métier avec filtres et « Voir plus ».
 */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Check, X, Plus, Minus, ArrowUpRight, RefreshCw, Lightbulb, Wrench, Trophy } from 'lucide-react';
import { Seo } from '../seo';
import { t, tv, L } from '../i18n';
import { LIBRARY, GROUPS, Concept } from '../data';
import { FEATURED, STUDIES } from '../work';
import { Reveal, Img } from '../ui';
import { FinalCTA } from '../sections';
import { ScrollText } from '../fx';

/* Capture dans un cadre de navigateur */
const Browser = ({ src, alt, tint, tilt = 0 }: { src: string; alt: string; tint: string; tilt?: number }) => (
  <div className="rounded-[28px] p-5 sm:p-8 lg:p-10" style={{ background: tint }}>
    <motion.div initial={{ rotate: 0, y: 20, opacity: 0 }} whileInView={{ rotate: tilt, y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="rounded-xl overflow-hidden bg-white shadow-[0_30px_70px_-30px_rgba(10,20,40,.45)] ring-1 ring-black/5">
      <div className="h-7 flex items-center gap-1.5 px-3 bg-[#EEF1F6]" dir="ltr"><span className="w-2.5 h-2.5 rounded-full bg-[#FF6B5B]" /><span className="w-2.5 h-2.5 rounded-full bg-[#FFC53D]" /><span className="w-2.5 h-2.5 rounded-full bg-[#34D399]" /></div>
      <Img src={src} alt={alt} className="w-full aspect-[16/10] object-cover object-top" />
    </motion.div>
  </div>
);

export default function Realisations() {
  const [open, setOpen] = useState(FEATURED[0].id); const cur = FEATURED.find((f) => f.id === open) || FEATURED[0];
  const [g, setG] = useState('Tous'); const [count, setCount] = useState(8); const [concept, setConcept] = useState<Concept | null>(null);
  const list = useMemo(() => (g === 'Tous' ? LIBRARY : LIBRARY.filter((c) => c.group === g)), [g]);
  return (
    <>
      <Seo title={tv({ fr: 'Réalisations : exemples de sites web et plateformes au Maroc | Digilago', en: 'Our work: websites and platforms in Morocco | Digilago', ar: 'أعمالنا: نماذج مواقع ومنصات في المغرب | ديجيلاغو' })} description={tv({ fr: 'Sites d’écoles à El Jadida, plateforme de gestion, devis intelligent, WhatsApp automatisé et 27 directions par métier : découvrez ce que Digilago conçoit.', en: 'School websites in El Jadida, a management platform, smart quotes, automated WhatsApp and 27 directions by trade: see what Digilago builds.', ar: 'مواقع مدارس في الجديدة، ومنصة تسيير، وعروض أسعار ذكية، وواتساب مؤتمت، و27 توجهًا حسب النشاط: اكتشف ما تصمّمه ديجيلاغو.' })} crumbs={[[t('Accueil'), '/'], [t('Réalisations'), '/realisations']]} />

      {/* Bandeau d'en-tête */}
      <section className="relative overflow-hidden bg-safran text-nuit pt-36 pb-20 lg:pt-44 lg:pb-24">
        <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(#0A1428_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="wrap relative text-center">
          <Reveal><p className="text-[14px] font-semibold uppercase tracking-[0.14em] text-nuit/70">{t('Réalisations')}</p></Reveal>
          <ScrollText auto as="h1" text={tv({ fr: 'Sites, plateformes et outils qui font grandir des entreprises.', en: 'Websites, platforms and tools that help businesses grow.', ar: 'مواقع ومنصات وأدوات تُنمّي الشركات.' })} className="mt-4 mx-auto max-w-[22ch] text-[clamp(2.2rem,4.8vw,4.2rem)] leading-[1.02]" />
          <Reveal delay={0.4}><p className="mt-6 mx-auto max-w-[56ch] text-[18px] text-nuit/80">{tv({ fr: 'Des écoles d’El Jadida à nos propres outils de gestion : chaque projet part d’un besoin réel et se juge à ce qu’il change au quotidien.', en: 'From schools in El Jadida to our own management tools: every project starts from a real need and is judged by what it changes day to day.', ar: 'من مدارس الجديدة إلى أدوات التسيير الخاصة بنا: كل مشروع ينطلق من حاجة حقيقية ويُقاس بما يغيّره في الواقع اليومي.' })}</p></Reveal>
          <Reveal delay={0.5} className="mt-8 flex flex-wrap justify-center gap-2">{[['#phares', tv({ fr: 'Projets phares', en: 'Featured projects', ar: 'مشاريع بارزة' })], ['#etudes', tv({ fr: 'Études de cas', en: 'Case studies', ar: 'دراسات حالة' })], ['#metiers', tv({ fr: 'Par métier', en: 'By trade', ar: 'حسب النشاط' })]].map(([h, l]) => <a key={h} href={h} onClick={(e) => { e.preventDefault(); document.querySelector(h)?.scrollIntoView({ behavior: 'smooth' }); }} className="h-10 px-4 d-shape bg-nuit text-white text-[14px] flex items-center hover:bg-nuit-2">{l}</a>)}</Reveal>
        </div>
      </section>

      {/* Projets phares : accordéon + image */}
      <section id="phares" className="light py-24 md:py-32 lg:py-40 scroll-mt-16"><div className="wrap grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        <div className="lg:col-span-5">
          <Reveal><p className="kicker">{tv({ fr: 'Projets phares', en: 'Featured projects', ar: 'مشاريع بارزة' })}</p></Reveal>
          <ul className="mt-6 border-t border-encre/10">{FEATURED.map((f) => { const on = f.id === open; return (
            <li key={f.id} className="border-b border-encre/10">
              <button onClick={() => setOpen(f.id)} className="w-full flex items-center justify-between gap-4 py-5 text-start" aria-expanded={on}>
                <span><span className={`block font-display text-[20px] md:text-[22px] transition-colors ${on ? 'text-encre' : 'text-encre/70'}`}>{f.name}</span><span className="block mt-0.5 text-[13.5px] text-ardoise">{tv(f.kind)}</span></span>
                <span className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center transition-colors ${on ? 'bg-nuit text-safran' : 'ring-1 ring-encre/15'}`}>{on ? <Minus size={16} /> : <Plus size={16} />}</span>
              </button>
              <AnimatePresence initial={false}>{on && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35 }} className="overflow-hidden">
                  <div className="pb-6"><p className="text-[16px] text-ardoise">{tv(f.desc)}</p>
                    <ul className="mt-4 flex flex-wrap gap-2">{f.tags.map((x) => <li key={x.fr} className="h-8 px-3 flex items-center d-shape bg-white ring-1 ring-encre/10 text-[13px]">{tv(x)}</li>)}</ul>
                    {f.url && <a href={f.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-[#0E8FA0]">{tv({ fr: 'Voir le site', en: 'Visit the site', ar: 'زيارة الموقع' })} <ArrowUpRight size={15} /></a>}
                    <div className="mt-6 lg:hidden"><Browser src={f.img} alt={f.name} tint={f.tint} /></div>
                  </div>
                </motion.div>
              )}</AnimatePresence>
            </li>
          ); })}</ul>
        </div>
        <div className="lg:col-span-7 hidden lg:block lg:sticky lg:top-28">
          <AnimatePresence mode="wait"><motion.div key={cur.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}><Browser src={cur.img} alt={cur.name} tint={cur.tint} tilt={-1.5} /></motion.div></AnimatePresence>
        </div>
      </div></section>

      {/* Études de cas détaillées */}
      <section id="etudes" className="light pb-24 md:pb-32 lg:pb-40 scroll-mt-16"><div className="wrap space-y-8 lg:space-y-12">
        {STUDIES.map((s, i) => (
          <Reveal key={s.id}><article className="rounded-[32px] overflow-hidden grid lg:grid-cols-12 items-center" style={{ background: s.tint }}>
            <div className={`lg:col-span-7 p-4 sm:p-6 lg:p-8 ${i % 2 ? 'lg:order-2' : ''}`}><Browser src={s.img} alt={s.name} tint="transparent" tilt={i % 2 ? 1.5 : -1.5} /></div>
            <div className="lg:col-span-5 px-6 pb-8 sm:px-10 lg:py-12 lg:px-12">
              <p className="text-[13.5px] text-ardoise">{tv(s.kind)}</p>
              <h2 className="mt-1 text-[clamp(1.7rem,2.6vw,2.4rem)]">{s.name}</h2>
              <dl className="mt-7 space-y-6">{([[Lightbulb, { fr: 'L’idée', en: 'The idea', ar: 'الفكرة' }, s.idea], [Wrench, { fr: 'Ce que nous avons fait', en: 'What we did', ar: 'ما قمنا به' }, s.did], [Trophy, { fr: 'Le résultat', en: 'The result', ar: 'النتيجة' }, s.result]] as const).map(([I, h, x]) => (
                <div key={h.fr}><dt className="flex items-center gap-2 font-display text-[17px]"><I size={17} className="text-[#0E8FA0]" />{tv(h)}</dt><dd className="mt-1.5 text-[15.5px] text-ardoise">{tv(x)}</dd></div>
              ))}</dl>
            </div>
          </article></Reveal>
        ))}
      </div></section>

      {/* Grille par métier */}
      <section id="metiers" className="light pb-24 md:pb-32 lg:pb-40 scroll-mt-16"><div className="wrap">
        <div className="text-center"><Reveal><p className="kicker justify-center">{t('Bibliothèque')}</p></Reveal><ScrollText text={tv({ fr: 'Des idées audacieuses, devenues des sites qui travaillent.', en: 'Bold ideas, turned into websites that work.', ar: 'أفكار جريئة تحوّلت إلى مواقع تعمل.' })} className="mt-4 mx-auto max-w-[24ch] text-[clamp(1.9rem,3.8vw,3.3rem)]" /><Reveal delay={0.1}><p className="mt-5 mx-auto max-w-[58ch] text-[17px] text-ardoise">{tv({ fr: 'Une direction pour chacun des seize métiers que nous accompagnons. Filtrez par secteur, ouvrez un projet pour voir ce qu’il contient.', en: 'A direction for each of the sixteen trades we support. Filter by sector and open a project to see what it includes.', ar: 'توجّه تصميمي لكل واحد من القطاعات الستة عشر التي نرافقها. اختر القطاع وافتح المشروع لترى ما يتضمنه.' })}</p></Reveal></div>
        <div className="mt-10 flex gap-2 overflow-x-auto -mx-5 px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:justify-center md:overflow-visible md:mx-0 md:px-0">{GROUPS.map((x) => <button key={x} onClick={() => { setG(x); setCount(8); }} aria-pressed={g === x} className={`h-10 px-4 shrink-0 d-shape text-[14px] transition-colors ${g === x ? 'bg-nuit text-white' : 'bg-white ring-1 ring-encre/10 text-encre hover:ring-encre/30'}`}>{t(x)}</button>)}</div>
        <motion.div layout className="mt-12 grid md:grid-cols-2 gap-x-8 gap-y-14">
          <AnimatePresence mode="popLayout">{list.slice(0, count).map((c) => (
            <motion.button layout key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} onClick={() => setConcept(c)} className="group text-start">
              <div className="rounded-[26px] p-6 sm:p-9 transition-transform duration-500 group-hover:-translate-y-1" style={{ background: `${c.color}26` }}>
                <div className="rounded-xl overflow-hidden bg-white shadow-[0_24px_50px_-26px_rgba(10,20,40,.45)] ring-1 ring-black/5"><Img src={c.img} alt={`${t(c.sector)} ${c.name}`} tone={c.color} className="w-full aspect-[16/10] object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]" /></div>
              </div>
              <div className="mt-5 flex items-start justify-between gap-4"><div><h3 className="text-[24px] md:text-[26px]">{c.name}</h3><p className="mt-1.5 text-[15.5px] text-ardoise max-w-[46ch]">{t(c.sector)} · {t(c.city)} : {c.features.slice(0, 2).map((f) => t(f).toLowerCase()).join(', ')}.</p></div><span className="shrink-0 mt-1 h-7 px-2.5 rounded-full bg-encre/5 text-[12px] text-ardoise flex items-center">{tv({ fr: 'Concept', en: 'Concept', ar: 'نموذج' })}</span></div>
            </motion.button>
          ))}</AnimatePresence>
        </motion.div>
        {count < list.length && <div className="mt-14 flex justify-center"><button onClick={() => setCount(count + 8)} className="btn btn-safran"><RefreshCw size={16} />{tv({ fr: 'Voir plus de projets', en: 'Load more projects', ar: 'عرض المزيد من المشاريع' })} <span className="opacity-60">({list.length - count})</span></button></div>}
      </div></section>

      <AnimatePresence>{concept && (
        <motion.div className="fixed inset-0 z-[80] bg-nuit/90 backdrop-blur-sm overflow-y-auto p-4 flex items-start lg:items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConcept(null)}>
          <motion.div initial={{ y: 12 }} animate={{ y: 0 }} className="w-full max-w-6xl my-10 grid lg:grid-cols-12 gap-6 rounded-3xl bg-nuit-2 ring-1 ring-white/10 p-4 md:p-6 text-white" onClick={(e) => e.stopPropagation()}>
            <div className="lg:col-span-8 rounded-2xl overflow-hidden bg-nuit"><Img src={concept.img} alt={`Site ${concept.name}`} tone={concept.color} className="w-full h-full max-h-[75vh] object-contain" /></div>
            <div className="lg:col-span-4 p-2 flex flex-col">
              <div className="flex justify-between items-start gap-4"><div><p className="text-brume text-[14px]">{t(concept.sector)} · {t(concept.city)}</p><h3 className="mt-1 text-[28px]">{concept.name}</h3></div><button onClick={() => setConcept(null)} className="w-10 h-10 rounded-full ring-1 ring-white/20 flex items-center justify-center" aria-label={t('Fermer')}><X size={18} /></button></div>
              <ul className="mt-6 space-y-3">{concept.features.map((f) => <li key={f} className="flex gap-3"><Check size={18} className="text-cyan shrink-0 mt-1" />{t(f)}</li>)}</ul>
              <p className="mt-6 text-[15px] text-brume">{t('Bouton principal du site :')} <span className="text-white">{t(concept.cta)}</span></p>
              <Link to={L('/contact')} className="btn btn-safran mt-auto">{t('Je veux un site comme celui-ci')}</Link>
            </div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>
      <FinalCTA />
    </>
  );
}
