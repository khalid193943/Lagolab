/**
 * Admin Digilago : l'espace privé pour piloter les demandes, clients, projets, factures,
 * WhatsApp (deux numéros), e-mails, newsletter, automatisations et analytics.
 * Accessible sur /admin (non indexé). Démo : données locales. Production : Supabase (voir ADMIN.md).
 */
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Routes, Route, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Wand2, LayoutDashboard, Inbox, Users, FolderKanban, FileText, Wallet, BarChart3, MessageCircle, Mail, Workflow, Sparkles, Settings as Cog, Search, Bell, LogOut, Plus, Zap, Menu, X, ArrowRight } from 'lucide-react';
import { useDB, db, MODE, auth, load, uid, now, runAutomations, scoreLead, rel, Lead } from './store';
import { Badge, Btn, Input, cx } from './kit';
import { Mark, Wordmark } from '../ui';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Leads = lazy(() => import('./pages/Leads'));
const Clients = lazy(() => import('./pages/Clients'));
const Projects = lazy(() => import('./pages/Projects'));
const Invoices = lazy(() => import('./pages/Invoices'));
const Finance = lazy(() => import('./pages/Finance'));
const Analytics = lazy(() => import('./pages/Analytics'));
const WhatsApp = lazy(() => import('./pages/WhatsApp'));
const Emails = lazy(() => import('./pages/Emails'));
const Automations = lazy(() => import('./pages/Automations'));
const Assistant = lazy(() => import('./pages/Assistant'));
const SettingsPage = lazy(() => import('./pages/Settings'));
const QuoteBuilder = lazy(() => import('./pages/QuoteBuilder'));

export const NAV: { to: string; label: string; I: any; group: string; badge?: (s: ReturnType<typeof useDB>) => number }[] = [
  { to: '/admin', label: 'Tableau de bord', I: LayoutDashboard, group: 'Pilotage' },
  { to: '/admin/assistant', label: 'Assistant IA', I: Sparkles, group: 'Pilotage' },
  { to: '/admin/demandes', label: 'Demandes', I: Inbox, group: 'Commercial', badge: (s) => s.leads.filter((l) => l.status === 'nouveau').length },
  { to: '/admin/devis-intelligent', label: 'Devis intelligent', I: Wand2, group: 'Commercial' },
  { to: '/admin/clients', label: 'Clients', I: Users, group: 'Commercial' },
  { to: '/admin/projets', label: 'Projets', I: FolderKanban, group: 'Production' },
  { to: '/admin/factures', label: 'Factures & devis', I: FileText, group: 'Finances' },
  { to: '/admin/finances', label: 'Trésorerie', I: Wallet, group: 'Finances' },
  { to: '/admin/analytics', label: 'Analytics', I: BarChart3, group: 'Finances' },
  { to: '/admin/whatsapp', label: 'WhatsApp', I: MessageCircle, group: 'Communication', badge: (s) => s.conversations.reduce((n, c) => n + c.unread, 0) },
  { to: '/admin/emails', label: 'E-mails & newsletter', I: Mail, group: 'Communication' },
  { to: '/admin/automatisations', label: 'Automatisations', I: Workflow, group: 'Communication' },
  { to: '/admin/parametres', label: 'Paramètres', I: Cog, group: 'Système' },
];

