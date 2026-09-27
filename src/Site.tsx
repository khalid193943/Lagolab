import { useEffect, useState, lazy, Suspense } from 'react';
import { t, tv, L, LANGS, Lang, setLang, langFromPath, stripLang } from './i18n';
import { BrowserRouter, HashRouter, Routes, Route, Link, NavLink, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useSpring, useTransform, useReducedMotion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Menu, X, MessageCircle, Phone, Mail, MapPin } from 'lucide-react';
import { CONTACT } from './data';
import { Logo, Mark, MARK, Wordmark } from './ui';
import { ScrollText } from './fx';
import { ChatBot } from './chat';
import { Newsletter } from './Newsletter';
import Home from './pages/Home';
import { LegalLinks } from './pages/Legal';
import { CITIES } from './cities';
/* Les pages hors accueil sont chargées à la demande : le premier affichage est plus léger */
const Services = lazy(() => import('./pages/Services'));
const Realisations = lazy(() => import('./pages/Realisations'));
const Societe = lazy(() => import('./pages/Societe'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Mentions = lazy(() => import('./pages/Legal').then((m) => ({ default: m.Mentions })));
const Privacy = lazy(() => import('./pages/Legal').then((m) => ({ default: m.Privacy })));
const CityPage = lazy(() => import('./pages/City').then((m) => ({ default: m.CityPage })));
const CitiesHub = lazy(() => import('./pages/City').then((m) => ({ default: m.CitiesHub })));
const GuidesHub = lazy(() => import('./pages/Guides').then((m) => ({ default: m.GuidesHub })));
const ArticlePage = lazy(() => import('./pages/Guides').then((m) => ({ default: m.ArticlePage })));

const LINKS: [string, string][] = [['Services', '/services'], ['Réalisations', '/realisations'], ['Société', '/societe'], ['Contact', '/contact']];

const Nav = () => {
  const [open, setOpen] = useState(false); const [solid, setSolid] = useState(false); const { pathname } = useLocation();
  useEffect(() => { const f = () => setSolid(window.scrollY > 24); f(); window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f); }, []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => { document.documentElement.style.overflow = open ? 'hidden' : ''; return () => { document.documentElement.style.overflow = ''; }; }, [open]);
  return (
    <>
    <header style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }} className={`fixed inset-x-0 top-0 z-[59] transition-colors duration-300 ${solid || open || /\/realisations$/.test(pathname) ? 'bg-nuit/92 backdrop-blur-md border-b border-white/10' : 'bg-transparent'}`}>
      <nav className="wrap h-[76px] flex items-center justify-between gap-6" aria-label={t('Navigation principale')}>
        <Link to={L('/')} aria-label={t('Digilago, accueil')}><Logo draw /></Link>
        <div className="hidden lg:flex items-center h-11 px-1.5 rounded-full bg-white/[0.04] ring-1 ring-white/10 backdrop-blur-md">{LINKS.map(([l, h]) => <NavLink key={h} to={L(h)} className={({ isActive }) => `navlink h-8 px-4 flex items-center rounded-full text-[14.5px] transition-colors ${isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white'}`}>{t(l)}</NavLink>)}</div>
        <div className="flex items-center gap-3">
          <LangSwitch className="hidden md:flex" />
          <Link to={L('/contact')} className="btn btn-safran !h-11 hidden sm:inline-flex">{t('Commencer ma présence en ligne')}</Link>
          <button onClick={() => setOpen(!open)} className="lg:hidden w-11 h-11 flex items-center justify-center rounded-full ring-1 ring-white/15" aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={open}>{open ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </nav>

    </header>
      <AnimatePresence>{open && (
        <motion.div className="lg:hidden fixed inset-0 top-[76px] z-[58] bg-nuit overflow-y-auto" initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }} style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <Mark className="absolute -end-24 bottom-10 w-[420px] h-[480px] opacity-[0.05] pointer-events-none" />
          <nav className="wrap relative pt-6 pb-10 flex flex-col min-h-full" aria-label={t('Menu mobile')}>
            {[['Accueil', '/'] as [string, string], ...LINKS].map(([l, h], k) => (
              <motion.div key={h} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 + k * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                <NavLink to={L(h)} end className={({ isActive }) => `flex items-center justify-between py-4 border-b border-white/10 font-display text-[34px] tracking-[-0.03em] ${isActive ? 'text-safran' : ''}`}>{t(l)}<span className="text-[13px] text-brume tabular-nums">0{k + 1}</span></NavLink>
              </motion.div>
            ))}
            <motion.div className="mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}><LangSwitch className="w-fit" /></motion.div>
            <motion.div className="mt-auto pt-10 grid gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
              <Link to={L('/contact')} className="btn btn-safran">{t('Commencer ma présence en ligne')}</Link>
              <div className="grid grid-cols-2 gap-3"><a href={`tel:${CONTACT.tel}`} className="btn btn-line"><Phone size={16} /> {t('Appeler')}</a><a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-line"><MessageCircle size={16} /> WhatsApp</a></div>
              <p className="mt-2 text-[13px] text-brume text-center">{t('El Jadida · Réponse le jour même')}</p>
            </motion.div>
          </nav>
        </motion.div>
      )}</AnimatePresence>
    </>
  );
};

