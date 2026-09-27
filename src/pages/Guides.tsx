/**
 * Guides : articles de fond qui répondent aux questions que les Marocains tapent sur Google
 * et posent aux IA (« prix site web Maroc », « apparaître sur Google Maps », « être recommandé par ChatGPT »…).
 * Chaque article est structuré (titres, listes, FAQ, données Article) pour être facilement cité.
 */
import { Link, useParams } from 'react-router-dom';
import { ArrowUpRight, Clock } from 'lucide-react';
import { t, tv, L } from '../i18n';
import { Reveal } from '../ui';
import { ScrollText } from '../fx';
import { FinalCTA } from '../sections';
import { Seo, faqLd, SITE } from '../seo';
import NotFound from './NotFound';

type T3 = { fr: string; en: string; ar: string };
type Block = { h: T3; p?: T3[]; list?: T3[]; after?: T3[] };
type Article = { slug: string; title: T3; desc: T3; read: number; date: string; blocks: Block[]; faq: { q: T3; a: T3 }[] };

export const ARTICLES: Article[] = [
  {
    slug: 'prix-site-web-maroc', read: 6, date: '2026-09-27',
    title: { fr: 'Combien coûte un site web au Maroc en 2026 ?', en: 'How much does a website cost in Morocco in 2026?', ar: 'كم تبلغ تكلفة موقع إلكتروني في المغرب سنة 2026؟' },
    desc: { fr: 'Site vitrine, boutique en ligne, application : les fourchettes de prix au Maroc, ce qui fait varier le budget et comment éviter les mauvaises surprises.', en: 'Showcase site, online store, app: price ranges in Morocco, what drives the budget and how to avoid bad surprises.', ar: 'موقع تعريفي، متجر إلكتروني، تطبيق: نطاقات الأسعار في المغرب، والعوامل التي تحدد الميزانية، وكيف تتجنب المفاجآت غير السارة.' },
    blocks: [
      { h: { fr: 'La réponse courte', en: 'The short answer', ar: 'الجواب المختصر' }, p: [
        { fr: 'Au Maroc, les prix observés sur le marché vont d’environ 3 000 MAD pour un site vitrine simple fait à partir d’un thème, à plus de 50 000 MAD pour une plateforme sur-mesure. La plupart des PME se situent entre les deux. Ce qui compte n’est pas le prix affiché, mais ce que le site vous rapporte : des appels, des réservations, des ventes.', en: 'In Morocco, market prices range from about 3,000 MAD for a simple template-based showcase site to over 50,000 MAD for a custom platform. Most SMEs sit somewhere in between. What matters is not the sticker price but what the site brings in: calls, bookings, sales.', ar: 'في المغرب، تتراوح الأسعار الملاحظة في السوق بين حوالي 3000 درهم لموقع تعريفي بسيط مبني على قالب جاهز، وأكثر من 50000 درهم لمنصة مخصّصة. وتقع معظم المقاولات الصغرى والمتوسطة بين الحدّين. والمهم ليس السعر المعلن، بل ما يحققه الموقع لك: اتصالات، حجوزات، ومبيعات.' },
      ] },
      { h: { fr: 'Les fourchettes observées au Maroc', en: 'Typical price ranges in Morocco', ar: 'النطاقات السعرية الملاحظة في المغرب' }, list: [
        { fr: 'Site vitrine à partir d’un thème : environ 3 000 à 8 000 MAD. Rapide à lancer, mais souvent lent, peu différenciant et difficile à bien référencer.', en: 'Template-based showcase site: about 3,000 to 8,000 MAD. Quick to launch, but often slow, generic and hard to rank well.', ar: 'موقع تعريفي بقالب جاهز: حوالي 3000 إلى 8000 درهم. سريع الإطلاق، لكنه غالبًا بطيء وعام ويصعب تحسين ترتيبه.' },
        { fr: 'Site vitrine sur-mesure, multilingue et optimisé SEO : environ 8 000 à 25 000 MAD selon le nombre de pages et de langues.', en: 'Custom, multilingual, SEO-optimised showcase site: about 8,000 to 25,000 MAD depending on pages and languages.', ar: 'موقع تعريفي مخصّص ومتعدد اللغات ومحسّن لمحركات البحث: حوالي 8000 إلى 25000 درهم حسب عدد الصفحات واللغات.' },
        { fr: 'Site avec réservation ou prise de rendez-vous : environ 12 000 à 35 000 MAD.', en: 'Site with bookings or appointments: about 12,000 to 35,000 MAD.', ar: 'موقع مع نظام حجز أو مواعيد: حوالي 12000 إلى 35000 درهم.' },
        { fr: 'Boutique en ligne (catalogue, paiement CMI ou à la livraison, gestion des commandes) : environ 15 000 à 60 000 MAD.', en: 'Online store (catalogue, CMI or cash-on-delivery payment, order management): about 15,000 to 60,000 MAD.', ar: 'متجر إلكتروني (كتالوج، دفع عبر CMI أو عند التسليم، إدارة الطلبات): حوالي 15000 إلى 60000 درهم.' },
        { fr: 'Application web ou mobile, logiciel métier : à partir de 40 000 MAD, selon les fonctionnalités.', en: 'Web or mobile app, business software: from 40,000 MAD, depending on features.', ar: 'تطبيق ويب أو جوال، برمجيات أعمال: ابتداءً من 40000 درهم حسب الوظائف.' },
      ], after: [{ fr: 'Ces montants sont indicatifs et varient selon les prestataires. Demandez toujours un devis écrit et détaillé.', en: 'These figures are indicative and vary by provider. Always ask for a detailed written quote.', ar: 'هذه المبالغ تقريبية وتختلف حسب مقدّمي الخدمة. اطلب دائمًا عرض سعر مكتوبًا ومفصّلًا.' }] },
      { h: { fr: 'Ce qui fait varier le prix', en: 'What drives the price', ar: 'العوامل التي تحدد السعر' }, list: [
        { fr: 'Le design : un thème acheté coûte moins cher qu’un design créé pour votre marque, mais il vous ressemble moins et convertit moins.', en: 'Design: a bought theme costs less than a design built for your brand, but it looks less like you and converts less.', ar: 'التصميم: القالب الجاهز أرخص من تصميم مبتكر لعلامتك، لكنه أقل تعبيرًا عنك وأضعف في تحويل الزوار إلى عملاء.' },
        { fr: 'Le nombre de langues : arabe, français, anglais. Chaque langue demande une vraie rédaction, pas une traduction automatique.', en: 'Number of languages: Arabic, French, English. Each language needs real writing, not machine translation.', ar: 'عدد اللغات: العربية والفرنسية والإنجليزية. كل لغة تتطلب كتابة حقيقية، لا ترجمة آلية.' },
        { fr: 'Les fonctionnalités : réservation, paiement en ligne, espace client, intégration WhatsApp.', en: 'Features: bookings, online payment, client portal, WhatsApp integration.', ar: 'الوظائف: الحجز، الدفع الإلكتروني، فضاء العملاء، الربط مع واتساب.' },
        { fr: 'Le référencement : un site bien structuré pour Google et les IA demande plus de travail au départ, mais attire des clients pendant des années.', en: 'SEO: a site properly structured for Google and AI takes more work upfront, but attracts customers for years.', ar: 'تحسين محركات البحث: الموقع المُهيكل جيدًا لـGoogle والذكاء الاصطناعي يتطلب جهدًا أكبر في البداية، لكنه يجلب العملاء لسنوات.' },
        { fr: 'Les contenus : textes, photos, fiche Google. Ils sont souvent oubliés dans les devis, alors qu’ils font la différence.', en: 'Content: copy, photos, Google profile. Often left out of quotes, yet they make the difference.', ar: 'المحتوى: النصوص والصور وملف Google. كثيرًا ما يُنسى في عروض الأسعار، مع أنه يصنع الفرق.' },
      ] },
      { h: { fr: 'Les coûts à ne pas oublier', en: 'Costs you shouldn’t forget', ar: 'تكاليف لا ينبغي نسيانها' }, list: [
        { fr: 'Le nom de domaine (.ma ou .com) et l’hébergement, chaque année.', en: 'Domain name (.ma or .com) and hosting, every year.', ar: 'اسم النطاق (.ma أو .com) والاستضافة، كل سنة.' },
        { fr: 'La maintenance : mises à jour, sécurité, sauvegardes.', en: 'Maintenance: updates, security, backups.', ar: 'الصيانة: التحديثات والأمان والنسخ الاحتياطي.' },
        { fr: 'Les évolutions : nouvelles pages, nouvelles offres, nouvelles langues.', en: 'Improvements: new pages, new offers, new languages.', ar: 'التطويرات: صفحات وعروض ولغات جديدة.' },
      ] },
      { h: { fr: 'Comment éviter les mauvaises surprises', en: 'How to avoid bad surprises', ar: 'كيف تتجنب المفاجآت غير السارة' }, list: [
        { fr: 'Exigez que le nom de domaine, le code et les contenus soient à votre nom.', en: 'Insist that the domain name, code and content are in your name.', ar: 'اشترط أن يكون اسم النطاق والشيفرة والمحتوى باسمك.' },
        { fr: 'Demandez à voir une première version avant de payer l’intégralité du projet.', en: 'Ask to see a first version before paying for the whole project.', ar: 'اطلب رؤية نسخة أولى قبل دفع كامل قيمة المشروع.' },
        { fr: 'Vérifiez la vitesse sur téléphone et la présence sur Google des sites réalisés par le prestataire.', en: 'Check the mobile speed and Google presence of sites the provider has built.', ar: 'تحقق من سرعة المواقع التي أنجزها مقدّم الخدمة على الهاتف ومن حضورها على Google.' },
      ], after: [{ fr: 'Chez Digilago, nous annonçons le prix par écrit avant de commencer et vous découvrez une première version de votre site en 72 heures. Si elle ne vous plaît pas, vous ne payez rien.', en: 'At Digilago, we confirm the price in writing before we start, and you see a first version of your site within 72 hours. If you don’t love it, you pay nothing.', ar: 'في ديجيلاغو، نحدّد السعر كتابيًا قبل البدء، وتكتشف نسخة أولى من موقعك خلال 72 ساعة. إن لم تنل إعجابك، لا تدفع شيئًا.' }] },
    ],
    faq: [
      { q: { fr: 'Quel est le prix d’un site vitrine au Maroc ?', en: 'How much is a showcase website in Morocco?', ar: 'كم سعر الموقع التعريفي في المغرب؟' }, a: { fr: 'Environ 3 000 à 8 000 MAD avec un thème, et 8 000 à 25 000 MAD pour un site sur-mesure, multilingue et optimisé pour le référencement.', en: 'About 3,000 to 8,000 MAD with a template, and 8,000 to 25,000 MAD for a custom, multilingual, SEO-optimised site.', ar: 'حوالي 3000 إلى 8000 درهم بقالب جاهز، و8000 إلى 25000 درهم لموقع مخصّص ومتعدد اللغات ومحسّن لمحركات البحث.' } },
      { q: { fr: 'Combien coûte une boutique en ligne au Maroc ?', en: 'How much does an online store cost in Morocco?', ar: 'كم تكلفة متجر إلكتروني في المغرب؟' }, a: { fr: 'Environ 15 000 à 60 000 MAD selon le catalogue, les moyens de paiement (CMI, paiement à la livraison) et la gestion des commandes.', en: 'About 15,000 to 60,000 MAD depending on the catalogue, payment methods (CMI, cash on delivery) and order management.', ar: 'حوالي 15000 إلى 60000 درهم حسب الكتالوج ووسائل الدفع (CMI، الدفع عند التسليم) وإدارة الطلبات.' } },
    ],
  },
  {
    slug: 'apparaitre-google-chatgpt-maroc', read: 7, date: '2026-09-27',
    title: { fr: 'Comment apparaître sur Google et dans ChatGPT au Maroc', en: 'How to show up on Google and in ChatGPT in Morocco', ar: 'كيف تظهر على Google وفي ChatGPT في المغرب' },
    desc: { fr: 'Fiche Google, SEO local, GEO : le guide pratique pour qu’une entreprise marocaine soit trouvée sur Google, sur Maps et recommandée par les assistants d’IA.', en: 'Google profile, local SEO, GEO: a practical guide for Moroccan businesses to be found on Google and Maps and recommended by AI assistants.', ar: 'ملف Google، تحسين محلي لمحركات البحث، GEO: دليل عملي لتظهر الشركة المغربية على Google والخرائط وتوصي بها المساعدات الذكية.' },
    blocks: [
      { h: { fr: 'Trois endroits où vos clients vous cherchent', en: 'Three places customers look for you', ar: 'ثلاثة أماكن يبحث فيها عملاؤك عنك' }, p: [
        { fr: 'Aujourd’hui, un client marocain trouve une entreprise de trois façons : une recherche Google (« agence immobilière Tanger »), la carte Google Maps (« pharmacie ouverte près de moi ») ou une question posée à une IA (« quel est un bon dentiste à Rabat ? »). Être visible, c’est être présent aux trois endroits.', en: 'Today, a Moroccan customer finds a business in three ways: a Google search (“real estate agency Tangier”), Google Maps (“pharmacy open near me”) or a question to an AI (“who is a good dentist in Rabat?”). Being visible means being present in all three.', ar: 'اليوم، يجد العميل المغربي الشركات بثلاث طرق: بحث على Google («وكالة عقارية طنجة»)، أو خرائط Google («صيدلية مفتوحة قربي»)، أو سؤال يطرحه على الذكاء الاصطناعي («من هو طبيب أسنان جيد في الرباط؟»). أن تكون مرئيًا يعني أن تكون حاضرًا في الأماكن الثلاثة.' },
      ] },
      { h: { fr: '1. Une fiche Google Business complète', en: '1. A complete Google Business Profile', ar: '1. ملف Google Business مكتمل' }, list: [
        { fr: 'Choisissez la catégorie principale la plus précise possible, puis des catégories secondaires.', en: 'Pick the most precise primary category, then secondary ones.', ar: 'اختر الفئة الرئيسية الأكثر دقة، ثم فئات ثانوية.' },
        { fr: 'Ajoutez horaires exacts, téléphone, site web, zones desservies et au moins dix vraies photos.', en: 'Add exact hours, phone, website, service areas and at least ten real photos.', ar: 'أضف الأوقات الدقيقة والهاتف والموقع ومناطق الخدمة وعشر صور حقيقية على الأقل.' },
        { fr: 'Demandez des avis à chaque client satisfait, et répondez à tous les avis, même négatifs.', en: 'Ask every happy customer for a review, and reply to every review, even negative ones.', ar: 'اطلب تقييمًا من كل عميل راضٍ، وردّ على جميع التقييمات، حتى السلبية منها.' },
        { fr: 'Publiez régulièrement : offres, nouveautés, photos.', en: 'Post regularly: offers, news, photos.', ar: 'انشر بانتظام: عروض ومستجدات وصور.' },
      ] },
      { h: { fr: '2. Un site rapide, clair et bien structuré', en: '2. A fast, clear, well-structured website', ar: '2. موقع سريع وواضح ومُهيكل جيدًا' }, list: [
        { fr: 'Une page par service et, si vous travaillez dans plusieurs villes, une page par ville.', en: 'One page per service and, if you work in several cities, one page per city.', ar: 'صفحة لكل خدمة، وإن كنت تعمل في عدة مدن، صفحة لكل مدينة.' },
        { fr: 'Des titres qui reprennent les mots de vos clients : « création site web Casablanca », pas « nos solutions ».', en: 'Headings that use your customers’ words: “website design Casablanca”, not “our solutions”.', ar: 'عناوين تستخدم كلمات عملائك: «تصميم موقع الدار البيضاء»، لا «حلولنا».' },
        { fr: 'Un chargement en moins de deux secondes sur téléphone, car la plupart des recherches au Maroc se font sur mobile.', en: 'Loading in under two seconds on mobile, since most searches in Morocco happen on phones.', ar: 'تحميل في أقل من ثانيتين على الهاتف، لأن معظم عمليات البحث في المغرب تتم عبر الجوال.' },
        { fr: 'Des versions en arabe et en français, rédigées pour chaque langue.', en: 'Arabic and French versions, written for each language.', ar: 'نسخ بالعربية والفرنسية، مكتوبة خصيصًا لكل لغة.' },
      ] },
      { h: { fr: '3. Le GEO : être recommandé par les IA', en: '3. GEO: being recommended by AI', ar: '3. الـGEO: أن توصي بك المساعدات الذكية' }, p: [
        { fr: 'ChatGPT, Gemini ou Perplexity construisent leurs réponses à partir de sources qu’ils jugent fiables et faciles à comprendre. Le Generative Engine Optimization consiste à rendre votre entreprise lisible et crédible pour eux.', en: 'ChatGPT, Gemini and Perplexity build their answers from sources they find reliable and easy to understand. Generative Engine Optimization means making your business readable and credible to them.', ar: 'يبني ChatGPT وGemini وPerplexity إجاباتهم انطلاقًا من مصادر يرونها موثوقة وسهلة الفهم. ويعني تحسين الظهور في محركات الذكاء الاصطناعي التوليدي جعل شركتك مفهومة وذات مصداقية بالنسبة لهم.' },
      ], list: [
        { fr: 'Des données structurées Schema.org : qui vous êtes, où, pour qui, à quelles heures.', en: 'Schema.org structured data: who you are, where, for whom, at what hours.', ar: 'بيانات مُهيكلة Schema.org: من أنت، وأين، ولمن، وفي أي أوقات.' },
        { fr: 'Un fichier llms.txt qui résume votre activité pour les robots des IA.', en: 'An llms.txt file that summarises your business for AI crawlers.', ar: 'ملف llms.txt يلخّص نشاطك لروبوتات الذكاء الاصطناعي.' },
        { fr: 'Des réponses claires aux questions fréquentes, avec des faits précis (prix, délais, zones).', en: 'Clear answers to common questions, with precise facts (prices, timelines, areas).', ar: 'إجابات واضحة عن الأسئلة الشائعة، مع معطيات دقيقة (الأسعار، الآجال، المناطق).' },
        { fr: 'Des mentions de votre entreprise ailleurs : annuaires marocains, presse locale, sites de vos partenaires, avis.', en: 'Mentions of your business elsewhere: Moroccan directories, local press, partner websites, reviews.', ar: 'ذكر شركتك في أماكن أخرى: الأدلة المغربية، الصحافة المحلية، مواقع الشركاء، والتقييمات.' },
      ] },
      { h: { fr: 'Combien de temps faut-il ?', en: 'How long does it take?', ar: 'كم يستغرق ذلك؟' }, p: [
        { fr: 'Une fiche Google bien remplie peut générer des appels en quelques semaines. Le référencement d’un site sur des recherches concurrentielles demande généralement trois à six mois de travail régulier. Personne ne peut garantir une première place, mais une méthode sérieuse vous en rapproche mois après mois.', en: 'A well-completed Google profile can bring calls within weeks. Ranking a site for competitive searches usually takes three to six months of steady work. No one can guarantee first place, but a serious method brings you closer month after month.', ar: 'يمكن لملف Google مكتمل أن يجلب اتصالات خلال أسابيع قليلة. أما ترتيب الموقع في عمليات البحث التنافسية فيتطلب عادة من ثلاثة إلى ستة أشهر من العمل المنتظم. لا أحد يستطيع ضمان المرتبة الأولى، لكن المنهجية الجادة تقرّبك منها شهرًا بعد شهر.' },
      ] },
    ],
    faq: [
      { q: { fr: 'Comment apparaître sur Google Maps au Maroc ?', en: 'How do I appear on Google Maps in Morocco?', ar: 'كيف أظهر على خرائط Google في المغرب؟' }, a: { fr: 'Créez et faites vérifier votre fiche Google Business, remplissez toutes les informations, ajoutez de vraies photos et collectez régulièrement des avis clients.', en: 'Create and verify your Google Business Profile, fill in every field, add real photos and collect customer reviews regularly.', ar: 'أنشئ ملفك على Google Business ووثّقه، واملأ جميع المعلومات، وأضف صورًا حقيقية، واجمع تقييمات العملاء بانتظام.' } },
      { q: { fr: 'Qu’est-ce que le GEO ?', en: 'What is GEO?', ar: 'ما هو الـGEO؟' }, a: { fr: 'Le Generative Engine Optimization rend une entreprise compréhensible et crédible pour les assistants d’IA comme ChatGPT, Gemini ou Perplexity, afin qu’ils la recommandent.', en: 'Generative Engine Optimization makes a business understandable and credible to AI assistants such as ChatGPT, Gemini or Perplexity, so they recommend it.', ar: 'تحسين الظهور في محركات الذكاء الاصطناعي التوليدي يجعل الشركة مفهومة وذات مصداقية لدى المساعدات الذكية مثل ChatGPT وGemini وPerplexity، لكي توصي بها.' } },
    ],
  },
];

