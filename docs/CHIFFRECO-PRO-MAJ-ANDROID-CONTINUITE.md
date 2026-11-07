# Continuité — prochaine mise à jour ChiffrecoPro

Date de préparation : 8 novembre 2026.

## Projet et protection
- Dépôt : alphatestnt-dev/Chiffr-pro
- Branche de travail isolée : `test/accueil-integre-securise-20261107`
- Pull request de test : https://github.com/alphatestnt-dev/Chiffr-pro/pull/13
- Branche de base : `main`
- Ne jamais modifier `main`, fusionner la PR ou déployer sans validation explicite de l'utilisateur.
- Objectif final : préparer une mise à jour Android testable via le projet Android Studio existant, sans casser l'application actuellement publiée.
- Le projet Android Studio local n'est pas encore fourni dans cette session ; le site/HTML et la branche GitHub sont accessibles.
- Préparation Android sur la branche : `versionCode = 3`, `versionName = 1.0.2`; le workflow Android accepte maintenant la branche de test et produit un APK debug + AAB release non signé.
- Attention : `MainActivity.java` charge actuellement `https://chiffreco-pro.fr/` en direct. Un APK généré depuis cette branche affichera donc encore le site en production tant que les fichiers web de test ne sont pas déployés sur une URL de prévisualisation. Ne pas distribuer cet APK comme test fonctionnel des nouvelles modifications web.

## Priorités convenues avec l'utilisateur

### 1. Main-d'œuvre — priorité absolue
- Heures estimées à zéro par défaut.
- La main-d'œuvre est facultative et ne doit jamais être ajoutée automatiquement.
- Si les heures sont à zéro, cela ne doit pas effacer les autres postes ni annuler un total déjà calculé à partir d'un prix de prestation, matériaux, machines, déplacement ou autres coûts.
- Taux horaire librement modifiable (16 €/h peut rester une valeur de départ, sans contrainte).
- Sur le devis, afficher la main-d'œuvre uniquement si des heures sont réellement saisies.
- Ne pas inventer un montant si absolument aucun prix ni coût n'est renseigné.

### 2. Marges et TVA
- Marge et TVA facultatives, sans valeur imposée par défaut.
- L'artisan choisit librement de les renseigner.
- Préserver les autres calculs et fonctionnalités.

### 3. Base de chiffrage
- Construire une base minimale, prudente et modifiable, à partir de références professionnelles accessibles.
- Distinguer les prestations selon le métier et la nature réelle du travail.
- Pour les espaces verts, distinguer au minimum : tonte, débroussaillage, taille de haie, élagage, abattage, dessouchage et plantation.
- La prestation, l'unité, l'outil/matériel et l'état du chantier doivent aider à produire une base cohérente ; aucun prix ne doit être présenté comme obligatoire.
- Exemples de critères simples : débroussaillage selon surface, hauteur et densité/ronces ; taille de haie selon longueur et hauteur ; élagage selon arbre et accès.
- Évacuation, broyage, transport et autres prestations annexes doivent rester séparés, facultatifs et ajoutés seulement si le client les demande.
- Si aucune référence fiable n'est trouvée pour un métier/prestation, laisser le tarif à saisir par l'artisan plutôt que d'inventer.
- Ne pas transformer le logiciel en formulaire technique compliqué.
- Les sources identifiées incluent UNEP, BHP/Bordereau du paysage, Réseau Haies France/CUMA, Metrebat, Batiprix, guides CUMA et tarifs publiés de marché. Vérifier les unités, dates, inclusions/exclusions avant de retenir un montant.

### 4. Essai / évaluations
- Historique produit : l'utilisateur avait précédemment choisi 15 jours d'essai gratuit plutôt que 3 évaluations gratuites.
- Choix confirmé le 8 novembre 2026 : 15 jours d'essai gratuit, sans carte bancaire au démarrage.
- La logique serveur de 15 jours est maintenant préparée dans `supabase/functions/commercialisation-api/index.ts` et `supabase/migrations/20261108000000_trial_15_days.sql` sur la branche de test uniquement.
- La migration ajoute `trial_started_at` et `trial_ends_at`; les comptes existants reçoivent une période de transition de 15 jours à partir de l'application de la migration.
- L'essai commence à la création du compte commercial `cc_accounts` (premier état d'abonnement après connexion), et non à la simple visite du site.
- Le RPC serveur autorise l'accès pendant l'essai ou avec abonnement actif/trialing; il n'incrémente plus les 3 évaluations. Après expiration, il renvoie `TRIAL_EXPIRED`.
- `auth-v1.js` affiche la date de fin et les jours restants, et propose les abonnements existants.
- Important : ces fichiers ne sont PAS déployés dans Supabase. La migration et l'Edge Function doivent être testées puis déployées dans le bon ordre, après validation explicite. Ne pas modifier les Price IDs Stripe.

## Modifications déjà présentes sur la branche de test
- L'accueil intégré avec onglets reste uniquement sur la branche de test.
- `app-v13.js` : heures de main-d'œuvre facultatives, valeur HTML à 0, taux horaire modifiable, prix unitaire de prestation ajouté, calcul direct inclut quantité × prix unitaire.
- `app-v13.js` : le devis affiche la ligne main-d'œuvre uniquement si heures > 0.
- Dernière correction en date : la décomposition du devis affiche séparément prestation, main-d'œuvre, matériaux, outils, évacuation si ajoutée, déplacement, autres coûts, marge, HT et TVA si applicable. Évite d'afficher le total HT comme si c'était le seul prix de la prestation puis de réafficher les coûts en dessous.
- Marge et TVA mises à 0 par défaut ; les deux sont facultatives.
- La restauration d'un ancien chiffrage restaure aussi la marge.
- Un test Playwright de non-régression pour 0 heure de main-d'œuvre a été ajouté à `tests/smoke.spec.js`; le workflow smoke est configuré pour tourner aussi sur la branche de test. Les runs GitHub sont en cours au moment de cette mise à jour.
- Aucun test navigateur/Android local ni APK n'a encore été validé ; ne pas prétendre que l'application Android est testée.
- Aucun changement n'a été fusionné ni déployé.
- Une première bibliothèque de références paysagères est intégrée dans `pricing-reference-v1.js`, avec bouton d'application facultative : tonte (0,09 €/m² pour moins d'1 ha), débroussaillage (0,25 €/m²), taille de haie (1,80 €/m pour une face et moins de 2 m). Ces valeurs viennent d'un BPU public Cergy-Pontoise et ne sont pas des tarifs universels. Les autres prestations sans référence suffisamment comparable restent à saisir librement. Aucune évacuation, broyage ou transport n'est inclus dans ces bases.

## Abonnements existants — ne pas modifier
- Particulier : 2,99 €/mois.
- Professionnel : 9,99 €/mois.
- Conserver Stripe et les Price IDs existants.
- Le code principal pointe vers le projet Supabase `ltehjhvxrnwatbqplmxr`.
- Ne pas modifier les paiements ou Price IDs pendant les corrections de chiffrage.

## Étapes suivantes
1. Vérifier les commits récents et les différences de la branche.
2. Faire une validation statique ciblée du calcul avec heures = 0 et autres postes non nuls ; vérifier que le devis n'affiche pas de doublons.
3. Vérifier la migration et l'Edge Function 15 jours sur un environnement de test, puis préparer leur déploiement séparément.
4. Étendre prudemment les références tarifaires par métier quand une source comparable existe, sans inclure automatiquement évacuation/broyage/transport.
5. Raccorder le projet Android Studio au bon état de la branche, construire un APK de test et faire vérifier par l'utilisateur avant toute mise à jour Play Store.
