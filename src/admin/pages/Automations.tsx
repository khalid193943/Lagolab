import { useState } from 'react';
import { motion } from 'motion/react';
import { Workflow, Plus, Zap, MessageCircle, Mail, CheckSquare, Bell, Play, Trash2, ArrowRight, Filter } from 'lucide-react';
import { useDB, db, Automation, Action, runAutomations, uid, now, rel, isOverdue, MODE } from '../store';
import { Panel, Badge, Btn, Input, Select, Field, Area, Modal, cx } from '../kit';

const TRIG: Record<Automation['trigger'], string> = { 'lead.created': 'Nouvelle demande reçue', 'lead.status': 'Statut d’une demande modifié', 'invoice.overdue': 'Facture en retard', 'project.stage': 'Projet change d’étape', 'subscriber.created': 'Nouvel abonné newsletter', 'wa.keyword': 'Mot-clé reçu sur WhatsApp' };
const AI: Record<Action['type'], [any, string, string]> = { whatsapp: [MessageCircle, 'WhatsApp', '#25D366'], email: [Mail, 'E-mail', '#2DD4E6'], task: [CheckSquare, 'Rappel', '#8B9CFF'], notify: [Bell, 'Notification', '#F4B53F'], status: [Filter, 'Statut', '#FF8A7A'] };

export default function Automations() {
  const s = useDB(); const [edit, setEdit] = useState<Automation | null>(null); const [log, setLog] = useState<string[]>([]);
  const test = (a: Automation) => {
    if (a.trigger === 'invoice.overdue') { const late = s.invoices.filter(isOverdue); const out = late.flatMap((invoice) => runAutomations('invoice.overdue', { invoice })); setLog(out.length ? out : ['Aucune facture en retard : rien à relancer.']); return; }
    const lead = { id: uid(), created_at: now(), name: 'Test Digilago', company: 'Entreprise Test', city: 'Casablanca', sector: 'Restaurants', source: 'test', status: 'nouveau' as const, notes: [], phone: '+212 6 99 99 99 99', email: 'test@exemple.ma' };
    setLog(runAutomations(a.trigger, { lead, subscriber: { id: uid(), created_at: now(), email: 'test@exemple.ma', lang: 'fr', source: 'test', status: 'actif' } }));
  };
  const tpl = (id?: string) => s.templates.find((t) => t.id === id)?.name;
  const num = (id?: string) => s.numbers.find((n) => n.id === id)?.label;
  return (
    <div className="space-y-5 max-w-[1300px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="font-display text-[26px] tracking-[-0.03em]">Automatisations</h1><p className="text-[13.5px] text-brume">Les tâches répétitives se font seules : accusés de réception, relances, bienvenue, rappels.{MODE === 'live' ? ' Elles tournent sur le serveur, 24 h/24.' : ' En démo, elles s’exécutent dans le navigateur.'}</p></div><Btn kind="primary" onClick={() => setEdit({ id: uid(), name: '', enabled: true, trigger: 'lead.created', actions: [{ type: 'whatsapp', number_id: s.numbers[0]?.id }], runs: 0 })}><Plus size={15} />Automatisation</Btn></div>
      <div className="space-y-3">{s.automations.map((a, k) => (
        <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: k * 0.04 }}>
          <Panel className={cx(!a.enabled && 'opacity-55')}>
            <div className="flex flex-wrap items-center gap-4">
              <button onClick={() => db.update('automations', a.id, { enabled: !a.enabled })} className={cx('relative w-11 h-6 rounded-full transition-colors shrink-0', a.enabled ? 'bg-safran' : 'bg-white/15')} aria-label="Activer"><span className={cx('absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all', a.enabled ? 'start-[22px]' : 'start-0.5')} /></button>
              <button onClick={() => setEdit(a)} className="min-w-0 flex-1 text-start"><p className="font-medium">{a.name}</p><p className="text-[12.5px] text-brume">{a.runs} exécution{a.runs > 1 ? 's' : ''}{a.last_run && ` · dernière ${rel(a.last_run)}`}</p></button>
              <Btn kind="soft" onClick={() => test(a)}><Play size={14} />Tester</Btn>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-[12.5px]">
              <span className="inline-flex items-center gap-2 h-8 px-3 rounded-lg bg-safran/10 ring-1 ring-safran/30 text-safran"><Zap size={13} />{TRIG[a.trigger]}</span>
              {a.condition && <><ArrowRight size={14} className="text-white/30" /><span className="inline-flex items-center gap-2 h-8 px-3 rounded-lg bg-white/[0.05] ring-1 ring-white/10"><Filter size={13} />si {a.condition}</span></>}
              {a.actions.map((x, i) => { const [I, l, c] = AI[x.type]; return <span key={i} className="contents"><ArrowRight size={14} className="text-white/30" /><span className="inline-flex items-center gap-2 h-8 px-3 rounded-lg ring-1" style={{ background: `${c}14`, borderColor: `${c}40`, color: c }}><I size={13} />{l}{x.template_id && ` « ${tpl(x.template_id)} »`}{x.number_id && x.type === 'whatsapp' && ` · ${num(x.number_id)}`}{x.delay_h && ` · ${x.delay_h} h`}</span></span>; })}
            </div>
          </Panel>
        </motion.div>
      ))}</div>
      {log.length > 0 && <Panel title="Résultat du test"><ul className="space-y-1 text-[13.5px]">{log.map((l, k) => <li key={k}>✓ {l}</li>)}</ul><p className="mt-2 text-[12px] text-brume">Voir les messages dans WhatsApp et le journal des e-mails.</p></Panel>}
      <Builder a={edit} onClose={() => setEdit(null)} />
    </div>
  );
}