export const GuidesHub = () => (
  <>
    <Seo title={tv({ fr: 'Guides : création de site, SEO et IA au Maroc | Digilago', en: 'Guides: websites, SEO and AI in Morocco | Digilago', ar: 'أدلة: إنشاء المواقع وتحسين محركات البحث والذكاء الاصطناعي في المغرب | ديجيلاغو' })}
      description={tv({ fr: 'Des guides clairs pour les entreprises marocaines : prix d’un site web, référencement local, fiche Google, visibilité dans ChatGPT et les IA.', en: 'Clear guides for Moroccan businesses: website prices, local SEO, Google profile, visibility in ChatGPT and AI.', ar: 'أدلة واضحة للشركات المغربية: أسعار المواقع، التحسين المحلي لمحركات البحث، ملف Google، والظهور في ChatGPT والذكاء الاصطناعي.' })}
      crumbs={[[t('Accueil'), '/'], [tv({ fr: 'Guides', en: 'Guides', ar: 'الأدلة' }), '/guides']]} />
    <section className="dark pt-36 pb-24 lg:pt-44 lg:pb-32"><div className="wrap">
      <Reveal><p className="kicker">{tv({ fr: 'Guides', en: 'Guides', ar: 'الأدلة' })}</p></Reveal>
      <ScrollText auto as="h1" text={tv({ fr: 'Tout comprendre pour être trouvé en ligne au Maroc.', en: 'Everything you need to get found online in Morocco.', ar: 'كل ما تحتاج إليه لتظهر على الإنترنت في المغرب.' })} className="mt-5 text-[clamp(2.3rem,5vw,4.4rem)] leading-[1.02] max-w-[22ch]" />
    </div></section>
    <section className="light py-24 md:py-32"><div className="wrap grid md:grid-cols-2 gap-5">{ARTICLES.map((a) => (
      <Reveal key={a.slug}><Link to={L(`/guides/${a.slug}`)} className="group block h-full rounded-3xl bg-white ring-1 ring-encre/8 p-8 transition-shadow hover:shadow-[0_30px_60px_-30px_rgba(10,20,40,.3)]">
        <p className="flex items-center gap-2 text-[14px] text-[#0E8FA0]"><Clock size={15} />{tv({ fr: `${a.read} min de lecture`, en: `${a.read} min read`, ar: `${a.read} دقائق للقراءة` })}</p>
        <h2 className="mt-3 text-[28px] leading-tight">{tv(a.title)}</h2>
        <p className="mt-3 text-ardoise">{tv(a.desc)}</p>
        <span className="mt-6 inline-flex items-center gap-2 font-medium group-hover:text-[#0E8FA0]">{tv({ fr: 'Lire le guide', en: 'Read the guide', ar: 'اقرأ الدليل' })} <ArrowUpRight size={15} /></span>
      </Link></Reveal>
    ))}</div></section>
    <FinalCTA />
  </>
);

