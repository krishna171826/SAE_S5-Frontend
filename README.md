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
├── main.jsx          # Point d'entrée : monte <App/> dans la page
├── App.jsx           # Composant racine
├── index.css         # Import de Tailwind + styles globaux
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

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
