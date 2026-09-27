import { useEffect, useState } from 'react';
import { BrowserRouter, HashRouter, Routes, Route, Link, NavLink, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X, MessageCircle, Phone, Mail, MapPin } from 'lucide-react';
import { CONTACT } from './data';
import { Logo } from './ui';
import Home from './pages/Home';
import Services from './pages/Services';
import Realisations from './pages/Realisations';
import Societe from './pages/Societe';
import Contact from './pages/Contact';

const LINKS: [string, string][] = [['Services', '/services'], ['Réalisations', '/realisations'], ['Société', '/societe'], ['Contact', '/contact']];

const Nav = () => {
  const [open, setOpen] = useState(false); const [solid, setSolid] = useState(false); const { pathname } = useLocation();
  useEffect(() => { const f = () => setSolid(window.scrollY > 24); f(); window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f); }, []);
  useEffect(() => setOpen(false), [pathname]);
  return (
    <header style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }} className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${solid || open ? 'bg-nuit/92 backdrop-blur-md border-b border-white/10' : 'bg-transparent'}`}>
      <nav className="wrap h-[76px] flex items-center justify-between gap-6" aria-label="Navigation principale">
        <Link to="/" aria-label="Digilago, accueil"><Logo /></Link>
        <div className="hidden lg:flex items-center h-11 px-1.5 rounded-full bg-white/[0.04] ring-1 ring-white/10 backdrop-blur-md">{LINKS.map(([l, h]) => <NavLink key={h} to={h} className={({ isActive }) => `navlink h-8 px-4 flex items-center rounded-full text-[14.5px] transition-colors ${isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white'}`}>{l}</NavLink>)}</div>
        <div className="flex items-center gap-3">
          <a href={`tel:${CONTACT.tel}`} className="hidden xl:inline text-[14px] text-brume hover:text-white">{CONTACT.phone}</a>
          <Link to="/contact" className="btn btn-safran !h-11 hidden sm:inline-flex">Première version gratuite</Link>
          <button onClick={() => setOpen(!open)} className="lg:hidden w-11 h-11 flex items-center justify-center rounded-full ring-1 ring-white/15" aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={open}>{open ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </nav>
      <AnimatePresence>{open && <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="lg:hidden overflow-hidden"><div className="wrap pb-6 grid">{[['Accueil', '/'] as [string, string], ...LINKS].map(([l, h]) => <Link key={h} to={h} className="py-4 border-b border-white/10 font-display text-[22px]">{l}</Link>)}<Link to="/contact" className="btn btn-safran mt-6">Première version gratuite</Link></div></motion.div>}</AnimatePresence>
    </header>
  );
};

const Footer = () => (
  <footer className="dark border-t border-white/10">
    <div className="wrap pt-20 pb-10 grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-4"><Logo /><p className="mt-5 text-brume max-w-[34ch]">Société de services numériques. Nous concevons, faisons trouver et faisons tourner le numérique des entreprises marocaines.</p>
        <div className="mt-6 space-y-2 text-[15px]"><a href={`tel:${CONTACT.tel}`} className="flex items-center gap-3 hover:text-safran"><Phone size={16} className="text-cyan" />{CONTACT.phone}</a><a href={`mailto:${CONTACT.email}`} className="flex items-center gap-3 hover:text-safran"><Mail size={16} className="text-cyan" />{CONTACT.email}</a><p className="flex items-center gap-3"><MapPin size={16} className="text-cyan" />El Jadida, Maroc</p></div></div>
      {[['Services', [['Sites web sur-mesure', '/services'], ['Référencement et IA', '/services'], ['Applications et logiciels', '/services'], ['Hébergement et maintenance', '/services'], ['Packs par métier', '/services#packs']]], ['Réalisations', [['Nos clients', '/realisations'], ['#FaitParDigilago', '/realisations#fait'], ['Études de cas', '/realisations']]], ['Société', [['Qui sommes-nous', '/societe'], ['Digilago Labs', '/societe#labs'], ['Technologie', '/services#technologie'], ['Contact', '/contact']]]].map(([t, ls]: any) => (
        <div key={t} className="lg:col-span-2 lg:col-start-auto"><p className="font-display font-medium">{t}</p><ul className="mt-4 space-y-3 text-[15px] text-brume">{ls.map(([l, h]: any) => <li key={l}><Link to={h} className="hover:text-white">{l}</Link></li>)}</ul></div>
      ))}
      <div className="lg:col-span-2"><p className="font-display font-medium">Horaires</p><p className="mt-4 text-[15px] text-brume">Lundi au samedi<br />9 h – 19 h<br />Réponse WhatsApp le jour même</p></div>
    </div>
    <div className="wrap pb-10 flex flex-wrap justify-between gap-4 text-[13px] text-brume/70 border-t border-white/10 pt-6"><span>© {new Date().getFullYear()} Digilago. Tous droits réservés.</span><span>Conçu et codé à El Jadida.</span></div>
  </footer>
);

const Shell = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => { if (hash) { const el = document.getElementById(hash.slice(1)); if (el) { setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 80); return; } } window.scrollTo(0, 0); }, [pathname, hash]);
  return (
    <>
      <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] btn btn-safran">Aller au contenu</a>
      <Nav />
      <main id="contenu">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/realisations" element={<Realisations />} />
          <Route path="/societe" element={<Societe />} />
          <Route path="/contact" element={<Contact />} />
          {/* Anciennes adresses du site précédent */}
          <Route path="/web" element={<Navigate to="/" replace />} />
          <Route path="/web/services" element={<Navigate to="/services" replace />} />
          <Route path="/web/technologie" element={<Navigate to="/services#technologie" replace />} />
          <Route path="/web/packs" element={<Navigate to="/services#packs" replace />} />
          <Route path="/web/realisations" element={<Navigate to="/realisations" replace />} />
          <Route path="/web/entreprises" element={<Navigate to="/societe" replace />} />
          <Route path="/web/contact" element={<Navigate to="/contact" replace />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="fixed right-4 bottom-4 z-[55] flex items-center gap-2 h-[54px] pl-4 pr-5 rounded-full bg-[#25D366] text-nuit font-semibold shadow-[0_18px_40px_-16px_rgba(37,211,102,0.9)] hover:-translate-y-0.5 transition-transform" style={{ marginBottom: 'env(safe-area-inset-bottom)' }} aria-label="Écrire sur WhatsApp"><MessageCircle size={20} /><span className="text-[14px] hidden sm:inline">WhatsApp</span></a>
    </>
  );
};

const Router = import.meta.env.VITE_HASH_ROUTER ? HashRouter : BrowserRouter;
export default function Site() { return <Router><Shell /></Router>; }
