/**
 * Réglages à compléter avant la mise en ligne.
 *
 * FORM_ENDPOINT : adresse qui reçoit les demandes du formulaire (JSON, méthode POST).
 *   Formspree : créez un formulaire gratuit sur formspree.io, puis collez l'adresse du type https://formspree.io/f/abcdwxyz
 *   Tant que ce champ est vide (ou si l'envoi échoue), la demande est ouverte dans WhatsApp et un e-mail pré-rempli
 *   est proposé : aucune demande n'est perdue.
 *
 * LEGAL : informations de la société pour les mentions légales. Tout ce qui est entre crochets est à remplacer.
 */
export const FORM_ENDPOINT = '';

export const LEGAL = {
  form: '[Forme juridique, ex. SARL AU]',
  capital: '[Capital] MAD',
  address: '[Adresse du siège], El Jadida, Maroc',
  rc: '[Numéro RC]',
  ice: '[Numéro ICE]',
  if: '[Identifiant fiscal]',
  director: '[Nom du directeur de la publication]',
  host: '[Nom de l’hébergeur, adresse et site web]',
  cndp: '[Numéro de récépissé CNDP]',
  updated: { fr: '27 septembre 2026', en: 'September 27, 2026', ar: '27 سبتمبر 2026' },
};
