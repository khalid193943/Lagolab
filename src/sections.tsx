/** Sections réutilisées d'une page à l'autre. */
import { useState } from 'react';
import { t, tv, L } from './i18n';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Check, Plus, X } from 'lucide-react';
import { LIBRARY, WORK, PILLARS, PROCESS, INSIDE, FAQ, SECTORS, CONTACT, IMG, Concept } from './data';
import { Reveal, Img, Head, Swipe, MARK } from './ui';
import { ScrollText, spot } from './fx';
import { Icon3D } from './icons';
import { Gem, Code2, Zap, Smartphone, ScanEye, Languages, KeyRound, SlidersHorizontal } from 'lucide-react';
const INSIDE_ICONS = [Gem, Code2, Zap, Smartphone, ScanEye, Languages, KeyRound, SlidersHorizontal];

/* ---------------- #FaitParDigilago : mur incliné de vraies pages ---------------- */
type Tile = { key: string; img: string; name: string; meta: string; color: string };
const tiles = (): Tile[] => [
  ...WORK.map((w) => ({ key: 'w' + w.name, img: w.img as string, name: w.name, meta: `${t(w.sector)} · ${t('client')}`, color: w.color })),
  ...LIBRARY.map((c) => ({ key: 'c' + c.id, img: c.img, name: c.name, meta: `${t(c.sector)} · ${t(c.city)}`, color: c.color })),
];
const rowsOf = () => { const T = tiles(); return [T.filter((_, i) => i % 3 === 0), T.filter((_, i) => i % 3 === 1), T.filter((_, i) => i % 3 === 2)]; };

const TileCard = ({ t, onOpen }: { t: Tile; onOpen: (t: Tile) => void }) => (
  <button onClick={() => onOpen(t)} className="group relative w-[230px] md:w-[360px] aspect-[16/10] shrink-0 rounded-xl overflow-hidden ring-1 ring-white/10 bg-nuit-2 text-start shadow-[0_30px_60px_-30px_rgba(0,0,0,.9)]" aria-label={`Voir ${t.name}`}>
    <Img src={t.img} alt={`Site ${t.name}`} tone={t.color} className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]" />
    <span data-t className="absolute inset-x-0 bottom-0 p-4 pt-10 bg-gradient-to-t from-nuit/95 to-transparent translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 transition-all duration-300">
      <span className="block font-display text-[16px] font-semibold">{t.name}</span><span className="block text-[13px] text-brume">{t.meta}</span>
    </span>
    <span className="absolute top-3 start-3 w-2.5 h-2.5 rounded-full" style={{ background: t.color }} />
  </button>
);

export const FaitPar = ({ compact = false }: { compact?: boolean }) => {
  const [open, setOpen] = useState<Tile | null>(null); const rows = rowsOf();
  return (
    <section id="fait" className="dark relative overflow-hidden py-20 md:py-24 lg:py-32">
      <div className="wrap relative z-10">
        <ScrollText by="char" text="#FaitParDigilago" className="font-display !font-semibold text-[clamp(2.6rem,8.4vw,8rem)] leading-[0.9] !tracking-[-0.055em] text-safran break-all sm:break-normal" />
        <Reveal delay={0.1} className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-none"><p className="text-brume text-[17px] max-w-[52ch]">{t('Des établissements réels et des concepts pour seize métiers. Survolez pour découvrir chaque site, cliquez pour l’ouvrir en grand.')}</p>{!compact && <Link to={L('/realisations')} className="btn btn-line shrink-0">{t('Toutes les réalisations')} <ArrowUpRight size={16} /></Link>}</Reveal>
      </div>
      <div className="relative mt-10 h-[430px] md:h-[680px] overflow-hidden">
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
            <figcaption className="mt-4 flex items-center justify-between gap-4"><span><span className="font-display text-[20px] font-semibold">{open.name}</span><span className="ms-3 text-brume">{t(open.meta)}</span></span><button onClick={() => setOpen(null)} className="w-11 h-11 rounded-full ring-1 ring-white/20 flex items-center justify-center" aria-label={t('Fermer')}><X size={18} /></button></figcaption>
          </motion.figure>
        </motion.div>
      )}</AnimatePresence>
    </section>
  );
};

