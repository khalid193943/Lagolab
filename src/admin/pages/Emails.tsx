import { useState } from 'react';
import { Mail, Users, Send, FileText, Download, Plus, Trash2, Eye, MousePointerClick } from 'lucide-react';
import { useDB, db, Campaign, Template, fdate, rel, uid, now, fn, MODE, fill } from '../store';
import { Panel, Badge, Btn, Tabs, Input, Select, Field, Area, Modal, Empty, Stat, downloadCSV } from '../kit';

export default function Emails() {
  const s = useDB(); const [tab, setTab] = useState<'newsletter' | 'campagnes' | 'modeles' | 'journal'>('newsletter');
  const active = s.subscribers.filter((x) => x.status === 'actif');
  const sent = s.campaigns.filter((c) => c.status === 'envoyee'); const rec = sent.reduce((n, c) => n + (c.recipients || 0), 0);
  const open = rec ? sent.reduce((n, c) => n + (c.opens || 0), 0) / rec : 0; const click = rec ? sent.reduce((n, c) => n + (c.clicks || 0), 0) / rec : 0;
  return (
    <div className="space-y-5 max-w-[1500px] mx-auto">
      <div><h1 className="font-display text-[26px] tracking-[-0.03em]">E-mails & newsletter</h1><p className="text-[13.5px] text-brume">Inscrits du site, campagnes, modèles d’e-mails et de WhatsApp, et journal des envois.</p></div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4"><Stat label="Abonnés actifs" value={String(active.length)} sub={`+${s.subscribers.filter((x) => Date.now() - +new Date(x.created_at) < 30 * 864e5).length} ce mois`} /><Stat label="Taux d’ouverture moyen" value={`${Math.round(open * 100)} %`} accent="#2DD4E6" /><Stat label="Taux de clic moyen" value={`${Math.round(click * 100)} %`} accent="#8B9CFF" /><Stat label="E-mails envoyés" value={String(s.emails.length + rec)} accent="#34D399" /></div>
      <Tabs value={tab} onChange={setTab} items={[['newsletter', 'Abonnés', active.length], ['campagnes', 'Campagnes', s.campaigns.length], ['modeles', 'Modèles', s.templates.length], ['journal', 'Journal', s.emails.length]]} />
      {tab === 'newsletter' && <Subscribers />}
      {tab === 'campagnes' && <Campaigns />}
      {tab === 'modeles' && <Templates />}
      {tab === 'journal' && <Panel pad={false}>{s.emails.length ? <table className="w-full text-[13.5px]"><tbody>{s.emails.map((e) => <tr key={e.id} className="border-t border-white/[0.05]"><td className="px-5 py-2.5 text-brume w-36">{rel(e.at)}</td><td className="px-5 py-2.5">{e.to}</td><td className="px-5 py-2.5">{e.subject}</td><td className="px-5 py-2.5 text-brume">{e.ref}</td><td className="px-5 py-2.5"><Badge tone={e.status === 'echec' ? 'hot' : 'good'}>{e.status}</Badge></td></tr>)}</tbody></table> : <Empty icon={<Mail size={20} />} title="Aucun e-mail envoyé pour l’instant" text="Les e-mails automatiques et manuels apparaîtront ici." />}</Panel>}
    </div>
  );
}

const Subscribers = () => {
  const s = useDB(); const [q, setQ] = useState(''); const [imp, setImp] = useState(false); const [raw, setRaw] = useState('');
  const list = s.subscribers.filter((x) => !q || [x.email, x.name, x.city, x.source].join(' ').toLowerCase().includes(q.toLowerCase()));
  const doImport = () => { const emails = Array.from(new Set(raw.match(/[^\s,;<>"]+@[^\s,;<>"]+\.[a-z]{2,}/gi) || [])); emails.filter((e) => !s.subscribers.some((x) => x.email === e)).forEach((email) => db.insert('subscribers', { id: uid(), created_at: now(), email, lang: 'fr', source: 'import', status: 'actif' })); setImp(false); setRaw(''); db.log('newsletter', `${emails.length} adresse(s) importée(s)`); };
  return (
    <Panel pad={false}>
      <div className="flex flex-wrap gap-2 p-4 border-b border-white/[0.06]"><Input placeholder="Rechercher…" value={q} onChange={(e) => setQ(e.target.value)} className="!w-64" /><div className="ms-auto flex gap-2"><Btn kind="soft" onClick={() => setImp(true)}><Plus size={15} />Importer</Btn><Btn kind="soft" onClick={() => downloadCSV('abonnes.csv', list.map((x) => ({ email: x.email, langue: x.lang, source: x.source, ville: x.city, statut: x.status, inscription: fdate(x.created_at) })))}><Download size={15} />CSV</Btn></div></div>
      <div className="overflow-x-auto max-h-[60vh]"><table className="w-full text-[13.5px]"><thead className="sticky top-0 bg-[#0B1528]"><tr className="text-[12px] text-white/40">{['E-mail', 'Langue', 'Source', 'Ville', 'Inscription', 'Statut', ''].map((h) => <th key={h} className="font-normal text-start px-4 py-3">{h}</th>)}</tr></thead>
        <tbody>{list.map((x) => <tr key={x.id} className="border-t border-white/[0.04]"><td className="px-4 py-2.5">{x.email}</td><td className="px-4 py-2.5 uppercase text-brume">{x.lang}</td><td className="px-4 py-2.5 text-brume">{x.source}</td><td className="px-4 py-2.5 text-brume">{x.city || '—'}</td><td className="px-4 py-2.5 text-brume">{fdate(x.created_at)}</td><td className="px-4 py-2.5"><button onClick={() => db.update('subscribers', x.id, { status: x.status === 'actif' ? 'desinscrit' : 'actif' })}><Badge tone={x.status === 'actif' ? 'good' : 'mute'}>{x.status === 'actif' ? 'Actif' : 'Désinscrit'}</Badge></button></td><td className="px-3"><button onClick={() => db.remove('subscribers', x.id)} className="text-white/30 hover:text-[#FF8A7A]"><Trash2 size={14} /></button></td></tr>)}</tbody></table></div>
      <Modal open={imp} onClose={() => setImp(false)} title="Importer des abonnés"><p className="text-[13.5px] text-brume">Collez une liste d’adresses (une par ligne, ou un export CSV). Seules les personnes qui ont accepté de recevoir vos e-mails doivent être importées.</p><Area className="mt-3" rows={8} value={raw} onChange={(e) => setRaw(e.target.value)} placeholder={'contact@exemple.ma\nnom@entreprise.ma'} /><div className="mt-4 flex justify-end"><Btn kind="primary" onClick={doImport}>Importer</Btn></div></Modal>
    </Panel>
  );
};

