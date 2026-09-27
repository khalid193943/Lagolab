/**
 * Sections ajoutées à l'accueil :
 *  - Manifeste : ce que nous faisons en une phrase, et la promesse « Plus de visibilité. Plus de demandes. Plus de clients. »
 *  - Deux façons de travailler avec nous : entreprises, ou agences et freelances en marque blanche.
 *  - Guides : les articles de fond, pour le référencement et la confiance.
 */
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Rocket, Handshake, Clock, Check } from 'lucide-react';
import { t, tv, L } from './i18n';
import { Reveal, Img } from './ui';
import wAdmin from './assets/work-admin.jpg';
import wWa from './assets/work-whatsapp.jpg';
import wDevis from './assets/work-devis.jpg';
import wProj from './assets/work-projets.jpg';
import { ScrollText } from './fx';

type T3 = { fr: string; en: string; ar: string };
const SEG: [T3, boolean][] = [
  [{ fr: 'Nous créons des sites qui ', en: 'We build websites that ', ar: 'نصمّم مواقع ' }, false], [{ fr: 'attirent des clients', en: 'bring in customers', ar: 'تجلب العملاء' }, true],
  [{ fr: ', grâce à un ', en: ', through ', ar: '، بفضل ' }, false], [{ fr: 'design pensé pour vos clients', en: 'design built around your clients', ar: 'تصميم يتمحور حول عملائك' }, true],
  [{ fr: ', des ', en: ', ', ar: '، و' }, false], [{ fr: 'contenus structurés pour Google et les IA', en: 'content structured for Google and AI', ar: 'محتوى مُهيكل لـGoogle والذكاء الاصطناعي' }, true],
  [{ fr: ' et des ', en: ' and ', ar: '، و' }, false], [{ fr: 'outils accélérés par l’IA', en: 'AI-accelerated tools', ar: 'أدوات يسرّعها الذكاء الاصطناعي' }, true], [{ fr: '.', en: '.', ar: '.' }, false],
];

