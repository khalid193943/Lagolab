import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Wand2, FileText, Plus, Trash2, Printer, Send, Copy, CheckCircle2, Wallet, MessageCircle } from 'lucide-react';
import { useDB, db, Invoice, Item, invTotals, isOverdue, mad, fdate, uid, fill, getDB } from '../store';
import { Panel, Badge, Btn, Tabs, Empty, Input, Select, Field, Area, Modal, Stat, downloadCSV, cx } from '../kit';
import { sendEmail, sendWhatsApp } from './Leads';

/* Montant en lettres (usage marocain : « Arrêtée la présente facture à la somme de … ») */
const U = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize'];
const T = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante', 'quatre-vingt', 'quatre-vingt'];
const under100 = (n: number): string => { if (n < 17) return U[n]; if (n < 20) return 'dix-' + U[n - 10]; const t = Math.floor(n / 10), u = n % 10; if (t === 7 || t === 9) return T[t] + (u === 1 && t === 7 ? '-et-' : '-') + under100(10 + u); return T[t] + (u === 0 ? (t === 8 ? 's' : '') : u === 1 && t !== 8 ? '-et-un' : '-' + U[u]); };
const under1000 = (n: number): string => { const c = Math.floor(n / 100), r = n % 100; const cs = c === 0 ? '' : c === 1 ? 'cent' : U[c] + '-cent' + (r === 0 ? 's' : ''); return [cs, r ? under100(r) : ''].filter(Boolean).join('-'); };
export const words = (n: number): string => { n = Math.floor(n); if (n === 0) return 'zéro'; const m = Math.floor(n / 1e6), k = Math.floor((n % 1e6) / 1000), r = n % 1000; return [m ? (m === 1 ? 'un million' : under1000(m) + ' millions') : '', k ? (k === 1 ? 'mille' : under1000(k) + '-mille') : '', r ? under1000(r) : ''].filter(Boolean).join(' '); };

const STATUS: Record<string, [string, string]> = { brouillon: ['Brouillon', 'mute'], envoyee: ['Envoyée', 'info'], payee: ['Payée', 'good'], partielle: ['Partielle', 'warm'], annulee: ['Annulée', 'mute'], acceptee: ['Acceptée', 'good'], refusee: ['Refusée', 'mute'] };

