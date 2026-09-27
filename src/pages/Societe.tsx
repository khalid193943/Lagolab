/**
 * La société : onze ans de freelance devenus Digilago.
 * Frise de l'histoire (qui se dessine au défilement), les freins des clients barrés un à un,
 * le partage des tâches (« vous » presque rien, « nous » presque tout), ce que nous avons déjà construit,
 * et le mot du fondateur.
 */
import { useRef } from 'react';
import { Seo } from '../seo';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring, useReducedMotion } from 'motion/react';
import { t, tv, L, lang } from '../i18n';
import { ArrowUpRight, Globe, Smartphone, ShoppingBag, TerminalSquare, Rocket, Layers, Check } from 'lucide-react';
import { AGENCY, LABS, IMG } from '../data';
import { Reveal, Img, Head, Mark, Swipe, Wordmark } from '../ui';
import { FinalCTA } from '../sections';
import { ScrollText, RevealImg, CountUp, spot } from '../fx';
import { Icon3D } from '../icons';

type T3 = { fr: string; en: string; ar: string };
const CHAPTERS: { I: any; t: T3; d: T3 }[] = [
  { I: Globe, t: { fr: 'Les premiers sites', en: 'The first websites', ar: 'المواقع الأولى' }, d: { fr: 'Des vitrines pour des commerçants et des indépendants. Le métier s’apprend projet après projet.', en: 'Showcase sites for shopkeepers and independents. Learning the craft, one project at a time.', ar: 'مواقع تعريفية للتجار والمهنيين المستقلين. إتقان الحرفة مشروعًا بعد مشروع.' } },
  { I: Smartphone, t: { fr: 'Le mobile', en: 'Mobile', ar: 'تطبيقات الجوال' }, d: { fr: 'Des applications iOS et Android, de l’idée à la publication sur les stores.', en: 'iOS and Android apps, from the first idea to the app stores.', ar: 'تطبيقات iOS وAndroid، من الفكرة إلى النشر على متاجر التطبيقات.' } },
  { I: ShoppingBag, t: { fr: 'Le e-commerce', en: 'E-commerce', ar: 'التجارة الإلكترونية' }, d: { fr: 'Des boutiques en ligne complètes : catalogue, paiement, livraison, gestion des commandes.', en: 'Complete online stores: catalogue, payments, delivery, order management.', ar: 'متاجر إلكترونية متكاملة: كتالوج، دفع إلكتروني، توصيل، وإدارة الطلبات.' } },
  { I: TerminalSquare, t: { fr: 'Les outils pour développeurs', en: 'Developer tools', ar: 'أدوات المطورين' }, d: { fr: 'Des outils techniques pour d’autres équipes : automatisation, intégrations, API.', en: 'Technical tools for other teams: automation, integrations, APIs.', ar: 'أدوات تقنية لفرق أخرى: أتمتة، تكاملات، وواجهات API.' } },
  { I: Rocket, t: { fr: 'Le SaaS et les idées', en: 'SaaS and new ideas', ar: 'SaaS والأفكار الجديدة' }, d: { fr: 'Tester des idées, construire des produits de zéro, les mettre entre les mains de vrais utilisateurs.', en: 'Testing ideas, building products from scratch, putting them in the hands of real users.', ar: 'اختبار الأفكار، وبناء منتجات من الصفر، ووضعها بين أيدي مستخدمين حقيقيين.' } },
  { I: Layers, t: { fr: 'Les systèmes complets', en: 'Complete systems', ar: 'الأنظمة المتكاملة' }, d: { fr: 'Des plateformes entières et des design systems : cohérents, documentés, faits pour durer.', en: 'Entire platforms and design systems: consistent, documented, built to last.', ar: 'منصات كاملة وأنظمة تصميم Design systems: متناسقة وموثّقة ومبنية لتدوم.' } },
];
const OBJECTIONS: [T3, T3][] = [
  [{ fr: 'Je n’y connais rien en informatique.', en: 'I don’t know anything about tech.', ar: 'لا أفهم شيئًا في المعلوميات.' }, { fr: 'Vous n’avez pas besoin de savoir. Nous prenons en charge toute la partie technique et nous vous expliquons l’essentiel en trente minutes.', en: 'You don’t need to. We handle everything technical and walk you through the essentials in thirty minutes.', ar: 'لست بحاجة إلى ذلك. نتولى كل الجوانب التقنية، ونشرح لك الأساسيات في ثلاثين دقيقة.' }],
  [{ fr: 'C’est trop cher pour moi.', en: 'It’s too expensive for me.', ar: 'هذا مكلف بالنسبة لي.' }, { fr: 'Une présence en ligne complète reste accessible. Le prix est annoncé avant de commencer, et vous ne payez rien si la première version ne vous plaît pas.', en: 'A complete online presence stays affordable. The price is set before we start, and you pay nothing if you don’t love the first version.', ar: 'الحضور الرقمي المتكامل في متناولك. نحدّد السعر قبل البدء، ولا تدفع شيئًا إن لم تنل النسخة الأولى إعجابك.' }],
  [{ fr: 'Je n’ai pas le temps.', en: 'I don’t have the time.', ar: 'ليس لدي وقت.' }, { fr: 'Donnez-nous votre nom et votre ville. En 72 heures, votre site est prêt à être validé.', en: 'Give us your name and your city. In 72 hours, your website is ready for your approval.', ar: 'أرسل لنا اسمك ومدينتك فقط. خلال 72 ساعة، يصبح موقعك جاهزًا لموافقتك.' }],
];
const YOU: T3[] = [
  { fr: 'Nous donner le nom de votre entreprise et votre ville', en: 'Give us your business name and your city', ar: 'تزويدنا باسم شركتك ومدينتك' },
  { fr: 'Valider la première version', en: 'Approve the first version', ar: 'الموافقة على النسخة الأولى' },
  { fr: 'Accueillir vos nouveaux clients', en: 'Welcome your new customers', ar: 'استقبال عملائك الجدد' },
];
const US: T3[] = [
  { fr: 'Le design', en: 'Design', ar: 'التصميم' }, { fr: 'Le code', en: 'Code', ar: 'البرمجة' }, { fr: 'Les textes en trois langues', en: 'Copy in three languages', ar: 'المحتوى بثلاث لغات' },
  { fr: 'Les photos et visuels', en: 'Photos and visuals', ar: 'الصور والمرئيات' }, { fr: 'La fiche Google', en: 'Your Google profile', ar: 'ملف Google' }, { fr: 'Le référencement', en: 'SEO', ar: 'تحسين محركات البحث SEO' },
  { fr: 'La visibilité dans les IA', en: 'AI visibility', ar: 'الظهور في الذكاء الاصطناعي' }, { fr: 'L’hébergement', en: 'Hosting', ar: 'الاستضافة' }, { fr: 'La sécurité', en: 'Security', ar: 'الأمن الرقمي' },
  { fr: 'Les sauvegardes', en: 'Backups', ar: 'النسخ الاحتياطي' }, { fr: 'Les mises à jour', en: 'Updates', ar: 'التحديثات' }, { fr: 'La formation', en: 'Training', ar: 'التدريب' }, { fr: 'Le suivi mensuel', en: 'Monthly follow-up', ar: 'المتابعة الشهرية' },
];
const BUILT: T3[] = [
  { fr: 'Sites vitrines', en: 'Showcase websites', ar: 'مواقع تعريفية' }, { fr: 'Applications mobiles', en: 'Mobile apps', ar: 'تطبيقات الجوال' }, { fr: 'E-commerce', en: 'E-commerce', ar: 'التجارة الإلكترونية' },
  { fr: 'Outils pour développeurs', en: 'Developer tools', ar: 'أدوات المطورين' }, { fr: 'SaaS', en: 'SaaS', ar: 'SaaS' }, { fr: 'API', en: 'APIs', ar: 'API' },
  { fr: 'Design systems', en: 'Design systems', ar: 'Design systems' }, { fr: 'Plateformes complètes', en: 'Complete platforms', ar: 'منصات متكاملة' }, { fr: 'Prototypes', en: 'Prototypes', ar: 'نماذج أولية' },
  { fr: 'Automatisation', en: 'Automation', ar: 'الأتمتة' }, { fr: 'Tableaux de bord', en: 'Dashboards', ar: 'لوحات القيادة' }, { fr: 'Intégrations', en: 'Integrations', ar: 'التكاملات' },
];

