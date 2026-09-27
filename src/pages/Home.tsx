import { Link } from 'react-router-dom';
import { t, tv, L } from '../i18n';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { IMG, CASES, AGENCY, CONTACT, PACK_IMG } from '../data';
import { Simulator, Sectors } from '../surprise';
import { HeroMap } from '../HeroMap';
import { Reveal, Img, Head, Mark, Swipe } from '../ui';
import { Inside, Process, FaitPar, Faq, FinalCTA } from '../sections';
import { Expertises, LogoWall } from '../brand';
import { ScrollText, RevealImg, CountUp } from '../fx';

const PLATFORMS = ['Google', 'Google Maps', 'ChatGPT', 'Gemini', 'WhatsApp', 'Instagram', 'Perplexity', 'Waze', 'Facebook', 'TripAdvisor'];

export default function Home() {
  const reduce = useReducedMotion(); const { scrollY } = useScroll(); const py = useTransform(scrollY, [0, 900], [0, 140]);
  return (
    <>
      {/* HERO : la carte du Maroc qui s'allume */}
      <section className="dark relative min-h-[100svh] flex flex-col overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: reduce ? 0 : py }}><Img src={IMG.heroBg} alt="" eager className="absolute inset-0 w-full h-full object-cover opacity-90" /></motion.div>
        <div className="absolute inset-0 rtl-flip bg-[radial-gradient(60%_70%_at_75%_45%,rgba(45,212,230,.10),transparent_70%),linear-gradient(90deg,#0A1428_0%,rgba(10,20,40,.85)_45%,rgba(10,20,40,.35)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-nuit to-transparent" />
        <div className="wrap relative flex-1 grid lg:grid-cols-12 gap-10 items-center pt-28 lg:pt-24 pb-10">
          <div className="lg:col-span-6 xl:col-span-6">
            <Reveal><p className="kicker">{t('Société de services numériques, de Tanger à Dakhla')}</p></Reveal>
            <ScrollText auto as="h1" delay={0.15} text={t('Le numérique qui fait venir vos clients.')} className="mt-6 text-[clamp(2.8rem,5.8vw,5.4rem)] leading-[1] !tracking-[-0.045em]" />
            <Reveal delay={0.4}><p className="mt-7 text-[19px] text-white/80 max-w-[48ch]">{t('Digilago conçoit, référence et opère les sites, applications et logiciels des entreprises marocaines. Depuis El Jadida, nous allumons des entreprises dans tout le Royaume.')}</p></Reveal>
            <Reveal delay={0.5} className="mt-9 grid sm:flex sm:flex-wrap gap-3"><Link to={L('/contact')} className="btn btn-safran">{t('Ma première version en 72 h')} <ArrowRight size={18} /></Link><Link to={L('/realisations')} className="btn btn-line">{t('Voir nos réalisations')}</Link></Reveal>
          </div>
          <div className="lg:col-span-6 -mx-5 sm:mx-auto w-[calc(100%+2.5rem)] sm:w-full max-w-[560px] lg:max-w-[620px] lg:me-0"><div dir="ltr"><HeroMap /></div></div>
        </div>
        <div className="wrap relative pb-10"><dl className="grid grid-cols-2 md:grid-cols-4 border-t border-white/15">{AGENCY.numbers.map(([n, l]) => <div key={l} className="pt-5 pe-4"><dt className="font-display text-[30px] font-medium tracking-[-0.03em]"><CountUp value={t(n)} /></dt><dd className="text-[14px] text-brume">{t(l)}</dd></div>)}</dl></div>
      </section>

      {/* PLATEFORMES */}
      <section className="dark py-12 border-y border-white/10"><div className="wrap flex flex-col md:flex-row md:items-center gap-6"><p className="shrink-0 text-[15px] text-brume md:max-w-[15rem]">{t('Présents là où vos clients vous cherchent.')}</p>
        <div className="marquee-wrap flex-1"><div className="marquee gap-14" style={{ ['--d' as any]: '45s' }}>{[0, 1].map((r) => <div key={r} className="flex items-center gap-14 pe-14" aria-hidden={r === 1}>{PLATFORMS.map((x) => <span key={x} className="font-display text-[24px] font-semibold tracking-[-0.03em] text-white/55 whitespace-nowrap">{t(x)}</span>)}</div>)}</div></div></div></section>

      {/* EXPERTISES */}
      <section className="light py-20 md:py-24 lg:py-32"><div className="wrap">
        <Head kicker={t('Expertises')} title={t('Une équipe. Trois expertises.')} lead={t('Nous concevons vos outils, nous les rendons visibles, puis nous les faisons tourner. Sans intermédiaire, sans sous-traitance.')} />
        <div className="mt-12 lg:mt-16"><Expertises /></div>
      </div></section>

      {/* SIMULATEUR */}
      <section className="dark relative overflow-hidden py-20 md:py-24 lg:py-32">
        <div className="absolute inset-0 dotgrid opacity-60 [mask-image:radial-gradient(70%_60%_at_50%_30%,#000,transparent)]" />
        <Mark className="absolute -start-40 -bottom-40 w-[620px] h-[700px] opacity-[0.05] pointer-events-none" />
        <div className="wrap relative">
          <Head center kicker={t('Essayez')} title={t('Voyez-vous déjà en ligne.')} lead={t('Tapez le nom de votre entreprise. Voici comment vos clients pourraient vous trouver demain, sur Google, sur la carte et auprès des IA.')} />
          <Reveal delay={0.1} className="mt-12"><Simulator /></Reveal>
        </div>
      </section>

      {/* MÉTIERS */}
      <section className="light py-20 md:py-24 lg:py-32"><div className="wrap">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8"><Head kicker={t('Secteurs')} title={t('Une offre pensée pour votre métier.')} lead={t('Sept offres construites à partir de ce que nos clients nous demandent le plus. Survolez ou faites glisser pour découvrir chaque secteur.')} /><Reveal><Link to={L('/services#packs')} className="btn btn-line-dark shrink-0">{t('Comparer les offres')} <ArrowUpRight size={16} /></Link></Reveal></div>
        <Reveal delay={0.1} className="mt-12 text-white"><Sectors images={PACK_IMG} /></Reveal>
      </div></section>

      {/* CE QU'IL Y A DERRIÈRE */}
      <section className="dark py-20 md:py-24 lg:py-32"><div className="wrap">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6"><Head kicker={t('Notre standard')} title={t('L’exigence, dans chaque détail.')} lead={t('Un site professionnel se juge à ce qu’on ne voit pas : sa vitesse, sa solidité, sa lisibilité par Google et les IA. Voici ce que contient chaque projet, sans supplément.')} /></div>
          <div className="lg:col-span-6 relative"><RevealImg src={IMG.code} alt={t('Lignes de code à l’écran, reflets cyan et safran')} /><Reveal delay={0.6} className="absolute start-4 bottom-4 end-4 sm:end-auto"><div className="rounded-2xl bg-nuit/85 backdrop-blur p-4 ring-1 ring-white/10"><p className="text-[14px] text-brume">{t('Chaque ligne de code')}</p><p className="font-display font-medium">{t('écrite, relue et testée chez nous')}</p></div></Reveal></div>
        </div>
        <div className="mt-16"><Inside /></div>
      </div></section>

      {/* RÉFÉRENCES : les logos, qui défilent */}
      <section className="light py-20 md:py-24 lg:py-28 border-t border-encre/8 overflow-hidden"><div className="wrap">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8"><Head kicker={t('Références')} title={t('Ils nous ont confié leur image.')} lead={t('Des établissements d’El Jadida qui gèrent aujourd’hui leurs inscriptions, leurs actualités et la relation avec les parents en ligne.')} /><Reveal><Link to={L('/realisations')} className="btn btn-line-dark shrink-0">{t('Études de cas')} <ArrowUpRight size={16} /></Link></Reveal></div>
      </div>
      <Reveal delay={0.1} className="mt-12"><LogoWall /></Reveal></section>

      <FaitPar />

      {/* MÉTHODE */}
      <section className="light py-20 md:py-24 lg:py-32"><div className="wrap grid lg:grid-cols-12 gap-14">
        <div className="lg:col-span-4"><Head sm kicker={t('Méthode')} title={t('Une méthode claire, du premier appel au lancement.')} lead={t('Chaque étape produit un résultat concret. Vous ne payez qu’après avoir validé la première version.')} /><RevealImg src={IMG.client} alt={t('Un nouveau site de restaurant ouvert sur un ordinateur portable')} className="mt-10 hidden lg:block" /></div>
        <div className="lg:col-span-8 lg:pt-4"><Process /></div>
      </div></section>

      {/* SOCIÉTÉ */}
      <section className="dark py-20 md:py-24 lg:py-32"><div className="wrap grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 grid grid-cols-5 gap-4 items-end"><RevealImg src={IMG.eljadida} alt={t('Les remparts de la Cité portugaise d’El Jadida au crépuscule')} ratio="aspect-[4/5]" className="col-span-3" /><RevealImg src={IMG.team} alt={t('Salle de réunion Digilago, réseau d’entreprises à l’écran')} ratio="aspect-[4/5]" className="col-span-2 -mb-10" /></div>
        <div className="lg:col-span-5"><Head kicker={t('La société')} title={t('Ancrés à El Jadida. Ouverts sur tout le Maroc.')} lead={t(AGENCY.mission)} /><Reveal delay={0.1}><Link to={L('/societe')} className="btn btn-line mt-8">{t('Découvrir Digilago')} <ArrowUpRight size={16} /></Link></Reveal></div>
      </div></section>

      {/* FAQ */}
      <section className="light py-20 md:py-24 lg:py-32"><div className="wrap grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4"><Head sm kicker={t('Questions fréquentes')} title={t('Les réponses, avant même la question.')} /><Reveal delay={0.1}><div className="mt-8 rounded-3xl bg-nuit text-white p-7"><p className="font-display text-[20px] font-medium">{t('Une autre question ?')}</p><p className="mt-2 text-brume">{t('Écrivez-nous. Un membre de l’équipe vous répond le jour même.')}</p><a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-safran mt-6">{t('Écrire sur WhatsApp')}</a></div></Reveal></div>
        <div className="lg:col-span-8"><Faq /></div>
      </div></section>

      <FinalCTA />
    </>
  );
}