export const ArticlePage = () => {
  const { slug } = useParams(); const a = ARTICLES.find((x) => x.slug === slug);
  if (!a) return <NotFound />;
  const faq = a.faq.map((x) => ({ q: tv(x.q), a: tv(x.a) }));
  return (
    <>
      <Seo title={`${tv(a.title)} | Digilago`} description={tv(a.desc)}
        crumbs={[[t('Accueil'), '/'], [tv({ fr: 'Guides', en: 'Guides', ar: 'الأدلة' }), '/guides'], [tv(a.title), `/guides/${a.slug}`]]}
        jsonLd={[{ '@type': 'Article', headline: tv(a.title), description: tv(a.desc), datePublished: a.date, dateModified: a.date, author: { '@id': `${SITE}/#organisation` }, publisher: { '@id': `${SITE}/#organisation` } }, faqLd(faq)]} />
      <section className="dark pt-36 pb-20 lg:pt-44 lg:pb-24"><div className="wrap max-w-4xl">
        <Reveal><nav className="text-[14px] text-brume"><Link to={L('/guides')} className="hover:text-white">{tv({ fr: 'Guides', en: 'Guides', ar: 'الأدلة' })}</Link></nav></Reveal>
        <ScrollText auto as="h1" text={tv(a.title)} className="mt-5 text-[clamp(2.1rem,4.4vw,3.8rem)] leading-[1.06]" />
        <Reveal delay={0.4}><p className="mt-6 text-[18.5px] text-white/80">{tv(a.desc)}</p><p className="mt-4 flex items-center gap-2 text-[14px] text-brume"><Clock size={15} />{tv({ fr: `${a.read} min de lecture · Digilago`, en: `${a.read} min read · Digilago`, ar: `${a.read} دقائق للقراءة · ديجيلاغو` })}</p></Reveal>
      </div></section>
      <article className="light py-20 md:py-28"><div className="wrap max-w-3xl space-y-12 text-[17.5px] leading-[1.8] text-ardoise">
        {a.blocks.map((b, i) => (
          <section key={i}>
            <h2 className="text-[clamp(1.5rem,2.4vw,2rem)] text-encre">{tv(b.h)}</h2>
            {b.p?.map((x, k) => <p key={k} className="mt-4">{tv(x)}</p>)}
            {b.list && <ul className="mt-5 space-y-3">{b.list.map((x, k) => <li key={k} className="flex gap-3"><span className="mt-3 w-2 h-2 shrink-0 bg-safran" />{tv(x)}</li>)}</ul>}
            {b.after?.map((x, k) => <p key={k} className="mt-5">{tv(x)}</p>)}
          </section>
        ))}
        <section>
          <h2 className="text-[clamp(1.5rem,2.4vw,2rem)] text-encre">{tv({ fr: 'Questions fréquentes', en: 'Frequently asked questions', ar: 'الأسئلة الشائعة' })}</h2>
          <div className="mt-5 divide-y divide-encre/10 border-y border-encre/10">{faq.map((x) => <details key={x.q} className="group py-5"><summary className="cursor-pointer list-none flex justify-between gap-6 font-display text-[18px] text-encre">{x.q}<span className="text-[22px] transition-transform group-open:rotate-45">+</span></summary><p className="mt-3">{x.a}</p></details>)}</div>
        </section>
        <p className="pt-4 border-t border-encre/10 text-[15px]">{tv({ fr: 'À lire aussi : ', en: 'Read next: ', ar: 'اقرأ أيضًا: ' })}{ARTICLES.filter((x) => x.slug !== a.slug).map((x) => <Link key={x.slug} to={L(`/guides/${x.slug}`)} className="text-encre underline underline-offset-4">{tv(x.title)}</Link>)} · <Link to={L('/creation-site-web')} className="text-encre underline underline-offset-4">{tv({ fr: 'Création de site web par ville', en: 'Website design by city', ar: 'تصميم المواقع حسب المدينة' })}</Link></p>
      </div></article>
      <FinalCTA />
    </>
  );
};
