import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { RecipeAPI } from '../api/client';
import { useAuth } from '../state/auth';

// PUBLIC_INTERFACE
export default function RecipeDetailPage() {
  /** Shows a single recipe details. */
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
        // not found
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="container"><div className="card">Loading...</div></div>;
  if (!recipe) return <div className="container"><div className="card">Recipe not found.</div></div>;

  return (
    <div className="container">
      <div className="card">
        <img className="card-media" src={recipe.image_url || 'https://picsum.photos/800/400'} alt={recipe.title} />
        <h2 className="mt-2" style={{ marginBottom: 0 }}>{recipe.title}</h2>
        <div className="recipe-meta mt-2">
          {recipe.time ? `${recipe.time} min` : '—'} • {recipe.difficulty || 'Unknown'}
        </div>
        <div className="mt-3">
          <strong>Ingredients</strong>
          <ul>
            {(recipe.ingredients || []).map((ing, i) => <li key={i}>{ing}</li>)}
          </ul>
        </div>
        <div className="mt-3">
          <strong>Instructions</strong>
          <p style={{ whiteSpace: 'pre-wrap' }}>{recipe.instructions || recipe.description}</p>
        </div>
        <div className="row mt-3">
          <Link to="/" className="btn">Back</Link>
          {user && <button className="btn btn-secondary" onClick={() => navigate(`/editor/${recipe.id}`)}>Edit</button>}
        </div>
      </div>
    </div>
  );
}
