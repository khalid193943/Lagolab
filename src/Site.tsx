import { useEffect, useState } from 'react';
import { BrowserRouter, HashRouter, Routes, Route, Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring, useReducedMotion, useMotionValueEvent } from 'motion/react';
import { Plus, X, MessageCircle, Phone } from 'lucide-react';
import Lenis from 'lenis';
import { Home } from './App';
import { Agence, Technologie, Services, Realisations, Packs, Contact, Group, Labs } from './Pages';

/* Trois univers, une seule navigation : les liens et la couleur suivent l'univers où l'on se trouve */
type Brand = 'digilago' | 'web' | 'labs';
const brandOf = (p: string): Brand => (p.startsWith('/web') ? 'web' : p.startsWith('/labs') ? 'labs' : 'digilago');
const LINKS: Record<Brand, [string, string][]> = {
  digilago: [['Présence en ligne', '/web'], ['Digilago Labs', '/labs'], ['Le groupe', '/#groupe']],
  web: [['Services', '/web/services'], ['Technologie', '/web/technologie'], ['Réalisations', '/web/realisations'], ['Packs', '/web/packs'], ['Contact', '/web/contact']],
  labs: [['Projets', '/labs#projets'], ['Méthode', '/labs#methode'], ['Ideas Lab', '/labs#ideas']],
};
const WORD: Record<Brand, React.ReactNode> = { digilago: <>Digilago<span className="w-1.5 h-1.5 rounded-full bg-gold inline-block ml-1 translate-y-[-2px]" /></>, web: <>Digilago<span className="text-gold">.</span></>, labs: <>Digilago<span className="text-[#2D5BFF]"> Labs</span></> };

