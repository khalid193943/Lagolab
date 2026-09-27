// Réception des demandes du site public (formulaires, simulateur) → admin « Demandes » + automatisations.
import { cors, json, put, log, uid, now, runAutomations, mail } from '../_shared/util.ts';

const hits = new Map<string, number[]>(); // anti-abus simple par IP (5 demandes / 10 min)

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'method' }, 405);
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'x'; const t = Date.now();
  const recent = (hits.get(ip) || []).filter((x) => t - x < 6e5); if (recent.length >= 5) return json({ error: 'trop de demandes' }, 429); hits.set(ip, [...recent, t]);
  const b = await req.json().catch(() => null); if (!b) return json({ error: 'json' }, 400);
  if (b.website) return json({ ok: true }); // champ piège rempli : robot
  const clean = (v: unknown, n = 200) => (typeof v === 'string' ? v.trim().slice(0, n) : undefined);
  const lead = { id: uid(), created_at: now(), name: clean(b.name, 120), company: clean(b.company, 160), email: clean(b.email, 160), phone: clean(b.phone, 40), city: clean(b.city, 80), sector: clean(b.sector, 80), message: clean(b.message, 3000), source: clean(b.source, 40) || 'formulaire', lang: clean(b.lang, 4), page: clean(b.page, 200), status: 'nouveau', notes: [] };
  if (!lead.name || (!lead.phone && !lead.email)) return json({ error: 'nom et téléphone ou e-mail requis' }, 400);
  await put('leads', lead);
  await log('lead', `Nouvelle demande : ${lead.company || lead.name}${lead.city ? ` (${lead.city})` : ''}`, '/admin/demandes');
  const owner = Deno.env.get('OWNER_EMAIL');
  if (owner) await mail(owner, `Nouvelle demande : ${lead.company || lead.name}`, `${lead.name} · ${lead.company || ''}\n${lead.city || ''} · ${lead.sector || ''}\nTéléphone : ${lead.phone || '—'}\nE-mail : ${lead.email || '—'}\nSource : ${lead.source}\n\n${lead.message || ''}`).catch(() => null);
  await runAutomations('lead.created', { lead }).catch(() => null);
  return json({ ok: true });
});
