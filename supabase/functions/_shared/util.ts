// Outils partagés par les fonctions serveur Digilago (Deno, Supabase Edge Functions).
const URL_ = Deno.env.get('SUPABASE_URL')!;
const SERVICE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
export const cors = { 'Access-Control-Allow-Origin': Deno.env.get('SITE_ORIGIN') || '*', 'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-cron-secret', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS' };
export const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
export const uid = () => crypto.randomUUID().replace(/-/g, '').slice(0, 14);
export const now = () => new Date().toISOString();

const rest = (path: string, init: RequestInit = {}) => fetch(`${URL_}/rest/v1/${path}`, { ...init, headers: { apikey: SERVICE, Authorization: `Bearer ${SERVICE}`, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal', ...(init.headers || {}) } });
export const list = async (collection: string): Promise<any[]> => { const r = await rest(`records?collection=eq.${collection}&select=id,data`); return r.ok ? (await r.json()).map((x: any) => ({ ...x.data, id: x.id })) : []; };
export const get = async (id: string): Promise<any | null> => { const r = await rest(`records?id=eq.${encodeURIComponent(id)}&select=id,data`); const j = r.ok ? await r.json() : []; return j[0] ? { ...j[0].data, id: j[0].id } : null; };
export const put = (collection: string, item: any) => rest('records', { method: 'POST', body: JSON.stringify({ id: item.id, collection, data: item }) });
export const log = (kind: string, text: string, ref?: string) => put('activity', { id: uid(), at: now(), kind, text, ref });
export const fill = (tpl: string, v: Record<string, string | undefined>) => tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => v[k] || '');

/* Vérifie que l'appelant est un administrateur connecté */
export const requireAdmin = async (req: Request) => {
  const token = (req.headers.get('Authorization') || '').replace('Bearer ', '');
  const u = await fetch(`${URL_}/auth/v1/user`, { headers: { apikey: SERVICE, Authorization: `Bearer ${token}` } });
  if (!u.ok) return false; const user = await u.json();
  const a = await rest(`admins?user_id=eq.${user.id}&select=user_id`); return a.ok && (await a.json()).length > 0;
};

/* WhatsApp Cloud API (Meta). Un jeton système peut gérer vos deux numéros du même compte WhatsApp Business.
   Si chaque numéro a son propre jeton : secrets WA_TOKEN_<phone_number_id>. */
export const waSend = async (phoneNumberId: string, to: string, text: string, template?: { name: string; lang: string; params?: string[] }) => {
  const token = Deno.env.get(`WA_TOKEN_${phoneNumberId}`) || Deno.env.get('WA_TOKEN');
  const body = template
    ? { messaging_product: 'whatsapp', to: to.replace(/\D/g, ''), type: 'template', template: { name: template.name, language: { code: template.lang }, components: template.params?.length ? [{ type: 'body', parameters: template.params.map((t) => ({ type: 'text', text: t })) }] : undefined } }
    : { messaging_product: 'whatsapp', to: to.replace(/\D/g, ''), type: 'text', text: { body: text, preview_url: true } };
  const r = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const j = await r.json(); if (!r.ok) throw new Error(JSON.stringify(j)); return j.messages?.[0]?.id as string;
};

/* Enregistre un message sortant dans la conversation (créée si besoin) */
export const storeOut = async (number: any, to: string, name: string, text: string, auto = false, wamid?: string) => {
  const convId = `${number.id}:${to.replace(/\D/g, '')}`; const conv = (await get(convId)) || { id: convId, number_id: number.id, name, phone: to, unread: 0, tags: [], messages: [] };
  conv.messages.push({ id: wamid || uid(), dir: 'out', text, at: now(), status: 'envoye', auto }); await put('conversations', conv); return conv;
};

/* E-mails via Resend (https://resend.com) : domaine d'envoi vérifié requis */
export const mail = async (to: string | string[], subject: string, text: string, footer = '') => {
  const from = Deno.env.get('MAIL_FROM') || 'Digilago <contact@digilago.ma>';
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#0A1428;max-width:560px"><p style="font-size:22px;font-weight:700;letter-spacing:-0.5px">digilago</p>${text.split('\n').map((l) => `<p style="margin:0 0 10px">${l.replace(/</g, '&lt;')}</p>`).join('')}${footer}</div>`;
  const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${Deno.env.get('RESEND_API_KEY')}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from, to, subject, text, html }) });
  return r.ok;
};

/* Jeton de désinscription (HMAC) pour les liens des newsletters */
export const unsubToken = async (email: string) => {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(Deno.env.get('UNSUB_SECRET') || SERVICE), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(email.toLowerCase()));
  return Array.from(new Uint8Array(sig)).slice(0, 12).map((b) => b.toString(16).padStart(2, '0')).join('');
};

/* Moteur d'automatisations côté serveur (mêmes règles que l'admin) */
export const runAutomations = async (trigger: string, ctx: { lead?: any; invoice?: any; subscriber?: any; client?: any }) => {
  const [autos, templates, numbers] = await Promise.all([list('automations'), list('templates'), list('numbers')]);
  const done: string[] = [];
  for (const a of autos.filter((x) => x.enabled && x.trigger === trigger)) {
    const l = ctx.lead, c = ctx.client;
    if (a.condition?.includes('téléphone') && !l?.phone) continue;
    if (a.condition?.includes('e-mail') && !(l?.email || ctx.subscriber?.email)) continue;
    for (const act of a.actions || []) {
      const t = templates.find((x) => x.id === act.template_id);
      const vars = { prenom: String(l?.name || c?.name || '').split(' ')[0], entreprise: l?.company || c?.company, ville: l?.city, facture: ctx.invoice?.number, montant: ctx.invoice?.due_label, echeance: ctx.invoice?.due, lien: Deno.env.get('SITE_URL') || 'https://digilago.ma' };
      try {
        if (act.type === 'whatsapp') { const n = numbers.find((x) => x.id === act.number_id); const to = l?.phone || c?.phone; if (!n?.phone_number_id || !to) continue; const text = act.text || fill(t?.body || '', vars); const id = await waSend(n.phone_number_id, to, text); await storeOut(n, to, [l?.name, l?.company].filter(Boolean).join(' · ') || c?.company || to, text, true, id); done.push(`WhatsApp « ${t?.name || 'message'} »`); }
        if (act.type === 'email') { const to = l?.email || ctx.subscriber?.email || c?.email; if (!to || !t) continue; const subject = fill(t.subject || 'Digilago', vars); await mail(to, subject, fill(t.body, vars)); await put('emails', { id: uid(), at: now(), to, subject, status: 'envoye', ref: t.name }); done.push(`E-mail « ${t.name} »`); }
        if (act.type === 'task' && l) { l.next_at = new Date(Date.now() + (act.delay_h || 24) * 36e5).toISOString(); await put('leads', l); }
      } catch (e) { await log('auto', `Échec automatisation « ${a.name} » : ${String(e).slice(0, 120)}`); }
    }
    a.runs = (a.runs || 0) + 1; a.last_run = now(); await put('automations', a);
  }
  for (const d of done) await log('auto', `Automatisation : ${d}`);
  return done;
};
