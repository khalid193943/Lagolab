/**
 * Trois langues : français (par défaut, à la racine), anglais (/en) et darija (/ar, de droite à gauche).
 * Le texte source est le français ; `t()` renvoie sa version dans la langue active (dictionnaire dans dict.ts).
 * La langue est lue dans l'adresse et fixée avant le rendu de la page.
 */
import { D } from './dict';
export type Lang = 'fr' | 'en' | 'ar';
export const LANGS: { id: Lang; label: string; short: string }[] = [{ id: 'fr', label: 'Français', short: 'FR' }, { id: 'en', label: 'English', short: 'EN' }, { id: 'ar', label: 'الدارجة', short: 'دارجة' }];
let cur: Lang = 'fr';
export const setLang = (l: Lang) => { cur = l; };
export const lang = () => cur;
export const langFromPath = (p: string): Lang => (p === '/en' || p.startsWith('/en/') ? 'en' : p === '/ar' || p.startsWith('/ar/') ? 'ar' : 'fr');
export const stripLang = (p: string) => p.replace(/^\/(en|ar)(?=\/|$)/, '') || '/';
const missing = new Set<string>();
export const t = (s: string): string => {
  if (cur === 'fr' || !s) return s;
  const e = D[s];
  if (!e) { if (!missing.has(s)) { missing.add(s); console.warn('[i18n] ' + s); } return s; }
  return cur === 'en' ? e[0] : e[1];
};
/* Texte avec variables : on écrit les trois versions à l'endroit même */
export const tv = (o: { fr: string; en: string; ar: string }) => o[cur];
/* Adresse interne dans la langue active */
export const L = (p: string, l: Lang = cur) => (l === 'fr' ? p : `/${l}${p === '/' ? '' : p}`);
