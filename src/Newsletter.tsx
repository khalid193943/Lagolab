/** Inscription à la newsletter (pied de page) : e-mail + consentement, envoyé vers l'admin (abonnés). */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { tv, L } from './i18n';
import { subscribe } from './form';

export const Newsletter = () => {
  const [email, setEmail] = useState(''); const [ok, setOk] = useState(false); const [consent, setConsent] = useState(false); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const go = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setErr(tv({ fr: 'Adresse e-mail invalide.', en: 'Invalid email address.', ar: 'بريد إلكتروني غير صالح.' }));
    if (!consent) return setErr(tv({ fr: 'Merci de cocher la case.', en: 'Please tick the box.', ar: 'يرجى تحديد الخانة.' }));
    setBusy(true); await subscribe(email, 'pied de page'); setBusy(false); setOk(true);
  };
  return (
    <div className="rounded-3xl bg-nuit-2 ring-1 ring-white/10 p-6 md:p-8 grid lg:grid-cols-12 gap-6 items-center">
      <div className="lg:col-span-5"><p className="font-display text-[22px]">{tv({ fr: 'Un conseil par mois pour être trouvé en ligne.', en: 'One tip a month to get found online.', ar: 'نصيحة كل شهر لتظهر على الإنترنت.' })}</p><p className="mt-1 text-[14px] text-brume">{tv({ fr: 'Google, Maps, IA : du concret pour les entreprises marocaines. Désinscription en un clic.', en: 'Google, Maps, AI: practical advice for Moroccan businesses. Unsubscribe in one click.', ar: 'Google والخرائط والذكاء الاصطناعي: نصائح عملية للشركات المغربية. إلغاء الاشتراك بنقرة واحدة.' })}</p></div>
      {ok ? <p className="lg:col-span-7 flex items-center gap-3 text-[15px]"><span className="w-9 h-9 rounded-full bg-safran text-nuit flex items-center justify-center"><Check size={18} /></span>{tv({ fr: 'Merci, vous êtes inscrit !', en: 'Thanks, you’re subscribed!', ar: 'شكرًا، تم تسجيلك!' })}</p> : (
        <form onSubmit={go} noValidate className="lg:col-span-7">
          <div className="flex flex-col sm:flex-row gap-3"><input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErr(''); }} placeholder={tv({ fr: 'Votre e-mail', en: 'Your email', ar: 'بريدك الإلكتروني' })} dir="ltr" autoComplete="email" className="flex-1 h-12 rounded-xl bg-nuit border border-white/12 px-4 text-[16px] text-white placeholder:text-white/30 focus:outline-none focus:border-cyan" /><button disabled={busy} className="btn btn-safran h-12 shrink-0">{tv({ fr: 'S’inscrire', en: 'Subscribe', ar: 'اشترك' })}</button></div>
          <label className="mt-3 flex items-start gap-2.5 text-[13px] text-brume cursor-pointer"><input type="checkbox" checked={consent} onChange={(e) => { setConsent(e.target.checked); setErr(''); }} className="mt-0.5 w-4 h-4 accent-[#F4B53F] shrink-0" /><span>{tv({ fr: 'J’accepte de recevoir la newsletter de Digilago (', en: 'I agree to receive the Digilago newsletter (', ar: 'أوافق على تلقي النشرة الإخبارية لديجيلاغو (' })}<Link to={L('/confidentialite')} className="text-white underline underline-offset-4">{tv({ fr: 'confidentialité', en: 'privacy', ar: 'الخصوصية' })}</Link>).</span></label>
          {err && <p className="mt-2 text-[13px] text-[#FF8A7A]">{err}</p>}
        </form>
      )}
    </div>
  );
};
