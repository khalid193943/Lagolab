/**
 * Icônes : de simples pictogrammes au trait, en grand, sans cadre ni effet 3D.
 * Couleur selon le fond (bleu nuit sur clair, safran sur sombre, voir .ico dans index.css).
 * Animation : l'icône monte et grandit doucement au défilement, puis flotte légèrement.
 */
import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'motion/react';

export const Icon3D = ({ Icon, className = 'w-14 h-14', float = true, lift = true, stroke = 1.3 }: { src?: string; Icon: any; className?: string; float?: boolean; tilt?: boolean; lift?: boolean; stroke?: number }) => {
  const reduce = useReducedMotion(); const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 98%', 'center 65%'] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 22, mass: 0.6 });
  const scale = useTransform(p, [0, 1], [0.7, 1]); const y = useTransform(p, [0, 1], [28, 0]); const op = useTransform(p, [0, 0.4, 1], [0, 0.85, 1]);
  return (
    <motion.span ref={ref} aria-hidden className={`ico relative inline-flex shrink-0 ${className}`} style={reduce || !lift ? undefined : { scale, y, opacity: op }}>
      <span className={`absolute inset-0 ${float && !reduce ? 'icon-float' : ''}`}><Icon className="w-full h-full" strokeWidth={stroke} /></span>
    </motion.span>
  );
};
