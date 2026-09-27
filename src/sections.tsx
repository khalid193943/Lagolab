/** Sections réutilisées d'une page à l'autre. */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Check, Plus, X } from 'lucide-react';
import { LIBRARY, WORK, PILLARS, PROCESS, INSIDE, FAQ, SECTORS, CONTACT, IMG, Concept } from './data';
import { Reveal, Img, Head } from './ui';

/* ---------------- #FaitParDigilago : mur incliné de vraies pages ---------------- */
type Tile = { key: string; img: string; name: string; meta: string; color: string };
const TILES: Tile[] = [
  ...WORK.map((w) => ({ key: 'w' + w.name, img: w.img as string, name: w.name, meta: `${w.sector} · client`, color: w.color })),
  ...LIBRARY.map((c) => ({ key: 'c' + c.id, img: c.img, name: c.name, meta: `${c.sector} · ${c.city}`, color: c.color })),
];
const rows = [TILES.filter((_, i) => i % 3 === 0), TILES.filter((_, i) => i % 3 === 1), TILES.filter((_, i) => i % 3 === 2)];

const TileCard = ({ t, onOpen }: { t: Tile; onOpen: (t: Tile) => void }) => (
  <button onClick={() => onOpen(t)} className="group relative w-[300px] md:w-[360px] aspect-[16/10] shrink-0 rounded-xl overflow-hidden ring-1 ring-white/10 bg-nuit-2 text-left shadow-[0_30px_60px_-30px_rgba(0,0,0,.9)]" aria-label={`Voir ${t.name}`}>
    <Img src={t.img} alt={`Site ${t.name}`} tone={t.color} className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]" />
    <span className="absolute inset-x-0 bottom-0 p-4 pt-10 bg-gradient-to-t from-nuit/95 to-transparent translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 transition-all duration-300">
      <span className="block font-display text-[16px] font-semibold">{t.name}</span><span className="block text-[13px] text-brume">{t.meta}</span>
    </span>
    <span className="absolute top-3 left-3 w-2.5 h-2.5 rounded-full" style={{ background: t.color }} />
  </button>
);