/* ---------------- Trois pôles de services ---------------- */
export const Pillars = () => (
  <Swipe from="lg" cols="lg:grid-cols-3" item="w-[86%] sm:w-[58%]">
    {PILLARS.map((p, i) => (
      <Reveal key={p.id} delay={i * 0.08} className="h-full">
        <article className="group h-full flex flex-col rounded-3xl bg-white ring-1 ring-encre/8 overflow-hidden transition-[transform,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgba(10,20,40,.35)]">
          <div className="relative aspect-[4/3] overflow-hidden"><Img src={p.img} alt={t(p.title)} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.05]" /><span className="absolute top-4 start-4 px-3 py-1.5 rounded-full bg-nuit/85 text-white text-[13px] font-display backdrop-blur">{t(p.title)}</span></div>
          <div className="p-7 flex-1 flex flex-col">
            <h3 className="text-[24px] leading-tight">{t(p.lead)}</h3>
            <ul className="mt-5 flex flex-wrap gap-2">{p.services.map((s) => <li key={s} className="px-3 py-1.5 rounded-full bg-porcelaine text-[14px]">{t(s)}</li>)}</ul>
            <div className="mt-auto pt-7"><p className="text-[14px] font-medium text-ardoise">{t('Livrables')}</p><ul className="mt-3 space-y-2.5">{p.deliver.map((d) => <li key={d} className="flex gap-3 text-[15px]"><Check size={18} className="text-[#0E8FA0] shrink-0 mt-0.5" />{t(d)}</li>)}</ul></div>
          </div>
        </article>
      </Reveal>
    ))}
  </Swipe>
);

/* ---------------- Ce que contient un projet ---------------- */
export const Inside = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 rounded-3xl overflow-hidden ring-1 ring-white/10">
    {INSIDE.map(([tt, d], i) => (
      <Reveal key={tt} delay={(i % 4) * 0.05} className="h-full bg-nuit"><div onMouseMove={spot} className="spot h-full p-5 sm:p-8"><Icon3D Icon={INSIDE_ICONS[i]} className="w-14 h-14 sm:w-[72px] sm:h-[72px]" /><h3 className="mt-5 sm:mt-6 text-[16.5px] sm:text-[20px] leading-snug">{t(tt)}</h3><p className="mt-2 sm:mt-3 text-[13.5px] sm:text-[15px] leading-relaxed text-brume">{t(d)}</p></div></Reveal>
    ))}
  </div>
);

/* ---------------- Déroulé d'un projet (vraie séquence) ---------------- */
export const Process = () => (
  <ol className="grid md:grid-cols-2 gap-x-12 gap-y-12">
    {PROCESS.map((p, i) => (
      <Reveal key={p.t} delay={(i % 3) * 0.06}><li className="relative ps-16">
        {i < PROCESS.length - 1 && <motion.span aria-hidden className="md:hidden absolute start-[21.5px] top-12 -bottom-12 w-px bg-gradient-to-b from-[#0E8FA0] to-encre/10 origin-top" initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true, amount: 0.8 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} />}
        <span className="absolute start-0 top-0 w-11 h-11 rounded-full bg-nuit text-safran font-display font-semibold flex items-center justify-center ring-4 ring-porcelaine">{i + 1}</span>
        <h3 className="text-[22px]">{t(p.t)}</h3><p className="mt-2 text-ardoise">{t(p.d)}</p>
        <p className="mt-4 inline-flex items-center gap-2 text-[14px] font-medium"><span className="w-1.5 h-1.5 rounded-full bg-[#0E8FA0]" />{t(p.out)}</p>
      </li></Reveal>
    ))}
  </ol>
);

