/**
 * Bibliothèque de réalisations : 27 concepts par métier + les sites livrés.
 * Chaque site « bouge » : la page défile toute seule dans son cadre au survol, le cadre s'incline avec la souris,
 * et un clic ouvre la fiche complète avec le logo, la ville, le bouton principal et le contenu du site.
 */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowUpRight, X, Check } from 'lucide-react';
import { LIBRARY, GROUPS, WORK, Concept } from './data';
import { Reveal, Eyebrow } from './App';

/* Logo généré : monogramme sur pastille de la couleur du métier */
export const Logo = ({ c, size = 44 }: { c: Concept; size?: number }) => (
  <span className="inline-flex items-center justify-center rounded-2xl font-display shrink-0" style={{ width: size, height: size, background: c.color, color: '#0C0E12', fontSize: size * 0.42, letterSpacing: '-0.04em', boxShadow: `0 10px 30px -12px ${c.color}` }}>{c.mono}</span>
);

/* Cadre de navigateur dont la page défile toute seule au survol */
export const LiveFrame = ({ c, auto = false, className = '' }: { c: Concept; auto?: boolean; className?: string }) => (
  <div className={`group/frame relative rounded-[20px] overflow-hidden bg-[#0F1218] ring-1 ring-white/10 ${className}`}>
    <div className="h-8 flex items-center gap-1.5 px-3 border-b border-white/[0.06]"><span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" /><span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" /><span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" /><span className="ml-2 h-5 px-2.5 rounded-full bg-white/[0.06] text-[11px] text-white/50 flex items-center">{c.name.toLowerCase().replace(/[^a-z0-9]+/g, '')}.ma</span></div>
    <div className="relative aspect-[16/10] overflow-hidden">
      <img src={c.img} alt={`Site ${c.name}`} loading="lazy" className={`absolute inset-0 w-full h-[140%] object-cover object-top transition-transform ease-linear ${auto ? 'live-scroll' : 'duration-[6000ms] group-hover/frame:-translate-y-[28%]'}`} />
    </div>
  </div>
);

export const Library = ({ compact = false }: { compact?: boolean }) => {
  const [g, setG] = useState('Tous'); const [open, setOpen] = useState<Concept | null>(null);
  const list = useMemo(() => (g === 'Tous' ? LIBRARY : LIBRARY.filter((c) => c.group === g)), [g]);
  const shown = compact ? list.slice(0, 9) : list;
  return (
    <div>
      <div className="flex flex-wrap gap-2">{GROUPS.map((x) => <button key={x} onClick={() => setG(x)} className={`h-10 px-4 rounded-full text-[14px] transition-all ${g === x ? 'bg-white text-ink' : 'bg-white/[0.06] text-white/70 hover:bg-white/[0.12]'}`}>{x}{x !== 'Tous' && <span className="ml-1.5 opacity-60">{LIBRARY.filter((c) => c.group === x).length}</span>}</button>)}</div>
      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {shown.map((c, i) => (
            <motion.button layout key={c.id} onClick={() => setOpen(c)} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.5, delay: (i % 3) * 0.06 }} className="group text-left glass rounded-[26px] p-2.5 hover:-translate-y-1.5 transition-transform duration-500" onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.transform = `perspective(900px) rotateX(${((e.clientY - r.top) / r.height - 0.5) * -5}deg) rotateY(${((e.clientX - r.left) / r.width - 0.5) * 6}deg) translateY(-6px)`; }} onMouseLeave={(e) => { e.currentTarget.style.transform = ''; }}>
              <LiveFrame c={c} />
              <div className="p-4 flex items-center gap-3"><Logo c={c} /><span className="min-w-0 flex-1"><span className="block text-[16px] truncate">{c.name}</span><span className="block text-[13px] text-white/50">{c.sector} · {c.city}</span></span><span className="text-[11px] uppercase tracking-[0.14em] text-white/40">Concept</span></div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
      {compact && <Reveal className="mt-10"><Link to="/web/realisations" className="btn btn-ghost">Voir les {LIBRARY.length + WORK.length} réalisations <ArrowUpRight size={16} /></Link></Reveal>}
      <AnimatePresence>{open && (
        <motion.div className="fixed inset-0 z-[80] bg-black/75 backdrop-blur-md flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)}>
          <motion.div className="w-full max-w-[1100px] grid lg:grid-cols-[1fr_360px] gap-6 items-start" initial={{ y: 30, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ type: 'spring', stiffness: 240, damping: 26 }} onClick={(e) => e.stopPropagation()}>
            <LiveFrame c={open} auto className="shadow-[0_60px_120px_-40px_rgba(0,0,0,0.9)]" />
            <div className="glass rounded-[26px] p-7 text-white">
              <div className="flex items-start justify-between gap-4"><div className="flex items-center gap-3"><Logo c={open} size={54} /><div><p className="text-[18px] leading-tight">{open.name}</p><p className="text-[13px] text-white/50">{open.sector} · {open.city}</p></div></div><button onClick={() => setOpen(null)} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0" aria-label="Fermer"><X size={16} /></button></div>
              <p className="mt-6 text-[12px] uppercase tracking-[0.18em] text-white/45">Ce que contient ce site</p>
              <ul className="mt-3 space-y-2.5 text-[15px] text-white/80">{[...open.features, 'Fiche Google et SEO local', 'Version arabe', 'Rapide sur mobile'].map((f) => <li key={f} className="flex gap-2.5"><Check size={16} className="shrink-0 mt-0.5" style={{ color: open.color }} />{f}</li>)}</ul>
              <p className="mt-6 text-[12px] uppercase tracking-[0.18em] text-white/45">Bouton principal</p><span className="mt-2 inline-flex h-10 px-4 rounded-full items-center text-[14px] text-ink" style={{ background: open.color }}>{open.cta}</span>
              <Link to="/web/contact" className="btn btn-gold w-full justify-center mt-8">Le même pour mon entreprise <ArrowRight size={17} /></Link>
              <p className="mt-4 text-[12px] text-white/40">Concept sectoriel : votre site reçoit votre nom, vos photos, vos couleurs et vos textes.</p>
            </div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>
    </div>
  );
};
