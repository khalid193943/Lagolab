import { useState } from 'react';
import { Plus, Trash2, Download } from 'lucide-react';
import { useDB, db, analytics, mad, fdate, uid, invTotals, scoreLead } from '../store';
import { Panel, Stat, Bars, Donut, Btn, Input, Select, Field, Modal, Spark, Progress, downloadCSV } from '../kit';

const MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
const CATS = ['Infrastructure', 'Logiciels', 'Marketing', 'Équipement', 'Sous-traitance', 'Déplacements', 'Bureau', 'Autre'];
const PAL = ['#F4B53F', '#2DD4E6', '#8B9CFF', '#34D399', '#FF8A7A', '#E879F9', '#FFD37A', '#64748B'];

export function Finance() {
  const s = useDB(); const a = analytics(s); const [add, setAdd] = useState(false); const [f, setF] = useState({ label: '', category: 'Logiciels', amount: 0, date: new Date().toISOString().slice(0, 10) });
  const yearPaid = a.months.reduce((n, m) => n + (a.paidBy[m] || 0), 0), yearExp = a.months.reduce((n, m) => n + (a.expBy[m] || 0), 0);
  const profit = yearPaid - yearExp; const margin = yearPaid ? (profit / yearPaid) * 100 : 0;
  const net = a.months.map((m) => (a.paidBy[m] || 0) - (a.expBy[m] || 0));
  const byCat = CATS.map((c, i) => ({ label: c, value: s.expenses.filter((e) => e.category === c).reduce((n, e) => n + e.amount, 0), color: PAL[i] })).filter((x) => x.value > 0);
  const q = Math.floor(new Date().getMonth() / 3); const qMonths = [0, 1, 2].map((k) => `${new Date().getFullYear()}-${String(q * 3 + k + 1).padStart(2, '0')}`);
  const tvaCollected = s.invoices.filter((i) => i.kind === 'facture').flatMap((i) => i.payments.filter((p) => qMonths.includes(p.date.slice(0, 7))).map((p) => (p.amount * i.tva) / (100 + i.tva))).reduce((n, x) => n + x, 0);
  return (
    <div className="space-y-5 max-w-[1500px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="font-display text-[26px] tracking-[-0.03em]">Trésorerie</h1><p className="text-[13.5px] text-brume">Encaissements, dépenses, marge, TVA et prévisions sur 12 mois (montants HT).</p></div><div className="flex gap-2"><Btn kind="soft" onClick={() => downloadCSV('depenses.csv', s.expenses.map((e) => ({ date: e.date, libelle: e.label, categorie: e.category, montant: e.amount })))}><Download size={15} />CSV</Btn><Btn kind="primary" onClick={() => setAdd(true)}><Plus size={15} />Dépense</Btn></div></div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <Stat label="Encaissé (12 mois)" value={mad(yearPaid)} />
        <Stat label="Dépenses (12 mois)" value={mad(yearExp)} accent="#2DD4E6" />
        <Stat label="Bénéfice avant impôt" value={mad(profit)} sub={`marge ${Math.round(margin)} %`} accent="#34D399" />
        <Stat label="TVA collectée (trimestre)" value={mad(tvaCollected)} sub="à déclarer, hors TVA déductible" accent="#FF8A7A" />
      </div>
      <div className="grid xl:grid-cols-3 gap-4">
        <Panel className="xl:col-span-2" title="Résultat net par mois"><Bars data={a.months.map((m, i) => ({ label: MONTHS[+m.slice(5) - 1], a: Math.max(0, net[i]) }))} format={mad} /><div className="mt-4"><Spark values={net} color="#34D399" h={48} /></div></Panel>
        <Panel title="Dépenses par catégorie"><Donut data={byCat} center={<div><p className="font-display text-[16px]">{mad(yearExp)}</p></div>} /></Panel>
      </div>
      <div className="grid xl:grid-cols-3 gap-4">
        <Panel title="Prévision des 30 prochains jours"><p className="font-display text-[30px] tabular-nums">{mad(a.forecast)}</p><p className="mt-2 text-[13px] text-brume">Revenu récurrent ({mad(a.mrr)}) + 70 % des factures en attente + 35 % du pipeline pondéré ({mad(a.pipeline)}).</p></Panel>
        <Panel title="Objectif mensuel"><Field label="Objectif d’encaissement (MAD HT)"><Input type="number" value={s.settings.goal_month} onChange={(e) => db.settings({ goal_month: +e.target.value })} /></Field><div className="mt-4"><Progress value={(a.thisMonthPaid / s.settings.goal_month) * 100} /></div><p className="mt-2 text-[13px] text-brume">{mad(a.thisMonthPaid)} encaissés ce mois-ci.</p></Panel>
        <Panel title="Meilleurs clients (encaissé HT)"><ul className="space-y-2.5">{a.revenueByClient.slice(0, 5).map((r) => <li key={r.c.id}><div className="flex justify-between text-[13.5px]"><span className="truncate">{r.c.company || r.c.name}</span><span className="tabular-nums">{mad(r.v)}</span></div><div className="mt-1.5"><Progress value={(r.v / Math.max(1, a.revenueByClient[0].v)) * 100} color="#2DD4E6" /></div></li>)}</ul></Panel>
      </div>
      <Panel title="Dépenses récentes" pad={false}><div className="overflow-x-auto"><table className="w-full text-[13.5px]"><tbody>{[...s.expenses].sort((x, y) => y.date.localeCompare(x.date)).slice(0, 20).map((e) => <tr key={e.id} className="border-t border-white/[0.05]"><td className="px-5 py-2.5 text-brume w-32">{fdate(e.date)}</td><td className="px-5 py-2.5">{e.label}</td><td className="px-5 py-2.5 text-brume">{e.category}</td><td className="px-5 py-2.5 text-end tabular-nums">{mad(e.amount)}</td><td className="px-3 w-10"><button onClick={() => db.remove('expenses', e.id)} className="text-white/30 hover:text-[#FF8A7A]"><Trash2 size={14} /></button></td></tr>)}</tbody></table></div></Panel>
      <Modal open={add} onClose={() => setAdd(false)} title="Nouvelle dépense"><div className="grid grid-cols-2 gap-3"><Field label="Libellé" className="col-span-2"><Input value={f.label} onChange={(e) => setF({ ...f, label: e.target.value })} /></Field><Field label="Catégorie"><Select value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} options={CATS.map((c) => [c, c])} /></Field><Field label="Montant (MAD)"><Input type="number" value={f.amount} onChange={(e) => setF({ ...f, amount: +e.target.value })} /></Field><Field label="Date" className="col-span-2"><Input type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></Field></div><div className="mt-5 flex justify-end"><Btn kind="primary" onClick={() => { if (f.label && f.amount) { db.insert('expenses', { id: uid(), ...f }); setAdd(false); setF({ ...f, label: '', amount: 0 }); } }}>Enregistrer</Btn></div></Modal>
    </div>
  );
}

