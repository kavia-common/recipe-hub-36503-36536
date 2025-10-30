import React from 'react';
import { Link } from 'react-router-dom';

export default function RecipeCard({ recipe }) {
  const cover = recipe?.media_assets?.[0]?.url || recipe?.image_url || recipe?.image || '';
  return (
    <div className="card">
      <Link to={`/recipes/${recipe.id}`}>
        <img className="card-media" src={cover || 'https://picsum.photos/600/400?grayscale'} alt={recipe.title} />
      </Link>
      <div className="recipe-title">
        <Link to={`/recipes/${recipe.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          {recipe.title}
        </Link>
      </div>
      <div className="recipe-meta">
        {recipe.time ? `${recipe.time} min` : '—'} • {recipe.difficulty || 'Unknown'}
      </div>
    </div>
  );
}
