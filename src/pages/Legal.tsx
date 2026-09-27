/**
 * Pages légales : mentions légales et politique de confidentialité (loi marocaine n° 09-08).
 * Les informations de la société viennent de config.ts (LEGAL) : les crochets sont à compléter.
 * Textes à faire valider par un juriste avant publication.
 */
import { Link } from 'react-router-dom';
import { tv, L } from '../i18n';
import { CONTACT } from '../data';
import { LEGAL } from '../config';
import { Reveal } from '../ui';
import { ScrollText } from '../fx';
import { Seo } from '../seo';

type T3 = { fr: string; en: string; ar: string };
type Sec = { id: string; h: T3; p: (T3 | string)[] };

const Page = ({ kicker, title, intro, secs }: { kicker: T3; title: T3; intro: T3; secs: Sec[] }) => (
  <>
    <Seo title={`${tv(title)} | Digilago`} description={tv(intro).slice(0, 155)} />
    <section className="dark pt-36 pb-20 lg:pt-44 lg:pb-24"><div className="wrap max-w-5xl">
      <Reveal><p className="kicker">{tv(kicker)}</p></Reveal>
      <ScrollText auto as="h1" text={tv(title)} className="mt-5 text-[clamp(2.2rem,4.6vw,4rem)] leading-[1.05]" />
      <Reveal delay={0.4}><p className="mt-6 text-[18px] text-white/75 max-w-[60ch]">{tv(intro)}</p><p className="mt-4 text-[14px] text-brume">{tv({ fr: 'Dernière mise à jour : ', en: 'Last updated: ', ar: 'آخر تحديث: ' })}{tv(LEGAL.updated)}</p></Reveal>
    </div></section>
    <section className="light py-20 md:py-28"><div className="wrap max-w-5xl grid lg:grid-cols-12 gap-12">
      <nav className="lg:col-span-4 hidden lg:block" aria-label={tv({ fr: 'Sommaire', en: 'Contents', ar: 'المحتويات' })}><ol className="sticky top-28 space-y-2.5 text-[15px] text-ardoise">{secs.map((s, i) => <li key={s.id}><a href={`#${s.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-encre transition-colors"><span className="tabular-nums text-[#0E8FA0] me-2">{String(i + 1).padStart(2, '0')}</span>{tv(s.h)}</a></li>)}</ol></nav>
      <div className="lg:col-span-8 space-y-12">
        {secs.map((s, i) => (
          <article key={s.id} id={s.id} className="scroll-mt-28">
            <h2 className="text-[clamp(1.4rem,2.2vw,1.8rem)]"><span className="tabular-nums text-[#0E8FA0] me-3 text-[0.7em]">{String(i + 1).padStart(2, '0')}</span>{tv(s.h)}</h2>
            <div className="mt-4 space-y-3 text-[16.5px] leading-relaxed text-ardoise">{s.p.map((x, k) => <p key={k}>{typeof x === 'string' ? x : tv(x)}</p>)}</div>
          </article>
        ))}
        <p className="pt-6 border-t border-encre/10 text-[14px] text-ardoise">{tv({ fr: 'Une question sur cette page ? Écrivez-nous à ', en: 'A question about this page? Write to us at ', ar: 'لديك سؤال حول هذه الصفحة؟ راسلنا على ' })}<a href={`mailto:${CONTACT.email}`} className="text-encre underline underline-offset-4" dir="ltr">{CONTACT.email}</a>.</p>
      </div>
    </div></section>
  </>
);

export const Mentions = () => (
  <Page
    kicker={{ fr: 'Informations légales', en: 'Legal information', ar: 'معلومات قانونية' }}
    title={{ fr: 'Mentions légales', en: 'Legal notice', ar: 'الإشعار القانوني' }}
    intro={{ fr: 'Les informations ci-dessous identifient l’éditeur et l’hébergeur du site digilago.ma, et précisent les conditions d’utilisation de son contenu.', en: 'The information below identifies the publisher and host of digilago.ma and sets out the terms for using its content.', ar: 'تحدد المعلومات التالية ناشر موقع digilago.ma والجهة المستضيفة له، وتوضّح شروط استخدام محتواه.' }}
    secs={[
      { id: 'editeur', h: { fr: 'Éditeur du site', en: 'Publisher', ar: 'ناشر الموقع' }, p: [
        `Digilago, ${LEGAL.form}, ${LEGAL.capital}.`,
        { fr: `Siège social : ${LEGAL.address}.`, en: `Registered office: ${LEGAL.address}.`, ar: `المقر الاجتماعي: ${LEGAL.address}.` },
        `RC : ${LEGAL.rc} · ICE : ${LEGAL.ice} · IF : ${LEGAL.if}`,
        { fr: `Téléphone : ${CONTACT.phone} · E-mail : ${CONTACT.email}`, en: `Phone: ${CONTACT.phone} · Email: ${CONTACT.email}`, ar: `الهاتف: \u2066${CONTACT.phone}\u2069 · البريد الإلكتروني: \u2066${CONTACT.email}\u2069` },
      ] },
      { id: 'publication', h: { fr: 'Directeur de la publication', en: 'Publication director', ar: 'مدير النشر' }, p: [LEGAL.director] },
      { id: 'hebergement', h: { fr: 'Hébergement', en: 'Hosting', ar: 'الاستضافة' }, p: [{ fr: `Le site est hébergé par ${LEGAL.host}.`, en: `The website is hosted by ${LEGAL.host}.`, ar: `يستضيف الموقع: ${LEGAL.host}.` }] },
      { id: 'propriete', h: { fr: 'Propriété intellectuelle', en: 'Intellectual property', ar: 'الملكية الفكرية' }, p: [
        { fr: 'L’ensemble du site (textes, logo, charte graphique, illustrations, code) est la propriété de Digilago. Toute reproduction, totale ou partielle, sans autorisation écrite préalable est interdite.', en: 'The entire website (text, logo, visual identity, illustrations, code) is the property of Digilago. Any full or partial reproduction without prior written permission is prohibited.', ar: 'جميع مكوّنات الموقع (النصوص، الشعار، الهوية البصرية، الرسومات، الشيفرة البرمجية) ملك لديجيلاغو. يُمنع أي نسخ كلي أو جزئي دون إذن كتابي مسبق.' },
        { fr: 'Les logos et captures des sites de nos clients sont reproduits avec leur accord et restent la propriété de leurs titulaires. Les « concepts » de la bibliothèque sont des illustrations de démonstration et ne représentent pas des entreprises réelles.', en: 'Our clients’ logos and website screenshots are shown with their permission and remain the property of their owners. The “concepts” in the library are demonstration illustrations and do not represent real businesses.', ar: 'تُعرض شعارات عملائنا ولقطات مواقعهم بموافقتهم، وتظل ملكًا لأصحابها. أما «النماذج» المعروضة في المكتبة فهي رسومات توضيحية ولا تمثل شركات حقيقية.' },
      ] },
      { id: 'responsabilite', h: { fr: 'Responsabilité', en: 'Liability', ar: 'المسؤولية' }, p: [
        { fr: 'Digilago s’efforce de fournir des informations exactes et à jour, sans pouvoir garantir l’absence d’erreur. Les démonstrations (simulateur de visibilité, carte) illustrent des résultats visés et ne constituent pas un engagement de positionnement. Les liens vers des sites externes n’engagent pas la responsabilité de Digilago.', en: 'Digilago strives to provide accurate, up-to-date information but cannot guarantee it is error-free. Demonstrations (visibility simulator, map) illustrate target results and are not a ranking guarantee. Digilago is not responsible for external websites linked from this site.', ar: 'تحرص ديجيلاغو على تقديم معلومات دقيقة ومحدّثة، دون أن تضمن خلوّها التام من الأخطاء. العروض التوضيحية (محاكي الظهور، الخريطة) تمثّل نتائج مستهدفة ولا تُعدّ التزامًا بترتيب معيّن. ولا تتحمّل ديجيلاغو مسؤولية المواقع الخارجية المرتبطة.' },
      ] },
      { id: 'donnees', h: { fr: 'Données personnelles', en: 'Personal data', ar: 'المعطيات الشخصية' }, p: [{ fr: 'Le traitement de vos données est décrit dans notre politique de confidentialité.', en: 'How we handle your data is described in our privacy policy.', ar: 'تُفصّل سياسة الخصوصية طريقة معالجة معطياتك الشخصية.' }] },
      { id: 'droit', h: { fr: 'Droit applicable', en: 'Governing law', ar: 'القانون المطبّق' }, p: [{ fr: 'Le présent site est soumis au droit marocain. En cas de litige, les tribunaux compétents d’El Jadida seront seuls compétents.', en: 'This website is governed by Moroccan law. Any dispute falls under the exclusive jurisdiction of the competent courts of El Jadida.', ar: 'يخضع هذا الموقع للقانون المغربي، وتختص محاكم الجديدة وحدها بالنظر في أي نزاع.' }] },
    ]}
  />
);

export const Privacy = () => (
  <Page
    kicker={{ fr: 'Vos données', en: 'Your data', ar: 'معطياتك' }}
    title={{ fr: 'Politique de confidentialité', en: 'Privacy policy', ar: 'سياسة الخصوصية' }}
    intro={{ fr: 'Digilago protège vos données personnelles conformément à la loi n° 09-08 relative à la protection des personnes physiques à l’égard du traitement des données à caractère personnel. Voici, simplement, ce que nous collectons et pourquoi.', en: 'Digilago protects your personal data in accordance with Moroccan Law No. 09-08 on the protection of individuals with regard to the processing of personal data. Here, in plain terms, is what we collect and why.', ar: 'تحمي ديجيلاغو معطياتك الشخصية وفقًا للقانون رقم 09-08 المتعلق بحماية الأشخاص الذاتيين تجاه معالجة المعطيات ذات الطابع الشخصي. إليك بوضوح ما نجمعه ولماذا.' }}
    secs={[
      { id: 'responsable', h: { fr: 'Responsable du traitement', en: 'Data controller', ar: 'المسؤول عن المعالجة' }, p: [`Digilago, ${LEGAL.address}. ${CONTACT.email}`] },
      { id: 'collecte', h: { fr: 'Données collectées', en: 'Data we collect', ar: 'المعطيات التي نجمعها' }, p: [
        { fr: 'Uniquement ce que vous nous transmettez : via les formulaires (nom, entreprise, ville, secteur, téléphone, e-mail, message) et via WhatsApp ou le téléphone si vous choisissez ces canaux.', en: 'Only what you send us: through the forms (name, business, city, sector, phone, email, message) and through WhatsApp or phone if you choose those channels.', ar: 'نجمع فقط ما ترسله إلينا: عبر الاستمارات (الاسم، الشركة، المدينة، القطاع، الهاتف، البريد الإلكتروني، الرسالة)، وعبر واتساب أو الهاتف إذا اخترت هذه القنوات.' },
        { fr: 'Le site ne dépose aucun cookie publicitaire et n’utilise, à ce jour, aucun outil de mesure d’audience.', en: 'The website sets no advertising cookies and, at this time, uses no audience measurement tools.', ar: 'لا يستخدم الموقع أي ملفات تعريف ارتباط إعلانية، ولا يعتمد حاليًا أي أداة لقياس الزيارات.' },
      ] },
      { id: 'finalites', h: { fr: 'Pourquoi nous les utilisons', en: 'Why we use it', ar: 'أغراض الاستخدام' }, p: [{ fr: 'Pour répondre à votre demande, préparer votre première version et votre devis, puis suivre notre relation si vous devenez client. Vos données ne sont jamais vendues ni utilisées pour de la prospection sans votre accord.', en: 'To reply to your request, prepare your first version and your quote, and follow up on our relationship if you become a client. Your data is never sold or used for marketing without your consent.', ar: 'للرد على طلبك، وإعداد النسخة الأولى وعرض السعر، ثم متابعة العلاقة معك إن أصبحت عميلًا. لا نبيع معطياتك أبدًا، ولا نستخدمها لأغراض تسويقية دون موافقتك.' }] },
      { id: 'base', h: { fr: 'Base légale', en: 'Legal basis', ar: 'الأساس القانوني' }, p: [{ fr: 'Votre consentement, exprimé en cochant la case du formulaire, et les échanges précontractuels que vous engagez avec nous.', en: 'Your consent, given by ticking the box on the form, and the pre-contractual exchanges you start with us.', ar: 'موافقتك التي تعبّر عنها بتحديد الخانة في الاستمارة، والمراسلات السابقة للتعاقد التي تبادر بها معنا.' }] },
      { id: 'destinataires', h: { fr: 'Qui y a accès', en: 'Who has access', ar: 'من يطّلع عليها' }, p: [{ fr: 'L’équipe Digilago uniquement, ainsi que nos prestataires techniques strictement nécessaires : le service d’envoi du formulaire, l’hébergeur du site et WhatsApp (Meta) si vous utilisez ce canal. Certains sont situés hors du Maroc ; ces transferts sont encadrés conformément à la loi 09-08.', en: 'Only the Digilago team and strictly necessary technical providers: the form delivery service, the website host, and WhatsApp (Meta) if you use that channel. Some are located outside Morocco; these transfers are handled in accordance with Law 09-08.', ar: 'فريق ديجيلاغو فقط، إلى جانب مزوّدي الخدمات التقنية الضروريين: خدمة إرسال الاستمارات، والجهة المستضيفة للموقع، وواتساب (Meta) إذا استخدمت هذه القناة. يقع بعضهم خارج المغرب، ويتم هذا النقل وفق مقتضيات القانون 09-08.' }] },
      { id: 'duree', h: { fr: 'Durée de conservation', en: 'How long we keep it', ar: 'مدة الاحتفاظ' }, p: [{ fr: 'Les demandes sans suite sont conservées trois ans au maximum après le dernier contact. Les données clients sont conservées pendant la relation commerciale, puis le temps imposé par nos obligations légales.', en: 'Requests that do not lead to a project are kept for up to three years after the last contact. Client data is kept for the duration of the relationship, then as long as legally required.', ar: 'نحتفظ بالطلبات التي لم تتحول إلى مشروع لمدة أقصاها ثلاث سنوات بعد آخر تواصل، وببيانات العملاء طوال مدة العلاقة التجارية، ثم للمدة التي تفرضها التزاماتنا القانونية.' }] },
      { id: 'stockage', h: { fr: 'Cookies et stockage', en: 'Cookies and storage', ar: 'ملفات الارتباط والتخزين' }, p: [{ fr: 'Le site utilise seulement le stockage de session de votre navigateur pour se souvenir que l’animation d’ouverture et la bulle du chat ont déjà été affichées. Ces informations restent sur votre appareil et s’effacent à la fermeture de l’onglet. Si un outil de statistiques est ajouté, cette page sera mise à jour avant.', en: 'The website only uses your browser’s session storage to remember that the opening animation and chat bubble have already been shown. This stays on your device and is cleared when you close the tab. If an analytics tool is added, this page will be updated first.', ar: 'يستخدم الموقع فقط التخزين المؤقت لجلسة المتصفح ليتذكّر أن الحركة الافتتاحية وفقاعة المحادثة قد ظهرتا من قبل. تبقى هذه المعلومات على جهازك وتُحذف عند إغلاق التبويب. وفي حال إضافة أداة إحصائيات، سنحدّث هذه الصفحة مسبقًا.' }] },
      { id: 'droits', h: { fr: 'Vos droits', en: 'Your rights', ar: 'حقوقك' }, p: [
        { fr: `Vous disposez d’un droit d’accès, de rectification et d’opposition sur vos données (loi 09-08, articles 7 à 9). Pour l’exercer, écrivez-nous à ${CONTACT.email} : nous répondons dans les meilleurs délais.`, en: `You have the right to access, correct and object to the processing of your data (Law 09-08, articles 7 to 9). To exercise it, write to ${CONTACT.email}; we will reply as quickly as possible.`, ar: `يحق لك الولوج إلى معطياتك وتصحيحها والتعرض على معالجتها (القانون 09-08، المواد 7 إلى 9). لممارسة هذا الحق، راسلنا على \u2066${CONTACT.email}\u2069 وسنرد عليك في أقرب الآجال.` },
        { fr: 'Vous pouvez aussi adresser une réclamation à la Commission nationale de contrôle de la protection des données à caractère personnel (CNDP), www.cndp.ma.', en: 'You may also file a complaint with Morocco’s National Commission for the Protection of Personal Data (CNDP), www.cndp.ma.', ar: 'يمكنك أيضًا تقديم شكاية إلى اللجنة الوطنية لمراقبة حماية المعطيات ذات الطابع الشخصي (CNDP) عبر www.cndp.ma.' },
      ] },
      { id: 'securite', h: { fr: 'Sécurité', en: 'Security', ar: 'الأمان' }, p: [{ fr: 'Le site est servi en HTTPS et l’accès aux demandes est réservé à l’équipe Digilago.', en: 'The website is served over HTTPS and access to requests is limited to the Digilago team.', ar: 'يعمل الموقع عبر بروتوكول HTTPS الآمن، ويقتصر الاطلاع على الطلبات على فريق ديجيلاغو.' }] },
      { id: 'cndp', h: { fr: 'Déclaration CNDP', en: 'CNDP declaration', ar: 'التصريح لدى اللجنة الوطنية' }, p: [{ fr: `Traitement déclaré auprès de la CNDP, récépissé n° ${LEGAL.cndp}.`, en: `Processing declared to the CNDP, receipt No. ${LEGAL.cndp}.`, ar: `تم التصريح بهذه المعالجة لدى اللجنة الوطنية، وصل رقم ${LEGAL.cndp}.` }] },
    ]}
  />
);

export const LegalLinks = ({ className = '' }: { className?: string }) => (
  <span className={`flex flex-wrap gap-x-5 gap-y-2 ${className}`}>
    <Link to={L('/mentions-legales')} className="hover:text-white transition-colors">{tv({ fr: 'Mentions légales', en: 'Legal notice', ar: 'الإشعار القانوني' })}</Link>
    <Link to={L('/confidentialite')} className="hover:text-white transition-colors">{tv({ fr: 'Confidentialité', en: 'Privacy', ar: 'الخصوصية' })}</Link>
  </span>
);
