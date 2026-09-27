/**
 * Icônes 3D : visuels générés (verre dépoli, or safran, touches cyan) sur tuile bleu nuit.
 * Si l'image n'est pas encore générée ou ne charge pas, une tuile « verre » dessinée en code prend le relais
 * avec la même lumière, pour que l'ensemble reste homogène.
 * Animation : l'icône « décolle » au défilement (elle grandit, se redresse en 3D et monte), flotte doucement,
 * et s'incline vers la souris au survol.
 */
import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion, useMotionValue } from 'motion/react';

const HF = 'https://d8j0ntlcm91z4.cloudfront.net/user_3Im2HSx2UUwSDvPBnWXfWTAv6du/hf_20260927_022106_';
export const ICON3D: Record<string, string> = {
  concevoir: HF + '0b0c300b-201c-4297-95e9-ff3e039cfe19.png',
  trouver: HF + '176cf0ee-84ad-4c7e-a3e8-74c13225c26a.png',
  operer: HF + '1fa86df7-fbee-4756-a40b-41dc21529a63.png',
  'Site vitrine sur-mesure': HF + '5c0ab21f-9410-4e30-a5cf-49bf7eed370a.png',
  'Boutique en ligne': HF + '7be3cff9-36d6-4f04-be3c-00b164d60984.png',
  'Réservation et rendez-vous': HF + 'd81463e7-2407-4900-a607-8c71af007d2e.png',
  'Application web et espace client': HF + 'd6bd56e7-e6aa-4266-802e-3b61419cbe3e.png',
  'Application mobile': HF + 'a0fcbcf5-d08a-41b9-97ad-01aa7ea86ba5.png',
  'Design UX / UI': HF + '51377a68-9fcf-464f-83ee-20a576a8dc05.png',
  'Identité visuelle et logo': HF + '5889a866-7ba9-449c-abf8-2922f014338d.png',
};

/* Tuile « verre » dessinée en code : fond nuit, reflet, icône dorée lumineuse, point cyan du logo */
const GlassTile = ({ Icon }: { Icon: any }) => (
  <span className="absolute inset-0 flex items-center justify-center" style={{ background: 'radial-gradient(120% 90% at 30% 15%, #22345C 0%, #111D38 45%, #0A1428 100%)' }}>
    <span className="absolute inset-x-[8%] top-[5%] h-[42%] rounded-[40%] bg-gradient-to-b from-white/14 to-transparent" />
    <span className="absolute w-[58%] h-[58%] rounded-full blur-2xl bg-safran/25" />
    <Icon className="relative w-[46%] h-[46%] text-safran" strokeWidth={1.6} style={{ filter: 'drop-shadow(0 6px 10px rgba(244,181,63,.45)) drop-shadow(0 0 2px rgba(255,214,128,.9))' }} />
    <span className="absolute top-[17%] end-[17%] w-[9%] h-[9%] rounded-full bg-cyan shadow-[0_0_12px_#2DD4E6]" />
  </span>
);

export const Icon3D = ({ src, Icon, className = 'w-24 h-24', float = true, tilt = true, lift = true }: { src?: string; Icon: any; className?: string; float?: boolean; tilt?: boolean; lift?: boolean }) => {
  const reduce = useReducedMotion(); const ref = useRef<HTMLSpanElement>(null); const [err, setErr] = useState(false);
  /* Décollage au défilement */
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 98%', 'center 62%'] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 22, mass: 0.6 });
  const scale = useTransform(p, [0, 1], [0.55, 1]); const rotX = useTransform(p, [0, 1], [38, 0]); const rotZ = useTransform(p, [0, 1], [-14, 0]);
  const y = useTransform(p, [0, 1], [46, 0]); const op = useTransform(p, [0, 0.35, 1], [0, 0.9, 1]);
  /* Inclinaison vers la souris */
  const mx = useMotionValue(0), my = useMotionValue(0);
  const tx = useSpring(useTransform(my, [-0.5, 0.5], [14, -14]), { stiffness: 200, damping: 18 });
  const ty = useSpring(useTransform(mx, [-0.5, 0.5], [-16, 16]), { stiffness: 200, damping: 18 });
  const move = (e: React.PointerEvent) => { if (!tilt || e.pointerType !== 'mouse') return; const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width - 0.5); my.set((e.clientY - r.top) / r.height - 0.5); };
  const leave = () => { mx.set(0); my.set(0); };
  const show = src && !err;
  return (
    <motion.span ref={ref} className={`relative inline-block shrink-0 ${className}`} style={reduce || !lift ? undefined : { scale, rotateX: rotX, rotateZ: rotZ, y, opacity: op, transformPerspective: 700 }} onPointerMove={move} onPointerLeave={leave}>
      <span className={`absolute inset-0 ${float && !reduce ? 'icon-float' : ''}`}>
        <motion.span className="absolute inset-0 rounded-[28%] overflow-hidden ring-1 ring-white/12 shadow-[0_24px_50px_-18px_rgba(0,0,0,.75),0_0_0_1px_rgba(244,181,63,.06)]" style={reduce ? undefined : { rotateX: tx, rotateY: ty, transformPerspective: 600 }}>
          {show ? <img src={src} alt="" loading="lazy" decoding="async" onError={() => setErr(true)} className="absolute inset-0 w-full h-full object-cover scale-[1.12]" /> : <GlassTile Icon={Icon} />}
          {/* Reflet qui balaie la tuile */}
          <span className="absolute inset-0 bg-[linear-gradient(115deg,transparent_35%,rgba(255,255,255,.16)_50%,transparent_65%)] icon-sheen" />
        </motion.span>
      </span>
    </motion.span>
  );
};
