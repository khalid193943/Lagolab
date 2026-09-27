import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, X } from 'lucide-react';
import { CASES, LIBRARY, GROUPS, Concept } from '../data';
import { Reveal, Img, Head } from '../ui';
import { FaitPar, FinalCTA, ConceptCard } from '../sections';
import { CaseCard } from './Home';

export default function Realisations() {
  const [g, setG] = useState('Tous'); const [open, setOpen] = useState<Concept | null>(null);
  const list = useMemo(() => (g === 'Tous' ? LIBRARY : LIBRARY.filter((c) => c.group === g)), [g]);
  return (
    <>
      <section className="dark pt-36 pb-16 lg:pt-44"><div className="wrap">
        <Reveal><p className="kicker">Réalisations</p><h1 className="mt-4 text-[clamp(2.6rem,6vw,5.4rem)] font-bold tracking-[-0.05em] leading-[0.98] max-w-[16ch]">Le travail parle mieux que nous.</h1><p className="mt-6 text-[19px] text-white/80 max-w-[52ch]">Des sites de clients en service, et une bibliothèque de concepts par métier pour imaginer le vôtre.</p></Reveal>
      </div></section>

      <section className="light py-24 lg:py-28"><div className="wrap">
        <Head kicker="Études de cas" title="Nos clients." />
        <div className="mt-12 grid lg:grid-cols-3 gap-6">{CASES.map((c, i) => <Reveal key={c.name} delay={i * 0.06} className="h-full"><CaseCard c={c} big /></Reveal>)}</div>
      </div></section>

      <FaitPar compact />

      <section className="dark py-24 lg:py-28 border-t border-white/10"><div className="wrap">
        <Head kicker="Bibliothèque" title="Un concept pour chaque métier." lead="Filtrez par secteur. Chaque concept montre la direction que pourrait prendre votre site." />
        <div className="mt-10 flex flex-wrap gap-2">{GROUPS.map((x) => <button key={x} onClick={() => setG(x)} aria-pressed={g === x} className={`h-10 px-4 rounded-full text-[14px] transition-colors ${g === x ? 'bg-safran text-nuit font-semibold' : 'ring-1 ring-white/15 text-white/80 hover:text-white hover:ring-white/40'}`}>{x}</button>)}</div>
        <motion.div layout className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
          <AnimatePresence mode="popLayout">{list.map((c) => <motion.div key={c.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><ConceptCard c={c} onOpen={() => setOpen(c)} /></motion.div>)}</AnimatePresence>
        </motion.div>
      </div></section>

      <AnimatePresence>{open && (
        <motion.div className="fixed inset-0 z-[80] bg-nuit/90 backdrop-blur-sm overflow-y-auto p-4 flex items-start lg:items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)} role="dialog" aria-modal="true" aria-label={open.name}>
          <motion.div initial={{ y: 12 }} animate={{ y: 0 }} className="w-full max-w-6xl my-10 grid lg:grid-cols-12 gap-6 rounded-3xl bg-nuit-2 ring-1 ring-white/10 p-4 md:p-6" onClick={(e) => e.stopPropagation()}>
            <div className="lg:col-span-8 rounded-2xl overflow-hidden bg-nuit"><Img src={open.img} alt={`Site ${open.name}`} tone={open.color} className="w-full h-full max-h-[75vh] object-contain" /></div>
            <div className="lg:col-span-4 p-2 flex flex-col">
              <div className="flex justify-between items-start gap-4"><div><p className="text-brume text-[14px]">{open.sector} · {open.city}</p><h3 className="mt-1 text-[28px]">{open.name}</h3></div><button onClick={() => setOpen(null)} className="w-11 h-11 shrink-0 rounded-full ring-1 ring-white/20 flex items-center justify-center" aria-label="Fermer"><X size={18} /></button></div>
              <ul className="mt-6 space-y-3">{open.features.map((f) => <li key={f} className="flex gap-3"><Check size={18} className="text-cyan shrink-0 mt-1" />{f}</li>)}</ul>
              <p className="mt-6 text-[15px] text-brume">Bouton principal du site : <span className="text-white">{open.cta}</span></p>
              <button onClick={() => { setOpen(null); setTimeout(() => document.getElementById('demarrer')?.scrollIntoView({ behavior: 'smooth' }), 50); }} className="btn btn-safran mt-auto">Je veux un site comme celui-ci</button>
            </div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>

      <FinalCTA />
    </>
  );
}
