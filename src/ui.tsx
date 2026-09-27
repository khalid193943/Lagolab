/** Briques communes : apparition au défilement, image avec repli, en-tête de section, logo. */
import { useState, Children, useEffect as useEff, useRef as useR } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ScrollText } from './fx';

export const Reveal = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}>{children}</motion.div>;
};

/* Image : chargement paresseux, et un dégradé propre si l'image ne charge pas */
export const Img = ({ src, alt, className = '', eager = false, tone = '#1B2A4A' }: { src: string; alt: string; className?: string; eager?: boolean; tone?: string }) => {
  const [err, setErr] = useState(false);
  if (err || !src) return <div role="img" aria-label={alt} className={className} style={{ background: `radial-gradient(80% 90% at 70% 20%, ${tone}, #0A1428)` }} />;
  return <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" {...(eager ? { fetchPriority: 'high' as const } : {})} onError={() => setErr(true)} className={className} />;
};

export const Head = ({ kicker, title, lead, className = '', center = false, sm = false }: { kicker?: string; title: React.ReactNode; lead?: React.ReactNode; className?: string; center?: boolean; sm?: boolean }) => (
  <div className={`${center ? 'text-center mx-auto' : ''} max-w-[46rem] ${className}`}>
    {kicker && <Reveal><p className="kicker">{kicker}</p></Reveal>}
    {typeof title === 'string' ? <ScrollText text={title} className={`mt-4 ${sm ? 'text-[clamp(1.71rem,2.7vw,2.34rem)]' : 'text-[clamp(1.89rem,3.78vw,3.33rem)]'}`} /> : <h2 className="mt-4">{title}</h2>}
    {lead && <Reveal delay={0.1}><p className={`mt-6 text-[18px] opacity-70 max-w-[56ch] ${center ? 'mx-auto' : ''}`}>{lead}</p></Reveal>}
  </div>
);

/* Le logo Digilago : un D (la marque), une vague (le lago), un point cyan (le numérique). */
export const MARK = {
  d: 'M14 32 V10 H30 A22 22 0 0 1 30 54 H14 Z',
  wave: 'M21.5 35 C24.5 29, 28 29, 31 33.5 S37 38, 40 31',
  dot: { cx: 43.6, cy: 27.2, r: 3.3 },
};
export const Mark = ({ className = 'w-8 h-8', draw = false, delay = 0, color = '#F4B53F', stroke = 6.5 }: { className?: string; draw?: boolean; delay?: number; color?: string; stroke?: number }) => {
  const reduce = useReducedMotion(); const anim = draw && !reduce;
  const t = (d: number, dur: number) => ({ duration: dur, delay: delay + d, ease: [0.65, 0, 0.35, 1] as any });
  return (
    <svg viewBox="8 4 50 56" className={className} aria-hidden>
      <motion.path d={MARK.d} fill="none" stroke={color} strokeWidth={stroke} strokeLinejoin="round" strokeLinecap="square" initial={anim ? { pathLength: 0 } : false} animate={{ pathLength: 1 }} transition={t(0, 0.9)} />
      <motion.path d={MARK.wave} fill="none" stroke={color} strokeWidth={stroke * 0.6} strokeLinecap="round" initial={anim ? { pathLength: 0 } : false} animate={{ pathLength: 1 }} transition={t(0.55, 0.6)} />
      <motion.circle {...MARK.dot} fill="#2DD4E6" initial={anim ? { scale: 0 } : false} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 12, delay: delay + 1.05 }} style={{ transformOrigin: `${MARK.dot.cx}px ${MARK.dot.cy}px` }} />
    </svg>
  );
};
/*
 * Le nom « digilago » : les points des deux « i » sont de vraies pastilles safran, animées.
 * On écrit des « ı » sans point et on pose les pastilles exactement là où Sora dessine le point
 * (centre à 0,1505 em de l'origine du caractère, 0,682 em au-dessus de la ligne de base, rayon 0,07 em).
 */
