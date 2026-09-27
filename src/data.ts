import { Target, Trophy, GraduationCap, Hospital, Stethoscope, UtensilsCrossed, Hotel, Building2, Scale, HardHat, Sparkles, Dumbbell, Car, ShoppingBag, Plane, Ruler, Globe, Smartphone, ShoppingCart, Search, Bot, MapPin, PenTool, Puzzle, Megaphone, Server } from 'lucide-react';
import agc from './assets/agc.jpg';
import angebleu from './assets/angebleu.jpg';
import marronniers from './assets/marronniers.jpg';

export const CONTACT = { phone: '+212 6 49 95 38 13', tel: '+212649953813', email: 'contact@digilago.ma', whatsapp: 'https://wa.me/212649953813?text=Bonjour%20Digilago%2C%20je%20veux%20ma%20premi%C3%A8re%20version%20gratuite.' };

export type Sector = { id: string; name: string; short: string; Icon: any; color: string; query: string; you: string; pitch: string; features: string[]; cta: string };
export const SECTORS: Sector[] = [
  { id: 'padel', name: 'Clubs de padel', short: 'Padel', Icon: Target, color: '#A8E063', query: 'terrain de padel Casablanca', you: 'Votre club de padel', pitch: 'Réservation de terrain en ligne, 24 h sur 24.', features: ['Réservation par créneau', 'Paiement ou WhatsApp', 'Tournois et coaching'], cta: 'Réserver un terrain' },
  { id: 'foot', name: 'Terrains de foot', short: 'Foot', Icon: Trophy, color: '#4ADE80', query: 'terrain foot à 5 Rabat', you: 'Votre complexe de foot', pitch: 'Des matchs réservés sans un seul appel.', features: ['Planning des terrains', 'Réservation d’équipe', 'Ligues et tournois'], cta: 'Réserver un match' },
  { id: 'ecole', name: 'Écoles privées', short: 'Écoles', Icon: GraduationCap, color: '#4DA3FF', query: 'école privée El Jadida', you: 'Votre école', pitch: 'Rassurer les parents et remplir les classes avant l’été.', features: ['Cycles et programmes', 'Pré-inscription en ligne', 'Actualités et agenda'], cta: 'Réserver une visite' },
  { id: 'clinique', name: 'Cliniques', short: 'Cliniques', Icon: Hospital, color: '#5EEAD4', query: 'clinique Marrakech urgences', you: 'Votre clinique', pitch: 'Les patients trouvent le bon service, au bon moment.', features: ['Spécialités et médecins', 'Urgences et horaires', 'Prise de rendez-vous'], cta: 'Prendre rendez-vous' },
  { id: 'medecin', name: 'Médecins & dentistes', short: 'Médecins', Icon: Stethoscope, color: '#93C5FD', query: 'dentiste Tanger ouvert samedi', you: 'Votre cabinet', pitch: 'Un agenda qui se remplit pendant que vous consultez.', features: ['Rendez-vous en ligne', 'Actes et tarifs', 'Accès et parking'], cta: 'Prendre rendez-vous' },
  { id: 'resto', name: 'Restaurants & cafés', short: 'Restaurants', Icon: UtensilsCrossed, color: '#F4A099', query: 'restaurant poisson El Jadida', you: 'Votre restaurant', pitch: 'Le menu, les photos, la table réservée.', features: ['Menu et photos', 'Réservation de table', 'Livraison et avis'], cta: 'Réserver une table' },
  { id: 'hotel', name: 'Hôtels & riads', short: 'Hôtels', Icon: Hotel, color: '#F2B441', query: 'riad Fès médina', you: 'Votre riad', pitch: 'Des réservations directes, sans commission.', features: ['Chambres et tarifs', 'Réservation directe', 'Arabe, français, anglais'], cta: 'Voir les chambres' },
  { id: 'immo', name: 'Immobilier', short: 'Immobilier', Icon: Building2, color: '#C4B5FD', query: 'appartement à vendre Agadir', you: 'Votre agence', pitch: 'Chaque bien, trouvé et visité en ligne.', features: ['Annonces filtrables', 'Visites virtuelles', 'Contact par bien'], cta: 'Voir les biens' },
  { id: 'avocat', name: 'Avocats & notaires', short: 'Juridique', Icon: Scale, color: '#E5E7EB', query: 'avocat droit des affaires Casablanca', you: 'Votre cabinet', pitch: 'La confiance, avant le premier rendez-vous.', features: ['Domaines d’expertise', 'Équipe et parcours', 'Consultation en ligne'], cta: 'Demander un rendez-vous' },
  { id: 'btp', name: 'BTP & artisans', short: 'BTP', Icon: HardHat, color: '#FDBA74', query: 'entreprise rénovation Kénitra', you: 'Votre entreprise', pitch: 'Des chantiers qui parlent pour vous.', features: ['Réalisations avant/après', 'Devis en ligne', 'Zones d’intervention'], cta: 'Demander un devis' },
  { id: 'beaute', name: 'Beauté & spas', short: 'Beauté', Icon: Sparkles, color: '#F9A8D4', query: 'hammam spa Marrakech', you: 'Votre spa', pitch: 'Des soins réservés en trois gestes.', features: ['Carte des soins', 'Réservation en ligne', 'Cartes cadeaux'], cta: 'Réserver un soin' },
  { id: 'sport', name: 'Salles de sport', short: 'Sport', Icon: Dumbbell, color: '#FCA5A5', query: 'salle de sport Casablanca Maarif', you: 'Votre salle', pitch: 'Des abonnés, pas seulement des visiteurs.', features: ['Planning des cours', 'Abonnements', 'Essai gratuit'], cta: 'Réserver un essai' },
  { id: 'auto', name: 'Auto & garages', short: 'Auto', Icon: Car, color: '#94A3B8', query: 'garage vidange Meknès', you: 'Votre garage', pitch: 'Le bon garage, trouvé en urgence.', features: ['Services et tarifs', 'Rendez-vous atelier', 'Itinéraire en un geste'], cta: 'Prendre rendez-vous' },
  { id: 'shop', name: 'Boutiques & e-commerce', short: 'E-commerce', Icon: ShoppingBag, color: '#FDE68A', query: 'caftan en ligne Maroc', you: 'Votre boutique', pitch: 'Vendre partout au Maroc, même la nuit.', features: ['Catalogue et panier', 'Paiement à la livraison', 'Suivi des commandes'], cta: 'Voir la boutique' },
  { id: 'tourisme', name: 'Tourisme & voyages', short: 'Tourisme', Icon: Plane, color: '#67E8F9', query: 'excursion désert Merzouga', you: 'Votre agence', pitch: 'Des circuits réservés depuis l’étranger.', features: ['Circuits et prix', 'Réservation multilingue', 'Avis voyageurs'], cta: 'Réserver un circuit' },
  { id: 'archi', name: 'Architectes & design', short: 'Architecture', Icon: Ruler, color: '#D9F99D', query: 'architecte intérieur Rabat', you: 'Votre studio', pitch: 'Un portfolio qui signe les projets.', features: ['Projets en grand', 'Approche et équipe', 'Prise de contact'], cta: 'Parler du projet' },
];