export const CaseCard = ({ c, big = false }: { c: (typeof CASES)[number]; big?: boolean }) => (
  <article className="group rounded-3xl bg-white ring-1 ring-encre/8 overflow-hidden h-full flex flex-col">
    <div className={`relative overflow-hidden ${big ? 'aspect-[16/10]' : 'aspect-[16/8]'}`}><Img src={c.img as string} alt={`Site de ${c.name}`} tone={c.color} className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]" /></div>
    <div className="p-6 md:p-7 flex-1 flex flex-col">
      <div className="flex items-start justify-between gap-4"><div><h3 className={big ? 'text-[26px]' : 'text-[21px]'}>{c.name}</h3><p className="mt-1 text-[14px] text-ardoise">{t(c.sector)} · {t(c.place)}</p></div>{c.url && <a href={c.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 shrink-0 rounded-full bg-nuit text-white flex items-center justify-center" aria-label={`Ouvrir ${c.url}`}><ArrowUpRight size={16} /></a>}</div>
      {big && <p className="mt-4 text-ardoise"><span className="text-encre font-medium">{t('Le besoin.')} </span>{t(c.brief)}</p>}
      <ul className="mt-5 flex flex-wrap gap-2">{c.done.map((d) => <li key={d} className="px-3 py-1.5 rounded-full bg-porcelaine text-[13px]">{t(d)}</li>)}</ul>
    </div>
  </article>
);