const IDot = ({ k, delay, loop }: { k: number; delay: number; loop: boolean }) => {
  const reduce = useReducedMotion();
  return (
    <i className="relative inline-block w-0 h-0 align-baseline not-italic" aria-hidden>
      <motion.b className="absolute block" style={{ left: '0.0805em', bottom: '0.612em', width: '0.14em', height: '0.14em' }}
        initial={reduce ? false : { y: '-1.4em', opacity: 0 }} animate={{ y: '0em', opacity: 1 }} transition={{ type: 'spring', stiffness: 520, damping: 13, delay: delay + k * 0.14 }}>
        <motion.b className="block w-full h-full rounded-full bg-safran shadow-[0_0_0.18em_rgba(244,181,63,.75)]"
          animate={reduce || !loop ? undefined : { y: ['0em', '-0.34em', '0em', '0em'], scaleY: [1, 1.1, 0.82, 1] }}
          transition={{ duration: 0.9, times: [0, 0.35, 0.7, 1], ease: 'easeInOut', repeat: Infinity, repeatDelay: 3.6, delay: delay + 1.6 + k * 0.18 }} />
      </motion.b>
    </i>
  );
};
export const Wordmark = ({ className = '', delay = 0, loop = true }: { className?: string; delay?: number; loop?: boolean }) => (
  <span dir="ltr" className={`font-medium tracking-[-0.045em] leading-none whitespace-nowrap ${className}`} style={{ fontFamily: 'Sora, sans-serif' }} aria-label="digilago" role="img">
    <span aria-hidden>d<IDot k={0} delay={delay} loop={loop} />ıg<IDot k={1} delay={delay} loop={loop} />ılago</span>
  </span>
);
export const Logo = ({ draw = false }: { draw?: boolean }) => (
  <span className="flex items-center gap-2">
    <Mark className="w-7 h-8" draw={draw} delay={0.2} />
    <Wordmark className="text-[20px]" delay={draw ? 1.1 : 0} />
  </span>
);

/* Petit bloc « cadre de navigateur » autour d'une capture */
export const Browser = ({ children, url, className = '' }: { children: React.ReactNode; url?: string; className?: string }) => (
  <div className={`rounded-2xl overflow-hidden bg-nuit-2 ring-1 ring-white/10 shadow-[0_40px_100px_-40px_rgba(0,0,0,.8)] ${className}`}>
    <div className="h-9 flex items-center gap-2 px-4 bg-[#0E1830]"><span className="w-2.5 h-2.5 rounded-full bg-white/20" /><span className="w-2.5 h-2.5 rounded-full bg-white/20" /><span className="w-2.5 h-2.5 rounded-full bg-white/20" />{url && <span className="ms-3 text-[12px] text-brume truncate">{url}</span>}</div>
    {children}
  </div>
);

/**
 * Swipe : sur téléphone, un carrousel qui glisse au doigt (accroche, points de progression, compteur) ;
 * à partir de `from`, une grille classique. Un seul balisage, deux comportements.
 */
export const Swipe = ({ children, cols = 'md:grid-cols-3', from = 'md', item = 'w-[84%]', className = '', dark = false }: { children: React.ReactNode; cols?: string; from?: 'md' | 'lg'; item?: string; className?: string; dark?: boolean }) => {
  const ref = useR<HTMLDivElement>(null); const [i, setI] = useState(0); const n = Children.count(children);
  useEff(() => { const el = ref.current; if (!el) return; const f = () => { const w = (el.firstElementChild as HTMLElement)?.offsetWidth || 1; setI(Math.min(n - 1, Math.round(Math.abs(el.scrollLeft) / (w + 14)))); }; el.addEventListener('scroll', f, { passive: true }); return () => el.removeEventListener('scroll', f); }, [n]);
  const grid = from === 'lg' ? 'lg:grid lg:overflow-visible lg:mx-0 lg:px-0 lg:gap-6' : 'md:grid md:overflow-visible md:mx-0 md:px-0 md:gap-6';
  const hide = from === 'lg' ? 'lg:hidden' : 'md:hidden';
  const w = from === 'lg' ? 'lg:w-auto' : 'md:w-auto';
  return (
    <div className={className}>
      <div ref={ref} className={`flex gap-3.5 overflow-x-auto snap-x snap-mandatory -mx-5 px-5 scroll-px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${grid} ${cols}`}>
        {Children.map(children, (c) => <div className={`snap-start shrink-0 ${item} ${w}`}>{c}</div>)}
      </div>
      <div className={`${hide} mt-5 flex items-center justify-between`} aria-hidden>
        <div className="flex gap-1.5">{Array.from({ length: n }).map((_, k) => <span key={k} className={`h-1.5 rounded-full transition-all duration-500 ${k === i ? 'w-6 bg-safran' : `w-1.5 ${dark ? 'bg-white/25' : 'bg-encre/20'}`}`} />)}</div>
        <span className={`text-[13px] tabular-nums ${dark ? 'text-brume' : 'text-ardoise'}`}>{String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
      </div>
    </div>
  );
};