export const SERVICES = [
  { Icon: Globe, title: 'Sites web sur-mesure', text: 'Code écrit à la main, rapide, beau sur téléphone. Aucun modèle générique.' },
  { Icon: MapPin, title: 'Fiche Google Business', text: 'Vous apparaissez sur la carte, avec vos horaires, vos photos et vos avis.' },
  { Icon: Search, title: 'Référencement SEO', text: 'En tête des recherches de votre ville et de votre métier, durablement.' },
  { Icon: Bot, title: 'Visibilité dans les IA (GEO)', text: 'ChatGPT, Gemini et Perplexity vous citent quand on leur demande conseil.' },
  { Icon: Smartphone, title: 'Applications mobiles', text: 'Réservations, fidélité, commandes : votre service dans la poche du client.' },
  { Icon: ShoppingCart, title: 'Boutiques en ligne', text: 'Catalogue, panier, paiement à la livraison, suivi des commandes.' },
  { Icon: PenTool, title: 'Branding & logo', text: 'Une identité nette, reconnaissable, cohérente partout.' },
  { Icon: Puzzle, title: 'Extensions & intégrations', text: 'Réservation, WhatsApp, paiement, agenda, tableaux de bord.' },
  { Icon: Megaphone, title: 'Publicité en ligne', text: 'Google et Meta, ciblées sur votre quartier et votre clientèle.' },
  { Icon: Server, title: 'Hébergement & maintenance', text: 'Rapide, sécurisé, sauvegardé. Vous ne vous occupez de rien.' },
];

export const WORK = [
  { name: 'Académie Georges Claude', place: 'Sidi Bouzid · El Jadida', sector: 'École privée', img: agc, url: 'https://agc.ma', tags: ['Site bilingue FR / EN', 'Administration complète', 'Planning intégré'], color: '#E8B04B' },
  { name: 'Groupe Scolaire Ange Bleu', place: 'El Jadida', sector: 'École privée', img: angebleu, url: '', tags: ['Identité « Donner des ailes »', 'Pré-inscriptions en ligne', 'Actualités et agenda'], color: '#C4973B' },
  { name: 'Les Marronniers', place: 'Plateau · El Jadida', sector: 'Crèche · Maternelle · Primaire', img: marronniers, url: '', tags: ['Deux campus', 'Itinéraire en un geste', 'Espace administration'], color: '#0086D9' },
];

export const STEPS = [
  { n: '01', title: 'Vous nous donnez un nom', text: 'Le nom de votre entreprise et votre ville. C’est tout ce qu’il faut pour commencer.' },
  { n: '02', title: 'Première version en 72 h', text: 'Un vrai site, avec vos informations, vos couleurs et vos textes. Gratuit.' },
  { n: '03', title: 'Vous validez, on affine', text: 'Vous ne payez que si elle vous plaît. Trois séries de retouches incluses.' },
  { n: '04', title: 'En ligne, et trouvé', text: 'Site, fiche Google, SEO et IA : vous apparaissez là où l’on vous cherche.' },
];

