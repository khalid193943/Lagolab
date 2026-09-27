/**
 * Assistant IA de l'admin.
 * Production : la question et un résumé chiffré des données partent vers la fonction serveur `ai`
 * (Claude), qui répond en connaissant vos chiffres. Démo : un moteur local répond aux questions courantes.
 */
import { useEffect, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, Send, ArrowUpRight } from 'lucide-react';
import { useDB, getDB, analytics, insights, mad, scoreLead, invTotals, isOverdue, fn, MODE, rel, DB } from '../store';
import { Panel, cx } from '../kit';

type Msg = { role: 'user' | 'ai'; text: string; links?: [string, string][] };

const summary = (s: DB) => { const a = analytics(s); return { encaisse_mois_ht: Math.round(a.thisMonthPaid), facture_mois_ht: Math.round(a.thisMonthBilled), reste_a_encaisser_ttc: Math.round(a.outstanding), factures_en_retard: a.overdue.map((i) => ({ numero: i.number, client: s.clients.find((c) => c.id === i.client_id)?.company, reste: Math.round(invTotals(i).due), echeance: i.due })), revenu_recurrent_mensuel: a.mrr, pipeline_pondere: Math.round(a.pipeline), conversion: Math.round(a.conv * 100), demandes_30j: a.leads30, demandes_ouvertes: a.open.map((l) => ({ entreprise: l.company || l.name, ville: l.city, secteur: l.sector, statut: l.status, score: scoreLead(l), recue: l.created_at })), projets: s.projects.filter((p) => !['termine'].includes(p.stage)).map((p) => ({ nom: p.name, etape: p.stage, echeance: p.due, taches_restantes: p.tasks.filter((t) => !t.done).length })), sources: a.bySource, villes: a.byCity, secteurs: a.bySector, objectif_mois: s.settings.goal_month }; };

