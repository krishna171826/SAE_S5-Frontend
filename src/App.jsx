import { useState } from 'react'
import './App.css'
import Navbar from './components/layout/Navbar'
import SearchPage from './pages/SearchPage'

export default function App() {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <div className="flex flex-col min-h-screen bg-blue-50">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

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
