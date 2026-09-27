/**
 * Moteur du « Devis intelligent ».
 * 1. Reconnaît le métier du client (synonymes, fautes courantes, darija/français/anglais).
 * 2. Propose ce qu'il lui faut : indispensable, recommandé, en option, mensuel — avec l'argument à dire au client.
 * 3. S'adapte aux réponses du client, à la ville, au budget et aux mots-clés des notes d'appel.
 * 4. Construit trois formules (Essentiel, Recommandé, Premium), le délai, l'échéancier et le devis.
 * Les tarifs sont des valeurs de départ, modifiables dans l'onglet « Tarifs ».
 */
export type CatItem = { id: string; name: string; desc: string; price: number; unit: string; monthly?: boolean; days?: number; base?: boolean };

export const DEFAULT_CATALOG: CatItem[] = [
  { id: 'base_vitrine', name: 'Site vitrine sur-mesure (jusqu’à 5 pages)', desc: 'Design unique, mobile d’abord, rapide, formulaire et bouton WhatsApp.', price: 9000, unit: 'forfait', days: 10, base: true },
  { id: 'base_resa', name: 'Site + réservation / prise de rendez-vous', desc: 'Site sur-mesure avec agenda en ligne et confirmations.', price: 16000, unit: 'forfait', days: 15, base: true },
  { id: 'base_ecom', name: 'Boutique en ligne', desc: 'Catalogue, panier, commandes, gestion du stock.', price: 22000, unit: 'forfait', days: 20, base: true },
  { id: 'base_app', name: 'Application web sur-mesure', desc: 'Plateforme métier : comptes, tableaux de bord, flux spécifiques.', price: 40000, unit: 'forfait', days: 35, base: true },
  { id: 'page_sup', name: 'Pages supplémentaires (lot de 3)', desc: 'Pour chaque service, spécialité ou établissement.', price: 2200, unit: 'lot', days: 2 },
  { id: 'lang_ar', name: 'Version arabe', desc: 'Rédaction et mise en page de droite à gauche.', price: 2500, unit: 'langue', days: 3 },
  { id: 'lang_en', name: 'Version anglaise', desc: 'Pour la clientèle touristique et internationale.', price: 2500, unit: 'langue', days: 3 },
  { id: 'booking', name: 'Module de réservation / agenda', desc: 'Créneaux en temps réel, confirmation automatique.', price: 5000, unit: 'forfait', days: 4 },
  { id: 'wa_reminders', name: 'Rappels automatiques WhatsApp', desc: 'Confirmation et rappel la veille : moins de rendez-vous manqués.', price: 3500, unit: 'forfait', days: 3 },
  { id: 'payment_cmi', name: 'Paiement en ligne (CMI)', desc: 'Carte bancaire marocaine et internationale.', price: 4000, unit: 'forfait', days: 4 },
  { id: 'cod', name: 'Commande, livraison et paiement à la livraison', desc: 'Suivi des commandes, zones et frais de livraison.', price: 2500, unit: 'forfait', days: 3 },
  { id: 'catalog_products', name: 'Mise en ligne du catalogue (jusqu’à 50 produits)', desc: 'Fiches produits, variantes, photos optimisées.', price: 3000, unit: 'forfait', days: 3 },
  { id: 'whatsapp_int', name: 'Bouton et notifications WhatsApp', desc: 'Chaque demande arrive directement sur WhatsApp.', price: 1200, unit: 'forfait', days: 1 },
  { id: 'menu_digital', name: 'Menu digital + QR code', desc: 'Menu à jour en un clic, QR code pour les tables.', price: 1200, unit: 'forfait', days: 1 },
  { id: 'listings', name: 'Annonces filtrables', desc: 'Biens ou produits filtrables par prix, quartier, surface.', price: 6000, unit: 'forfait', days: 5 },
  { id: 'quote_form', name: 'Formulaire intelligent (devis, pré-inscription, visite)', desc: 'Les demandes arrivent qualifiées, par WhatsApp et e-mail.', price: 1800, unit: 'forfait', days: 2 },
  { id: 'client_area', name: 'Espace client / membres / parents', desc: 'Comptes, documents, abonnements, messages.', price: 8000, unit: 'forfait', days: 8 },
  { id: 'admin_cms', name: 'Espace d’administration', desc: 'Le client modifie lui-même textes, actualités, horaires.', price: 3500, unit: 'forfait', days: 3 },
  { id: 'multi_sites', name: 'Plusieurs établissements / campus', desc: 'Une page et une fiche par adresse.', price: 3000, unit: 'forfait', days: 3 },
  { id: 'gallery', name: 'Galerie / portfolio (avant-après)', desc: 'Réalisations mises en valeur, rassure avant l’appel.', price: 1500, unit: 'forfait', days: 1 },
  { id: 'blog', name: 'Blog / actualités', desc: 'Articles qui démontrent l’expertise et nourrissent Google.', price: 2000, unit: 'forfait', days: 2 },
  { id: 'gbp', name: 'Fiche Google Business (création et optimisation)', desc: 'Apparaître sur Google Maps avec photos, horaires, avis.', price: 1500, unit: 'forfait', days: 2 },
  { id: 'seo_local', name: 'Référencement SEO local', desc: 'Pages par service et par ville, balisage, vitesse.', price: 4500, unit: 'forfait', days: 4 },
  { id: 'geo', name: 'Visibilité dans les IA (GEO)', desc: 'Données structurées, llms.txt : recommandé par ChatGPT et Gemini.', price: 2500, unit: 'forfait', days: 2 },
  { id: 'reviews', name: 'Collecte automatique d’avis Google', desc: 'Un message après chaque visite : plus d’avis cinq étoiles.', price: 1500, unit: 'forfait', days: 1 },
  { id: 'copywriting', name: 'Rédaction des textes', desc: 'Des textes qui vendent, écrits pour le métier du client.', price: 2000, unit: 'langue', days: 3 },
  { id: 'photos', name: 'Shooting photo professionnel (demi-journée)', desc: 'Des vraies photos : la première chose qui fait choisir.', price: 3000, unit: 'forfait', days: 2 },
  { id: 'logo', name: 'Logo et identité visuelle', desc: 'Logo, couleurs, typographies et déclinaisons.', price: 4500, unit: 'forfait', days: 5 },
  { id: 'ads_setup', name: 'Lancement publicité Google / Meta', desc: 'Ciblage par quartier, annonces, suivi des appels.', price: 2500, unit: 'forfait', days: 2 },
  { id: 'mobile_app', name: 'Application mobile iOS et Android', desc: 'Fidélité, notifications, commande en un geste.', price: 45000, unit: 'forfait', days: 40 },
  { id: 'training', name: 'Formation et prise en main (1 h)', desc: 'Le client devient autonome sur son site.', price: 0, unit: 'inclus', days: 0 },
  { id: 'hosting', name: 'Hébergement, domaine, SSL et maintenance', desc: 'Site rapide, sécurisé, sauvegardé, mis à jour.', price: 350, unit: 'mois', monthly: true },
  { id: 'seo_monthly', name: 'Suivi SEO et rapport mensuel', desc: 'Nouvelles pages, positions suivies, conseils chaque mois.', price: 1500, unit: 'mois', monthly: true },
  { id: 'gbp_monthly', name: 'Animation de la fiche Google', desc: 'Publications, photos, réponses aux avis.', price: 800, unit: 'mois', monthly: true },
  { id: 'ads_mgmt', name: 'Gestion des campagnes publicitaires', desc: 'Hors budget publicitaire versé à Google / Meta.', price: 1500, unit: 'mois', monthly: true },
  { id: 'support_plus', name: 'Support prioritaire et évolutions', desc: 'Modifications illimitées raisonnables, réponse en 2 h.', price: 900, unit: 'mois', monthly: true },
];