/* Frise : une ligne qui se remplit au défilement, chapitre après chapitre */
const Timeline = () => {
  const ref = useRef<HTMLOListElement>(null); const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });
  return (
    <ol ref={ref} className="relative">
      <span aria-hidden className="absolute start-[39px] md:start-[47px] top-6 bottom-6 w-px bg-encre/10" />
      <motion.span aria-hidden className="absolute start-[39px] md:start-[47px] top-6 bottom-6 w-[2px] -ms-px bg-gradient-to-b from-safran via-safran to-cyan origin-top" style={{ scaleY: reduce ? 1 : p }} />
      {CHAPTERS.map((c, i) => (
        <li key={i} className="relative flex gap-5 md:gap-7 pb-10 md:pb-14">
          <span className="relative z-[1] shrink-0 w-20 md:w-24 flex justify-center bg-porcelaine py-2"><Icon3D Icon={c.I} className="w-14 h-14 md:w-16 md:h-16" stroke={1.25} /></span>
          <Reveal className="pt-2 md:pt-4 flex-1"><p className="text-[13px] font-medium text-[#0E8FA0] tabular-nums">{tv({ fr: `Chapitre ${i + 1}`, en: `Chapter ${i + 1}`, ar: `الفصل ${i + 1}` })}</p><h3 className="mt-1 text-[24px] md:text-[28px]">{tv(c.t)}</h3><p className="mt-2 text-ardoise max-w-[46ch]">{tv(c.d)}</p></Reveal>
        </li>
      ))}
      <li className="relative flex gap-5 md:gap-7">
        <span className="relative z-[1] shrink-0 w-20 md:w-24 flex justify-center bg-porcelaine py-2"><Mark className="w-14 h-16 md:w-16 md:h-[72px]" draw /></span>
        <Reveal className="flex-1"><div className="rounded-3xl bg-nuit text-white p-6 md:p-8"><p className="text-[13px] text-safran font-medium">{tv({ fr: 'Aujourd’hui', en: 'Today', ar: 'اليوم' })}</p><h3 className="mt-1 text-[26px] md:text-[32px]"><Wordmark className="text-[1em]" loop={false} /></h3><p className="mt-3 text-brume max-w-[48ch]">{tv({ fr: 'Toute cette expérience réunie dans une société, au service des entreprises qui veulent être trouvées.', en: 'All of that experience brought together in one company, working for businesses that want to be found.', ar: 'كل هذه الخبرة اجتمعت في شركة واحدة، في خدمة الشركات التي تريد أن يُعثر عليها.' })}</p></div></Reveal>
      </li>
    </ol>
  );
};

