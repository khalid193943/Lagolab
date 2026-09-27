import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Users, Plus, Phone, Mail, MessageCircle, Download, FolderKanban, FileText } from 'lucide-react';
import { useDB, db, Client, invTotals, mad, fdate, uid, now, isOverdue } from '../store';
import { Panel, Badge, Btn, Drawer, Empty, Avatar, Input, Field, Area, Modal, downloadCSV } from '../kit';
import { STAGES } from './Dashboard';

export default function Clients() {
  const s = useDB(); const [params, setParams] = useSearchParams(); const [q, setQ] = useState(''); const [edit, setEdit] = useState<Partial<Client> | null>(null);
  const rows = s.clients.map((c) => { const inv = s.invoices.filter((i) => i.client_id === c.id && i.kind === 'facture' && i.status !== 'annulee'); const t = inv.reduce((a, i) => { const x = invTotals(i); return { billed: a.billed + x.ttc, paid: a.paid + x.paid, due: a.due + x.due }; }, { billed: 0, paid: 0, due: 0 }); return { c, ...t, projects: s.projects.filter((p) => p.client_id === c.id), late: inv.some(isOverdue), mrr: s.projects.filter((p) => p.client_id === c.id).reduce((n, p) => n + (p.monthly || 0), 0) }; })
    .filter((r) => !q || [r.c.name, r.c.company, r.c.city, r.c.email, r.c.phone].join(' ').toLowerCase().includes(q.toLowerCase())).sort((a, b) => b.paid - a.paid);
  const open = rows.find((r) => r.c.id === params.get('id'));
  const save = () => { if (!edit?.name) return; if (edit.id) db.update('clients', edit.id, edit); else db.insert('clients', { id: uid(), created_at: now(), name: edit.name, ...edit } as Client); setEdit(null); };
  return (
    <div className="space-y-5 max-w-[1500px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="font-display text-[26px] tracking-[-0.03em]">Clients</h1><p className="text-[13.5px] text-brume">{s.clients.length} clients · {mad(rows.reduce((n, r) => n + r.paid, 0))} encaissés au total</p></div>
        <div className="flex gap-2"><Input placeholder="Rechercher…" value={q} onChange={(e) => setQ(e.target.value)} className="!w-56" /><Btn kind="soft" onClick={() => downloadCSV('clients.csv', rows.map((r) => ({ client: r.c.company || r.c.name, contact: r.c.name, ville: r.c.city, email: r.c.email, telephone: r.c.phone, ice: r.c.ice, facture_ttc: Math.round(r.billed), encaisse: Math.round(r.paid), reste: Math.round(r.due) })))}><Download size={15} />CSV</Btn><Btn kind="primary" onClick={() => setEdit({})}><Plus size={15} />Client</Btn></div>
      </div>
      {rows.length ? <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">{rows.map((r) => (
        <button key={r.c.id} onClick={() => setParams({ id: r.c.id })} className="text-start rounded-2xl bg-white/[0.035] ring-1 ring-white/[0.08] p-5 hover:ring-white/20 transition">
          <div className="flex items-center gap-3"><Avatar name={r.c.company || r.c.name} size={42} /><div className="min-w-0 flex-1"><p className="font-medium truncate">{r.c.company || r.c.name}</p><p className="text-[12.5px] text-brume truncate">{r.c.name} · {r.c.city}</p></div>{r.late && <Badge tone="warn">Retard</Badge>}</div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">{[['Encaissé', mad(r.paid)], ['Reste', mad(r.due)], ['Mensuel', r.mrr ? mad(r.mrr) : '—']].map(([k, v]) => <div key={k} className="rounded-lg bg-white/[0.03] py-2"><p className="text-[11px] text-white/40">{k}</p><p className="text-[13px] tabular-nums mt-0.5">{v}</p></div>)}</div>
          <p className="mt-3 text-[12px] text-white/45">{r.projects.length} projet{r.projects.length > 1 ? 's' : ''} · client depuis {fdate(r.c.created_at)}</p>
        </button>
      ))}</div> : <Panel><Empty icon={<Users size={20} />} title="Aucun client" text="Convertissez une demande gagnée ou ajoutez un client." /></Panel>}

      <Drawer open={!!open} onClose={() => setParams({})} title={open && <div className="flex items-center gap-3"><Avatar name={open.c.company || open.c.name} size={44} /><div><p className="font-display text-[19px]">{open.c.company || open.c.name}</p><p className="text-[13px] text-brume">{open.c.name} · {open.c.city} · {open.c.sector}</p></div></div>}
        footer={open && <><Btn kind="soft" onClick={() => setEdit(open.c)}>Modifier</Btn><Link to={`/admin/factures?new=facture&client=${open.c.id}`} className="inline-flex items-center gap-2 h-9 ps-3 pe-4 bg-safran text-nuit rounded-e-full text-[13.5px] font-medium"><FileText size={15} />Nouvelle facture</Link></>}>
        {open && <div className="space-y-6">
          <div className="grid grid-cols-3 gap-3">{[['Facturé TTC', mad(open.billed)], ['Encaissé', mad(open.paid)], ['Reste dû', mad(open.due)]].map(([k, v]) => <div key={k} className="rounded-xl bg-white/[0.03] ring-1 ring-white/[0.06] p-3"><p className="text-[11.5px] text-white/40">{k}</p><p className="mt-1 font-display text-[16px] tabular-nums">{v}</p></div>)}</div>
          <div className="flex flex-wrap gap-2">{open.c.phone && <a href={`tel:${open.c.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-2 h-9 px-3 rounded-lg bg-white/[0.06] ring-1 ring-white/10 text-[13px]"><Phone size={14} />{open.c.phone}</a>}{open.c.email && <a href={`mailto:${open.c.email}`} className="inline-flex items-center gap-2 h-9 px-3 rounded-lg bg-white/[0.06] ring-1 ring-white/10 text-[13px]"><Mail size={14} />{open.c.email}</a>}{open.c.phone && <Link to="/admin/whatsapp" className="inline-flex items-center gap-2 h-9 px-3 rounded-lg bg-[#25D366]/15 text-[#6EE7B7] text-[13px]"><MessageCircle size={14} />WhatsApp</Link>}</div>
          {(open.c.ice || open.c.address) && <p className="text-[13px] text-brume">{open.c.address}{open.c.ice && ` · ICE ${open.c.ice}`}</p>}
          <div><p className="text-[12px] text-white/40 mb-2 flex items-center gap-2"><FolderKanban size={13} />Projets</p><ul className="space-y-2">{open.projects.map((p) => <li key={p.id}><Link to={`/admin/projets?id=${p.id}`} className="flex items-center justify-between rounded-xl bg-white/[0.03] ring-1 ring-white/[0.06] p-3 text-[13.5px] hover:ring-white/15"><span>{p.name}</span><Badge>{STAGES.find((x) => x[0] === p.stage)?.[1]}</Badge></Link></li>)}{!open.projects.length && <li className="text-[13px] text-brume">Aucun projet.</li>}</ul></div>
          <div><p className="text-[12px] text-white/40 mb-2 flex items-center gap-2"><FileText size={13} />Factures et devis</p><ul className="space-y-2">{s.invoices.filter((i) => i.client_id === open.c.id).map((i) => { const t = invTotals(i); return <li key={i.id}><Link to={`/admin/factures?id=${i.id}`} className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.03] ring-1 ring-white/[0.06] p-3 text-[13.5px] hover:ring-white/15"><span>{i.number}<span className="block text-[12px] text-brume">{fdate(i.issue)}</span></span><span className="text-end tabular-nums">{mad(t.ttc)}<span className="block text-[12px]">{isOverdue(i) ? <span className="text-safran">en retard</span> : <span className="text-brume">{i.status}</span>}</span></span></Link></li>; })}</ul></div>
          {open.c.notes && <p className="rounded-xl bg-white/[0.03] p-4 text-[13.5px]">{open.c.notes}</p>}
        </div>}
      </Drawer>

      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit?.id ? 'Modifier le client' : 'Nouveau client'}>
        {edit && <><div className="grid sm:grid-cols-2 gap-3">{([['name', 'Nom du contact *'], ['company', 'Entreprise'], ['phone', 'Téléphone'], ['email', 'E-mail'], ['city', 'Ville'], ['sector', 'Secteur'], ['ice', 'ICE'], ['address', 'Adresse']] as const).map(([k, l]) => <Field key={k} label={l}><Input value={(edit as any)[k] || ''} onChange={(e) => setEdit({ ...edit, [k]: e.target.value })} /></Field>)}<Field label="Notes" className="sm:col-span-2"><Area value={edit.notes || ''} onChange={(e) => setEdit({ ...edit, notes: e.target.value })} /></Field></div>
        <div className="mt-5 flex justify-between">{edit.id ? <Btn kind="danger" onClick={() => { if (confirm('Supprimer ce client ?')) { db.remove('clients', edit.id!); setEdit(null); setParams({}); } }}>Supprimer</Btn> : <span />}<Btn kind="primary" onClick={save}>Enregistrer</Btn></div></>}
      </Modal>
    </div>
  );
}
