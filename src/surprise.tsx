/**
 * Deux moments forts de l'accueil :
 * - Simulator : le visiteur tape le nom de son entreprise et se voit sur Google, sur la carte et dans une réponse d'IA.
 * - Sectors   : les offres par métier en panneaux photo qui s'ouvrent au survol.
 */
import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Navigation, Phone, Globe, Sparkles, ArrowRight, Check } from 'lucide-react';
import { PACKS, CONTACT } from './data';
import { Img } from './ui';

const TRADES: [string, string, string][] = [
  ['Restaurant', 'restaurant', 'Réserver une table'], ['Clinique', 'clinique', 'Prendre rendez-vous'], ['Cabinet dentaire', 'dentiste', 'Prendre rendez-vous'],
  ['École privée', 'école privée', 'Réserver une visite'], ['Club de padel', 'padel', 'Réserver un terrain'], ['Hôtel ou riad', 'riad', 'Réserver une chambre'],
  ['Salle de sport', 'salle de sport', 'Essai gratuit'], ['Agence immobilière', 'agence immobilière', 'Voir les biens'], ['Cabinet d’avocats', 'avocat', 'Prendre rendez-vous'],
  ['Garage', 'garage', 'Prendre rendez-vous'], ['Boutique', 'boutique', 'Voir la boutique'],
];
const slug = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '') || 'votre-entreprise';

/* Texte qui s'écrit tout seul, relancé à chaque changement */
const Typed = ({ text }: { text: string }) => {
  const reduce = useReducedMotion(); const [n, setN] = useState(reduce ? text.length : 0);
  useEffect(() => { if (reduce) { setN(text.length); return; } setN(0); let i = 0; const id = window.setInterval(() => { i += 2; setN(i); if (i >= text.length) window.clearInterval(id); }, 18); return () => window.clearInterval(id); }, [text, reduce]);
  return <>{text.slice(0, n)}{n < text.length && <span className="caret">▍</span>}</>;
};

const Stars = () => <span className="inline-flex text-[#F4B53F]">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={13} fill="currentColor" strokeWidth={0} />)}</span>;

export const Simulator = () => {
  const [name, setName] = useState('Dar Tajine'); const [t, setT] = useState(0); const [city, setCity] = useState('El Jadida');
  const [trade, what, cta] = TRADES[t]; const n = name.trim() || 'Votre entreprise'; const c = city.trim() || 'votre ville';
  const domain = `${slug(n)}.ma`;
  const answer = useMemo(() => `Pour un ${what} à ${c}, je vous recommande ${n}. L’établissement est très bien noté (4,9 sur 5, plus de 200 avis), ses horaires et ses tarifs sont clairs, et vous pouvez ${cta.toLowerCase()} directement sur ${domain}.`, [n, c, what, cta, domain]);
  const wa = `https://wa.me/${CONTACT.tel.replace('+', '')}?text=${encodeURIComponent(`Bonjour Digilago, je veux être trouvé comme dans votre démonstration.\nEntreprise : ${n}\nMétier : ${trade}\nVille : ${c}`)}`;
  const field = 'mt-2 w-full h-12 rounded-xl bg-nuit border border-white/12 px-4 text-[16px] text-white placeholder:text-white/30 focus:outline-none focus:border-cyan';
  return (
    <div className="rounded-[28px] bg-nuit-2 ring-1 ring-white/10 p-4 md:p-6">
      <div className="grid md:grid-cols-[1.3fr_1fr_1fr_auto] gap-3 items-end">
        <label className="text-[14px] text-brume">Nom de votre entreprise<input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} className={field} /></label>
        <label className="text-[14px] text-brume">Métier<select value={t} onChange={(e) => setT(+e.target.value)} className={field}>{TRADES.map(([l], i) => <option key={l} value={i}>{l}</option>)}</select></label>
        <label className="text-[14px] text-brume">Ville<input value={city} onChange={(e) => setCity(e.target.value)} maxLength={30} className={field} /></label>
        <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-safran h-12">Je veux ce résultat</a>
      </div>

      <div className="mt-5 grid lg:grid-cols-3 gap-4">
        {/* Recherche Google */}
        <div className="rounded-2xl bg-white text-[#1f1f1f] p-5 min-h-[300px]">
          <div className="flex items-center gap-2 h-11 px-4 rounded-full ring-1 ring-black/10 text-[14px]"><Search size={16} className="text-black/50" /><span className="truncate">{what} {c}</span></div>
          <AnimatePresence mode="wait"><motion.div key={n + t + c} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="mt-5">
            <p className="flex items-center gap-2 text-[13px]"><span className="w-7 h-7 rounded-full bg-nuit text-safran flex items-center justify-center text-[11px] font-semibold">{n.slice(0, 2).toUpperCase()}</span><span><span className="block leading-tight">{n}</span><span className="block text-black/55 leading-tight">https://{domain}</span></span></p>
            <p className="mt-2 text-[19px] leading-snug text-[#1a0dab]">{n} : {trade.toLowerCase()} à {c}</p>
            <p className="mt-1.5 text-[14px] text-black/65 leading-relaxed">{trade} à {c}. Horaires, tarifs, photos et avis. {cta} en ligne, réponse rapide sur WhatsApp.</p>
            <p className="mt-2 flex items-center gap-2 text-[13px] text-black/60"><Stars /> 4,9 · 212 avis</p>
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-[14px] text-[#1a0dab]">{[cta, 'Horaires et accès', 'Nos services', 'Contact'].map((x) => <span key={x}>{x}</span>)}</div>
          </motion.div></AnimatePresence>
        </div>

        {/* Fiche sur la carte */}
        <div className="rounded-2xl bg-white text-[#1f1f1f] overflow-hidden min-h-[300px] flex flex-col">
          <div className="relative h-28 bg-[#E8EEF3] overflow-hidden" aria-hidden>
            <svg viewBox="0 0 300 110" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice"><path d="M0 70 C60 60 90 90 150 75 S240 40 300 55" stroke="#fff" strokeWidth="10" fill="none" /><path d="M110 0 L130 110" stroke="#fff" strokeWidth="7" /><path d="M0 25 L300 35" stroke="#fff" strokeWidth="5" /><rect x="200" y="70" width="70" height="40" fill="#CFE6D2" /><rect x="20" y="0" width="60" height="18" fill="#BFD9F2" /></svg>
            <motion.span key={n} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 14 }} className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-full text-[#EA4335]"><MapPin size={34} fill="currentColor" stroke="#fff" /></motion.span>
          </div>
          <div className="p-5 flex-1 flex flex-col">
            <p className="text-[19px] font-medium">{n}</p>
            <p className="mt-1 flex items-center gap-2 text-[13px] text-black/60">4,9 <Stars /> (212) · {trade}</p>
            <p className="mt-1 text-[13px]"><span className="text-[#188038]">Ouvert</span> <span className="text-black/60">· Ferme à 23:00</span></p>
            <div className="mt-auto pt-4 grid grid-cols-4 gap-2 text-[12px] text-[#1a73e8]">{[[Navigation, 'Itinéraire'], [Phone, 'Appeler'], [Globe, 'Site web'], [Check, cta.split(' ')[0]]].map(([I, l]: any) => <span key={l} className="flex flex-col items-center gap-1.5"><span className="w-9 h-9 rounded-full ring-1 ring-black/10 flex items-center justify-center"><I size={16} /></span>{l}</span>)}</div>
          </div>
        </div>

        {/* Réponse d'un assistant IA */}
        <div className="rounded-2xl bg-[#0E1830] ring-1 ring-white/10 p-5 min-h-[300px] flex flex-col gap-3 text-[14.5px]">
          <p className="self-end max-w-[85%] rounded-2xl rounded-br-md bg-white/10 px-4 py-2.5">Tu me conseilles un {what} à {c} ?</p>
          <div className="flex gap-3"><span className="w-8 h-8 shrink-0 rounded-full bg-cyan/15 text-cyan flex items-center justify-center"><Sparkles size={15} /></span><p className="leading-relaxed text-white/90"><Typed text={answer} /></p></div>
        </div>
      </div>
      <p className="mt-4 text-[13px] text-brume">Démonstration du résultat que nous visons pour vous. Les positions réelles dépendent de votre marché et de votre concurrence.</p>
    </div>
  );
};

