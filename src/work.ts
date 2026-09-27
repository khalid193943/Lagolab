/**
 * Réalisations réelles : sites clients et produits conçus par Digilago (captures réelles).
 * Textes en trois langues. Les résultats restent qualitatifs tant que les clients n'ont pas validé de chiffres.
 */
import agc from './assets/agc.jpg';
import angebleu from './assets/angebleu.jpg';
import marronniers from './assets/marronniers.jpg';
import wAdmin from './assets/work-admin.jpg';
import wDevis from './assets/work-devis.jpg';
import wWa from './assets/work-whatsapp.jpg';
import wSite from './assets/work-site.jpg';

type T3 = { fr: string; en: string; ar: string };
export type Featured = { id: string; name: string; kind: T3; img: string; tint: string; url?: string; desc: T3; tags: T3[] };
export type Study = { id: string; name: string; kind: T3; img: string; tint: string; idea: T3; did: T3; result: T3 };

export const FEATURED: Featured[] = [
  { id: 'agc', name: 'Académie Georges Claude', kind: { fr: 'École privée · El Jadida', en: 'Private school · El Jadida', ar: 'مدرسة خاصة · الجديدة' }, img: agc, tint: '#FFF1D6', url: 'https://agc.ma',
    desc: { fr: 'Le site d’une école de la maternelle au baccalauréat : bilingue, rassurant pour les parents, et entièrement administrable par l’équipe.', en: 'The website of a school from nursery to baccalaureate: bilingual, reassuring for parents, and fully managed by the school team.', ar: 'موقع مدرسة من التعليم الأولي إلى البكالوريا: ثنائي اللغة، يطمئن أولياء الأمور، ويديره فريق المدرسة بالكامل.' },
    tags: [{ fr: 'Site bilingue', en: 'Bilingual site', ar: 'موقع ثنائي اللغة' }, { fr: 'Espace d’administration', en: 'Admin area', ar: 'لوحة إدارة' }, { fr: 'Planning intégré', en: 'Built-in timetable', ar: 'جدول حصص مدمج' }] },
  { id: 'angebleu', name: 'Groupe Scolaire Ange Bleu', kind: { fr: 'École privée · El Jadida', en: 'Private school · El Jadida', ar: 'مدرسة خاصة · الجديدة' }, img: angebleu, tint: '#FFF6E5',
    desc: { fr: 'Une identité forte, « Donner des ailes », et des pré-inscriptions en ligne qui arrivent complètes.', en: 'A strong identity, “Giving wings”, and online pre-registrations that arrive complete.', ar: 'هوية قوية «نمنح الأجنحة»، وتسجيلات مسبقة عبر الإنترنت تصل مكتملة.' },
    tags: [{ fr: 'Identité visuelle', en: 'Visual identity', ar: 'هوية بصرية' }, { fr: 'Pré-inscriptions', en: 'Pre-registration', ar: 'التسجيل المسبق' }, { fr: 'Actualités', en: 'News', ar: 'الأخبار' }] },
  { id: 'marronniers', name: 'Les Marronniers', kind: { fr: 'Crèche · Maternelle · Primaire', en: 'Nursery · Kindergarten · Primary', ar: 'حضانة · تعليم أولي · ابتدائي' }, img: marronniers, tint: '#E3F4FF',
    desc: { fr: 'Deux campus réunis sur un seul site clair : les parents trouvent le bon établissement, les horaires et le chemin en quelques secondes.', en: 'Two campuses on one clear site: parents find the right campus, the hours and the way in seconds.', ar: 'حرمان دراسيان في موقع واحد واضح: يجد أولياء الأمور الفرع المناسب والأوقات والطريق في ثوانٍ.' },
    tags: [{ fr: 'Deux campus', en: 'Two campuses', ar: 'حرمان دراسيان' }, { fr: 'Itinéraire en un geste', en: 'One-tap directions', ar: 'الاتجاهات بنقرة' }, { fr: 'Administration', en: 'Admin', ar: 'الإدارة' }] },
  { id: 'admin', name: 'Digilago Admin', kind: { fr: 'Plateforme de gestion · Produit Digilago', en: 'Management platform · Digilago product', ar: 'منصة تسيير · منتج ديجيلاغو' }, img: wAdmin, tint: '#E9ECF5',
    desc: { fr: 'Notre plateforme de pilotage : demandes, clients, projets, factures, trésorerie et analytics sur un seul écran, avec des alertes intelligentes.', en: 'Our control centre: leads, clients, projects, invoices, cash flow and analytics on one screen, with smart alerts.', ar: 'منصة القيادة الخاصة بنا: الطلبات والعملاء والمشاريع والفواتير والخزينة والتحليلات في شاشة واحدة، مع تنبيهات ذكية.' },
    tags: [{ fr: 'CRM', en: 'CRM', ar: 'إدارة العملاء' }, { fr: 'Facturation', en: 'Invoicing', ar: 'الفوترة' }, { fr: 'Analytics', en: 'Analytics', ar: 'التحليلات' }] },
  { id: 'devis', name: 'Devis intelligent', kind: { fr: 'Outil commercial · Produit Digilago', en: 'Sales tool · Digilago product', ar: 'أداة تجارية · منتج ديجيلاغو' }, img: wDevis, tint: '#FFF1D6',
    desc: { fr: 'Pendant un appel, on tape le métier du client : l’outil propose ce qu’il lui faut, construit trois formules et génère le devis en PDF.', en: 'During a call, type the client’s trade: the tool suggests what they need, builds three packages and generates the PDF quote.', ar: 'أثناء المكالمة، نكتب نشاط العميل: تقترح الأداة ما يحتاجه، وتبني ثلاث باقات، وتُنشئ عرض السعر بصيغة PDF.' },
    tags: [{ fr: '12 familles de métiers', en: '12 trade families', ar: '12 عائلة مهنية' }, { fr: 'Trois formules', en: 'Three packages', ar: 'ثلاث باقات' }, { fr: 'Devis PDF', en: 'PDF quote', ar: 'عرض سعر PDF' }] },
  { id: 'whatsapp', name: 'WhatsApp Business, deux numéros', kind: { fr: 'Automatisation · Produit Digilago', en: 'Automation · Digilago product', ar: 'أتمتة · منتج ديجيلاغو' }, img: wWa, tint: '#E1F7EC',
    desc: { fr: 'Une seule boîte de réception pour deux numéros, des accusés de réception automatiques, des relances de factures et des envois groupés.', en: 'One inbox for two numbers, automatic acknowledgements, invoice reminders and broadcasts.', ar: 'صندوق وارد واحد لرقمين، وإشعارات استلام تلقائية، وتذكير بالفواتير، ورسائل جماعية.' },
    tags: [{ fr: 'API WhatsApp Cloud', en: 'WhatsApp Cloud API', ar: 'واجهة WhatsApp Cloud' }, { fr: 'Automatisations', en: 'Automations', ar: 'الأتمتة' }, { fr: 'Temps réel', en: 'Real time', ar: 'في الوقت الفعلي' }] },
  { id: 'site', name: 'digilago.ma', kind: { fr: 'Site trilingue · SEO et GEO', en: 'Trilingual site · SEO and GEO', ar: 'موقع بثلاث لغات · SEO وGEO' }, img: wSite, tint: '#E6FAFC', url: 'https://digilago.ma',
    desc: { fr: 'Notre propre site : trois langues dont l’arabe, 76 pages pré-rendues pour Google et les IA, et un chargement quasi instantané.', en: 'Our own website: three languages including Arabic, 76 pre-rendered pages for Google and AI, and near-instant loading.', ar: 'موقعنا الخاص: ثلاث لغات منها العربية، و76 صفحة مُعدّة مسبقًا لـGoogle والذكاء الاصطناعي، وتحميل شبه فوري.' },
    tags: [{ fr: 'FR · EN · AR', en: 'FR · EN · AR', ar: 'FR · EN · AR' }, { fr: 'Pages ville', en: 'City pages', ar: 'صفحات المدن' }, { fr: 'Données structurées', en: 'Structured data', ar: 'بيانات مُهيكلة' }] },
];

