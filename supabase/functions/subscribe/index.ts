// Inscription newsletter depuis le site public → admin « Abonnés » + e-mail de bienvenue (automatisation).
import { cors, json, list, put, log, uid, now, runAutomations } from '../_shared/util.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const b = await req.json().catch(() => null); const email = String(b?.email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'email' }, 400);
  const existing = (await list('subscribers')).find((x) => x.email === email);
  if (existing) { if (existing.status !== 'actif') { existing.status = 'actif'; await put('subscribers', existing); } return json({ ok: true }); }
  const sub = { id: uid(), created_at: now(), email, lang: String(b?.lang || 'fr').slice(0, 2), source: String(b?.source || 'site').slice(0, 40), status: 'actif' };
  await put('subscribers', sub); await log('newsletter', `Nouvel abonné : ${email}`, '/admin/emails');
  await runAutomations('subscriber.created', { subscriber: sub }).catch(() => null);
  return json({ ok: true });
});