/* Ouverture : le logo se dessine, une fois par visite */
const Intro = () => {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(() => { if (reduce) return false; try { return !sessionStorage.getItem('dg-intro'); } catch { return true; } });
  useEffect(() => { if (!show) return; try { sessionStorage.setItem('dg-intro', '1'); } catch { /* stockage indisponible */ } const id = window.setTimeout(() => setShow(false), 1900); return () => window.clearTimeout(id); }, [show]);
  return (
    <AnimatePresence>{show && (
      <motion.div className="fixed inset-0 z-[100] bg-nuit flex items-center justify-center" exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }} aria-hidden>
        <div className="flex items-center gap-4"><Mark className="w-16 h-[72px]" draw /><motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9, duration: 0.6 }}><Wordmark className="text-[44px]" delay={1.2} loop={false} /></motion.span></div>
      </motion.div>
    )}</AnimatePresence>
  );
};

/* Barre de lecture : une ligne safran, terminée par le point cyan du logo */
const Progress = () => {
  const { scrollYProgress } = useScroll(); const p = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  const left = useTransform(p, (v) => `${v * 100}%`);
  return (<div className="fixed inset-x-0 top-0 h-[2px] z-[60] pointer-events-none" aria-hidden>
    <motion.div className="absolute inset-y-0 start-0 end-0 bg-safran origin-left" style={{ scaleX: p }} />
    <motion.span className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[7px] h-[7px] rounded-full bg-cyan shadow-[0_0_12px_#2DD4E6]" style={{ left }} />
  </div>);
};

/* Signature : le logo en très grand, qui se dessine quand on arrive en bas */
const Signature = () => {
  const ref = useRef<SVGSVGElement>(null); const inView = useInView(ref, { once: true, amount: 0.4 }); const reduce = useReducedMotion();
  const go = inView || reduce; const k = 3.1; /* échelle du D dans la signature */
  return (
    <div className="wrap pt-10 pb-6">
      <svg style={{ direction: 'ltr' }} ref={ref} viewBox="0 0 1000 214" className="w-full h-auto overflow-visible" role="img" aria-label="Digilago">
        <defs><linearGradient id="sig" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#fff" stopOpacity=".35" /></linearGradient></defs>
        <g transform={`translate(${-8 * k} ${-4 * k + 8}) scale(${k})`}>
          <motion.path d={MARK.d} fill="none" stroke="#F4B53F" strokeWidth={6.5} strokeLinejoin="round" strokeLinecap="square" initial={reduce ? false : { pathLength: 0 }} animate={go ? { pathLength: 1 } : {}} transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }} />
          <motion.path d={MARK.wave} fill="none" stroke="#F4B53F" strokeWidth={3.9} strokeLinecap="round" initial={reduce ? false : { pathLength: 0 }} animate={go ? { pathLength: 1 } : {}} transition={{ duration: 0.8, delay: 0.7, ease: [0.65, 0, 0.35, 1] }} />
          <motion.circle {...MARK.dot} fill="#2DD4E6" initial={reduce ? false : { scale: 0 }} animate={go ? { scale: 1 } : {}} transition={{ type: 'spring', stiffness: 300, damping: 10, delay: 1.3 }} style={{ transformOrigin: `${MARK.dot.cx}px ${MARK.dot.cy}px` }} />
        </g>
        <motion.g initial={reduce ? false : { opacity: 0, y: 40 }} animate={go ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}>
          <text x="186" y="162" textLength="810" lengthAdjust="spacingAndGlyphs" fill="url(#sig)" fontFamily="Sora, 'Segoe UI', sans-serif" fontWeight={500} fontSize="206">dıgılago</text>
          {/* Points des « i » : positions calculées sur les métriques de Sora 500 (voir Wordmark) */}
          {[347.3, 537.4].map((cx, k) => (
            <motion.g key={cx} initial={reduce ? false : { y: -120, opacity: 0 }} animate={go ? { y: 0, opacity: 1 } : {}} transition={{ type: 'spring', stiffness: 380, damping: 11, delay: 1.5 + k * 0.18 }}>
              <motion.circle cx={cx} cy={21.5} r={14} fill="#F4B53F" style={{ filter: 'drop-shadow(0 0 10px rgba(244,181,63,.7))' }}
                animate={reduce || !go ? undefined : { y: [0, -34, 0, 0] }} transition={{ duration: 0.9, times: [0, 0.35, 0.7, 1], repeat: Infinity, repeatDelay: 3.4, delay: 3.2 + k * 0.2, ease: 'easeInOut' }} />
            </motion.g>
          ))}
        </motion.g>
      </svg>
    </div>
  );
};

