/** Briques communes : apparition au défilement, image avec repli, en-tête de section, logo. */
import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

export const Reveal = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}>{children}</motion.div>;
};

/* Image : chargement paresseux, et un dégradé propre si l'image ne charge pas */
export const Img = ({ src, alt, className = '', eager = false, tone = '#1B2A4A' }: { src: string; alt: string; className?: string; eager?: boolean; tone?: string }) => {
  const [err, setErr] = useState(false);
  if (err || !src) return <div role="img" aria-label={alt} className={className} style={{ background: `radial-gradient(80% 90% at 70% 20%, ${tone}, #0A1428)` }} />;
  return <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" onError={() => setErr(true)} className={className} />;
};

export const Head = ({ kicker, title, lead, className = '', center = false, sm = false }: { kicker?: string; title: React.ReactNode; lead?: React.ReactNode; className?: string; center?: boolean; sm?: boolean }) => (
  <Reveal className={`${center ? 'text-center mx-auto' : ''} max-w-[46rem] ${className}`}>
    {kicker && <p className="kicker">{kicker}</p>}
    <h2 className={`mt-3 ${sm ? 'text-[clamp(1.9rem,3vw,2.6rem)]' : 'text-[clamp(2rem,4.2vw,3.6rem)]'}`}>{title}</h2>
    {lead && <p className={`mt-5 text-[18px] opacity-75 max-w-[56ch] ${center ? 'mx-auto' : ''}`}>{lead}</p>}
  </Reveal>
);

export const Logo = ({ light = false }: { light?: boolean }) => (
  <span className="flex items-center gap-2.5">
    <svg viewBox="0 0 64 64" className="w-8 h-8" aria-hidden><rect width="64" height="64" rx="14" fill={light ? '#0A1428' : '#F4B53F'} /><path d="M18 16h14c9.4 0 16 6.6 16 16s-6.6 16-16 16H18z" fill="none" stroke={light ? '#F4B53F' : '#0A1428'} strokeWidth="6" /><circle cx="32" cy="32" r="4" fill={light ? '#2DD4E6' : '#0A1428'} /></svg>
    <span className="font-display font-semibold text-[19px] tracking-[-0.04em]">digilago</span>
  </span>
);

/* Petit bloc « cadre de navigateur » autour d'une capture */
export const Browser = ({ children, url, className = '' }: { children: React.ReactNode; url?: string; className?: string }) => (
  <div className={`rounded-2xl overflow-hidden bg-nuit-2 ring-1 ring-white/10 shadow-[0_40px_100px_-40px_rgba(0,0,0,.8)] ${className}`}>
    <div className="h-9 flex items-center gap-2 px-4 bg-[#0E1830]"><span className="w-2.5 h-2.5 rounded-full bg-white/20" /><span className="w-2.5 h-2.5 rounded-full bg-white/20" /><span className="w-2.5 h-2.5 rounded-full bg-white/20" />{url && <span className="ml-3 text-[12px] text-brume truncate">{url}</span>}</div>
    {children}
  </div>
);
