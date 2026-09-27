# Digilago — site de la société (v3, redesign tech premium)

React 19 + Vite + Tailwind v4 + Motion. Pages : Accueil (avec simulateur de visibilité et offres par métier), Services, Réalisations (#FaitParDigilago), Société, Contact.
Images : `IMG` et `PACK_IMG` dans `src/data.ts` (20 visuels générés).
Tout le contenu est dans `src/data.ts` (services, pôles, clients, bibliothèque, FAQ, contact, images).

## Mettre en ligne sans rien installer
Le dossier `digilago-en-ligne.zip` contient le site déjà compilé.
- **Netlify** : app.netlify.com/drop → glisser le dossier décompressé.
- **Vercel** : `vercel deploy` dans le dossier, ou importer le code source.
- **cPanel / hébergeur marocain (Apache)** : envoyer le contenu du dossier dans `public_html/`. Le fichier `.htaccess` est déjà inclus pour les routes.

## Modifier et recompiler
- `npm install` puis `npm run dev`
- `npm run build` → dossier `dist/` à mettre en ligne

## Palette
Nuit #0A1428 · Porcelaine #F2F4F7 · Cyan #2DD4E6 · Safran #F4B53F · Brume #9DA9C0 · Ardoise #56617A
Typographies : Sora (titres), Instrument Sans (texte), JetBrains Mono (éléments de code).

## Images
Les visuels (hero, services, équipe, fond zellige) et la bibliothèque de concepts sont hébergés sur le CDN Higgsfield (`IMG` et `LIBRARY` dans `src/data.ts`).
Pour les héberger vous-même : téléchargez-les dans `public/images/` et remplacez les adresses par `/images/nom.png`.
Les captures clients sont dans `src/assets/`.

## Mobile
Sur téléphone : menu plein écran animé, barre d'actions en bas (Appeler, WhatsApp, Première version) qui se cache au défilement,
carrousels à glisser (expertises, secteurs, références, technologies, Labs), onglets Google / Carte / IA dans le simulateur,
frise de méthode qui se dessine, grain et halos désactivés pour économiser la batterie.
Conseil performance : en hébergeant les images vous-même, convertissez-les en WebP (largeur 1600 px max), elles passeront de ~2 Mo à ~150 Ko.

## Langues
Français à la racine (`/`), anglais sur `/en`, arabe sur `/ar` (de droite à gauche, police Readex Pro).
Le texte source est en français dans le code ; `src/dict.ts` contient la traduction de chaque phrase : `"texte français": ["English", "العربية"]`.
Pour modifier une traduction, changez la valeur dans `dict.ts`. Pour ajouter un texte, écrivez-le en français dans le code avec `t('…')`, puis ajoutez sa ligne dans `dict.ts`.
Le sélecteur FR / EN / عربي (menu, menu mobile, pied de page) garde la même page en changeant de langue.

## Formulaire de contact
Les demandes partent vers le service défini dans `src/config.ts` (`FORM_ENDPOINT`).
1. Créez un formulaire gratuit sur formspree.io avec l'adresse e-mail qui doit recevoir les demandes.
2. Copiez son adresse (du type `https://formspree.io/f/abcdwxyz`) dans `FORM_ENDPOINT`, puis recompilez.
Tant que ce champ est vide, ou si l'envoi échoue, la demande s'ouvre dans WhatsApp, avec un lien e-mail de secours : aucune demande n'est perdue.
Un champ piège invisible bloque les robots, et la case de consentement renvoie vers la politique de confidentialité.

## Pages légales
`/mentions-legales` et `/confidentialite` (dans les trois langues). Complétez les informations entre crochets dans `LEGAL` (`src/config.ts`) : forme juridique, capital, adresse, RC, ICE, IF, directeur de la publication, hébergeur, récépissé CNDP. Faites valider les textes par un juriste.

## Page 404
Toute adresse inconnue affiche la page « 4 D 4 », marquée `noindex` pour les moteurs de recherche.

## SEO, GEO et performance
- **Compiler pour la mise en ligne : `npm run build:seo`** (compile puis pré-rend 76 pages HTML dans `dist/`). Première fois : `npx playwright install chromium`.
- Chaque page a son titre, sa description, son adresse canonique, ses liens hreflang (fr / en / ar / x-default), ses balises Open Graph et ses données structurées (Organization + ProfessionalService, WebSite, WebPage, BreadcrumbList, FAQPage, Service, Article).
- Pages de conquête locale : `/creation-site-web` et `/creation-site-web/<ville>` (14 villes), guides : `/guides/...`.
- `public/robots.txt` ouvre le site aux robots des IA (GPTBot, ClaudeBot, PerplexityBot, Google-Extended…), `public/llms.txt` résume Digilago pour les IA, `public/sitemap.xml` liste les 75 adresses.
- Les pages sont servies en `.html` sans extension (voir `.htaccess`, `vercel.json` avec `cleanUrls`, Netlify natif). Les adresses inconnues renvoient une vraie erreur 404 (`404.html`).
- Pour ajouter une ville : une entrée dans `src/cities.ts`, puis ajouter le chemin dans `scripts_routes.json`. Pour un guide : une entrée dans `ARTICLES` (`src/pages/Guides.tsx`) + son chemin.
- Réseaux sociaux : complétez `ORG.sameAs` dans `src/seo.tsx` (LinkedIn, Instagram, Facebook, fiche Google) dès qu'ils existent.
