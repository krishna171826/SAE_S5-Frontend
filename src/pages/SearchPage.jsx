import { useState } from 'react';
import SearchForm from '../features/search/SearchForm';
import { submitSearch } from '../services/searchApi';

export default function SearchPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [pageError, setPageError] = useState('');

  const handleSearchSubmit = async (criteria) => {
    setIsLoading(true);
    setPageError('');
    setSearchResults(null);

    try {
      const data = await submitSearch(criteria);
      setSearchResults(data);
    } catch (err) {
      console.error(err);
      setPageError("Une erreur est survenue lors de la communication avec le serveur.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 font-sans">
  <h1 className="text-2xl font-bold mb-4">Recherche interactive d'activités</h1>
      
      <SearchForm onSearchSubmit={handleSearchSubmit} isLoading={isLoading} />

      {pageError && <p style={{ color: 'red', marginTop: '1rem' }}>{pageError}</p>}

      {/* Affichage du chargement demandé */}
      {isLoading && <p style={{ fontStyle: 'italic', color: '#666', marginTop: '1rem' }}>Patientez...</p>}

      {searchResults && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Résultats ({searchResults.length || 0})</h2>
          <pre style={{ background: '#f4f4f4', padding: '1rem', borderRadius: '5px', maxHeight: '300px', overflow: 'auto' }}>
            {JSON.stringify(searchResults, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}