export function Analytics() {
  const s = useDB(); const a = analytics(s);
  const top = (o: Record<string, number>) => Object.entries(o).sort((x, y) => y[1] - x[1]);
  const convBy = (key: 'source' | 'city' | 'sector') => { const m: Record<string, [number, number]> = {}; s.leads.forEach((l) => { const k = (l as any)[key] || '—'; m[k] = m[k] || [0, 0]; if (l.status === 'gagne') m[k][0]++; if (['gagne', 'perdu'].includes(l.status)) m[k][1]++; }); return Object.entries(m).filter(([, v]) => v[1] > 0).map(([k, v]) => ({ k, rate: v[0] / v[1], n: v[1] })).sort((x, y) => y.rate - x.rate); };
  const leadsBy = a.months.map((m) => ({ label: MONTHS[+m.slice(5) - 1], a: s.leads.filter((l) => l.created_at.slice(0, 7) === m).length }));
  const grid = Array.from({ length: 7 }, (_, d) => Array.from({ length: 6 }, (_, h) => s.leads.filter((l) => { const t = new Date(l.created_at); return (t.getDay() + 6) % 7 === d && Math.floor(t.getHours() / 4) === h; }).length));
  const gmax = Math.max(1, ...grid.flat());
  const byService: Record<string, number> = {}; s.projects.forEach((p) => { byService[p.type] = (byService[p.type] || 0) + p.budget; });
  const avgScore = s.leads.length ? Math.round(s.leads.reduce((n, l) => n + scoreLead(l), 0) / s.leads.length) : 0;
  const subs = a.months.map((m) => s.subscribers.filter((x) => x.created_at.slice(0, 7) <= m && x.status === 'actif').length);
  const avgDeal = (() => { const won = s.leads.filter((l) => l.status === 'gagne' && l.value); return won.length ? won.reduce((n, l) => n + (l.value || 0), 0) / won.length : 0; })();
  return (
    <div className="space-y-5 max-w-[1500px] mx-auto">
      <div><h1 className="font-display text-[26px] tracking-[-0.03em]">Analytics</h1><p className="text-[13.5px] text-brume">Ce qui fonctionne, d’où viennent vos meilleurs clients, et où investir votre énergie.</p></div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4"><Stat label="Taux de conversion" value={`${Math.round(a.conv * 100)} %`} sub="demandes gagnées / conclues" /><Stat label="Panier moyen" value={mad(avgDeal)} accent="#2DD4E6" /><Stat label="Score moyen des demandes" value={`${avgScore}/100`} accent="#8B9CFF" /><Stat label="Abonnés newsletter" value={String(s.subscribers.filter((x) => x.status === 'actif').length)} accent="#34D399" /></div>
      <div className="grid xl:grid-cols-3 gap-4">
        <Panel className="xl:col-span-2" title="Demandes par mois"><Bars data={leadsBy} colors={['#2DD4E6']} /></Panel>
        <Panel title="Conversion par source"><ul className="space-y-3">{convBy('source').map((x) => <li key={x.k}><div className="flex justify-between text-[13.5px]"><span>{x.k}</span><span className="tabular-nums">{Math.round(x.rate * 100)} % <span className="text-white/40">({x.n})</span></span></div><div className="mt-1.5"><Progress value={x.rate * 100} color="#34D399" /></div></li>)}</ul></Panel>
      </div>
      <div className="grid xl:grid-cols-3 gap-4">
        <Panel title="Villes qui demandent le plus"><Donut data={top(a.byCity).slice(0, 7).map(([label, value], i) => ({ label, value, color: PAL[i] }))} /></Panel>
        <Panel title="Secteurs qui demandent le plus"><Donut data={top(a.bySector).slice(0, 7).map(([label, value], i) => ({ label, value, color: PAL[i] }))} /></Panel>
        <Panel title="Chiffre d’affaires signé par type de projet"><Donut data={top(byService).map(([label, value], i) => ({ label, value, color: PAL[i] }))} /></Panel>
      </div>
      <div className="grid xl:grid-cols-2 gap-4">
        <Panel title="Quand arrivent les demandes (jour × heure)">
          <div className="grid grid-cols-[40px_repeat(6,1fr)] gap-1 text-[11px] text-white/40"><span />{['0-4 h', '4-8 h', '8-12 h', '12-16 h', '16-20 h', '20-24 h'].map((h) => <span key={h} className="text-center">{h}</span>)}
            {grid.map((row, d) => [<span key={'d' + d} className="leading-8">{['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][d]}</span>, ...row.map((v, h) => <span key={d + '-' + h} className="h-8 rounded-md" style={{ background: `rgba(244,181,63,${0.06 + (v / gmax) * 0.85})` }} title={`${v} demande(s)`} />)])}
          </div>
          <p className="mt-3 text-[12.5px] text-brume">Soyez disponible sur WhatsApp aux créneaux les plus chargés : c’est là que se gagnent les clients.</p>
        </Panel>
        <Panel title="Croissance de la newsletter"><Spark values={subs} color="#34D399" h={120} /><p className="mt-3 text-[12.5px] text-brume">{s.campaigns.filter((c) => c.status === 'envoyee').map((c) => `« ${c.subject} » : ${Math.round(((c.opens || 0) / Math.max(1, c.recipients || 1)) * 100)} % d’ouverture`).join(' · ')}</p></Panel>
      </div>
      <Panel title="Valeur facturée par client (TTC)"><Bars data={s.clients.map((c) => ({ label: (c.company || c.name).split(' ')[0], a: s.invoices.filter((i) => i.client_id === c.id && i.kind === 'facture').reduce((n, i) => n + invTotals(i).ttc, 0) }))} format={mad} colors={['#8B9CFF']} /></Panel>
    </div>
  );
}
export default Finance;
