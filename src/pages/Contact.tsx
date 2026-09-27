import { Phone, Mail, MapPin, MessageCircle, Clock } from 'lucide-react';
import { CONTACT, IMG } from '../data';
import { Reveal, Img } from '../ui';
import { FinalCTA, Faq } from '../sections';
import { ScrollText, spot, RevealImg } from '../fx';
import { Head } from '../ui';

export default function Contact() {
  const ways: [any, string, string, string][] = [[MessageCircle, 'WhatsApp', 'Réponse le jour même', CONTACT.whatsapp], [Phone, 'Téléphone', CONTACT.phone, `tel:${CONTACT.tel}`], [Mail, 'E-mail', CONTACT.email, `mailto:${CONTACT.email}`], [MapPin, 'Adresse', 'El Jadida, Maroc', 'https://maps.google.com/?q=El+Jadida']];
  return (
    <>
      <section className="dark relative overflow-hidden pt-36 pb-20 lg:pt-44"><Img src={IMG.whatsapp} alt="" eager className="absolute inset-0 w-full h-full object-cover opacity-35" /><div className="absolute inset-0 bg-gradient-to-r from-nuit via-nuit/90 to-nuit/60" />
        <div className="wrap relative"><Reveal><p className="kicker">Contact</p></Reveal><ScrollText auto as="h1" text="Parlons de votre projet." className="mt-5 text-[clamp(2.6rem,6vw,5.4rem)] leading-[1] max-w-[16ch]" /><Reveal delay={0.5}><p className="mt-7 text-[19px] text-white/75 max-w-[50ch]">Dix minutes d’échange suffisent pour démarrer. Choisissez le canal qui vous convient, nous répondons le jour même.</p></Reveal>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{ways.map(([I, t, v, h], i) => <Reveal key={t} delay={i * 0.05}><a href={h} target={h.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" onMouseMove={spot} className="spot block h-full rounded-2xl bg-nuit-2/90 backdrop-blur ring-1 ring-white/10 p-6 hover:ring-safran/60 transition-shadow"><I size={22} className="text-cyan" /><p className="mt-5 text-brume text-[14px]">{t}</p><p className="mt-1 font-display text-[18px] font-semibold break-words">{v}</p></a></Reveal>)}</div>
          <p className="mt-8 flex items-center gap-2 text-brume text-[15px]"><Clock size={16} /> Lundi au samedi, de 9 h à 19 h.</p>
        </div>
      </section>
      <section className="light py-24 lg:py-32"><div className="wrap grid lg:grid-cols-12 gap-12 items-center">
        <RevealImg src={IMG.hero} alt="Le studio Digilago à El Jadida" ratio="aspect-[16/11]" className="lg:col-span-7" />
        <div className="lg:col-span-5"><Head kicker="Rendez-vous" title="Sur place à El Jadida, ou en visio partout au Maroc." lead="Nous vous recevons au studio, nous nous déplaçons chez vous quand c’est utile, ou nous échangeons en visio. Le premier rendez-vous est toujours offert." />
          <Reveal delay={0.1}><ul className="mt-8 space-y-3 text-[16px]">{['Réponse le jour même, du lundi au samedi', 'Devis écrit avant tout engagement', 'Première version offerte sous 72 heures'].map((x) => <li key={x} className="flex gap-3"><span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-[#0E8FA0] shrink-0" />{x}</li>)}</ul></Reveal></div>
      </div></section>
      <FinalCTA />
      <section className="light py-24"><div className="wrap max-w-4xl"><ScrollText text="Questions fréquentes" className="text-[clamp(2rem,4vw,3.2rem)]" /><div className="mt-10"><Faq /></div></div></section>
    </>
  );
}
