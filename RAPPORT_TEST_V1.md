# Rapport de test : Spotly Frontend (16/11/2026)

Testé sur la branche `scoring`, backend Docker lancé.
`npm run lint` : OK, `npm run build` : OK.

Parcours testé : prénom → adresse → préférences → résultats, avec des cas d'erreur (champ vide, adresse invalide, rechargement, URL inconnue, mobile).

---

## V1 : corrigé

1. **Adresse invalide** (`Preference.jsx`) : avant, une adresse comme `zzzqqqxxx` menait à « Aucun lieu trouvé ». Maintenant, si la réponse ne contient pas de `searchCenter`, on reste sur la page Préférences avec le message « Adresse introuvable. Vérifiez votre adresse et réessayez. »
2. **Distance** (`ActivityCard.jsx`) :
   - Une distance de `0` affichait « 9 km », une valeur codée en dur. Le badge s'affiche maintenant seulement si la distance existe.
   - Au-delà de 1 km, la distance est affichée au dixième (1,0 km, 1,4 km) au lieu d'être arrondie à « 1 km ».
3. **URL inconnue** (`App.jsx`) : une route `*` redirige vers `/` au lieu d'afficher une page blanche.

---

## V2 : à faire

### Bugs / manques constatés en V1

- **Trop de résultats** : 576 cartes s'affichent d'un coup (Culture, 5 km, Paris). Il faut limiter la liste (top 20 par exemple) ou ajouter un bouton « Voir plus ».
- **La carte reste sur Paris** (`RecommendationsPage.jsx`). La `bbox` et le badge « Paris » sont codés en dur et aucun lieu n'est placé. Il faut au minimum centrer la carte sur `data.searchCenter`.
- **« Voir les détails » ne fait rien** : le bouton n'a pas de `onClick`.
- **Rechargement de la page résultats** : le prénom et le rayon sont perdus. Le rayon peut être pris dans `data.radiusMeters`.
- **Pas de bouton Retour ni « Nouvelle recherche »**. Après le message « Adresse introuvable », impossible de corriger l'adresse sans recharger la page.
- **Mobile cassé** : la page résultats est en `w-1/2` / `w-1/2` et déborde. Dans le questionnaire, la flèche est coupée et le titre est trop grand.
- **L'étape 1 affiche « BIENVENUE »** sans prénom.
- **Champ vide** : aucun message quand on valide un champ vide.

### Hygiène

- `index.html` : `lang="en"`, titre `sae-s5-frontend`, et le favicon `/favicon.svg` n'existe pas.
- `searchApi.js` : le message d'erreur du backend est perdu. `getCategories()` n'est jamais utilisée.
- `axios` est installé mais jamais utilisé.
- Deux logos différents entre le questionnaire et les résultats.
- Le fichier `Acceuil.jsx` devrait s'appeler `Accueil.jsx`. Les textes manquent de majuscules (« quelle est votre adresse ? »).
- `Dockerfile` : `node:18` alors que Vite 8 demande Node ≥ 20. Il lance aussi `npm run dev` au lieu d'un build de prod.

### Côté backend (à signaler au binôme back)

- Une adresse introuvable doit renvoyer une erreur 400/404 au lieu de `success: true` avec `searchCenter: {}`.
- L'erreur Overpass 502 est ignorée en silence.
- `POST /api/visitors` n'est jamais appelée et `visitorId` n'est pas transmis à la recherche.

### Nouvelles fonctionnalités

- Marqueurs sur la carte (Leaflet / react-leaflet), avec un lien entre la liste et la carte.
- Page ou modale « Détails » : horaires, site, téléphone, gratuit ou payant, itinéraire.
- Autocomplétion d'adresse et bouton « Me géolocaliser ».
- Filtres et tri sur la page résultats.
- Contenu pour l'onglet « Performances ».
- Option « gratuit uniquement » (`free_only`, déjà gérée par le backend).
- Pouvoir recharger une recherche depuis `/recommendations/:id` et la partager.
- Garder le prénom et les préférences dans `localStorage`.

### Qualité / technique

- Skeletons de chargement, timeout / annulation des requêtes.
- Error Boundary global.
- Tests (Vitest + Testing Library).
- Routing par étapes (`/nom`, `/adresse`, `/preferences`).
- Accessibilité : `aria-pressed`, labels, contraste, focus visible.
- Dockerfile de prod (build + nginx) et CI GitHub Actions.
