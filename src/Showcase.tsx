/**
 * Vitrine automatique : les aperçus défilent tout seuls (fondu + glissement), avec une barre de progression,
 * une liste cliquable et une pause au survol. Sert aux réalisations et aux démos par métier.
 */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Pause, Play } from 'lucide-react';

export type ShowItem = { key: string; title: string; subtitle: string; url?: string; color: string; render: () => React.ReactNode };

export const AutoShowcase = ({ items, interval = 5200, aspect = 'aspect-[16/10]' }: { items: ShowItem[]; interval?: number; aspect?: string }) => {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0); const [paused, setPaused] = useState(false); const [tick, setTick] = useState(0);
  useEffect(() => { if (paused || reduce) return; const id = window.setInterval(() => { setI((x) => (x + 1) % items.length); setTick((t) => t + 1); }, interval); return () => window.clearInterval(id); }, [paused, reduce, items.length, interval]);
  const cur = items[i];
  return (
    <div className="grid lg:grid-cols-12 gap-6 items-start" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {/* Liste */}
      <ol className="lg:col-span-4 order-2 lg:order-1 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:max-h-[460px] pb-1 pr-1">
        {items.map((it, k) => (
          <li key={it.key} className="shrink-0 lg:shrink">
            <button onClick={() => { setI(k); setTick((t) => t + 1); }} className={`relative w-full text-left rounded-2xl px-4 py-3.5 transition-all overflow-hidden ${k === i ? 'bg-white/[0.08] ring-1 ring-white/15' : 'hover:bg-white/[0.04]'}`}>
              <span className="flex items-center gap-3"><span className="w-2 h-2 rounded-full shrink-0" style={{ background: it.color }} /><span className={`text-[15px] whitespace-nowrap lg:whitespace-normal ${k === i ? 'text-white' : 'text-white/60'}`}>{it.title}</span></span>
              <span className="block text-[12.5px] text-white/40 mt-0.5 pl-5 whitespace-nowrap lg:whitespace-normal">{it.subtitle}</span>
              {k === i && !reduce && <motion.span key={tick} className="absolute left-0 bottom-0 h-[2px]" style={{ background: it.color }} initial={{ width: '0%' }} animate={{ width: paused ? undefined : '100%' }} transition={{ duration: interval / 1000, ease: 'linear' }} />}
            </button>
          </li>
        ))}
      </ol>
      {/* Cadre navigateur */}
      <div className="lg:col-span-8 order-1 lg:order-2">
        <div className="rounded-[26px] glass p-2">
          <div className="rounded-[20px] overflow-hidden bg-[#0F1218]">
            <div className="h-10 flex items-center gap-2 px-4 border-b border-white/[0.06]"><span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" /><span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" /><span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
              <AnimatePresence mode="wait"><motion.span key={cur.key} className="ml-3 h-6 px-3 rounded-full bg-white/[0.06] text-[12px] text-white/60 flex items-center" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>{cur.url || `${cur.key}.ma`}</motion.span></AnimatePresence>
              <button onClick={() => setPaused((p) => !p)} className="ml-auto w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center text-white/70" aria-label={paused ? 'Reprendre' : 'Pause'}>{paused ? <Play size={12} /> : <Pause size={12} />}</button>
            </div>
            <div className={`relative ${aspect} overflow-hidden`}>
              <AnimatePresence mode="sync" initial={false}>
                <motion.div key={cur.key} className="absolute inset-0" initial={reduce ? { opacity: 0 } : { opacity: 0, x: 60, scale: 1.02 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={reduce ? { opacity: 0 } : { opacity: 0, x: -60, scale: 0.98 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>{cur.render()}</motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between gap-4 text-[14px]"><span className="text-white/50">{i + 1} / {items.length} · {paused ? 'en pause' : 'défilement automatique'}</span>{cur.url && <a href={cur.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-gold">Ouvrir le site <ArrowUpRight size={15} /></a>}</div>
      </div>
    </div>
  );
};