const Nav = ({ brand }: { brand: Brand }) => {
  const [hidden, setHidden] = useState(false); const [scrolled, setScrolled] = useState(false); const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => { let last = 0; const f = () => { const y = window.scrollY; setScrolled(y > 20); setHidden(y > last && y > 300); last = y; }; window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f); }, []);
  useEffect(() => { setOpen(false); }, [pathname]);
  const cta = brand === 'labs' ? ['Proposer une idée', '/labs#ideas'] : brand === 'web' ? ['Ma première version gratuite', '/web/contact'] : ['Nous contacter', '/#contact'];
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ${hidden && !open ? '-translate-y-[130%]' : ''}`}>
      <div className="wrap pt-4">
        <nav className={`flex items-center justify-between gap-4 rounded-full pl-5 pr-2 h-14 transition-all duration-500 ${scrolled || open ? 'glass shadow-[0_20px_50px_-30px_rgba(0,0,0,0.6)]' : ''}`}>
          <div className="flex items-center gap-3">
            <Link to={brand === 'web' ? '/web' : brand === 'labs' ? '/labs' : '/'} className="font-display text-[22px] leading-none">{WORD[brand]}</Link>
            {brand !== 'digilago' && <Link to="/" className="hidden md:inline text-[11px] uppercase tracking-[0.18em] opacity-50 hover:opacity-100 border-l border-current/20 pl-3">{brand === 'web' ? 'Présence en ligne' : 'Le laboratoire'} · Groupe</Link>}
          </div>
          <div className="hidden lg:flex items-center gap-1">{LINKS[brand].map(([l, h]) => <NavLink key={h} to={h} className={({ isActive }) => `px-3.5 py-2 rounded-full text-[14px] transition-colors ${isActive && !h.includes('#') ? 'bg-current/10' : 'opacity-70 hover:opacity-100'}`}>{l}</NavLink>)}</div>
          <div className="flex items-center gap-2"><Link to={cta[1]} className={`btn !h-10 !px-4 text-[14px] hidden sm:inline-flex ${brand === 'labs' ? 'bg-[#2D5BFF] text-white' : 'btn-gold'}`}>{cta[0]}</Link><button onClick={() => setOpen(!open)} className="lg:hidden w-10 h-10 rounded-full bg-current/10 flex items-center justify-center" aria-label="Menu">{open ? <X size={18} /> : <Plus size={18} />}</button></div>
        </nav>
        <AnimatePresence>{open && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="lg:hidden glass rounded-3xl mt-2 p-3 grid">{[...LINKS[brand], ['Le groupe', '/'], ['Présence en ligne', '/web'], ['Digilago Labs', '/labs']].map(([l, h]) => <Link key={h + l} to={h} className="px-4 py-3 rounded-2xl hover:bg-current/5">{l}</Link>)}</motion.div>}</AnimatePresence>
      </div>
    </header>
  );
};
const Footer = () => (
  <footer className="border-t hairline py-12"><div className="wrap grid md:grid-cols-4 gap-8 text-[14px] opacity-80"><div><span className="font-display text-[22px]">Digilago<span className="text-gold">.</span></span><p className="mt-3 max-w-[30ch]">Groupe digital né à El Jadida. La présence en ligne des entreprises marocaines, et nos propres produits.</p></div>{[['Présence en ligne', [['Accueil', '/web'], ['Services', '/web/services'], ['Réalisations', '/web/realisations'], ['Packs', '/web/packs'], ['Contact', '/web/contact']]], ['Digilago Labs', [['Projets', '/labs'], ['Ideas Lab', '/labs#ideas']]], ['Le groupe', [['Digilago', '/'], ['Technologie', '/web/technologie']]]].map(([t, ls]: any) => <div key={t}><p className="mb-3">{t}</p><ul className="space-y-2 opacity-70">{ls.map(([l, h]: any) => <li key={h}><Link to={h} className="hover:opacity-100">{l}</Link></li>)}</ul></div>)}</div>
    <div className="wrap mt-8 text-[13px] opacity-50">+212 6 49 95 38 13 · contact@digilago.ma · © {new Date().getFullYear()} Digilago SARL</div>
    <p className="wrap mt-10 font-display text-[clamp(4rem,17vw,16rem)] leading-[0.8] text-center bg-gradient-to-b from-current/20 to-transparent bg-clip-text text-transparent select-none" aria-hidden>Digilago</p></footer>
);
const Shell = () => {
  const reduce = useReducedMotion(); const { pathname } = useLocation(); const brand = brandOf(pathname);
  useEffect(() => { if (reduce || window.matchMedia('(pointer: coarse)').matches) return; const l = new Lenis({ lerp: 0.1 }); (window as any).__lenis = l; let id = 0; const r = (t: number) => { l.raf(t); id = requestAnimationFrame(r); }; id = requestAnimationFrame(r); return () => { cancelAnimationFrame(id); l.destroy(); }; }, [reduce]);
  useEffect(() => { (window as any).__lenis ? (window as any).__lenis.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0); }, [pathname]);
  const { scrollYProgress } = useScroll(); const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  // Voilà : sombre puis clair à mi-page. Labs : toujours clair. Digilago : toujours sombre.
  useMotionValueEvent(scrollYProgress, 'change', (v) => { if (brand !== 'web') return; const want = v > 0.5 ? 'light' : 'dark'; if (document.documentElement.dataset.theme !== want) document.documentElement.dataset.theme = want; });
  useEffect(() => { document.documentElement.dataset.brand = brand; document.documentElement.dataset.theme = brand === 'labs' ? 'light' : 'dark'; }, [pathname, brand]);
  return (
    <>
      <motion.div className={`fixed inset-x-0 top-0 h-[2px] z-[60] origin-left ${brand === 'labs' ? 'bg-gradient-to-r from-[#2D5BFF] to-[#7C3AED]' : 'bg-gradient-to-r from-sky via-gold to-coral'}`} style={{ scaleX: bar }} />
      <Nav brand={brand} />
      <AnimatePresence mode="wait"><motion.div key={pathname} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4 }}>
        <Routes>
          <Route path="/" element={<Group />} /><Route path="/labs" element={<Labs />} />
          <Route path="/web" element={<Home />} /><Route path="/web/agence" element={<Agence />} /><Route path="/web/technologie" element={<Technologie />} /><Route path="/web/services" element={<Services />} /><Route path="/web/realisations" element={<Realisations />} /><Route path="/web/packs" element={<Packs />} /><Route path="/web/contact" element={<Contact />} />
          <Route path="*" element={<Group />} />
        </Routes>
      </motion.div></AnimatePresence>
      <Footer />
      <div className="fixed right-4 bottom-4 z-[55] flex flex-col gap-2"><a href="tel:+212649953813" className="sm:hidden w-[52px] h-[52px] rounded-full bg-white text-ink flex items-center justify-center shadow-xl" aria-label="Appeler"><Phone size={20} /></a><a href="https://wa.me/212649953813?text=Bonjour%20Digilago." target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 h-[52px] pl-4 pr-5 rounded-full bg-[#25D366] text-ink shadow-[0_18px_40px_-16px_rgba(37,211,102,0.9)] hover:-translate-y-0.5 transition-transform" aria-label="WhatsApp"><MessageCircle size={20} /><span className="text-[14px] font-medium hidden sm:inline">Réponse le jour même</span></a></div>
    </>
  );
};
const Router = import.meta.env.VITE_HASH_ROUTER ? HashRouter : BrowserRouter;
export default function Site() { return <Router><Shell /></Router>; }
