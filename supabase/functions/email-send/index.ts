// Envoi d'e-mails depuis l'admin : message unique ou campagne newsletter (par lots, lien de désinscription).
import { cors, json, list, put, requireAdmin, mail, uid, now, unsubToken, log } from '../_shared/util.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (!(await requireAdmin(req))) return json({ error: 'non autorisé' }, 401);
  const b = await req.json();
  if (b.campaign) {
    const c = b.campaign; const subs = (await list('subscribers')).filter((x) => x.status === 'actif' && (c.segment === 'tous' || x.lang === c.segment));
    const base = `${Deno.env.get('SUPABASE_URL')}/functions/v1/unsubscribe`; let sent = 0;
    for (const s of subs) { const t = await unsubToken(s.email); const ok = await mail(s.email, c.subject, c.body, `<p style="margin-top:28px;font-size:12px;color:#56617A">Vous recevez cet e-mail car vous êtes inscrit à la newsletter Digilago. <a href="${base}?e=${encodeURIComponent(s.email)}&t=${t}">Se désinscrire</a></p>`); if (ok) sent++; await new Promise((r) => setTimeout(r, 120)); }
    await put('campaigns', { ...c, status: 'envoyee', sent_at: now(), recipients: sent }); await log('newsletter', `Campagne « ${c.subject} » envoyée à ${sent} abonnés`);
    return json({ ok: true, sent });
  }
  const ok = await mail(b.to, b.subject, b.body); await put('emails', { id: uid(), at: now(), to: b.to, subject: b.subject, status: ok ? 'envoye' : 'echec' });
  return json({ ok });
});
