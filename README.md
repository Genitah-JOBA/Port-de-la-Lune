# Port de la Lune — Chauffeur privé Bordeaux

> **Entreprise fictive — site de démonstration.** Samir Haddad, le numéro de registre VTC, le SIRET, le téléphone et le domaine sont inventés. Le pied de page de chaque page le rappelle.

Site vitrine multi-pages pour un chauffeur VTC indépendant à Bordeaux. HTML/CSS/JS vanilla, aucun build, aucun framework.

## Structure

```
index.html                  Accueil — cible « chauffeur VTC Bordeaux »
aeroport-gare.html          Transferts aéroport de Mérignac & gare Saint-Jean
vignobles-evenements.html   Vignobles (Saint-Émilion, Médoc, Pessac-Léognan), mariages, soirées
tarifs.html                 Grille de prix fixes, mise à disposition, majorations, entreprises, paiement
contact.html                Formulaire de réservation / devis + contact direct
mentions-legales.html       Éditeur, registre VTC, hébergeur, RGPD (noindex, follow)
assets/css/style.css        Feuille de style unique (tokens CSS en tête de fichier)
assets/js/main.js           Menu mobile, simulateur de prix, révélations au scroll, formulaire
assets/img/                 Images WebP, image Open Graph (JPG 1200×630), favicon SVG
robots.txt, sitemap.xml
```

L'en-tête, le pied de page et la barre d'appel mobile sont dupliqués à l'identique dans chaque page (HTML statique).

## Direction graphique : « Moderne & dynamique » (v2)

Refonte visuelle complète. Le contenu, la structure, le SEO et les photos n'ont pas changé. L'idée : la clarté d'une application de mobilité (réserver vite, voir le prix tout de suite), avec le côté humain d'un chauffeur indépendant.

- **Palette** : fond blanc `#FFFFFF` et gris très clair `#F4F6FA` pour l'alternance des sections et les cartes. Texte encre `#0E1525`, texte secondaire `#5B6475`. **Une seule couleur vive : bleu électrique `#2F5BFF`** (survol `#1E44E0`, teinte claire `#EAF0FF` pour les pastilles), utilisée pour les CTA, les liens, les icônes et les prix. Le sombre est réservé au CTA final et au pied de page. Contrastes AA vérifiés (texte blanc sur `#2F5BFF` : 5:1).
- **Typographie** : **Plus Jakarta Sans** (400–800) pour tout le site, titres en casse normale avec un interlettrage légèrement négatif. Aucune police mono : les prix et les horaires utilisent `font-variant-numeric: tabular-nums`.
- **Formes** : cartes arrondies (20–24 px), boutons en pilule, ombres douces et diffuses, pastilles arrondies (« Prix fixe », « Attente offerte 45 min », « ★ 4,9 »), icônes au trait arrondi en bleu. Logo : croissant blanc dans un carré arrondi bleu.
- **Élément central : le simulateur de prix** (accueil, dans le hero). Il reprend la forme d'une carte de réservation d'application.
  - Champs : départ et arrivée (trajets fréquents), bouton pour inverser les deux, date, heure, nombre de passagers.
  - Résultat instantané : prix fixe et durée estimée, tirés de la grille de `tarifs.html`. La majoration de nuit (22 h–6 h, +15 %) ou du dimanche (+10 %) s'affiche quand elle s'applique ; elles ne se cumulent pas.
  - Un trajet hors grille ou 5 passagers et plus donnent « Sur devis ».
  - « Réserver ce trajet » ouvre WhatsApp avec un message pré-rempli (trajet, date, heure, passagers, prix). Un lien secondaire mène au formulaire détaillé.
  - Accessibilité : labels visibles, `aria-live` sur le résultat, utilisable au clavier.
  - Sans JavaScript, la carte affiche la liste des prix fixes.
- **Trajets fréquents** : cartes arrondies cliquables qui pré-remplissent le simulateur. Sur mobile, elles défilent horizontalement façon carrousel d'application.
- **Hero** : photo dans une grande carte arrondie à côté du titre (desktop), pour garder les visages visibles. Sur mobile, le titre et le simulateur passent d'abord, la photo ensuite.
- **Sections pensées pour le métier** :
  - promesses en cartes avec photo ;
  - services en grille « bento » (transfert aéroport mis en avant) ;
  - déroulé du transfert en 4 étapes numérotées ;
  - grands chiffres d'attente offerte ;
  - exemple de confirmation de réservation ;
  - itinéraire type d'une journée à Saint-Émilion ;
  - avis en cartes (marqués comme exemples) ;
  - carte schématique de la zone (Garonne en croissant) ;
  - FAQ en accordéons ;
  - CTA final sombre.