export const STUDIES: Study[] = [
  { id: 'agc', name: 'Académie Georges Claude', kind: FEATURED[0].kind, img: agc, tint: '#FFF4E0',
    idea: { fr: 'Présenter une école de la maternelle au baccalauréat, rassurer les parents qui comparent en ligne et simplifier les inscriptions de la rentrée.', en: 'Present a school from nursery to baccalaureate, reassure parents comparing online and simplify back-to-school enrolment.', ar: 'تقديم مدرسة من التعليم الأولي إلى البكالوريا، وطمأنة أولياء الأمور الذين يقارنون عبر الإنترنت، وتبسيط تسجيلات الدخول المدرسي.' },
    did: { fr: 'Un site bilingue français / anglais au ton institutionnel, un planning intégré, des actualités, et un espace d’administration complet pour que l’équipe publie elle-même.', en: 'A bilingual French / English site with an institutional tone, a built-in timetable, news, and a full admin area so the team can publish on its own.', ar: 'موقع ثنائي اللغة فرنسي / إنجليزي بطابع مؤسسي، وجدول حصص مدمج، وأخبار، ولوحة إدارة متكاملة لينشر الفريق بنفسه.' },
    result: { fr: 'Une vitrine claire pour les familles, des informations toujours à jour, et une école autonome sur son site, sans dépendre d’un prestataire pour chaque modification.', en: 'A clear showcase for families, always up-to-date information, and a school that runs its own site without relying on a provider for every change.', ar: 'واجهة واضحة للأسر، ومعلومات محدّثة دائمًا، ومدرسة تسيّر موقعها بنفسها دون الاعتماد على مزوّد لكل تعديل.' } },
  { id: 'admin', name: 'Digilago Admin', kind: FEATURED[3].kind, img: wAdmin, tint: '#EEF1F7',
    idea: { fr: 'Piloter toute l’activité depuis un seul écran : ne laisser passer aucune demande, aucune relance, aucune facture.', en: 'Run the whole business from one screen: no lead, follow-up or invoice slips through the cracks.', ar: 'قيادة النشاط كله من شاشة واحدة: لا طلب ولا تذكير ولا فاتورة يضيع.' },
    did: { fr: 'Une plateforme sur-mesure : CRM avec score de priorité, devis intelligent, facturation marocaine (TVA, montant en lettres), deux numéros WhatsApp, e-mails, automatisations et assistant IA.', en: 'A custom platform: CRM with priority scoring, smart quotes, Moroccan invoicing (VAT, amount in words), two WhatsApp numbers, email, automations and an AI assistant.', ar: 'منصة مخصّصة: إدارة العملاء مع تقييم للأولوية، وعروض أسعار ذكية، وفوترة مغربية (الضريبة، المبلغ بالحروف)، ورقما واتساب، وبريد إلكتروني، وأتمتة، ومساعد ذكي.' },
    result: { fr: 'Chaque nouvelle demande reçoit un accusé de réception automatique, les factures en retard sont relancées toutes seules, et les chiffres du mois sont visibles en un coup d’œil.', en: 'Every new lead gets an automatic acknowledgement, overdue invoices are chased automatically, and the month’s figures are visible at a glance.', ar: 'كل طلب جديد يتلقى إشعار استلام تلقائي، وتُذكَّر الفواتير المتأخرة تلقائيًا، وتظهر أرقام الشهر بنظرة واحدة.' } },
  { id: 'marronniers', name: 'Les Marronniers', kind: FEATURED[2].kind, img: marronniers, tint: '#E6F4FF',
    idea: { fr: 'Réunir deux campus, de la crèche au primaire, sur un site simple pour des parents pressés, souvent sur leur téléphone.', en: 'Bring two campuses, from nursery to primary, together on a simple site for busy parents, often on their phones.', ar: 'جمع حرمين دراسيين، من الحضانة إلى الابتدائي، في موقع بسيط لأولياء أمور مستعجلين، غالبًا عبر الهاتف.' },
    did: { fr: 'Une page par campus, les informations pratiques en avant, l’itinéraire en un geste et un espace d’administration pour les actualités.', en: 'One page per campus, practical information up front, one-tap directions and an admin area for news.', ar: 'صفحة لكل حرم، والمعلومات العملية في الواجهة، والاتجاهات بنقرة واحدة، ولوحة إدارة للأخبار.' },
    result: { fr: 'Les parents trouvent en quelques secondes le bon campus, les horaires et le chemin, et l’établissement gagne une image moderne et cohérente.', en: 'Parents find the right campus, hours and directions in seconds, and the school gains a modern, consistent image.', ar: 'يجد أولياء الأمور الفرع المناسب والأوقات والطريق في ثوانٍ، وتكتسب المؤسسة صورة حديثة ومتناسقة.' } },
];