const Footer = () => (
  <footer className="dark relative overflow-hidden border-t border-white/10">
    <div className="wrap pt-24">
      <div className="grid lg:grid-cols-12 gap-10 items-end">
        <div className="lg:col-span-8"><p className="kicker">{t('Un projet en tête ?')}</p><ScrollText text={t('Parlons-en autour d’un premier aperçu.')} className="mt-4 text-[clamp(1.98rem,4.14vw,3.78rem)] max-w-[18ch]" /></div>
        <div className="lg:col-span-4 flex flex-wrap gap-3 lg:justify-end"><Link to={L('/contact')} className="btn btn-safran">{t('Démarrer un projet')}</Link><a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-line">WhatsApp</a></div>
      </div>
      <div className="mt-16 pt-10 border-t border-white/10 grid gap-10 grid-cols-2 lg:grid-cols-4 text-[15px]">
        <p className="col-span-2 lg:col-span-1 text-brume max-w-[30ch]">{t('Société de services numériques. Nous concevons, faisons trouver et faisons tourner le numérique des entreprises marocaines.')}</p>
        <nav aria-label={t('Pied de page')}><ul className="space-y-2.5">{[['Accueil', '/'], ...LINKS].map(([l, h]) => <li key={h}><Link to={L(h)} className="hover:text-safran transition-colors">{t(l)}</Link></li>)}</ul></nav>
        <div className="col-span-2 sm:col-span-1 space-y-2.5"><a href={`tel:${CONTACT.tel}`} className="flex items-center gap-3 hover:text-safran"><Phone size={15} className="text-cyan" /><span dir="ltr">{CONTACT.phone}</span></a><a href={`mailto:${CONTACT.email}`} className="flex items-center gap-3 hover:text-safran"><Mail size={15} className="text-cyan" />{CONTACT.email}</a><p className="flex items-center gap-3"><MapPin size={15} className="text-cyan" />{t('El Jadida, Maroc')}</p></div>
        <p className="text-brume">{t('Du lundi au samedi')}<br />{t('de 9 h à 19 h')}<br />{t('Réponse le jour même')}</p>
      </div>
    </div>
    <div className="wrap mt-14"><Newsletter /></div>
    <div className="wrap mt-14 pt-8 border-t border-white/10 grid gap-6 lg:grid-cols-12 text-[14px]">
      <p className="lg:col-span-3 font-display text-[15px] text-white">{tv({ fr: 'Création de site web au Maroc', en: 'Website design in Morocco', ar: 'تصميم المواقع في المغرب' })}</p>
      <ul className="lg:col-span-9 flex flex-wrap gap-x-5 gap-y-2 text-brume">
        {CITIES.map((c) => <li key={c.slug}><Link to={L(`/creation-site-web/${c.slug}`)} className="hover:text-white transition-colors">{tv(c.name)}</Link></li>)}
        <li><Link to={L('/guides')} className="text-safran hover:text-white transition-colors">{tv({ fr: 'Guides', en: 'Guides', ar: 'الأدلة' })}</Link></li>
      </ul>
    </div>
    <Signature />
    <div className="wrap pb-24 lg:pb-8 flex flex-wrap justify-between gap-4 text-[13px] text-brume/70"><span className="flex flex-wrap items-center gap-x-5 gap-y-2"><span>© {new Date().getFullYear()} Digilago. {t('Tous droits réservés.')}</span><LegalLinks /></span><span className="flex items-center gap-4"><LangSwitch />{t('Conçu et codé à El Jadida.')}</span></div>
  </footer>
);


