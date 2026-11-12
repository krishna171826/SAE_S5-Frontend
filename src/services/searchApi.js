const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Récupère la liste officielle des catégories depuis GET /api/categories
 */
export async function getCategories() {
  const response = await fetch(`${API_URL}/api/categories`);
  if (!response.ok) {
    throw new Error("Impossible de récupérer les catégories.");
  }
  return await response.json();
}

/**
 * Envoie les critères de recherche au backend via POST /api/searches
 * @param {Object} searchCriteria - { address, radius, categories, filterType }
 */
export async function submitSearch(searchCriteria) {
  const response = await fetch(`${API_URL}/api/searches`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(searchCriteria),
  });

  if (!response.ok) {
    throw new Error("Erreur lors du calcul de la recherche géospatiale.");
  }

  return await response.json();
}