const SEGMENTS: [string, string][] = [['tous', 'Tous les abonnés actifs'], ['fr', 'Abonnés francophones'], ['ar', 'Abonnés arabophones'], ['en', 'Abonnés anglophones'], ['clients', 'Clients (e-mail connu)']];
const Campaigns = () => {
  const s = useDB(); const [edit, setEdit] = useState<Campaign | null>(null); const [preview, setPreview] = useState(false);
  const count = (seg: string) => seg === 'clients' ? s.clients.filter((c) => c.email).length : s.subscribers.filter((x) => x.status === 'actif' && (seg === 'tous' || x.lang === seg)).length;
  const send = async (c: Campaign) => {
    const n = count(c.segment); const upd = { ...c, status: 'envoyee' as const, sent_at: now(), recipients: n, opens: 0, clicks: 0 };
    if (s.campaigns.some((x) => x.id === c.id)) db.update('campaigns', c.id, upd); else db.insert('campaigns', upd);
    if (MODE === 'live') await fn('email-send', { campaign: upd }).catch(() => null);
    db.log('newsletter', `Campagne « ${c.subject} » envoyée à ${n} destinataires`); setEdit(null);
  };
  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Btn kind="primary" onClick={() => setEdit({ id: uid(), created_at: now(), subject: '', body: 'Bonjour,\n\n…\n\nL’équipe Digilago', segment: 'tous', status: 'brouillon' })}><Plus size={15} />Nouvelle campagne</Btn></div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{s.campaigns.map((c) => (
        <button key={c.id} onClick={() => setEdit(c)} className="text-start rounded-2xl bg-white/[0.035] ring-1 ring-white/[0.08] p-5 hover:ring-white/20">
          <div className="flex justify-between gap-3"><p className="font-medium leading-snug">{c.subject || 'Sans objet'}</p><Badge tone={c.status === 'envoyee' ? 'good' : 'mute'}>{c.status === 'envoyee' ? 'Envoyée' : 'Brouillon'}</Badge></div>
          <p className="mt-1 text-[12.5px] text-brume">{SEGMENTS.find((x) => x[0] === c.segment)?.[1] || c.segment}{c.sent_at && ` · ${fdate(c.sent_at)}`}</p>
          {c.status === 'envoyee' && <div className="mt-4 grid grid-cols-3 gap-2 text-center">{[[Users, c.recipients || 0, 'envoyés'], [Eye, `${Math.round(((c.opens || 0) / Math.max(1, c.recipients || 1)) * 100)} %`, 'ouverts'], [MousePointerClick, `${Math.round(((c.clicks || 0) / Math.max(1, c.recipients || 1)) * 100)} %`, 'clics']].map(([I, v, l]: any) => <div key={l} className="rounded-lg bg-white/[0.03] py-2"><I size={14} className="mx-auto text-white/40" /><p className="text-[14px] mt-1 tabular-nums">{v}</p><p className="text-[11px] text-white/40">{l}</p></div>)}</div>}
        </button>
      ))}{!s.campaigns.length && <Panel className="md:col-span-3"><Empty icon={<Send size={20} />} title="Aucune campagne" /></Panel>}</div>
      <Modal open={!!edit} onClose={() => setEdit(null)} title="Campagne e-mail" wide>
        {edit && <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-3"><Field label="Objet"><Input value={edit.subject} onChange={(e) => setEdit({ ...edit, subject: e.target.value })} placeholder="Ex. 3 erreurs qui cachent votre entreprise sur Google" /></Field><Field label="Destinataires"><Select value={edit.segment} onChange={(e) => setEdit({ ...edit, segment: e.target.value })} options={SEGMENTS.map(([k, l]) => [k, `${l} (${count(k)})`])} /></Field><Field label="Contenu"><Area rows={12} value={edit.body} onChange={(e) => setEdit({ ...edit, body: e.target.value })} /></Field><p className="text-[12px] text-brume">Un lien de désinscription est ajouté automatiquement en bas de chaque e-mail.</p></div>
          <div><p className="text-[12px] text-white/40 mb-2 flex items-center gap-2"><Eye size={13} />Aperçu</p><div className="rounded-xl bg-white text-[#0A1428] p-6 text-[14px] leading-relaxed min-h-[320px]"><p className="font-display text-[20px] font-semibold tracking-[-0.03em]">digilago</p><p className="mt-5 font-semibold text-[17px]">{edit.subject || 'Objet de votre e-mail'}</p><p className="mt-3 whitespace-pre-line">{edit.body}</p><p className="mt-8 pt-4 border-t text-[11px] text-[#56617A]">Vous recevez cet e-mail car vous êtes inscrit à la newsletter Digilago. Se désinscrire.</p></div></div>
          <div className="md:col-span-2 flex justify-between"><Btn kind="danger" onClick={() => { db.remove('campaigns', edit.id); setEdit(null); }}><Trash2 size={15} /></Btn><div className="flex gap-2"><Btn kind="soft" onClick={() => { if (s.campaigns.some((x) => x.id === edit.id)) db.update('campaigns', edit.id, edit); else db.insert('campaigns', edit); setEdit(null); }}>Enregistrer le brouillon</Btn>{edit.status !== 'envoyee' && <Btn kind="primary" onClick={() => send(edit)} disabled={!edit.subject}><Send size={15} />Envoyer à {count(edit.segment)}</Btn>}</div></div>
        </div>}
      </Modal>
      <span className="hidden">{String(preview)}{String(setPreview)}</span>
    </div>
  );
};