/* Un frein qu'on barre (trait safran qui se dessine sur chaque ligne), puis la réponse qui apparaît */
const Objection = ({ o, a, i }: { o: T3; a: T3; i: number }) => {
  const reduce = useReducedMotion(); const rtl = lang() === 'ar';
  const strike = { backgroundImage: 'linear-gradient(#F4B53F, #F4B53F)', backgroundRepeat: 'no-repeat', backgroundPosition: rtl ? '100% 58%' : '0 58%', WebkitBoxDecorationBreak: 'clone', boxDecorationBreak: 'clone' } as React.CSSProperties;
  return (
    <motion.div initial={reduce ? false : 'off'} whileInView="on" viewport={{ once: true, amount: 0.6 }} className="grid md:grid-cols-12 gap-5 md:gap-10 items-center py-8 md:py-10 border-b border-white/10 last:border-0">
      <div className="md:col-span-6">
        <p className="font-display text-[clamp(1.44rem,2.7vw,2.16rem)] leading-snug text-white/85">
          <motion.span style={strike} variants={{ off: { backgroundSize: '0% 3px' }, on: { backgroundSize: '100% 3px', transition: { duration: 0.8, delay: 0.35, ease: [0.65, 0, 0.35, 1] } } }}><span className="text-safran">«</span> {tv(o)} <span className="text-safran">»</span></motion.span>
        </p>
      </div>
      <motion.div variants={{ off: { opacity: 0, y: 18 }, on: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 1.0, ease: [0.16, 1, 0.3, 1] } } }} className="md:col-span-6"><div className="rounded-2xl bg-nuit-2 ring-1 ring-white/10 p-6 flex gap-4"><span className="w-9 h-9 shrink-0 rounded-full bg-safran text-nuit flex items-center justify-center"><Check size={18} strokeWidth={2.4} /></span><div><p className="text-[13px] text-cyan font-medium">{tv({ fr: 'Avec Digilago', en: 'With Digilago', ar: 'مع ديجيلاغو' })}</p><p className="mt-1 text-[16.5px] text-white/90">{tv(a)}</p></div></div></motion.div>
    </motion.div>
  );
};

