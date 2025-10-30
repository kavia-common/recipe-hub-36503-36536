import React from 'react';

export default function SearchBar({ value, onChange, onSubmit, placeholder = 'Search recipes...' }) {
  return (
    <form
      className="searchbar"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
    >
      <span role="img" aria-label="search">🔎</span>
      <input
        className="input"
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
      />
      <button className="btn btn-primary" type="submit">Search</button>
    </form>
  );
}