const Builder = ({ a, onClose }: { a: Automation | null; onClose: () => void }) => {
  const s = useDB(); const [f, setF] = useState<Automation | null>(a);
  if (a && f?.id !== a.id) setF(a);
  if (!a || !f) return <Modal open={false} onClose={onClose} title="">{null}</Modal>;
  const setAct = (i: number, p: Partial<Action>) => setF({ ...f, actions: f.actions.map((x, k) => (k === i ? { ...x, ...p } : x)) });
  const exists = s.automations.some((x) => x.id === f.id);
  return (
    <Modal open onClose={onClose} title={exists ? 'Modifier l’automatisation' : 'Nouvelle automatisation'} wide>
      <div className="space-y-4">
        <Field label="Nom"><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Ex. Accusé de réception WhatsApp" /></Field>
        <div className="grid md:grid-cols-2 gap-3"><Field label="Quand…"><Select value={f.trigger} onChange={(e) => setF({ ...f, trigger: e.target.value as any })} options={Object.entries(TRIG)} /></Field><Field label="Condition (optionnelle)"><Input value={f.condition || ''} onChange={(e) => setF({ ...f, condition: e.target.value })} placeholder="Ex. téléphone renseigné / e-mail renseigné / prix, tarif" /></Field></div>
        <p className="text-[12px] text-white/40">Alors…</p>
        {f.actions.map((x, i) => (
          <div key={i} className="grid md:grid-cols-[150px_1fr_1fr_40px] gap-2 items-end rounded-xl ring-1 ring-white/10 p-3">
            <Field label="Action"><Select value={x.type} onChange={(e) => setAct(i, { type: e.target.value as any })} options={Object.entries(AI).map(([k, v]) => [k, v[1]])} /></Field>
            {x.type === 'whatsapp' && <Field label="Numéro"><Select value={x.number_id} onChange={(e) => setAct(i, { number_id: e.target.value })} options={s.numbers.map((n) => [n.id, n.label])} /></Field>}
            {(x.type === 'whatsapp' || x.type === 'email') && <Field label="Modèle"><Select value={x.template_id || ''} onChange={(e) => setAct(i, { template_id: e.target.value })} options={[['', 'Texte libre…'], ...s.templates.filter((t) => t.channel === x.type).map((t) => [t.id, t.name] as [string, string])]} /></Field>}
            {x.type === 'task' && <Field label="Délai (heures)"><Input type="number" value={x.delay_h || 24} onChange={(e) => setAct(i, { delay_h: +e.target.value })} /></Field>}
            {(x.type === 'notify' || (x.type === 'whatsapp' && !x.template_id)) && <Field label="Texte"><Input value={x.text || ''} onChange={(e) => setAct(i, { text: e.target.value })} /></Field>}
            <button onClick={() => setF({ ...f, actions: f.actions.filter((_, k) => k !== i) })} className="h-10 text-white/40 hover:text-[#FF8A7A] flex items-center justify-center"><Trash2 size={15} /></button>
          </div>
        ))}
        <Btn kind="soft" onClick={() => setF({ ...f, actions: [...f.actions, { type: 'email' }] })}><Plus size={14} />Ajouter une action</Btn>
        <div className="flex justify-between pt-2">{exists ? <Btn kind="danger" onClick={() => { db.remove('automations', f.id); onClose(); }}><Trash2 size={15} />Supprimer</Btn> : <span />}<Btn kind="primary" onClick={() => { if (!f.name) return; if (exists) db.update('automations', f.id, f); else db.insert('automations', f); onClose(); }}><Workflow size={15} />Enregistrer</Btn></div>
      </div>
      <span className="hidden"><Area /></span>
    </Modal>
  );
};
