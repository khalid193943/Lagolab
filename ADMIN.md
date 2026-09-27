# Admin Digilago : mise en service

L'admin est accessible sur **/admin** (non indexé par Google). Deux modes :

- **Démo** (par défaut) : tout fonctionne dans le navigateur, avec des données d'exemple. Parfait pour découvrir.
- **Production** : les données vivent dans Supabase, les demandes du site arrivent en direct, WhatsApp et les e-mails partent vraiment, les automatisations tournent 24 h/24.

Compter environ une heure pour tout brancher, hors délais de validation de Meta.

---

## 1. Supabase (base de données, connexion, fonctions serveur)

1. Créez un projet sur https://supabase.com (région Europe, la plus proche du Maroc).
2. **SQL Editor** : collez et exécutez `supabase/schema.sql`.
3. **Authentication > Users > Add user** : créez votre compte (e-mail + mot de passe). Copiez son UUID, puis dans SQL Editor :
   `insert into public.admins (user_id) values ('VOTRE-UUID');`
4. Installez l'outil Supabase (`npm i -g supabase`), puis dans le dossier du projet :
   ```
   supabase login
   supabase link --project-ref <PROJET>
   supabase functions deploy lead --no-verify-jwt
   supabase functions deploy subscribe --no-verify-jwt
   supabase functions deploy unsubscribe --no-verify-jwt
   supabase functions deploy whatsapp-webhook --no-verify-jwt
   supabase functions deploy whatsapp-send
   supabase functions deploy email-send
   supabase functions deploy ai
   supabase functions deploy cron --no-verify-jwt
   ```
5. **Secrets** (Project Settings > Edge Functions > Secrets, ou `supabase secrets set NOM=valeur`) :

| Secret | Rôle |
|---|---|
| `SITE_URL` | `https://digilago.ma` |
| `SITE_ORIGIN` | `https://digilago.ma` (limite les appels au site) |
| `OWNER_EMAIL` | votre e-mail : alerte à chaque demande + résumé du matin |
| `RESEND_API_KEY` | clé Resend pour envoyer les e-mails |
| `MAIL_FROM` | `Digilago <contact@digilago.ma>` |
| `WA_TOKEN` | jeton permanent de l'utilisateur système Meta (voir étape 2) |
| `WA_VERIFY_TOKEN` | mot de passe de votre choix pour le webhook |
| `WA_APP_SECRET` | « Clé secrète de l'app » Meta (vérifie que les messages viennent bien de Meta) |
| `ANTHROPIC_API_KEY` | clé API Claude pour l'assistant IA |
| `ANTHROPIC_MODEL` | facultatif, `claude-sonnet-5` par défaut |
| `CRON_SECRET` | mot de passe de votre choix pour la tâche quotidienne |
| `UNSUB_SECRET` | mot de passe de votre choix pour les liens de désinscription |

6. **Tâche quotidienne** : activez les extensions `pg_cron` et `pg_net` (Database > Extensions), puis exécutez le bloc commenté à la fin de `schema.sql` (en remplaçant `<PROJET>` et `<CRON_SECRET>`).

## 2. WhatsApp Cloud API (vos deux numéros)

1. https://business.facebook.com : créez ou ouvrez votre **Business Manager**, puis faites vérifier l'entreprise.
2. https://developers.facebook.com : créez une app de type **Business**, ajoutez le produit **WhatsApp**.
3. **WhatsApp > Configuration de l'API** : ajoutez vos **deux numéros**. Chaque numéro doit recevoir un SMS ou un appel de vérification. Un numéro déjà utilisé dans l'application WhatsApp doit d'abord en être retiré, ou migré.
4. Notez le **Phone number ID** de chaque numéro, puis collez-le dans l'admin : WhatsApp > Numéros.
5. **Utilisateur système** (Business Manager > Utilisateurs > Utilisateurs système) : créez-en un, donnez-lui accès à l'app et au compte WhatsApp, puis générez un **jeton permanent** avec les permissions `whatsapp_business_messaging` et `whatsapp_business_management`. Ce jeton va dans le secret `WA_TOKEN`.
6. **Webhook** (WhatsApp > Configuration) :
   - URL : `https://<PROJET>.supabase.co/functions/v1/whatsapp-webhook`
   - Jeton de vérification : la valeur de `WA_VERIFY_TOKEN`
   - Abonnez le champ `messages`.
7. **Modèles de messages** (WhatsApp Manager > Modèles) : pour écrire en premier à quelqu'un, ou plus de 24 h après son dernier message, Meta impose un modèle approuvé (validation en quelques minutes à quelques heures). Créez chez Meta les modèles « Accusé de réception », « Relance facture », etc., avec les mêmes textes que dans l'admin.