/* ---------- Connexion ---------- */
const Login = ({ onIn }: { onIn: () => void }) => {
  const [email, setEmail] = useState(''); const [pw, setPw] = useState(''); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const go = async (e: React.FormEvent) => { e.preventDefault(); if (MODE === 'demo') return onIn(); setBusy(true); setErr(''); try { await auth.signIn(email, pw); onIn(); } catch (x: any) { setErr(x.message); } setBusy(false); };
  return (
    <div className="min-h-[100svh] bg-nuit flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 dotgrid opacity-50 [mask-image:radial-gradient(60%_60%_at_50%_40%,#000,transparent)]" />
      <motion.form onSubmit={go} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-[400px] rounded-3xl bg-white/[0.04] ring-1 ring-white/10 p-8 backdrop-blur">
        <div className="flex items-center gap-2.5"><Mark className="w-8 h-9" draw /><Wordmark className="text-[22px]" loop={false} /><Badge tone="info">Admin</Badge></div>
        <h1 className="mt-8 font-display text-[26px] tracking-[-0.03em]">Bon retour 👋</h1>
        <p className="mt-1 text-[14px] text-brume">{MODE === 'demo' ? 'Mode démo : les données sont stockées dans ce navigateur.' : 'Connectez-vous pour piloter Digilago.'}</p>
        {MODE === 'live' && <div className="mt-6 space-y-3"><Input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" /><Input type="password" placeholder="Mot de passe" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" /></div>}
        {err && <p className="mt-3 text-[13px] text-[#FF8A7A]">{err}</p>}
        <button disabled={busy} className="mt-6 w-full h-11 btn btn-safran">{MODE === 'demo' ? 'Entrer dans la démo' : busy ? 'Connexion…' : 'Se connecter'} <ArrowRight size={16} /></button>
        <Link to="/" className="mt-5 block text-center text-[13px] text-brume hover:text-white">← Retour au site</Link>
      </motion.form>
    </div>
  );
};

/* ---------- Palette de commandes (Ctrl/Cmd + K) ---------- */
const Palette = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const s = useDB(); const nav = useNavigate(); const [q, setQ] = useState(''); const [i, setI] = useState(0); const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (open) { setQ(''); setI(0); setTimeout(() => ref.current?.focus(), 30); } }, [open]);
  const res = useMemo(() => {
    const k = q.toLowerCase().trim(); const out: { label: string; hint: string; to: string }[] = [];
    NAV.forEach((n) => (!k || n.label.toLowerCase().includes(k)) && out.push({ label: n.label, hint: 'Aller à', to: n.to }));
    if (k) {
      s.leads.filter((l) => [l.name, l.company, l.city, l.phone, l.email].join(' ').toLowerCase().includes(k)).slice(0, 6).forEach((l) => out.push({ label: `${l.company || l.name}`, hint: `Demande · ${l.city || ''}`, to: `/admin/demandes?id=${l.id}` }));
      s.clients.filter((c) => [c.name, c.company, c.city, c.email].join(' ').toLowerCase().includes(k)).slice(0, 5).forEach((c) => out.push({ label: c.company || c.name, hint: 'Client', to: `/admin/clients?id=${c.id}` }));
      s.projects.filter((p) => p.name.toLowerCase().includes(k)).slice(0, 5).forEach((p) => out.push({ label: p.name, hint: 'Projet', to: `/admin/projets?id=${p.id}` }));
      s.invoices.filter((f) => f.number.toLowerCase().includes(k)).slice(0, 5).forEach((f) => out.push({ label: f.number, hint: f.kind === 'devis' ? 'Devis' : 'Facture', to: `/admin/factures?id=${f.id}` }));
      out.push({ label: `Demander à l’assistant : « ${q} »`, hint: 'IA', to: `/admin/assistant?q=${encodeURIComponent(q)}` });
    }
    return out.slice(0, 12);
  }, [q, s]);
  const go = (to: string) => { onClose(); nav(to); };
  return (
    <AnimatePresence>{open && (
      <motion.div className="fixed inset-0 z-[95] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[12vh] px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
        <motion.div onMouseDown={(e) => e.stopPropagation()} initial={{ y: -10, scale: 0.98 }} animate={{ y: 0, scale: 1 }} className="w-full max-w-[620px] rounded-2xl bg-[#0D1830] ring-1 ring-white/12 overflow-hidden shadow-2xl">
          <div className="flex items-center gap-3 px-4 border-b border-white/[0.07]"><Search size={17} className="text-white/40" /><input ref={ref} value={q} onChange={(e) => { setQ(e.target.value); setI(0); }} onKeyDown={(e) => { if (e.key === 'ArrowDown') setI((x) => Math.min(res.length - 1, x + 1)); if (e.key === 'ArrowUp') setI((x) => Math.max(0, x - 1)); if (e.key === 'Enter' && res[i]) go(res[i].to); if (e.key === 'Escape') onClose(); }} placeholder="Rechercher une demande, un client, une facture… ou poser une question" className="flex-1 h-14 bg-transparent text-[15px] focus:outline-none placeholder:text-white/35" /><kbd className="text-[11px] text-white/40 ring-1 ring-white/15 rounded px-1.5 py-0.5">Esc</kbd></div>
          <ul className="max-h-[50vh] overflow-y-auto p-2">{res.map((r, k) => (
            <li key={k}><button onMouseEnter={() => setI(k)} onClick={() => go(r.to)} className={cx('w-full flex items-center justify-between gap-4 px-3 h-11 rounded-lg text-start text-[14px]', k === i ? 'bg-white/[0.07]' : '')}><span className="truncate">{r.label}</span><span className="text-[12px] text-white/40 shrink-0">{r.hint}</span></button></li>
          ))}</ul>
        </motion.div>
      </motion.div>
    )}</AnimatePresence>
  );
};

