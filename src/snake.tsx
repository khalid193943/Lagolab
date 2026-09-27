/**
 * SnakeButton : le bouton « Première version gratuite », entouré par la vague du logo devenue serpent.
 * Un corps safran qui ondule et s'effile, une tête cyan lumineuse (le point du logo), qui tourne en boucle
 * autour du bouton. Au survol, le serpent accélère ; hors écran ou onglet caché, il se met en pause.
 *
 * Géométrie : le contour suivi est une « pilule » (deux droites, deux demi-cercles) décalée de `gap` px
 * autour du bouton. Pour chaque position le long du contour, on calcule le point et la normale exactement,
 * puis on décale le corps le long de la normale avec une sinusoïde qui voyage : c'est l'ondulation du serpent.
 */
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from 'motion/react';

const N = 64;                 /* points le long du corps */
/* Le corps est dessiné en couches superposées, toutes partant de la tête : plus la couche est courte, plus elle est épaisse et lumineuse.
   On obtient un serpent qui s'effile et s'estompe vers la queue, sans aucune couture. */
const LAYERS = Array.from({ length: 11 }, (_, j) => {
  const k = j / 10;                                       /* 0 = couche la plus longue (queue), 1 = la plus courte (tête) */
  const mix = (x: number, y: number) => Math.round(x + (y - x) * k);
  return { f: 1 - 0.84 * k, w: 0.14 + 0.86 * Math.pow(k, 0.9), o: 0.22 + 0.78 * Math.pow(k, 0.6), c: `rgb(${mix(233, 255)},${mix(160, 214)},${mix(46, 128)})` };
});
type P = { x: number; y: number; nx: number; ny: number };

/* Point et normale extérieure sur une pilule W×H (rayon H/2), parcourue dans le sens horaire depuis le haut gauche */
const pill = (W: number, H: number) => {
  const r = H / 2, L = Math.max(0, W - 2 * r), arc = Math.PI * r, per = 2 * L + 2 * arc;
  const at = (s0: number): P => {
    let s = ((s0 % per) + per) % per;
    if (s < L) return { x: r + s, y: 0, nx: 0, ny: -1 };
    s -= L;
    if (s < arc) { const a = -Math.PI / 2 + s / r; return { x: W - r + r * Math.cos(a), y: r + r * Math.sin(a), nx: Math.cos(a), ny: Math.sin(a) }; }
    s -= arc;
    if (s < L) return { x: W - r - s, y: H, nx: 0, ny: 1 };
    s -= L;
    const a = Math.PI / 2 + s / r; return { x: r + r * Math.cos(a), y: r + r * Math.sin(a), nx: Math.cos(a), ny: Math.sin(a) };
  };
  return { per, at };
};

