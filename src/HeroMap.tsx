/**
 * Carte du Maroc animée pour le haut de l'accueil.
 * Le D de Digilago part d'El Jadida, voyage de ville en ville et, à chaque arrivée,
 * son point cyan « allume » une entreprise : une onde, un point safran, une étiquette.
 * Les trajets restent en fins traits : le réseau se dessine au fil du voyage.
 */
import { useEffect, useRef, useState } from 'react';
import { t, tv, L } from './i18n';
import { motion, AnimatePresence, useReducedMotion, animate } from 'motion/react';
import { MAP_W, MAP_H, MOROCCO, CITY } from './morocco';
import { MARK } from './ui';

type Stop = { city: string; label: string };
const HQ = 'El Jadida';
/* Étiquettes illustratives par secteur (sauf nos clients réels d'El Jadida) */
const TOUR: Stop[] = [
  { city: 'Casablanca', label: 'Clinique privée' }, { city: 'Rabat', label: 'Cabinet d’avocats' }, { city: 'Kénitra', label: 'Entreprise de BTP' },
  { city: 'Tanger', label: 'Hôtel' }, { city: 'Tétouan', label: 'Pharmacie' }, { city: 'Fès', label: 'Boutique de caftans' },
  { city: 'Nador', label: 'Garage automobile' }, { city: 'Oujda', label: 'École privée' }, { city: 'Meknès', label: 'Salle de sport' },
  { city: 'Errachidia', label: 'Centre de formation' }, { city: 'Merzouga', label: 'Agence de voyages' }, { city: 'Ouarzazate', label: 'Riad' },
  { city: 'Béni Mellal', label: 'Laboratoire d’analyses' }, { city: 'Marrakech', label: 'Spa et hammam' }, { city: 'Safi', label: 'Restaurant' },
  { city: 'Essaouira', label: 'Cosmétiques à l’argan' }, { city: 'Agadir', label: 'Club de padel' }, { city: 'Tiznit', label: 'Artisan bijoutier' },
  { city: 'Guelmim', label: 'Auto-école' }, { city: 'Laâyoune', label: 'Cabinet dentaire' }, { city: 'Smara', label: 'Agence immobilière' },
  { city: 'Dakhla', label: 'Lodge de kitesurf' },
];
const SC = 0.72; /* taille du D sur la carte */
const place = ([x, y]: [number, number]) => `translate(${x - MARK.dot.cx * SC} ${y - MARK.dot.cy * SC}) scale(${SC})`;
const ctrl = (a: [number, number], b: [number, number]): [number, number] => {
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
  const lift = Math.min(90, len * 0.35); return [mx + (dy / len) * lift, my - (dx / len) * lift];
};
const arcD = (a: [number, number], b: [number, number]) => { const c = ctrl(a, b); return `M${a[0]} ${a[1]} Q${c[0]} ${c[1]} ${b[0]} ${b[1]}`; };
const bez = (a: number[], c: number[], b: number[], t: number): [number, number] => [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]];
const pct = ([x, y]: [number, number]) => ({ left: `${(x / MAP_W) * 100}%`, top: `${(y / MAP_H) * 100}%` });