/* ---------- Démo : simuler une demande entrante (déclenche les automatisations) ---------- */
const NAMES = [['Salim Berrada', 'Pâtisserie Salim', 'Casablanca', 'Restaurants'], ['Dr Hind Kettani', 'Cabinet Dentaire Kettani', 'Rabat', 'Cliniques'], ['Adil Fassi', 'Fassi Immobilier', 'Tanger', 'Immobilier'], ['Meryem', 'Maison Meryem Caftans', 'Fès', 'E-commerce'], ['Hamza', 'Surf House Taghazout', 'Agadir', 'Hôtels']];
export const simulateLead = () => {
  const [name, company, city, sector] = NAMES[Math.floor(Math.random() * NAMES.length)];
  const lead: Lead = { id: uid(), created_at: now(), name, company, city, sector, source: ['formulaire', 'chat', 'simulateur', 'formulaire rapide'][Math.floor(Math.random() * 4)], status: 'nouveau', notes: [], phone: '+212 6 ' + Math.floor(10000000 + Math.random() * 89999999).toString().replace(/(\d{2})(?=\d)/g, '$1 '), email: `contact@${company.toLowerCase().normalize('NFD').replace(/[^a-z]/g, '')}.ma`, message: 'Bonjour, je voudrais un site professionnel avec réservation en ligne et une bonne présence sur Google. Vous pouvez me rappeler ?', value: 15000 + Math.round(Math.random() * 30) * 1000 };
  db.insert('leads', lead); db.log('lead', `Nouvelle demande : ${company} (${city}) · score ${scoreLead(lead)}`, '/admin/demandes');
  return runAutomations('lead.created', { lead });
};