export const SnakeButton = ({ to, children, className = '', linkClass = '', gap = 6, amp = 2.4, thick = 5.6, lap = 3.6 }: { to: string; children: React.ReactNode; className?: string; linkClass?: string; gap?: number; amp?: number; thick?: number; lap?: number }) => {
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLSpanElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const layers = useRef<(SVGPathElement | null)[]>([]);
  const head = useRef<SVGGElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const hover = useRef(false);

  /* Taille réelle du bouton */
  useEffect(() => {
    const el = wrap.current?.firstElementChild as HTMLElement | null; if (!el) return;
    const ro = new ResizeObserver(() => setBox({ w: el.offsetWidth, h: el.offsetHeight })); ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* Boucle d'animation */
  useEffect(() => {
    if (reduce || !box.w) return;
    const W = box.w + 2 * gap, H = box.h + 2 * gap; const { per, at } = pill(W, H);
    const bodyLen = Math.min(170, per * 0.34);
    let s = per * 0.62, speed = per / lap, grow = 0, t = 0, last = performance.now(), raf = 0, visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) { last = performance.now(); raf = requestAnimationFrame(tick); } }, { rootMargin: '40px' });
    if (wrap.current) io.observe(wrap.current);
    function tick(now: number) {
      raf = 0;
      if (!visible || document.hidden) return;
      const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;
      const target = (per / lap) * (hover.current ? 2.3 : 1);
      speed += (target - speed) * Math.min(1, dt * 4);          /* accélération douce */
      s = (s + speed * dt) % per;
      grow = Math.min(1, grow + dt / 1.1);                        /* le serpent sort de nulle part au début */
      const len = bodyLen * (1 - Math.pow(1 - grow, 3));
      const phase = t * 9;                                          /* vitesse de l'ondulation */
      const xs: number[] = [], ys: number[] = [];
      for (let i = 0; i < N; i++) {
        const u = i / (N - 1);                                      /* 0 = tête, 1 = queue */
        const d = u * len;
        const p = at(s - d);
        const wave = amp * Math.sin(d / 11 - phase) * (0.35 + 0.65 * Math.sin(Math.PI * Math.min(1, u * 1.15)));
        xs.push(p.x + p.nx * wave - gap); ys.push(p.y + p.ny * wave - gap);
      }
      /* Chemin lissé (milieux + courbes quadratiques) sur les k premiers points */
      const path = (k: number) => {
        let d = `M${xs[0].toFixed(2)} ${ys[0].toFixed(2)}`;
        for (let i = 1; i < k - 1; i++) { const mx = (xs[i] + xs[i + 1]) / 2, my = (ys[i] + ys[i + 1]) / 2; d += `Q${xs[i].toFixed(2)} ${ys[i].toFixed(2)} ${mx.toFixed(2)} ${my.toFixed(2)}`; }
        return d;
      };
      LAYERS.forEach((ly, j) => { const el = layers.current[j]; if (el) { el.setAttribute('d', path(Math.max(3, Math.round(N * ly.f)))); el.setAttribute('opacity', (ly.o * grow).toFixed(3)); } });
      /* La tête : le point cyan du logo, légèrement en avant, qui suit la même vague */
      const hp = at(s + 3.2); const hw = amp * Math.sin(-phase + 0.3) * 0.35;
      head.current?.setAttribute('transform', `translate(${(hp.x + hp.nx * hw - gap).toFixed(2)} ${(hp.y + hp.ny * hw - gap).toFixed(2)})`);
      head.current?.setAttribute('opacity', grow.toFixed(2));
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    const vis = () => { if (!document.hidden && !raf) { last = performance.now(); raf = requestAnimationFrame(tick); } };
    document.addEventListener('visibilitychange', vis);
    return () => { cancelAnimationFrame(raf); io.disconnect(); document.removeEventListener('visibilitychange', vis); };
  }, [box.w, box.h, reduce, gap, amp, thick, lap]);

  const pad = gap + amp + thick + 6;
  return (
    <span ref={wrap} className={`relative ${className || 'inline-flex'}`} onMouseEnter={() => (hover.current = true)} onMouseLeave={() => (hover.current = false)} onFocus={() => (hover.current = true)} onBlur={() => (hover.current = false)}>
      <Link to={to} className={`btn btn-safran w-full relative z-[1] ${linkClass}`}>{children}</Link>
      {!reduce && box.w > 0 && (
        <svg ref={svg} aria-hidden className="absolute pointer-events-none z-[2] overflow-visible" style={{ left: -pad, top: -pad, width: box.w + 2 * pad, height: box.h + 2 * pad, direction: 'ltr' }} viewBox={`${-pad} ${-pad} ${box.w + 2 * pad} ${box.h + 2 * pad}`}>
          <defs>
            <radialGradient id="snk-head"><stop offset="0" stopColor="#E9FDFF" /><stop offset=".45" stopColor="#2DD4E6" /><stop offset="1" stopColor="#12A9BA" /></radialGradient>
          </defs>
          {/* Corps : couches superposées, de la queue fine et pâle à la tête épaisse et dorée */}
          <g style={{ filter: 'drop-shadow(0 0 5px rgba(244,181,63,.55))' }} fill="none" strokeLinecap="round" strokeLinejoin="round">
            {LAYERS.map((ly, j) => <path key={j} ref={(el) => { layers.current[j] = el; }} stroke={ly.c} strokeWidth={thick * ly.w} opacity="0" />)}
          </g>
          {/* Tête */}
          <g ref={head} opacity="0" style={{ filter: 'drop-shadow(0 0 7px rgba(45,212,230,.9))' }}>
            <circle r="5.2" fill="url(#snk-head)" />
            <circle r="1.4" cx="-1.4" cy="-1.5" fill="#fff" opacity=".85" />
          </g>
        </svg>
      )}
    </span>
  );
};