const Templates = () => {
  const s = useDB(); const [edit, setEdit] = useState<Template | null>(null);
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center"><p className="text-[13.5px] text-brume">Variables disponibles : {'{{prenom}} {{entreprise}} {{ville}} {{facture}} {{montant}} {{echeance}} {{lien}}'}</p><Btn kind="primary" onClick={() => setEdit({ id: uid(), channel: 'email', name: '', lang: 'fr', body: '', subject: '', category: 'Autre' })}><Plus size={15} />Modèle</Btn></div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{s.templates.map((t) => (
        <button key={t.id} onClick={() => setEdit(t)} className="text-start rounded-2xl bg-white/[0.035] ring-1 ring-white/[0.08] p-5 hover:ring-white/20"><div className="flex items-center justify-between gap-2"><p className="font-medium">{t.name}</p><Badge tone={t.channel === 'whatsapp' ? 'good' : 'info'}>{t.channel === 'whatsapp' ? 'WhatsApp' : 'E-mail'} · {t.lang.toUpperCase()}</Badge></div><p dir="auto" className="mt-2 text-[13px] text-brume line-clamp-3 whitespace-pre-line">{fill(t.body, { prenom: 'Karim', entreprise: 'Immo Prestige', ville: 'Casablanca', facture: 'F-2026-011', montant: '4 200 MAD', echeance: '12 oct. 2026', lien: 'digilago.ma' })}</p></button>
      ))}</div>
      <Modal open={!!edit} onClose={() => setEdit(null)} title="Modèle">
        {edit && <div className="space-y-3"><div className="grid grid-cols-3 gap-3"><Field label="Canal"><Select value={edit.channel} onChange={(e) => setEdit({ ...edit, channel: e.target.value as any })} options={[['email', 'E-mail'], ['whatsapp', 'WhatsApp']]} /></Field><Field label="Langue"><Select value={edit.lang} onChange={(e) => setEdit({ ...edit, lang: e.target.value })} options={[['fr', 'Français'], ['ar', 'Arabe'], ['en', 'Anglais']]} /></Field><Field label="Catégorie"><Input value={edit.category} onChange={(e) => setEdit({ ...edit, category: e.target.value })} /></Field></div><Field label="Nom"><Input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></Field>{edit.channel === 'email' && <Field label="Objet"><Input value={edit.subject || ''} onChange={(e) => setEdit({ ...edit, subject: e.target.value })} /></Field>}<Field label="Message"><Area rows={8} dir="auto" value={edit.body} onChange={(e) => setEdit({ ...edit, body: e.target.value })} /></Field>
          <div className="flex justify-between"><Btn kind="danger" onClick={() => { db.remove('templates', edit.id); setEdit(null); }}><Trash2 size={15} /></Btn><Btn kind="primary" onClick={() => { if (!edit.name) return; if (s.templates.some((x) => x.id === edit.id)) db.update('templates', edit.id, edit); else db.insert('templates', edit); setEdit(null); }}><FileText size={15} />Enregistrer</Btn></div></div>}
      </Modal>
    </div>
  );
};
