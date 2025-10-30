import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { RecipeAPI } from '../api/client';
import { useAuth } from '../state/auth';

// PUBLIC_INTERFACE
export default function RecipeDetailPage() {
  /**
   * Displays a single recipe detail using backend RecipeRead schema.
   * Renders media_assets cover, computes total time from prep/cook,
   * lists ingredients (name/quantity/unit), steps (ordered), and tags.
   */
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await RecipeAPI.get(id);
        setRecipe(data);
      } catch (e) {
        // not found or error
        setRecipe(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="container"><div className="card">Loading...</div></div>;
  if (!recipe) return <div className="container"><div className="card">Recipe not found.</div></div>;

  const toAbsolute = (u) => {
    if (!u) return u;
    try { return new URL(u).toString(); } catch {
      const base = (process.env.REACT_APP_API_BASE || 'http://localhost:3001').replace(/\/+$/,'');
      const normalized = String(u).startsWith('/') ? u : `/${u}`;
      return `${base}${normalized}`;
    }
  };
  const coverUrl = toAbsolute(recipe.media_assets?.[0]?.url || recipe.image_url) || 'https://picsum.photos/800/400';
  const totalTime = (recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0);

  return (
    <div className="container">
      <div className="card">
        <img className="card-media" src={coverUrl} alt={recipe.title} />
        <h2 className="mt-2" style={{ marginBottom: 0 }}>{recipe.title}</h2>
        <div className="recipe-meta mt-2">
          {totalTime ? `${totalTime} min total` : '—'}
        </div>

        {(recipe.tags && recipe.tags.length > 0) && (
          <div className="mt-2">
            <div className="helper">Tags: {recipe.tags.map((t) => t.name || t).join(', ')}</div>
          </div>
        )}

        <div className="mt-3">
          <strong>Ingredients</strong>
          <ul>
            {(recipe.ingredients || []).map((ing, i) => (
              <li key={i}>
                {typeof ing === 'string' ? ing : ing.name}
                {ing?.quantity ? ` - ${ing.quantity}` : ''}
                {ing?.unit ? ` ${ing.unit}` : ''}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-3">
          <strong>Instructions</strong>
          {Array.isArray(recipe.steps) && recipe.steps.length > 0 ? (
            <ol>
              {recipe.steps
                .slice()
                .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
                .map((s, i) => (
                  <li key={i} style={{ marginBottom: 6 }}>
                    {s.instruction}
                  </li>
                ))}
            </ol>
          ) : (
            <p style={{ whiteSpace: 'pre-wrap' }}>{recipe.description || ''}</p>
          )}
        </div>

        <div className="row mt-3">
          <Link to="/" className="btn">Back</Link>
          {user && <button className="btn btn-secondary" onClick={() => navigate(`/editor/${recipe.id}`)}>Edit</button>}
        </div>
      </div>
    </div>
  );
}