type Q = { id: string; q: string; add: string[]; remove?: string[] };
export type Profile = { id: string; label: string; emoji: string; words: string[]; base: string; must: string[]; rec: string[]; opt: string[]; monthly: string[]; questions: Q[]; pitch: string[]; why?: Record<string, string> };

export const PROFILES: Profile[] = [
  { id: 'resto', label: 'Restaurant, café, pâtisserie', emoji: '🍽️', words: ['restaurant', 'resto', 'café', 'cafe', 'snack', 'pizzeria', 'pizza', 'traiteur', 'patisserie', 'pâtisserie', 'boulangerie', 'fast food', 'fastfood', 'brasserie', 'salon de thé', 'glacier', 'sushi', 'burger', 'mطعم', 'مطعم', 'مقهى', 'قهوة', 'food', 'cuisine'],
    base: 'base_vitrine', must: ['menu_digital', 'gbp', 'reviews'], rec: ['booking', 'photos', 'seo_local', 'geo'], opt: ['cod', 'catalog_products', 'lang_ar', 'ads_setup', 'logo'], monthly: ['hosting', 'gbp_monthly'],
    questions: [{ id: 'q1', q: 'Faites-vous la livraison ou la vente à emporter ?', add: ['cod', 'catalog_products'] }, { id: 'q2', q: 'Prenez-vous des réservations de tables ?', add: ['booking'] }, { id: 'q3', q: 'Clientèle touristique ou étrangère ?', add: ['lang_en'] }, { id: 'q4', q: 'Avez-vous déjà de belles photos de vos plats ?', add: [], remove: ['photos'] }],
    pitch: ['« Quand quelqu’un cherche “restaurant” près de lui, Google affiche d’abord les fiches avec photos et avis : c’est là que se joue le choix. »', '« Avec la réservation en ligne, vous remplissez les tables même quand le téléphone ne répond pas pendant le service. »', '« Pas de commission comme sur les plateformes : les réservations et commandes sont à vous. »'],
    why: { menu_digital: 'Le menu est la page la plus consultée d’un restaurant.', booking: 'Des réservations 24 h/24, sans décrocher pendant le service.', reviews: 'Les avis font choisir entre deux restaurants voisins.' } },
  { id: 'sante', label: 'Clinique, médecin, dentiste, laboratoire', emoji: '🩺', words: ['clinique', 'médecin', 'medecin', 'docteur', 'dr ', 'dentiste', 'dentaire', 'kiné', 'kine', 'kinésithérapeute', 'laboratoire', 'labo', 'analyses', 'vétérinaire', 'veterinaire', 'ophtalmo', 'pédiatre', 'gynéco', 'cabinet médical', 'radiologie', 'psychologue', 'nutritionniste', 'orthophoniste', 'pharmacie', 'طبيب', 'مصحة', 'عيادة', 'صيدلية'],
    base: 'base_resa', must: ['booking', 'wa_reminders', 'gbp', 'seo_local'], rec: ['lang_ar', 'page_sup', 'geo', 'admin_cms'], opt: ['client_area', 'multi_sites', 'blog', 'photos'], monthly: ['hosting', 'seo_monthly'],
    questions: [{ id: 'q1', q: 'Plusieurs praticiens ou spécialités ?', add: ['page_sup'] }, { id: 'q2', q: 'Plusieurs adresses ?', add: ['multi_sites'] }, { id: 'q3', q: 'Les patients doivent-ils consulter des résultats ou documents ?', add: ['client_area'] }, { id: 'q4', q: 'Patients étrangers ou touristes ?', add: ['lang_en'] }],
    pitch: ['« Vos patients cherchent “dentiste + ville” sur Google : le premier cabinet avec des horaires clairs et la prise de rendez-vous gagne l’appel. »', '« Les rappels WhatsApp réduisent fortement les rendez-vous oubliés. »', '« Tout reste conforme à la déontologie : information claire, pas de publicité promotionnelle. »'],
    why: { wa_reminders: 'Moins de rendez-vous manqués, un agenda plein.', booking: 'Le secrétariat respire, les patients réservent le soir.' } },
  { id: 'ecole', label: 'École, crèche, centre de formation', emoji: '🎓', words: ['école', 'ecole', 'crèche', 'creche', 'maternelle', 'primaire', 'collège', 'lycée', 'groupe scolaire', 'académie', 'academie', 'formation', 'centre de formation', 'institut', 'cours de soutien', 'langues', 'مدرسة', 'روض', 'حضانة', 'تكوين'],
    base: 'base_vitrine', must: ['admin_cms', 'quote_form', 'lang_ar', 'gbp'], rec: ['gallery', 'page_sup', 'seo_local', 'photos'], opt: ['client_area', 'multi_sites', 'blog', 'lang_en', 'mobile_app'], monthly: ['hosting'],
    questions: [{ id: 'q1', q: 'Plusieurs campus ou cycles ?', add: ['multi_sites', 'page_sup'] }, { id: 'q2', q: 'Voulez-vous un espace parents (notes, absences, messages) ?', add: ['client_area'] }, { id: 'q3', q: 'Section internationale ou bilingue ?', add: ['lang_en'] }],
    pitch: ['« Les parents comparent les écoles en ligne avant de visiter : un site rassurant remplit les pré-inscriptions de la rentrée. »', '« Votre équipe publie actualités et planning elle-même, en quelques clics. »', '« Nous l’avons déjà fait pour trois écoles d’El Jadida. »'],
    why: { quote_form: 'Pré-inscriptions en ligne, dossiers complets dès le départ.', admin_cms: 'L’école publie ses actualités sans dépendre de personne.' } },
  { id: 'sport', label: 'Padel, foot, salle de sport, club', emoji: '🎾', words: ['padel', 'foot', 'football', 'terrain', 'salle de sport', 'gym', 'fitness', 'crossfit', 'yoga', 'pilates', 'club', 'tennis', 'piscine', 'arts martiaux', 'boxe', 'danse', 'complexe sportif', 'ملعب', 'نادي', 'رياضة'],
    base: 'base_resa', must: ['booking', 'payment_cmi', 'wa_reminders', 'gbp'], rec: ['client_area', 'photos', 'reviews', 'seo_local'], opt: ['mobile_app', 'lang_en', 'ads_setup', 'logo'], monthly: ['hosting', 'gbp_monthly'],
    questions: [{ id: 'q1', q: 'Vendez-vous des abonnements ?', add: ['client_area'] }, { id: 'q2', q: 'Paiement à la réservation souhaité ?', add: ['payment_cmi'], remove: [] }, { id: 'q3', q: 'Envie d’une application pour les membres ?', add: ['mobile_app'] }],
    pitch: ['« Vos terrains se réservent tout seuls, même à minuit, sans échanges WhatsApp interminables. »', '« Le paiement à la réservation supprime les no-shows. »'],
    why: { payment_cmi: 'Le créneau est payé : fini les réservations fantômes.' } },
  { id: 'hotel', label: 'Hôtel, riad, maison d’hôtes, lodge', emoji: '🏨', words: ['hôtel', 'hotel', 'riad', 'maison d’hôtes', "maison d'hotes", 'maison dhotes', 'lodge', 'auberge', 'camping', 'gîte', 'gite', 'appartements', 'location saisonnière', 'airbnb', 'bivouac', 'فندق', 'رياض', 'دار الضيافة'],
    base: 'base_resa', must: ['booking', 'lang_en', 'photos', 'gbp'], rec: ['payment_cmi', 'reviews', 'lang_ar', 'seo_local', 'geo'], opt: ['ads_setup', 'copywriting', 'page_sup'], monthly: ['hosting', 'gbp_monthly'],
    questions: [{ id: 'q1', q: 'Êtes-vous sur Booking ou Airbnb aujourd’hui ?', add: ['payment_cmi', 'ads_setup'] }, { id: 'q2', q: 'Proposez-vous des excursions ou activités ?', add: ['page_sup'] }, { id: 'q3', q: 'Clientèle espagnole, allemande… (autre langue) ?', add: ['copywriting'] }],
    pitch: ['« Chaque réservation directe, c’est 15 à 20 % de commission en moins versée aux plateformes. »', '« Les voyageurs réservent là où les photos font rêver : c’est le premier investissement rentable. »'],
    why: { booking: 'Réservations directes, sans commission.', lang_en: 'La majorité des voyageurs cherchent en anglais.' } },
  { id: 'ecom', label: 'Boutique, e-commerce, artisan, cosmétique', emoji: '🛍️', words: ['boutique', 'e-commerce', 'ecommerce', 'vente en ligne', 'magasin', 'shop', 'caftan', 'djellaba', 'mode', 'vêtements', 'bijoux', 'cosmétique', 'cosmetique', 'argan', 'artisan', 'artisanat', 'poterie', 'tapis', 'déco', 'meubles', 'parfum', 'produits', 'epicerie', 'épicerie', 'متجر', 'تجارة', 'قفطان'],
    base: 'base_ecom', must: ['catalog_products', 'cod', 'photos', 'whatsapp_int'], rec: ['payment_cmi', 'seo_local', 'gbp', 'reviews'], opt: ['lang_en', 'ads_setup', 'logo', 'mobile_app', 'copywriting'], monthly: ['hosting', 'ads_mgmt'],
    questions: [{ id: 'q1', q: 'Vendez-vous à l’international ?', add: ['payment_cmi', 'lang_en'] }, { id: 'q2', q: 'Plus de 50 produits ?', add: ['page_sup'] }, { id: 'q3', q: 'Avez-vous une boutique physique ?', add: ['gbp'] }, { id: 'q4', q: 'Avez-vous déjà un logo pro ?', add: [], remove: ['logo'] }],
    pitch: ['« Au Maroc, le paiement à la livraison reste le moyen préféré : on l’intègre dès le départ. »', '« Votre boutique vend pendant que vous dormez, et vos clients Instagram passent commande en deux clics. »'],
    why: { cod: 'Le moyen de paiement préféré au Maroc.', photos: 'En e-commerce, la photo fait la vente.' } },
  { id: 'immo', label: 'Agence immobilière, promoteur', emoji: '🏠', words: ['immobilier', 'agence immobilière', 'agence immobiliere', 'promoteur', 'promotion immobilière', 'résidence', 'appartements à vendre', 'lotissement', 'syndic', 'location', 'عقار', 'منعش'],
    base: 'base_vitrine', must: ['listings', 'quote_form', 'gbp', 'seo_local'], rec: ['lang_en', 'photos', 'whatsapp_int', 'admin_cms'], opt: ['ads_setup', 'client_area', 'geo'], monthly: ['hosting', 'seo_monthly', 'ads_mgmt'],
    questions: [{ id: 'q1', q: 'Clients MRE ou étrangers ?', add: ['lang_en'] }, { id: 'q2', q: 'Un programme neuf à lancer ?', add: ['ads_setup', 'page_sup'] }, { id: 'q3', q: 'Combien de biens en même temps ?', add: ['admin_cms'] }],
    pitch: ['« Des annonces filtrables et une demande de visite en un clic : les prospects arrivent qualifiés. »', '« Les MRE cherchent depuis l’étranger : une version anglaise et WhatsApp font la différence. »'] },
  { id: 'pro', label: 'Avocat, notaire, comptable, architecte, conseil', emoji: '⚖️', words: ['avocat', 'cabinet', 'notaire', 'comptable', 'expert-comptable', 'fiduciaire', 'architecte', 'bureau d’études', 'conseil', 'consultant', 'assurance', 'courtier', 'traducteur', 'huissier', 'محامي', 'موثق', 'محاسب', 'مهندس'],
    base: 'base_vitrine', must: ['gbp', 'seo_local', 'copywriting', 'booking'], rec: ['blog', 'lang_ar', 'geo', 'page_sup'], opt: ['lang_en', 'client_area', 'logo', 'photos'], monthly: ['hosting', 'seo_monthly'],
    questions: [{ id: 'q1', q: 'Plusieurs domaines d’expertise ?', add: ['page_sup'] }, { id: 'q2', q: 'Clients internationaux ?', add: ['lang_en'] }, { id: 'q3', q: 'Échange de documents avec les clients ?', add: ['client_area'] }],
    pitch: ['« Vos futurs clients vous jugent sur votre sérieux en ligne avant même d’appeler. »', '« Des articles d’expertise vous font recommander par Google… et par ChatGPT. »'] },
  { id: 'artisan', label: 'BTP, garage, menuiserie, services à domicile', emoji: '🛠️', words: ['btp', 'construction', 'bâtiment', 'batiment', 'plombier', 'électricien', 'electricien', 'peintre', 'menuiserie', 'menuisier', 'aluminium', 'garage', 'mécanique', 'mecanique', 'carrosserie', 'auto-école', 'auto ecole', 'nettoyage', 'climatisation', 'piscine', 'jardinage', 'déménagement', 'transport', 'location voiture', 'بناء', 'كراج', 'نجارة'],
    base: 'base_vitrine', must: ['quote_form', 'gallery', 'gbp', 'seo_local'], rec: ['reviews', 'whatsapp_int', 'photos', 'page_sup'], opt: ['ads_setup', 'logo', 'lang_ar'], monthly: ['hosting', 'gbp_monthly'],
    questions: [{ id: 'q1', q: 'Intervenez-vous dans plusieurs villes ?', add: ['seo_local', 'page_sup'] }, { id: 'q2', q: 'Avez-vous des photos avant/après ?', add: ['gallery'] }, { id: 'q3', q: 'Besoin d’appels rapidement ?', add: ['ads_setup'] }],
    pitch: ['« Les gens cherchent “plombier + quartier” en urgence : être en haut de Google Maps, c’est recevoir l’appel. »', '« Les photos avant/après convainquent mieux que n’importe quel discours. »'] },
  { id: 'beaute', label: 'Coiffure, spa, hammam, esthétique', emoji: '💆', words: ['coiffeur', 'coiffure', 'salon', 'barbier', 'barber', 'spa', 'hammam', 'massage', 'esthétique', 'esthetique', 'onglerie', 'institut de beauté', 'maquillage', 'beauté', 'beaute', 'حمام', 'تجميل', 'حلاقة'],
    base: 'base_resa', must: ['booking', 'wa_reminders', 'gallery', 'gbp'], rec: ['reviews', 'photos', 'payment_cmi', 'seo_local'], opt: ['lang_en', 'logo', 'ads_setup'], monthly: ['hosting', 'gbp_monthly'],
    questions: [{ id: 'q1', q: 'Vendez-vous des cartes cadeaux ?', add: ['payment_cmi'] }, { id: 'q2', q: 'Plusieurs employés à réserver séparément ?', add: ['booking'] }, { id: 'q3', q: 'Clientèle touristique ?', add: ['lang_en'] }],
    pitch: ['« Vos clientes réservent le soir sur leur téléphone : l’agenda se remplit tout seul. »', '« Les rappels WhatsApp évitent les rendez-vous oubliés. »'] },
  { id: 'tourisme', label: 'Agence de voyages, excursions, activités', emoji: '🧭', words: ['agence de voyage', 'agence de voyages', 'voyage', 'excursion', 'circuit', 'tour', 'désert', 'quad', 'surf', 'kitesurf', 'randonnée', 'guide', 'transport touristique', 'سياحة', 'رحلات'],
    base: 'base_resa', must: ['booking', 'lang_en', 'payment_cmi', 'photos'], rec: ['gbp', 'reviews', 'seo_local', 'geo'], opt: ['copywriting', 'ads_setup', 'page_sup'], monthly: ['hosting', 'ads_mgmt'],
    questions: [{ id: 'q1', q: 'Autres langues que l’anglais ?', add: ['copywriting'] }, { id: 'q2', q: 'Plus de 5 circuits ?', add: ['page_sup'] }],
    pitch: ['« Les voyageurs réservent avant d’arriver au Maroc : il faut être trouvable en anglais et payable en ligne. »'] },
  { id: 'saas', label: 'Projet sur-mesure, startup, plateforme', emoji: '🚀', words: ['application', 'appli', 'app', 'plateforme', 'saas', 'startup', 'logiciel', 'marketplace', 'erp', 'crm', 'intranet', 'dashboard', 'تطبيق', 'منصة'],
    base: 'base_app', must: ['client_area', 'admin_cms'], rec: ['payment_cmi', 'lang_ar', 'logo'], opt: ['mobile_app', 'lang_en', 'seo_local', 'ads_setup'], monthly: ['hosting', 'support_plus'],
    questions: [{ id: 'q1', q: 'Faut-il une application mobile ?', add: ['mobile_app'] }, { id: 'q2', q: 'Paiements dans la plateforme ?', add: ['payment_cmi'] }],
    pitch: ['« On avance par étapes : une première version utile vite, puis des améliorations chaque mois. »'] },
];
const GENERIC: Profile = { id: 'generic', label: 'Autre activité', emoji: '✨', words: [], base: 'base_vitrine', must: ['gbp', 'seo_local'], rec: ['whatsapp_int', 'reviews', 'photos', 'geo'], opt: ['lang_ar', 'logo', 'ads_setup', 'blog'], monthly: ['hosting'], questions: [{ id: 'q1', q: 'Prenez-vous des rendez-vous ?', add: ['booking', 'wa_reminders'] }, { id: 'q2', q: 'Vendez-vous des produits en ligne ?', add: ['catalog_products', 'cod'] }], pitch: ['« Aujourd’hui, vos clients vous cherchent d’abord sur Google : on vous rend visible, puis on transforme les visites en appels. »'] };

