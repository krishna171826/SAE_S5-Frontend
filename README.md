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

## `features/` : le code de l'application, rangé par sujet

C'est ici que se trouvera **la plus grande partie du code**. Chaque fonctionnalité de l'application a son propre dossier, qui contient tout ce dont elle a besoin : ses composants, ses hooks et, si besoin, son contexte.

### Pourquoi ranger par sujet ?

Sans `features/`, le code de la recherche serait éparpillé dans `components/`, `hooks/` et `context/`, mélangé avec celui des autres sujets. Avec `features/`, quand on travaille sur la recherche, **tout est dans `features/search/`**. Chaque membre de l'équipe peut travailler sur son sujet sans toucher aux fichiers des autres.

### Exemple : la recherche d'activités

```
src/features/search/
├── SearchForm.jsx        # formulaire (lieu, catégories…)
├── SearchResults.jsx     # liste des résultats
├── ActivityCard.jsx      # affichage d'une activité
├── ActivityMap.jsx       # carte avec les activités
├── useSearch.js          # hook : appelle le service et gère chargement / erreur
└── SearchContext.jsx     # (si besoin) état partagé entre ces composants
```

- **Les composants** affichent les données.
- **Le hook** (`useSearch.js`) contient la logique : il appelle `services/searchService.js`, garde les résultats dans un `useState` et gère le chargement et les erreurs.
- **La page** (`pages/Search.jsx`) ne fait qu'assembler les morceaux :

```jsx
// src/pages/Search.jsx
import SearchForm from '../features/search/SearchForm.jsx'
import SearchResults from '../features/search/SearchResults.jsx'

export default function Search() {
  return (
    <>
      <SearchForm />
      <SearchResults />
    </>
  )
}
```

### Règles

- Un dossier par sujet, en minuscules : `features/search/`, `features/visitor/`, `features/categories/`.
- Un fichier de `features/search/` n'importe **jamais** un fichier de `features/visitor/`. Si deux sujets ont besoin du même composant, il est générique : on le déplace dans `components/ui/`.
- Les appels au backend restent dans `services/`, et les features les appellent.

## `context/` : partager des données entre plusieurs pages

### Le problème

En React, une donnée passe normalement d'un composant parent à ses enfants par les **props**. Ça marche bien sur un ou deux niveaux. Mais si la Navbar, la page de recherche et la page profil ont toutes besoin de savoir **qui est le visiteur actuel**, il faudrait faire descendre cette donnée à travers tous les composants intermédiaires, même ceux qui ne s'en servent pas. C'est ce qu'on appelle le *prop drilling*.

### La solution

Un **contexte** est une boîte partagée. On y met la donnée **une seule fois**, tout en haut de l'application, et **n'importe quel composant** peut la lire ou la modifier directement, sans passer par les props.

### Comment en créer un (3 étapes)

**1. Créer le contexte**, ici pour le visiteur :

```jsx
// src/context/VisitorContext.jsx
import { createContext, useContext, useState } from 'react'

const VisitorContext = createContext(null)

export function VisitorProvider({ children }) {
  const [visitor, setVisitor] = useState(null)

  return (
    <VisitorContext.Provider value={{ visitor, setVisitor }}>
      {children}
    </VisitorContext.Provider>
  )
}

export function useVisitor() {
  return useContext(VisitorContext)
}
```

- `VisitorProvider` est le composant qui **contient** la donnée (`visitor`) et la fonction pour la changer (`setVisitor`).
- `useVisitor()` est le raccourci que les composants appellent pour y **accéder**.

**2. Entourer l'application avec le Provider**, une seule fois, dans `main.jsx` :

```jsx
<VisitorProvider>
  <App />
</VisitorProvider>
```

Tout ce qui est à l'intérieur de `<App />` a maintenant accès au visiteur.

**3. L'utiliser dans n'importe quel composant :**

```jsx
import { useVisitor } from '../context/VisitorContext.jsx'

export default function Navbar() {
  const { visitor } = useVisitor()
  return <p>Bonjour {visitor ? visitor.name : 'invité'}</p>
}
```

```jsx
// ailleurs, après avoir créé le visiteur via le backend :
const { setVisitor } = useVisitor()
const newVisitor = await createVisitor(data)   // services/visitorService.js
setVisitor(newVisitor)                         // toute l'appli est mise à jour
```

Quand `setVisitor` est appelé, **tous** les composants qui utilisent `useVisitor()` se mettent à jour automatiquement.

### Quand utiliser un contexte (et quand ne pas le faire)

| Situation                                                        | Solution                                      |
| ---------------------------------------------------------------- | --------------------------------------------- |
| Donnée utilisée dans un seul composant                           | `useState` dans ce composant                  |
| Donnée passée d'un parent à son enfant direct                    | props                                         |
| Donnée partagée entre les composants d'**une seule** feature     | contexte dans `features/<sujet>/`             |
| Donnée utilisée **partout** dans l'appli (visiteur, thème…)      | contexte dans `context/`                      |

À éviter : tout mettre dans un contexte « au cas où ». Chaque changement d'un contexte met à jour tous les composants qui l'utilisent. Un contexte doit donc rester petit et ne contenir que des données vraiment partagées. Dans `context/`, il y aura donc **peu de fichiers** : le gros du code reste dans `features/`.

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
