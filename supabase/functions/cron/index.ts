// Tâche quotidienne : relances des factures en retard (J+3 puis J+10) et résumé du jour par e-mail.
import { json, list, put, runAutomations, mail, log } from '../_shared/util.ts';

const ttc = (i: any) => i.items.reduce((s: number, x: any) => s + x.qty * x.price, 0) * (1 + i.tva / 100);
const paid = (i: any) => (i.payments || []).reduce((s: number, p: any) => s + p.amount, 0);

Deno.serve(async (req) => {
  if (req.headers.get('x-cron-secret') !== Deno.env.get('CRON_SECRET')) return json({ error: 'non autorisé' }, 401);
  const [invoices, clients, leads, projects] = await Promise.all([list('invoices'), list('clients'), list('leads'), list('projects')]);
  const today = new Date(); let reminded = 0;
  for (const i of invoices.filter((x) => x.kind === 'facture' && ['envoyee', 'partielle'].includes(x.status))) {
    const late = Math.floor((+today - +new Date(i.due)) / 864e5); if (late < 3) continue;
    const step = late >= 10 ? 2 : 1; if ((i.reminders || 0) >= step) continue;
    const client = clients.find((c) => c.id === i.client_id); const due = ttc(i) - paid(i); if (due <= 0) continue;
    await runAutomations('invoice.overdue', { invoice: { ...i, due_label: `${Math.round(due).toLocaleString('fr-MA')} MAD` }, client });
    i.reminders = step; await put('invoices', i); reminded++;
  }
  const fresh = leads.filter((l) => l.status === 'nouveau'); const soon = projects.filter((p) => !['maintenance', 'termine'].includes(p.stage) && (+new Date(p.due) - +today) / 864e5 <= 3);
  const owner = Deno.env.get('OWNER_EMAIL');
  if (owner) await mail(owner, `Digilago · votre journée`, `Bonjour,\n\n${fresh.length} demande(s) à traiter.\n${soon.length} projet(s) à livrer sous 3 jours : ${soon.map((p) => p.name).join(', ') || '—'}.\n${reminded} relance(s) de facture envoyée(s) automatiquement.\n\nBonne journée !`);
  await log('auto', `Tâche du jour : ${reminded} relance(s), ${fresh.length} demande(s) à traiter`);
  return json({ ok: true, reminded });
});
