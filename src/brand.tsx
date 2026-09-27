/** Logos clients (redessinés en vectoriel) et sélecteur d'expertises. */
import { useEffect, useState } from 'react';
import { t, tv, L } from './i18n';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Check, ArrowUpRight, PenTool, Search, Server } from 'lucide-react';
import { PILLARS, CATALOG, Service } from './data';
import { Img, Swipe } from './ui';
import { ScrollText } from './fx';
import { Icon3D, ICON3D } from './icons';

/* ---------------- Logos de nos clients ---------------- */
const serif = { fontFamily: '"Libre Baskerville", Georgia, serif' };
export const LogoGC = ({ mono = false }: { mono?: boolean }) => (
  <span className="flex items-center gap-3" aria-label="Académie Georges Claude" role="img">
    <span className="w-11 h-11 rounded-full flex items-center justify-center text-[15px] ring-4" style={{ ...serif, background: mono ? 'transparent' : '#E8B04B', color: mono ? 'currentColor' : '#1B2A4A', boxShadow: mono ? 'inset 0 0 0 1.5px currentColor' : undefined, ['--tw-ring-color' as any]: mono ? 'transparent' : 'rgba(232,176,75,.25)' }}>GC</span>
    <span className="leading-tight"><span className="block font-display font-semibold text-[17px] tracking-[-0.02em]">Georges Claude</span><span className="block text-[11px] opacity-70">École privée · El Jadida</span></span>
  </span>
);
export const LogoAB = ({ mono = false }: { mono?: boolean }) => (
  <span className="flex items-center gap-3" aria-label="Groupe Scolaire Ange Bleu" role="img" style={{ color: mono ? 'currentColor' : '#1E5AA8' }}>
    <svg viewBox="0 0 44 44" className="w-11 h-11" aria-hidden><path d="M8 11 Q22 3 36 11" fill="none" stroke="currentColor" strokeWidth="1.6" /><text x="22" y="32" textAnchor="middle" fontSize="19" fill="currentColor" style={serif}>AB</text><path d="M9 37 H35" stroke="currentColor" strokeWidth="1" opacity=".5" /></svg>
    <span className="leading-tight"><span className="block text-[19px]" style={serif}>Ange Bleu</span><span className="block text-[10px] tracking-[0.14em] opacity-70" style={{ color: mono ? undefined : '#5A6478' }}>EL JADIDA · DEPUIS 1986</span></span>
  </span>
);
export const LogoLM = ({ mono = false }: { mono?: boolean }) => (
  <span className="block text-center leading-none font-bold" aria-label="Les Marronniers" role="img" style={{ ...serif, color: mono ? 'currentColor' : '#0086D9' }}>
    <span className="block text-[21px] tracking-[0.32em] pl-[0.32em]">LES</span><span className="block mt-1 text-[17px]">Marronniers</span>
  </span>
);
const LOGOS = [LogoGC, LogoAB, LogoLM];

/* Mur de logos : deux rangées qui défilent en sens inverse, logos dupliqués */
export const LogoWall = () => (
  <div className="space-y-4">
    {[0, 1].map((r) => (
      <div key={r} className="marquee-wrap"><div className="marquee gap-4" style={{ ['--d' as any]: r ? '38s' : '30s', animationDirection: r ? 'reverse' : 'normal' }}>
        {Array.from({ length: 16 }).map((_, k) => { const L = LOGOS[(k + r) % 3]; return (
          <div key={k} aria-hidden={k >= 3} className="group shrink-0 w-[270px] h-[104px] rounded-2xl bg-white ring-1 ring-encre/8 flex items-center justify-center transition-shadow duration-500 hover:shadow-[0_20px_40px_-24px_rgba(10,20,40,.35)]">
            <span className="grayscale opacity-70 transition-all duration-500 group-hover:grayscale-0 group-hover:opacity-100 text-encre"><L /></span>
          </div>
        ); })}
      </div></div>
    ))}
  </div>
);

