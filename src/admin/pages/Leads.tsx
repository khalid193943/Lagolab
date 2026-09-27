import { useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Wand2, Inbox, LayoutList, Columns3, Phone, Mail, MessageCircle, Download, UserPlus, Trash2, Flame, Send, Plus } from 'lucide-react';
import { useDB, db, Lead, LeadStatus, scoreLead, heat, rel, fdate, mad, uid, now, fill, fn, MODE, getDB } from '../store';
import { Panel, Badge, Btn, Tabs, Drawer, Empty, Avatar, Input, Select, Area, Field, Modal, downloadCSV, cx } from '../kit';

export const LSTAT: [LeadStatus, string, string][] = [['nouveau', 'Nouvelle', '#FF9A80'], ['contacte', 'Contactée', '#F4B53F'], ['version', '1re version', '#FFD37A'], ['devis', 'Devis envoyé', '#2DD4E6'], ['gagne', 'Gagnée', '#34D399'], ['perdu', 'Perdue', '#64748B']];
const st = (x: LeadStatus) => LSTAT.find((s) => s[0] === x)!;

/* Envoi WhatsApp : production = fonction serveur (API WhatsApp Cloud), démo = conversation locale */
export const sendWhatsApp = async (phone: string, text: string, number_id: string, name: string, lead_id?: string) => {
  const s = getDB(); const conv = s.conversations.find((c) => c.phone === phone && c.number_id === number_id);
  const msg = { id: uid(), dir: 'out' as const, text, at: now(), status: 'envoye' as const };
  if (conv) db.update('conversations', conv.id, { messages: [...conv.messages, msg] }); else db.insert('conversations', { id: uid(), number_id, name, phone, lead_id, unread: 0, tags: [], messages: [msg] });
  if (MODE === 'live') await fn('whatsapp-send', { number_id, to: phone, text }).catch(() => null);
};
export const sendEmail = async (to: string, subject: string, body: string, ref?: string) => {
  db.insert('emails', { id: uid(), at: now(), to, subject, status: 'envoye', ref });
  if (MODE === 'live') await fn('email-send', { to, subject, body }).catch(() => null);
};

