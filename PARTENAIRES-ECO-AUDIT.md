# Chiffr’EcoPro — Audit partenaires écologiques

## Objet

Document de travail dédié exclusivement aux partenaires, affiliations, API, données externes et autorisations liées à l’écologie. Il ne modifie aucune fonctionnalité de Chiffr’EcoPro et ne concerne pas la page d’accueil validée.

Date de l’audit : 13 septembre 2026.

## 1. Ce qui est réellement présent dans le dépôt

### A. Partenaires écologiques déjà affichés

Le fichier `partner-v1.js` contient actuellement quatre interlocuteurs potentiels : Veolia, SUEZ, Citeo et ADEME. Le module indique explicitement qu’aucune affiliation n’est automatique et qu’une autorisation écrite doit être obtenue avant d’afficher une offre, une remise, un logo, un statut de partenaire ou une affiliation. Les statuts sont locaux et ne constituent pas une preuve d’accord externe.

- **Veolia** — contact officiel actuellement configuré : `https://www.veolia.fr/nous-contacter`
- **SUEZ** — contact officiel actuellement configuré : `https://www.suez.com/fr/contact/`
- **Citeo** — contact officiel actuellement configuré : `https://www.citeo.com/contacts/`
- **ADEME** — contact officiel actuellement configuré : `https://www.ademe.fr/contact/`

À ce jour, le dépôt ne contient aucune preuve d’acceptation, aucun contrat partenaire, aucune clé API fournie par ces organismes et aucun programme d’affiliation confirmé.

### B. Liens externes actuellement utilisés pour les aides

`app-v13.js` renvoie vers quatre pages officielles de l’ADEME :

1. Études d’écoconception des produits et des services.
2. Investissements d’écoconception pour améliorer la performance environnementale.
3. Soutien aux investissements pour le réemploi-réutilisation et la réparation hors emballages.
4. Catalogue général des aides financières ADEME.

Le code ne consomme actuellement aucune API ADEME et ne récupère pas automatiquement leurs contenus. Il fournit seulement un lien vers la source officielle.

### C. Dispositifs externes seulement prévus, mais non raccordés

Le module `eco-lever-v1.js` mentionne comme pistes futures les dispositifs publics, les CEE, les prêts, les partenaires et les économies propres. Aucun fournisseur CEE, banque, organisme de financement ou API précis n’est actuellement déclaré dans le dépôt.

Conclusion : aucune demande d’autorisation spécifique ne peut être envoyée pour un « partenaire CEE » tant qu’un acteur précis n’est pas choisi.

## 2. Vérification officielle au 13 septembre 2026

### Veolia

Veolia dispose bien d’un processus officiel de relation fournisseurs et d’un dispositif de prise de contact. La page officielle de contact indique qu’une demande concernant les offres de recyclage et valorisation des déchets doit passer par les services dédiés ; elle précise également que le formulaire générique présenté sur cette page concerne notamment les demandes de partenariat ou sponsoring de certaines structures. La page fournisseurs décrit un processus de référencement, d’évaluation et de respect d’une charte fournisseurs.

**Conclusion pour Chiffr’EcoPro :** nous ne devons pas présenter Veolia comme « partenaire », « affilié » ou « fournisseur » sans accord. La demande doit demander explicitement au groupe de rediriger Chiffr’EcoPro vers le bon interlocuteur pour un partenariat numérique, une mise en relation commerciale, un programme de recommandation/affiliation éventuel, un échange de données ou une API si un dispositif existe.

### SUEZ

SUEZ possède un formulaire officiel de contact couvrant notamment les demandes liées aux déchets. Le groupe indique par ailleurs développer des partenariats de long terme, notamment avec des acteurs locaux de l’économie circulaire et de l’ESS, et dispose d’une politique d’achats responsables encadrant ses relations fournisseurs.

**Conclusion pour Chiffr’EcoPro :** aucune affiliation ou API commerciale n’est considérée comme acquise. La bonne démarche est une demande de partenariat numérique et de référencement, avec question explicite sur l’existence d’un programme partenaire, d’un flux de données/API, d’un mécanisme d’orientation de clients ou d’une offre de collaboration.

### Citeo

Citeo présente officiellement une activité de partenariats autour de la réduction, du réemploi, du recyclage et de l’économie circulaire, avec des partenaires de profils variés. La page officielle « Partenariats » publie un contact central (`contact@citeo.com`).

**Conclusion pour Chiffr’EcoPro :** Citeo est un candidat particulièrement cohérent pour une demande de collaboration sur l’information, le tri, le réemploi et l’économie circulaire. Aucun programme d’affiliation commerciale n’est présumé. Il faut demander les conditions réelles, l’usage autorisé de la marque, les données éventuellement accessibles et l’existence éventuelle d’un cadre API/partenaire.

