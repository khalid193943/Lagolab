// Lien de désinscription des newsletters : /functions/v1/unsubscribe?e=<email>&t=<jeton>
import { list, put, unsubToken } from '../_shared/util.ts';

Deno.serve(async (req) => {
  const u = new URL(req.url); const email = (u.searchParams.get('e') || '').toLowerCase(); const t = u.searchParams.get('t') || '';
  const page = (msg: string) => new Response(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Digilago</title><body style="font-family:Arial;background:#0A1428;color:#fff;display:grid;place-items:center;min-height:100vh;margin:0"><div style="text-align:center;padding:24px"><p style="font-size:24px;font-weight:700">digilago</p><p>${msg}</p></div>`, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  if (!email || t !== (await unsubToken(email))) return page('Lien invalide.');
  const s = (await list('subscribers')).find((x) => x.email === email); if (s) { s.status = 'desinscrit'; await put('subscribers', s); }
  return page('Vous êtes désinscrit. Vous ne recevrez plus nos e-mails.');
});
