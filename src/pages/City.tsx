/**
 * Pages locales : « Création de site web à [ville] » et la page qui les regroupe.
 * Objectif : apparaître sur les recherches locales (« création site web Casablanca », « agence web Rabat »…)
 * avec un contenu réellement utile pour chaque ville.
 */
import { Link, useParams } from 'react-router-dom';
import { ArrowUpRight, Check, MapPin } from 'lucide-react';
import { t, tv, L } from '../i18n';
import { CITIES, City } from '../cities';
import { CATALOG } from '../data';
import { Reveal, Head } from '../ui';
import { ScrollText, RevealImg } from '../fx';
import { FinalCTA, Faq } from '../sections';
import { Seo, faqLd, SITE } from '../seo';
import { IMG } from '../data';
import NotFound from './NotFound';

const cityFaq = (c: City) => {
  const n = tv(c.name);
  return [
    { q: tv({ fr: `Combien coûte la création d’un site web à ${n} ?`, en: `How much does a website cost in ${n}?`, ar: `كم تبلغ تكلفة إنشاء موقع إلكتروني في ${n}؟` }),
      a: tv({ fr: `Le prix dépend de vos besoins : site vitrine, réservation, boutique en ligne ou application. Nous l’annonçons par écrit avant de commencer, et vous découvrez une première version de votre site en 72 heures : si elle ne vous plaît pas, vous ne payez rien.`, en: `It depends on what you need: showcase site, booking, online store or app. We confirm the price in writing before we start, and you see a first version of your site within 72 hours: if you don’t love it, you pay nothing.`, ar: `يعتمد السعر على احتياجاتك: موقع تعريفي، نظام حجز، متجر إلكتروني أو تطبيق. نحدّد السعر كتابيًا قبل البدء، وتكتشف نسخة أولى من موقعك خلال 72 ساعة: إن لم تنل إعجابك، لا تدفع شيئًا.` }) },
    { q: tv({ fr: `Travaillez-vous avec les entreprises de ${n} à distance ?`, en: `Do you work remotely with businesses in ${n}?`, ar: `هل تعملون عن بُعد مع الشركات في ${n}؟` }),
      a: tv({ fr: `Oui. Notre studio est à El Jadida et nous accompagnons des entreprises de ${n} par téléphone, WhatsApp et visio. Nous nous déplaçons quand un rendez-vous sur place est utile.`, en: `Yes. Our studio is in El Jadida and we work with businesses in ${n} by phone, WhatsApp and video call. We travel when an in-person meeting helps.`, ar: `نعم. يقع الاستوديو الخاص بنا في الجديدة، ونرافق الشركات في ${n} عبر الهاتف وواتساب والاجتماعات المرئية، ونتنقل عند الحاجة إلى لقاء حضوري.` }) },
    { q: tv({ fr: `Pouvez-vous me faire apparaître sur Google Maps à ${n} ?`, en: `Can you get me on Google Maps in ${n}?`, ar: `هل يمكنكم إظهاري على خرائط Google في ${n}؟` }),
      a: tv({ fr: `Oui. Nous créons ou optimisons votre fiche Google Business (catégories, photos, horaires, zones desservies à ${n}), nous la relions à votre site et nous vous aidons à collecter des avis. C’est souvent le levier le plus rapide pour être appelé par des clients locaux.`, en: `Yes. We create or optimise your Google Business Profile (categories, photos, hours, service areas in ${n}), connect it to your website and help you collect reviews. It is often the fastest way to get calls from local customers.`, ar: `نعم. ننشئ ملفك على Google Business أو نحسّنه (الفئات، الصور، الأوقات، مناطق الخدمة في ${n})، ونربطه بموقعك، ونساعدك على جمع التقييمات. وغالبًا ما يكون ذلك أسرع وسيلة لتلقي اتصالات العملاء المحليين.` }) },
    { q: tv({ fr: `Mon site pourra-t-il être recommandé par ChatGPT ou Gemini ?`, en: `Can my website be recommended by ChatGPT or Gemini?`, ar: `هل يمكن أن يوصي ChatGPT أو Gemini بموقعي؟` }),
      a: tv({ fr: `C’est l’objectif du GEO (Generative Engine Optimization). Nous structurons vos contenus et vos données (Schema.org, llms.txt, pages claires par service et par ville) pour que les assistants d’IA comprennent qui vous êtes, où vous êtes et pour qui vous travaillez.`, en: `That is the goal of GEO (Generative Engine Optimization). We structure your content and data (Schema.org, llms.txt, clear pages per service and city) so AI assistants understand who you are, where you are and who you serve.`, ar: `هذا هو هدف الـGEO (تحسين الظهور في محركات الذكاء الاصطناعي التوليدي). نُهيكل محتواك وبياناتك (Schema.org، ملف llms.txt، صفحات واضحة لكل خدمة ومدينة) لكي تفهم المساعدات الذكية من أنت وأين تعمل ولمن تقدّم خدماتك.` }) },
  ];
};

