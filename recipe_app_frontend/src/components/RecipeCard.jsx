import React from 'react';
import { Link } from 'react-router-dom';

function toAbsolute(urlOrPath) {
  if (!urlOrPath) return urlOrPath;
  try {
    const u = new URL(urlOrPath);
    return u.toString();
  } catch {
    const base = (process.env.REACT_APP_API_BASE || 'http://localhost:3001').replace(/\/+$/,'');
    const normalized = String(urlOrPath).startsWith('/') ? urlOrPath : `/${urlOrPath}`;
    return `${base}${normalized}`;
  }
}

export default function RecipeCard({ recipe }) {
  const raw = recipe?.media_assets?.[0]?.url || recipe?.image_url || recipe?.image || '';
  const cover = raw ? toAbsolute(raw) : '';

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
