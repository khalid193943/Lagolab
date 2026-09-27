import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { FolderKanban, Plus, Columns3, GanttChart, CheckSquare, Square, Trash2, ExternalLink, FileText } from 'lucide-react';
import { useDB, db, Project, Stage, mad, fdate, uid, now, invTotals } from '../store';
import { Panel, Badge, Btn, Drawer, Empty, Input, Select, Field, Modal, Progress, Avatar, cx } from '../kit';
import { STAGES } from './Dashboard';

const COLORS: Record<Stage, string> = { cadrage: '#8B9CFF', version: '#FFD37A', affinage: '#F4B53F', dev: '#2DD4E6', lancement: '#34D399', maintenance: '#64748B', termine: '#334155' };
const pct = (p: Project) => (p.tasks.length ? (p.tasks.filter((t) => t.done).length / p.tasks.length) * 100 : 0);

export default function Projects() {
  const s = useDB(); const [params, setParams] = useSearchParams(); const [view, setView] = useState<'kanban' | 'planning'>('kanban'); const [add, setAdd] = useState(false);
  const open = s.projects.find((p) => p.id === params.get('id'));
  const client = (id: string) => s.clients.find((c) => c.id === id);
  const live = s.projects.filter((p) => p.stage !== 'termine');
  const start = Math.min(...live.map((p) => +new Date(p.start)), Date.now() - 30 * 864e5), end = Math.max(...live.map((p) => +new Date(p.due)), Date.now() + 30 * 864e5);
  const x = (d: number) => ((d - start) / (end - start)) * 100;
  return (
    <div className="space-y-5 max-w-[1600px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="font-display text-[26px] tracking-[-0.03em]">Projets</h1><p className="text-[13.5px] text-brume">{live.filter((p) => p.stage !== 'maintenance').length} en production · {s.projects.filter((p) => p.stage === 'maintenance').length} en maintenance · {mad(s.projects.reduce((n, p) => n + (p.monthly || 0), 0))} / mois récurrents</p></div>
        <div className="flex gap-2"><div className="inline-flex rounded-lg ring-1 ring-white/10 p-0.5"><button onClick={() => setView('kanban')} className={cx('h-8 px-3 rounded-md flex items-center gap-2 text-[13px]', view === 'kanban' && 'bg-white/10')}><Columns3 size={15} />Tableau</button><button onClick={() => setView('planning')} className={cx('h-8 px-3 rounded-md flex items-center gap-2 text-[13px]', view === 'planning' && 'bg-white/10')}><GanttChart size={15} />Planning</button></div><Btn kind="primary" onClick={() => setAdd(true)}><Plus size={15} />Projet</Btn></div>
      </div>

      {view === 'kanban' ? (
        <div className="flex gap-3 overflow-x-auto pb-3">{STAGES.map(([k, label]) => { const col = s.projects.filter((p) => p.stage === k); return (
          <div key={k} className="w-[290px] shrink-0 rounded-2xl bg-white/[0.025] ring-1 ring-white/[0.06] p-3" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { const id = e.dataTransfer.getData('id'); if (id) { db.update('projects', id, { stage: k }); db.log('project', `Projet déplacé en « ${label} »`); } }}>
            <p className="flex items-center gap-2 px-1 pb-3 text-[13px]"><span className="w-2 h-2 rounded-full" style={{ background: COLORS[k] }} />{label}<span className="ms-auto text-white/40">{col.length}</span></p>
            <div className="space-y-2 min-h-[60px]">{col.map((p) => { const d = Math.round((+new Date(p.due) - Date.now()) / 864e5); const c = client(p.client_id); return (
              <motion.div layout key={p.id} draggable onDragStart={(e: any) => e.dataTransfer.setData('id', p.id)} onClick={() => setParams({ id: p.id })} className="rounded-xl bg-[#0D1830] ring-1 ring-white/[0.07] p-3.5 cursor-grab hover:ring-white/20">
                <p className="text-[13.5px] font-medium leading-snug">{p.name}</p>
                <p className="mt-1 text-[12px] text-brume">{c?.company || c?.name} · {p.type}</p>
                <div className="mt-3"><Progress value={pct(p)} color={COLORS[p.stage]} /></div>
                <div className="mt-2 flex items-center justify-between text-[11.5px] text-white/45"><span>{p.tasks.filter((t) => t.done).length}/{p.tasks.length} tâches</span>{!['maintenance', 'termine'].includes(p.stage) && <span className={d <= 3 ? 'text-safran' : ''}>{d >= 0 ? `J-${d}` : `retard ${-d} j`}</span>}{p.stage === 'maintenance' && p.monthly && <span>{mad(p.monthly)}/mois</span>}</div>
              </motion.div>
            ); })}</div>
          </div>
        ); })}</div>
      ) : (
        <Panel pad={false}>
          <div className="relative px-5 py-4 overflow-x-auto"><div className="min-w-[760px]">
            <div className="relative h-6 mb-2 text-[11px] text-white/40">{Array.from({ length: 6 }, (_, k) => { const d = start + (k / 5) * (end - start); return <span key={k} className="absolute -translate-x-1/2" style={{ left: `${(k / 5) * 100}%` }}>{new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>; })}</div>
            <div className="relative space-y-2"><span className="absolute top-0 bottom-0 w-px bg-safran/70 z-10" style={{ left: `${x(Date.now())}%` }} />
              {live.map((p) => <button key={p.id} onClick={() => setParams({ id: p.id })} className="relative block w-full h-10 text-start"><span className="absolute inset-y-0 rounded-lg overflow-hidden ring-1 ring-white/10" style={{ left: `${x(+new Date(p.start))}%`, width: `${Math.max(3, x(+new Date(p.due)) - x(+new Date(p.start)))}%`, background: `${COLORS[p.stage]}33` }}><span className="absolute inset-y-0 start-0" style={{ width: `${pct(p)}%`, background: `${COLORS[p.stage]}66` }} /><span className="relative px-3 leading-10 text-[12.5px] whitespace-nowrap">{p.name}</span></span></button>)}
            </div>
          </div></div>
        </Panel>
      )}
      {!s.projects.length && <Panel><Empty icon={<FolderKanban size={20} />} title="Aucun projet" text="Convertissez une demande ou créez un projet." /></Panel>}
      <ProjectDrawer p={open} onClose={() => setParams({})} />
      <NewProject open={add} onClose={() => setAdd(false)} />
    </div>
  );
}