/* ---------------- Sélecteur d'expertises ---------------- */
const ICONS = [PenTool, Search, Server];
const PID = ['concevoir', 'trouver', 'operer'];
export const Expertises = () => {
  const [a, setA] = useState(0); const [pause, setPause] = useState(false); const reduce = useReducedMotion();
  const DUR = 7000;
  useEffect(() => { if (pause || reduce) return; const id = window.setTimeout(() => setA((x) => (x + 1) % PILLARS.length), DUR); return () => window.clearTimeout(id); }, [a, pause, reduce]);
  const p = PILLARS[a];
  return (
    <>
      {/* Grand écran : liste à gauche, panneau à droite, avance automatique */}
      <div className="hidden lg:grid grid-cols-12 gap-10 items-stretch" onMouseEnter={() => setPause(true)} onMouseLeave={() => setPause(false)}>
        <div className="col-span-5 flex flex-col justify-center" role="tablist" aria-label={t('Expertises')}>
          {PILLARS.map((x, i) => { const I = ICONS[i]; const on = a === i; return (
            <button key={x.id} role="tab" aria-selected={on} onClick={() => setA(i)} className="group relative text-start py-7 border-b border-encre/10 first:border-t">
              <span className="flex items-center gap-5">
                <span className={`transition-[filter,opacity] duration-500 ${on ? '' : 'grayscale opacity-60 group-hover:opacity-90 group-hover:grayscale-0'}`}><Icon3D src={ICON3D[PID[i]]} Icon={I} className="w-[72px] h-[72px]" float={on} /></span>
                <span className={`font-display text-[clamp(2rem,3vw,2.8rem)] tracking-[-0.04em] leading-none transition-colors duration-500 ${on ? 'text-encre' : 'text-encre/30 group-hover:text-encre/60'}`}>{t(x.title)}</span>
              </span>
              <AnimatePresence initial={false}>{on && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden ps-[68px] pe-6 text-ardoise"><span className="block pt-3 ps-[26px]">{t(x.lead)}</span></motion.p>}</AnimatePresence>
              {on && <span className="absolute start-0 end-0 -bottom-px h-[2px] bg-encre/10 overflow-hidden"><motion.span key={a + String(pause)} className="block h-full bg-safran origin-left" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: pause || reduce ? 0.3 : DUR / 1000, ease: 'linear' }} /></span>}
            </button>
          ); })}
        </div>
        <div className="col-span-7">
          <AnimatePresence mode="wait">
            <motion.article key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="relative h-full rounded-[28px] overflow-hidden bg-nuit text-white flex flex-col">
              <div className="relative h-[300px] overflow-hidden">
                <motion.div className="absolute inset-0" initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}><Img src={p.img} alt={t(p.title)} className="w-full h-full object-cover" /></motion.div>
                <span className="absolute inset-0 bg-gradient-to-t from-nuit via-nuit/30 to-transparent" />
                <p className="absolute start-8 bottom-6 font-display text-[34px] tracking-[-0.04em]">{t(p.title)}</p>
              </div>
              <motion.div className="absolute end-8 top-[150px] z-10" initial={{ scale: 0.4, rotate: -18, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 160, damping: 14, delay: 0.15 }}><Icon3D src={ICON3D[p.id]} Icon={ICONS[a]} className="w-40 h-40" lift={false} /></motion.div>
              <div className="p-8 grid grid-cols-2 gap-8 flex-1">
                <div><p className="text-[13px] text-brume">{t('Ce que nous faisons')}</p><ul className="mt-4 space-y-3">{p.services.map((s) => <li key={s} className="flex items-center justify-between gap-3 pb-3 border-b border-white/10 text-[15.5px]">{t(s)}<ArrowUpRight size={15} className="text-brume shrink-0" /></li>)}</ul></div>
                <div className="rounded-2xl bg-nuit-2 ring-1 ring-white/8 p-5"><p className="text-[13px] text-brume">{t('Ce que vous recevez')}</p><ul className="mt-4 space-y-3">{p.deliver.map((d) => <li key={d} className="flex gap-3 text-[15px]"><Check size={17} className="text-cyan shrink-0 mt-0.5" />{t(d)}</li>)}</ul></div>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>

      {/* Téléphone : cartes à glisser */}
      <Swipe from="lg" className="lg:hidden" item="w-[86%] sm:w-[58%]">
        {PILLARS.map((x, i) => { const I = ICONS[i]; return (
          <article key={x.id} className="h-full rounded-[26px] overflow-hidden bg-nuit text-white flex flex-col">
            <div className="relative h-[190px]"><Img src={x.img} alt={t(x.title)} className="absolute inset-0 w-full h-full object-cover" /><span className="absolute inset-0 bg-gradient-to-t from-nuit to-transparent" /><span className="absolute end-4 top-4"><Icon3D src={ICON3D[x.id]} Icon={I} className="w-20 h-20" /></span><p className="absolute start-5 bottom-4 font-display text-[28px] tracking-[-0.04em]">{t(x.title)}</p></div>
            <div className="p-5 flex-1 flex flex-col">
              <p className="text-[15px] text-white/80">{t(x.lead)}</p>
              <ul className="mt-4 space-y-2.5">{x.services.map((s) => <li key={s} className="pb-2.5 border-b border-white/10 text-[14.5px]">{t(s)}</li>)}</ul>
              <ul className="mt-5 rounded-2xl bg-nuit-2 p-4 space-y-2">{x.deliver.map((d) => <li key={d} className="flex gap-2.5 text-[13.5px]"><Check size={15} className="text-cyan shrink-0 mt-0.5" />{t(d)}</li>)}</ul>
            </div>
          </article>
        ); })}
      </Swipe>
      <div className="mt-10 flex justify-center lg:justify-start"><Link to={L('/services')} className="btn btn-dark">{t('Voir les 19 services en détail')} <ArrowUpRight size={16} /></Link></div>
    </>
  );
};

