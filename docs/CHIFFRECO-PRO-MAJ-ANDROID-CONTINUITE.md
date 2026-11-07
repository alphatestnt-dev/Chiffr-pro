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
- L'accueil intégré avec onglets reste uniquement sur la branche de test. La navigation principale est déplacée hors des sections de page pour rester visible quand on ouvre un onglet; les 12 onglets sont conservés.
- `app-v13.js` : calcul robuste avec valeurs négatives/invalides ramenées à zéro, refus d'un total nul, refus d'heures avec taux horaire nul, lignes sans montant positif exclues, matériaux/machines/évacuation filtrés et totaux recalculés après suppression.
- Le champ matériaux est visible et conserve la saisie libre avec autocomplétion depuis le catalogue; les anciennes valeurs fixes non vérifiées et l'ancien remplacement de champ ont été désactivés.
- Le bouton de remise à zéro vide aussi les tableaux internes `mats`, `toolsList`, `wastes`; la couche de compatibilité ne remplace plus ce vrai reset.
- Le baromètre est seulement indicatif : il ne modifie plus le taux horaire utilisé dans le devis.
- `app-v13.js` : le devis affiche la ligne main-d'œuvre uniquement si heures > 0.
- Dernière correction en date : la décomposition du devis affiche séparément prestation, main-d'œuvre, matériaux, outils, évacuation si ajoutée, déplacement, autres coûts, marge, HT et TVA si applicable. Évite d'afficher le total HT comme si c'était le seul prix de la prestation puis de réafficher les coûts en dessous.
- Marge et TVA mises à 0 par défaut ; les deux sont facultatives. Une ancienne couche runtime forçait 25 % de marge et 20 % de TVA malgré les valeurs affichées; cette règle et les prix matériaux fixes non sourcés ont été retirés. Le reset revient aussi à heures 0, marge 0, TVA 0.
- La restauration d'un ancien chiffrage restaure aussi la marge.
- `documents-v2.js` et `navigation-v2.js` sont maintenant chargés : devis enregistrés, validation du devis, conversion en facture, numéros uniques, protection contre la double conversion et impression PDF. Les lignes à 0 ne sont pas émises et aucun devis/facture n'est créé si le total est nul.
- `estimateV13()` ne renvoie plus des montants génériques disproportionnés : seules les références paysage disponibles (tonte, débroussaillage simple, taille de haie) sont proposées; quantité nulle ou prestation sans référence donne un message et aucun montant fictif.
- Validation automatisée réussie sur le commit `46ed05f10b68f24a8a497a764fc865ac117b91fd` : contrôle de syntaxe Node réussi et 12 tests Playwright réussis (`12 passed`, run https://github.com/alphatestnt-dev/Chiffr-pro/actions/runs/42427163187).
- La suite teste la navigation persistante à 12 onglets, les mises en page desktop/mobile, matériaux/machines/évacuation, retrait des postes et recalcul immédiat, devis accepté vers facture, impression, absence de documents à 0 €, taux horaire nul avec heures saisies, baromètre non intrusif, estimation particulière sans tarif inventé, références paysagères et remise à zéro des tableaux internes.
- Les tests navigateur s'exécutent sur un serveur local GitHub Actions, pas sur l'URL de production. Aucun test réel Android sur appareil n'a été effectué.
- Attention facturation : le module actuel produit un aperçu/PDF, pas une facture électronique transmise par plateforme agréée. Il manque encore des champs/mentions à compléter selon le client et le régime (adresse client, date réelle de prestation, échéance et modalités de paiement, pénalités, indemnité de recouvrement B2B, identifiants TVA ou mention de franchise, etc.). Ne pas présenter ce PDF comme une facture électronique conforme ni l'envoyer sans vérification des mentions applicables. Références officielles : https://entreprendre.service-public.fr/vosdroits/F39050 et https://www.impots.gouv.fr/professionnel/questions/partir-de-quand-suis-je-concerne-par-la-reforme-de-la-facturation . Depuis le 1er septembre 2026, toutes les entreprises doivent pouvoir recevoir des factures électroniques; les micro, petites et moyennes entreprises doivent les émettre au plus tard le 1er septembre 2027. Un PDF simple n'est pas une facture électronique au sens de la réforme.
- Aucun changement n'a été fusionné ni déployé.
- Une première bibliothèque de références paysagères est intégrée dans `pricing-reference-v1.js`, avec bouton d'application facultative : tonte (0,09 €/m² sous 1 ha, 0,07 €/m² à partir d'1 ha), débroussaillage (0,25 €/m²), taille de haie (1,80 €/m pour une face et moins de 2 m). Ces valeurs viennent d'un BPU public Cergy-Pontoise et ne sont pas des tarifs universels. La base de coût matériel inclut aussi une débroussailleuse à bras / épareuse à 25,60 €/h, référence Entraid/CUMA 2024 à 199 h/an; la source indique 15 €/h au-delà de 250 h/an et plus de 42 €/h sous 100 h/an. Les autres prestations sans référence suffisamment comparable restent à saisir librement. Aucune évacuation, broyage ou transport n'est inclus dans ces bases.

## Abonnements existants — ne pas modifier
- Particulier : 2,99 €/mois.
- Professionnel : 9,99 €/mois.
- Conserver Stripe et les Price IDs existants.
- Le code principal pointe vers le projet Supabase `ltehjhvxrnwatbqplmxr`.
- Ne pas modifier les paiements ou Price IDs pendant les corrections de chiffrage.

## Étapes suivantes
1. Faire une seconde revue manuelle des fonctions de calcul, devis, facture, impression et historique, notamment sur les cas mixtes et les modifications après calcul.
2. Compléter le formulaire facture avec les mentions légales adaptées au statut et au type de client, puis prévoir l'intégration à une plateforme agréée pour la facturation électronique.
3. Vérifier la migration et l'Edge Function 15 jours sur un environnement de test, puis préparer leur déploiement séparément.
4. Étendre prudemment les références tarifaires par métier quand une source comparable existe, sans inclure automatiquement évacuation/broyage/transport.
5. Raccorder le projet Android Studio au bon état de la branche, construire un APK de test uniquement après mise à disposition d'une URL de prévisualisation; le WebView actuel charge la production. Faire vérifier par l'utilisateur avant toute mise à jour Play Store.
