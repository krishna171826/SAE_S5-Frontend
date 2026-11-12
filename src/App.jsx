import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import SearchPage from './pages/SearchPage'

export default function App() {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <div className="flex flex-col min-h-screen bg-blue-50">
      {/* Barre de navigation / Onglets */}
      <header className="flex justify-center gap-4 p-4 bg-white shadow-sm">
        <button
          onClick={() => setActiveTab('home')}
          className={`px-4 py-2 font-semibold rounded-lg transition-colors ${
            activeTab === 'home'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Accueil
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`px-4 py-2 font-semibold rounded-lg transition-colors ${
            activeTab === 'search'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Recherche d'activités
        </button>
      </header>

      {/* Contenu dynamique selon l'onglet actif */}
      <main className="flex-1 flex flex-col items-center justify-center">
        {activeTab === 'home' && (
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-blue-600">
              Bienvenue sur SAE_S5 🚀
            </h1>
          </div>
        )}

        {activeTab === 'search' && <SearchPage />}
      </main>
    </div>
  )
}