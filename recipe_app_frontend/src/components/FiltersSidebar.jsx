import React from 'react';

export default function FiltersSidebar({ filters, onChange }) {
  const set = (k, v) => onChange({ ...filters, [k]: v });

  return (
    <aside className="sidebar">
      <div className="card">
        <strong>Filters</strong>
        <div className="mt-3">
          <label className="helper">Difficulty</label>
          <select className="select mt-2" value={filters.difficulty || ''} onChange={e => set('difficulty', e.target.value)}>
            <option value="">Any</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>
        <div className="mt-3">
          <label className="helper">Tag</label>
          <input className="input mt-2" placeholder="e.g., vegan" value={filters.tag || ''} onChange={e => set('tag', e.target.value)} />
        </div>
      </div>
    </aside>
  );
}
