# Diagnostic de parité Android / PWA

## Ce qui est réellement commun

- `MainActivity.java` charge le site distant `https://chiffreco-pro.fr/`.
- Le PWA et Android utilisent donc les mêmes fichiers web déployés; le wrapper Android n'a pas de deuxième moteur de calcul local.
- La différence de comportement doit venir du build installé qui ne récupère pas la même version, du cache / Service Worker, du moteur WebView, ou d'une course au chargement des modules.

## Défauts de démarrage trouvés dans le code web

1. **Chargement en double de `runtime-stability.js`.** La page charge déjà `runtime-stability.js?v=...`, mais `pwa.js` recherchait uniquement le chemin exact `./runtime-stability.js`. La requête avec paramètre de version ne correspondait pas au sélecteur, et le fichier était réinjecté.
2. **Marge réinitialisée pendant le démarrage.** `runtime-stability.js` réappliquait 25 % à 150 ms puis 700 ms après le chargement, même si l'utilisateur avait commencé à saisir une autre marge. Sur des appareils plus lents, cela peut modifier le total après la saisie.
3. **Le baromètre PRO faisait baisser le coefficient à certains seuils.** Il ajoutait 8 % quand la quantité était inférieure à 3, puis supprimait brutalement cette majoration à 3 unités. Passer de 2 à 3 ou 4 pouvait donc réduire le total. Il remplaçait aussi temporairement le taux horaire visible pendant le calcul, puis le restaurait : le total et la ligne de main-d’œuvre du devis pouvaient ne plus correspondre.
4. **Course de chargement pour le devis.** `pwa.js` chargeait les modules documentaires de manière asynchrone après `DOMContentLoaded`; `documents-v2.js` ne remplaçait `window.makeQuote` qu'après un délai supplémentaire de 80 ms. Pendant cette fenêtre, le bouton pouvait appeler l'ancien générateur de devis défini dans `app-v13.js`, produisant un résultat différent.

Ces quatre points sont corrigés dans cette branche de diagnostic : scripts critiques chargés une seule fois avant interaction, gestionnaire de devis installé dès le chargement du module, et marge manuelle préservée.

## Point de logique à ne pas confondre

Dans `app-v13.js`, le total professionnel est calculé avec les heures, le taux horaire, le coefficient du baromètre, les matériaux, les outils, les déchets, le déplacement et les autres coûts. Le champ `qty` / `unit` est enregistré et affiché dans le devis, mais n'entre pas directement dans la formule du total. Cela explique pourquoi modifier seulement la quantité du chiffrage PRO ne recalcule pas le prix. Ce n'est pas, à lui seul, une formule qui fait baisser le prix; il faut conserver la distinction entre quantité de chantier et nombre total d'heures avant de changer cette formule.

L'estimation particulier `estimateV13()`, elle, est proportionnelle à la quantité `pq` lorsque les autres paramètres restent identiques. Un passage de 1 à 6 ne doit donc pas réduire sa fourchette.

## Tests ajoutés

- Même scénario numérique sur la source web de cette branche en affichage desktop et mobile.
- Vérification que les scripts runtime et devis ne sont présents qu'une seule fois et que les modules de devis sont prêts avant interaction.
- Test de monotonie de l'estimation particulier quand la quantité passe de 1 à 6.
- Test instrumenté dans un vrai Android WebView d'émulateur, servi avec exactement les fichiers de cette branche, pour vérifier 48 € de coût, 64 € HT, 76,80 € TTC et la présence des résultats.

Aucun changement n'est fusionné dans `main` et aucun AAB n'est publié par cette branche.
