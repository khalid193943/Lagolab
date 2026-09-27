import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { AGENCY, LABS, IMG } from '../data';
import { Reveal, Img, Head } from '../ui';
import { FinalCTA } from '../sections';

export default function Societe() {
  return (
    <>
      <section className="dark relative overflow-hidden min-h-[80svh] flex items-end">
        <Img src={IMG.team} alt="L’équipe Digilago autour d’un écran" eager className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-nuit via-nuit/70 to-nuit/20" />
        <div className="wrap relative pt-40 pb-16"><Reveal><p className="kicker">La société</p><h1 className="mt-4 text-[clamp(2.6rem,6vw,5.4rem)] font-bold tracking-[-0.05em] leading-[0.98] max-w-[18ch]">Une équipe tech, née à El Jadida.</h1><p className="mt-6 text-[19px] text-white/85 max-w-[56ch]">{AGENCY.mission}</p></Reveal></div>
      </section>

      <section className="light py-24 lg:py-32"><div className="wrap grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5"><Head kicker="Notre histoire" title="Le talent est là. La visibilité, pas encore." /></div>
        <Reveal delay={0.1} className="lg:col-span-7 space-y-6 text-[18px] text-ardoise"><p>{AGENCY.story}</p><p>{AGENCY.vision}</p></Reveal>
      </div>
      <div className="wrap mt-20"><dl className="grid grid-cols-2 lg:grid-cols-4 gap-4">{AGENCY.numbers.map(([n, l]) => <Reveal key={l}><div className="rounded-3xl bg-white ring-1 ring-encre/8 p-7"><dt className="font-display text-[clamp(2.2rem,4vw,3.2rem)] font-semibold tracking-[-0.04em]">{n}</dt><dd className="mt-1 text-ardoise">{l}</dd></div></Reveal>)}</dl></div></section>

      <section className="dark py-24 lg:py-32"><div className="wrap">
        <Head kicker="Nos engagements" title="Quatre principes qui guident chaque projet." />
        <div className="mt-14 grid md:grid-cols-2 gap-px bg-white/10 rounded-3xl overflow-hidden ring-1 ring-white/10">{AGENCY.values.map(([t, d]) => <Reveal key={t} className="bg-nuit p-8 md:p-10 h-full"><h3 className="text-[26px]">{t}</h3><p className="mt-3 text-brume text-[17px] max-w-[44ch]">{d}</p></Reveal>)}</div>
      </div></section>

      <section className="light py-24 lg:py-32"><div className="wrap grid lg:grid-cols-12 gap-12 items-center">
        <Reveal className="lg:col-span-6"><div className="relative aspect-[4/3] rounded-3xl overflow-hidden"><Img src={IMG.hero} alt="Le studio Digilago face à l’océan" className="absolute inset-0 w-full h-full object-cover" /></div></Reveal>
        <div className="lg:col-span-6"><Head kicker="Grands comptes" title="Des projets plus grands, la même exigence." lead="Groupes scolaires, cliniques, promoteurs, réseaux d’agences : nous prenons en charge les plateformes sur-mesure avec des jalons écrits, un interlocuteur unique et un code qui vous appartient." /><Reveal delay={0.1}><Link to="/contact" className="btn btn-dark mt-8">Parler de votre projet <ArrowUpRight size={16} /></Link></Reveal></div>
      </div></section>

      <section id="labs" className="dark py-24 lg:py-32 scroll-mt-20"><div className="wrap">
        <Head kicker="Digilago Labs" title="Nos propres produits." lead={LABS.lead} />
        <div className="mt-14 grid md:grid-cols-2 gap-5">{LABS.projects.map((p, i) => (
          <Reveal key={p.name} delay={(i % 2) * 0.06} className="h-full"><article className="relative h-full overflow-hidden rounded-3xl bg-nuit-2 ring-1 ring-white/10 p-8">
            <span className="absolute -right-20 -top-20 w-60 h-60 rounded-full blur-3xl opacity-30" style={{ background: p.color }} />
            <div className="relative flex items-center justify-between gap-4"><p className="text-[14px] text-brume">{p.kind}</p><span className="px-3 py-1 rounded-full text-[13px] ring-1 ring-white/15">{p.status}</span></div>
            <h3 className="relative mt-6 text-[34px]">{p.name}</h3><p className="relative mt-3 text-brume max-w-[50ch]">{p.text}</p>
          </article></Reveal>
        ))}</div>
      </div></section>

      <FinalCTA />
    </>
  );
}
