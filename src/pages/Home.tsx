import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { IMG, CASES, AGENCY, CONTACT, PACK_IMG } from '../data';
import { Simulator, Sectors } from '../surprise';
import { Reveal, Img, Head } from '../ui';
import { Pillars, Inside, Process, FaitPar, Faq, FinalCTA } from '../sections';
import { ScrollText, RevealImg, CountUp } from '../fx';

/* Carte « mise en ligne » : le seul moment animé au chargement */
const DEPLOY: [string, string][] = [['Compilation', '0,8 s'], ['Certificat SSL', 'actif'], ['Fiche Google', 'reliée'], ['Données pour les IA', 'publiées'], ['Performance mobile', '98 / 100']];
const DeployCard = () => {
  const reduce = useReducedMotion();
  return (
    <div className="w-full max-w-[380px] rounded-2xl bg-nuit/85 backdrop-blur-md ring-1 ring-white/15 p-5 font-mono text-[13px] shadow-[0_40px_80px_-30px_rgba(0,0,0,.8)]" aria-label="Exemple de mise en ligne d'un site">
      <p className="text-brume">$ digilago deploy <span className="text-white">votre-entreprise.ma</span></p>
      <ul className="mt-3 space-y-1.5">{DEPLOY.map(([k, v], i) => (
        <motion.li key={k} className="flex items-center justify-between gap-4" initial={reduce ? false : { opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 + i * 0.35, duration: 0.4 }}>
          <span className="flex items-center gap-2"><Check size={14} className="text-cyan" />{k}</span><span className="text-brume">{v}</span>
        </motion.li>
      ))}</ul>
      <motion.p className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-safran" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 + DEPLOY.length * 0.35 }}><span className="w-2 h-2 rounded-full bg-safran" />En ligne<span className="caret">_</span></motion.p>
    </div>
  );
};

const PLATFORMS = ['Google', 'Google Maps', 'ChatGPT', 'Gemini', 'WhatsApp', 'Instagram', 'Perplexity', 'Waze', 'Facebook', 'TripAdvisor'];