/* Normalise le texte : minuscules, sans accents */
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[’']/g, ' ');
/* Mots trop généraux : ils comptent peu face à un mot précis (« cabinet dentaire » → santé, pas conseil) */
const WEAK = ['cabinet', 'salon', 'club', 'agence', 'centre', 'boutique', 'magasin', 'app', 'tour', 'terrain', 'location', 'mode', 'produits', 'cuisine', 'food', 'transport', 'formation', 'conseil', 'institut', 'résidence', 'residence', 'shop', 'guide'];
export const detectProfile = (metier: string): { profile: Profile; match?: string; score: number } => {
  const m = ' ' + norm(metier).trim() + ' '; if (!m.trim()) return { profile: GENERIC, score: 0 };
  let best: { profile: Profile; match?: string; score: number } = { profile: GENERIC, score: 0 };
  PROFILES.forEach((p) => {
    let score = 0; let match: string | undefined; let top = 0;
    p.words.forEach((w) => { const nw = norm(w).trim(); if (!nw) return; const hit = m.includes(nw) || (nw.length > 4 && m.trim().length > 3 && nw.startsWith(m.trim())); if (!hit) return; const sc = nw.length * (WEAK.includes(nw) ? 0.3 : 1); score += sc; if (sc > top) { top = sc; match = w; } });
    if (score > best.score) best = { profile: p, match, score };
  });
  return best;
};

const TOURIST = ['marrakech', 'agadir', 'essaouira', 'fes', 'fès', 'tanger', 'dakhla', 'chefchaouen', 'ouarzazate', 'merzouga', 'taghazout'];
const BIG = ['casablanca', 'rabat', 'marrakech', 'tanger'];
/* Mots-clés des notes d'appel → éléments suggérés */
const NOTE_RULES: [RegExp, string[], string][] = [
  [/livr|emporter|commande/, ['cod', 'catalog_products'], 'livraison'], [/r[ée]serv|rendez|rdv|cr[ée]neau/, ['booking', 'wa_reminders'], 'réservations'],
  [/anglais|touris|[ée]tranger|mre|international/, ['lang_en'], 'clientèle internationale'], [/arabe/, ['lang_ar'], 'version arabe'],
  [/paiement|payer en ligne|carte|cmi/, ['payment_cmi'], 'paiement en ligne'], [/appli|application mobile|app /, ['mobile_app'], 'application mobile'],
  [/logo|identit|charte/, ['logo'], 'identité visuelle'], [/photo|shooting/, ['photos'], 'photos'], [/avis|note google|[ée]toile/, ['reviews'], 'avis'],
  [/pub|publicit|sponsor|ads/, ['ads_setup', 'ads_mgmt'], 'publicité'], [/blog|article/, ['blog'], 'blog'], [/espace client|compte|abonnement|membre|parents/, ['client_area'], 'espace client'],
  [/catalogue|produits/, ['catalog_products'], 'catalogue'], [/texte|r[ée]daction|contenu/, ['copywriting'], 'rédaction'], [/chatgpt|ia |intelligence/, ['geo'], 'visibilité IA'],
  [/google maps|maps|fiche google/, ['gbp'], 'Google Maps'], [/plusieurs (adresses|agences|campus|sites)/, ['multi_sites'], 'plusieurs adresses'], [/devis|visite|inscription/, ['quote_form'], 'formulaire'],
];

export type Suggestion = { profile: Profile; match?: string; base: string; must: string[]; rec: string[]; opt: string[]; monthly: string[]; reasons: Record<string, string>; detected: string[] };
export const suggest = (metier: string, city: string, answers: Record<string, boolean>, notes: string): Suggestion => {
  const { profile: p, match } = detectProfile(metier); const reasons: Record<string, string> = { ...(p.why || {}) };
  const must = new Set(p.must), rec = new Set(p.rec), opt = new Set(p.opt), monthly = new Set(p.monthly);
  const promote = (id: string, why: string) => { if (must.has(id)) return; opt.delete(id); if (!monthly.has(id)) rec.add(id); reasons[id] = reasons[id] || why; };
  p.questions.forEach((q) => { if (answers[q.id] === true) q.add.forEach((id) => (id.endsWith('_mgmt') || id.endsWith('_monthly') ? monthly.add(id) : promote(id, `Le client a répondu oui : « ${q.q} »`))); if (answers[q.id] === false) (q.remove || []).forEach((id) => { rec.delete(id); must.delete(id); opt.add(id); }); });
  const c = norm(city);
  if (TOURIST.some((t) => c.includes(norm(t)))) promote('lang_en', `${city} attire une clientèle touristique : la version anglaise est un vrai plus.`);
  if (BIG.some((t) => c.includes(t))) { monthly.add('seo_monthly'); reasons.seo_monthly = `${city} est très concurrentielle sur Google : un suivi mensuel fait la différence.`; }
  const detected: string[] = []; const n = norm(notes);
  NOTE_RULES.forEach(([re, ids, label]) => { if (re.test(n)) { detected.push(label); ids.forEach((id) => (id.endsWith('_mgmt') ? monthly.add(id) : promote(id, `Mentionné pendant l’appel (${label}).`))); } });
  ['training'].forEach((id) => must.add(id));
  return { profile: p, match, base: p.base, must: [...must].filter((x) => x !== p.base), rec: [...rec].filter((x) => !must.has(x)), opt: [...opt].filter((x) => !must.has(x) && !rec.has(x)), monthly: [...monthly], reasons, detected };
};

export type Line = { id: string; qty: number; price: number };
export const priceOf = (catalog: CatItem[], id: string) => catalog.find((c) => c.id === id);
export const sumLines = (catalog: CatItem[], lines: Line[]) => {
  let once = 0, month = 0, days = 0, maxBase = 0;
  lines.forEach((l) => { const c = priceOf(catalog, l.id); if (!c) return; if (c.monthly) month += l.qty * l.price; else { once += l.qty * l.price; if (c.base) maxBase = Math.max(maxBase, c.days || 0); else days += (c.days || 0) * l.qty; } });
  const delay = Math.max(5, Math.round(maxBase + days * 0.45)); /* les tâches se font en partie en parallèle */
  return { once, month, delay };
};
export const tiersOf = (s: Suggestion) => [
  { key: 'essentiel', name: 'Essentiel', ids: [s.base, ...s.must], monthly: s.monthly.slice(0, 1), note: 'Le nécessaire pour exister en ligne et être trouvé.' },
  { key: 'recommande', name: 'Recommandé', ids: [s.base, ...s.must, ...s.rec], monthly: s.monthly, note: 'Ce que nous conseillons pour ce métier.', best: true },
  { key: 'premium', name: 'Premium', ids: [s.base, ...s.must, ...s.rec, ...s.opt.slice(0, 3)], monthly: s.monthly, note: 'Pour prendre une longueur d’avance sur la concurrence.' },
];
/* Échéancier conseillé selon le montant */
export const schedule = (ttc: number) => ttc >= 15000 ? [['À la commande', 40], ['À la validation de la première version', 40], ['À la mise en ligne', 20]] as [string, number][] : [['À la commande', 50], ['À la mise en ligne', 50]] as [string, number][];