/* Moteur local (mode démo) : reconnaît l'intention et répond avec les vrais chiffres */
const local = (q: string, s: DB): Msg => {
  const t = q.toLowerCase(); const a = analytics(s);
  const has = (...w: string[]) => w.some((x) => t.includes(x));
  if (has('retard', 'impay', 'relanc') && has('factur', 'paie', 'impay')) {
    if (!a.overdue.length) return { role: 'ai', text: 'Bonne nouvelle : aucune facture n’est en retard aujourd’hui. 🎉' };
    return { role: 'ai', text: `${a.overdue.length} facture(s) en retard, pour ${mad(a.overdue.reduce((n, i) => n + invTotals(i).due, 0))} :\n` + a.overdue.map((i) => `• ${i.number} · ${s.clients.find((c) => c.id === i.client_id)?.company} · ${mad(invTotals(i).due)} (échue le ${new Date(i.due).toLocaleDateString('fr-FR')})`).join('\n') + '\n\nJe vous conseille une relance WhatsApp aujourd’hui : elle est prête dans Factures.', links: [['/admin/factures', 'Ouvrir les factures']] };
  }
  if (has('chiffre', 'ca ', 'encaiss', 'revenu', 'gagné', 'combien j')) return { role: 'ai', text: `Ce mois-ci : ${mad(a.thisMonthPaid)} encaissés (HT) et ${mad(a.thisMonthBilled)} facturés, soit ${Math.round((a.thisMonthPaid / s.settings.goal_month) * 100)} % de votre objectif de ${mad(s.settings.goal_month)}.\nRevenu récurrent : ${mad(a.mrr)}/mois. Reste à encaisser : ${mad(a.outstanding)} TTC.\nPrévision sur 30 jours : ${mad(a.forecast)}.`, links: [['/admin/finances', 'Voir la trésorerie']] };
  if (has('demande', 'lead', 'prospect', 'rappeler', 'traiter')) { const open = [...a.open].sort((x, y) => scoreLead(y) - scoreLead(x)).slice(0, 5); return { role: 'ai', text: `${a.open.length} demande(s) en cours. Les plus prometteuses :\n` + open.map((l) => `• ${l.company || l.name} (${l.city}, ${l.sector}) · score ${scoreLead(l)} · ${l.status} · reçue ${rel(l.created_at)}`).join('\n') + `\n\nPipeline pondéré : ${mad(a.pipeline)}. Commencez par la première : une réponse dans l’heure double vos chances.`, links: [['/admin/demandes', 'Traiter les demandes']] }; }
  if (has('meilleur', 'top', 'client')) return { role: 'ai', text: 'Vos meilleurs clients (encaissé HT) :\n' + a.revenueByClient.slice(0, 5).map((r, k) => `${k + 1}. ${r.c.company || r.c.name} · ${mad(r.v)}`).join('\n'), links: [['/admin/clients', 'Voir les clients']] };
  if (has('secteur', 'ville', 'marche', 'fonctionne', 'source')) { const top = (o: Record<string, number>) => Object.entries(o).sort((x, y) => y[1] - x[1]).slice(0, 3).map(([k, v]) => `${k} (${v})`).join(', '); return { role: 'ai', text: `Secteurs les plus demandés : ${top(a.bySector)}.\nVilles : ${top(a.byCity)}.\nSources : ${top(a.bySource)}.\nTaux de conversion global : ${Math.round(a.conv * 100)} %.\n\nIdée : créez un guide dédié au secteur n° 1 et une page ville pour la ville n° 1 si elle n’existe pas encore.`, links: [['/admin/analytics', 'Ouvrir les analytics']] }; }
  if (has('projet', 'deadline', 'échéance', 'echeance', 'livr')) { const p = s.projects.filter((x) => !['maintenance', 'termine'].includes(x.stage)).sort((x, y) => x.due.localeCompare(y.due)); return { role: 'ai', text: 'Projets en production, du plus urgent au moins urgent :\n' + p.map((x) => { const d = Math.round((+new Date(x.due) - Date.now()) / 864e5); return `• ${x.name} · ${d >= 0 ? `J-${d}` : `${-d} j de retard`} · ${x.tasks.filter((k) => !k.done).length} tâche(s) restante(s)`; }).join('\n'), links: [['/admin/projets', 'Ouvrir les projets']] }; }
  if (has('prévi', 'previ', 'prochain mois', 'futur')) return { role: 'ai', text: `Prévision d’encaissement sur 30 jours : ${mad(a.forecast)}.\nElle combine votre revenu récurrent (${mad(a.mrr)}), 70 % des factures en attente et 35 % du pipeline pondéré (${mad(a.pipeline)}).` };
  if (has('résum', 'resum', 'bilan', 'semaine', 'point')) { const ins = insights(s); return { role: 'ai', text: `Point du jour :\n` + ins.map((x) => `• ${x.title} : ${x.text}`).join('\n') }; }
  if (has('rédige', 'redige', 'écris', 'ecris', 'message', 'relance')) { const l = [...a.open].sort((x, y) => scoreLead(y) - scoreLead(x))[0]; return { role: 'ai', text: l ? `Voici une proposition pour ${l.name} (${l.company}) :\n\n« Bonjour ${l.name.split(' ')[0]} 👋 Merci pour votre intérêt ! Pour ${l.company}, à ${l.city}, je vous propose une première version de votre site d’ici 72 h, avec vos informations et vos photos. Vous ne payez que si elle vous plaît. On s’appelle 10 minutes aujourd’hui ? »` : 'Aucune demande ouverte à relancer pour le moment.', links: l ? [[`/admin/demandes?id=${l.id}`, 'Ouvrir la demande']] : undefined }; }
  return { role: 'ai', text: 'Je peux vous aider sur vos chiffres, vos demandes et vos projets. Essayez :\n• « Quelles factures sont en retard ? »\n• « Combien j’ai encaissé ce mois-ci ? »\n• « Quelles demandes dois-je rappeler en premier ? »\n• « Quel secteur marche le mieux ? »\n• « Fais-moi le point du jour »\n• « Rédige un message pour la meilleure demande »' };
};

