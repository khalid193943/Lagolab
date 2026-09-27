// Assistant IA de l'admin : répond à partir d'un résumé chiffré de vos données (Claude, API Anthropic).
import { cors, json, requireAdmin } from '../_shared/util.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (!(await requireAdmin(req))) return json({ error: 'non autorisé' }, 401);
  const { question, context } = await req.json();
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST', headers: { 'x-api-key': Deno.env.get('ANTHROPIC_API_KEY')!, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: Deno.env.get('ANTHROPIC_MODEL') || 'claude-sonnet-5', max_tokens: 900,
      system: 'Tu es l’assistant de gestion de Digilago, agence web marocaine. Réponds en français, de façon concise et concrète, avec des chiffres en MAD. Appuie-toi uniquement sur les données fournies ; si une information manque, dis-le. Propose une action claire à la fin.',
      messages: [{ role: 'user', content: `Données de l’entreprise (JSON) :\n${JSON.stringify(context).slice(0, 60000)}\n\nQuestion : ${question}` }] }),
  });
  const j = await r.json(); if (!r.ok) return json({ error: j }, 502);
  return json({ answer: j.content?.map((c: any) => c.text || '').join('') });
});