/* ---------------- Catalogue détaillé : une rangée par service, qui s'ouvre ---------------- */
const Row = ({ s, open, onToggle, dark }: { s: Service; open: boolean; onToggle: () => void; dark: boolean }) => (
  <div className={`border-b ${dark ? 'border-white/10' : 'border-encre/10'}`}>
    <button onClick={onToggle} aria-expanded={open} className="w-full py-5 md:py-6 flex items-center gap-4 md:gap-5 text-start group">
      <Icon3D src={ICON3D[s.t]} Icon={s.Icon} className={`w-16 h-16 md:w-[84px] md:h-[84px] transition-transform duration-500 ${open ? 'md:scale-110' : ''}`} float={open} />
      <span className="flex-1 min-w-0"><span className="block font-display text-[18px] md:text-[21px] tracking-[-0.025em]">{t(s.t)}</span><span className={`block mt-1 text-[14.5px] md:text-[15.5px] ${dark ? 'text-brume' : 'text-ardoise'}`}>{t(s.d)}</span></span>
      <span className={`mt-2 w-8 h-8 shrink-0 rounded-full flex items-center justify-center ring-1 transition-transform duration-500 ${open ? 'rotate-45' : ''} ${dark ? 'ring-white/15' : 'ring-encre/15'}`} aria-hidden><svg viewBox="0 0 12 12" className="w-3 h-3"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.6" /></svg></span>
    </button>
    <AnimatePresence initial={false}>{open && (
      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
        <div className="ps-[80px] md:ps-[104px] pb-7 grid sm:grid-cols-2 gap-5">
          <div><p className={`text-[13px] ${dark ? 'text-brume' : 'text-ardoise'}`}>{t('Inclus')}</p><ul className="mt-3 space-y-2">{s.inc.map((x) => <li key={x} className="flex gap-2.5 text-[15px]"><Check size={16} className={`${dark ? 'text-cyan' : 'text-[#0E8FA0]'} shrink-0 mt-0.5`} />{t(x)}</li>)}</ul></div>
          <div className={`rounded-2xl p-4 ${dark ? 'bg-nuit-2 ring-1 ring-white/8' : 'bg-white ring-1 ring-encre/8'}`}><p className={`text-[13px] ${dark ? 'text-brume' : 'text-ardoise'}`}>{t('Résultat pour vous')}</p><p className="mt-2 font-display text-[17px] leading-snug tracking-[-0.02em]">{t(s.res)}</p></div>
        </div>
      </motion.div>
    )}</AnimatePresence>
  </div>
);
export const Catalog = () => {
  const [open, setOpen] = useState<Record<string, number>>({ concevoir: 0, trouver: 0, operer: 0 });
  return (<>
    {CATALOG.map((g, gi) => { const dark = gi === 1; const I = ICONS[gi]; return (
      <section key={g.id} id={g.id} className={`${dark ? 'dark' : 'light'} py-20 md:py-24 lg:py-28 scroll-mt-32`}><div className="wrap grid lg:grid-cols-12 gap-10 lg:gap-14">
        <div className="lg:col-span-4"><div className="lg:sticky lg:top-44">
          <Icon3D src={ICON3D[g.id]} Icon={I} className="w-28 h-28 md:w-36 md:h-36" />
          <ScrollText text={t(g.title)} className="mt-6 text-[clamp(2.2rem,4vw,3.4rem)]" />
          <p className={`mt-4 text-[17px] max-w-[36ch] ${dark ? 'text-brume' : 'text-ardoise'}`}>{t(g.lead)}</p>
          <p className={`mt-3 text-[14px] ${dark ? 'text-brume' : 'text-ardoise'}`}>{g.items.length} {t('services')}</p>
          <div className="mt-8 relative aspect-[4/3] rounded-3xl overflow-hidden hidden lg:block"><Img src={g.img} alt={t(g.title)} className="absolute inset-0 w-full h-full object-cover" /></div>
        </div></div>
        <div className={`lg:col-span-8 border-t ${dark ? 'border-white/10' : 'border-encre/10'}`}>
          {g.items.map((s, i) => <Row key={s.t} s={s} dark={dark} open={open[g.id] === i} onToggle={() => setOpen((o) => ({ ...o, [g.id]: o[g.id] === i ? -1 : i }))} />)}
        </div>
      </div></section>
    ); })}
  </>);
};
export const CATALOG_COUNT = CATALOG.reduce((n, g) => n + g.items.length, 0);