### ADEME

L’ADEME n’est pas à traiter comme une affiliation commerciale classique. Son site officiel permet aux professionnels de contacter l’agence via AGIR pour la transition écologique. L’ADEME publie aussi des données ouvertes ; certains jeux de données sont disponibles sous Licence Ouverte, avec des obligations de paternité et de source.

Les conditions officielles de réutilisation de certains contenus ADEME indiquent notamment que l’usage des logos, marques, photographies et autres éléments iconographiques nécessite un accord exprès. Elles interdisent également une présentation pouvant laisser croire à un soutien, parrainage, agrément ou cautionnement de l’ADEME sans autorisation.

**Conclusion pour Chiffr’EcoPro :** ne jamais afficher « avec le soutien de l’ADEME », « partenaire ADEME », logo ADEME ou autre formulation équivalente sans accord écrit. Pour toute future intégration de données/API, respecter la licence propre au jeu de données concerné et, compte tenu du caractère commercial de Chiffr’EcoPro, demander en amont une validation lorsque l’usage dépasse un simple lien vers la source officielle.

## 3. Candidats de données/API à étudier plus tard — non intégrés aujourd’hui

### ADEME — « Que faire de mes objets & déchets »

L’ADEME met à disposition un jeu de données ouvert recensant des solutions de réemploi, réparation, tri et gestion des déchets sur le territoire. Le dispositif officiel demande de signaler la réutilisation et d’afficher la source, la date de mise à jour et un lien vers le site.

**Statut Chiffr’EcoPro :** candidat futur uniquement. Aucun raccordement n’est installé dans le dépôt actuel. Avant utilisation, il faudra vérifier la licence du jeu au moment de l’intégration, respecter les obligations de source/paternité et confirmer avec l’ADEME si le projet envisagé nécessite une démarche complémentaire.

### CEE

Le projet mentionne les CEE comme piste de financement possible, mais aucun obligé, délégataire, opérateur ou API n’est actuellement choisi.

**Statut :** recherche future, aucun partenaire CEE déclaré, aucune affiliation existante.

### Autres financeurs / banques / fournisseurs

Le projet mentionne également des prêts et contributions partenaires comme catégories de simulation. Aucun établissement bancaire, assureur, fournisseur ou organisme de financement précis n’est aujourd’hui intégré.

**Statut :** aucune autorisation à demander tant qu’un acteur concret n’est pas sélectionné.

## 4. Demandes d’autorisation à utiliser

### Demande Veolia — partenariat numérique / orientation / données

**Objet : Demande d’étude de partenariat numérique — Chiffr’EcoPro / Veolia**

Bonjour,

Nous développons Chiffr’EcoPro, une application française de chiffrage destinée aux professionnels et aux particuliers. Une partie du service aide les utilisateurs à mieux prendre en compte le tri, la séparation des flux, le réemploi, la valorisation et l’évacuation des déchets.

Nous souhaiterions savoir si Veolia propose un cadre permettant une collaboration avec Chiffr’EcoPro : partenariat numérique, référencement, orientation vers vos offres déchets et valorisation, programme de recommandation ou d’affiliation, accès à des données, API ou autre dispositif de coopération.

Nous demandons également, le cas échéant, les règles d’utilisation de vos noms, marques et logos ainsi que les conditions commerciales ou techniques applicables.

Aucune affiliation, remise, offre, logo ou déclaration de partenariat ne sera présentée comme officielle avant votre accord écrit.

Pourriez-vous nous indiquer le bon interlocuteur et le dispositif approprié pour étudier cette demande ?

Cordialement,
L’équipe Chiffr’EcoPro

### Demande SUEZ — partenariat numérique / déchets / données

**Objet : Demande de partenariat numérique — Chiffr’EcoPro / SUEZ**

Bonjour,

Nous développons Chiffr’EcoPro, une application française de chiffrage pour professionnels et particuliers intégrant une démarche volontaire de réduction, tri, réemploi et valorisation des déchets.

Nous souhaitons étudier avec SUEZ la possibilité d’un partenariat numérique portant, selon vos dispositifs existants, sur l’orientation des utilisateurs vers les services SUEZ, le référencement d’offres, la mise à disposition de données, une API, un programme de recommandation/partenaire ou tout autre mécanisme autorisé.

Nous souhaitons connaître les conditions de partenariat, les éventuelles conditions techniques et commerciales, ainsi que les règles d’utilisation du nom et de la marque SUEZ.