export default function Invoices() {
  const s = useDB(); const nav = useNavigate(); const [params, setParams] = useSearchParams(); const [kind, setKind] = useState<'facture' | 'devis'>('facture'); const [filter, setFilter] = useState('toutes');
  const [edit, setEdit] = useState<Invoice | null>(null); const [pay, setPay] = useState<Invoice | null>(null); const [print, setPrint] = useState<Invoice | null>(null);
  const next = (k: 'facture' | 'devis') => { const pre = k === 'facture' ? s.settings.invoice_prefix : s.settings.quote_prefix; const n = s.invoices.filter((i) => i.kind === k).length + 1; return pre + String(n).padStart(3, '0'); };
  const blank = (k: 'facture' | 'devis', client_id = '', project_id?: string): Invoice => ({ id: uid(), number: next(k), kind: k, client_id, project_id, issue: new Date().toISOString().slice(0, 10), due: new Date(Date.now() + (k === 'facture' ? 15 : 30) * 864e5).toISOString().slice(0, 10), items: [{ desc: '', qty: 1, price: 0 }], tva: s.settings.tva, status: 'brouillon', payments: [] });
  useEffect(() => { const n = params.get('new'); if (n === 'facture' || n === 'devis') { setEdit(blank(n, params.get('client') || '', params.get('project') || undefined)); setKind(n); setParams({}); } const id = params.get('id'); if (id) { const f = s.invoices.find((i) => i.id === id); if (f) { setKind(f.kind); setEdit(f); } setParams({}); } }, [params]);
  const list = useMemo(() => s.invoices.filter((i) => i.kind === kind && (filter === 'toutes' || (filter === 'retard' ? isOverdue(i) : i.status === filter))).sort((a, b) => b.number.localeCompare(a.number)), [s.invoices, kind, filter]);
  const fact = s.invoices.filter((i) => i.kind === 'facture' && i.status !== 'annulee');
  const sum = (f: (i: Invoice) => number) => fact.reduce((n, i) => n + f(i), 0);
  const cname = (id: string) => { const c = s.clients.find((x) => x.id === id); return c?.company || c?.name || '—'; };
  const remind = async (i: Invoice) => { const c = s.clients.find((x) => x.id === i.client_id); const t = s.templates.find((x) => x.id === 't4'); if (c?.phone && t) { await sendWhatsApp(c.phone, fill(t.body, { prenom: c.name.split(' ')[0], facture: i.number, montant: mad(invTotals(i).due) }), 'n1', c.company || c.name); db.log('invoice', `Relance WhatsApp envoyée : ${i.number}`); alert('Relance envoyée sur WhatsApp ✓'); } };
  const toInvoice = (d: Invoice) => { const f = { ...d, id: uid(), kind: 'facture' as const, number: next('facture'), issue: new Date().toISOString().slice(0, 10), due: new Date(Date.now() + 15 * 864e5).toISOString().slice(0, 10), status: 'brouillon' as const, payments: [] }; db.insert('invoices', f); db.update('invoices', d.id, { status: 'acceptee' }); setKind('facture'); setEdit(f); };
  return (
    <div className="space-y-5 max-w-[1500px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="font-display text-[26px] tracking-[-0.03em]">Factures & devis</h1><p className="text-[13.5px] text-brume">Numérotation automatique, TVA, montant en lettres, relances et export PDF.</p></div>
        <div className="flex gap-2"><Btn kind="soft" onClick={() => downloadCSV(`${kind}s.csv`, list.map((i) => { const t = invTotals(i); return { numero: i.number, client: cname(i.client_id), date: i.issue, echeance: i.due, ht: t.ht, tva: t.tva, ttc: t.ttc, paye: t.paid, reste: t.due, statut: i.status }; }))}>CSV</Btn><Btn kind="soft" onClick={() => nav('/admin/devis-intelligent')}><Wand2 size={15} className="text-safran" />Devis intelligent</Btn><Btn kind="soft" onClick={() => setEdit(blank('devis'))}><Plus size={15} />Devis vierge</Btn><Btn kind="primary" onClick={() => setEdit(blank('facture'))}><Plus size={15} />Facture</Btn></div>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <Stat label="Facturé TTC (total)" value={mad(sum((i) => invTotals(i).ttc))} />
        <Stat label="Encaissé" value={mad(sum((i) => invTotals(i).paid))} accent="#34D399" />
        <Stat label="Reste à encaisser" value={mad(sum((i) => invTotals(i).due))} accent="#2DD4E6" />
        <Stat label="En retard" value={mad(fact.filter(isOverdue).reduce((n, i) => n + invTotals(i).due, 0))} sub={`${fact.filter(isOverdue).length} facture(s)`} accent="#FF8A7A" />
      </div>
      <div className="flex flex-wrap gap-3 items-center">
        <Tabs value={kind} onChange={(k) => { setKind(k); setFilter('toutes'); }} items={[['facture', 'Factures', s.invoices.filter((i) => i.kind === 'facture').length], ['devis', 'Devis', s.invoices.filter((i) => i.kind === 'devis').length]]} />
        <Select value={filter} onChange={(e) => setFilter(e.target.value)} className="!w-48" options={kind === 'facture' ? [['toutes', 'Tous les statuts'], ['retard', 'En retard'], ['envoyee', 'Envoyées'], ['partielle', 'Partielles'], ['payee', 'Payées'], ['brouillon', 'Brouillons']] : [['toutes', 'Tous les statuts'], ['brouillon', 'Brouillons'], ['envoyee', 'Envoyés'], ['acceptee', 'Acceptés'], ['refusee', 'Refusés']]} />
      </div>
      <Panel pad={false}>{list.length ? <div className="overflow-x-auto"><table className="w-full text-[13.5px]"><thead><tr className="text-[12px] text-white/40 border-b border-white/[0.06]">{['Numéro', 'Client', 'Date', 'Échéance', 'Montant TTC', 'Reste', 'Statut', ''].map((h) => <th key={h} className="font-normal text-start px-4 py-3">{h}</th>)}</tr></thead>
        <tbody>{list.map((i) => { const t = invTotals(i); const late = isOverdue(i); return (
          <tr key={i.id} className="border-b border-white/[0.04] hover:bg-white/[0.03]">
            <td className="px-4 py-3 font-medium cursor-pointer" onClick={() => setEdit(i)}>{i.number}</td><td className="px-4 py-3">{cname(i.client_id)}</td><td className="px-4 py-3 text-brume">{fdate(i.issue)}</td><td className={cx('px-4 py-3', late ? 'text-safran' : 'text-brume')}>{fdate(i.due)}</td>
            <td className="px-4 py-3 tabular-nums">{mad(t.ttc)}</td><td className="px-4 py-3 tabular-nums">{t.due ? mad(t.due) : '—'}</td>
            <td className="px-4 py-3"><Badge tone={late ? 'warn' : STATUS[i.status][1]}>{late ? 'En retard' : STATUS[i.status][0]}</Badge></td>
            <td className="px-4 py-3"><div className="flex justify-end gap-1">
              {i.kind === 'facture' && t.due > 0 && i.status !== 'brouillon' && <Btn title="Enregistrer un paiement" onClick={() => setPay(i)}><Wallet size={15} /></Btn>}
              {late && <Btn title="Relancer sur WhatsApp" onClick={() => remind(i)}><MessageCircle size={15} className="text-[#25D366]" /></Btn>}
              {i.kind === 'devis' && i.status !== 'acceptee' && <Btn title="Transformer en facture" onClick={() => toInvoice(i)}><CheckCircle2 size={15} /></Btn>}
              <Btn title="PDF / imprimer" onClick={() => setPrint(i)}><Printer size={15} /></Btn>
              <Btn title="Dupliquer" onClick={() => { const c = { ...i, id: uid(), number: next(i.kind), status: 'brouillon' as const, payments: [], issue: new Date().toISOString().slice(0, 10) }; db.insert('invoices', c); setEdit(c); }}><Copy size={15} /></Btn>
            </div></td>
          </tr>
        ); })}</tbody></table></div> : <Empty icon={<FileText size={20} />} title="Rien pour l’instant" text="Créez une facture ou un devis en un clic." />}</Panel>
      <Editor inv={edit} onClose={() => setEdit(null)} onPrint={(i) => setPrint(i)} />
      <PayModal inv={pay} onClose={() => setPay(null)} />
      <PrintView inv={print} onClose={() => setPrint(null)} />
    </div>
  );
}