const ProjectDrawer = ({ p, onClose }: { p?: Project; onClose: () => void }) => {
  const s = useDB(); const [task, setTask] = useState('');
  if (!p) return <Drawer open={false} onClose={onClose} title="">{null}</Drawer>;
  const c = s.clients.find((x) => x.id === p.client_id); const inv = s.invoices.filter((i) => i.project_id === p.id && i.kind === 'facture');
  const billed = inv.reduce((n, i) => n + invTotals(i).ht, 0); const paid = inv.reduce((n, i) => n + invTotals(i).paid / 1.2, 0);
  const up = (patch: Partial<Project>) => db.update('projects', p.id, patch);
  const addTask = () => { if (!task.trim()) return; up({ tasks: [...p.tasks, { id: uid(), title: task.trim(), done: false }] }); setTask(''); };
  return (
    <Drawer open onClose={onClose} title={<div><p className="font-display text-[19px]">{p.name}</p><p className="text-[13px] text-brume flex items-center gap-2 mt-0.5"><Avatar name={c?.company || c?.name || '?'} size={20} />{c?.company || c?.name} · {p.type}</p></div>}
      footer={<><Btn kind="danger" onClick={() => { if (confirm('Supprimer ce projet ?')) { db.remove('projects', p.id); onClose(); } }}><Trash2 size={15} /></Btn><Link to={`/admin/factures?new=facture&client=${p.client_id}&project=${p.id}`} className="inline-flex items-center gap-2 h-9 ps-3 pe-4 bg-safran text-nuit rounded-e-full text-[13.5px] font-medium"><FileText size={15} />Facturer</Link></>}>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-1.5">{STAGES.map(([k, l]) => <button key={k} onClick={() => up({ stage: k })} className={cx('h-8 px-3 rounded-full text-[12.5px] ring-1', p.stage === k ? 'text-nuit font-medium ring-transparent' : 'ring-white/12 text-white/65 hover:text-white')} style={p.stage === k ? { background: COLORS[k] } : undefined}>{l}</button>)}</div>
        <div className="grid grid-cols-3 gap-3">{[['Budget HT', mad(p.budget)], ['Facturé HT', mad(billed)], ['Encaissé HT', mad(paid)]].map(([k, v]) => <div key={k} className="rounded-xl bg-white/[0.03] ring-1 ring-white/[0.06] p-3"><p className="text-[11.5px] text-white/40">{k}</p><p className="mt-1 font-display text-[15px] tabular-nums">{v}</p></div>)}</div>
        <div><div className="flex justify-between text-[12px] text-white/50 mb-1.5"><span>Reste à facturer</span><span>{mad(Math.max(0, p.budget - billed))}</span></div><Progress value={(billed / Math.max(1, p.budget)) * 100} /></div>
        <div className="grid grid-cols-2 gap-3"><Field label="Début"><Input type="date" value={p.start} onChange={(e) => up({ start: e.target.value })} /></Field><Field label="Échéance"><Input type="date" value={p.due} onChange={(e) => up({ due: e.target.value })} /></Field><Field label="Budget HT (MAD)"><Input type="number" value={p.budget} onChange={(e) => up({ budget: +e.target.value })} /></Field><Field label="Maintenance mensuelle (MAD)"><Input type="number" value={p.monthly || 0} onChange={(e) => up({ monthly: +e.target.value })} /></Field><Field label="Adresse du site" className="col-span-2"><div className="flex gap-2"><Input value={p.url || ''} placeholder="https://" onChange={(e) => up({ url: e.target.value })} />{p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" className="w-10 shrink-0 rounded-lg ring-1 ring-white/10 flex items-center justify-center"><ExternalLink size={15} /></a>}</div></Field></div>
        <div><p className="text-[12px] text-white/40 mb-2">Tâches · {Math.round(pct(p))} %</p>
          <ul className="space-y-1">{p.tasks.map((t) => <li key={t.id} className="group flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-white/[0.03]"><button onClick={() => up({ tasks: p.tasks.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)) })} className={t.done ? 'text-[#34D399]' : 'text-white/40'}>{t.done ? <CheckSquare size={17} /> : <Square size={17} />}</button><span className={cx('flex-1 text-[14px]', t.done && 'line-through text-white/40')}>{t.title}</span>{t.due && <span className="text-[11.5px] text-white/40">{fdate(t.due)}</span>}<button onClick={() => up({ tasks: p.tasks.filter((x) => x.id !== t.id) })} className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-[#FF8A7A]"><Trash2 size={14} /></button></li>)}</ul>
          <div className="mt-2 flex gap-2"><Input placeholder="Nouvelle tâche…" value={task} onChange={(e) => setTask(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTask()} /><Btn kind="soft" onClick={addTask}>Ajouter</Btn></div>
        </div>
      </div>
    </Drawer>
  );
};

const NewProject = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const s = useDB(); const [f, setF] = useState({ client_id: '', name: '', type: 'Site vitrine', budget: 15000, due: new Date(Date.now() + 21 * 864e5).toISOString().slice(0, 10) });
  const TEMPLATES: Record<string, string[]> = { 'Site vitrine': ['Appel de cadrage', 'Première version (72 h)', 'Retouches', 'Textes et photos', 'Fiche Google', 'Mise en ligne', 'Formation'], 'Site + réservation': ['Cadrage', 'Première version', 'Agenda et créneaux', 'Rappels WhatsApp', 'Tests mobile', 'Mise en ligne', 'Formation'], 'Boutique en ligne': ['Cadrage', 'Catalogue', 'Paiement CMI / livraison', 'Pages produits', 'Tests commandes', 'Mise en ligne'], 'Application web': ['Ateliers', 'Maquettes', 'Développement lot 1', 'Développement lot 2', 'Recette', 'Déploiement'], 'SEO & Google': ['Audit', 'Fiche Google', 'Pages ville', 'Données structurées', 'Rapport mensuel'] };
  const save = () => { if (!f.client_id || !f.name) return; db.insert('projects', { id: uid(), created_at: now(), ...f, stage: 'cadrage', start: now().slice(0, 10), tasks: (TEMPLATES[f.type] || []).map((t) => ({ id: uid(), title: t, done: false })) }); db.log('project', `Nouveau projet : ${f.name}`); onClose(); };
  return (
    <Modal open={open} onClose={onClose} title="Nouveau projet">
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Client *" className="sm:col-span-2"><Select value={f.client_id} onChange={(e) => setF({ ...f, client_id: e.target.value })} options={[['', 'Choisir…'], ...s.clients.map((c) => [c.id, c.company || c.name] as [string, string])]} /></Field>
        <Field label="Nom du projet *" className="sm:col-span-2"><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
        <Field label="Type (crée les tâches automatiquement)"><Select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })} options={Object.keys(TEMPLATES).map((k) => [k, k])} /></Field>
        <Field label="Budget HT (MAD)"><Input type="number" value={f.budget} onChange={(e) => setF({ ...f, budget: +e.target.value })} /></Field>
        <Field label="Échéance"><Input type="date" value={f.due} onChange={(e) => setF({ ...f, due: e.target.value })} /></Field>
      </div>
      <div className="mt-5 flex justify-end"><Btn kind="primary" onClick={save}>Créer le projet</Btn></div>
    </Modal>
  );
};