export const CityPage = () => {
  const { ville } = useParams(); const c = CITIES.find((x) => x.slug === ville);
  if (!c) return <NotFound />;
  const n = tv(c.name); const faq = cityFaq(c);
  const others = CITIES.filter((x) => x.slug !== c.slug);
  return (
    <>
      <Seo
        title={tv({ fr: `Création de site web à ${n} | Agence web & SEO · Digilago`, en: `Website design in ${n} | Web agency & SEO · Digilago`, ar: `تصميم مواقع الويب في ${n} | وكالة ويب وSEO · ديجيلاغو` })}
        description={tv({ fr: `Création de site internet à ${n} : sites sur-mesure, boutiques en ligne, référencement SEO local, fiche Google et visibilité dans les IA. Première version en 72 h, vous ne payez que si elle vous plaît.`, en: `Website design in ${n}: custom websites, online stores, local SEO, Google Business Profile and AI visibility. First version in 72 hours; you only pay if you love it.`, ar: `تصميم وتطوير المواقع الإلكترونية في ${n}: مواقع مخصّصة، متاجر إلكترونية، تحسين محلي لمحركات البحث، ملف Google وظهور في الذكاء الاصطناعي. النسخة الأولى خلال 72 ساعة، ولا تدفع إلا إذا نالت إعجابك.` })}
        crumbs={[[t('Accueil'), '/'], [tv({ fr: 'Création de site web au Maroc', en: 'Website design in Morocco', ar: 'تصميم المواقع في المغرب' }), '/creation-site-web'], [n, `/creation-site-web/${c.slug}`]]}
        jsonLd={[faqLd(faq), { '@type': 'Service', name: tv({ fr: `Création de site web à ${n}`, en: `Website design in ${n}`, ar: `تصميم مواقع الويب في ${n}` }), serviceType: 'Création de site web', provider: { '@id': `${SITE}/#organisation` }, areaServed: { '@type': 'City', name: c.name.fr, geo: { '@type': 'GeoCoordinates', latitude: c.lat, longitude: c.lng } } }]}
      />
      <section className="dark relative overflow-hidden pt-36 pb-24 lg:pt-44 lg:pb-32"><div className="wrap grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          <Reveal><nav aria-label="Fil d’Ariane" className="text-[14px] text-brume"><Link to={L('/')} className="hover:text-white">{t('Accueil')}</Link> <span className="mx-2">/</span> <Link to={L('/creation-site-web')} className="hover:text-white">{tv({ fr: 'Villes', en: 'Cities', ar: 'المدن' })}</Link> <span className="mx-2">/</span> <span className="text-white">{n}</span></nav></Reveal>
          <ScrollText auto as="h1" text={tv({ fr: `Création de site web à ${n}`, en: `Website design in ${n}`, ar: `تصميم مواقع الويب في ${n}` })} className="mt-6 text-[clamp(2.3rem,5vw,4.4rem)] leading-[1.02]" />
          <Reveal delay={0.4}><p className="mt-7 text-[18.5px] text-white/80 max-w-[58ch]">{tv(c.intro)}</p></Reveal>
          <Reveal delay={0.5} className="mt-9 flex flex-wrap gap-3"><Link to={L('/contact')} className="btn btn-safran">{t('Commencer ma présence en ligne')} <ArrowUpRight size={16} /></Link><Link to={L('/realisations')} className="btn btn-line">{t('Voir nos réalisations')}</Link></Reveal>
        </div>
        <RevealImg src={IMG.search} alt={tv({ fr: `Recherche Google d’une entreprise à ${n}`, en: `Google search for a business in ${n}`, ar: `بحث على Google عن شركة في ${n}` })} className="lg:col-span-5" />
      </div></section>

      <section className="light py-28 md:py-36 lg:py-44"><div className="wrap grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5"><Head sm kicker={tv({ fr: 'Pourquoi c’est important', en: 'Why it matters', ar: 'لماذا يهمّك ذلك' })} title={tv({ fr: `À ${n}, vos clients vous cherchent d’abord sur Google.`, en: `In ${n}, customers look for you on Google first.`, ar: `في ${n}، يبحث عنك عملاؤك على Google أولًا.` })} /></div>
        <div className="lg:col-span-7 space-y-5 text-[17px] text-ardoise">
          <Reveal><p>{tv({ fr: `Quand quelqu’un tape « ${t('restaurant')} ${n} », « dentiste ${n} » ou « création site web ${n} », Google et les assistants d’IA affichent les entreprises qui ont un site rapide, une fiche Google complète et des contenus clairs. Les autres n’existent tout simplement pas pour ce client.`, en: `When someone searches “restaurant ${n}”, “dentist ${n}” or “website design ${n}”, Google and AI assistants show businesses with a fast website, a complete Google profile and clear content. The others simply don’t exist for that customer.`, ar: `عندما يبحث أحدهم عن «مطعم ${n}» أو «طبيب أسنان ${n}» أو «تصميم موقع ${n}»، يعرض Google والمساعدات الذكية الشركات التي تملك موقعًا سريعًا وملف Google مكتملًا ومحتوى واضحًا. أما البقية فلا وجود لها بالنسبة لهذا العميل.` })}</p></Reveal>
          <Reveal><p>{tv({ fr: `Nous accompagnons les entreprises de tout ${n} : ${c.areas.fr}. Chaque site est conçu pour votre quartier, votre clientèle et vos concurrents directs.`, en: `We work with businesses across ${n}: ${c.areas.en}. Every site is designed for your area, your customers and your direct competitors.`, ar: `نرافق الشركات في مختلف أحياء ${n}: ${c.areas.ar}. نصمّم كل موقع ليناسب منطقتك وعملاءك ومنافسيك المباشرين.` })}</p></Reveal>
          <Reveal><p className="text-encre font-medium">{tv({ fr: `Secteurs que nous accompagnons le plus à ${n} :`, en: `Sectors we most often support in ${n}:`, ar: `أكثر القطاعات التي نرافقها في ${n}:` })}</p><ul className="mt-3 flex flex-wrap gap-2">{c.sectors.map((s) => <li key={s} className="px-4 h-10 flex items-center d-shape bg-white ring-1 ring-encre/10 text-[15px] text-encre">{t(s)}</li>)}</ul></Reveal>
        </div>
      </div></section>

      <section className="dark py-28 md:py-36 lg:py-44"><div className="wrap">
        <Head kicker={t('Services')} title={tv({ fr: `Ce que nous faisons pour les entreprises de ${n}`, en: `What we do for businesses in ${n}`, ar: `ما نقدّمه للشركات في ${n}` })} />
        <div className="mt-12 grid md:grid-cols-3 gap-5">{CATALOG.map((g) => (
          <Reveal key={g.id} className="h-full"><article className="h-full rounded-3xl bg-nuit-2 ring-1 ring-white/10 p-7">
            <h3 className="text-[24px]">{t(g.title)}</h3><p className="mt-2 text-brume">{t(g.lead)}</p>
            <ul className="mt-5 space-y-2.5">{g.items.slice(0, 5).map((s) => <li key={s.t} className="flex gap-3 text-[15px]"><Check size={17} className="text-cyan shrink-0 mt-0.5" />{t(s.t)}</li>)}</ul>
            <Link to={L(`/services#${g.id}`)} className="mt-6 inline-flex items-center gap-2 text-safran font-medium">{tv({ fr: 'Voir le détail', en: 'See details', ar: 'عرض التفاصيل' })} <ArrowUpRight size={15} /></Link>
          </article></Reveal>
        ))}</div>
      </div></section>

      <section className="light py-28 md:py-36 lg:py-44"><div className="wrap grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4"><Head sm kicker={t('Questions fréquentes')} title={tv({ fr: `Vos questions sur la création de site web à ${n}`, en: `Your questions about websites in ${n}`, ar: `أسئلتك حول إنشاء موقع في ${n}` })} /></div>
        <div className="lg:col-span-8"><CityFaq items={faq} /></div>
      </div></section>

      <section className="light pb-28 md:pb-36"><div className="wrap">
        <p className="font-display text-[20px]">{tv({ fr: 'Nous accompagnons aussi les entreprises de', en: 'We also work with businesses in', ar: 'نرافق أيضًا الشركات في' })}</p>
        <ul className="mt-5 flex flex-wrap gap-2">{others.map((o) => <li key={o.slug}><Link to={L(`/creation-site-web/${o.slug}`)} className="px-4 h-10 flex items-center gap-2 d-shape ring-1 ring-encre/15 text-[15px] hover:bg-nuit hover:text-white transition-colors"><MapPin size={14} />{tv(o.name)}</Link></li>)}</ul>
      </div></section>
      <FinalCTA />
    </>
  );
};

