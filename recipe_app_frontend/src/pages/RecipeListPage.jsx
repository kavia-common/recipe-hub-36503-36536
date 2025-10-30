import React, { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import FiltersSidebar from '../components/FiltersSidebar';
import RecipeCard from '../components/RecipeCard';
import { RecipeAPI } from '../api/client';

// PUBLIC_INTERFACE
export default function RecipeListPage() {
  /** Displays a searchable, filterable list of recipes. */
  const [q, setQ] = useState('');
  const [filters, setFilters] = useState({ difficulty: '', tag: '' });
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    try {
      const params = { q: q || undefined, difficulty: filters.difficulty || undefined, tag: filters.tag || undefined };
      const data = await RecipeAPI.list(params);
      setRecipes(data?.items || data || []);
    } catch {
      // silently ignore for now
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); /* initial */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      <div className="grid">
        <div className="col-3">
          <FiltersSidebar filters={filters} onChange={setFilters} />
        </div>
        <div className="col-9">
          <div className="row space-between">
            <SearchBar value={q} onChange={setQ} onSubmit={fetchList} />
            <button className="btn" onClick={fetchList} disabled={loading}>{loading ? 'Loading...' : 'Refresh'}</button>
          </div>
          <div className="recipe-grid mt-3">
            {recipes.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
          {!loading && recipes.length === 0 && (
            <div className="card mt-3">
              <div className="helper">No recipes found. Try adjusting filters or search.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
