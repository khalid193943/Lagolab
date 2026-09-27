/**
 * Formulaire de contact complet + envoi des demandes.
 * 1. Envoi au service de formulaire (FORM_ENDPOINT, voir config.ts) : la demande arrive par e-mail.
 * 2. Si le service n'est pas configuré ou échoue : ouverture de WhatsApp avec le message pré-rempli,
 *    et un lien e-mail de secours. Un champ piège invisible bloque les robots.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Loader2, MessageCircle, Mail } from 'lucide-react';
import { CONTACT, SECTORS } from './data';
import { FORM_ENDPOINT } from './config';
import { t, tv, L, lang } from './i18n';

export type Lead = { profile?: string; name: string; company?: string; email?: string; phone?: string; city?: string; sector?: string; message?: string; source: string };

const summary = (d: Lead) => [
  tv({ fr: 'Nouvelle demande Digilago', en: 'New Digilago request', ar: 'طلب جديد من موقع ديجيلاغو' }),
  `${tv({ fr: 'Nom', en: 'Name', ar: 'الاسم' })} : ${d.name}`,
  d.profile && `${tv({ fr: 'Profil', en: 'Profile', ar: 'الصفة' })} : ${d.profile}`,
  d.company && `${tv({ fr: 'Entreprise', en: 'Business', ar: 'الشركة' })} : ${d.company}`,
  d.city && `${tv({ fr: 'Ville', en: 'City', ar: 'المدينة' })} : ${d.city}`,
  d.sector && `${tv({ fr: 'Secteur', en: 'Sector', ar: 'القطاع' })} : ${t(d.sector)}`,
  d.phone && `${tv({ fr: 'Téléphone', en: 'Phone', ar: 'الهاتف' })} : ${d.phone}`,
  d.email && `E-mail : ${d.email}`,
  d.message && `\n${d.message}`,
].filter(Boolean).join('\n');

export const waLink = (d: Lead) => `https://wa.me/${CONTACT.tel.replace('+', '')}?text=${encodeURIComponent(summary(d))}`;
export const mailLink = (d: Lead) => `mailto:${CONTACT.email}?subject=${encodeURIComponent(tv({ fr: 'Demande depuis le site', en: 'Request from the website', ar: 'طلب من الموقع' }) + ' : ' + (d.company || d.name))}&body=${encodeURIComponent(summary(d))}`;

/* Envoi d'une demande :
 * 1. Admin Digilago en production (Supabase) : la demande arrive dans « Demandes » et déclenche les automatisations.
 * 2. Sinon, service de formulaire (FORM_ENDPOINT) : la demande arrive par e-mail.
 * 3. Toujours : copie locale pour l'admin en mode démo (même navigateur), utile pour tester.
 * Renvoie true si un service distant a bien reçu la demande. */
