import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { IMG, CASES, AGENCY, CONTACT } from '../data';
import { Reveal, Img, Head } from '../ui';
import { Pillars, Inside, Process, FaitPar, Faq, FinalCTA } from '../sections';

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
  return (
    <>
      {/* HERO */}
      <section className="dark relative min-h-[100svh] flex flex-col overflow-hidden">
        <Img src={IMG.hero} alt="Studio Digilago face à l’océan, écrans avec des maquettes de sites" eager className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#0A1428_0%,rgba(10,20,40,.88)_40%,rgba(10,20,40,.35)_75%,rgba(10,20,40,.5)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-nuit to-transparent" />
        <div className="wrap relative flex-1 grid lg:grid-cols-12 gap-10 items-center pt-32 pb-16">
          <div className="lg:col-span-7">
            <Reveal><p className="kicker">Société de services numériques, El Jadida</p></Reveal>
            <Reveal delay={0.05}><h1 className="mt-5 text-[clamp(2.8rem,6.6vw,6rem)] font-bold leading-[0.98] tracking-[-0.05em]">Des sites et des logiciels qui font venir des clients.</h1></Reveal>
            <Reveal delay={0.15}><p className="mt-7 text-[19px] text-white/80 max-w-[52ch]">Nous concevons, référençons et faisons tourner le numérique des entreprises marocaines : sites sur-mesure, boutiques, applications, fiche Google et visibilité dans les IA.</p></Reveal>
            <Reveal delay={0.25} className="mt-9 flex flex-wrap gap-3"><Link to="/contact" className="btn btn-safran">Ma première version en 72 h <ArrowRight size={18} /></Link><Link to="/realisations" className="btn btn-line">Voir nos réalisations</Link></Reveal>
          </div>
          <div className="lg:col-span-5 flex lg:justify-end"><DeployCard /></div>
        </div>
        <div className="wrap relative pb-10"><dl className="grid grid-cols-2 md:grid-cols-4 border-t border-white/15">{AGENCY.numbers.map(([n, l]) => <div key={l} className="pt-5 pr-4"><dt className="font-display text-[28px] font-semibold tracking-[-0.03em]">{n}</dt><dd className="text-[14px] text-brume">{l}</dd></div>)}</dl></div>
      </section>

      {/* PLATEFORMES */}
      <section className="dark py-12 border-y border-white/10"><div className="wrap flex flex-col md:flex-row md:items-center gap-6"><p className="shrink-0 text-[15px] text-brume md:max-w-[15rem]">Nous vous rendons visible là où vos clients cherchent.</p>
        <div className="marquee-wrap flex-1"><div className="marquee gap-14" style={{ ['--d' as any]: '45s' }}>{[0, 1].map((r) => <div key={r} className="flex items-center gap-14 pr-14" aria-hidden={r === 1}>{PLATFORMS.map((x) => <span key={x} className="font-display text-[24px] font-semibold tracking-[-0.03em] text-white/55 whitespace-nowrap">{x}</span>)}</div>)}</div></div></div></section>

      {/* SERVICES */}
      <section className="light py-24 lg:py-32"><div className="wrap">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8"><Head kicker="Services" title="Trois métiers, une seule équipe qui s’en occupe." lead="Du premier écran dessiné au serveur qui tourne la nuit, chaque étape est faite chez nous, par les mêmes personnes." /><Reveal><Link to="/services" className="btn btn-dark shrink-0">Tous les services <ArrowUpRight size={16} /></Link></Reveal></div>
        <div className="mt-14"><Pillars /></div>
      </div></section>

      {/* CE QU'IL Y A DERRIÈRE */}
      <section className="dark py-24 lg:py-32"><div className="wrap">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6"><Head kicker="La valeur du travail" title="Ce qu’il y a derrière un site Digilago." lead="Un site n’est pas une page jolie. C’est un outil qui doit être trouvé, se charger vite, rassurer et convertir. Voici ce que chaque projet contient, sans supplément." /></div>
          <Reveal delay={0.1} className="lg:col-span-6"><div className="relative aspect-[4/3] rounded-3xl overflow-hidden"><Img src={IMG.client} alt="Une gérante de restaurant découvre son nouveau site avec un développeur Digilago" className="absolute inset-0 w-full h-full object-cover" /><div className="absolute left-4 bottom-4 right-4 sm:right-auto rounded-2xl bg-nuit/85 backdrop-blur p-4 ring-1 ring-white/10"><p className="text-[14px] text-brume">Mise en ligne</p><p className="font-display font-semibold">Formation de trente minutes incluse</p></div></div></Reveal>
        </div>
        <div className="mt-16"><Inside /></div>
      </div></section>

      {/* CLIENTS */}
      <section className="light py-24 lg:py-32"><div className="wrap">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8"><Head kicker="Ils nous font confiance" title="Des clients réels, des sites en service." lead="Trois écoles d’El Jadida qui gèrent aujourd’hui leurs inscriptions, leurs actualités et leurs parents en ligne." /><Reveal><Link to="/realisations" className="btn btn-line-dark shrink-0">Études de cas <ArrowUpRight size={16} /></Link></Reveal></div>
        <div className="mt-14 grid lg:grid-cols-12 gap-6">
          <Reveal className="lg:col-span-7"><CaseCard c={CASES[0]} big /></Reveal>
          <div className="lg:col-span-5 grid gap-6">{CASES.slice(1).map((c, i) => <Reveal key={c.name} delay={0.08 * (i + 1)}><CaseCard c={c} /></Reveal>)}</div>
        </div>
      </div></section>

      <FaitPar />

      {/* MÉTHODE */}
      <section className="light py-24 lg:py-32"><div className="wrap grid lg:grid-cols-12 gap-14">
        <div className="lg:col-span-4"><Head sm kicker="Méthode" title="Six étapes, zéro surprise." lead="Chaque étape a un résultat que vous pouvez voir. Vous ne payez qu’après avoir validé la première version." /><Reveal delay={0.1}><div className="mt-10 relative aspect-[4/3] rounded-3xl overflow-hidden hidden lg:block"><Img src={IMG.app} alt="Tablette affichant un agenda de rendez-vous dans une clinique" className="absolute inset-0 w-full h-full object-cover" /></div></Reveal></div>
        <div className="lg:col-span-8 lg:pt-4"><Process /></div>
      </div></section>

      {/* SOCIÉTÉ */}
      <section className="dark py-24 lg:py-32"><div className="wrap grid lg:grid-cols-12 gap-12 items-center">
        <Reveal className="lg:col-span-7"><div className="relative aspect-[16/10] rounded-3xl overflow-hidden"><Img src={IMG.team} alt="L’équipe Digilago au travail" className="absolute inset-0 w-full h-full object-cover" /></div></Reveal>
        <div className="lg:col-span-5"><Head kicker="La société" title="Née à El Jadida. Au service de tout le Maroc." lead={AGENCY.mission} /><Reveal delay={0.1}><Link to="/societe" className="btn btn-line mt-8">Découvrir Digilago <ArrowUpRight size={16} /></Link></Reveal></div>
      </div></section>

      {/* FAQ */}
      <section className="light py-24 lg:py-32"><div className="wrap grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4"><Head sm kicker="Questions fréquentes" title="Ce qu’on nous demande avant de commencer." /><Reveal delay={0.1}><div className="mt-8 rounded-3xl bg-nuit text-white p-7"><p className="font-display text-[20px] font-semibold">Une autre question ?</p><p className="mt-2 text-brume">Écrivez-nous, un humain répond le jour même.</p><a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-safran mt-6">Écrire sur WhatsApp</a></div></Reveal></div>
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
      {big && <p className="mt-4 text-ardoise">{c.brief}</p>}
      <ul className="mt-5 flex flex-wrap gap-2">{c.done.map((d) => <li key={d} className="px-3 py-1.5 rounded-full bg-porcelaine text-[13px]">{d}</li>)}</ul>
    </div>
  </article>
);