export const FAQ = [
  { q: 'Combien coûte un projet avec Digilago ?', a: 'Le prix dépend de ce dont vous avez besoin : une présence en ligne complète (site, fiche Google, référencement) reste volontairement accessible, puis le budget évolue avec la complexité (réservation, boutique, application, plateforme). Il est toujours annoncé par écrit avant de commencer, et vous voyez une première version offerte avant de payer quoi que ce soit.' },
  { q: 'Que se passe-t-il après mon premier message ?', a: 'Nous vous rappelons le jour même pour un échange de dix minutes. Sous 72 heures, vous recevez le lien de votre première version. Vous nous faites vos retours, nous ajustons, puis nous mettons en ligne, créons votre fiche Google et vous formons en trente minutes.' },
  { q: 'Que signifie « 0 dirham avant validation » ?', a: 'Nous réalisons une première version de votre site, offerte. Si elle vous convainc, nous poursuivons ensemble. Sinon, vous ne nous devez rien.' },
  { q: 'Qu’est-ce que la visibilité dans les IA (GEO) ?', a: 'Le Generative Engine Optimization consiste à faire connaître votre entreprise aux assistants comme ChatGPT, Gemini ou Perplexity, afin qu’ils la recommandent lorsqu’on leur demande « un bon dentiste à Rabat » ou « un club de padel ouvert ce soir ».' },
  { q: 'Travaillez-vous en dehors d’El Jadida ?', a: 'Oui. Notre équipe est basée à El Jadida et accompagne des entreprises dans tout le Maroc, ainsi que des clients à l’étranger. Tout se fait à distance, avec des rendez-vous sur place quand c’est utile.' },
  { q: 'Le site sera-t-il disponible en arabe ?', a: 'Oui. La version arabe est incluse dans la présence en ligne complète. L’anglais est proposé pour le tourisme et les clientèles internationales.' },
  { q: 'Qui s’occupe du site après le lancement ?', a: 'Nous. Hébergement, sécurité, sauvegardes et mises à jour sont pris en charge. Vous gardez la main sur vos contenus depuis un espace simple, et notre équipe reste joignable sur WhatsApp.' },
];

/* ------------------------------ Packs par métier (sans prix) ------------------------------ */
export const PACKS = [
  { id: 'sport', name: 'Pack Sport', for: 'Padel, foot à 5, salles de sport', color: '#A8E063', items: ['Réservation de terrain ou de cours par créneau', 'Paiement en ligne ou confirmation WhatsApp', 'Planning en temps réel, abonnements', 'Fiche Google et avis', 'Application mobile en option'] },
  { id: 'sante', name: 'Pack Santé', for: 'Cliniques, médecins, dentistes, laboratoires', color: '#5EEAD4', items: ['Prise de rendez-vous en ligne', 'Spécialités, équipe, urgences, horaires', 'Fiche Google et itinéraire', 'Visibilité dans les IA (GEO)', 'Conformité et confidentialité'] },
  { id: 'education', name: 'Pack Éducation', for: 'Écoles, crèches, centres de formation', color: '#4DA3FF', items: ['Cycles, programmes, vie scolaire', 'Pré-inscription et réservation de visite', 'Espace administration : actualités, demandes', 'Version arabe et anglaise', 'Planning et espace parents en option'] },
  { id: 'hospitalite', name: 'Pack Hospitalité', for: 'Restaurants, cafés, hôtels, riads', color: '#F2B441', items: ['Menu ou chambres avec photos', 'Réservation directe, sans commission', 'Multilingue pour les visiteurs étrangers', 'Avis Google mis en avant', 'Livraison ou click-and-collect en option'] },
  { id: 'commerce', name: 'Pack Commerce', for: 'Boutiques, marques, artisans', color: '#FDE68A', items: ['Boutique en ligne complète', 'Paiement à la livraison et CMI', 'Catalogue, stock, suivi des commandes', 'Publicité Google et Meta', 'Fiche Google pour la boutique physique'] },
  { id: 'services', name: 'Pack Services', for: 'Avocats, immobilier, BTP, architectes, garages', color: '#C4B5FD', items: ['Site de confiance : équipe, réalisations, avis', 'Devis ou rendez-vous en ligne', 'Annonces ou portfolio filtrables', 'Référencement local par ville', 'Espace client en option'] },
  { id: 'saas', name: 'Pack Sur-mesure & SaaS', for: 'Toute entreprise avec un besoin métier', color: '#F4A099', items: ['Application web ou mobile', 'Tableaux de bord, planning, facturation', 'Espace clients ou membres', 'Intégrations : paiement, WhatsApp, agenda', 'Hébergement, sécurité, évolutions'] },
];

/* ------------------------------ Technologie 2027 ------------------------------ */
export const TECH = [
  { group: 'Interface', text: 'Ce que voient vos clients : rapide, fluide, beau sur téléphone.', items: ['React 19', 'Next.js 15', 'Vite 6', 'TypeScript', 'Tailwind CSS v4', 'Motion'] },
  { group: 'Données & métier', text: 'Réservations, commandes, espaces clients : des données fiables, en temps réel.', items: ['Supabase', 'Firebase', 'PostgreSQL', 'Prisma', 'Stripe · CMI', 'WhatsApp API'] },
  { group: 'Hébergement', text: 'Servi au plus près de vos clients, sécurisé, sauvegardé.', items: ['Vercel', 'Cloudflare', 'Edge functions', 'SSL', 'CDN images AVIF', 'Sauvegardes'] },
  { group: 'Être trouvé', text: 'Google, Maps et les IA lisent votre site comme un livre ouvert.', items: ['SEO technique', 'Schema.org', 'GEO · llms.txt', 'Google Business', 'Search Console', 'Core Web Vitals'] },
  { group: 'Intelligence artificielle', text: 'Assistants, contenus, recommandations : l’IA au service de votre métier.', items: ['Claude', 'Gemini', 'OpenAI', 'Assistants de réservation', 'Rédaction assistée', 'Analyse d’avis'] },
  { group: 'Qualité', text: 'Mesuré, testé, accessible. Rien n’est laissé au hasard.', items: ['Lighthouse 100', 'Accessibilité WCAG', 'Tests automatisés', 'Analytics respectueux', 'RGPD · CNDP', 'PWA'] },
];

