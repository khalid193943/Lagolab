// Webhook WhatsApp Cloud API : reçoit les messages de vos deux numéros → admin « WhatsApp » (temps réel).
// URL à déclarer chez Meta : https://<PROJET>.supabase.co/functions/v1/whatsapp-webhook  (jeton : WA_VERIFY_TOKEN)
import { list, get, put, log, now, waSend, storeOut, runAutomations } from '../_shared/util.ts';

const verifySig = async (req: Request, raw: string) => {
  const secret = Deno.env.get('WA_APP_SECRET'); if (!secret) return true;
  const sig = req.headers.get('x-hub-signature-256')?.replace('sha256=', '') || '';
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const mac = Array.from(new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(raw)))).map((b) => b.toString(16).padStart(2, '0')).join('');
  return mac === sig;
};
/* Horaires : lundi–samedi, 9 h–19 h, heure du Maroc */
const openNow = () => { const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Casablanca' })); return d.getDay() !== 0 && d.getHours() >= 9 && d.getHours() < 19; };

Deno.serve(async (req) => {
  const u = new URL(req.url);
  if (req.method === 'GET') return u.searchParams.get('hub.verify_token') === Deno.env.get('WA_VERIFY_TOKEN') ? new Response(u.searchParams.get('hub.challenge') || '') : new Response('forbidden', { status: 403 });
  const raw = await req.text(); if (!(await verifySig(req, raw))) return new Response('bad signature', { status: 401 });
  const body = JSON.parse(raw); const numbers = await list('numbers');
  for (const entry of body.entry || []) for (const ch of entry.changes || []) {
    const v = ch.value || {}; const number = numbers.find((n) => n.phone_number_id === v.metadata?.phone_number_id); if (!number) continue;
    for (const st of v.statuses || []) { const conv = await get(`${number.id}:${st.recipient_id}`); if (!conv) continue; const m = conv.messages.find((x: any) => x.id === st.id); if (m) { m.status = st.status === 'read' ? 'lu' : st.status === 'delivered' ? 'livre' : st.status === 'failed' ? 'echec' : m.status; await put('conversations', conv); } }
    for (const msg of v.messages || []) {
      const from = msg.from; const name = v.contacts?.find((c: any) => c.wa_id === from)?.profile?.name || `+${from}`;
      const text = msg.text?.body || msg.button?.text || msg.interactive?.button_reply?.title || `[${msg.type}]`;
      const convId = `${number.id}:${from}`; const conv = (await get(convId)) || { id: convId, number_id: number.id, name, phone: `+${from}`, unread: 0, tags: [], messages: [] };
      const first = conv.messages.length === 0; conv.messages.push({ id: msg.id, dir: 'in', text, at: now() }); conv.unread = (conv.unread || 0) + 1; await put('conversations', conv);
      await log('wa', `WhatsApp (${number.label}) : ${name} · « ${text.slice(0, 60)} »`, '/admin/whatsapp');
      // Réponse hors horaires (une fois par conversation et par jour)
      const today = now().slice(0, 10);
      if (number.hours && number.away && !openNow() && conv.away_sent !== today) { try { const id = await waSend(number.phone_number_id, from, number.away); await storeOut(number, `+${from}`, name, number.away, true, id); const c2 = await get(convId); if (c2) { c2.away_sent = today; await put('conversations', c2); } } catch { /* */ } }
      // Mots-clés configurés dans les automatisations (ex. « prix, tarif, combien »)
      for (const a of (await list('automations')).filter((x) => x.enabled && x.trigger === 'wa.keyword')) {
        const words = String(a.condition || '').split(',').map((w: string) => w.trim().toLowerCase()).filter(Boolean);
        if (words.some((w: string) => text.toLowerCase().includes(w))) for (const act of a.actions || []) if (act.type === 'whatsapp' && act.text) { try { const id = await waSend(number.phone_number_id, from, act.text); await storeOut(number, `+${from}`, name, act.text, true, id); } catch { /* */ } }
      }
      // Premier message sur le numéro commercial : crée une demande
      if (first && /commercial/i.test(number.label)) { const lead = { id: crypto.randomUUID().slice(0, 14), created_at: now(), name, phone: `+${from}`, message: text, source: 'whatsapp', status: 'nouveau', notes: [] }; await put('leads', lead); await runAutomations('lead.created', { lead }).catch(() => null); }
    }
  }
  return new Response('ok');
});
