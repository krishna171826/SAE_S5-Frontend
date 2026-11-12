import { useState, useEffect } from 'react';
import { getCategories } from '../../services/searchApi';

export default function SearchForm({ onSearchSubmit, isLoading }) {
  const [categories, setCategories] = useState([]);
  const [address, setAddress] = useState('');
  const [radius, setRadius] = useState('5');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [error, setError] = useState('');

  // Récupérer les catégories depuis GET /api/categories au chargement
  useEffect(() => {
    async function loadCategories() {
      try {
        const result = await getCategories();
        // S'adapte selon si l'API retourne { success: true, data: [...] } ou directement un tableau
        const catList = result.data || result;
        setCategories(catList);
      } catch (err) {
        console.error("Erreur chargement catégories:", err);
        setError("Impossible de charger les catégories.");
      }
    }
    loadCategories();
  }, []);

  const handleCategoryChange = (catName) => {
    setSelectedCategories(prev =>
      prev.includes(catName) ? prev.filter(c => c !== catName) : [...prev, catName]
    );
  };

  //Vérifier les champs avant l'envoi
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!address.trim()) {
      setError("Veuillez renseigner une adresse valide.");
      return;
    }
    if (!radius || isNaN(radius)) {
      setError("Veuillez sélectionner un rayon valide.");
      return;
    }

    // Transmettre les critères au parent
    onSearchSubmit({
      address,
      radius: Number(radius),
      categories: selectedCategories,
      filterType,
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '450px' }}>
      {error && <div style={{ color: 'red', fontWeight: 'bold' }}>{error}</div>}

      <div>
        <label htmlFor="address">Adresse : </label>
        <input
          id="address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Ex: 12 rue magenta, Paris"
          required
        />
      </div>

      <div>
        <label htmlFor="radius">Rayon (km) : </label>
        <select id="radius" value={radius} onChange={(e) => setRadius(e.target.value)}>
          <option value="2">2 km</option>
          <option value="5">5 km</option>
          <option value="10">10 km</option>
          <option value="20">20 km</option>
        </select>
      </div>

      <div>
        <fieldset style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '4px' }}>
          <legend>Catégories de loisirs :</legend>
          {categories.length === 0 ? (
            <p>Chargement des catégories...</p>
          ) : (
            categories.map((cat) => (
              <div key={cat.id || cat.slug}>
                <label>
                  <input
                    type="checkbox"
                    value={cat.name}
                    checked={selectedCategories.includes(cat.name)}
                    onChange={() => handleCategoryChange(cat.name)}
                  />
                  {cat.name}
                </label>
              </div>
            ))
          )}
        </fieldset>
      </div>

      <div>
        <label htmlFor="filterType">Filtre (Intérieur / Extérieur) : </label>
        <select id="filterType" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">Tous</option>
          <option value="indoor">Intérieur</option>
          <option value="outdoor">Extérieur</option>
        </select>
      </div>

      <button type="submit" disabled={isLoading} style={{ padding: '10px', cursor: 'pointer' }}>
        {isLoading ? "Patientez..." : "Lancer la recherche"}
      </button>
    </form>
  );
}