export const AGENCY = {
  mission: 'Donner à chaque entreprise marocaine, de l’artisan au groupe, une présence en ligne à la hauteur de son savoir-faire.',
  vision: 'Aujourd’hui, on choisit un restaurant, un médecin ou un fournisseur en quelques secondes, sur Google ou auprès d’une IA. Notre rôle : faire en sorte que la réponse soit vous, avec les bonnes informations, dans chaque métier et chaque ville du Maroc.',
  story: 'Digilago est née à El Jadida d’un constat simple : le savoir-faire des entreprises marocaines est immense, leur visibilité en ligne ne l’est pas encore. Nous avons commencé avec des écoles, puis des commerces, des cliniques et des cabinets. Chaque projet est construit à la main, avec les technologies d’aujourd’hui et l’exigence d’un grand groupe.',
  values: [['Exigence', 'Aucun modèle générique. Chaque ligne de code est écrite pour son propriétaire.'], ['Résultats', 'Un site existe pour être trouvé et générer des contacts. Tout est mesuré dans ce sens.'], ['Transparence', 'Première version offerte, prix annoncé avant de commencer, aucun frais caché.'], ['Durée', 'Nous restons après le lancement : hébergement, sécurité, évolutions.']],
  numbers: [['72 h', 'pour une première version'], ['0 MAD', 'avant validation'], ['16', 'métiers couverts'], ['100 %', 'code écrit à la main']],
};

/* ------------------------------ Lago Labs ------------------------------ */
export const LABS = {
  lead: 'Digilago ne construit pas que pour les autres. Digilago Labs, c’est notre laboratoire : des produits que nous concevons, testons et faisons grandir, nés des besoins vus chez nos clients.',
  projects: [
    { name: 'Réserve', kind: 'SaaS · sport', status: 'Prototype', text: 'Réservation de terrains de padel et de foot par créneau, paiement ou WhatsApp, planning en temps réel. Né des clubs qui nous demandaient la même chose.', color: '#2D5BFF' },
    { name: 'Pupitre', kind: 'SaaS · éducation', status: 'En développement', text: 'L’espace administration des écoles : actualités, pré-inscriptions, messages, agenda. Déjà en service dans nos sites d’écoles, en cours de transformation en produit.', color: '#7C3AED' },
    { name: 'Rendez', kind: 'SaaS · santé', status: 'Prototype', text: 'Prise de rendez-vous en ligne pour cabinets et cliniques, rappels WhatsApp, agenda partagé. Simple pour le patient, sûr pour le praticien.', color: '#0EA5E9' },
    { name: 'Forge', kind: 'IA · web', status: 'Recherche', text: 'Notre chaîne interne : à partir d’un nom et d’un métier, générer le contenu, les visuels et une première version de site en 72 heures. Le moteur de notre promesse des 72 heures.', color: '#F59E0B' },
  ],
  how: [['01', 'Un besoin réel', 'Chaque produit part d’une demande répétée chez nos clients.'], ['02', 'Prototype en deux semaines', 'De vrais écrans, testés avec de vrais utilisateurs, avant d’investir.'], ['03', 'Version 1 utile', 'Peu de fonctions, mais fiables. En ligne, mesurées, améliorées chaque semaine.'], ['04', 'Produit ou service', 'Nous le proposons en abonnement, ou nous le construisons sur-mesure pour un client.']],
  stack: ['React 19', 'Next.js 15', 'TypeScript', 'Supabase', 'PostgreSQL', 'Stripe · CMI', 'WhatsApp API', 'Claude', 'Gemini', 'Vercel', 'Cloudflare', 'Expo'],
};