/* Offres par métier : panneaux photo qui s'ouvrent */
export const Sectors = ({ images }: { images: Record<string, string> }) => {
  const [a, setA] = useState(0); const nav = useNavigate();
  return (
    <div className="flex flex-col lg:flex-row gap-3 lg:h-[560px]">
      {PACKS.map((p, i) => {
        const on = a === i;
        return (
          <button key={p.id} onMouseEnter={() => setA(i)} onFocus={() => setA(i)} onClick={() => (on ? nav('/services#packs') : setA(i))} aria-expanded={on}
            className={`group relative overflow-hidden rounded-3xl text-left transition-[flex-grow,height] duration-700 ease-[cubic-bezier(.16,1,.3,1)] ${on ? 'lg:grow-[5] h-[440px]' : 'lg:grow h-[88px]'} lg:h-auto lg:basis-0`}>
            <Img src={images[p.id]} alt={p.name} tone={p.color} className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[1.4s] ${on ? 'scale-100' : 'scale-110'}`} />
            <span className={`absolute inset-0 transition-colors duration-700 ${on ? 'bg-gradient-to-t from-nuit via-nuit/40 to-transparent' : 'bg-nuit/70'}`} />
            {/* Titre vertical quand le panneau est fermé (grand écran) */}
            <span className={`hidden lg:block absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-display text-[17px] [writing-mode:vertical-rl] rotate-180 transition-opacity duration-300 ${on ? 'opacity-0' : 'opacity-100'}`}>{p.name.replace('Pack ', '')}</span>
            <span className={`lg:hidden absolute left-6 top-1/2 -translate-y-1/2 font-display text-[19px] transition-opacity ${on ? 'opacity-0' : ''}`}>{p.name.replace('Pack ', '')}</span>
            <span className={`absolute inset-x-0 bottom-0 p-6 md:p-8 transition-all duration-500 ${on ? 'opacity-100 translate-y-0 delay-200' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
              <span className="kicker">{p.for}</span>
              <span className="block mt-2 font-display text-[clamp(1.8rem,2.6vw,2.4rem)] leading-tight">{p.name.replace('Pack ', '')}</span>
              <span className="mt-4 grid sm:grid-cols-2 gap-x-6 gap-y-2 max-w-[40rem]">{p.items.slice(0, 4).map((x) => <span key={x} className="flex gap-2 text-[14.5px] text-white/85"><Check size={16} className="text-cyan shrink-0 mt-0.5" />{x}</span>)}</span>
              <span className="mt-5 inline-flex items-center gap-2 text-safran text-[15px] font-medium">Voir l’offre <ArrowRight size={16} /></span>
            </span>
          </button>
        );
      })}
    </div>
  );
};
