import { Phone, Mail, MapPin, MessageCircle, Clock } from 'lucide-react';
import { CONTACT, IMG } from '../data';
import { Reveal, Img } from '../ui';
import { FinalCTA, Faq } from '../sections';

export default function Contact() {
  const ways: [any, string, string, string][] = [[MessageCircle, 'WhatsApp', 'Réponse le jour même', CONTACT.whatsapp], [Phone, 'Téléphone', CONTACT.phone, `tel:${CONTACT.tel}`], [Mail, 'E-mail', CONTACT.email, `mailto:${CONTACT.email}`], [MapPin, 'Adresse', 'El Jadida, Maroc', 'https://maps.google.com/?q=El+Jadida']];
  return (
    <>
      <section className="dark relative overflow-hidden pt-36 pb-20 lg:pt-44"><Img src={IMG.maps} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" /><div className="absolute inset-0 bg-gradient-to-r from-nuit via-nuit/90 to-nuit/60" />
        <div className="wrap relative"><Reveal><p className="kicker">Contact</p><h1 className="mt-4 text-[clamp(2.6rem,6vw,5.4rem)] font-bold tracking-[-0.05em] leading-[0.98] max-w-[16ch]">Parlons de votre projet.</h1><p className="mt-6 text-[19px] text-white/80 max-w-[50ch]">Un appel de dix minutes suffit pour commencer. Choisissez le moyen qui vous arrange.</p></Reveal>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{ways.map(([I, t, v, h], i) => <Reveal key={t} delay={i * 0.05}><a href={h} target={h.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="block h-full rounded-2xl bg-nuit-2/90 backdrop-blur ring-1 ring-white/10 p-6 hover:ring-safran transition-shadow"><I size={22} className="text-cyan" /><p className="mt-5 text-brume text-[14px]">{t}</p><p className="mt-1 font-display text-[18px] font-semibold break-words">{v}</p></a></Reveal>)}</div>
          <p className="mt-8 flex items-center gap-2 text-brume text-[15px]"><Clock size={16} /> Lundi au samedi, de 9 h à 19 h.</p>
        </div>
      </section>
      <FinalCTA />
      <section className="light py-24"><div className="wrap max-w-4xl"><h2 className="text-[clamp(2rem,4vw,3.2rem)]">Questions fréquentes</h2><div className="mt-10"><Faq /></div></div></section>
    </>
  );
}