export default function Leads() {
  const s = useDB(); const [params, setParams] = useSearchParams(); const nav = useNavigate();
  const [view, setView] = useState<'liste' | 'kanban'>('liste'); const [tab, setTab] = useState<'ouvertes' | LeadStatus | 'toutes'>('ouvertes'); const [q, setQ] = useState(''); const [add, setAdd] = useState(false);
  const open = s.leads.find((l) => l.id === params.get('id'));
  const list = useMemo(() => s.leads.filter((l) => (tab === 'toutes' ? true : tab === 'ouvertes' ? !['gagne', 'perdu'].includes(l.status) : l.status === tab) && (!q || [l.name, l.company, l.city, l.sector, l.phone, l.email, l.message].join(' ').toLowerCase().includes(q.toLowerCase()))).sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)), [s.leads, tab, q]);
  const counts = (x: LeadStatus) => s.leads.filter((l) => l.status === x).length;
  const move = (l: Lead, status: LeadStatus) => { db.update('leads', l.id, { status }); db.log('lead', `${l.company || l.name} → ${st(status)[1]}`); };
  return (
    <div className="space-y-5 max-w-[1500px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="font-display text-[26px] tracking-[-0.03em]">Demandes</h1><p className="text-[13.5px] text-brume">Tout ce qui arrive du site, du chat, du simulateur et de WhatsApp, classé par priorité.</p></div>
        <div className="flex items-center gap-2"><Btn kind="soft" onClick={() => downloadCSV('demandes.csv', list.map((l) => ({ date: fdate(l.created_at), nom: l.name, entreprise: l.company, ville: l.city, secteur: l.sector, telephone: l.phone, email: l.email, source: l.source, statut: st(l.status)[1], score: scoreLead(l), message: l.message })))}><Download size={15} />CSV</Btn><Btn kind="primary" onClick={() => setAdd(true)}><Plus size={15} />Ajouter</Btn></div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Tabs value={tab} onChange={setTab} items={[['ouvertes', 'En cours', s.leads.filter((l) => !['gagne', 'perdu'].includes(l.status)).length], ...LSTAT.map(([k, l]) => [k, l, counts(k)] as [LeadStatus, string, number]), ['toutes', 'Toutes', s.leads.length]]} />
        <Input placeholder="Rechercher…" value={q} onChange={(e) => setQ(e.target.value)} className="!w-56" />
        <div className="ms-auto inline-flex rounded-lg ring-1 ring-white/10 p-0.5"><button onClick={() => setView('liste')} className={cx('h-8 w-9 rounded-md flex items-center justify-center', view === 'liste' && 'bg-white/10')} aria-label="Liste"><LayoutList size={16} /></button><button onClick={() => setView('kanban')} className={cx('h-8 w-9 rounded-md flex items-center justify-center', view === 'kanban' && 'bg-white/10')} aria-label="Kanban"><Columns3 size={16} /></button></div>
      </div>

      {view === 'liste' ? (
        <Panel pad={false}>
          {list.length ? <div className="overflow-x-auto"><table className="w-full text-[13.5px]"><thead><tr className="text-start text-[12px] text-white/40 border-b border-white/[0.06]">{['Demande', 'Ville · secteur', 'Source', 'Score', 'Statut', 'Reçue'].map((h) => <th key={h} className="font-normal text-start px-4 py-3">{h}</th>)}</tr></thead>
            <tbody>{list.map((l, i) => { const sc = scoreLead(l); const h = heat(sc); return (
              <motion.tr key={l.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(i, 12) * 0.02 }} onClick={() => setParams({ id: l.id })} className="border-b border-white/[0.04] hover:bg-white/[0.03] cursor-pointer">
                <td className="px-4 py-3"><div className="flex items-center gap-3"><Avatar name={l.company || l.name} size={32} /><div className="min-w-0"><p className="truncate max-w-[220px]">{l.company || l.name}</p><p className="text-[12px] text-brume truncate max-w-[220px]">{l.name}</p></div>{l.status === 'nouveau' && <span className="w-2 h-2 rounded-full bg-[#FF9A80] animate-pulse" />}</div></td>
                <td className="px-4 py-3 text-white/75">{l.city || '—'}<span className="block text-[12px] text-brume">{l.sector}</span></td>
                <td className="px-4 py-3"><Badge>{l.source}</Badge></td>
                <td className="px-4 py-3"><Badge tone={h.tone}>{h.tone === 'hot' && <Flame size={12} />}{sc} · {h.label}</Badge></td>
                <td className="px-4 py-3"><Badge dot={st(l.status)[2]}>{st(l.status)[1]}</Badge></td>
                <td className="px-4 py-3 text-brume whitespace-nowrap">{rel(l.created_at)}</td>
              </motion.tr>
            ); })}</tbody></table></div> : <Empty icon={<Inbox size={20} />} title="Aucune demande ici" text="Les demandes du site arrivent automatiquement dans cette liste." />}
        </Panel>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-3">{LSTAT.map(([k, label, color]) => { const col = s.leads.filter((l) => l.status === k && (!q || [l.name, l.company, l.city].join(' ').toLowerCase().includes(q.toLowerCase()))); return (
          <div key={k} className="w-[280px] shrink-0 rounded-2xl bg-white/[0.025] ring-1 ring-white/[0.06] p-3" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { const id = e.dataTransfer.getData('id'); const l = s.leads.find((x) => x.id === id); if (l) move(l, k); }}>
            <p className="flex items-center gap-2 px-1 pb-3 text-[13px]"><span className="w-2 h-2 rounded-full" style={{ background: color }} />{label}<span className="ms-auto text-white/40 tabular-nums">{col.length}</span></p>
            <div className="space-y-2 min-h-[80px]">{col.map((l) => { const sc = scoreLead(l); return (
              <motion.div layout key={l.id} draggable onDragStart={(e: any) => e.dataTransfer.setData('id', l.id)} onClick={() => setParams({ id: l.id })} className="rounded-xl bg-[#0D1830] ring-1 ring-white/[0.07] p-3 cursor-grab active:cursor-grabbing hover:ring-white/20">
                <div className="flex items-start justify-between gap-2"><p className="text-[13.5px] font-medium leading-snug">{l.company || l.name}</p><Badge tone={heat(sc).tone}>{sc}</Badge></div>
                <p className="mt-1 text-[12px] text-brume">{l.city} · {l.sector}</p>
                <p className="mt-2 text-[11.5px] text-white/40 flex justify-between"><span>{l.source}</span><span>{rel(l.created_at)}</span></p>
              </motion.div>
            ); })}</div>
          </div>
        ); })}</div>
      )}
      <LeadDrawer lead={open} onClose={() => setParams({})} onMove={move} onGo={nav} />
      <AddLead open={add} onClose={() => setAdd(false)} />
    </div>
  );
}

