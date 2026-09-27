/**
 * SEO de chaque page : titre, description, adresse canonique, liens entre les trois langues,
 * balises de partage (Open Graph) et données structurées JSON-LD (schema.org).
 * Les balises sont écrites dans <head> ; le pré-rendu (scripts/prerender.mjs) les fige dans le HTML
 * pour que Google, Bing et les robots des IA les lisent sans exécuter de JavaScript.
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { lang, stripLang, L, Lang } from './i18n';
import { CONTACT } from './data';

export const SITE = 'https://digilago.ma';
const OG_IMG = 'https://d8j0ntlcm91z4.cloudfront.net/user_3Im2HSx2UUwSDvPBnWXfWTAv6du/hf_20260927_012603_cfcfd162-c92f-4867-8058-cb219297b540.png';
const LOCALE: Record<Lang, string> = { fr: 'fr_MA', en: 'en_US', ar: 'ar_MA' };

const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); el.setAttribute('data-seo', ''); document.head.appendChild(el); }
  el.setAttribute('content', content);
};
const setLink = (rel: string, href: string, hreflang?: string) => {
  const sel = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]:not([hreflang])`;
  let el = document.head.querySelector<HTMLLinkElement>(sel);
  if (!el) { el = document.createElement('link'); el.rel = rel; if (hreflang) el.hreflang = hreflang; el.setAttribute('data-seo', ''); document.head.appendChild(el); }
  el.href = href;
};

/* L'entreprise, présente sur toutes les pages : c'est ce que Google et les IA retiennent de Digilago */
export const ORG = {
  '@type': ['Organization', 'ProfessionalService'], '@id': `${SITE}/#organisation`, name: 'Digilago', url: SITE,
  logo: `${SITE}/favicon.svg`, image: OG_IMG, email: CONTACT.email, telephone: CONTACT.tel,
  description: 'Agence web marocaine basée à El Jadida : création de sites internet sur-mesure, boutiques en ligne, applications, référencement SEO local, fiches Google Business et visibilité dans les moteurs d’IA (GEO) pour les entreprises au Maroc.',
  foundingLocation: 'El Jadida, Maroc',
  address: { '@type': 'PostalAddress', addressLocality: 'El Jadida', addressRegion: 'Casablanca-Settat', addressCountry: 'MA' },
  geo: { '@type': 'GeoCoordinates', latitude: 33.2316, longitude: -8.5007 },
  areaServed: [{ '@type': 'Country', name: 'Maroc' }, ...['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fès', 'Agadir', 'Meknès', 'Oujda', 'Kénitra', 'Tétouan', 'El Jadida', 'Safi', 'Laâyoune', 'Dakhla'].map((c) => ({ '@type': 'City', name: c }))],
  openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '09:00', closes: '19:00' }],
  knowsLanguage: ['fr', 'ar', 'en'],
  knowsAbout: ['Création de site web', 'Développement web', 'Référencement SEO', 'SEO local', 'Generative Engine Optimization', 'Google Business Profile', 'E-commerce', 'Applications mobiles', 'UX/UI design', 'Hébergement web'],
  priceRange: '$$',
  slogan: 'L’infrastructure digitale des entreprises marocaines.',
  sameAs: [] as string[], /* à compléter : LinkedIn, Instagram, Facebook, fiche Google… */
};

export type Crumb = [string, string]; /* [nom, chemin] */

export const Seo = ({ title, description, noindex = false, jsonLd = [], crumbs }: { title: string; description: string; noindex?: boolean; jsonLd?: object[]; crumbs?: Crumb[] }) => {
  const { pathname } = useLocation();
  useEffect(() => {
    const l = lang(); const rest = stripLang(pathname); const url = SITE + (pathname === '/' ? '/' : pathname.replace(/\/$/, ''));
    document.title = title;
    setMeta('name', 'description', description);
    setMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1');
    setLink('canonical', url);
    (['fr', 'en', 'ar'] as Lang[]).forEach((x) => setLink('alternate', SITE + (L(rest, x) === '/' ? '/' : L(rest, x)), x));
    setLink('alternate', SITE + (rest === '/' ? '/' : rest), 'x-default');
    setMeta('property', 'og:type', 'website'); setMeta('property', 'og:site_name', 'Digilago');
    setMeta('property', 'og:title', title); setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url); setMeta('property', 'og:image', OG_IMG); setMeta('property', 'og:locale', LOCALE[l]);
    setMeta('name', 'twitter:card', 'summary_large_image'); setMeta('name', 'twitter:title', title); setMeta('name', 'twitter:description', description); setMeta('name', 'twitter:image', OG_IMG);
    /* Données structurées */
    document.head.querySelectorAll('script[data-seo-ld]').forEach((s) => s.remove());
    const graph: object[] = [ORG, { '@type': 'WebSite', '@id': `${SITE}/#site`, url: SITE, name: 'Digilago', inLanguage: ['fr', 'ar', 'en'], publisher: { '@id': `${SITE}/#organisation` } },
      { '@type': 'WebPage', '@id': url, url, name: title, description, inLanguage: l, isPartOf: { '@id': `${SITE}/#site` }, about: { '@id': `${SITE}/#organisation` } }, ...jsonLd];
    if (crumbs) graph.push({ '@type': 'BreadcrumbList', itemListElement: crumbs.map(([name, p], i) => ({ '@type': 'ListItem', position: i + 1, name, item: SITE + (L(p) === '/' ? '/' : L(p)) })) });
    const s = document.createElement('script'); s.type = 'application/ld+json'; s.setAttribute('data-seo-ld', ''); s.text = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }); document.head.appendChild(s);
  }, [pathname, title, description, noindex]);
  return null;
};

/* FAQ au format schema.org : très bien repris par Google et par les IA */
export const faqLd = (items: { q: string; a: string }[]) => ({ '@type': 'FAQPage', mainEntity: items.map((x) => ({ '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: x.a } })) });
