# Continuité — prochaine mise à jour ChiffrecoPro

Date de préparation : 8 novembre 2026.

## Projet et protection
- Dépôt : alphatestnt-dev/Chiffr-pro
- Branche de travail isolée : `test/accueil-integre-securise-20261107`
- Pull request de test : https://github.com/alphatestnt-dev/Chiffr-pro/pull/13
- Branche de base : `main`
- Ne jamais modifier `main), fusionner la PR ou déployer sans validation explicite de l'utilisateur.
- Objectif final : préparer une mise à jour Android testable via le projet Android Studio existant, sans casser l'application actuellement publiée.
- Le projet Android Studio local n'est pas encore fourni dans cette session ; le site/HTML et la branche GitHub sont accessibles.

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
- Le texte « 15 jours » présent dans le HTML n'implémente PAS un essai serveur réel.
- Le backend Supabase de la branche principale applique encore une limite de 3 évaluations via `cc_consume_evaluation`.
- Ne pas modifier ni déployer le backend sans clarification et validation explicite.
- Dans la dernière demande, l'utilisateur a dit « les évaluations avec un jour au lieu de trois jours », ce qui est ambigu par rapport au choix antérieur de 15 jours. Lui demander de confirmer précisément s'il parle d'un essai d'1 jour, de 15 jours, ou d'une limite d'évaluations.

## Modifications déjà présentes sur la branche de test
- L'accueil intégré avec onglets reste uniquement sur la branche de test.
- `app-v13.js` : heures de main-d'œuvre facultatives, valeur HTML à 0, taux horaire modifiable, prix unitaire de prestation ajouté, calcul direct inclut quantité × prix unitaire.
- `app-v13.js` : le devis affiche la ligne main-d'œuvre uniquement si heures > 0.
- Dernière correction en date : la décomposition du devis affiche séparément prestation, main-d'œuvre, matériaux, outils, évacuation si ajoutée, déplacement, autres coûts, marge, HT et TVA si applicable. Évite d'afficher le total HT comme si c'était le seul prix de la prestation puis de réafficher les coûts en dessous.
- Marge et TVA mises à 0 par défaut ; les deux sont facultatives.
- La restauration d'un ancien chiffrage restaure aussi la marge.
- Aucun test navigateur/Android réel n'a encore été exécuté ; ne pas prétendre que l'APK ou l'application est testé.
- Aucun changement n'a été fusionné ni déployé.
- Les prix et la bibliothèque de références ne sont pas encore intégrés : seule la méthode et le périmètre sont définis.

## Abonnements existants — ne pas modifier
- Particulier : 2,99 €/mois.
- Professionnel : 9,99 €/mois.
- Conserver Stripe et les Price IDs existants.
- Le code principal pointe vers le projet Supabase `ltehjhvxrnwatbqplmxr`.
- Ne pas modifier les paiements ou Price IDs pendant les corrections de chiffrage.

## Étapes suivantes
1. Vérifier les commits récents et les différences de la branche.
2. Faire une validation statique ciblée du calcul avec heures = 0 et autres postes non nuls ; vérifier que le devis n'affiche pas de doublons.
3. Définir la règle d'essai après clarification.
4. Constituer une première base tarifaire minimale, surtout paysagisme, sans inclure automatiquement évacuation/broyage/transport.
5. Raccorder le projet Android Studio au bon état de la branche, construire un APK de test et faire vérifier par l'utilisateur avant toute mise à jour Play Store.