/* ------------------------------ Bibliothèque : 27 concepts par métier ------------------------------ */
const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_3Im2HSx2UUwSDvPBnWXfWTAv6du/';
export type Concept = { id: number; name: string; mono: string; sector: string; group: string; city: string; color: string; img: string; cta: string; features: string[] };
export const GROUPS = ['Tous', 'Sport', 'Santé', 'Hospitalité', 'Immobilier', 'Juridique', 'Bâtiment', 'Beauté', 'Auto', 'Commerce', 'Tourisme', 'Éducation', 'Services'];
const C = (id: number, name: string, mono: string, sector: string, group: string, city: string, color: string, file: string, cta: string, features: string[]): Concept => ({ id, name, mono, sector, group, city, color, img: CDN + file + '.png', cta, features });
export const LIBRARY: Concept[] = [
  C(1, 'Padel Club Anfa', 'PA', 'Club de padel', 'Sport', 'Casablanca', '#A8E063', 'hf_20260926_182338_48a3b2b7-d37d-469d-9fa8-3451f78b310c', 'Réserver un terrain', ['Réservation par créneau', 'Paiement en ligne ou WhatsApp', 'Tournois et coaching']),
  C(2, 'Five Rabat', 'F5', 'Foot à 5', 'Sport', 'Rabat', '#4ADE80', 'hf_20260926_182338_248d262e-456a-49a4-a2fc-648c9d95167d', 'Réserver un match', ['Planning des terrains', 'Réservation d’équipe', 'Ligues et classements']),
  C(3, 'Iron Studio', 'IS', 'Salle de sport', 'Sport', 'Casablanca', '#FCA5A5', 'hf_20260926_182340_1bc50e0d-3669-411f-8c4e-fe9876d04197', 'Réserver un essai', ['Planning des cours', 'Abonnements en ligne', 'Essai gratuit']),
  C(4, 'Clinique Atlas', 'CA', 'Clinique privée', 'Santé', 'Marrakech', '#5EEAD4', 'hf_20260926_182339_e6a2ad3f-a3db-42e3-b3e7-1b92a71af722', 'Prendre rendez-vous', ['Spécialités et médecins', 'Urgences et horaires', 'Fiche Google et itinéraire']),
  C(5, 'Sourire Dentaire', 'SD', 'Cabinet dentaire', 'Santé', 'Tanger', '#93C5FD', 'hf_20260926_182339_e6662cad-8874-48a5-98d6-ccabf9fd90f3', 'Prendre rendez-vous', ['Rendez-vous en ligne', 'Actes et tarifs', 'Rappels WhatsApp']),
  C(6, 'LabMed Analyses', 'LM', 'Laboratoire', 'Santé', 'Casablanca', '#60A5FA', 'hf_20260926_182339_13481309-6ff3-4071-a059-fb74fe784eff', 'Mes résultats', ['Résultats en ligne', 'Horaires et prélèvements', 'Espace patient']),
  C(7, 'Pharmacie du Plateau', 'PP', 'Pharmacie', 'Santé', 'El Jadida', '#34D399', 'hf_20260926_182339_c6803f44-8d3b-46b1-854f-acc25de3f11f', 'Commander', ['Pharmacie de garde', 'Commande et livraison', 'Fiche Google']),
  C(8, 'Dar Tajine', 'DT', 'Restaurant', 'Hospitalité', 'El Jadida', '#F4A099', 'hf_20260926_182338_91fe8c5b-76ea-4c9a-96f2-f6836322b217', 'Réserver une table', ['Menu et photos', 'Réservation de table', 'Avis Google']),
  C(9, 'Kawa Roasters', 'KR', 'Café', 'Hospitalité', 'Rabat', '#C4874B', 'hf_20260926_182338_6e63322b-7609-45b7-92be-e9fae5dde773', 'Voir le menu', ['Menu du jour', 'Click and collect', 'Programme fidélité']),
  C(10, 'Riad Sabah', 'RS', 'Riad', 'Hospitalité', 'Fès', '#F2B441', 'hf_20260926_182356_deaf482f-881e-4dc4-adec-ad6d50eb3291', 'Réserver', ['Chambres et tarifs', 'Réservation directe', 'Trois langues']),
  C(11, 'Océan Hôtel', 'OH', 'Hôtel', 'Hospitalité', 'Agadir', '#3B82F6', 'hf_20260926_182355_cea81d08-736d-4911-82b9-074ac2fde100', 'Voir les chambres', ['Réservation sans commission', 'Offres et séjours', 'Avis voyageurs']),
  C(12, 'Immo Prestige', 'IP', 'Agence immobilière', 'Immobilier', 'Casablanca', '#C4B5FD', 'hf_20260926_182356_f29f43f6-db85-4e26-9d08-b3c8f12545a7', 'Voir les biens', ['Annonces filtrables', 'Visite virtuelle', 'Alerte nouveaux biens']),
  C(13, 'Résidences Al Bahr', 'AB', 'Promoteur', 'Immobilier', 'Tanger', '#D4B483', 'hf_20260926_182356_543ea435-f511-4912-9883-04a97e33fb5d', 'Découvrir le programme', ['Plans et disponibilités', 'Simulateur de financement', 'Prise de rendez-vous']),
  C(14, 'Cabinet Juris', 'CJ', 'Cabinet d’avocats', 'Juridique', 'Casablanca', '#B91C1C', 'hf_20260926_182358_c482bc1f-1c6a-4091-a9cc-74e9ab26be75', 'Prendre rendez-vous', ['Domaines d’expertise', 'Équipe et parcours', 'Consultation en ligne']),
  C(15, 'Étude Al Amana', 'EA', 'Notaire', 'Juridique', 'Rabat', '#15803D', 'hf_20260926_182356_148af252-a710-4b57-95f1-4d03d2ad7079', 'Demander un rendez-vous', ['Actes et démarches', 'Pièces à préparer', 'Rendez-vous en ligne']),
  C(16, 'BâtiPro', 'BP', 'Entreprise de BTP', 'Bâtiment', 'Kénitra', '#FDBA74', 'hf_20260926_182356_5c700b76-7ee3-4882-969a-f78fb1b3cdac', 'Demander un devis', ['Réalisations avant/après', 'Devis en ligne', 'Zones d’intervention']),
  C(17, 'Atelier du Bois', 'AD', 'Menuiserie', 'Bâtiment', 'Marrakech', '#A16207', 'hf_20260926_182356_f45c1f95-1fcd-475d-af42-3232492bc6c1', 'Demander un devis', ['Portfolio de créations', 'Sur-mesure et délais', 'Contact WhatsApp']),
  C(18, 'Hammam Rose', 'HR', 'Spa et hammam', 'Beauté', 'Marrakech', '#F9A8D4', 'hf_20260926_182356_91f3ce45-080c-408b-8876-d50b9e85d800', 'Réserver un soin', ['Carte des soins', 'Réservation en ligne', 'Cartes cadeaux']),
  C(19, 'Salon Noir & Or', 'NO', 'Salon de coiffure', 'Beauté', 'Casablanca', '#F2B441', 'hf_20260926_182415_db71c417-b73f-4665-83ae-b878fe563359', 'Réserver', ['Prestations et tarifs', 'Réservation par coiffeur', 'Galerie']),
  C(20, 'Garage Expert', 'GE', 'Garage automobile', 'Auto', 'Meknès', '#EF4444', 'hf_20260926_182415_60e9e15b-5622-483a-8847-c0642e377df4', 'Prendre rendez-vous', ['Services et tarifs', 'Rendez-vous atelier', 'Itinéraire en un geste']),
  C(21, 'Maison Caftan', 'MC', 'Boutique de caftans', 'Commerce', 'Fès', '#A855F7', 'hf_20260926_182415_63a2559c-2fd6-4e91-9a93-2cdd6db20c58', 'Voir la boutique', ['Catalogue et panier', 'Paiement à la livraison', 'Livraison Maroc et monde']),
  C(22, 'Argania', 'AR', 'Cosmétiques à l’argan', 'Commerce', 'Essaouira', '#F59E0B', 'hf_20260926_182415_151b821f-f9bd-46ef-b842-eb636763968c', 'Commander', ['Boutique en ligne', 'Abonnement produits', 'Avis clients']),
  C(23, 'Sahara Voyages', 'SV', 'Agence de voyages', 'Tourisme', 'Merzouga', '#67E8F9', 'hf_20260926_182415_5e38a900-eac8-49ec-887e-b5ce2d6c908f', 'Réserver un circuit', ['Circuits et prix', 'Réservation multilingue', 'Avis voyageurs']),
  C(24, 'Studio Intérieur', 'SI', 'Architecte d’intérieur', 'Services', 'Rabat', '#A3E635', 'hf_20260926_182415_58527b40-a85c-4444-85ed-657591330821', 'Parler du projet', ['Projets en grand', 'Approche et équipe', 'Prise de contact']),
  C(25, 'Auto-École Route', 'AE', 'Auto-école', 'Éducation', 'Casablanca', '#FACC15', 'hf_20260926_182415_cb6f0e0a-c4fc-48f7-b7ae-edf5d0bbc80d', 'S’inscrire', ['Formules et prix', 'Inscription en ligne', 'Planning des leçons']),
  C(26, 'Académie Pro', 'AP', 'Centre de formation', 'Éducation', 'Casablanca', '#4DA3FF', 'hf_20260926_182415_a369beef-3bdb-424e-bfcb-69c6d0ee9c50', 'S’inscrire', ['Catalogue de formations', 'Inscription en ligne', 'Certificats']),
  C(27, 'Compta Plus', 'CP', 'Cabinet comptable', 'Services', 'Casablanca', '#1D4ED8', 'hf_20260926_182415_9c07095f-c893-4b84-815c-2375f5960cd3', 'Prendre rendez-vous', ['Services et forfaits', 'Espace client', 'Prise de rendez-vous']),
];


