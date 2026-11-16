import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRecommendationResults } from '../services/recommendationService';
import ActivityCard from '../features/search/ActivityCard';
import logoSpotly from '../assets/logo-spotly.png';

export default function RecommendationsPage({ searchId: propSearchId }) {
  const { id: paramSearchId } = useParams();
  const searchId = propSearchId || paramSearchId || 1;

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('recommendations');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getRecommendationResults(searchId);
        setActivities(data);
      } catch {
        setError("Impossible de charger les recommandations.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchId]);

  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden relative">

      {/* Logo Spotly Flottant */}
      <div className="absolute top-4 left-4 z-10 bg-white px-4 py-2 rounded-full shadow-md flex items-center gap-2.5 overflow-hidden">
        <img
          src={logoSpotly}
          alt="Logo Spotly"
          className="w-8 h-8 object-contain scale-[3]"
        />
        <span className="font-bold text-gray-800">Spotly</span>
      </div>

      {/* Gauche : Carte */}
      <div className="w-1/2 h-full bg-gray-200 relative flex items-center justify-center">
        <iframe
          title="Carte des recommandations"
          className="w-full h-full min-h-screen border-0 grayscale-[20%] contrast-[95%]"
          src="https://www.openstreetmap.org/export/embed.html?bbox=2.25,48.81,2.42,48.90&layer=mapnik"
        />

        <div className="absolute bottom-6 bg-white px-4 py-2 rounded-full shadow-md text-sm font-semibold text-gray-800 flex items-center gap-2">
          <span className="text-red-500">📍</span> Paris
        </div>
      </div>

      {/* Droite : Panneau latéral */}
      <div className="w-1/2 h-full bg-gray-50 flex flex-col p-8 overflow-y-auto">

        <div className="mb-6">
          <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">BONJOUR AKSWIN</span>
          <div className="flex justify-between items-center mt-1">
            <h1 className="text-3xl font-extrabold text-gray-900">Résultats suggérés</h1>
            <span className="bg-emerald-100 text-emerald-800 font-semibold text-sm px-3 py-1 rounded-full">
              15 km
            </span>
          </div>
        </div>

        {/* Navigation Onglets */}
        <div className="bg-gray-200/60 p-1.5 rounded-full flex mb-6">
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`flex-1 py-2.5 text-center text-sm font-semibold rounded-full transition-all ${activeTab === 'recommendations'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-800'
              }`}
          >
            Recommandations
          </button>
          <button
            onClick={() => setActiveTab('performances')}
            className={`flex-1 py-2.5 text-center text-sm font-semibold rounded-full transition-all ${activeTab === 'performances'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-800'
              }`}
          >
            Performances
          </button>
        </div>

        {/* Contenu selon l'onglet sélectionné */}
        {activeTab === 'recommendations' ? (
          <>
            {/* Chargement */}
            {loading && (
              <div className="flex-1 flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mb-3"></div>
                <p className="text-gray-500 text-sm">Chargement des résultats...</p>
              </div>
            )}

            {/* Erreur */}
            {!loading && error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl text-center my-auto">
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Résultats Vides */}
            {!loading && !error && activities.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <span className="text-3xl mb-2">🔍</span>
                <p className="font-semibold text-gray-800">Aucun lieu trouvé dans cette zone</p>
                <p className="text-xs text-gray-500 mt-1">Essayez de modifier votre rayon ou vos préférences.</p>
              </div>
            )}

            {/* Liste des activités */}
            {!loading && !error && activities.length > 0 && (
              <div className="space-y-5 pr-2">
                {activities.map((activity, index) => (
                  <ActivityCard key={activity.id || index} activity={activity} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-white rounded-3xl shadow-sm">
            <span className="text-3xl mb-2">📊</span>
            <p className="font-semibold text-gray-800">Statistiques et performances</p>
            <p className="text-xs text-gray-500 mt-1">Les métriques de calcul du moteur de recommandation seront affichées ici.</p>
          </div>
        )}

      </div>
    </div>
  );
}