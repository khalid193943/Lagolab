import { Phone, Mail, MapPin, MessageCircle, Clock } from 'lucide-react';
import { Seo } from '../seo';
import { t, tv, L } from '../i18n';
import { CONTACT, IMG } from '../data';
import { Reveal, Img, Head } from '../ui';
import { Faq } from '../sections';
import { ContactForm } from '../form';
import { ScrollText, spot, RevealImg } from '../fx';

export default function Contact() {
  const ways: [any, string, string, string][] = [[MessageCircle, 'WhatsApp', 'Réponse le jour même', CONTACT.whatsapp], [Phone, 'Téléphone', CONTACT.phone, `tel:${CONTACT.tel}`], [Mail, 'E-mail', CONTACT.email, `mailto:${CONTACT.email}`], [MapPin, 'Adresse', 'El Jadida, Maroc', 'https://maps.google.com/?q=El+Jadida']];
  return (
    <>
      <Seo title={tv({ fr: 'Contact et devis site web au Maroc | Digilago', en: 'Contact and website quote in Morocco | Digilago', ar: 'اتصل بنا واطلب عرض سعر لموقعك في المغرب | ديجيلاغو' })} description={tv({ fr: 'Parlez-nous de votre projet de site web : réponse le jour même par WhatsApp, téléphone ou e-mail. Studio à El Jadida, entreprises dans tout le Maroc.', en: 'Tell us about your website project: same-day reply by WhatsApp, phone or email. Studio in El Jadida, clients across Morocco.', ar: 'حدّثنا عن مشروع موقعك: نرد في اليوم نفسه عبر واتساب أو الهاتف أو البريد الإلكتروني. استوديو في الجديدة، وعملاء في كل المغرب.' })} crumbs={[[t('Accueil'), '/'], [t('Contact'), '/contact']]} />
      <section className="dark relative overflow-hidden pt-36 pb-20 lg:pt-44"><Img src={IMG.night} alt="" eager className="absolute inset-0 w-full h-full object-cover opacity-50" /><div className="absolute inset-0 rtl-flip bg-gradient-to-r from-nuit via-nuit/90 to-nuit/60" />
        <div className="wrap relative"><Reveal><p className="kicker">{t('Contact')}</p></Reveal><ScrollText auto as="h1" text={t('Parlons de votre projet.')} className="mt-5 text-[clamp(2.34rem,5.4vw,4.86rem)] leading-[1] max-w-[16ch]" /><Reveal delay={0.5}><p className="mt-7 text-[19px] text-white/75 max-w-[50ch]">{t('Dix minutes d’échange suffisent pour démarrer. Choisissez le canal qui vous convient, nous répondons le jour même.')}</p></Reveal>
          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">{ways.map(([I, lb, v, h], i) => <Reveal key={lb} delay={i * 0.05}><a href={h} target={h.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" onMouseMove={spot} className="spot block h-full rounded-2xl bg-nuit-2/90 backdrop-blur ring-1 ring-white/10 p-5 sm:p-6 active:scale-[.97] transition-transform hover:ring-safran/60 transition-shadow"><I size={22} className="text-cyan" /><p className="mt-5 text-brume text-[13px] sm:text-[14px]">{t(lb)}</p><p className="mt-1 font-display text-[15px] sm:text-[18px] font-medium break-words"><bdi dir={v.startsWith('+') || v.includes('@') ? 'ltr' : undefined}>{t(v)}</bdi></p></a></Reveal>)}</div>
          <p className="mt-8 flex items-center gap-2 text-brume text-[15px]"><Clock size={16} /> {t('Lundi au samedi, de 9 h à 19 h.')}</p>
        </div>
      </section>
      <section className="light py-32 md:py-40 lg:py-52"><div className="wrap grid lg:grid-cols-12 gap-12 items-center">
        <RevealImg src={IMG.hero} alt={t('Le studio Digilago à El Jadida')} ratio="aspect-[16/11]" className="lg:col-span-7" />
        <div className="lg:col-span-5"><Head kicker={t('Rendez-vous')} title={t('Sur place à El Jadida, ou en visio partout au Maroc.')} lead={t('Nous vous recevons au studio, nous nous déplaçons chez vous quand c’est utile, ou nous échangeons en visio. Le premier rendez-vous est sans engagement.')} />
          <Reveal delay={0.1}><ul className="mt-8 space-y-3 text-[16px]">{['Réponse le jour même, du lundi au samedi', 'Devis écrit avant tout engagement', 'Première version sous 72 heures, sans engagement'].map((x) => <li key={x} className="flex gap-3"><span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-[#0E8FA0] shrink-0" />{t(x)}</li>)}</ul></Reveal></div>
      </div></section>
      <section id="formulaire" className="dark relative overflow-hidden py-32 md:py-40 lg:py-52 scroll-mt-20">
        <Img src={IMG.zellige} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-nuit via-nuit/85 to-nuit" />
        <div className="wrap relative grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4"><Head kicker={tv({ fr: 'Formulaire', en: 'Form', ar: 'الاستمارة' })} title={tv({ fr: 'Parlez-nous de votre projet.', en: 'Tell us about your project.', ar: 'حدّثنا عن مشروعك.' })} lead={tv({ fr: 'Quelques lignes suffisent. Nous revenons vers vous le jour même avec les prochaines étapes, et vous ne payez que si le résultat vous plaît.', en: 'A few lines are enough. We get back to you the same day with next steps, and you only pay if you love the result.', ar: 'بضعة أسطر تكفي. نعود إليك في اليوم نفسه بالخطوات التالية، ولا تدفع إلا إذا نالت النتيجة إعجابك.' })} /></div>
          <Reveal delay={0.1} className="lg:col-span-8"><ContactForm /></Reveal>
        </div>
      </section>
      <section className="light py-32 md:py-40 lg:py-52"><div className="wrap max-w-4xl"><ScrollText text={t('Questions fréquentes')} className="text-[clamp(1.8rem,3.6vw,2.88rem)]" /><div className="mt-10"><Faq /></div></div></section>
    </>
  );
}