export default function Home() {
  const reduce = useReducedMotion(); const { scrollY } = useScroll(); const py = useTransform(scrollY, [0, 900], [0, 140]);
  return (
    <>
      {/* HERO */}
      <section className="dark relative min-h-[100svh] flex flex-col overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: reduce ? 0 : py }} initial={reduce ? false : { scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 2.8, ease: [0.16, 1, 0.3, 1] }}><Img src={IMG.hero} alt="Studio Digilago face à l’océan, écrans avec des maquettes de sites" eager className="absolute inset-0 w-full h-full object-cover" /></motion.div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#0A1428_0%,rgba(10,20,40,.88)_40%,rgba(10,20,40,.35)_75%,rgba(10,20,40,.5)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-nuit to-transparent" />
        <div className="wrap relative flex-1 grid lg:grid-cols-12 gap-10 items-center pt-32 pb-16">
          <div className="lg:col-span-7">
            <Reveal><p className="kicker">Société de services numériques, El Jadida</p></Reveal>
            <ScrollText auto as="h1" delay={0.15} text="Le numérique qui fait venir vos clients." className="mt-6 text-[clamp(2.8rem,6.4vw,5.8rem)] leading-[1] !tracking-[-0.045em]" />
            <Reveal delay={0.15}><p className="mt-7 text-[19px] text-white/80 max-w-[50ch]">Digilago conçoit, référence et opère les sites, applications et logiciels des entreprises marocaines. Une seule équipe, du premier écran au serveur.</p></Reveal>
            <Reveal delay={0.25} className="mt-9 flex flex-wrap gap-3"><Link to="/contact" className="btn btn-safran">Ma première version en 72 h <ArrowRight size={18} /></Link><Link to="/realisations" className="btn btn-line">Voir nos réalisations</Link></Reveal>
          </div>
          <div className="lg:col-span-5 flex lg:justify-end"><DeployCard /></div>
        </div>
        <div className="wrap relative pb-10"><dl className="grid grid-cols-2 md:grid-cols-4 border-t border-white/15">{AGENCY.numbers.map(([n, l]) => <div key={l} className="pt-5 pr-4"><dt className="font-display text-[30px] font-medium tracking-[-0.03em]"><CountUp value={n} /></dt><dd className="text-[14px] text-brume">{l}</dd></div>)}</dl></div>
      </section>

      {/* PLATEFORMES */}
      <section className="dark py-12 border-y border-white/10"><div className="wrap flex flex-col md:flex-row md:items-center gap-6"><p className="shrink-0 text-[15px] text-brume md:max-w-[15rem]">Présents là où vos clients vous cherchent.</p>
        <div className="marquee-wrap flex-1"><div className="marquee gap-14" style={{ ['--d' as any]: '45s' }}>{[0, 1].map((r) => <div key={r} className="flex items-center gap-14 pr-14" aria-hidden={r === 1}>{PLATFORMS.map((x) => <span key={x} className="font-display text-[24px] font-semibold tracking-[-0.03em] text-white/55 whitespace-nowrap">{x}</span>)}</div>)}</div></div></div></section>

      {/* SERVICES */}
      <section className="light py-24 lg:py-32"><div className="wrap">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8"><Head kicker="Expertises" title="Une équipe. Trois expertises." lead="Nous concevons vos outils, nous les rendons visibles, puis nous les faisons tourner. Sans intermédiaire, sans sous-traitance." /><Reveal><Link to="/services" className="btn btn-dark shrink-0">Tous les services <ArrowUpRight size={16} /></Link></Reveal></div>
        <div className="mt-14"><Pillars /></div>
      </div></section>

      {/* SIMULATEUR */}
      <section className="dark relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 dotgrid opacity-60 [mask-image:radial-gradient(70%_60%_at_50%_30%,#000,transparent)]" />
        <div className="wrap relative">
          <Head center kicker="Essayez" title="Voyez-vous déjà en ligne." lead="Tapez le nom de votre entreprise. Voici comment vos clients pourraient vous trouver demain, sur Google, sur la carte et auprès des IA." />
          <Reveal delay={0.1} className="mt-12"><Simulator /></Reveal>
        </div>
      </section>

      {/* MÉTIERS */}
      <section className="light py-24 lg:py-32"><div className="wrap">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8"><Head kicker="Secteurs" title="Une offre pensée pour votre métier." lead="Sept offres construites à partir de ce que nos clients nous demandent le plus. Survolez un secteur pour le découvrir." /><Reveal><Link to="/services#packs" className="btn btn-line-dark shrink-0">Comparer les offres <ArrowUpRight size={16} /></Link></Reveal></div>
        <Reveal delay={0.1} className="mt-12 text-white"><Sectors images={PACK_IMG} /></Reveal>
      </div></section>

      {/* CE QU'IL Y A DERRIÈRE */}
      <section className="dark py-24 lg:py-32"><div className="wrap">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6"><Head kicker="Notre standard" title="L’exigence, dans chaque détail." lead="Un site professionnel se juge à ce qu’on ne voit pas : sa vitesse, sa solidité, sa lisibilité par Google et les IA. Voici ce que contient chaque projet, sans supplément." /></div>
          <div className="lg:col-span-6 relative"><RevealImg src={IMG.code} alt="Un développeur Digilago au travail, code à l’écran" /><Reveal delay={0.6} className="absolute left-4 bottom-4 right-4 sm:right-auto"><div className="rounded-2xl bg-nuit/85 backdrop-blur p-4 ring-1 ring-white/10"><p className="text-[14px] text-brume">Chaque ligne</p><p className="font-display font-medium">écrite, relue et testée chez nous</p></div></Reveal></div>
        </div>
        <div className="mt-16"><Inside /></div>
      </div></section>

      {/* CLIENTS */}
      <section className="light py-24 lg:py-32"><div className="wrap">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8"><Head kicker="Références" title="Ils nous ont confié leur image." lead="Trois établissements d’El Jadida qui gèrent aujourd’hui leurs inscriptions, leurs actualités et la relation avec les parents en ligne." /><Reveal><Link to="/realisations" className="btn btn-line-dark shrink-0">Études de cas <ArrowUpRight size={16} /></Link></Reveal></div>
        <div className="mt-14 grid lg:grid-cols-12 gap-6">
          <Reveal className="lg:col-span-7"><CaseCard c={CASES[0]} big /></Reveal>
          <div className="lg:col-span-5 grid gap-6">{CASES.slice(1).map((c, i) => <Reveal key={c.name} delay={0.08 * (i + 1)}><CaseCard c={c} /></Reveal>)}</div>
        </div>
      </div></section>

      <FaitPar />

      {/* MÉTHODE */}
      <section className="light py-24 lg:py-32"><div className="wrap grid lg:grid-cols-12 gap-14">
        <div className="lg:col-span-4"><Head sm kicker="Méthode" title="Une méthode claire, du premier appel au lancement." lead="Chaque étape produit un résultat concret. Vous ne payez qu’après avoir validé la première version." /><RevealImg src={IMG.client} alt="Présentation d’un nouveau site à une gérante de restaurant" className="mt-10 hidden lg:block" /></div>
        <div className="lg:col-span-8 lg:pt-4"><Process /></div>
      </div></section>

      {/* SOCIÉTÉ */}
      <section className="dark py-24 lg:py-32"><div className="wrap grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 grid grid-cols-5 gap-4 items-end"><RevealImg src={IMG.eljadida} alt="Les remparts de la Cité portugaise d’El Jadida au crépuscule" ratio="aspect-[4/5]" className="col-span-3" /><RevealImg src={IMG.team} alt="L’équipe Digilago au travail" ratio="aspect-[4/5]" className="col-span-2 -mb-10" /></div>
        <div className="lg:col-span-5"><Head kicker="La société" title="Ancrés à El Jadida. Ouverts sur tout le Maroc." lead={AGENCY.mission} /><Reveal delay={0.1}><Link to="/societe" className="btn btn-line mt-8">Découvrir Digilago <ArrowUpRight size={16} /></Link></Reveal></div>
      </div></section>

      {/* FAQ */}
      <section className="light py-24 lg:py-32"><div className="wrap grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4"><Head sm kicker="Questions fréquentes" title="Les réponses, avant même la question." /><Reveal delay={0.1}><div className="mt-8 rounded-3xl bg-nuit text-white p-7"><p className="font-display text-[20px] font-medium">Une autre question ?</p><p className="mt-2 text-brume">Écrivez-nous. Un membre de l’équipe vous répond le jour même.</p><a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-safran mt-6">Écrire sur WhatsApp</a></div></Reveal></div>
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
      <div className="flex items-start justify-between gap-4"><div><h3 className={big ? 'text-[26px]' : 'text-[21px]'}>{c.name}</h3><p className="mt-1 text-[14px] text-ardoise">{c.sector} · {c.place}</p></div>{c.url && <a href={c.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 shrink-0 rounded-full bg-nuit text-white flex items-center justify-center" aria-label={`Ouvrir ${c.url}`}><ArrowUpRight size={16} /></a>}</div>
      {big && <p className="mt-4 text-ardoise"><span className="text-encre font-medium">Le besoin. </span>{c.brief}</p>}
      <ul className="mt-5 flex flex-wrap gap-2">{c.done.map((d) => <li key={d} className="px-3 py-1.5 rounded-full bg-porcelaine text-[13px]">{d}</li>)}</ul>
    </div>
  </article>
);
