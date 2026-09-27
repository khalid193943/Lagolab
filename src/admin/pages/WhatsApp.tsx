import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MessageCircle, Send, Search, Zap, Check, CheckCheck, Settings2, Megaphone, Bot, UserRound } from 'lucide-react';
import { useDB, db, Conversation, rel, fill, uid, now, fn, MODE } from '../store';
import { Panel, Badge, Btn, Input, Select, Field, Area, Modal, Empty, Avatar, Tabs, cx } from '../kit';

export default function WhatsApp() {
  const s = useDB(); const [num, setNum] = useState<'tous' | string>('tous'); const [q, setQ] = useState(''); const [cur, setCur] = useState<string | null>(null);
  const [text, setText] = useState(''); const [cfg, setCfg] = useState(false); const [cast, setCast] = useState(false);
  const list = useMemo(() => s.conversations.filter((c) => (num === 'tous' || c.number_id === num) && (!q || [c.name, c.phone].join(' ').toLowerCase().includes(q.toLowerCase()))).sort((a, b) => +new Date(b.messages.at(-1)?.at || 0) - +new Date(a.messages.at(-1)?.at || 0)), [s.conversations, num, q]);
  const c = s.conversations.find((x) => x.id === cur) || list[0];
  const number = (id: string) => s.numbers.find((n) => n.id === id);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { if (c?.unread) db.update('conversations', c.id, { unread: 0 }); end.current?.scrollIntoView({ behavior: 'smooth' }); }, [c?.id, c?.messages.length]);
  const lead = c && (s.leads.find((l) => l.id === c.lead_id || l.phone === c.phone));
  const client = c && s.clients.find((x) => x.id === c.client_id || x.phone === c.phone);
  const send = async (body = text) => {
    if (!c || !body.trim()) return;
    const msg = { id: uid(), dir: 'out' as const, text: body.trim(), at: now(), status: 'envoye' as const };
    db.update('conversations', c.id, { messages: [...c.messages, msg] }); setText('');
    if (MODE === 'live') { try { await fn('whatsapp-send', { number_id: c.number_id, to: c.phone, text: body.trim() }); } catch { db.update('conversations', c.id, { messages: [...c.messages, { ...msg, status: 'echec' }] }); } }
    else setTimeout(() => { const cc = s.conversations.find((x) => x.id === c.id); if (cc) db.update('conversations', c.id, { messages: [...cc.messages, { ...msg, status: 'lu' }] }); }, 50);
  };
  const vars = { prenom: (lead?.name || client?.name || c?.name || '').split(/[\s·]/)[0], entreprise: lead?.company || client?.company, ville: lead?.city || client?.city, lien: 'https://digilago.ma' };
  const quick = ['Merci pour votre message, je regarde et je reviens vers vous aujourd’hui 🙏', 'Pouvez-vous m’envoyer votre logo et quelques photos ?', 'Votre première version est prête, je vous envoie le lien 🎉', 'On s’appelle 10 minutes ? Quel créneau vous arrange ?'];
  const unreadOf = (id: string) => s.conversations.filter((x) => x.number_id === id).reduce((n, x) => n + x.unread, 0);
  return (
    <div className="space-y-4 max-w-[1600px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="font-display text-[26px] tracking-[-0.03em] flex items-center gap-2"><MessageCircle className="text-[#25D366]" />WhatsApp</h1><p className="text-[13.5px] text-brume">Deux numéros, une seule boîte de réception, des réponses automatiques et des envois groupés.</p></div>
        <div className="flex gap-2"><Btn kind="soft" onClick={() => setCast(true)}><Megaphone size={15} />Envoi groupé</Btn><Btn kind="soft" onClick={() => setCfg(true)}><Settings2 size={15} />Numéros</Btn></div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">{s.numbers.map((n) => (
        <div key={n.id} className="rounded-2xl bg-white/[0.035] ring-1 ring-white/[0.08] p-4 flex items-center gap-4"><span className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${n.color}22`, color: n.color }}><MessageCircle size={20} /></span><div className="min-w-0 flex-1"><p className="font-medium">{n.label} <span className="text-white/40 font-normal text-[13px]">{n.phone}</span></p><p className="text-[12.5px] text-brume truncate">{n.role}</p></div><div className="text-end"><Badge tone={n.connected ? 'good' : 'warn'} dot={n.connected ? '#34D399' : '#F4B53F'}>{n.connected ? 'API connectée' : MODE === 'live' ? 'À connecter' : 'Démo'}</Badge><p className="mt-1 text-[12px] text-white/45">{unreadOf(n.id)} non lu(s)</p></div></div>
      ))}</div>
      <div className="grid lg:grid-cols-[340px_1fr] xl:grid-cols-[340px_1fr_300px] gap-4 h-[calc(100svh-330px)] min-h-[520px]">
        <Panel pad={false} className="flex flex-col min-h-0">
          <div className="p-3 space-y-2 border-b border-white/[0.06]"><Tabs value={num} onChange={setNum} items={[['tous', 'Tous'], ...s.numbers.map((n) => [n.id, n.label] as [string, string])]} /><div className="relative"><Search size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-white/35" /><Input placeholder="Rechercher une conversation" value={q} onChange={(e) => setQ(e.target.value)} className="ps-9" /></div></div>
          <ul className="flex-1 overflow-y-auto">{list.map((x) => { const last = x.messages.at(-1); const n = number(x.number_id); return (
            <li key={x.id}><button onClick={() => setCur(x.id)} className={cx('w-full text-start flex gap-3 px-3 py-3 border-b border-white/[0.04]', c?.id === x.id ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]')}>
              <Avatar name={x.name} size={38} color={n?.color} /><span className="min-w-0 flex-1"><span className="flex justify-between gap-2"><span className="text-[14px] truncate">{x.name}</span><span className="shrink-0 text-[11px] text-white/40">{last && rel(last.at)}</span></span><span className="flex items-center gap-1.5 mt-0.5"><span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: n?.color }} /><span className="text-[12.5px] text-brume truncate">{last?.dir === 'out' && (last.auto ? '🤖 ' : '✓ ')}{last?.text}</span>{x.unread > 0 && <span className="ms-auto shrink-0 min-w-5 h-5 px-1.5 rounded-full bg-[#25D366] text-nuit text-[11px] font-semibold flex items-center justify-center">{x.unread}</span>}</span></span>
            </button></li>
          ); })}{!list.length && <Empty icon={<MessageCircle size={18} />} title="Aucune conversation" />}</ul>
        </Panel>
        <Panel pad={false} className="flex flex-col min-h-0">
          {c ? <>
            <header className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]"><Avatar name={c.name} size={36} color={number(c.number_id)?.color} /><div className="min-w-0"><p className="text-[14.5px] truncate">{c.name}</p><p className="text-[12px] text-brume">{c.phone} · via {number(c.number_id)?.label}</p></div></header>
            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-2 bg-[radial-gradient(rgba(255,255,255,.03)_1px,transparent_1px)] [background-size:18px_18px]">
              {c.messages.map((m) => <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={cx('flex', m.dir === 'out' ? 'justify-end' : 'justify-start')}><div className={cx('max-w-[75%] rounded-2xl px-3.5 py-2 text-[14px] leading-relaxed', m.dir === 'out' ? 'bg-[#1F5C4A] rounded-ee-md' : 'bg-white/[0.07] rounded-es-md')}><p dir="auto" className="whitespace-pre-line">{m.text}</p><p className="mt-1 flex items-center justify-end gap-1 text-[10.5px] text-white/50">{m.auto && <span className="flex items-center gap-0.5"><Bot size={11} />auto ·</span>}{new Date(m.at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}{m.dir === 'out' && (m.status === 'lu' ? <CheckCheck size={13} className="text-cyan" /> : m.status === 'echec' ? <span className="text-[#FF8A7A]">échec</span> : <Check size={13} />)}</p></div></motion.div>)}
              <div ref={end} />
            </div>
            <div className="px-3 pt-2 flex gap-2 overflow-x-auto">{quick.map((x) => <button key={x} onClick={() => setText(x)} className="shrink-0 h-8 px-3 rounded-full ring-1 ring-white/10 text-[12.5px] text-white/70 hover:text-white hover:ring-white/25 max-w-[260px] truncate">{x}</button>)}</div>
            <div className="p-3 flex gap-2 items-end">
              <Select className="!w-44 shrink-0" value="" onChange={(e) => { const t = s.templates.find((x) => x.id === e.target.value); if (t) setText(fill(t.body, vars)); }} options={[['', 'Modèles…'], ...s.templates.filter((t) => t.channel === 'whatsapp').map((t) => [t.id, t.name] as [string, string])]} />
              <textarea value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} rows={1} dir="auto" placeholder="Écrire un message… (Entrée pour envoyer)" className="flex-1 min-h-10 max-h-40 rounded-xl bg-nuit/70 ring-1 ring-white/10 px-3 py-2.5 text-[14px] resize-none focus:outline-none focus:ring-cyan/60" />
              <button onClick={() => send()} className="w-10 h-10 shrink-0 rounded-full bg-[#25D366] text-nuit flex items-center justify-center" aria-label="Envoyer"><Send size={17} /></button>
            </div>
          </> : <Empty icon={<MessageCircle size={20} />} title="Choisissez une conversation" />}
        </Panel>
        {c && <Panel className="hidden xl:block overflow-y-auto" title="Contact">
          <div className="text-center"><Avatar name={c.name} size={56} color={number(c.number_id)?.color} /><p className="mt-3 font-medium">{c.name}</p><p className="text-[13px] text-brume">{c.phone}</p></div>
          <div className="mt-5 space-y-2 text-[13px]">{lead && <Link to={`/admin/demandes?id=${lead.id}`} className="flex items-center gap-2 rounded-xl bg-white/[0.04] p-3 hover:bg-white/[0.07]"><Zap size={15} className="text-safran" />Demande : {lead.company || lead.name}</Link>}{client && <Link to={`/admin/clients?id=${client.id}`} className="flex items-center gap-2 rounded-xl bg-white/[0.04] p-3 hover:bg-white/[0.07]"><UserRound size={15} className="text-cyan" />Client : {client.company || client.name}</Link>}{!lead && !client && <Btn kind="soft" className="w-full" onClick={() => db.insert('leads', { id: uid(), created_at: now(), name: c.name.split('·')[0].trim(), phone: c.phone, source: 'whatsapp', status: 'nouveau', notes: [], message: c.messages.filter((m) => m.dir === 'in').map((m) => m.text).join('\n') })}>Créer une demande</Btn>}</div>
          <p className="mt-5 text-[12px] text-white/40">Étiquettes</p><div className="mt-2 flex flex-wrap gap-1.5">{['Chaud', 'Client', 'Projet en cours', 'Facture', 'À rappeler'].map((t) => <button key={t} onClick={() => db.update('conversations', c.id, { tags: c.tags.includes(t) ? c.tags.filter((x) => x !== t) : [...c.tags, t] })} className={cx('h-7 px-2.5 rounded-full text-[12px] ring-1', c.tags.includes(t) ? 'bg-safran text-nuit ring-transparent' : 'ring-white/12 text-white/60')}>{t}</button>)}</div>
          <p className="mt-5 text-[12px] text-white/40">Transférer vers</p><Select className="mt-2" value={c.number_id} onChange={(e) => db.update('conversations', c.id, { number_id: e.target.value })} options={s.numbers.map((n) => [n.id, n.label])} />
        </Panel>}
      </div>
      <NumbersModal open={cfg} onClose={() => setCfg(false)} />
      <Broadcast open={cast} onClose={() => setCast(false)} />
    </div>
  );
}

const NumbersModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const s = useDB();
  return (
    <Modal open={open} onClose={onClose} title="Vos deux numéros WhatsApp" wide>
      <p className="text-[13.5px] text-brume">Chaque numéro est relié à l’API WhatsApp Cloud (Meta). Les identifiants secrets restent sur le serveur (Supabase) : ici, seuls le nom, le rôle et les réponses automatiques se règlent.</p>
      <div className="mt-5 grid md:grid-cols-2 gap-4">{s.numbers.map((n) => (
        <div key={n.id} className="rounded-2xl ring-1 ring-white/10 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3"><Field label="Nom"><Input value={n.label} onChange={(e) => db.update('numbers', n.id, { label: e.target.value })} /></Field><Field label="Numéro"><Input value={n.phone} onChange={(e) => db.update('numbers', n.id, { phone: e.target.value })} /></Field></div>
          <Field label="Rôle"><Input value={n.role} onChange={(e) => db.update('numbers', n.id, { role: e.target.value })} /></Field>
          <Field label="Phone number ID (Meta)"><Input value={n.phone_number_id || ''} placeholder="Ex. 1234567890123" onChange={(e) => db.update('numbers', n.id, { phone_number_id: e.target.value })} /></Field>
          <label className="flex items-center gap-2 text-[13.5px]"><input type="checkbox" checked={!!n.hours} onChange={(e) => db.update('numbers', n.id, { hours: e.target.checked })} className="accent-[#F4B53F] w-4 h-4" />Réponse automatique hors horaires (lun–sam, 9 h–19 h)</label>
          <Field label="Message hors horaires"><Area value={n.away || ''} onChange={(e) => db.update('numbers', n.id, { away: e.target.value })} rows={3} /></Field>
        </div>
      ))}</div>
    </Modal>
  );
};

const Broadcast = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const s = useDB(); const [seg, setSeg] = useState('clients'); const [num, setNum] = useState(s.numbers[0]?.id); const [tid, setTid] = useState(''); const [done, setDone] = useState(0);
  const targets = seg === 'clients' ? s.clients.filter((c) => c.phone).map((c) => ({ name: c.company || c.name, phone: c.phone!, prenom: c.name.split(' ')[0] })) : s.leads.filter((l) => l.phone && (seg === 'ouvertes' ? !['gagne', 'perdu'].includes(l.status) : l.status === 'nouveau')).map((l) => ({ name: `${l.name} · ${l.company || ''}`, phone: l.phone!, prenom: l.name.split(' ')[0] }));
  const tpl = s.templates.find((t) => t.id === tid);
  const go = async () => { if (!tpl) return; for (const t of targets) { const conv = s.conversations.find((c) => c.phone === t.phone && c.number_id === num); const msg = { id: uid(), dir: 'out' as const, text: fill(tpl.body, { prenom: t.prenom }), at: now(), status: 'envoye' as const }; if (conv) db.update('conversations', conv.id, { messages: [...conv.messages, msg] }); else db.insert('conversations', { id: uid(), number_id: num, name: t.name, phone: t.phone, unread: 0, tags: [], messages: [msg] }); if (MODE === 'live') await fn('whatsapp-send', { number_id: num, to: t.phone, template: tpl.name, text: msg.text }).catch(() => null); } setDone(targets.length); db.log('wa', `Envoi groupé « ${tpl.name} » : ${targets.length} destinataires`); };
  return (
    <Modal open={open} onClose={() => { setDone(0); onClose(); }} title="Envoi groupé WhatsApp">
      {done ? <p className="py-6 text-center">✓ {done} messages envoyés.</p> : <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3"><Field label="Destinataires"><Select value={seg} onChange={(e) => setSeg(e.target.value)} options={[['clients', 'Tous les clients'], ['ouvertes', 'Demandes en cours'], ['nouvelles', 'Nouvelles demandes']]} /></Field><Field label="Depuis"><Select value={num} onChange={(e) => setNum(e.target.value)} options={s.numbers.map((n) => [n.id, n.label])} /></Field></div>
        <Field label="Modèle approuvé"><Select value={tid} onChange={(e) => setTid(e.target.value)} options={[['', 'Choisir…'], ...s.templates.filter((t) => t.channel === 'whatsapp').map((t) => [t.id, t.name] as [string, string])]} /></Field>
        {tpl && <p className="rounded-xl bg-[#1F5C4A]/60 p-3 text-[13.5px]">{fill(tpl.body, { prenom: targets[0]?.prenom || 'Prénom' })}</p>}
        <p className="text-[12.5px] text-brume">{targets.length} destinataire(s). Rappel : hors fenêtre de 24 h, WhatsApp n’autorise que les modèles approuvés par Meta, et seulement pour des contacts qui ont accepté d’être contactés.</p>
        <div className="flex justify-end"><Btn kind="primary" onClick={go} disabled={!tpl || !targets.length}><Send size={15} />Envoyer à {targets.length}</Btn></div>
      </div>}
    </Modal>
  );
};