/* FAQ locale : même composant visuel que la FAQ générale */
const CityFaq = ({ items }: { items: { q: string; a: string }[] }) => (
  <div className="divide-y divide-encre/10 border-y border-encre/10">{items.map((x) => (
    <details key={x.q} className="group py-6"><summary className="cursor-pointer list-none flex items-center justify-between gap-6 font-display text-[19px] font-medium">{x.q}<span className="text-[22px] transition-transform group-open:rotate-45">+</span></summary><p className="mt-4 text-ardoise max-w-[64ch]">{x.a}</p></details>
  ))}</div>
);

export const CitiesHub = () => (
  <>
    <Seo
      title={tv({ fr: 'Création de site web au Maroc : Casablanca, Rabat, Marrakech… | Digilago', en: 'Website design in Morocco: Casablanca, Rabat, Marrakesh… | Digilago', ar: 'تصميم مواقع الويب في المغرب: الدار البيضاء، الرباط، مراكش… | ديجيلاغو' })}
      description={tv({ fr: 'Agence web au Maroc : création de sites internet, SEO local et visibilité dans les IA à Casablanca, Rabat, Marrakech, Tanger, Fès, Agadir, El Jadida et dans tout le Royaume.', en: 'Web agency in Morocco: websites, local SEO and AI visibility in Casablanca, Rabat, Marrakesh, Tangier, Fez, Agadir, El Jadida and across the Kingdom.', ar: 'وكالة ويب في المغرب: تصميم المواقع، تحسين محلي لمحركات البحث وظهور في الذكاء الاصطناعي في الدار البيضاء والرباط ومراكش وطنجة وفاس وأكادير والجديدة وكل أرجاء المملكة.' })}
      crumbs={[[t('Accueil'), '/'], [tv({ fr: 'Création de site web au Maroc', en: 'Website design in Morocco', ar: 'تصميم المواقع في المغرب' }), '/creation-site-web']]}
    />
    <section className="dark pt-36 pb-24 lg:pt-44 lg:pb-32"><div className="wrap">
      <Reveal><p className="kicker">{tv({ fr: 'Partout au Maroc', en: 'Across Morocco', ar: 'في كل أنحاء المغرب' })}</p></Reveal>
      <ScrollText auto as="h1" text={tv({ fr: 'Création de site web au Maroc, ville par ville.', en: 'Website design in Morocco, city by city.', ar: 'تصميم مواقع الويب في المغرب، مدينةً بمدينة.' })} className="mt-5 text-[clamp(2.3rem,5vw,4.4rem)] leading-[1.02] max-w-[20ch]" />
      <Reveal delay={0.4}><p className="mt-7 text-[18.5px] text-white/80 max-w-[60ch]">{tv({ fr: 'Chaque ville a ses quartiers d’affaires, ses secteurs forts et ses concurrents. Choisissez la vôtre pour voir comment nous y rendons les entreprises visibles sur Google et dans les IA.', en: 'Every city has its own business districts, key sectors and competitors. Pick yours to see how we make businesses there visible on Google and in AI.', ar: 'لكل مدينة أحياؤها التجارية وقطاعاتها القوية ومنافسوها. اختر مدينتك لترى كيف نجعل شركاتها مرئية على Google وفي الذكاء الاصطناعي.' })}</p></Reveal>
    </div></section>
    <section className="light py-24 md:py-32"><div className="wrap grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{CITIES.map((c, i) => (
      <Reveal key={c.slug} delay={(i % 3) * 0.05}><Link to={L(`/creation-site-web/${c.slug}`)} className="group block h-full rounded-3xl bg-white ring-1 ring-encre/8 p-7 transition-shadow hover:shadow-[0_30px_60px_-30px_rgba(10,20,40,.3)]">
        <p className="flex items-center gap-2 text-[14px] text-[#0E8FA0]"><MapPin size={15} />{tv({ fr: 'Création de site web', en: 'Website design', ar: 'تصميم المواقع' })}</p>
        <h2 className="mt-2 text-[28px]">{tv(c.name)}</h2>
        <p className="mt-3 text-[15px] text-ardoise line-clamp-3">{tv(c.intro)}</p>
        <span className="mt-5 inline-flex items-center gap-2 font-medium text-encre group-hover:text-[#0E8FA0]">{tv({ fr: 'Découvrir', en: 'Explore', ar: 'اكتشف' })} <ArrowUpRight size={15} /></span>
      </Link></Reveal>
    ))}</div></section>
    <FinalCTA />
  </>
);

export { Faq };