- **Formulaire de contact** : style application, avec trois étapes visuelles (Trajet → Passagers → Coordonnées), de grands champs arrondis et des erreurs signalées en ligne.
- **Mobile d'abord** : barre d'action collante (Appeler / WhatsApp / Devis) en pilules, menu plein écran accessible (focus piégé, Échap). Aucun débordement horizontal, vérifié de 320 à 1440 px.

Le point réglementaire VTC (réservation préalable obligatoire, prix fixé avant la course) est utilisé comme argument commercial dans tout le contenu.

## SEO

- `<title>` et meta description uniques, un seul H1 par page, hiérarchie Hn propre.
- Maillage interne avec ancres descriptives (« Transfert aéroport de Mérignac », « Chauffeur privé Saint-Émilion »…), ancres de section (`#merignac`, `#saint-jean`, `#entreprises`…), fil d'Ariane visible sur les pages internes.
- JSON-LD (un `@graph` par page, JSON valide vérifié) :
  - Accueil : `LocalBusiness` (`@id` `https://www.portdelalune-vtc.fr/#entreprise`, areaServed, 24/7, telephone, priceRange, geo), `WebSite`, `WebPage`, `TaxiService` avec `Offer`, `FAQPage`.
  - Pages internes : `BreadcrumbList` ; `Service` + `Offer` (aéroport/gare, vignobles/mariages/soirées, tarifs avec `OfferCatalog`) ; `FAQPage` là où une FAQ est visible — les textes JSON-LD sont générés à partir des mêmes données que la FAQ affichée, donc identiques.
- `canonical`, Open Graph et Twitter Card par page, image OG 1200×630, `lang="fr"`, `robots.txt`, `sitemap.xml` (les mentions légales, en `noindex`, en sont exclues).
- Performance : images WebP avec `width`/`height`, `srcset` pour le hero et les vignobles, `loading="lazy"` hors images principales, préchargement du hero, police en `display=swap`, un seul CSS et un seul JS différé.
- Accessibilité : lien d'évitement, focus visibles, labels et messages d'erreur liés aux champs (`aria-describedby`, `aria-invalid`), contrastes AA.

## Formulaire

Pas de backend : le script valide les champs, puis prépare la demande et propose de l'envoyer **par e-mail (`mailto:`) ou par WhatsApp**, avec un message d'information clair. Sans JavaScript, le formulaire se replie sur `action="mailto:…"`.

## Images

Photographies **Pexels** (licence libre), recadrées et converties en WebP avec Pillow, nommées pour le SEO :

| Fichier | Usage | Photographe |
|---|---|---|
| `chauffeur-vtc-bordeaux-accueil-*.webp`, `og-port-de-la-lune.jpg` | Hero accueil, image de partage | Сергей Тарасов |
| `chauffeur-prive-bordeaux-portrait.webp` | « Votre chauffeur » | Lee Salem |
| `transfert-aeroport-merignac-bagages.webp` | Page aéroport & gare | Lee Salem |
| `passagers-berline-vtc.webp` | Promesses / confort | Ron Lach |
| `chauffeur-prive-saint-emilion-degustation*.webp` | Page vignobles | juliane Monari |
| `vtc-mariage-bordeaux.webp` | Section mariages | Kanishka M Gunathunga |

Pour un vrai client, ces photos seront remplacées par celles du chauffeur et de son véhicule, aux mêmes noms et dimensions.

## À compléter pour une mise en production

- Adresse, carte professionnelle, assurance et hébergeur (repères `[…]` dans les mentions légales).
- Vrais numéros de SIRET, de registre VTC et de téléphone.
- Photos réelles ; police hébergée localement (RGPD) ; un vrai traitement du formulaire si besoin.

## Lancer en local

```
python -m http.server 8000
```
puis ouvrir http://localhost:8000/.
"# Port-de-la-Lune" 