export const HeroMap = ({ start = 2.2 }: { start?: number }) => {
  const reduce = useReducedMotion();
  const markRef = useRef<SVGGElement>(null);
  const [lit, setLit] = useState<number[]>(reduce ? TOUR.map((_, i) => i) : []);
  const [arcs, setArcs] = useState<[string, string][]>([]);
  const [hop, setHop] = useState<{ from: string; to: string; k: number } | null>(null);
  const [label, setLabel] = useState<number | null>(null);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (reduce) return;
    let alive = true; const stops: { stop: () => void }[] = [];
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      await wait(start * 1000);
      while (alive) {
        let from = HQ; markRef.current?.setAttribute('transform', place(CITY[HQ]));
        for (let i = 0; i < TOUR.length && alive; i++) {
          const to = TOUR[i].city; const a = CITY[from], b = CITY[to], c = ctrl(a, b);
          setHop({ from, to, k: i });
          await new Promise<void>((done) => { const ctl = animate(0, 1, { duration: 1.15, ease: [0.65, 0, 0.35, 1], onUpdate: (t) => markRef.current?.setAttribute('transform', place(bez(a, c, b, t))), onComplete: () => done() }); stops.push(ctl); });
          if (!alive) return;
          setLit((l) => [...l, i]); setArcs((x) => [...x, [from, to]]); setLabel(i); setHop(null);
          await wait(1050); from = to;
        }
        await wait(2600); if (!alive) return;
        setLabel(null); setLit([]); setArcs([]); setCycle((c) => c + 1); await wait(900);
      }
    })();
    return () => { alive = false; stops.forEach((s) => s.stop()); };
  }, [reduce, start]);

  const hq = CITY[HQ];
  return (
    <div className="relative w-full" style={{ aspectRatio: `${MAP_W} / ${MAP_H}` }}>
      <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="absolute inset-0 w-full h-full overflow-visible" role="img" aria-label={t('Carte du Maroc : Digilago accompagne des entreprises de Tanger à Dakhla')}>
        <defs>
          <pattern id="mdots" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="3.5" cy="3.5" r="1.15" fill="#2DD4E6" opacity=".32" /></pattern>
          <clipPath id="mclip"><path d={MOROCCO} /></clipPath>
          <linearGradient id="mscan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2DD4E6" stopOpacity="0" /><stop offset=".5" stopColor="#2DD4E6" stopOpacity=".22" /><stop offset="1" stopColor="#2DD4E6" stopOpacity="0" /></linearGradient>
          <radialGradient id="mhalo"><stop offset="0" stopColor="#F4B53F" stopOpacity=".55" /><stop offset="1" stopColor="#F4B53F" stopOpacity="0" /></radialGradient>
          <filter id="mglow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>

        {/* Le pays : aplat, trame de points, contour lumineux */}
        <path d={MOROCCO} fill="#0F1D3A" fillOpacity=".75" />
        <path d={MOROCCO} fill="url(#mdots)" />
        {/* Balayage lent, façon scanner */}
        {!reduce && <g clipPath="url(#mclip)"><motion.rect x="0" width={MAP_W} height="140" fill="url(#mscan)" initial={{ y: -140 }} animate={{ y: MAP_H }} transition={{ duration: 7, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }} /></g>}
        <motion.path d={MOROCCO} fill="none" stroke="#2DD4E6" strokeWidth="1.3" strokeOpacity=".7" filter="url(#mglow)" initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.4, delay: 0.4, ease: [0.65, 0, 0.35, 1] }} />

        {/* Le réseau : trajets déjà parcourus */}
        <g key={cycle}>{arcs.map(([f, t], i) => <path key={i} d={arcD(CITY[f], CITY[t])} fill="none" stroke="#2DD4E6" strokeOpacity=".5" strokeWidth="1.2" strokeDasharray="3 4" />)}</g>
        {/* Trajet en cours */}
        {hop && <motion.path key={hop.k + '-' + cycle} d={arcD(CITY[hop.from], CITY[hop.to])} fill="none" stroke="#F4B53F" strokeWidth="1.6" strokeLinecap="round" initial={{ pathLength: 0, opacity: 1 }} animate={{ pathLength: 1 }} transition={{ duration: 1.15, ease: [0.65, 0, 0.35, 1] }} />}

        {/* Villes en attente */}
        {TOUR.map((s, i) => !lit.includes(i) && <circle key={s.city} cx={CITY[s.city][0]} cy={CITY[s.city][1]} r="2.2" fill="#9DA9C0" opacity=".55" />)}
        {/* Entreprises allumées */}
        {TOUR.map((s, i) => lit.includes(i) && (
          <g key={s.city + cycle}>
            <motion.circle cx={CITY[s.city][0]} cy={CITY[s.city][1]} r="16" fill="url(#mhalo)" initial={{ opacity: 0 }} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity, delay: (i % 5) * 0.4 }} />
            <motion.circle cx={CITY[s.city][0]} cy={CITY[s.city][1]} fill="none" stroke="#F4B53F" initial={{ r: 3, opacity: 1, strokeWidth: 2 }} animate={{ r: 34, opacity: 0, strokeWidth: 0.5 }} transition={{ duration: 1.3, ease: 'easeOut' }} />
            <motion.circle cx={CITY[s.city][0]} cy={CITY[s.city][1]} fill="#F4B53F" initial={{ r: 0 }} animate={{ r: 3.8 }} transition={{ type: 'spring', stiffness: 400, damping: 12 }} />
          </g>
        ))}

        {/* Le siège : El Jadida */}
        <circle cx={hq[0]} cy={hq[1]} r="22" fill="url(#mhalo)" />
        <circle cx={hq[0]} cy={hq[1]} r="5" fill="#F4B53F" stroke="#0A1428" strokeWidth="2" />
        {!reduce && <motion.circle cx={hq[0]} cy={hq[1]} r="5" fill="none" stroke="#F4B53F" animate={{ r: [5, 26], opacity: [0.9, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }} />}

        {/* Le D voyageur : son point cyan se pose sur la ville */}
        {!reduce && (
          <g ref={markRef} transform={place(hq)} style={{ filter: 'drop-shadow(0 0 6px rgba(244,181,63,.75))' }}>
            <rect x="8" y="4" width="50" height="56" rx="10" fill="#0A1428" fillOpacity=".55" />
            <path d={MARK.d} fill="none" stroke="#F4B53F" strokeWidth="6.5" strokeLinejoin="round" strokeLinecap="square" />
            <path d={MARK.wave} fill="none" stroke="#F4B53F" strokeWidth="3.9" strokeLinecap="round" />
            <circle {...MARK.dot} fill="#2DD4E6" style={{ filter: 'drop-shadow(0 0 5px #2DD4E6)' }} />
          </g>
        )}
      </svg>

      {/* Étiquette du siège */}
      <div className={`absolute pointer-events-none transition-opacity duration-300 ${label !== null && Math.hypot(CITY[TOUR[label].city][0] - hq[0], CITY[TOUR[label].city][1] - hq[1]) < 140 ? 'opacity-0' : 'opacity-100'}`} style={pct(hq)}>
        <span className="absolute right-4 w-max -translate-y-1/2 whitespace-nowrap rounded-full bg-nuit/85 backdrop-blur px-3 py-1 text-[12px] ring-1 ring-safran/40"><span className="text-safran font-medium">{t('Siège')}</span> · {t('El Jadida')}</span>
      </div>
      {/* Étiquette de l'entreprise qui vient de s'allumer */}
      <AnimatePresence>{label !== null && (
        <motion.div key={label + '-' + cycle} className="absolute pointer-events-none z-10" style={pct(CITY[TOUR[label].city])} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
          <div dir="auto" className={`absolute top-3 w-max ${CITY[TOUR[label].city][0] > MAP_W * 0.62 ? 'right-3' : 'left-3'} whitespace-nowrap rounded-xl bg-nuit/90 backdrop-blur ring-1 ring-white/15 px-3.5 py-2 shadow-[0_20px_40px_-20px_rgba(0,0,0,.9)]`}>
            <p className="text-[13px] font-medium">{t(TOUR[label].label)}</p>
            <p className="text-[12px] text-brume flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />{t(TOUR[label].city)} · {t('en ligne')}</p>
          </div>
        </motion.div>
      )}</AnimatePresence>

      {/* Compteur */}
      <div className="absolute right-0 bottom-[6%] rounded-2xl bg-nuit/80 backdrop-blur ring-1 ring-white/10 px-4 py-3">
        <p className="font-display text-[28px] font-medium leading-none tabular-nums text-safran">{lit.length + 1}</p>
        <p className="mt-1 text-[12px] text-brume">{t('entreprises allumées')}<br />{t('de Tanger à Dakhla')}</p>
      </div>
    </div>
  );
};