/* ---------------- FAQ ---------------- */
export const Faq = () => {
  const [o, setO] = useState(0);
  return (
    <div className="divide-y divide-encre/10 border-y border-encre/10">{FAQ.map((q, i) => (
      <div key={q.q}><button onClick={() => setO(o === i ? -1 : i)} aria-expanded={o === i} className="w-full flex items-center justify-between gap-6 py-6 text-start font-display text-[19px] font-medium">{t(q.q)}<Plus size={20} className={`shrink-0 transition-transform ${o === i ? 'rotate-45' : ''}`} /></button>
        <AnimatePresence initial={false}>{o === i && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden text-ardoise pb-6 max-w-[64ch]">{t(q.a)}</motion.p>}</AnimatePresence></div>
    ))}</div>
  );
};

/* ---------------- Grand appel final + formulaire WhatsApp ---------------- */
export const FinalCTA = () => {
  const [f, setF] = useState({ name: '', city: '', phone: '', sector: 'Restaurants' });
  const send = (e: React.FormEvent) => { e.preventDefault(); window.open(`https://wa.me/${CONTACT.tel.replace('+', '')}?text=${encodeURIComponent(`Bonjour Digilago, je veux ma première version gratuite.\nEntreprise : ${f.name}\nVille : ${f.city}\nMétier : ${f.sector}\nTéléphone : ${f.phone}`)}`, '_blank'); };
  return (
    <section id="demarrer" className="dark relative overflow-hidden py-20 md:py-24 lg:py-32">
      <Img src={IMG.zellige} alt="" className="absolute inset-0 w-full h-full object-cover opacity-70" />
      <div className="absolute inset-0 rtl-flip bg-gradient-to-r from-nuit via-nuit/85 to-nuit/30" />
      <div className="wrap relative grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6"><Reveal><p className="kicker">{t('Sans engagement')}</p></Reveal><ScrollText text={t('Votre première version, en 72 heures.')} className="mt-4 text-[clamp(2.4rem,5vw,4.4rem)]" /><Reveal delay={0.1}><p className="mt-6 text-[18px] text-brume max-w-[46ch]">{t('Indiquez le nom de votre entreprise et votre ville. Vous découvrez un site réel à votre image, puis vous décidez. Aucun paiement avant validation.')}</p></Reveal></div>
        <Reveal delay={0.1} className="lg:col-span-6">
          <form onSubmit={send} className="rounded-3xl bg-nuit-2/90 backdrop-blur ring-1 ring-white/10 p-6 md:p-8 grid sm:grid-cols-2 gap-4">
            {([['name', 'Entreprise', 'Nom de votre entreprise'], ['city', 'Ville', 'El Jadida, Casablanca…'], ['phone', 'Téléphone', '06 …']] as const).map(([k, l, p]) => (
              <label key={k} className="text-[14px] text-brume">{t(l)}<input required={k !== 'phone'} placeholder={t(p)} value={(f as any)[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} className="mt-2 w-full h-12 rounded-xl bg-nuit border border-white/10 px-4 text-[16px] text-white placeholder:text-white/30 focus:outline-none focus:border-cyan" /></label>
            ))}
            <label className="text-[14px] text-brume">{t('Métier')}<select value={f.sector} onChange={(e) => setF({ ...f, sector: e.target.value })} className="mt-2 w-full h-12 rounded-xl bg-nuit border border-white/10 px-4 text-[16px] text-white focus:outline-none focus:border-cyan">{SECTORS.map((s) => <option key={s.id} value={s.short}>{t(s.short)}</option>)}<option>{t('Autre')}</option></select></label>
            {/* Bouton en forme de D : bord gauche droit, bord droit arrondi, et la vague du logo dans la courbe */}
            <button className="btn btn-safran btn-d sm:col-span-2 mt-3" style={{ direction: 'ltr' }}>
              <span dir="auto" className="flex-1 text-start">{t('Recevoir ma première version')}</span>
              <svg viewBox="17 22 31 17" className="d-wave w-11 h-6 shrink-0" aria-hidden>
                <path d={MARK.wave} pathLength={1} fill="none" stroke="#0A1428" strokeWidth="3.6" strokeLinecap="round" />
                <circle cx={MARK.dot.cx} cy={MARK.dot.cy} r={MARK.dot.r} fill="#0E8FA0" />
              </svg>
            </button>
            <p className="sm:col-span-2 text-[13px] text-brume">{t('Votre demande s’ouvre dans WhatsApp. Réponse le jour même, du lundi au samedi.')}</p>
          </form>
        </Reveal>
      </div>
    </section>
  );
};

/* ---------------- Vignette de concept pour la page réalisations ---------------- */
export const ConceptCard = ({ c, onOpen }: { c: Concept; onOpen: () => void }) => (
  <button onClick={onOpen} className="group text-start w-full" aria-label={`Voir le site ${c.name}`}>
    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden ring-1 ring-white/10 bg-nuit-2"><Img src={c.img} alt={`Site ${c.name}`} tone={c.color} className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]" /></div>
    <div className="mt-3 sm:mt-4 flex items-start justify-between gap-2 sm:gap-4"><div className="min-w-0"><p className="font-display text-[15px] sm:text-[18px] font-medium truncate">{c.name}</p><p className="text-[12.5px] sm:text-[14px] text-brume truncate">{t(c.sector)} · {t(c.city)}</p></div><span className="mt-1.5 w-3 h-3 rounded-full shrink-0" style={{ background: c.color }} /></div>
  </button>
);
