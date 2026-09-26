# Digilago — site de l'agence (v2)

React + Vite + Tailwind v4 + Motion + Lenis. Un site, trois univers : `/` Digilago (le groupe, sombre et or), `/web` Digilago présence en ligne ( : accueil, services, technologie, réalisations, packs, contact ; sombre puis clair à mi-page), `/labs` Lago Labs (nos produits : clair, bleu électrique et violet). La navigation, les couleurs et l'appel à l'action changent selon l'univers (`data-brand` sur `<html>`). Tout le contenu est dans `src/data.ts` (métiers, services, réalisations, packs, stack technique, agence, FAQ, contact). Déploiement Vercel : `vercel.json` gère les routes.

- `npm install` puis `npm run dev`
- `npm run build` → `dist/` (Netlify / Vercel)
- `npm run build:apercu` → `dist-apercu/index.html` (un seul fichier)

Ajouter une réalisation : déposer la capture dans `src/assets/`, puis ajouter une entrée dans `WORK` (`src/data.ts`).
Ajouter un métier : une entrée dans `SECTORS` (nom, icône, couleur, requête type, bouton principal).


## Bibliothèque de réalisations
27 concepts par métier (`LIBRARY` dans `src/data.ts`), visuels générés avec Higgsfield (Nano Banana) et hébergés sur son CDN. Chaque concept : nom, monogramme (logo généré), secteur, ville, couleur, bouton principal, contenu. Composant `src/Library.tsx` : filtres, cadres qui défilent au survol, fiche détaillée. Pour remplacer un visuel, changez l'adresse `img` ; pour un vrai client, déplacez l'entrée vers `WORK`.
