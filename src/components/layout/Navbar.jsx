export default function Navbar({ activeTab, setActiveTab }) {
  return (
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
  )
}