/* Sélecteur de langue : même page, autre langue */
const LangSwitch = ({ className = '' }: { className?: string }) => {
  const { pathname, hash } = useLocation(); const cur = langFromPath(pathname); const rest = stripLang(pathname);
  return (
    <div className={`flex items-center h-10 p-1 rounded-full ring-1 ring-white/12 bg-white/[0.04] ${className}`} role="group" aria-label="Langue / Language / اللغة">
      {LANGS.map((x) => <Link key={x.id} to={L(rest, x.id) + hash} lang={x.id} aria-current={cur === x.id ? 'true' : undefined} title={x.label} className={`h-8 px-3 rounded-full flex items-center text-[13px] font-medium transition-colors ${cur === x.id ? 'bg-safran text-nuit' : 'text-white/70 hover:text-white'}`}>{x.short}</Link>)}
    </div>
  );
};

const META: Record<Lang, [string, string]> = {
  fr: ['Digilago — L’infrastructure digitale des entreprises marocaines', 'Digilago conçoit, référence et opère les sites, applications et logiciels des entreprises marocaines. Première version en 72 h : vous ne payez que si elle vous plaît.'],
  en: ['Digilago — The digital infrastructure for Moroccan businesses', 'Digilago designs, ranks and runs websites, apps and software for Moroccan businesses. First version in 72 hours: you only pay if you love it.'],
  ar: ['ديجيلاغو — البنية التحتية الرقمية للشركات المغربية', 'تصمّم ديجيلاغو المواقع والتطبيقات والبرمجيات للشركات المغربية وتحسّن ظهورها وتتولى تشغيلها. النسخة الأولى خلال 72 ساعة، ولا تدفع إلا إذا نالت إعجابك.'],
};

const Shell = () => {
  const { pathname, hash } = useLocation();
  const lng = langFromPath(pathname); setLang(lng); const base = lng === 'fr' ? '' : '/' + lng;
  useEffect(() => {
    const h = document.documentElement; h.lang = lng; h.dir = lng === 'ar' ? 'rtl' : 'ltr';
  }, [lng]);
  useEffect(() => { if (hash) { const el = document.getElementById(hash.slice(1)); if (el) { setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 80); return; } } window.scrollTo(0, 0); }, [pathname, hash]);
  return (
    <>
      <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-[70] btn btn-safran">{t('Aller au contenu')}</a>
      <Intro />
      <Progress />
      <Nav key={'n' + lng} />
      <main id="contenu">
        <motion.div key={pathname + lng} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45 }}>
        <Suspense fallback={<div className="min-h-[100svh]" />}>
        <Routes>
          <Route path={base || '/'} element={<Home />} />
          <Route path={base + '/services'} element={<Services />} />
          <Route path={base + '/realisations'} element={<Realisations />} />
          <Route path={base + '/societe'} element={<Societe />} />
          <Route path={base + '/contact'} element={<Contact />} />
          <Route path={base + '/mentions-legales'} element={<Mentions />} />
          <Route path={base + '/confidentialite'} element={<Privacy />} />
          <Route path={base + '/creation-site-web'} element={<CitiesHub />} />
          <Route path={base + '/creation-site-web/:ville'} element={<CityPage />} />
          <Route path={base + '/guides'} element={<GuidesHub />} />
          <Route path={base + '/guides/:slug'} element={<ArticlePage />} />
          {/* Anciennes adresses du site précédent */}
          <Route path="/web" element={<Navigate to="/" replace />} />
          <Route path="/web/services" element={<Navigate to="/services" replace />} />
          <Route path="/web/technologie" element={<Navigate to="/services#technologie" replace />} />
          <Route path="/web/packs" element={<Navigate to="/services#packs" replace />} />
          <Route path="/web/realisations" element={<Navigate to="/realisations" replace />} />
          <Route path="/web/entreprises" element={<Navigate to="/societe" replace />} />
          <Route path="/web/contact" element={<Navigate to="/contact" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
        </motion.div>
      </main>
      <Footer key={'f' + lng} />
      <ChatBot key={'c' + lng} />
    </>
  );
};

const Router = import.meta.env.VITE_HASH_ROUTER ? HashRouter : BrowserRouter;
const AdminApp = lazy(() => import('./admin/AdminApp'));
/* /admin : espace privé, sans l'habillage du site public */
export default function Site() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<Suspense fallback={<div className="min-h-[100svh] bg-[#081122]" />}><AdminApp /></Suspense>} />
        <Route path="*" element={<Shell />} />
      </Routes>
    </Router>
  );
}
