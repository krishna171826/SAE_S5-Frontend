# SAE S5 — Frontend

Frontend React du projet SAE S5 (Vite + Tailwind CSS).

Cette section explique comment le projet est organisé et les règles que **tout le monde** suit, pour que le code reste lisible quel que soit qui l'a écrit.

## Lancer le projet

```bash
npm install
npm run dev        # http://localhost:5173
```

| Commande          | Rôle                                  |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Serveur de dev avec rechargement auto |
| `npm run lint`    | Vérifie le code avec ESLint           |
| `npm run build`   | Build de production dans `dist/`      |
| `npm run preview` | Sert le build de production en local  |

## Arborescence

```
src/
├── main.jsx          # Point d'entrée : monte <App/> dans <VisitorProvider>
├── App.jsx           # Composant racine (affiche la page d'accueil)
│
├── style/
│   ├── index.css         # Importe typographie.css puis Tailwind
│   └── typographie.css   # Polices + utilitaires de texte (titre-manuscrit…)
│
├── assets/           # Images, SVG… importés dans le code
├── components/       # Composants RÉUTILISABLES, sans logique métier
│   ├── ui/           #   Briques de base : Button, Input, Modal, Card…
│   └── layout/       #   Structure de page : Navbar, Footer, Layout…
├── pages/            # Une page = un écran de l'application (Home, Login…)
├── features/         # Le code de chaque fonctionnalité (search/, visitor/…)
├── hooks/            # Hooks personnalisés génériques (useFetch, useAuth…)
├── services/         # Tous les appels au backend
├── context/          # Contextes React partagés (AuthContext…)
├── utils/            # Fonctions pures sans React (formatDate, validators…)
└── constants/        # Valeurs fixes : chemins des pages, config…
```

> Les dossiers vides contiennent un `.gitkeep` uniquement pour exister dans Git. Supprimez-le dès que vous ajoutez un vrai fichier dans le dossier.

## Où mettre quoi ?

| Je veux…                                                  | Je le mets dans…                       |
| --------------------------------------------------------- | -------------------------------------- |
| Créer un bouton / input / carte utilisable partout        | `components/ui/`                       |
| Créer la barre de navigation ou le pied de page           | `components/layout/`                   |
| Créer un nouvel écran de l'application                    | `pages/`                               |
| Appeler le backend                                        | `services/` (jamais dans un composant) |
| Partager un état entre plusieurs pages (utilisateur connecté…) | `context/`                        |
| Réutiliser une logique avec `useState` / `useEffect`      | `hooks/`                               |
| Écrire une fonction utilitaire (formatage, calcul…)       | `utils/`                               |
| Regrouper beaucoup de fichiers liés à un même sujet       | `features/<sujet>/`                    |
| Ajouter une image                                         | `assets/`                              |

**`components/` ou `features/` ?** Si le composant ne sert qu'à un seul sujet (ex. `LoginForm`), il va dans `features/auth/`. S'il peut servir n'importe où (ex. `Button`), il va dans `components/ui/`.

## `features/` et `context/`, c'est quoi ?

**`features/`** regroupe tout le code d'une même fonctionnalité dans un seul dossier. Par exemple, `features/search/` contient le formulaire de recherche, la liste des résultats et la carte des activités. Quand on travaille sur la recherche, tout est au même endroit.

**`context/`** sert à partager une donnée avec toute l'application sans la faire passer de composant en composant. Par exemple, une fois le visiteur créé, la Navbar, la page de recherche et la page profil peuvent toutes savoir qui il est. On l'utilise seulement pour les données vraiment partagées partout, donc ce dossier contiendra peu de fichiers.

## Conventions de nommage

| Type de fichier        | Convention                         | Exemple           |
| ---------------------- | ---------------------------------- | ----------------- |
| Composant / page       | `PascalCase.jsx`                   | `UserCard.jsx`    |
| Hook                   | `camelCase.js`, commence par `use` | `useAuth.js`      |
| Service                | `camelCase.js` + `Service`         | `userService.js`  |
| Utilitaire / constante | `camelCase.js`                     | `formatDate.js`   |
| Contexte               | `PascalCase` + `Context`           | `AuthContext.jsx` |

- Un composant = un fichier, exporté avec `export default function NomDuComposant()`.
- Le nom du fichier = le nom du composant.

## Règles à respecter

1. **Pas de `fetch` dans les composants** : tous les appels au backend passent par un fichier de `services/`.
2. **Pas d'URL en dur** : l'adresse du backend se met dans un fichier `.env` (variable `VITE_...`, jamais commité).
3. **Style avec Tailwind** (classes dans `className`), pas de fichier `.css` par composant.
4. **`npm run lint` doit passer** avant chaque push.

## Workflow Git