export const FaitPar = ({ compact = false }: { compact?: boolean }) => {
  const [open, setOpen] = useState<Tile | null>(null);
  return (
    <section id="fait" className="dark relative overflow-hidden py-24 lg:py-32">
      <div className="wrap relative z-10">
        <Reveal><h2 className="font-display font-bold text-[clamp(2.6rem,8.4vw,8rem)] leading-[0.9] tracking-[-0.055em] text-safran break-words">#FaitPar<wbr />Digilago</h2></Reveal>
        <Reveal delay={0.1} className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-none"><p className="text-brume text-[17px] max-w-[52ch]">Trente pages, seize métiers, des vraies entreprises. Passez la souris pour découvrir chaque site, cliquez pour l’ouvrir en grand.</p>{!compact && <Link to="/realisations" className="btn btn-line shrink-0">Toutes les réalisations <ArrowUpRight size={16} /></Link>}</Reveal>
      </div>
      <div className="relative mt-10 h-[560px] md:h-[680px] overflow-hidden">
        <div className="absolute -inset-x-[25%] inset-y-0 flex flex-col justify-center gap-5" style={{ transform: 'perspective(1600px) rotateX(20deg) rotateZ(-7deg)' }}>
          {rows.map((r, i) => (
            <div key={i} className="marquee-wrap !overflow-visible [mask-image:none]"><div className="marquee gap-5" style={{ ['--d' as any]: `${70 + i * 14}s`, animationDirection: i === 1 ? 'reverse' : 'normal' }}>
              {[...r, ...r].map((t, k) => <TileCard key={t.key + k} t={t} onOpen={setOpen} />)}
            </div></div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-nuit to-transparent" /><div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-nuit to-transparent" />
      </div>
      <AnimatePresence>{open && (
        <motion.div className="fixed inset-0 z-[80] bg-nuit/90 backdrop-blur-sm flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)} role="dialog" aria-modal="true" aria-label={open.name}>
          <motion.figure initial={{ scale: 0.96, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.98 }} className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <div className="rounded-2xl overflow-hidden ring-1 ring-white/15 bg-nuit-2"><Img src={open.img} alt={`Site ${open.name}`} tone={open.color} className="w-full max-h-[75vh] object-contain bg-nuit-2" /></div>
            <figcaption className="mt-4 flex items-center justify-between gap-4"><span><span className="font-display text-[20px] font-semibold">{open.name}</span><span className="ml-3 text-brume">{open.meta}</span></span><button onClick={() => setOpen(null)} className="w-11 h-11 rounded-full ring-1 ring-white/20 flex items-center justify-center" aria-label="Fermer"><X size={18} /></button></figcaption>
          </motion.figure>
        </motion.div>
      )}</AnimatePresence>
    </section>
  );
};

/* ---------------- Trois pôles de services ---------------- */
export const Pillars = () => (
  <div className="grid lg:grid-cols-3 gap-6">
    {PILLARS.map((p, i) => (
      <Reveal key={p.id} delay={i * 0.08} className="h-full">
        <article className="h-full flex flex-col rounded-3xl bg-white ring-1 ring-encre/8 overflow-hidden">
          <div className="relative aspect-[4/3] overflow-hidden"><Img src={p.img} alt={p.title} className="absolute inset-0 w-full h-full object-cover" /><span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-nuit/85 text-white text-[13px] font-display backdrop-blur">{p.title}</span></div>
          <div className="p-7 flex-1 flex flex-col">
            <h3 className="text-[24px] leading-tight">{p.lead}</h3>
            <ul className="mt-5 flex flex-wrap gap-2">{p.services.map((s) => <li key={s} className="px-3 py-1.5 rounded-full bg-porcelaine text-[14px]">{s}</li>)}</ul>
            <div className="mt-auto pt-7"><p className="text-[14px] font-semibold text-ardoise">Vous recevez</p><ul className="mt-3 space-y-2.5">{p.deliver.map((d) => <li key={d} className="flex gap-3 text-[15px]"><Check size={18} className="text-[#0E8FA0] shrink-0 mt-0.5" />{d}</li>)}</ul></div>
          </div>
        </article>
      </Reveal>
    ))}
  </div>
);

/* ---------------- Ce que contient un projet ---------------- */
export const Inside = () => (
  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 rounded-3xl overflow-hidden ring-1 ring-white/10">
    {INSIDE.map(([t, d], i) => (
      <Reveal key={t} delay={(i % 4) * 0.05} className="bg-nuit p-7 h-full"><span className="block w-9 h-[3px] rounded bg-cyan" /><h3 className="mt-5 text-[20px]">{t}</h3><p className="mt-3 text-[15px] text-brume">{d}</p></Reveal>
    ))}
  </div>
);

/* ---------------- Déroulé d'un projet (vraie séquence) ---------------- */
export const Process = () => (
  <ol className="grid md:grid-cols-2 gap-x-12 gap-y-12">
    {PROCESS.map((p, i) => (
      <Reveal key={p.t} delay={(i % 3) * 0.06}><li className="relative pl-16">
        <span className="absolute left-0 top-0 w-11 h-11 rounded-full bg-nuit text-safran font-display font-semibold flex items-center justify-center">{i + 1}</span>
        <h3 className="text-[22px]">{p.t}</h3><p className="mt-2 text-ardoise">{p.d}</p>
        <p className="mt-4 inline-flex items-center gap-2 text-[14px] font-medium"><span className="w-1.5 h-1.5 rounded-full bg-[#0E8FA0]" />{p.out}</p>
      </li></Reveal>
    ))}
  </ol>
);

/* ---------------- FAQ ---------------- */
export const Faq = () => {
  const [o, setO] = useState(0);
  return (
    <div className="divide-y divide-encre/10 border-y border-encre/10">{FAQ.map((q, i) => (
      <div key={q.q}><button onClick={() => setO(o === i ? -1 : i)} aria-expanded={o === i} className="w-full flex items-center justify-between gap-6 py-6 text-left font-display text-[19px] font-medium">{q.q}<Plus size={20} className={`shrink-0 transition-transform ${o === i ? 'rotate-45' : ''}`} /></button>
        <AnimatePresence initial={false}>{o === i && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden text-ardoise pb-6 max-w-[64ch]">{q.a}</motion.p>}</AnimatePresence></div>
    ))}</div>
  );
};

/* ---------------- Grand appel final + formulaire WhatsApp ---------------- */
export const FinalCTA = () => {
  const [f, setF] = useState({ name: '', city: '', phone: '', sector: 'Restaurants' });
  const send = (e: React.FormEvent) => { e.preventDefault(); window.open(`https://wa.me/${CONTACT.tel.replace('+', '')}?text=${encodeURIComponent(`Bonjour Digilago, je veux ma première version gratuite.\nEntreprise : ${f.name}\nVille : ${f.city}\nMétier : ${f.sector}\nTéléphone : ${f.phone}`)}`, '_blank'); };
  return (
    <section id="demarrer" className="dark relative overflow-hidden py-24 lg:py-32">
      <Img src={IMG.zellige} alt="" className="absolute inset-0 w-full h-full object-cover opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-r from-nuit via-nuit/85 to-nuit/30" />
      <div className="wrap relative grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6"><Reveal><p className="kicker">Sans engagement</p><h2 className="mt-3 text-[clamp(2.4rem,5vw,4.4rem)]">Votre première version, dans 72 heures.</h2><p className="mt-5 text-[18px] text-brume max-w-[46ch]">Donnez-nous le nom de votre entreprise et votre ville. Vous voyez un vrai site avec vos informations, puis vous décidez. 0 dirham avant validation.</p></Reveal></div>
        <Reveal delay={0.1} className="lg:col-span-6">
          <form onSubmit={send} className="rounded-3xl bg-nuit-2/90 backdrop-blur ring-1 ring-white/10 p-6 md:p-8 grid sm:grid-cols-2 gap-4">
            {([['name', 'Entreprise', 'Nom de votre entreprise'], ['city', 'Ville', 'El Jadida, Casablanca…'], ['phone', 'Téléphone', '06 …']] as const).map(([k, l, p]) => (
              <label key={k} className="text-[14px] text-brume">{l}<input required={k !== 'phone'} placeholder={p} value={(f as any)[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} className="mt-2 w-full h-12 rounded-xl bg-nuit border border-white/10 px-4 text-[16px] text-white placeholder:text-white/30 focus:outline-none focus:border-cyan" /></label>
            ))}
            <label className="text-[14px] text-brume">Métier<select value={f.sector} onChange={(e) => setF({ ...f, sector: e.target.value })} className="mt-2 w-full h-12 rounded-xl bg-nuit border border-white/10 px-4 text-[16px] text-white focus:outline-none focus:border-cyan">{SECTORS.map((s) => <option key={s.id}>{s.short}</option>)}<option>Autre</option></select></label>
            <button className="btn btn-safran sm:col-span-2 mt-2">Recevoir ma première version</button>
            <p className="sm:col-span-2 text-[13px] text-brume">Le message s’ouvre dans WhatsApp. Réponse le jour même, du lundi au samedi.</p>
          </form>
        </Reveal>
      </div>
    </section>
  );
};

/* ---------------- Vignette de concept pour la page réalisations ---------------- */
export const ConceptCard = ({ c, onOpen }: { c: Concept; onOpen: () => void }) => (
  <button onClick={onOpen} className="group text-left w-full" aria-label={`Voir le site ${c.name}`}>
    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden ring-1 ring-white/10 bg-nuit-2"><Img src={c.img} alt={`Site ${c.name}`} tone={c.color} className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]" /></div>
    <div className="mt-4 flex items-start justify-between gap-4"><div><p className="font-display text-[18px] font-semibold">{c.name}</p><p className="text-[14px] text-brume">{c.sector} · {c.city}</p></div><span className="mt-1.5 w-3 h-3 rounded-full shrink-0" style={{ background: c.color }} /></div>
  </button>
);