const LeadDrawer = ({ lead, onClose, onMove, onGo }: { lead?: Lead; onClose: () => void; onMove: (l: Lead, s: LeadStatus) => void; onGo: (to: string) => void }) => {
  const s = useDB(); const [note, setNote] = useState(''); const [reply, setReply] = useState<null | 'whatsapp' | 'email'>(null);
  if (!lead) return <Drawer open={false} onClose={onClose} title="">{null}</Drawer>;
  const l = s.leads.find((x) => x.id === lead.id) || lead; const sc = scoreLead(l); const h = heat(sc);
  const convert = () => {
    const c = db.insert('clients', { id: uid(), created_at: now(), name: l.name, company: l.company, email: l.email, phone: l.phone, city: l.city, sector: l.sector });
    const p = db.insert('projects', { id: uid(), created_at: now(), client_id: c.id, name: `${l.company || l.name} : site web`, type: 'Site vitrine', stage: 'cadrage', budget: l.value || 15000, start: now().slice(0, 10), due: new Date(Date.now() + 21 * 864e5).toISOString().slice(0, 10), tasks: [{ id: uid(), title: 'Appel de cadrage', done: false }, { id: uid(), title: 'Première version (72 h)', done: false }, { id: uid(), title: 'Devis', done: false }] });
    db.update('leads', l.id, { status: 'gagne', client_id: c.id }); db.log('client', `${l.company || l.name} est devenu client · projet créé`, '/admin/projets');
    onGo(`/admin/projets?id=${p.id}`);
  };
  return (
    <Drawer open={!!lead} onClose={onClose}
      title={<div className="flex items-center gap-3"><Avatar name={l.company || l.name} size={44} /><div className="min-w-0"><p className="font-display text-[19px] truncate">{l.company || l.name}</p><p className="text-[13px] text-brume truncate">{l.name} · {l.city} · reçue {rel(l.created_at)}</p></div></div>}
      footer={<><Btn kind="danger" onClick={() => { if (confirm('Supprimer cette demande ?')) { db.remove('leads', l.id); onClose(); } }}><Trash2 size={15} /></Btn><Btn kind="soft" onClick={() => onGo(`/admin/devis-intelligent?lead=${l.id}`)}><Wand2 size={15} className="text-safran" />Devis intelligent</Btn>{!l.client_id && <Btn kind="soft" onClick={convert}><UserPlus size={15} />Client + projet</Btn>}<Btn kind="primary" onClick={() => setReply('whatsapp')}><MessageCircle size={15} />Répondre</Btn></>}>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">{LSTAT.map(([k, label, color]) => <button key={k} onClick={() => onMove(l, k)} className={cx('h-8 px-3 rounded-full text-[12.5px] ring-1 transition', l.status === k ? 'text-nuit font-medium ring-transparent' : 'ring-white/12 text-white/65 hover:text-white')} style={l.status === k ? { background: color } : undefined}>{label}</button>)}</div>
        <div className="rounded-2xl bg-white/[0.03] ring-1 ring-white/[0.07] p-4 flex items-center gap-4">
          <div className="relative w-16 h-16 shrink-0"><svg viewBox="0 0 36 36" className="w-full h-full -rotate-90"><circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="3" /><motion.circle cx="18" cy="18" r="15.5" fill="none" stroke={h.tone === 'hot' ? '#FF9A80' : h.tone === 'warm' ? '#F4B53F' : '#64748B'} strokeWidth="3" strokeLinecap="round" strokeDasharray="97.4" initial={{ strokeDashoffset: 97.4 }} animate={{ strokeDashoffset: 97.4 - (sc / 100) * 97.4 }} transition={{ duration: 1 }} /></svg><span className="absolute inset-0 flex items-center justify-center font-display text-[17px]">{sc}</span></div>
          <div className="text-[13px]"><p className="font-medium">Priorité : {h.label}</p><p className="text-brume mt-0.5">Calculée sur les coordonnées, le secteur, la ville, la source et le contenu du message.{l.value ? ` Valeur estimée : ${mad(l.value)}.` : ''}</p></div>
        </div>
        <dl className="grid grid-cols-2 gap-3 text-[13.5px]">{[['Téléphone', l.phone, Phone], ['E-mail', l.email, Mail], ['Secteur', l.sector], ['Source', l.source]].map(([k, v, I]: any) => <div key={k} className="rounded-xl bg-white/[0.03] ring-1 ring-white/[0.06] p-3"><dt className="text-[11.5px] text-white/40">{k}</dt><dd className="mt-1 flex items-center gap-2 break-all">{I && v && <I size={13} className="text-cyan shrink-0" />}{v || '—'}</dd></div>)}</dl>
        {l.message && <div><p className="text-[12px] text-white/40 mb-2">Message</p><p className="rounded-xl bg-white/[0.03] ring-1 ring-white/[0.06] p-4 text-[14px] leading-relaxed">{l.message}</p></div>}
        <Field label="Prochaine action"><Input type="datetime-local" value={l.next_at ? l.next_at.slice(0, 16) : ''} onChange={(e) => db.update('leads', l.id, { next_at: e.target.value ? new Date(e.target.value).toISOString() : undefined })} /></Field>
        <div><p className="text-[12px] text-white/40 mb-2">Notes et historique</p>
          <div className="flex gap-2"><Input placeholder="Ajouter une note (appel, remarque…)" value={note} onChange={(e) => setNote(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && note.trim()) { db.update('leads', l.id, { notes: [{ at: now(), text: note.trim() }, ...l.notes] }); setNote(''); } }} /><Btn kind="soft" onClick={() => { if (note.trim()) { db.update('leads', l.id, { notes: [{ at: now(), text: note.trim() }, ...l.notes] }); setNote(''); } }}>Ajouter</Btn></div>
          <ul className="mt-3 space-y-2">{l.notes.map((n, k) => <li key={k} className="text-[13.5px] border-s-2 border-safran/60 ps-3"><p>{n.text}</p><p className="text-[11.5px] text-white/40">{rel(n.at)}</p></li>)}<li className="text-[12.5px] text-white/40 border-s-2 border-white/10 ps-3">Demande reçue le {fdate(l.created_at)} via {l.source}</li></ul>
        </div>
        <div className="flex gap-2"><Btn kind="soft" onClick={() => setReply('email')} disabled={!l.email}><Mail size={15} />E-mail</Btn>{l.phone && <a href={`tel:${l.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-2 h-9 px-3.5 rounded-lg bg-white/[0.06] ring-1 ring-white/10 text-[13.5px]"><Phone size={15} />Appeler</a>}</div>
      </div>
      <Reply lead={l} channel={reply} onClose={() => setReply(null)} />
    </Drawer>
  );
};

/* Réponse rapide avec modèles et variables remplies automatiquement */
const Reply = ({ lead, channel, onClose }: { lead: Lead; channel: null | 'whatsapp' | 'email'; onClose: () => void }) => {
  const s = useDB(); const tpls = s.templates.filter((t) => t.channel === channel);
  const vars = { prenom: lead.name.split(' ')[0], entreprise: lead.company, ville: lead.city, lien: 'https://digilago.ma' };
  const [tid, setTid] = useState(''); const [num, setNum] = useState(s.numbers[0]?.id); const [text, setText] = useState(''); const [subject, setSubject] = useState(''); const [sent, setSent] = useState(false);
  const pick = (id: string) => { setTid(id); const t = s.templates.find((x) => x.id === id); if (t) { setText(fill(t.body, vars)); setSubject(fill(t.subject || '', vars)); } };
  const send = async () => {
    if (channel === 'whatsapp' && lead.phone) await sendWhatsApp(lead.phone, text, num, `${lead.name} · ${lead.company || ''}`, lead.id);
    if (channel === 'email' && lead.email) await sendEmail(lead.email, subject, text, s.templates.find((t) => t.id === tid)?.name);
    if (lead.status === 'nouveau') db.update('leads', lead.id, { status: 'contacte' });
    db.update('leads', lead.id, { notes: [{ at: now(), text: `${channel === 'whatsapp' ? 'WhatsApp' : 'E-mail'} envoyé : « ${text.slice(0, 80)}… »` }, ...lead.notes] });
    setSent(true); setTimeout(() => { setSent(false); setText(''); onClose(); }, 1200);
  };
  return (
    <Modal open={!!channel} onClose={onClose} title={channel === 'whatsapp' ? `WhatsApp à ${lead.name}` : `E-mail à ${lead.name}`}>
      <div className="space-y-4">
        {channel === 'whatsapp' && <Field label="Envoyer depuis"><Select value={num} onChange={(e) => setNum(e.target.value)} options={s.numbers.map((n) => [n.id, `${n.label} · ${n.phone}`])} /></Field>}
        <Field label="Modèle"><Select value={tid} onChange={(e) => pick(e.target.value)} options={[['', 'Choisir un modèle…'], ...tpls.map((t) => [t.id, `${t.name} (${t.lang.toUpperCase()})`] as [string, string])]} /></Field>
        {channel === 'email' && <Field label="Objet"><Input value={subject} onChange={(e) => setSubject(e.target.value)} /></Field>}
        <Field label="Message"><Area value={text} onChange={(e) => setText(e.target.value)} rows={6} dir="auto" /></Field>
        <div className="flex justify-end"><Btn kind="primary" onClick={send} disabled={!text.trim()}><Send size={15} />{sent ? 'Envoyé ✓' : 'Envoyer'}</Btn></div>
      </div>
    </Modal>
  );
};

const AddLead = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [f, setF] = useState({ name: '', company: '', phone: '', email: '', city: '', sector: '', message: '', source: 'manuel' });
  const save = () => { if (!f.name) return; db.insert('leads', { id: uid(), created_at: now(), ...f, status: 'nouveau', notes: [] }); db.log('lead', `Demande ajoutée : ${f.company || f.name}`); onClose(); setF({ name: '', company: '', phone: '', email: '', city: '', sector: '', message: '', source: 'manuel' }); };
  return (
    <Modal open={open} onClose={onClose} title="Nouvelle demande">
      <div className="grid sm:grid-cols-2 gap-3">
        {([['name', 'Nom *'], ['company', 'Entreprise'], ['phone', 'Téléphone'], ['email', 'E-mail'], ['city', 'Ville'], ['sector', 'Secteur']] as const).map(([k, l]) => <Field key={k} label={l}><Input value={(f as any)[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} /></Field>)}
        <Field label="Source" className="sm:col-span-2"><Select value={f.source} onChange={(e) => setF({ ...f, source: e.target.value })} options={[['manuel', 'Saisie manuelle'], ['téléphone', 'Appel téléphonique'], ['whatsapp', 'WhatsApp'], ['recommandation', 'Recommandation'], ['salon', 'Salon / événement']]} /></Field>
        <Field label="Message" className="sm:col-span-2"><Area value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} /></Field>
      </div>
      <div className="mt-5 flex justify-end"><Btn kind="primary" onClick={save}>Enregistrer</Btn></div>
    </Modal>
  );
};