Règles à respecter : n'écrivez qu'aux personnes qui vous ont contacté ou ont accepté d'être contactées, sinon Meta peut limiter vos numéros. Les conversations sont facturées par Meta selon leur catégorie (voir la grille tarifaire Meta pour le Maroc).

## 3. E-mails (Resend)

1. Créez un compte sur https://resend.com et ajoutez le domaine `digilago.ma`.
2. Ajoutez chez votre registrar les enregistrements DNS indiqués (SPF, DKIM), puis attendez la validation.
3. Créez une clé API et mettez-la dans le secret `RESEND_API_KEY`.

## 4. Brancher le site et l'admin

Créez un fichier `.env` à la racine du projet :
```
VITE_SUPABASE_URL=https://<PROJET>.supabase.co
VITE_SUPABASE_ANON_KEY=<clé anon publique>
```
Puis `npm run build:seo` et remettez le contenu de `dist/` en ligne. À partir de là :
- les formulaires, le formulaire rapide, le simulateur et la newsletter du site arrivent dans l'admin ;
- l'admin demande votre e-mail et votre mot de passe ;
- les automatisations tournent sur le serveur.

La clé « anon » peut être publique : la base est fermée par RLS, et le site n'écrit que par les fonctions `lead` et `subscribe`.

## 5. Ce que fait chaque fonction serveur

| Fonction | Rôle |
|---|---|
| `lead` | Reçoit une demande du site, l'enregistre, vous alerte par e-mail, lance les automatisations (accusé WhatsApp, e-mail…). Filtre les robots et limite le nombre de demandes par adresse IP. |
| `subscribe` / `unsubscribe` | Inscription à la newsletter (+ e-mail de bienvenue) et désinscription en un clic (lien signé). |
| `whatsapp-webhook` | Reçoit les messages de vos deux numéros. Répond automatiquement hors horaires (lun–sam, 9 h–19 h, heure du Maroc) et sur mots-clés. Crée une demande au premier message reçu sur le numéro « Commercial ». Met à jour les statuts (livré, lu). |
| `whatsapp-send` | Envoie les réponses, relances et envois groupés depuis l'admin (réservé aux administrateurs). |
| `email-send` | Envoie un e-mail ou une campagne newsletter, avec lien de désinscription. |
| `ai` | Assistant IA : Claude répond à partir d'un résumé chiffré de vos données. |
| `cron` | Chaque matin : relance les factures en retard (J+3 puis J+10) et vous envoie le résumé du jour. |

## 6. Sécurité et bonnes pratiques

- Les jetons WhatsApp, Resend et Claude restent sur le serveur : ils ne sont jamais dans le navigateur.
- Sauvegardez régulièrement vos données (Paramètres > Télécharger une sauvegarde). Supabase fait aussi des sauvegardes quotidiennes.
- Factures : vérifiez vos mentions légales (ICE, IF, RC, TVA) dans Paramètres, et faites valider votre modèle de facture par votre comptable.

## 7. Devis intelligent

Menu **Commercial > Devis intelligent**, ou le bouton du même nom en haut de l'écran, sur une demande ou dans Factures.

1. Choisissez une demande ou un client existant, ou tapez simplement le nom de l'entreprise.
2. **Tapez le métier** (« dentiste », « riad », « padel », « caftans », « plombier »…). Le profil est reconnu parmi 12 familles, avec des centaines de variantes en français et en arabe.
3. Le moteur propose ce qu'il faut, avec **l'argument à dire au client** pour chaque élément :
   - la base du projet ;
   - l'indispensable ;
   - le recommandé ;
   - les options ;
   - l'abonnement mensuel.
4. **Posez les questions affichées** (Oui / Non). Les éléments s'ajoutent ou se retirent tout seuls.
5. **Tapez vos notes d'appel.** Les mots-clés sont détectés (« livraison », « touristes », « avis », « paiement »…) et les bons éléments sont ajoutés.
6. La ville compte aussi : ville touristique → version anglaise ; grande ville → suivi SEO mensuel.
7. Trois formules sont calculées (Essentiel, Recommandé, Premium), avec le total, la remise, la TVA, le délai estimé, l'échéancier et une alerte si le budget annoncé est dépassé.
8. **Générer le devis** : le client est créé si besoin, le devis numéroté apparaît dans Factures (PDF prêt) et la demande passe en « Devis envoyé ». Vous pouvez envoyer la proposition sur WhatsApp ou par e-mail en un clic.

Les tarifs de départ se modifient dans **Tarifs**. En production, le bouton **Affiner avec l'IA** demande à Claude de compléter la proposition à partir du catalogue.