export default function Societe() {
  const reduce = useReducedMotion();
  return (
    <>
      <Seo title={tv({ fr: 'Agence web à El Jadida, 11 ans d’expérience | Digilago', en: 'Web agency in El Jadida, 11 years of experience | Digilago', ar: 'وكالة ويب في الجديدة، 11 عامًا من الخبرة | ديجيلاغو' })} description={tv({ fr: 'Digilago, société de services numériques à El Jadida : onze ans de développement web, mobile, e-commerce et SaaS au service de la visibilité des entreprises marocaines.', en: 'Digilago, a digital services company in El Jadida: eleven years of web, mobile, e-commerce and SaaS development serving the visibility of Moroccan businesses.', ar: 'ديجيلاغو، شركة خدمات رقمية في الجديدة: أحد عشر عامًا من تطوير الويب والجوال والتجارة الإلكترونية وSaaS في خدمة ظهور الشركات المغربية.' })} crumbs={[[t('Accueil'), '/'], [t('Société'), '/societe']]} />
      {/* HERO */}
      <section className="dark relative overflow-hidden min-h-[92svh] flex items-end">
        <Img src={IMG.eljadida} alt={t('Les remparts de la Cité portugaise d’El Jadida au crépuscule')} eager className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-nuit via-nuit/75 to-nuit/25" />
        <span aria-hidden className="absolute -end-[4vw] top-[8%] font-display font-semibold leading-none text-[clamp(12.6rem,30.6vw,30.6rem)] text-transparent select-none pointer-events-none" style={{ WebkitTextStroke: '1.5px rgba(244,181,63,.28)' }}>11</span>
        <div className="wrap relative pt-40 pb-14 w-full">
          <Reveal><p className="kicker">{t('La société')}</p></Reveal>
          <ScrollText auto as="h1" text={tv({ fr: 'Onze ans à tout construire, pour que vous n’ayez presque rien à faire.', en: 'Eleven years of building everything, so you barely have to lift a finger.', ar: 'أحد عشر عامًا من البناء، كي لا تضطر إلى فعل شيء تقريبًا.' })} className="mt-5 text-[clamp(2.25rem,5.04vw,4.5rem)] leading-[1.02] max-w-[20ch]" />
          <Reveal delay={0.5}><p className="mt-7 text-[19px] text-white/85 max-w-[58ch]">{tv({ fr: 'Digilago est née de onze ans de freelance : applications mobiles, e-commerce, outils pour développeurs, SaaS, systèmes complets. Aujourd’hui, toute cette expérience sert un seul objectif : rendre votre entreprise visible en ligne, simplement.', en: 'Digilago grew out of eleven years of freelancing: mobile apps, e-commerce, developer tools, SaaS, complete systems. Today, all of that experience serves one goal: making your business visible online, simply.', ar: 'وُلدت ديجيلاغو من أحد عشر عامًا من العمل الحر: تطبيقات الجوال، التجارة الإلكترونية، أدوات المطورين، SaaS، وأنظمة متكاملة. اليوم، تخدم كل هذه الخبرة هدفًا واحدًا: جعل شركتك مرئية على الإنترنت، ببساطة.' })}</p></Reveal>
          <dl className="mt-12 grid grid-cols-2 md:grid-cols-4 border-t border-white/15">
            {([['11 ans', { fr: 'd’expérience', en: 'of experience', ar: 'من الخبرة' }], ['72 h', { fr: 'pour une première version', en: 'for a first version', ar: 'لإنجاز النسخة الأولى' }], ['0 MAD', { fr: 'si le résultat ne vous plaît pas', en: 'if you don’t love the result', ar: 'إن لم تعجبك النتيجة' }], ['3', { fr: 'langues : arabe, français, anglais', en: 'languages: Arabic, French, English', ar: 'لغات: العربية، الفرنسية، الإنجليزية' }]] as [string, T3][]).map(([n, l]) => (
              <div key={n} className="pt-5 pe-4"><dt className="font-display text-[clamp(1.62rem,2.7vw,2.16rem)] font-medium"><CountUp value={tv({ fr: n, en: n.replace('ans', 'years'), ar: n.replace('11 ans', '11 عامًا').replace('h', 'ساعة').replace('MAD', 'درهم') })} /></dt><dd className="text-[14px] text-brume">{tv(l)}</dd></div>
            ))}
          </dl>
        </div>
      </section>

      {/* L'HISTOIRE */}
      <section className="light py-32 md:py-40 lg:py-52"><div className="wrap grid lg:grid-cols-12 gap-12 lg:gap-16">
        <div className="lg:col-span-5"><div className="lg:sticky lg:top-32">
          <Head kicker={t('Notre histoire')} title={tv({ fr: 'Avant Digilago, onze ans de terrain.', en: 'Before Digilago, eleven years in the field.', ar: 'قبل ديجيلاغو، أحد عشر عامًا من العمل الميداني.' })} lead={tv({ fr: 'Des centaines de décisions techniques, des produits lancés, des idées testées. Tout ce qui sert aujourd’hui à nos clients vient de là.', en: 'Hundreds of technical decisions, products launched, ideas tested. Everything our clients benefit from today comes from there.', ar: 'مئات القرارات التقنية، ومنتجات أُطلقت، وأفكار اختُبرت. كل ما يستفيد منه عملاؤنا اليوم نابع من هذه التجربة.' })} />
          <Reveal delay={0.1}><div className="mt-10 relative hidden lg:block"><RevealImg src={IMG.workshop} alt={t('Maquettes et parcours clients au tableau')} /><span className="absolute -bottom-6 -end-6 rounded-2xl bg-nuit text-white px-5 py-4 shadow-xl"><span className="block font-display text-[34px] leading-none text-safran"><CountUp value={tv({ fr: '11 ans', en: '11 years', ar: '11 عامًا' })} /></span><span className="block mt-1 text-[13px] text-brume">{tv({ fr: 'de freelance', en: 'freelancing', ar: 'من العمل الحر' })}</span></span></div></Reveal>
        </div></div>
        <div className="lg:col-span-7"><Timeline /></div>
      </div></section>

      {/* LE CONSTAT : LES FREINS */}
      <section className="dark relative overflow-hidden py-32 md:py-40 lg:py-52">
        <Img src={IMG.zellige} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-nuit via-nuit/90 to-nuit" />
        <div className="wrap relative">
          <Head kicker={tv({ fr: 'Le constat', en: 'What we noticed', ar: 'ما لاحظناه' })} title={tv({ fr: 'Beaucoup d’entreprises n’essaient même pas.', en: 'Many businesses don’t even try.', ar: 'كثير من الشركات لا تحاول أصلًا.' })} lead={tv({ fr: 'Pas par manque d’envie. Parce que le numérique leur semble hors de portée. Voici ce que nous entendons le plus souvent, et ce que nous répondons.', en: 'Not for lack of ambition, but because digital feels out of reach. Here is what we hear most often, and what we say back.', ar: 'ليس لغياب الطموح، بل لأن العالم الرقمي يبدو لها بعيد المنال. إليك ما نسمعه كثيرًا، وما نجيب به.' })} />
          <div className="mt-10 md:mt-14">{OBJECTIONS.map(([o, a], i) => <Objection key={i} o={o} a={a} i={i} />)}</div>
        </div>
      </section>

      {/* PRESQUE TOUT */}
      <section className="light py-32 md:py-40 lg:py-52"><div className="wrap">
        <Head kicker={tv({ fr: 'Le partage des tâches', en: 'Who does what', ar: 'من يقوم بماذا' })} title={tv({ fr: 'Avec Digilago, c’est simple : nous faisons presque tout.', en: 'With Digilago, it’s simple: we do almost everything.', ar: 'مع ديجيلاغو، الأمر بسيط: نحن نتولى كل شيء تقريبًا.' })} lead={tv({ fr: 'Vous gardez votre énergie pour votre métier. Nous prenons tout le reste en charge, de la première maquette au suivi mensuel.', en: 'Keep your energy for your business. We take care of everything else, from the first mock-up to monthly follow-up.', ar: 'احتفظ بطاقتك لنشاطك، ونتكفل نحن بالباقي، من أول نموذج تصميم حتى المتابعة الشهرية.' })} />
        {/* La barre : votre part, notre part */}
        <div className="mt-12 flex h-16 md:h-20 rounded-full overflow-hidden ring-1 ring-encre/10 bg-white">
          <motion.div className="h-full bg-safran text-nuit flex items-center justify-center font-display font-medium text-[14px] md:text-[16px] shrink-0 px-4" style={{ width: '14%' }} initial={reduce ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>{tv({ fr: 'Vous', en: 'You', ar: 'أنت' })}</motion.div>
          <motion.div className="h-full flex-1 bg-nuit text-white flex items-center justify-between px-5 md:px-8 origin-left rtl:origin-right" initial={reduce ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, amount: 0.8 }} transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1], delay: 0.2 }}><Wordmark className="text-[18px] md:text-[22px]" loop={false} /><span className="text-[13px] md:text-[14px] text-brume">{tv({ fr: 'presque tout le reste', en: 'almost everything else', ar: 'وكل ما تبقّى تقريبًا' })}</span></motion.div>
        </div>
        <div className="mt-8 grid lg:grid-cols-12 gap-5">
          <Reveal className="lg:col-span-4"><div className="h-full rounded-3xl bg-white ring-1 ring-encre/8 p-7 md:p-8"><p className="font-display text-[22px]">{tv({ fr: 'Ce que vous faites', en: 'What you do', ar: 'ما تقوم به أنت' })}</p>
            <ol className="mt-6 space-y-5">{YOU.map((y, i) => <li key={i} className="flex gap-4"><span className="w-9 h-9 shrink-0 rounded-full bg-safran text-nuit font-display font-semibold flex items-center justify-center">{i + 1}</span><span className="pt-1.5 text-[16.5px]">{tv(y)}</span></li>)}</ol></div></Reveal>
          <Reveal delay={0.1} className="lg:col-span-8"><div className="h-full rounded-3xl bg-nuit text-white p-7 md:p-8 relative overflow-hidden"><Mark className="absolute -end-16 -bottom-20 w-[300px] h-[340px] opacity-[0.06] pointer-events-none" /><p className="relative font-display text-[22px]">{tv({ fr: 'Ce que nous faisons pour vous', en: 'What we do for you', ar: 'ما نقوم به من أجلك' })}</p>
            <ul className="relative mt-6 flex flex-wrap gap-2.5">{US.map((u, i) => <motion.li key={i} initial={reduce ? false : { opacity: 0, y: 12, scale: 0.9 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.05, type: 'spring', stiffness: 260, damping: 20 }} className="flex items-center gap-2 h-11 px-4 rounded-full bg-nuit-2 ring-1 ring-white/10 text-[15px]"><Check size={15} className="text-cyan" />{tv(u)}</motion.li>)}</ul></div></Reveal>
        </div>
      </div></section>

      {/* CE QUE NOUS AVONS CONSTRUIT + MOT DU FONDATEUR */}
      <section className="dark relative overflow-hidden pt-32 md:pt-40 lg:pt-52 pb-32 md:pb-40 lg:pb-52">
        <div className="wrap"><Head kicker={tv({ fr: 'Onze ans de terrain', en: 'Eleven years in the field', ar: 'أحد عشر عامًا من الخبرة' })} title={tv({ fr: 'Tout ce que nous avons déjà construit.', en: 'Everything we have already built.', ar: 'كل ما سبق أن بنيناه.' })} /></div>
        <div className="mt-12 space-y-3" dir="ltr">
          {[0, 1].map((r) => (
            <div key={r} className="marquee-wrap"><div className="marquee gap-8 items-center" style={{ ['--d' as any]: r ? '55s' : '45s', animationDirection: r ? 'reverse' : 'normal' }}>
              {[...BUILT, ...BUILT].map((b, k) => { const i = (k + r * 5) % BUILT.length; const solid = (k + r) % 2 === 0; return (
                <span key={k} className="flex items-center gap-8 shrink-0" aria-hidden={k >= BUILT.length}>
                  <span data-t className={`font-display font-medium whitespace-nowrap text-[clamp(2.16rem,5.4vw,4.5rem)] tracking-[-0.04em] ${solid ? 'text-white' : 'text-transparent'}`} style={solid ? undefined : { WebkitTextStroke: '1.2px rgba(255,255,255,.35)' }}>{tv(BUILT[i])}</span>
                  <span className="w-3 h-3 rounded-full bg-safran shadow-[0_0_14px_rgba(244,181,63,.8)]" />
                </span>
              ); })}
            </div></div>
          ))}
        </div>

        <div className="wrap mt-20 md:mt-28">
          <Reveal><figure className="relative rounded-[32px] overflow-hidden ring-1 ring-white/10">
            <Img src={IMG.zellige} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 rtl-flip bg-gradient-to-r from-nuit via-nuit/92 to-nuit/60" />
            <div className="relative p-8 md:p-14 lg:p-16 grid lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-8">
                <p className="kicker">{tv({ fr: 'Le mot du fondateur', en: 'A word from the founder', ar: 'كلمة المؤسس' })}</p>
                <svg viewBox="0 0 64 48" className="mt-6 w-14 h-11 text-safran rtl:-scale-x-100" aria-hidden><path d="M0 48V28C0 12 9 3 26 0l3 7C19 10 14 16 14 24h12v24H0Zm36 0V28c0-16 9-25 26-28l3 7c-10 3-15 9-15 17h12v24H36Z" fill="currentColor" /></svg>
                <blockquote className="mt-6 font-display text-[clamp(1.35rem,2.4vw,2rem)] leading-[1.45] tracking-[-0.02em] text-white/92">{tv({ fr: 'Pendant onze ans, j’ai tout construit : des applications mobiles, des boutiques, des outils pour développeurs, des SaaS, des systèmes complets. Et partout, j’ai vu la même chose : des entreprises excellentes, invisibles en ligne, parce que ça leur paraissait compliqué ou trop cher. J’ai créé Digilago pour que ce ne soit plus une question. Vous tenez votre métier, nous tenons le reste.', en: 'For eleven years, I built everything: mobile apps, online stores, developer tools, SaaS products, complete systems. And everywhere, I saw the same thing: excellent businesses, invisible online, because it seemed too complicated or too expensive. I founded Digilago so that’s no longer a question. You run your business; we handle the rest.', ar: 'طوال أحد عشر عامًا، بنيت كل شيء: تطبيقات جوال، متاجر إلكترونية، أدوات للمطورين، منتجات SaaS، وأنظمة متكاملة. وفي كل مكان، رأيت الشيء نفسه: شركات ممتازة، غائبة عن الإنترنت، لأن الأمر بدا لها معقدًا أو مكلفًا. أسست ديجيلاغو كي لا يبقى هذا عائقًا. أنت تتقن نشاطك، ونحن نتكفل بالباقي.' })}</blockquote>
                <figcaption className="mt-8 flex items-center gap-4"><span className="w-14 h-14 rounded-2xl bg-nuit-2 ring-1 ring-white/10 flex items-center justify-center"><Mark className="w-7 h-8" /></span><span><span className="block font-display text-[18px]">{tv({ fr: 'Fondateur de Digilago', en: 'Founder of Digilago', ar: 'مؤسس ديجيلاغو' })}</span><span className="block text-[14px] text-brume">{tv({ fr: 'El Jadida, 11 ans de freelance', en: 'El Jadida, 11 years freelancing', ar: 'الجديدة، 11 عامًا من العمل الحر' })}</span></span></figcaption>
              </div>
              <div className="lg:col-span-4 hidden lg:flex justify-center"><div className="relative"><span className="absolute inset-0 rounded-full bg-safran/20 blur-3xl" /><Mark className="relative w-56 h-64" draw /></div></div>
            </div>
          </figure></Reveal>
          <Reveal delay={0.1} className="mt-10 flex flex-wrap gap-3"><Link to={L('/contact')} className="btn btn-safran">{t('Parler de votre projet')} <ArrowUpRight size={16} /></Link><Link to={L('/realisations')} className="btn btn-line">{t('Voir nos réalisations')}</Link></Reveal>
        </div>
      </section>

      <section className="light relative overflow-hidden py-32 md:py-40 lg:py-52"><Mark className="absolute -end-32 -top-24 w-[560px] h-[640px] opacity-[0.06] pointer-events-none" color="#0A1428" /><div className="wrap relative">
        <Head kicker={t('Nos engagements')} title={t('Quatre engagements, tenus sur chaque projet.')} />
        <div className="mt-14 grid md:grid-cols-2 gap-4">{AGENCY.values.map(([tt, d]) => <Reveal key={tt} className="h-full"><div className="h-full rounded-3xl bg-white ring-1 ring-encre/8 p-8 md:p-10 transition-shadow duration-500 hover:shadow-[0_30px_60px_-30px_rgba(10,20,40,.3)]"><h3 className="text-[26px]">{t(tt)}</h3><p className="mt-3 text-ardoise text-[17px] max-w-[44ch]">{t(d)}</p></div></Reveal>)}</div>
      </div></section>

      <section className="dark py-32 md:py-40 lg:py-52"><div className="wrap grid lg:grid-cols-12 gap-12 items-center">
        <RevealImg src={IMG.hero} alt={t('Le studio Digilago face à l’océan')} className="lg:col-span-6" />
        <div className="lg:col-span-6"><Head kicker={t('Grands comptes')} title={t('Des projets d’envergure, la même exigence.')} lead={t('Groupes scolaires, cliniques, promoteurs, réseaux d’agences : nous menons les plateformes sur-mesure avec des jalons écrits, un interlocuteur unique et un code qui vous appartient.')} /><Reveal delay={0.1}><Link to={L('/contact')} className="btn btn-line mt-8">{t('Parler de votre projet')} <ArrowUpRight size={16} /></Link></Reveal></div>
      </div></section>

      <section id="labs" className="light py-32 md:py-40 lg:py-52 scroll-mt-20"><div className="wrap">
        <Head kicker="Digilago Labs" title={t('Nous construisons aussi nos propres produits.')} lead={t(LABS.lead)} />
        <Swipe cols="md:grid-cols-2" className="mt-12 md:mt-14" item="w-[84%] sm:w-[60%]">{LABS.projects.map((p, i) => (
          <Reveal key={p.name} delay={(i % 2) * 0.06} className="h-full"><article onMouseMove={spot} className="spot relative h-full overflow-hidden rounded-3xl bg-nuit-2 ring-1 ring-white/10 p-8 text-white">
            <span className="absolute -end-20 -top-20 w-60 h-60 rounded-full blur-3xl opacity-30" style={{ background: p.color }} />
            <div className="relative flex items-center justify-between gap-4"><p className="text-[14px] text-brume">{t(p.kind)}</p><span className="px-3 py-1 rounded-full text-[13px] ring-1 ring-white/15">{t(p.status)}</span></div>
            <h3 className="relative mt-6 text-[34px]">{p.name}</h3><p className="relative mt-3 text-brume max-w-[50ch]">{t(p.text)}</p>
          </article></Reveal>
        ))}</Swipe>
      </div></section>

      <FinalCTA />
    </>
  );
}