const SUPA = (import.meta as any).env?.VITE_SUPABASE_URL as string | undefined;
const SUPA_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string | undefined;
const localCopy = (coll: 'leads' | 'subscribers', item: Record<string, unknown>) => {
  try { const k = 'dg-admin-db-v1'; const raw = localStorage.getItem(k); if (!raw) return; const d = JSON.parse(raw); d[coll] = [item, ...(d[coll] || [])]; d.activity = [{ id: Math.random().toString(36).slice(2), at: new Date().toISOString(), kind: coll === 'leads' ? 'lead' : 'newsletter', text: coll === 'leads' ? `Nouvelle demande du site : ${item.company || item.name}` : `Nouvel abonné : ${item.email}`, ref: coll === 'leads' ? '/admin/demandes' : '/admin/emails' }, ...(d.activity || [])]; localStorage.setItem(k, JSON.stringify(d)); } catch { /* stockage indisponible */ }
};
const callFn = async (name: string, body: unknown) => { if (!SUPA || !SUPA_KEY) return false; try { const r = await fetch(`${SUPA}/functions/v1/${name}`, { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` }, body: JSON.stringify(body) }); return r.ok; } catch { return false; } };
export const submitLead = async (d: Lead): Promise<boolean> => {
  const item = { id: Math.random().toString(36).slice(2, 10) + Date.now().toString(36), created_at: new Date().toISOString(), ...d, lang: lang(), status: 'nouveau', notes: [], page: typeof location !== 'undefined' ? location.pathname : '' };
  localCopy('leads', item);
  if (await callFn('lead', item)) return true;
  if (!FORM_ENDPOINT) return false;
  try {
    const r = await fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ ...d, _subject: `Digilago : ${d.company || d.name}`, langue: lang(), page: location.href }) });
    return r.ok;
  } catch { return false; }
};
export const subscribe = async (email: string, source: string): Promise<boolean> => {
  const item = { id: Math.random().toString(36).slice(2, 10), created_at: new Date().toISOString(), email, lang: lang(), source, status: 'actif' };
  localCopy('subscribers', item);
  if (await callFn('subscribe', item)) return true;
  if (FORM_ENDPOINT) { try { const r = await fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ email, _subject: 'Newsletter Digilago', source }) }); return r.ok; } catch { return false; } }
  return true;
};

const field = 'mt-2 w-full h-12 rounded-xl bg-nuit border border-white/12 px-4 text-[16px] text-white placeholder:text-white/30 focus:outline-none focus:border-cyan transition-colors';

export const ContactForm = () => {
  const [f, setF] = useState({ profile: typeof location !== 'undefined' && new URLSearchParams(location.search).get('profil') === 'agence' ? 'agence' : 'entreprise', name: '', company: '', email: '', phone: '', city: '', sector: '', message: '', consent: false, website: '' });
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'fallback'>('idle');
  const [err, setErr] = useState<Record<string, string>>({});
  const set = (k: string, v: any) => { setF({ ...f, [k]: v }); if (err[k]) setErr({ ...err, [k]: '' }); };
  const lead: Lead = { profile: f.profile === 'agence' ? 'Agence / freelance (marque blanche)' : f.profile === 'autre' ? 'Autre' : 'Entreprise', name: f.name.trim(), company: f.company.trim(), email: f.email.trim(), phone: f.phone.trim(), city: f.city.trim(), sector: f.sector, message: f.message.trim(), source: 'contact' };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (f.website) return;                                        /* robot : on ignore */
    const E: Record<string, string> = {};
    if (!lead.name) E.name = tv({ fr: 'Indiquez votre nom.', en: 'Please enter your name.', ar: 'يرجى إدخال اسمك.' });
    if (!lead.email && !lead.phone) E.phone = tv({ fr: 'Laissez au moins un téléphone ou un e-mail.', en: 'Leave at least a phone number or an email.', ar: 'يرجى ترك رقم هاتف أو بريد إلكتروني على الأقل.' });
    if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) E.email = tv({ fr: 'Cette adresse e-mail semble incomplète.', en: 'This email address looks incomplete.', ar: 'يبدو أن هذا البريد الإلكتروني غير مكتمل.' });
    if (!f.consent) E.consent = tv({ fr: 'Merci d’accepter l’utilisation de vos données pour vous répondre.', en: 'Please agree to the use of your data so we can reply.', ar: 'يرجى الموافقة على استخدام بياناتك للرد عليك.' });
    setErr(E); if (Object.keys(E).length) return;
    setState('sending');
    const ok = await submitLead(lead);
    setState(ok ? 'sent' : 'fallback');
    if (!ok) window.open(waLink(lead), '_blank');
  };

  const Err = ({ k }: { k: string }) => err[k] ? <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1.5 text-[13px] text-[#FF8A7A]">{err[k]}</motion.p> : null;
  const label = 'text-[14px] text-brume';
  return (
    <div className="rounded-[28px] bg-nuit-2 ring-1 ring-white/10 p-6 md:p-10">
      <AnimatePresence mode="wait">
        {state === 'sent' || state === 'fallback' ? (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 14 }} className="mx-auto w-16 h-16 rounded-full bg-safran text-nuit flex items-center justify-center"><Check size={30} strokeWidth={2.4} /></motion.span>
            <h3 className="mt-6 text-[28px]">{state === 'sent' ? tv({ fr: 'Merci, votre demande est bien arrivée.', en: 'Thank you, your request has arrived.', ar: 'شكرًا لك، لقد وصلنا طلبك.' }) : tv({ fr: 'Votre demande est prête dans WhatsApp.', en: 'Your request is ready in WhatsApp.', ar: 'طلبك جاهز في واتساب.' })}</h3>
            <p className="mt-3 text-brume max-w-[46ch] mx-auto">{state === 'sent' ? tv({ fr: 'Nous vous répondons aujourd’hui, du lundi au samedi. Pour aller plus vite, écrivez-nous aussi sur WhatsApp.', en: 'We’ll get back to you today, Monday to Saturday. To go faster, you can also message us on WhatsApp.', ar: 'سنرد عليك اليوم، من الاثنين إلى السبت. وللتواصل بشكل أسرع، يمكنك مراسلتنا أيضًا عبر واتساب.' }) : tv({ fr: 'Envoyez le message dans WhatsApp pour nous le transmettre. Vous préférez l’e-mail ? Utilisez le bouton ci-dessous.', en: 'Send the message in WhatsApp to reach us. Prefer email? Use the button below.', ar: 'أرسل الرسالة عبر واتساب لتصلنا. تفضّل البريد الإلكتروني؟ استخدم الزر أدناه.' })}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href={waLink(lead)} target="_blank" rel="noopener noreferrer" className="btn btn-safran"><MessageCircle size={17} /> WhatsApp</a>
              <a href={mailLink(lead)} className="btn btn-line"><Mail size={17} /> {tv({ fr: 'Envoyer par e-mail', en: 'Send by email', ar: 'إرسال عبر البريد الإلكتروني' })}</a>
            </div>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={submit} noValidate exit={{ opacity: 0 }} className="grid sm:grid-cols-2 gap-x-4 gap-y-5">
            <div className="sm:col-span-2"><p className={label}>{tv({ fr: 'Vous êtes', en: 'You are', ar: 'أنت' })}</p><div className="mt-2 flex flex-wrap gap-2">{([['entreprise', { fr: 'Une entreprise', en: 'A business', ar: 'شركة' }], ['agence', { fr: 'Une agence ou un freelance (marque blanche)', en: 'An agency or freelancer (white label)', ar: 'وكالة أو مستقل (علامة بيضاء)' }], ['autre', { fr: 'Autre', en: 'Other', ar: 'أخرى' }]] as const).map(([k, l]) => <button type="button" key={k} onClick={() => set('profile', k)} aria-pressed={f.profile === k} className={`h-10 px-4 d-shape text-[14px] transition-colors ${f.profile === k ? 'bg-safran text-nuit' : 'ring-1 ring-white/15 text-white/75 hover:text-white'}`}>{tv(l)}</button>)}</div></div>
            <label className={label}>{tv({ fr: 'Nom et prénom', en: 'Full name', ar: 'الاسم الكامل' })} *<input value={f.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" className={field} aria-invalid={!!err.name} /><Err k="name" /></label>
            <label className={label}>{tv({ fr: 'Entreprise', en: 'Business', ar: 'الشركة' })}<input value={f.company} onChange={(e) => set('company', e.target.value)} autoComplete="organization" className={field} /></label>
            <label className={label}>{tv({ fr: 'Téléphone', en: 'Phone', ar: 'الهاتف' })}<input value={f.phone} onChange={(e) => set('phone', e.target.value)} type="tel" autoComplete="tel" dir="ltr" placeholder="06 …" className={field} aria-invalid={!!err.phone} /><Err k="phone" /></label>
            <label className={label}>E-mail<input value={f.email} onChange={(e) => set('email', e.target.value)} type="email" autoComplete="email" dir="ltr" className={field} aria-invalid={!!err.email} /><Err k="email" /></label>
            <label className={label}>{tv({ fr: 'Ville', en: 'City', ar: 'المدينة' })}<input value={f.city} onChange={(e) => set('city', e.target.value)} autoComplete="address-level2" className={field} /></label>
            <label className={label}>{tv({ fr: 'Secteur', en: 'Sector', ar: 'القطاع' })}<select value={f.sector} onChange={(e) => set('sector', e.target.value)} className={field}><option value="">—</option>{SECTORS.map((s) => <option key={s.id} value={s.short}>{t(s.short)}</option>)}<option value="Autre">{t('Autre')}</option></select></label>
            <label className={`${label} sm:col-span-2`}>{tv({ fr: 'Votre projet', en: 'Your project', ar: 'مشروعك' })}<textarea value={f.message} onChange={(e) => set('message', e.target.value)} rows={5} placeholder={tv({ fr: 'Ce que vous faites, ce que vous aimeriez obtenir…', en: 'What you do, what you would like to achieve…', ar: 'نشاطك، وما تطمح إلى تحقيقه…' })} className={`${field} h-auto py-3 resize-y`} /></label>
            {/* Champ piège anti-robots, invisible pour les humains */}
            <input tabIndex={-1} autoComplete="off" value={f.website} onChange={(e) => set('website', e.target.value)} name="website" aria-hidden className="absolute -start-[9999px] w-px h-px opacity-0" />
            <label className="sm:col-span-2 flex items-start gap-3 text-[14px] text-brume cursor-pointer">
              <input type="checkbox" checked={f.consent} onChange={(e) => set('consent', e.target.checked)} className="mt-1 w-5 h-5 accent-[#F4B53F] shrink-0" />
              <span>{tv({ fr: 'J’accepte que Digilago utilise ces informations pour me répondre, conformément à la ', en: 'I agree that Digilago may use this information to reply to me, in line with the ', ar: 'أوافق على أن تستخدم ديجيلاغو هذه المعلومات للرد عليّ، وفقًا لـ' })}<Link to={L('/confidentialite')} className="text-white underline underline-offset-4 hover:text-safran">{tv({ fr: 'politique de confidentialité', en: 'privacy policy', ar: 'سياسة الخصوصية' })}</Link>.</span>
            </label>
            <div className="sm:col-span-2"><Err k="consent" /></div>
            <button disabled={state === 'sending'} className="btn btn-safran btn-d sm:col-span-2 disabled:opacity-70" style={{ direction: 'ltr' }}>
              <span dir="auto" className="flex-1 text-start">{state === 'sending' ? tv({ fr: 'Envoi en cours…', en: 'Sending…', ar: 'جارٍ الإرسال…' }) : t('Commencer ma présence en ligne')}</span>
              {state === 'sending' ? <Loader2 size={20} className="animate-spin" /> : <span className="text-[13px] font-medium opacity-70">→</span>}
            </button>
            <p className="sm:col-span-2 text-[13px] text-brume">{tv({ fr: '* Champ obligatoire. Réponse le jour même, du lundi au samedi. Vous ne payez que si le résultat vous plaît.', en: '* Required. Same-day reply, Monday to Saturday. You only pay if you love the result.', ar: '* حقل إلزامي. نرد في اليوم نفسه، من الاثنين إلى السبت. لا تدفع إلا إذا نالت النتيجة إعجابك.' })}</p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};