const Editor = ({ inv, onClose, onPrint }: { inv: Invoice | null; onClose: () => void; onPrint: (i: Invoice) => void }) => {
  const s = useDB(); const [f, setF] = useState<Invoice | null>(inv); useEffect(() => setF(inv), [inv]);
  if (!f) return <Modal open={false} onClose={onClose} title="">{null}</Modal>;
  const t = invTotals(f); const exists = s.invoices.some((i) => i.id === f.id);
  const setItem = (k: number, patch: Partial<Item>) => setF({ ...f, items: f.items.map((it, j) => (j === k ? { ...it, ...patch } : it)) });
  const save = (status?: Invoice['status']) => { const x = { ...f, status: status || f.status }; if (exists) db.update('invoices', f.id, x); else db.insert('invoices', x); db.log('invoice', `${f.kind === 'facture' ? 'Facture' : 'Devis'} ${f.number} ${status === 'envoyee' ? 'envoyé(e)' : 'enregistré(e)'}`); return x; };
  const sendMail = async () => { const c = s.clients.find((x) => x.id === f.client_id); const tpl = s.templates.find((x) => x.id === 't7'); const x = save('envoyee'); if (c?.email && tpl) await sendEmail(c.email, fill(tpl.subject || '', { facture: f.number }), fill(tpl.body, { prenom: c.name.split(' ')[0], facture: f.number, montant: mad(t.ttc), echeance: fdate(f.due) }), 'Facture'); onClose(); onPrint(x); };
  const projects = s.projects.filter((p) => !f.client_id || p.client_id === f.client_id);
  return (
    <Modal open onClose={onClose} title={`${f.kind === 'facture' ? 'Facture' : 'Devis'} ${f.number}`} wide>
      <div className="grid md:grid-cols-4 gap-3">
        <Field label="Client *" className="md:col-span-2"><Select value={f.client_id} onChange={(e) => setF({ ...f, client_id: e.target.value })} options={[['', 'Choisir…'], ...s.clients.map((c) => [c.id, c.company || c.name] as [string, string])]} /></Field>
        <Field label="Projet" className="md:col-span-2"><Select value={f.project_id || ''} onChange={(e) => setF({ ...f, project_id: e.target.value || undefined })} options={[['', 'Aucun'], ...projects.map((p) => [p.id, p.name] as [string, string])]} /></Field>
        <Field label="Numéro"><Input value={f.number} onChange={(e) => setF({ ...f, number: e.target.value })} /></Field>
        <Field label="Date"><Input type="date" value={f.issue} onChange={(e) => setF({ ...f, issue: e.target.value })} /></Field>
        <Field label={f.kind === 'facture' ? 'Échéance' : 'Valable jusqu’au'}><Input type="date" value={f.due} onChange={(e) => setF({ ...f, due: e.target.value })} /></Field>
        <Field label="TVA %"><Input type="number" value={f.tva} onChange={(e) => setF({ ...f, tva: +e.target.value })} /></Field>
      </div>
      <div className="mt-5 rounded-xl ring-1 ring-white/[0.08] overflow-hidden">
        <div className="grid grid-cols-[1fr_80px_130px_120px_36px] gap-2 px-3 py-2 text-[12px] text-white/40 bg-white/[0.03]"><span>Désignation</span><span>Qté</span><span>Prix unitaire HT</span><span className="text-end">Total HT</span><span /></div>
        {f.items.map((it, k) => <div key={k} className="grid grid-cols-[1fr_80px_130px_120px_36px] gap-2 px-3 py-2 border-t border-white/[0.05] items-center"><Input value={it.desc} placeholder="Ex. Site vitrine bilingue" onChange={(e) => setItem(k, { desc: e.target.value })} /><Input type="number" value={it.qty} onChange={(e) => setItem(k, { qty: +e.target.value })} /><Input type="number" value={it.price} onChange={(e) => setItem(k, { price: +e.target.value })} /><span className="text-end tabular-nums text-[14px]">{mad(it.qty * it.price)}</span><button onClick={() => setF({ ...f, items: f.items.filter((_, j) => j !== k) })} className="text-white/40 hover:text-[#FF8A7A]"><Trash2 size={15} /></button></div>)}
        <div className="px-3 py-2 border-t border-white/[0.05]"><Btn kind="ghost" onClick={() => setF({ ...f, items: [...f.items, { desc: '', qty: 1, price: 0 }] })}><Plus size={14} />Ligne</Btn></div>
      </div>
      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <Field label="Notes (conditions, RIB, délais…)"><Area value={f.notes || ''} onChange={(e) => setF({ ...f, notes: e.target.value })} /></Field>
        <div className="rounded-xl bg-white/[0.03] ring-1 ring-white/[0.06] p-4 text-[14px] space-y-1.5 self-start">{[['Total HT', mad(t.ht)], [`TVA ${f.tva} %`, mad(t.tva)]].map(([k, v]) => <p key={k} className="flex justify-between text-white/70"><span>{k}</span><span className="tabular-nums">{v}</span></p>)}<p className="flex justify-between font-display text-[18px] pt-2 border-t border-white/10"><span>Total TTC</span><span className="tabular-nums">{mad(t.ttc)}</span></p><p className="text-[11.5px] text-white/40 pt-1">Soit {words(t.ttc)} dirhams TTC.</p></div>
      </div>
      <div className="mt-5 flex flex-wrap justify-between gap-2">
        {exists ? <Btn kind="danger" onClick={() => { if (confirm('Supprimer ?')) { db.remove('invoices', f.id); onClose(); } }}><Trash2 size={15} />Supprimer</Btn> : <span />}
        <div className="flex flex-wrap gap-2"><Btn kind="soft" onClick={() => { save(); onClose(); }}>Enregistrer</Btn><Btn kind="soft" onClick={() => onPrint(save())}><Printer size={15} />Aperçu PDF</Btn><Btn kind="primary" onClick={sendMail} disabled={!f.client_id}><Send size={15} />Envoyer au client</Btn></div>
      </div>
    </Modal>
  );
};