/* ---------- Mise en page ---------- */
export default function AdminApp() {
  const [inside, setInside] = useState(() => MODE === 'demo' ? sessionStorage.getItem('dg-admin-demo') === '1' : auth.restore());
  const [pal, setPal] = useState(false); const [bell, setBell] = useState(false); const [side, setSide] = useState(false); const [toast, setToast] = useState<string[]>([]);
  const s = useDB(); const loc = useLocation(); const nav = useNavigate();
  useEffect(() => { document.title = 'Admin · Digilago'; const m = document.createElement('meta'); m.name = 'robots'; m.content = 'noindex, nofollow'; document.head.appendChild(m); document.documentElement.dir = 'ltr'; document.documentElement.lang = 'fr'; return () => m.remove(); }, []);
  useEffect(() => {
    if (!inside || MODE !== 'live') return;
    load().catch(() => { auth.signOut(); setInside(false); });
    /* Nouvelles demandes et messages WhatsApp : actualisation automatique toutes les 20 s */
    const id = setInterval(() => { if (!document.hidden) load().catch(() => null); }, 20000);
    return () => clearInterval(id);
  }, [inside]);
  useEffect(() => { const f = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPal((x) => !x); } }; window.addEventListener('keydown', f); return () => window.removeEventListener('keydown', f); }, []);
  useEffect(() => setSide(false), [loc.pathname]);
  if (!inside) return <Login onIn={() => { sessionStorage.setItem('dg-admin-demo', '1'); setInside(true); }} />;
  const unread = s.activity.filter((a) => !a.read).length;
  const simulate = () => { const done = simulateLead(); setToast(['Nouvelle demande reçue', ...done]); setTimeout(() => setToast([]), 5200); };
  const groups = Array.from(new Set(NAV.map((n) => n.group)));
  const Side = (
    <nav className="flex flex-col h-full">
      <Link to="/admin" className="flex items-center gap-2.5 px-5 h-16 shrink-0"><Mark className="w-6 h-7" /><Wordmark className="text-[18px]" loop={false} /></Link>
      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-5">{groups.map((g) => (
        <div key={g}><p className="px-3 mb-1.5 text-[11px] uppercase tracking-[0.12em] text-white/30">{g}</p>
          {NAV.filter((n) => n.group === g).map((n) => { const b = n.badge?.(s) || 0; return (
            <NavLink key={n.to} to={n.to} end={n.to === '/admin'} className={({ isActive }) => cx('relative flex items-center gap-3 h-10 px-3 rounded-lg text-[14px] transition-colors', isActive ? 'text-white' : 'text-white/60 hover:text-white hover:bg-white/[0.04]')}>
              {({ isActive }) => (<>{isActive && <motion.span layoutId="sidenav" className="absolute inset-0 rounded-lg bg-white/[0.07] ring-1 ring-white/10" />}{isActive && <span className="absolute start-0 top-2 bottom-2 w-[3px] rounded-e bg-safran" />}<n.I size={17} className="relative" /><span className="relative flex-1">{n.label}</span>{b > 0 && <span className="relative min-w-5 h-5 px-1.5 rounded-full bg-safran text-nuit text-[11px] font-semibold flex items-center justify-center">{b}</span>}</>)}
            </NavLink>
          ); })}
        </div>
      ))}</div>
      <div className="p-3 border-t border-white/[0.06]">
        <div className="rounded-xl bg-white/[0.04] p-3 text-[12.5px]"><p className="flex items-center gap-2"><span className={cx('w-2 h-2 rounded-full', MODE === 'live' ? 'bg-[#34D399]' : 'bg-safran')} />{MODE === 'live' ? 'Production · Supabase' : 'Mode démo'}</p><p className="mt-1 text-white/45">{MODE === 'live' ? 'Données synchronisées' : 'Données locales à ce navigateur'}</p></div>
        <button onClick={() => { auth.signOut(); sessionStorage.removeItem('dg-admin-demo'); setInside(false); }} className="mt-2 w-full flex items-center gap-2 h-9 px-3 rounded-lg text-[13px] text-white/55 hover:text-white hover:bg-white/[0.04]"><LogOut size={15} /> Déconnexion</button>
      </div>
    </nav>
  );
  return (
    <div className="min-h-[100svh] bg-[#081122] text-white flex">
      <aside className="hidden lg:block w-[248px] shrink-0 border-e border-white/[0.06] sticky top-0 h-[100svh] bg-[#091326]">{Side}</aside>
      <AnimatePresence>{side && <motion.div className="lg:hidden fixed inset-0 z-[80] bg-black/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSide(false)}><motion.aside onClick={(e) => e.stopPropagation()} initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} className="w-[264px] h-full bg-[#091326]">{Side}</motion.aside></motion.div>}</AnimatePresence>
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-40 h-16 flex items-center gap-3 px-4 md:px-6 border-b border-white/[0.06] bg-[#081122]/85 backdrop-blur">
          <button className="lg:hidden w-9 h-9 rounded-lg hover:bg-white/10 flex items-center justify-center" onClick={() => setSide(true)} aria-label="Menu"><Menu size={18} /></button>
          <button onClick={() => setPal(true)} className="flex-1 max-w-[520px] h-10 rounded-xl bg-white/[0.04] ring-1 ring-white/[0.08] flex items-center gap-3 px-3.5 text-[14px] text-white/40 hover:ring-white/20 transition"><Search size={16} /><span className="flex-1 text-start truncate">Rechercher ou demander à l’IA…</span><kbd className="hidden sm:inline text-[11px] ring-1 ring-white/15 rounded px-1.5">Ctrl K</kbd></button>
          <div className="ms-auto flex items-center gap-1.5">
            {MODE === 'demo' && <Btn kind="soft" onClick={simulate} title="Crée une demande fictive et déclenche les automatisations"><Zap size={15} className="text-safran" /><span className="hidden md:inline">Simuler une demande</span></Btn>}
            <Btn kind="primary" onClick={() => nav('/admin/devis-intelligent')}><Wand2 size={15} /><span className="hidden sm:inline">Devis intelligent</span></Btn>
            <div className="relative"><button onClick={() => setBell(!bell)} className="relative w-10 h-10 rounded-xl hover:bg-white/[0.06] flex items-center justify-center" aria-label="Notifications"><Bell size={18} />{unread > 0 && <span className="absolute top-2 end-2 w-2 h-2 rounded-full bg-safran ring-2 ring-[#081122]" />}</button>
              <AnimatePresence>{bell && <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute end-0 mt-2 w-[360px] rounded-2xl bg-[#0D1830] ring-1 ring-white/12 shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]"><p className="font-medium text-[14px]">Activité</p><button className="text-[12px] text-brume hover:text-white" onClick={() => s.activity.forEach((a) => !a.read && db.update('activity', a.id, { read: true }))}>Tout marquer lu</button></div>
                <ul className="max-h-[360px] overflow-y-auto">{s.activity.slice(0, 20).map((a) => <li key={a.id}><button onClick={() => { db.update('activity', a.id, { read: true }); setBell(false); if (a.ref) nav(a.ref); }} className={cx('w-full text-start px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.03]', !a.read && 'bg-safran/[0.04]')}><p className="text-[13.5px]">{a.text}</p><p className="mt-0.5 text-[11.5px] text-white/40">{rel(a.at)}</p></button></li>)}</ul>
              </motion.div>}</AnimatePresence>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Suspense fallback={<div className="h-[60vh] flex items-center justify-center"><Mark className="w-10 h-11 animate-pulse" /></div>}>
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="demandes" element={<Leads />} />
              <Route path="devis-intelligent" element={<QuoteBuilder />} />
              <Route path="clients" element={<Clients />} />
              <Route path="projets" element={<Projects />} />
              <Route path="factures" element={<Invoices />} />
              <Route path="finances" element={<Finance />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="whatsapp" element={<WhatsApp />} />
              <Route path="emails" element={<Emails />} />
              <Route path="automatisations" element={<Automations />} />
              <Route path="assistant" element={<Assistant />} />
              <Route path="parametres" element={<SettingsPage />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </Suspense>
        </main>
      </div>
      <Palette open={pal} onClose={() => setPal(false)} />
      <AnimatePresence>{toast.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="fixed bottom-5 end-5 z-[96] w-[340px] rounded-2xl bg-[#0D1830] ring-1 ring-safran/40 p-4 shadow-2xl">
          <p className="font-medium flex items-center gap-2"><Zap size={16} className="text-safran" />{toast[0]}</p>
          <ul className="mt-2 space-y-1 text-[13px] text-brume">{toast.slice(1).map((t, k) => <motion.li key={k} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + k * 0.25 }}>✓ {t}</motion.li>)}</ul>
        </motion.div>
      )}</AnimatePresence>
      <button onClick={() => setToast([])} className="hidden"><X /></button>
    </div>
  );
}
