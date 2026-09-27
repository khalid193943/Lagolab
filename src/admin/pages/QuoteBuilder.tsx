/**
 * Devis intelligent : pendant un rendez-vous ou un appel.
 * On tape le métier → le moteur propose ce qu'il faut (avec l'argument à dire), s'adapte aux réponses du client,
 * à sa ville, à son budget et aux notes d'appel → trois formules → devis PDF, message WhatsApp ou e-mail.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Wand2, Sparkles, Check, Minus, Plus, Copy, FileText, MessageCircle, Mail, Settings2, RotateCcw, Phone, Lightbulb, Target, Clock, BadgeCheck, TriangleAlert } from 'lucide-react';
import { useDB, db, uid, now, mad, fn, MODE, Invoice, Client } from '../store';
import { Panel, Badge, Btn, Input, Field, Area, Modal, cx } from '../kit';
import { PROFILES, suggest, tiersOf, sumLines, schedule, priceOf, Line, CatItem } from '../quote';
import { sendWhatsApp, sendEmail } from './Leads';

const CITIES = ['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fès', 'Agadir', 'Meknès', 'Oujda', 'Kénitra', 'Tétouan', 'El Jadida', 'Safi', 'Essaouira', 'Laâyoune', 'Dakhla', 'Mohammedia', 'Béni Mellal', 'Nador'];
const QTY = ['page_sup', 'copywriting', 'photos'];

export default function QuoteBuilder() {
  const s = useDB(); const nav = useNavigate(); const [params] = useSearchParams();
  const [c, setC] = useState({ company: '', name: '', city: '', phone: '', email: '', metier: '', budget: 0, lead_id: '', client_id: '' });
  const [answers, setAnswers] = useState<Record<string, boolean>>({}); const [notes, setNotes] = useState('');
  const [picked, setPicked] = useState<Record<string, Line>>({}); const [discount, setDiscount] = useState(0);
  const [flash, setFlash] = useState<string[]>([]); const [done, setDone] = useState<Invoice | null>(null); const [tarifs, setTarifs] = useState(false); const [ai, setAi] = useState(false);
  const cat = s.catalog;
  const sug = useMemo(() => suggest(c.metier, c.city, answers, notes), [c.metier, c.city, answers, notes]);
  const prev = useRef<{ profile: string; ids: Set<string> }>({ profile: '', ids: new Set() });

  /* Pré-remplissage depuis une demande ou un client */
  useEffect(() => { const l = s.leads.find((x) => x.id === params.get('lead')); if (l) setC((x) => ({ ...x, company: l.company || '', name: l.name, city: l.city || '', phone: l.phone || '', email: l.email || '', metier: l.sector || '', lead_id: l.id })); const cl = s.clients.find((x) => x.id === params.get('client')); if (cl) setC((x) => ({ ...x, company: cl.company || '', name: cl.name, city: cl.city || '', phone: cl.phone || '', email: cl.email || '', metier: cl.sector || '', client_id: cl.id })); }, []);

  /* Quand le métier change : on applique la formule recommandée. Quand une réponse ou une note ajoute un élément : on le coche et on le signale. */
  useEffect(() => {
    const ids = new Set([sug.base, ...sug.must, ...sug.rec, ...sug.monthly]);
    if (prev.current.profile !== sug.profile.id) { apply(tiersOf(sug)[1]); setAnswers({}); }
    else { const added = [...ids].filter((i) => !prev.current.ids.has(i)); const removed = [...prev.current.ids].filter((i) => !ids.has(i) && sug.opt.includes(i)); /* réponse « Non » : l'élément redevient une option */
      if (added.length) { setPicked((p) => { const n = { ...p }; added.forEach((i) => { const it = priceOf(cat, i); if (it && !n[i]) n[i] = { id: i, qty: 1, price: it.price }; }); return n; }); setFlash(added); setTimeout(() => setFlash([]), 2200); }
      if (removed.length) setPicked((p) => { const n = { ...p }; removed.forEach((i) => delete n[i]); return n; }); }
    prev.current = { profile: sug.profile.id, ids };
  }, [sug]);

  const apply = (t: { ids: string[]; monthly: string[] }) => { const n: Record<string, Line> = {}; [...t.ids, ...t.monthly].forEach((i) => { const it = priceOf(cat, i); if (it) n[i] = { id: i, qty: 1, price: it.price }; }); setPicked(n); };
  const toggle = (id: string) => setPicked((p) => { const n = { ...p }; if (n[id]) delete n[id]; else { const it = priceOf(cat, id); if (it) { if (it.base) Object.keys(n).forEach((k) => priceOf(cat, k)?.base && delete n[k]); n[id] = { id, qty: 1, price: it.price }; } } return n; });
  const lines = Object.values(picked); const t = sumLines(cat, lines);
  const onceNet = t.once * (1 - discount / 100); const tva = onceNet * s.settings.tva / 100; const ttc = onceNet + tva;
  const tiers = tiersOf(sug).map((x) => ({ ...x, total: sumLines(cat, [...x.ids, ...x.monthly].map((i) => ({ id: i, qty: 1, price: priceOf(cat, i)?.price || 0 }))) }));
  const over = c.budget > 0 && onceNet > c.budget;
  const reset = () => { setC({ company: '', name: '', city: '', phone: '', email: '', metier: '', budget: 0, lead_id: '', client_id: '' }); setAnswers({}); setNotes(''); setPicked({}); setDiscount(0); };

  const summaryText = () => { const once = lines.filter((l) => !priceOf(cat, l.id)?.monthly); const month = lines.filter((l) => priceOf(cat, l.id)?.monthly); return `Bonjour ${c.name.split(' ')[0] || ''} 👋\nSuite à notre échange, voici ma proposition pour ${c.company || 'votre entreprise'} :\n\n${once.map((l) => `• ${priceOf(cat, l.id)?.name}${l.qty > 1 ? ` ×${l.qty}` : ''}`).join('\n')}\n\nInvestissement : ${mad(onceNet)} HT (${mad(ttc)} TTC)${discount ? `, remise de ${discount} % incluse` : ''}\n${month.length ? `Abonnement : ${mad(t.month)} HT / mois (${month.map((l) => priceOf(cat, l.id)?.name.toLowerCase()).join(', ')})\n` : ''}Délai : environ ${t.delay} jours ouvrés\n\nVous découvrez une première version en 72 h, et vous ne payez que si elle vous plaît.\n\n${s.settings.company}`; };

  const generate = () => {
    let clientId = c.client_id;
    if (!clientId) { const ex = s.clients.find((x) => (c.phone && x.phone === c.phone) || (c.email && x.email === c.email)); if (ex) clientId = ex.id; else { const nc: Client = { id: uid(), created_at: now(), name: c.name || c.company || 'Client', company: c.company, city: c.city, phone: c.phone, email: c.email, sector: sug.profile.label }; db.insert('clients', nc); clientId = nc.id; } }
    const once = lines.filter((l) => !priceOf(cat, l.id)?.monthly); const month = lines.filter((l) => priceOf(cat, l.id)?.monthly);
    const items = once.map((l) => ({ desc: priceOf(cat, l.id)!.name + (priceOf(cat, l.id)!.price === 0 ? ' (inclus)' : ''), qty: l.qty, price: l.price }));
    if (discount) items.push({ desc: `Remise commerciale ${discount} %`, qty: 1, price: -Math.round(t.once * discount / 100) });
    const sched = schedule(ttc).map(([k, p]) => `• ${k} : ${p} % (${mad((ttc * p) / 100)} TTC)`).join('\n');
    const notesTxt = `Délai estimé : ${t.delay} jours ouvrés à partir de la validation.\nPremière version présentée sous 72 heures : vous ne payez que si elle vous plaît.\n\nÉchéancier :\n${sched}${month.length ? `\n\nAbonnement mensuel (à partir de la mise en ligne, sans engagement de durée) :\n${month.map((l) => `• ${priceOf(cat, l.id)!.name} : ${mad(l.price * l.qty)} HT / mois`).join('\n')}\nTotal : ${mad(t.month)} HT / mois.` : ''}\n\nLe nom de domaine, le code et les contenus sont au nom du client. Devis valable 30 jours.`;
    const n = s.invoices.filter((i) => i.kind === 'devis').length + 1;
    const inv: Invoice = { id: uid(), number: s.settings.quote_prefix + String(n).padStart(3, '0'), kind: 'devis', client_id: clientId, issue: now().slice(0, 10), due: new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10), items, tva: s.settings.tva, status: 'envoyee', payments: [], notes: notesTxt };
    db.insert('invoices', inv);
    if (c.lead_id) { const l = s.leads.find((x) => x.id === c.lead_id); if (l) db.update('leads', l.id, { status: 'devis', value: Math.round(onceNet), notes: [{ at: now(), text: `Devis ${inv.number} généré : ${mad(onceNet)} HT${t.month ? ` + ${mad(t.month)}/mois` : ''}` }, ...l.notes] }); }
    db.log('invoice', `Devis intelligent ${inv.number} pour ${c.company || c.name} : ${mad(onceNet)} HT`, '/admin/factures');
    setDone(inv);
  };

  const refineAI = async () => {
    setAi(true);
    try { const r: any = await fn('ai', { question: `Tu prépares un devis pour une entreprise marocaine. Métier : ${c.metier}. Ville : ${c.city}. Notes d’appel : ${notes}. À partir du catalogue fourni, réponds UNIQUEMENT par un tableau JSON des identifiants à ajouter (maximum 5), sans texte autour.`, context: { catalogue: cat.map((x) => ({ id: x.id, nom: x.name })), deja: Object.keys(picked) } });
      const ids: string[] = JSON.parse(String(r?.answer || '[]').replace(/```json|```/g, '').trim()); const valid = ids.filter((i) => priceOf(cat, i) && !picked[i]);
      setPicked((p) => { const n = { ...p }; valid.forEach((i) => (n[i] = { id: i, qty: 1, price: priceOf(cat, i)!.price })); return n; }); setFlash(valid); setTimeout(() => setFlash([]), 2500);
    } catch { alert('L’IA n’a pas pu répondre. Vérifiez la clé ANTHROPIC_API_KEY.'); }
    setAi(false);
  };

  const Row = ({ id, tag }: { id: string; tag?: string }) => { const it = priceOf(cat, id); if (!it) return null; const on = !!picked[id]; const l = picked[id]; const why = sug.reasons[id] || it.desc; return (
    <motion.li layout className={cx('group rounded-xl ring-1 p-3 transition-colors', on ? 'bg-safran/[0.07] ring-safran/40' : 'bg-white/[0.02] ring-white/[0.07] hover:ring-white/20', flash.includes(id) && 'ring-cyan shadow-[0_0_0_3px_rgba(45,212,230,.25)]')}>
      <div className="flex items-start gap-3">
        <button onClick={() => toggle(id)} className={cx('mt-0.5 w-5 h-5 shrink-0 rounded-md flex items-center justify-center ring-1 transition', on ? 'bg-safran ring-safran text-nuit' : 'ring-white/25')} aria-label={on ? 'Retirer' : 'Ajouter'}>{on && <Check size={13} strokeWidth={3} />}</button>
        <button onClick={() => toggle(id)} className="flex-1 min-w-0 text-start"><p className="text-[14px] leading-snug flex flex-wrap items-center gap-2">{it.name}{tag && <Badge tone={tag === 'Indispensable' ? 'hot' : tag === 'Conseillé' ? 'warm' : 'mute'}>{tag}</Badge>}{flash.includes(id) && <Badge tone="info">Ajouté</Badge>}</p><p className="mt-0.5 text-[12.5px] text-brume">{why}</p></button>
        <div className="shrink-0 text-end">{on ? <div className="flex items-center gap-1.5">{QTY.includes(id) && <span className="flex items-center rounded-md ring-1 ring-white/10"><button onClick={() => setPicked({ ...picked, [id]: { ...l, qty: Math.max(1, l.qty - 1) } })} className="w-6 h-7 flex items-center justify-center"><Minus size={12} /></button><span className="w-5 text-center text-[13px]">{l.qty}</span><button onClick={() => setPicked({ ...picked, [id]: { ...l, qty: l.qty + 1 } })} className="w-6 h-7 flex items-center justify-center"><Plus size={12} /></button></span>}<input type="number" value={l.price} onChange={(e) => setPicked({ ...picked, [id]: { ...l, price: +e.target.value } })} className="w-[88px] h-7 rounded-md bg-nuit/70 ring-1 ring-white/10 px-2 text-end text-[13px] tabular-nums focus:outline-none focus:ring-cyan/60" /></div> : <p className="text-[13px] text-white/50 tabular-nums">{it.price ? mad(it.price) : 'inclus'}{it.monthly ? '/mois' : ''}</p>}</div>
      </div>
    </motion.li>
  ); };
  const bases = cat.filter((x) => x.base);
  return (
    <div className="space-y-5 max-w-[1700px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="font-display text-[26px] tracking-[-0.03em] flex items-center gap-2"><Wand2 className="text-safran" />Devis intelligent</h1><p className="text-[13.5px] text-brume">Pendant un rendez-vous ou un appel : tapez le métier, répondez aux questions, cochez, générez.</p></div>
        <div className="flex gap-2">{MODE === 'live' && <Btn kind="soft" onClick={refineAI} disabled={!c.metier || ai}><Sparkles size={15} className="text-safran" />{ai ? 'Réflexion…' : 'Affiner avec l’IA'}</Btn>}<Btn kind="soft" onClick={() => setTarifs(true)}><Settings2 size={15} />Tarifs</Btn><Btn kind="ghost" onClick={reset}><RotateCcw size={15} />Nouveau</Btn></div>
      </div>

      <div className="grid xl:grid-cols-[360px_1fr_380px] gap-4 items-start">
        {/* 1. Le client */}
        <div className="space-y-4">
          <Panel title={<span className="flex items-center gap-2"><Phone size={15} />Le client</span>}>
            <div className="space-y-3">
              <Field label="Partir d’une demande ou d’un client"><select value="" onChange={(e) => { const [k, id] = e.target.value.split(':'); if (k === 'l') { const l = s.leads.find((x) => x.id === id)!; setC({ ...c, company: l.company || '', name: l.name, city: l.city || '', phone: l.phone || '', email: l.email || '', metier: l.sector || c.metier, lead_id: l.id, client_id: '' }); } if (k === 'c') { const x = s.clients.find((y) => y.id === id)!; setC({ ...c, company: x.company || '', name: x.name, city: x.city || '', phone: x.phone || '', email: x.email || '', metier: x.sector || c.metier, client_id: x.id, lead_id: '' }); } }} className="w-full h-10 rounded-lg bg-nuit/70 ring-1 ring-white/10 px-3 text-[14px]"><option value="">— Choisir (facultatif) —</option><optgroup label="Demandes en cours">{s.leads.filter((l) => !['gagne', 'perdu'].includes(l.status)).map((l) => <option key={l.id} value={`l:${l.id}`}>{l.company || l.name} · {l.city}</option>)}</optgroup><optgroup label="Clients">{s.clients.map((x) => <option key={x.id} value={`c:${x.id}`}>{x.company || x.name}</option>)}</optgroup></select></Field>
              <div className="grid grid-cols-2 gap-2"><Field label="Entreprise"><Input value={c.company} onChange={(e) => setC({ ...c, company: e.target.value })} /></Field><Field label="Contact"><Input value={c.name} onChange={(e) => setC({ ...c, name: e.target.value })} /></Field><Field label="Ville"><Input list="dg-cities" value={c.city} onChange={(e) => setC({ ...c, city: e.target.value })} /><datalist id="dg-cities">{CITIES.map((x) => <option key={x} value={x} />)}</datalist></Field><Field label="Téléphone"><Input value={c.phone} onChange={(e) => setC({ ...c, phone: e.target.value })} dir="ltr" /></Field></div>
              <Field label="E-mail"><Input value={c.email} onChange={(e) => setC({ ...c, email: e.target.value })} dir="ltr" /></Field>
            </div>
          </Panel>
          <Panel title={<span className="flex items-center gap-2"><Target size={15} />Son métier</span>}>
            <Input value={c.metier} onChange={(e) => setC({ ...c, metier: e.target.value })} placeholder="ex. dentiste, riad, padel, caftans, plombier…" className="!h-12 !text-[16px]" autoFocus />
            <AnimatePresence mode="wait">{c.metier && <motion.p key={sug.profile.id} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-3 flex items-center gap-2 text-[13.5px]"><span className="text-[20px]">{sug.profile.emoji}</span><span>{sug.profile.id === 'generic' ? 'Métier non reconnu : proposition générale.' : <>Profil <b>{sug.profile.label}</b>{sug.match && <span className="text-brume"> · reconnu : « {sug.match} »</span>}</>}</span></motion.p>}</AnimatePresence>
            <div className="mt-3 flex flex-wrap gap-1.5">{PROFILES.map((p) => <button key={p.id} onClick={() => setC({ ...c, metier: p.words[0] })} className={cx('h-8 px-2.5 rounded-full text-[12.5px] ring-1 transition', sug.profile.id === p.id ? 'bg-safran text-nuit ring-transparent' : 'ring-white/12 text-white/65 hover:text-white')}>{p.emoji} {p.label.split(',')[0]}</button>)}</div>
            <Field label="Budget annoncé par le client (MAD HT, facultatif)" className="mt-4"><Input type="number" value={c.budget || ''} onChange={(e) => setC({ ...c, budget: +e.target.value })} placeholder="ex. 15000" /></Field>
          </Panel>
          {c.metier && <Panel title={<span className="flex items-center gap-2"><Lightbulb size={15} className="text-safran" />Questions à lui poser</span>}>
            <ul className="space-y-2.5">{sug.profile.questions.map((q) => <li key={q.id} className="text-[13.5px]"><p>{q.q}</p><div className="mt-1.5 flex gap-1.5">{([['Oui', true], ['Non', false]] as const).map(([l, v]) => <button key={l} onClick={() => setAnswers({ ...answers, [q.id]: answers[q.id] === v ? (undefined as any) : v })} className={cx('h-7 px-3 rounded-full text-[12.5px] ring-1', answers[q.id] === v ? (v ? 'bg-[#34D399] text-nuit ring-transparent' : 'bg-white/20 ring-transparent') : 'ring-white/12 text-white/60')}>{l}</button>)}</div></li>)}</ul>
          </Panel>}
          <Panel title="Notes d’appel">
            <Area value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} placeholder="Tapez ce que dit le client : « il livre à domicile », « clients touristes », « veut des avis Google »…" />
            {sug.detected.length > 0 && <p className="mt-2 flex flex-wrap gap-1.5 text-[12px]"><span className="text-brume">Détecté :</span>{sug.detected.map((d) => <Badge key={d} tone="info">{d}</Badge>)}</p>}
          </Panel>
        </div>

        {/* 2. Ce qu'il lui faut */}
        <div className="space-y-4">
          <Panel title="La base du projet"><ul className="grid gap-2">{bases.map((b) => <Row key={b.id} id={b.id} tag={b.id === sug.base ? 'Conseillé' : undefined} />)}</ul></Panel>
          {[['Indispensable pour ce métier', sug.must, 'Indispensable'], ['Recommandé', sug.rec, 'Conseillé'], ['En option', sug.opt, undefined], ['Chaque mois', sug.monthly, undefined]].map(([title, ids, tag]: any) => ids.length > 0 && <Panel key={title} title={title}><ul className="space-y-2">{ids.map((id: string) => <Row key={id} id={id} tag={tag} />)}</ul></Panel>)}
          <details className="rounded-2xl bg-white/[0.035] ring-1 ring-white/[0.08] p-5"><summary className="cursor-pointer text-[14px]">Tout le catalogue ({cat.length} éléments)</summary><ul className="mt-3 space-y-2">{cat.filter((x) => !x.base && ![...sug.must, ...sug.rec, ...sug.opt, ...sug.monthly].includes(x.id)).map((x) => <Row key={x.id} id={x.id} />)}</ul></details>
        </div>

        {/* 3. Formules, total et actions */}
        <div className="space-y-4 xl:sticky xl:top-20">
          <Panel title="Trois formules à présenter">
            <div className="space-y-2">{tiers.map((x) => <button key={x.key} onClick={() => apply(x)} className={cx('w-full text-start rounded-xl ring-1 p-3 transition', x.best ? 'ring-safran/50 bg-safran/[0.06]' : 'ring-white/10 hover:ring-white/25')}><p className="flex items-center justify-between gap-2 text-[14px] font-medium">{x.name}{x.best && <Badge tone="warm">Conseillée</Badge>}<span className="ms-auto tabular-nums">{mad(x.total.once)}</span></p><p className="mt-0.5 text-[12px] text-brume">{x.note}{x.total.month ? ` + ${mad(x.total.month)}/mois` : ''}</p></button>)}</div>
          </Panel>
          <Panel title="Récapitulatif">
            <div className="space-y-1.5 text-[14px]">
              <p className="flex justify-between text-white/70"><span>{lines.filter((l) => !priceOf(cat, l.id)?.monthly).length} élément(s)</span><span className="tabular-nums">{mad(t.once)} HT</span></p>
              <div className="flex items-center justify-between text-white/70"><span>Remise</span><span className="flex items-center gap-1"><input type="number" min={0} max={50} value={discount} onChange={(e) => setDiscount(Math.min(50, Math.max(0, +e.target.value)))} className="w-14 h-7 rounded-md bg-nuit/70 ring-1 ring-white/10 px-2 text-end text-[13px]" />%</span></div>
              <p className="flex justify-between text-white/70"><span>TVA {s.settings.tva} %</span><span className="tabular-nums">{mad(tva)}</span></p>
              <p className="flex justify-between font-display text-[22px] pt-2 border-t border-white/10"><span>Total TTC</span><span className="tabular-nums">{mad(ttc)}</span></p>
              {t.month > 0 && <p className="flex justify-between text-[13.5px]"><span className="text-brume">Puis chaque mois</span><span className="tabular-nums">{mad(t.month)} HT</span></p>}
              <p className="flex items-center gap-2 pt-2 text-[13px] text-brume"><Clock size={14} />Délai estimé : <span className="text-white">{t.delay} jours ouvrés</span></p>
              {c.budget > 0 && <p className={cx('flex items-center gap-2 text-[13px]', over ? 'text-safran' : 'text-[#6EE7B7]')}>{over ? <TriangleAlert size={14} /> : <BadgeCheck size={14} />}{over ? `Dépasse le budget de ${mad(onceNet - c.budget)}. Proposez l’Essentiel ou un paiement en plusieurs fois.` : 'Dans le budget annoncé.'}</p>}
              <div className="pt-2"><p className="text-[12px] text-white/40 mb-1">Échéancier conseillé</p>{schedule(ttc).map(([k, p]) => <p key={k} className="flex justify-between text-[12.5px] text-white/70"><span>{k} ({p} %)</span><span className="tabular-nums">{mad((ttc * p) / 100)}</span></p>)}</div>
            </div>
            <div className="mt-5 grid gap-2">
              <Btn kind="primary" className="!h-11" onClick={generate} disabled={!lines.length || !(c.company || c.name)}><FileText size={16} />Générer le devis</Btn>
              <div className="grid grid-cols-2 gap-2"><Btn kind="soft" onClick={() => { navigator.clipboard?.writeText(summaryText()); }}><Copy size={14} />Copier</Btn><Btn kind="soft" disabled={!c.phone} onClick={async () => { await sendWhatsApp(c.phone, summaryText(), s.numbers[0]?.id, `${c.name} · ${c.company}`, c.lead_id || undefined); alert('Proposition envoyée sur WhatsApp ✓'); }}><MessageCircle size={14} />WhatsApp</Btn></div>
            </div>
          </Panel>
          {c.metier && <Panel title={<span className="flex items-center gap-2"><Lightbulb size={15} className="text-safran" />À dire au client</span>}><ul className="space-y-2.5 text-[13.5px] leading-relaxed">{sug.profile.pitch.map((x) => <li key={x} className="border-s-2 border-safran/60 ps-3">{x}</li>)}<li className="border-s-2 border-cyan/60 ps-3">« Vous découvrez une première version en 72 h, et vous ne payez que si elle vous plaît. »</li></ul></Panel>}
        </div>
      </div>

      <Modal open={!!done} onClose={() => setDone(null)} title="Devis généré ✓">
        {done && <div className="space-y-4"><p className="text-[14px]">Le devis <b>{done.number}</b> pour {c.company || c.name} est prêt : {mad(onceNet)} HT, soit {mad(ttc)} TTC{t.month ? `, puis ${mad(t.month)} HT par mois` : ''}.</p>
          <div className="grid sm:grid-cols-3 gap-2"><Btn kind="primary" onClick={() => nav(`/admin/factures?id=${done.id}`)}><FileText size={15} />Voir / PDF</Btn><Btn kind="soft" disabled={!c.phone} onClick={async () => { await sendWhatsApp(c.phone, summaryText() + `\n\nDevis ${done.number} ci-joint.`, s.numbers[0]?.id, `${c.name} · ${c.company}`, c.lead_id || undefined); alert('Envoyé sur WhatsApp ✓'); }}><MessageCircle size={15} />WhatsApp</Btn><Btn kind="soft" disabled={!c.email} onClick={async () => { await sendEmail(c.email, `Votre devis ${done.number} · Digilago`, summaryText(), 'Devis intelligent'); alert('E-mail envoyé ✓'); }}><Mail size={15} />E-mail</Btn></div>
          <p className="text-[12.5px] text-brume">Le client est créé ou mis à jour, et la demande liée passe en « Devis envoyé ». Transformez le devis en facture dès qu’il est accepté.</p></div>}
      </Modal>
      <Tarifs open={tarifs} onClose={() => setTarifs(false)} />
    </div>
  );
}

/* Grille tarifaire modifiable (utilisée par le devis intelligent) */
const Tarifs = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const s = useDB();
  const up = (id: string, patch: Partial<CatItem>) => db.update('catalog', id, patch);
  return (
    <Modal open={open} onClose={onClose} title="Vos tarifs (HT)" wide>
      <p className="text-[13px] text-brume mb-4">Ces prix de départ servent aux suggestions et aux formules. Vous pouvez aussi ajuster chaque prix directement dans un devis.</p>
      <div className="max-h-[60vh] overflow-y-auto divide-y divide-white/[0.06]">{s.catalog.map((x) => <div key={x.id} className="grid grid-cols-[1fr_120px_90px] gap-3 items-center py-2"><div><Input value={x.name} onChange={(e) => up(x.id, { name: e.target.value })} className="!h-9" /><p className="mt-1 text-[11.5px] text-white/40">{x.desc}</p></div><Input type="number" value={x.price} onChange={(e) => up(x.id, { price: +e.target.value })} className="!h-9 text-end" /><span className="text-[12.5px] text-brume">MAD / {x.unit}</span></div>)}</div>
    </Modal>
  );
};
