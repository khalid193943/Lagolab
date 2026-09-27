import { useState } from 'react';
import { Building2, Plug, Database, Download, Upload, RotateCcw, CheckCircle2, CircleDashed } from 'lucide-react';
import { useDB, db, MODE, SUPA_URL, getDB } from '../store';
import { Panel, Btn, Input, Field, Badge } from '../kit';

export default function Settings() {
  const s = useDB(); const S = s.settings; const [imp, setImp] = useState('');
  const set = (k: keyof typeof S) => (e: React.ChangeEvent<HTMLInputElement>) => db.settings({ [k]: e.target.type === 'number' ? +e.target.value : e.target.value } as any);
  const backup = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(getDB(), null, 2)], { type: 'application/json' })); a.download = `digilago-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`; a.click(); };
  const integ: [string, boolean, string][] = [
    ['Base de données Supabase', MODE === 'live', MODE === 'live' ? SUPA_URL.replace('https://', '') : 'VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY à définir'],
    ['WhatsApp Cloud API · ' + (s.numbers[0]?.label || 'numéro 1'), !!s.numbers[0]?.phone_number_id, s.numbers[0]?.phone_number_id ? 'Phone number ID renseigné' : 'Secrets WA_TOKEN et phone number ID à configurer'],
    ['WhatsApp Cloud API · ' + (s.numbers[1]?.label || 'numéro 2'), !!s.numbers[1]?.phone_number_id, s.numbers[1]?.phone_number_id ? 'Phone number ID renseigné' : 'Deuxième numéro à relier'],
    ['E-mails (Resend)', MODE === 'live', 'Secret RESEND_API_KEY et domaine vérifié'],
    ['Assistant IA (Claude)', MODE === 'live', 'Secret ANTHROPIC_API_KEY sur le serveur'],
    ['Formulaires du site → Demandes', MODE === 'live', 'Automatique quand Supabase est configuré'],
  ];
  return (
    <div className="space-y-5 max-w-[1100px] mx-auto">
      <div><h1 className="font-display text-[26px] tracking-[-0.03em]">Paramètres</h1><p className="text-[13.5px] text-brume">Informations légales (reprises sur les factures), numérotation, intégrations et sauvegardes.</p></div>
      <Panel title={<span className="flex items-center gap-2"><Building2 size={16} />Société</span>}>
        <div className="grid md:grid-cols-2 gap-3">
          <Field label="Nom commercial"><Input value={S.company} onChange={set('company')} /></Field><Field label="Forme juridique et capital"><Input value={S.legal} onChange={set('legal')} /></Field>
          <Field label="Adresse" className="md:col-span-2"><Input value={S.address} onChange={set('address')} /></Field>
          <Field label="ICE"><Input value={S.ice} onChange={set('ice')} /></Field><Field label="RC"><Input value={S.rc} onChange={set('rc')} /></Field><Field label="Identifiant fiscal (IF)"><Input value={S.if_} onChange={set('if_')} /></Field><Field label="RIB (pour les virements)"><Input value={S.rib} onChange={set('rib')} /></Field>
          <Field label="E-mail d’envoi"><Input value={S.email_from} onChange={set('email_from')} /></Field><Field label="TVA par défaut (%)"><Input type="number" value={S.tva} onChange={set('tva')} /></Field>
          <Field label="Préfixe des factures"><Input value={S.invoice_prefix} onChange={set('invoice_prefix')} /></Field><Field label="Préfixe des devis"><Input value={S.quote_prefix} onChange={set('quote_prefix')} /></Field>
        </div>
      </Panel>
      <Panel title={<span className="flex items-center gap-2"><Plug size={16} />Intégrations</span>}>
        <ul className="divide-y divide-white/[0.05]">{integ.map(([n, ok, d]) => <li key={n} className="py-3 flex items-center gap-3">{ok ? <CheckCircle2 size={18} className="text-[#34D399]" /> : <CircleDashed size={18} className="text-white/35" />}<div className="flex-1"><p className="text-[14px]">{n}</p><p className="text-[12.5px] text-brume">{d}</p></div><Badge tone={ok ? 'good' : 'mute'}>{ok ? 'Actif' : 'À configurer'}</Badge></li>)}</ul>
        <p className="mt-3 text-[12.5px] text-brume">Le guide pas à pas est dans le fichier ADMIN.md du code source (Supabase, Meta WhatsApp, Resend, Claude).</p>
      </Panel>
      <Panel title={<span className="flex items-center gap-2"><Database size={16} />Données</span>}>
        <div className="flex flex-wrap gap-2"><Btn kind="soft" onClick={backup}><Download size={15} />Télécharger une sauvegarde (JSON)</Btn>{MODE === 'demo' && <Btn kind="danger" onClick={() => { if (confirm('Remettre les données de démonstration ? Vos modifications locales seront perdues.')) db.reset(); }}><RotateCcw size={15} />Réinitialiser la démo</Btn>}</div>
        {MODE === 'demo' && <div className="mt-4"><Field label="Restaurer une sauvegarde (coller le contenu JSON)"><textarea value={imp} onChange={(e) => setImp(e.target.value)} rows={3} className="w-full rounded-lg bg-nuit/70 ring-1 ring-white/10 p-3 text-[12px] font-mono" /></Field><Btn kind="soft" className="mt-2" onClick={() => { try { const d = JSON.parse(imp); localStorage.setItem('dg-admin-db-v1', JSON.stringify(d)); location.reload(); } catch { alert('JSON invalide'); } }}><Upload size={15} />Restaurer</Btn></div>}
      </Panel>
    </div>
  );
}