/* ------------------------------ Visuels du site (générés, hébergés sur CDN) ------------------------------ */
const HF = 'https://d8j0ntlcm91z4.cloudfront.net/user_3Im2HSx2UUwSDvPBnWXfWTAv6du/';
export const IMG = {
  hero: HF + 'hf_20260927_002945_00a7448e-b3d0-462f-8d3f-66480faa08dd.png',
  design: HF + 'hf_20260927_002945_331f394b-d447-443a-bdc3-daf8a2ca6f5e.png',
  maps: HF + 'hf_20260927_002945_ec3653cd-0bad-4ee6-a7fa-279594c3d0c6.png',
  servers: HF + 'hf_20260927_002945_2976eb44-2f57-4d64-ae66-c4d61a3a5b96.png',
  app: HF + 'hf_20260927_002945_36a7cd74-60ae-4927-8040-3067bce17b6f.png',
  team: HF + 'hf_20260927_014938_ab688f20-bb35-489b-97f6-ed7f88ced807.png',
  client: HF + 'hf_20260927_014938_8f0349b2-22f4-4353-a81a-d9d8907ca2b9.png',
  zellige: HF + 'hf_20260927_002946_287c9f4b-2f65-422e-a68e-3307f3484d7e.png',
  eljadida: HF + 'hf_20260927_010342_ebf90327-e558-4ea0-b331-b0207b5ec604.png',
  workshop: HF + 'hf_20260927_010342_43856e2d-02bc-4b61-b7d3-1a98a696a532.png',
  code: HF + 'hf_20260927_014938_1b9728a3-90af-403e-92b5-52bb3d0ec58a.png',
  whatsapp: HF + 'hf_20260927_010342_73251983-3ffe-46df-97e3-6abf01842755.png',
  search: HF + 'hf_20260927_010342_cf619f05-06f5-41a3-8f11-2da4f31e1be2.png',
  heroBg: HF + 'hf_20260927_012603_cfcfd162-c92f-4867-8058-cb219297b540.png',
  night: HF + 'hf_20260927_012603_651b1a22-00c2-4d47-a7ed-05d5bc21277a.png',
};
/* Une image par offre métier */
export const PACK_IMG: Record<string, string> = {
  sport: HF + 'hf_20260927_010342_b7ab0862-5b44-4cd9-bba5-d0b74aa18c4a.png',
  sante: HF + 'hf_20260927_010342_d8fef008-dc47-49d1-88a7-0807e6988aaa.png',
  education: HF + 'hf_20260927_014938_74283ff1-0e04-4ffd-a6d4-afa71eb00692.png',
  hospitalite: HF + 'hf_20260927_010342_c334eb90-94ea-4df7-b42b-ba4fee192e42.png',
  commerce: HF + 'hf_20260927_010342_742c0bca-3c34-4614-9ee6-f0ea59d45cc3.png',
  services: HF + 'hf_20260927_010342_0c69eb1e-0a2b-4cab-b3f2-d8abd8a75a03.png',
  saas: HF + 'hf_20260927_010342_fff1c6ba-ab0f-4624-8cc5-f1b643118ce0.png',
};

