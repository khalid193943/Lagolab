// Envoi WhatsApp depuis l'admin (réponses, relances, envois groupés). Réservé aux administrateurs.
import { cors, json, list, requireAdmin, waSend, storeOut, log } from '../_shared/util.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (!(await requireAdmin(req))) return json({ error: 'non autorisé' }, 401);
  const { number_id, to, text, template, template_lang, params } = await req.json();
  const n = (await list('numbers')).find((x) => x.id === number_id); if (!n?.phone_number_id) return json({ error: 'numéro non configuré' }, 400);
  try {
    // Hors fenêtre de 24 h, Meta impose un modèle approuvé : passez `template` (nom exact chez Meta)
    const id = await waSend(n.phone_number_id, to, text, template ? { name: template, lang: template_lang || 'fr', params } : undefined);
    await storeOut(n, to, to, text, false, id); return json({ ok: true, id });
  } catch (e) { await log('wa', `Échec d’envoi WhatsApp à ${to}`); return json({ error: String(e).slice(0, 300) }, 502); }
});