Aucune affiliation ou partenariat ne sera déclaré sans validation écrite de SUEZ.

Merci de nous orienter vers le service compétent.

Cordialement,
L’équipe Chiffr’EcoPro

### Demande Citeo — économie circulaire / données / partenariat

**Objet : Proposition de collaboration économie circulaire — Chiffr’EcoPro / Citeo**

Bonjour,

Chiffr’EcoPro est une application française de chiffrage destinée aux professionnels et aux particuliers. Elle intègre des informations et leviers volontaires autour du tri, du réemploi, du recyclage et de la valorisation.

Compte tenu des travaux et partenariats de Citeo dans l’économie circulaire, nous souhaitons savoir si Citeo serait disposé à étudier une collaboration avec Chiffr’EcoPro, notamment pour :

- orienter les utilisateurs vers des informations ou services officiels de Citeo ;
- étudier l’utilisation de données ouvertes ou de référentiels, lorsque cela est autorisé ;
- envisager une intégration API ou un autre dispositif technique si Citeo en propose un ;
- étudier, le cas échéant, un programme de partenariat ou de mise en relation.

Nous sollicitons également vos conditions concernant l’usage de la marque, des visuels, des contenus et la présentation éventuelle de Citeo dans Chiffr’EcoPro.

Aucun partenariat, soutien, affiliation, remise ou avantage ne sera présenté comme acquis sans accord écrit.

Cordialement,
L’équipe Chiffr’EcoPro

### Demande ADEME — autorisation de collaboration / données / marque

**Objet : Demande d’échange et d’autorisation d’usage — Chiffr’EcoPro / ADEME**

Bonjour,

Nous développons Chiffr’EcoPro, une application française destinée aux professionnels et aux particuliers, qui propose notamment des outils de chiffrage, de gestion des déchets, de réemploi, de valorisation et d’orientation vers des dispositifs de transition écologique.

Nous souhaitons solliciter l’ADEME afin de connaître le cadre autorisé pour :

1. référencer des pages officielles ADEME par liens directs ;
2. utiliser, lorsque la licence le permet, certains jeux de données open data ADEME ;
3. envisager à terme une utilisation d’API ou de jeux de données liés à l’économie circulaire, aux acteurs du réemploi/tri ou aux aides ;
4. savoir si une autorisation spécifique est nécessaire pour toute utilisation de contenus, visuels, logos ou signes distinctifs ADEME dans une application commerciale ;
5. étudier, si l’ADEME le souhaite, une collaboration institutionnelle ou de diffusion d’informations officielles.

Nous ne souhaitons pas créer d’ambiguïté sur l’origine ou le soutien du service : sans accord exprès, Chiffr’EcoPro ne présentera pas l’ADEME comme partenaire, sponsor, certificateur, financeur ou soutien du projet et n’utilisera pas son logo à cette fin.

Nous vous remercions de nous indiquer le bon interlocuteur, les licences et conditions à respecter et, lorsque nécessaire, la procédure d’autorisation adaptée.

Cordialement,
L’équipe Chiffr’EcoPro

## 5. Règle avant toute intégration technique

Aucune API, clé, scraping, import automatique, synchronisation, logo, offre, remise ou affiliation ne doit être ajoutée à Chiffr’EcoPro sur la base de ce document seul.

Ordre obligatoire :

1. contact officiel ;
2. réponse du partenaire ;
3. conditions techniques et juridiques écrites ;
4. accord/contrat/licence si nécessaire ;
5. conservation de la preuve de l’autorisation ;
6. seulement ensuite, intégration technique et affichage public.

En l’absence de réponse positive, le partenaire reste « À contacter » ou « En attente d’autorisation ».

## 6. État de décision

| Interlocuteur | Type demandé | Accord constaté | API constatée dans le projet | Action |
|---|---|---:|---:|---|
| Veolia | partenariat / orientation / données | Non | Non | Envoyer la demande |
| SUEZ | partenariat / orientation / données | Non | Non | Envoyer la demande |
| Citeo | partenariat / économie circulaire / données | Non | Non | Envoyer la demande |
| ADEME | autorisation / open data / collaboration institutionnelle | Non | Non | Demander le cadre officiel |
| CEE | futur partenaire à choisir | Non | Non | Ne pas intégrer avant sélection et validation |
| Autres financeurs | futur, non nommés | Non | Non | Ne rien intégrer pour l’instant |

**Important :** ce fichier ne constitue pas une preuve de partenariat. Il constitue uniquement l’audit et les demandes préparatoires officielles destinées à obtenir les autorisations nécessaires.