/* ------------------------------ Trois pôles de services ------------------------------ */
export const PILLARS = [
  { id: 'concevoir', title: 'Concevoir', lead: 'Des sites et des applications dessinés pour votre métier, codés pour durer.', img: IMG.workshop,
    services: ['Sites web sur-mesure', 'Boutiques en ligne', 'Applications web et mobiles', 'Branding et logo'],
    deliver: ['Maquette validée avant le code', 'Version arabe, française et anglaise', 'Espace pour modifier vos contenus', 'Code source remis à votre nom'] },
  { id: 'trouver', title: 'Faire trouver', lead: 'Votre nom en tête sur Google, sur la carte et dans les réponses des IA.', img: IMG.search,
    services: ['Fiche Google Business', 'Référencement SEO local', 'Visibilité dans les IA (GEO)', 'Publicité Google et Meta'],
    deliver: ['Fiche Google complète et vérifiée', 'Balisage Schema.org et llms.txt', 'Suivi des positions par ville', 'Rapport mensuel lisible'] },
  { id: 'operer', title: 'Faire tourner', lead: 'Hébergement, sécurité et logiciels métier, surveillés jour et nuit.', img: IMG.servers,
    services: ['Hébergement et maintenance', 'Intégrations : paiement, WhatsApp, agenda', 'Logiciels métier et tableaux de bord', 'Support le jour même'] },
];
PILLARS[2] = { ...PILLARS[2], deliver: ['Certificat SSL et CDN mondial', 'Sauvegardes quotidiennes', 'Mises à jour de sécurité', 'Un interlocuteur qui connaît votre projet'] } as any;

/* Ce que contient chaque projet : ce qui donne sa valeur au travail */
export const INSIDE = [
  ['Design sur-mesure', 'Aucun thème acheté. Chaque écran est dessiné pour votre métier et vos clients.'],
  ['Code professionnel', 'React et TypeScript, les standards des grandes plateformes. Rapide, sûr, évolutif.'],
  ['Moins d’une seconde', 'Images optimisées et servies au plus près de vos visiteurs. Google récompense la vitesse.'],
  ['Mobile d’abord', 'La majorité de vos clients arrivent par téléphone. Tout est conçu pour eux en premier.'],
  ['Lisible par Google et les IA', 'Données structurées, contenus clairs, fiche Google reliée au site.'],
  ['Trois langues', 'Arabe, français et anglais, pour votre clientèle locale comme internationale.'],
  ['Propriété totale', 'Domaine, code et données sont à votre nom. Aucune dépendance, aucun piège.'],
  ['Autonomie', 'Trente minutes de formation pour modifier seul horaires, tarifs et actualités.'],
];

/* Anatomie d’un projet : une vraie séquence */
export const PROCESS = [
  { t: 'Écoute', d: 'Un appel de dix minutes pour comprendre votre activité, vos clients et vos objectifs.', out: 'Fiche projet' },
  { t: 'Première version', d: 'Sous 72 heures, un site réel avec vos informations. Offert, sans engagement.', out: 'Lien de démonstration' },
  { t: 'Affinage', d: 'Vous commentez, nous ajustons. Trois cycles de retouches sont inclus.', out: 'Design validé' },
  { t: 'Développement', d: 'Code écrit à la main, testé sur téléphone, tablette et ordinateur.', out: 'Site complet et testé' },
  { t: 'Lancement', d: 'Domaine, sécurité, fiche Google, référencement et balisage pour les IA.', out: 'Site public et indexé' },
  { t: 'Accompagnement', d: 'Hébergement, sauvegardes et évolutions. Une équipe joignable sur WhatsApp.', out: 'Rapport mensuel' },
];

/* Études de cas des vrais clients */
export const CASES = [
  { ...WORK[0], brief: 'Présenter une école de la maternelle au baccalauréat et gérer les inscriptions de la rentrée.', done: ['Site bilingue français / anglais', 'Espace administration complet', 'Planning intégré et actualités'] },
  { ...WORK[1], brief: 'Donner une identité forte à une école et recevoir les pré-inscriptions en ligne.', done: ['Identité « Donner des ailes »', 'Pré-inscriptions en ligne', 'Actualités et agenda'] },
  { ...WORK[2], brief: 'Réunir deux campus, de la crèche au primaire, sur un seul site clair pour les parents.', done: ['Deux campus sur une seule page', 'Itinéraire en un geste', 'Espace administration'] },
];