- On ne travaille **jamais directement sur `main`**.
- Une branche par fonctionnalité : `feature/nom-court`, `fix/nom-court`, `chore/nom-court`.
- Messages de commit clairs : `ajoute la page profil`, `corrige le bouton de connexion`.
- Avant de pousser : `npm run lint` et `npm run build` doivent passer.
- On fusionne dans `main` via une Pull Request relue par au moins une autre personne.

---

# Avancement

## Ce qui est fait

### Page d'accueil visiteur — `src/pages/Acceuil.jsx`
Premier écran de **Spovo** : on demande son prénom au visiteur.

- Image de fond plein écran (`public/background-image.jpg`) assombrie par un calque `bg-black/40`.
- Logo + nom « Spovo » en haut à gauche (`public/logo.png`).
- Titre « Comment vous appelez-vous ? » avec la police manuscrite.
- Formulaire : icône utilisateur, champ prénom, bouton flèche (icônes `lucide-react`).

Fonctionnement du formulaire :

```
le visiteur tape  →  state local (vistorInput)        ← brouillon, seul l'input le voit
       ↓ Entrée ou clic sur la flèche (onSubmit du <form>)
e.preventDefault()   → pas de rechargement de la page
.trim()              → enlève les espaces autour
champ vide ?         → on s'arrête
setVisitor(prénom)   → contexte : toute l'app connaît le prénom
```

L'input est **contrôlé** : `value={vistorInput}` + `onChange` qui appelle `setvisitorInput`.

### Contexte visiteur — `src/context/VisitorContext.jsx`
Partage le prénom du visiteur avec toute l'application.

- `VisitorProvider` : contient le state `visitor` (`null` au départ) et l'expose avec `setVisitor`. Il entoure `<App />` dans `main.jsx`.
- `useVisitor()` : hook pour lire ou modifier le visiteur depuis n'importe quel composant. Il lève une erreur s'il est utilisé hors du Provider.

```jsx
const { visitor, setVisitor } = useVisitor();   // objet → accolades { }
const [texte, setTexte] = useState('');         // useState → crochets [ ]
```

⚠️ Le contexte n'est **pas** un stockage : il est vidé à chaque rafraîchissement de la page (F5). Pour garder le prénom, il faudra l'enregistrer dans `localStorage`.

### Style — `src/style/`
- Tailwind v4 via le plugin Vite (`vite.config.js`), pas de `tailwind.config.js`.
- `typographie.css` charge deux polices Google Fonts :
  - `font-manuscrit` : Caveat Brush (titres, champ prénom) ;
  - `font-texte` : Nunito (texte courant).
- Utilitaires maison : `titre-manuscrit` (utilisé), `surtitre` et `nom-appli` (prêts, mais pas encore utilisés dans la page).
- `index.css` doit importer `typographie.css` **avant** `tailwindcss`, sinon le `@import` des polices est ignoré.

## État vérifié (14/11/2026)

| Vérification | Résultat |
| --- | --- |
| `npm run build` | ✅ passe, sans warning |
| `npm run lint` | ❌ 1 erreur `react-refresh/only-export-components` dans `VisitorContext.jsx` |
| Test navigateur | ✅ « Hariz » est bien envoyé dans le contexte, espaces retirés ; un champ fait seulement d'espaces est refusé ; aucune erreur console |

## À faire pour reprendre

**Nettoyage immédiat**
- [ ] Retirer la ligne de test `<p>Contexte : {visitor}</p>` dans `Acceuil.jsx`, puis retirer `visitor` du `const { ... }` (sinon le lint le signalera).
- [ ] Régler le lint `react-refresh` : déplacer `useVisitor` dans son propre fichier (ex. `hooks/useVisitor.js`).
- [ ] Supprimer `public/logo.png.sb-4272a044-LkpL1P` (fichier temporaire).
- [ ] Supprimer le commentaire dupliqué « div pour le texte de bienvenue ».
- [ ] Renommer pour suivre les conventions : `Acceuil` → `Accueil`, `vistorInput` / `setvisitorInput` → `prenom` / `setPrenom`, `visitorF` → `prenomPropre`.
- [ ] Passer `Accueil` en `export default`, comme le demande la règle « Un composant = un fichier ».
- [ ] `index.html` : le favicon `/favicon.svg` a été supprimé (le remplacer par le logo), mettre `lang="fr"` et le titre « Spovo ».
- [ ] `Dockerfile` : `node:18-alpine` est trop ancien pour Vite 8 (Node `20.19+` ou `22.12+` requis). Passer à `node:22-alpine`.
- [ ] Commiter le travail en cours : rien n'est encore commité sur la branche `AcceuilVisiteur`.

**Prochaine fonctionnalité**
- [ ] Décider de ce qui s'affiche après la validation du prénom (« Bonjour Hariz », page suivante…).
  - Peu d'écrans → affichage conditionnel dans `App.jsx` (`visitor` vide → Accueil, sinon autre page).
  - Plusieurs pages → installer React Router.
- [ ] Optionnel : garder le prénom après F5 avec `localStorage`.
