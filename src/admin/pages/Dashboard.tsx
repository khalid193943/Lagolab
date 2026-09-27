import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Inbox, Wallet, FolderKanban, TrendingUp, ArrowUpRight, Sparkles, AlertTriangle, Flame, Info, CheckCircle2, MessageCircle } from 'lucide-react';
import { useDB, analytics, insights, mad, rel, scoreLead, heat, Stage } from '../store';
import { Panel, Stat, Badge, Bars, Donut, Funnel, Progress, Avatar } from '../kit';

const SRC_COLORS = ['#F4B53F', '#2DD4E6', '#8B9CFF', '#34D399', '#FF8A7A', '#E879F9'];
export const STAGES: [Stage, string][] = [['cadrage', 'Cadrage'], ['version', 'Première version'], ['affinage', 'Affinage'], ['dev', 'Développement'], ['lancement', 'Lancement'], ['maintenance', 'Maintenance'], ['termine', 'Terminé']];
const MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

export default function Dashboard() {
  const s = useDB(); const a = analytics(s); const ins = insights(s);
  const hour = new Date().getHours(); const hello = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';
  const bars = a.months.map((m) => ({ label: MONTHS[+m.slice(5) - 1], a: a.paidBy[m] || 0, b: a.expBy[m] || 0 }));
  const src = Object.entries(a.bySource).sort((x, y) => y[1] - x[1]).map(([label, value], i) => ({ label, value, color: SRC_COLORS[i % SRC_COLORS.length] }));
  const count = (st: string) => s.leads.filter((l) => l.status === st).length;
  const active = s.projects.filter((p) => !['maintenance', 'termine'].includes(p.stage));
  const hot = [...s.leads].filter((l) => !['gagne', 'perdu'].includes(l.status)).sort((x, y) => scoreLead(y) - scoreLead(x)).slice(0, 5);
  const trend = a.leadsPrev ? ((a.leads30 - a.leadsPrev) / a.leadsPrev) * 100 : 0;
  const I = { hot: Flame, warn: AlertTriangle, info: Info, good: CheckCircle2 } as const;
  return (
    <div className="space-y-6 max-w-[1500px] mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-[13px] text-brume">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p><h1 className="mt-1 font-display text-[28px] md:text-[32px] tracking-[-0.035em]">{hello} 👋</h1></div>
        <div className="flex items-center gap-3 text-[13px] text-brume"><span>Objectif du mois</span><div className="w-40"><Progress value={(a.thisMonthPaid / s.settings.goal_month) * 100} /></div><span className="tabular-nums text-white">{Math.round((a.thisMonthPaid / s.settings.goal_month) * 100)} %</span></div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <Stat label="Encaissé ce mois (HT)" value={mad(a.thisMonthPaid)} sub={`facturé : ${mad(a.thisMonthBilled)}`} icon={<Wallet size={17} />} />
        <Stat label="Demandes (30 j)" value={String(a.leads30)} trend={trend} sub="vs 30 j précédents" icon={<Inbox size={17} />} accent="#2DD4E6" />
        <Stat label="Reste à encaisser (TTC)" value={mad(a.outstanding)} sub={`${a.overdue.length} facture${a.overdue.length > 1 ? 's' : ''} en retard`} icon={<TrendingUp size={17} />} accent="#FF8A7A" />
        <Stat label="Revenu récurrent / mois" value={mad(a.mrr)} sub={`${active.length} projets en cours`} icon={<FolderKanban size={17} />} accent="#34D399" />
      </div>

      {/* L'assistant : ce qui compte aujourd'hui */}
      <Panel title={<span className="flex items-center gap-2"><Sparkles size={16} className="text-safran" />Aujourd’hui, l’essentiel</span>} action={<Link to="/admin/assistant" className="text-[13px] text-brume hover:text-white flex items-center gap-1">Assistant <ArrowUpRight size={14} /></Link>}>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">{ins.slice(0, 6).map((x, k) => { const Ic = I[x.tone]; return (
          <motion.div key={x.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: k * 0.06 }}>
            <Link to={x.to} className="group h-full flex gap-3 rounded-xl bg-white/[0.03] ring-1 ring-white/[0.06] p-4 hover:ring-white/15 transition">
              <span className={`mt-0.5 w-8 h-8 shrink-0 rounded-lg flex items-center justify-center ${x.tone === 'hot' ? 'bg-[#FF6B4A]/15 text-[#FF9A80]' : x.tone === 'warn' ? 'bg-safran/15 text-safran' : x.tone === 'good' ? 'bg-[#34D399]/12 text-[#6EE7B7]' : 'bg-cyan/10 text-cyan'}`}><Ic size={16} /></span>
              <span className="min-w-0"><span className="block text-[14px] font-medium">{x.title}</span><span className="block mt-0.5 text-[12.5px] text-brume">{x.text}</span><span className="mt-2 inline-flex items-center gap-1 text-[12.5px] text-safran group-hover:gap-2 transition-all">{x.cta} <ArrowUpRight size={13} /></span></span>
            </Link>
          </motion.div>
        ); })}</div>
      </Panel>

      <div className="grid xl:grid-cols-3 gap-4">
        <Panel className="xl:col-span-2" title="Encaissements vs dépenses (12 mois, HT)"><Bars data={bars} format={(n) => mad(n)} legend={['Encaissé', 'Dépenses']} colors={['#F4B53F', '#2DD4E6']} /></Panel>
        <Panel title="D’où viennent vos demandes"><Donut data={src} center={<div><p className="font-display text-[22px]">{s.leads.length}</p><p className="text-[11px] text-brume">demandes</p></div>} /></Panel>
      </div>

      <div className="grid xl:grid-cols-3 gap-4">
        <Panel title="Pipeline commercial" action={<Badge tone="good">Conversion {Math.round(a.conv * 100)} %</Badge>}>
          <Funnel steps={[{ label: 'Nouvelles', value: count('nouveau'), color: '#FF9A80' }, { label: 'Contactées', value: count('contacte'), color: '#F4B53F' }, { label: '1re version', value: count('version'), color: '#FFD37A' }, { label: 'Devis envoyé', value: count('devis'), color: '#2DD4E6' }, { label: 'Gagnées', value: count('gagne'), color: '#34D399' }]} />
          <p className="mt-4 text-[12.5px] text-brume">Valeur pondérée du pipeline : <span className="text-white">{mad(a.pipeline)}</span> · Prévision 30 j : <span className="text-white">{mad(a.forecast)}</span></p>
        </Panel>
        <Panel title="Demandes les plus chaudes" action={<Link to="/admin/demandes" className="text-[13px] text-brume hover:text-white">Tout voir</Link>}>
          <ul className="space-y-2">{hot.map((l) => { const sc = scoreLead(l); const h = heat(sc); return (
            <li key={l.id}><Link to={`/admin/demandes?id=${l.id}`} className="flex items-center gap-3 rounded-lg p-2 -mx-2 hover:bg-white/[0.04]"><Avatar name={l.company || l.name} size={34} /><span className="min-w-0 flex-1"><span className="block text-[14px] truncate">{l.company || l.name}</span><span className="block text-[12px] text-brume truncate">{l.city} · {l.sector} · {rel(l.created_at)}</span></span><Badge tone={h.tone}>{sc}</Badge></Link></li>
          ); })}</ul>
        </Panel>
        <Panel title="Projets en cours" action={<Link to="/admin/projets" className="text-[13px] text-brume hover:text-white">Tout voir</Link>}>
          <ul className="space-y-4">{active.map((p) => { const done = p.tasks.filter((t) => t.done).length; const pct = p.tasks.length ? (done / p.tasks.length) * 100 : 0; const d = Math.round((+new Date(p.due) - Date.now()) / 864e5); return (
            <li key={p.id}><Link to={`/admin/projets?id=${p.id}`} className="block"><div className="flex items-center justify-between gap-3 text-[13.5px]"><span className="truncate">{p.name}</span><span className={`shrink-0 text-[12px] ${d <= 3 ? 'text-safran' : 'text-brume'}`}>{d >= 0 ? `J-${d}` : `+${-d} j`}</span></div><div className="mt-2"><Progress value={pct} color={d <= 3 ? '#F4B53F' : '#2DD4E6'} /></div><p className="mt-1 text-[11.5px] text-white/40">{STAGES.find((x) => x[0] === p.stage)?.[1]} · {done}/{p.tasks.length} tâches</p></Link></li>
          ); })}</ul>
        </Panel>
      </div>

      <Panel title={<span className="flex items-center gap-2"><MessageCircle size={16} className="text-[#25D366]" />Dernière activité</span>}>
        <ul className="divide-y divide-white/[0.05]">{s.activity.slice(0, 8).map((x) => <li key={x.id} className="py-2.5 flex items-center justify-between gap-4 text-[13.5px]"><span className="truncate">{x.text}</span><span className="shrink-0 text-[12px] text-white/40">{rel(x.at)}</span></li>)}</ul>
      </Panel>
    </div>
  );
}