export const Manifesto = () => {
  const reduce = useReducedMotion();
  return (
    <section className="light bg-white py-32 md:py-40 lg:py-52"><div className="wrap text-center">
      <Reveal><p className="mx-auto max-w-[30ch] font-display text-[clamp(1.6rem,3.2vw,2.7rem)] leading-[1.45] tracking-[-0.025em] text-encre">
        {SEG.map(([x, pill], i) => pill ? <span key={i} className="inline-block align-baseline mx-1 my-1 px-3 py-0.5 rounded-full bg-safran/20 ring-1 ring-safran/50 leading-[1.3]">{tv(x)}</span> : <span key={i}>{tv(x)}</span>)}
      </p></Reveal>
      <Reveal delay={0.1}><p className="mt-8 mx-auto max-w-[52ch] text-[18px] text-ardoise">{tv({ fr: 'Depuis onze ans, chaque projet est conçu pour trois choses : la vitesse, la clarté et les résultats.', en: 'For eleven years, every project has been built for three things: speed, clarity and results.', ar: 'منذ أحد عشر عامًا، نبني كل مشروع من أجل ثلاثة أمور: السرعة والوضوح والنتائج.' })}</p></Reveal>
      <div className="mt-16 md:mt-20 space-y-1">{[{ fr: 'Plus de visibilité.', en: 'More visibility.', ar: 'ظهور أكبر.' }, { fr: 'Plus de demandes.', en: 'More enquiries.', ar: 'طلبات أكثر.' }, { fr: 'Plus de clients.', en: 'More customers.', ar: 'عملاء أكثر.' }].map((x, i) => (
        <motion.p key={i} initial={reduce ? false : { opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-semibold tracking-[-0.045em] leading-[1.05] text-[clamp(2.6rem,7.2vw,6.4rem)]">
          {i === 1 ? <span className="relative inline-block"><span className="absolute inset-x-[-0.08em] bottom-[0.08em] h-[0.34em] bg-safran/80 -z-0 rounded-sm" /><span className="relative">{tv(x)}</span></span> : <span className="text-encre">{tv(x)}</span>}
        </motion.p>
      ))}</div>
      <Reveal delay={0.2}><Link to={L('/societe')} className="mt-14 inline-flex items-center gap-2 text-[15px] font-medium text-encre border-b-2 border-safran pb-1 hover:gap-3 transition-all">{tv({ fr: 'Découvrir l’histoire derrière Digilago', en: 'Discover the story behind Digilago', ar: 'اكتشف القصة وراء ديجيلاغو' })} <ArrowUpRight size={16} /></Link></Reveal>
    </div></section>
  );
};

export const TwoWays = () => {
  const cards = [
    { I: Rocket, tone: 'bg-nuit text-white', accent: 'text-safran', q: { fr: 'Vous voulez un site qui fait vraiment grandir votre entreprise ?', en: 'Want a website that actually grows your business?', ar: 'هل تريد موقعًا يُنمّي شركتك فعلًا؟' }, d: { fr: 'Site, fiche Google, référencement et outils sur-mesure : nous faisons presque tout, vous validez. Première version en 72 heures.', en: 'Website, Google profile, SEO and custom tools: we do almost everything, you approve. First version in 72 hours.', ar: 'موقع، ملف Google، تحسين محركات البحث وأدوات مخصّصة: نتولى كل شيء تقريبًا، وأنت توافق. النسخة الأولى خلال 72 ساعة.' }, pts: [{ fr: 'Vous ne payez que si le résultat vous plaît', en: 'You only pay if you love the result', ar: 'لا تدفع إلا إذا نالت النتيجة إعجابك' }, { fr: 'Un interlocuteur unique', en: 'A single point of contact', ar: 'محاور واحد' }], cta: t('Commencer ma présence en ligne'), to: '/contact' },
    { I: Handshake, tone: 'bg-white ring-1 ring-encre/10', accent: 'text-[#0E8FA0]', q: { fr: 'Vous êtes une agence ou un freelance et cherchez une équipe fiable ?', en: 'Are you an agency or freelancer looking for a reliable team?', ar: 'هل أنت وكالة أو مستقل تبحث عن فريق موثوق؟' }, d: { fr: 'Nous réalisons vos projets clients en marque blanche : design, développement, SEO et maintenance. Votre client reste le vôtre.', en: 'We deliver your client projects under your brand: design, development, SEO and maintenance. Your client stays yours.', ar: 'ننجز مشاريع عملائك تحت علامتك التجارية: التصميم والتطوير وتحسين محركات البحث والصيانة. ويبقى عميلك عميلك.' }, pts: [{ fr: 'Confidentialité totale', en: 'Full confidentiality', ar: 'سرية تامة' }, { fr: 'Délais tenus, code propre et documenté', en: 'Deadlines met, clean documented code', ar: 'احترام الآجال، وشيفرة نظيفة وموثّقة' }], cta: tv({ fr: 'Devenir partenaire', en: 'Become a partner', ar: 'كن شريكًا' }), to: '/contact?profil=agence' },
  ];
  return (
    <section className="light bg-white py-32 md:py-40 lg:py-52"><div className="wrap">
      <div className="text-center"><Reveal><p className="kicker justify-center">{tv({ fr: 'Pour qui', en: 'Who we work with', ar: 'لمن نعمل' })}</p></Reveal><ScrollText text={tv({ fr: 'Deux façons de travailler avec nous.', en: 'Two ways to work with us.', ar: 'طريقتان للعمل معنا.' })} className="mt-4 text-[clamp(1.9rem,3.8vw,3.3rem)]" /></div>
      <div className="mt-14 grid md:grid-cols-2 gap-5">{cards.map((c, i) => (
        <Reveal key={i} delay={i * 0.08} className="h-full"><article className={`h-full rounded-[32px] p-8 md:p-12 flex flex-col ${c.tone}`}>
          <c.I size={44} strokeWidth={1.3} className={c.accent} />
          <h3 className="mt-8 text-[clamp(1.5rem,2.4vw,2.1rem)] leading-tight max-w-[20ch]">{tv(c.q)}</h3>
          <p className={`mt-4 text-[16.5px] max-w-[48ch] ${i === 0 ? 'text-brume' : 'text-ardoise'}`}>{tv(c.d)}</p>
          <ul className="mt-6 space-y-2.5">{c.pts.map((p) => <li key={p.fr} className="flex items-center gap-3 text-[15px]"><Check size={17} className={c.accent} />{tv(p)}</li>)}</ul>
          <div className="mt-auto pt-10"><Link to={L(c.to)} className={`btn ${i === 0 ? 'btn-safran' : 'btn-dark'}`}>{c.cta} <ArrowUpRight size={16} /></Link></div>
        </article></Reveal>
      ))}</div>
    </div></section>
  );
};

const GUIDES: { slug: string; title: T3; desc: T3; read: number }[] = [
  { slug: 'prix-site-web-maroc', read: 6, title: { fr: 'Combien coûte un site web au Maroc en 2026 ?', en: 'How much does a website cost in Morocco in 2026?', ar: 'كم تبلغ تكلفة موقع إلكتروني في المغرب سنة 2026؟' }, desc: { fr: 'Les fourchettes de prix, ce qui fait varier le budget et comment éviter les mauvaises surprises.', en: 'Price ranges, what drives the budget and how to avoid bad surprises.', ar: 'نطاقات الأسعار، والعوامل التي تحدد الميزانية، وكيف تتجنب المفاجآت.' } },
  { slug: 'apparaitre-google-chatgpt-maroc', read: 7, title: { fr: 'Comment apparaître sur Google et dans ChatGPT au Maroc', en: 'How to show up on Google and in ChatGPT in Morocco', ar: 'كيف تظهر على Google وفي ChatGPT في المغرب' }, desc: { fr: 'Fiche Google, SEO local et GEO : le guide pratique pour être trouvé et recommandé.', en: 'Google profile, local SEO and GEO: the practical guide to being found and recommended.', ar: 'ملف Google، التحسين المحلي وGEO: الدليل العملي لتظهر وتوصي بك المساعدات الذكية.' } },
];
export const GuidesTeaser = () => (
  <section className="light bg-white py-28 md:py-36 lg:py-44"><div className="wrap">
    <div className="flex flex-wrap items-end justify-between gap-6"><div><Reveal><p className="kicker">{tv({ fr: 'Nos guides', en: 'Our guides', ar: 'أدلتنا' })}</p></Reveal><ScrollText text={tv({ fr: 'Comprendre avant de décider.', en: 'Understand before you decide.', ar: 'افهم قبل أن تقرّر.' })} className="mt-4 text-[clamp(1.9rem,3.8vw,3.3rem)]" /></div><Reveal><Link to={L('/guides')} className="btn btn-line-dark">{tv({ fr: 'Tous les guides', en: 'All guides', ar: 'كل الأدلة' })} <ArrowUpRight size={16} /></Link></Reveal></div>
    <div className="mt-12 grid md:grid-cols-2 gap-5">{GUIDES.map((g, i) => (
      <Reveal key={g.slug} delay={i * 0.08} className="h-full"><Link to={L(`/guides/${g.slug}`)} className="group h-full flex flex-col rounded-[28px] bg-porcelaine ring-1 ring-encre/8 p-8 md:p-10 transition-shadow hover:shadow-[0_30px_60px_-30px_rgba(10,20,40,.3)]">
        <p className="flex items-center gap-2 text-[13.5px] text-[#0E8FA0]"><Clock size={15} />{tv({ fr: `${g.read} min de lecture`, en: `${g.read} min read`, ar: `${g.read} دقائق للقراءة` })}</p>
        <h3 className="mt-4 text-[clamp(1.4rem,2.2vw,1.9rem)] leading-tight">{tv(g.title)}</h3>
        <p className="mt-3 text-ardoise">{tv(g.desc)}</p>
        <span className="mt-auto pt-8 inline-flex items-center gap-2 font-medium group-hover:gap-3 transition-all">{tv({ fr: 'Lire le guide', en: 'Read the guide', ar: 'اقرأ الدليل' })} <ArrowUpRight size={16} /></span>
      </Link></Reveal>
    ))}</div>
  </div></section>
);

/* Services : outils sur-mesure (captures réelles de nos propres produits) */
export const CustomTools = () => {
  const tiles = [
    { img: wAdmin, span: 'lg:col-span-4', tint: '#EEF1F7', t: { fr: 'Tableaux de bord et CRM', en: 'Dashboards and CRM', ar: 'لوحات القيادة وإدارة العملاء' }, d: { fr: 'Demandes, clients, projets et chiffres sur un seul écran, avec des alertes qui disent quoi faire en priorité.', en: 'Leads, clients, projects and figures on one screen, with alerts that tell you what to do first.', ar: 'الطلبات والعملاء والمشاريع والأرقام في شاشة واحدة، مع تنبيهات تحدد الأولويات.' } },
    { img: wWa, span: 'lg:col-span-2', tint: '#E1F7EC', t: { fr: 'WhatsApp automatisé', en: 'Automated WhatsApp', ar: 'واتساب مؤتمت' }, d: { fr: 'Deux numéros, une boîte de réception, des réponses et relances automatiques.', en: 'Two numbers, one inbox, automatic replies and reminders.', ar: 'رقمان، وصندوق وارد واحد، وردود وتذكيرات تلقائية.' } },
    { img: wDevis, span: 'lg:col-span-2', tint: '#FFF1D6', t: { fr: 'Devis et factures intelligents', en: 'Smart quotes and invoices', ar: 'عروض أسعار وفواتير ذكية' }, d: { fr: 'Le devis se construit pendant l’appel, les factures se relancent toutes seules.', en: 'Quotes are built during the call; invoices chase themselves.', ar: 'يُبنى عرض السعر أثناء المكالمة، وتُذكَّر الفواتير تلقائيًا.' } },
    { img: wProj, span: 'lg:col-span-4', tint: '#E6FAFC', t: { fr: 'Suivi de projets', en: 'Project tracking', ar: 'تتبّع المشاريع' }, d: { fr: 'Étapes, tâches, échéances et budget : chaque projet avance sans surprise, et votre équipe sait quoi faire.', en: 'Stages, tasks, deadlines and budget: every project moves forward without surprises.', ar: 'المراحل والمهام والآجال والميزانية: يتقدّم كل مشروع دون مفاجآت، ويعرف فريقك ما عليه فعله.' } },
  ];
  return (
    <section className="light bg-white py-32 md:py-40 lg:py-52"><div className="wrap">
      <div className="grid lg:grid-cols-12 gap-8 items-end"><div className="lg:col-span-7"><Reveal><p className="kicker">{tv({ fr: 'Sur-mesure', en: 'Custom-built', ar: 'حلول مخصّصة' })}</p></Reveal><ScrollText text={tv({ fr: 'Des outils sur-mesure, avec IA et automatisations.', en: 'Custom tools, with AI and automation.', ar: 'أدوات مخصّصة، بالذكاء الاصطناعي والأتمتة.' })} className="mt-4 text-[clamp(1.9rem,3.8vw,3.3rem)]" /></div><Reveal className="lg:col-span-5"><p className="text-[17px] text-ardoise">{tv({ fr: 'Nous construisons pour nos clients les mêmes outils que nous utilisons chaque jour pour faire tourner Digilago. Ce que vous voyez ici est réel.', en: 'We build for our clients the same tools we use every day to run Digilago. What you see here is real.', ar: 'نبني لعملائنا الأدوات نفسها التي نستخدمها يوميًا لتسيير ديجيلاغو. ما تراه هنا حقيقي.' })}</p></Reveal></div>
      <div className="mt-14 grid lg:grid-cols-6 gap-5">{tiles.map((x, i) => (
        <Reveal key={i} delay={(i % 2) * 0.08} className={x.span}><article className="h-full rounded-[28px] overflow-hidden flex flex-col" style={{ background: x.tint }}>
          <div className="p-7 md:p-9"><h3 className="text-[clamp(1.3rem,2vw,1.7rem)]">{tv(x.t)}</h3><p className="mt-2 text-[15.5px] text-ardoise max-w-[52ch]">{tv(x.d)}</p></div>
          <div className="mt-auto ps-7 md:ps-9"><div className="rounded-ss-2xl overflow-hidden ring-1 ring-black/5 shadow-[0_20px_50px_-24px_rgba(10,20,40,.5)]" dir="ltr"><Img src={x.img} alt={tv(x.t)} className="w-full h-[220px] md:h-[280px] object-cover object-left-top" /></div></div>
        </article></Reveal>
      ))}</div>
      <Reveal className="mt-10"><Link to={L('/realisations')} className="btn btn-dark">{tv({ fr: 'Voir nos réalisations', en: 'See our work', ar: 'استعرض أعمالنا' })} <ArrowUpRight size={16} /></Link></Reveal>
    </div></section>
  );
};