/* ------------------------------ Catalogue détaillé des services (page Services) ------------------------------ */
import { Globe as G2, ShoppingCart as Cart2, LayoutDashboard, Smartphone as Phone2, CalendarCheck, PenTool as Pen2, Figma, MapPin as Pin2, Search as Search2, Bot as Bot2, Megaphone as Mega2, FileText, Star as Star2, Server as Server2, ShieldCheck, Plug, BarChart3, Sparkles as Spark2, GraduationCap as Grad2 } from 'lucide-react';
export type Service = { Icon: any; t: string; d: string; inc: string[]; res: string };
export const CATALOG: { id: string; title: string; lead: string; img: string; items: Service[] }[] = [
  { id: 'concevoir', title: 'Concevoir', lead: 'Des outils numériques dessinés pour votre métier et codés pour durer.', img: IMG.workshop, items: [
    { Icon: G2, t: 'Site vitrine sur-mesure', d: 'Un site rapide et élégant qui présente votre activité et transforme les visites en contacts.', inc: ['Design unique, pensé mobile d’abord', 'Arabe, français et anglais', 'Espace pour modifier vos contenus'], res: 'Une image professionnelle, visible 24 h sur 24.' },
    { Icon: Cart2, t: 'Boutique en ligne', d: 'Vendez partout au Maroc et à l’étranger, avec un parcours d’achat simple.', inc: ['Catalogue, panier, variantes', 'Paiement CMI ou à la livraison', 'Suivi des commandes et du stock'], res: 'Des ventes, même quand la boutique est fermée.' },
    { Icon: CalendarCheck, t: 'Réservation et rendez-vous', d: 'Vos clients réservent un créneau, une table ou une chambre sans appeler.', inc: ['Agenda en temps réel', 'Confirmation et rappels WhatsApp', 'Acompte en ligne en option'], res: 'Moins d’appels manqués, plus de rendez-vous tenus.' },
    { Icon: LayoutDashboard, t: 'Application web et espace client', d: 'Espaces membres, portails parents, extranets : vos clients autonomes, vos équipes soulagées.', inc: ['Comptes et droits d’accès', 'Documents, factures, messages', 'Tableaux de bord'], res: 'Un service client disponible en permanence.' },
    { Icon: Phone2, t: 'Application mobile', d: 'Une application iOS et Android pour fidéliser et commander en un geste.', inc: ['Notifications ciblées', 'Programme de fidélité', 'Publication sur les stores'], res: 'Votre marque dans la poche de vos clients.' },
    { Icon: Figma, t: 'Design UX / UI', d: 'Parcours, maquettes et prototypes cliquables avant la moindre ligne de code.', inc: ['Ateliers et parcours utilisateurs', 'Maquettes haute fidélité', 'Prototype testé avec vos clients'], res: 'Des décisions validées, sans surprise au développement.' },
    { Icon: Pen2, t: 'Identité visuelle et logo', d: 'Un logo, des couleurs et une typographie qui vous distinguent partout.', inc: ['Logo et déclinaisons', 'Palette et typographies', 'Guide d’utilisation'], res: 'Une marque reconnaissable du site à l’enseigne.' },
  ]},
  { id: 'trouver', title: 'Faire trouver', lead: 'Votre nom en tête là où vos clients cherchent : Google, la carte et les IA.', img: IMG.search, items: [
    { Icon: Pin2, t: 'Fiche Google Business', d: 'Création, vérification et optimisation de votre fiche sur Google et Maps.', inc: ['Photos, horaires, services', 'Catégories et zones optimisées', 'Publications régulières'], res: 'Des appels et des itinéraires directement depuis Google.' },
    { Icon: Search2, t: 'Référencement SEO local', d: 'Votre site en première page quand on cherche votre métier dans votre ville.', inc: ['Audit technique et mots-clés', 'Pages par service et par ville', 'Suivi mensuel des positions'], res: 'Un flux de clients durable, sans payer chaque clic.' },
    { Icon: Bot2, t: 'Visibilité dans les IA (GEO)', d: 'ChatGPT, Gemini et Perplexity connaissent votre entreprise et la recommandent.', inc: ['Données structurées Schema.org', 'Fichier llms.txt', 'Contenus pensés pour les assistants'], res: 'Vous êtes la réponse quand on demande conseil à une IA.' },
    { Icon: Mega2, t: 'Publicité Google et Meta', d: 'Des campagnes ciblées sur votre quartier, votre clientèle et votre budget.', inc: ['Stratégie et ciblage', 'Création des annonces', 'Rapport clair chaque mois'], res: 'Des résultats rapides, mesurés au dirham près.' },
    { Icon: FileText, t: 'Contenus et rédaction', d: 'Textes, articles et visuels qui rassurent vos clients et plaisent à Google.', inc: ['Rédaction en trois langues', 'Articles de blog', 'Visuels pour le site et les réseaux'], res: 'Un discours clair qui donne envie de vous contacter.' },
    { Icon: Star2, t: 'Avis et réputation', d: 'Collectez plus d’avis cinq étoiles et répondez à chacun avec soin.', inc: ['Demande d’avis automatisée', 'Réponses aux avis', 'Alertes en cas d’avis négatif'], res: 'Une note qui inspire confiance au premier regard.' },
  ]},
  { id: 'operer', title: 'Faire tourner', lead: 'Hébergement, sécurité, intégrations et logiciels : tout fonctionne, tout le temps.', img: IMG.servers, items: [
    { Icon: Server2, t: 'Hébergement et nom de domaine', d: 'Un site servi au plus près de vos visiteurs, au Maroc comme à l’étranger.', inc: ['Domaine .ma ou .com', 'Certificat SSL et CDN mondial', 'Adresses e-mail professionnelles'], res: 'Un site rapide et toujours en ligne.' },
    { Icon: ShieldCheck, t: 'Maintenance et sécurité', d: 'Mises à jour, sauvegardes et surveillance, sans que vous ayez à y penser.', inc: ['Sauvegardes quotidiennes', 'Surveillance jour et nuit', 'Corrections sous 24 heures'], res: 'La tranquillité, sans mauvaise surprise.' },
    { Icon: Plug, t: 'Intégrations', d: 'Votre site relié à vos outils : paiement, WhatsApp, agenda, CRM, comptabilité.', inc: ['Paiement CMI et Stripe', 'WhatsApp Business API', 'Agenda, CRM, facturation'], res: 'Moins de saisie, zéro double emploi.' },
    { Icon: BarChart3, t: 'Logiciels métier et tableaux de bord', d: 'Planning, facturation, suivi d’activité : des outils taillés pour vos process.', inc: ['Analyse de vos besoins', 'Développement par étapes', 'Formation des équipes'], res: 'Des équipes plus efficaces, des décisions éclairées.' },
    { Icon: Spark2, t: 'Automatisation et IA', d: 'Assistants de réservation, réponses WhatsApp, tri des demandes, rédaction assistée.', inc: ['Assistant WhatsApp', 'Automatisation des tâches répétitives', 'Analyse des avis clients'], res: 'Des heures gagnées chaque semaine.' },
    { Icon: Grad2, t: 'Formation et accompagnement', d: 'Vous et vos équipes savez utiliser vos outils, et nous restons joignables.', inc: ['Formation de prise en main', 'Guides vidéo', 'Support WhatsApp le jour même'], res: 'Une autonomie réelle, un partenaire disponible.' },
  ]},
];