export default function Assistant() {
  const s = useDB(); const [params] = useSearchParams(); const [msgs, setMsgs] = useState<Msg[]>([{ role: 'ai', text: `Bonjour 👋 Je connais vos demandes, clients, projets et factures. ${insights(getDB())[0]?.title || ''}. Que voulez-vous savoir ?` }]);
  const [q, setQ] = useState(''); const [busy, setBusy] = useState(false); const end = useRef<HTMLDivElement>(null);
  const ask = async (question: string) => {
    if (!question.trim()) return; setMsgs((m) => [...m, { role: 'user', text: question }]); setQ(''); setBusy(true);
    let reply: Msg;
    if (MODE === 'live') { try { const r: any = await fn('ai', { question, context: summary(getDB()) }); reply = { role: 'ai', text: r?.answer || '…' }; } catch { reply = local(question, getDB()); } }
    else { await new Promise((r) => setTimeout(r, 650)); reply = local(question, getDB()); }
    setMsgs((m) => [...m, reply]); setBusy(false);
  };
  useEffect(() => { const x = params.get('q'); if (x) ask(x); }, []);
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, busy]);
  const SUG = ['Fais-moi le point du jour', 'Quelles factures sont en retard ?', 'Quelles demandes rappeler en premier ?', 'Combien j’ai encaissé ce mois-ci ?', 'Quel secteur marche le mieux ?', 'Rédige un message pour la meilleure demande'];
  return (
    <div className="max-w-[900px] mx-auto h-[calc(100svh-130px)] flex flex-col">
      <div className="text-center pt-2 pb-5"><span className="inline-flex w-12 h-12 rounded-2xl bg-safran/15 text-safran items-center justify-center"><Sparkles size={22} /></span><h1 className="mt-3 font-display text-[26px] tracking-[-0.03em]">Assistant Digilago</h1><p className="text-[13.5px] text-brume">{MODE === 'live' ? 'Propulsé par Claude, avec vos données en contexte.' : 'Mode démo : réponses calculées localement sur vos données.'}</p></div>
      <Panel className="flex-1 min-h-0 flex flex-col" pad={false}>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {msgs.map((m, k) => <motion.div key={k} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cx('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}><div className={cx('max-w-[85%] rounded-2xl px-4 py-3 text-[14.5px] leading-relaxed whitespace-pre-line', m.role === 'user' ? 'bg-safran text-nuit rounded-ee-md' : 'bg-white/[0.05] ring-1 ring-white/[0.07] rounded-es-md')}>{m.text}{m.links && <div className="mt-3 flex flex-wrap gap-2">{m.links.map(([to, l]) => <Link key={to} to={to} className="inline-flex items-center gap-1 h-8 px-3 rounded-full bg-white/[0.08] text-[12.5px] hover:bg-white/[0.14]">{l}<ArrowUpRight size={13} /></Link>)}</div>}</div></motion.div>)}
          {busy && <div className="flex gap-1 px-4">{[0, 1, 2].map((i) => <motion.span key={i} className="w-2 h-2 rounded-full bg-safran" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }} />)}</div>}
          <div ref={end} />
        </div>
        {msgs.length < 3 && <div className="px-5 pb-3 flex flex-wrap gap-2">{SUG.map((x) => <button key={x} onClick={() => ask(x)} className="h-8 px-3 rounded-full ring-1 ring-white/12 text-[12.5px] text-white/70 hover:text-white hover:ring-safran/50">{x}</button>)}</div>}
        <form onSubmit={(e) => { e.preventDefault(); ask(q); }} className="p-3 border-t border-white/[0.06] flex gap-2"><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Posez une question sur votre activité…" className="flex-1 h-11 rounded-xl bg-nuit/70 ring-1 ring-white/10 px-4 text-[14.5px] focus:outline-none focus:ring-safran/50" /><button disabled={busy} className="w-11 h-11 rounded-xl bg-safran text-nuit flex items-center justify-center disabled:opacity-50" aria-label="Envoyer"><Send size={17} /></button></form>
      </Panel>
      <span className="hidden">{s.leads.length}</span>
    </div>
  );
}
