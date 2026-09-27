/**
 * Effets du site, peu nombreux mais variés :
 * - ScrollText : lecture animée, chaque mot s'allume au fil du défilement (ou au chargement pour les titres du haut)
 * - RevealImg  : l'image s'ouvre comme un rideau et se pose doucement
 * - CountUp    : les chiffres comptent jusqu'à leur valeur
 * - Spot       : un halo discret suit la souris sur les cartes
 */
import { createElement, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, useInView, animate, MotionValue } from 'motion/react';
import { Img } from './ui';

type Tag = 'h1' | 'h2' | 'h3' | 'p';

const Word = ({ children, p, range }: { children: React.ReactNode; p: MotionValue<number>; range: [number, number] }) => {
  const o = useTransform(p, range, [0.14, 1]);
  const y = useTransform(p, range, [4, 0]);
  return <motion.span aria-hidden className="inline-block" style={{ opacity: o, y }}>{children}</motion.span>;
};

export const ScrollText = ({ text, as = 'h2', className = '', auto = false, by = 'word', delay = 0 }: { text: string; as?: Tag; className?: string; auto?: boolean; by?: 'word' | 'char'; delay?: number }) => {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'start 0.35'] });
  const parts = by === 'char' ? [...text] : text.split(' ');
  const n = parts.length;
  if (reduce) return createElement(as, { className }, text);
  const sep = (i: number) => (by === 'word' && i < n - 1 ? '\u00A0' : '');
  const children = auto
    /* Titre du haut de page : les mots s'allument l'un après l'autre au chargement */
    ? parts.map((w, i) => <motion.span key={i} aria-hidden className="inline-block" initial={{ opacity: 0.14, y: 6, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ delay: delay + i * 0.09, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>{w}{sep(i)}</motion.span>)
    /* Titre dans la page : lecture au fil du défilement */
    : parts.map((w, i) => { const a = i / n; const b = Math.min(1, a + 1.6 / n); return <Word key={i} p={scrollYProgress} range={[a, b]}>{w}{sep(i)}</Word>; });
  // Espaces insécables + retour à la ligne permis entre les mots
  return createElement(as, { ref, className, 'aria-label': text }, children.flatMap((c, i) => (by === 'word' && i < n - 1 ? [c, <wbr key={'w' + i} />] : [c])));
};

export const RevealImg = ({ src, alt, className = '', ratio = 'aspect-[4/3]', eager = false }: { src: string; alt: string; className?: string; ratio?: string; eager?: boolean }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div className={`relative ${ratio} rounded-3xl overflow-hidden ${className}`} initial={reduce ? false : { clipPath: 'inset(14% 10% 14% 10% round 28px)' }} whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 24px)' }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}>
      <motion.div className="absolute inset-0" initial={reduce ? false : { scale: 1.18 }} whileInView={{ scale: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}>
        <Img src={src} alt={alt} eager={eager} className="absolute inset-0 w-full h-full object-cover" />
      </motion.div>
    </motion.div>
  );
};

export const CountUp = ({ value, className = '' }: { value: string; className?: string }) => {
  const ref = useRef<HTMLSpanElement>(null); const inView = useInView(ref, { once: true, amount: 0.6 }); const reduce = useReducedMotion();
  const m = value.match(/^(\d+)(.*)$/); const target = m ? parseInt(m[1], 10) : 0; const rest = m ? m[2] : value;
  const [v, setV] = useState(reduce || !m ? target : 0);
  useEffect(() => { if (!inView || reduce || !m) return; const c = animate(0, target, { duration: 1.6, ease: [0.16, 1, 0.3, 1], onUpdate: (x) => setV(Math.round(x)) }); return () => c.stop(); }, [inView]);
  return <span ref={ref} dir="auto" className={`tabular-nums ${className}`}>{m ? v : ''}{rest}</span>;
};

/* Halo qui suit la souris : on pose deux variables CSS, le reste est en CSS (.spot) */
export const spot = (e: React.MouseEvent<HTMLElement>) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`); e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`); };