const PayModal = ({ inv, onClose }: { inv: Invoice | null; onClose: () => void }) => {
  const [amount, setAmount] = useState(0); const [method, setMethod] = useState('Virement'); const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  useEffect(() => { if (inv) setAmount(Math.round(invTotals(inv).due)); }, [inv]);
  if (!inv) return <Modal open={false} onClose={onClose} title="">{null}</Modal>;
  const save = () => { const payments = [...inv.payments, { date, amount, method }]; const due = invTotals({ ...inv, payments }).due; db.update('invoices', inv.id, { payments, status: due <= 0.5 ? 'payee' : 'partielle' }); db.log('invoice', `Paiement de ${mad(amount)} reçu pour ${inv.number}`); onClose(); };
  return <Modal open onClose={onClose} title={`Paiement · ${inv.number}`}><div className="grid grid-cols-2 gap-3"><Field label="Montant (MAD)"><Input type="number" value={amount} onChange={(e) => setAmount(+e.target.value)} /></Field><Field label="Date"><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field><Field label="Moyen" className="col-span-2"><Select value={method} onChange={(e) => setMethod(e.target.value)} options={['Virement', 'Chèque', 'Espèces', 'CMI (carte)', 'Effet'].map((x) => [x, x])} /></Field></div><div className="mt-5 flex justify-end"><Btn kind="primary" onClick={save}>Enregistrer le paiement</Btn></div></Modal>;
};

