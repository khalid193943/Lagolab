import { Phone, Mail, MapPin, MessageCircle, Clock } from 'lucide-react';
import { t, tv, L } from '../i18n';
import { CONTACT, IMG } from '../data';
import { Reveal, Img } from '../ui';
import { FinalCTA, Faq } from '../sections';
import { ScrollText, spot, RevealImg } from '../fx';
import { Head } from '../ui';

export default function Contact() {
  const ways: [any, string, string, string][] = [[MessageCircle, 'WhatsApp', 'Réponse le jour même', CONTACT.whatsapp], [Phone, 'Téléphone', CONTACT.phone, `tel:${CONTACT.tel}`], [Mail, 'E-mail', CONTACT.email, `mailto:${CONTACT.email}`], [MapPin, 'Adresse', 'El Jadida, Maroc', 'https://maps.google.com/?q=El+Jadida']];
  return (
    <>
      <section className="dark relative overflow-hidden pt-36 pb-20 lg:pt-44"><Img src={IMG.night} alt="" eager className="absolute inset-0 w-full h-full object-cover opacity-50" /><div className="absolute inset-0 rtl-flip bg-gradient-to-r from-nuit via-nuit/90 to-nuit/60" />
        <div className="wrap relative"><Reveal><p className="kicker">{t('Contact')}</p></Reveal><ScrollText auto as="h1" text={t('Parlons de votre projet.')} className="mt-5 text-[clamp(2.6rem,6vw,5.4rem)] leading-[1] max-w-[16ch]" /><Reveal delay={0.5}><p className="mt-7 text-[19px] text-white/75 max-w-[50ch]">{t('Dix minutes d’échange suffisent pour démarrer. Choisissez le canal qui vous convient, nous répondons le jour même.')}</p></Reveal>
          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">{ways.map(([I, lb, v, h], i) => <Reveal key={lb} delay={i * 0.05}><a href={h} target={h.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" onMouseMove={spot} className="spot block h-full rounded-2xl bg-nuit-2/90 backdrop-blur ring-1 ring-white/10 p-5 sm:p-6 active:scale-[.97] transition-transform hover:ring-safran/60 transition-shadow"><I size={22} className="text-cyan" /><p className="mt-5 text-brume text-[13px] sm:text-[14px]">{t(lb)}</p><p className="mt-1 font-display text-[15px] sm:text-[18px] font-medium break-words"><bdi dir={v.startsWith('+') || v.includes('@') ? 'ltr' : undefined}>{t(v)}</bdi></p></a></Reveal>)}</div>
          <p className="mt-8 flex items-center gap-2 text-brume text-[15px]"><Clock size={16} /> {t('Lundi au samedi, de 9 h à 19 h.')}</p>
        </div>
      </section>
      <section className="light py-20 md:py-24 lg:py-32"><div className="wrap grid lg:grid-cols-12 gap-12 items-center">
        <RevealImg src={IMG.hero} alt={t('Le studio Digilago à El Jadida')} ratio="aspect-[16/11]" className="lg:col-span-7" />
        <div className="lg:col-span-5"><Head kicker={t('Rendez-vous')} title={t('Sur place à El Jadida, ou en visio partout au Maroc.')} lead={t('Nous vous recevons au studio, nous nous déplaçons chez vous quand c’est utile, ou nous échangeons en visio. Le premier rendez-vous est toujours offert.')} />
          <Reveal delay={0.1}><ul className="mt-8 space-y-3 text-[16px]">{['Réponse le jour même, du lundi au samedi', 'Devis écrit avant tout engagement', 'Première version offerte sous 72 heures'].map((x) => <li key={x} className="flex gap-3"><span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-[#0E8FA0] shrink-0" />{t(x)}</li>)}</ul></Reveal></div>
      </div></section>
      <FinalCTA />
      <section className="light py-24"><div className="wrap max-w-4xl"><ScrollText text={t('Questions fréquentes')} className="text-[clamp(2rem,4vw,3.2rem)]" /><div className="mt-10"><Faq /></div></div></section>
    </>
  );
}