/* Facture imprimable : « Imprimer » → « Enregistrer au format PDF » */
const PrintView = ({ inv, onClose }: { inv: Invoice | null; onClose: () => void }) => {
  if (!inv) return null;
  const s = getDB(); const c = s.clients.find((x) => x.id === inv.client_id); const t = invTotals(inv); const S = s.settings;
  return (
    <div className="fixed inset-0 z-[100] bg-black/70 overflow-y-auto print:bg-white print:static" onMouseDown={onClose}>
      <style>{'@media print { body * { visibility: hidden !important; } #dg-invoice, #dg-invoice * { visibility: visible !important; } #dg-invoice { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none !important; margin: 0 !important; } .no-print { display: none !important; } @page { size: A4; margin: 14mm; } }'}</style>
      <div className="no-print sticky top-0 z-10 flex justify-center gap-2 py-3"><Btn kind="primary" onClick={() => window.print()}><Printer size={15} />Imprimer / PDF</Btn><Btn kind="soft" onClick={onClose}>Fermer</Btn></div>
      <div id="dg-invoice" onMouseDown={(e) => e.stopPropagation()} className="mx-auto mb-10 w-[794px] max-w-[96vw] bg-white text-[#0A1428] p-12 shadow-2xl font-sans text-[13px] leading-relaxed">
        <div className="flex justify-between items-start"><div><p className="font-display text-[26px] font-semibold tracking-[-0.04em]">digilago</p><p className="text-[#56617A] mt-1">{S.legal}<br />{S.address}<br />ICE {S.ice} · RC {S.rc} · IF {S.if_}<br />{S.email_from}</p></div><div className="text-end"><p className="font-display text-[22px] uppercase tracking-wide">{inv.kind === 'facture' ? 'Facture' : 'Devis'}</p><p className="font-semibold">{inv.number}</p><p className="text-[#56617A]">Date : {fdate(inv.issue)}<br />{inv.kind === 'facture' ? 'Échéance' : 'Validité'} : {fdate(inv.due)}</p></div></div>
        <div className="mt-8 rounded-lg bg-[#F2F4F7] p-4 w-[55%] ms-auto"><p className="text-[#56617A] text-[11px] uppercase tracking-wide">Client</p><p className="font-semibold">{c?.company || c?.name}</p><p>{c?.name}{c?.address ? <><br />{c.address}</> : null}{c?.city ? <><br />{c.city}</> : null}{c?.ice ? <><br />ICE {c.ice}</> : null}</p></div>
        <table className="mt-8 w-full"><thead><tr className="border-b-2 border-[#0A1428] text-[11.5px] uppercase tracking-wide"><th className="text-start py-2">Désignation</th><th className="text-end py-2 w-16">Qté</th><th className="text-end py-2 w-32">P.U. HT</th><th className="text-end py-2 w-32">Total HT</th></tr></thead><tbody>{inv.items.map((it, k) => <tr key={k} className="border-b border-[#E5E8EE]"><td className="py-2.5">{it.desc}</td><td className="text-end">{it.qty}</td><td className="text-end">{mad(it.price)}</td><td className="text-end">{mad(it.qty * it.price)}</td></tr>)}</tbody></table>
        <div className="mt-6 flex justify-end"><div className="w-[280px] space-y-1"><p className="flex justify-between"><span>Total HT</span><span>{mad(t.ht)}</span></p><p className="flex justify-between"><span>TVA {inv.tva} %</span><span>{mad(t.tva)}</span></p><p className="flex justify-between font-semibold text-[16px] border-t-2 border-[#0A1428] pt-2"><span>Total TTC</span><span>{mad(t.ttc)}</span></p>{t.paid > 0 && <p className="flex justify-between text-[#56617A]"><span>Déjà réglé</span><span>{mad(t.paid)}</span></p>}{t.paid > 0 && <p className="flex justify-between font-semibold"><span>Reste à payer</span><span>{mad(t.due)}</span></p>}</div></div>
        <p className="mt-6 text-[12.5px]">Arrêté{inv.kind === 'facture' ? 'e la présente facture' : ' le présent devis'} à la somme de <b>{words(t.ttc)} dirhams</b> toutes taxes comprises.</p>
        {inv.notes && <p className="mt-4 text-[12.5px] whitespace-pre-line">{inv.notes}</p>}
        <p className="mt-10 pt-4 border-t border-[#E5E8EE] text-[11px] text-[#56617A]">Règlement par virement : {S.rib}. {inv.kind === 'devis' ? 'Bon pour accord : date, signature et cachet du client.' : 'Merci pour votre confiance.'}</p>
      </div>
    </div>
  );
};
