import React, { useRef, useState } from 'react';
import { RecipeAPI } from '../api/client';

export default function ImageUploader({ value, onChange }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const pick = () => fileRef.current?.click();

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const res = await RecipeAPI.uploadImage(file); // normalized to { url }
      onChange?.(res.url || '');
    } catch (err) {
      const d = err?.response?.data;
      const detail = typeof d?.detail === 'string' ? d.detail : (Array.isArray(d?.detail) ? d.detail.map(x => x?.msg || '').join(', ') : null);
      setError(detail || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card">
      <div className="row space-between">
        <div>
          <div className="helper">Cover Image</div>
          {value ? (
            <img src={value} alt="cover" className="card-media mt-2" />
          ) : (
            <div className="card-media mt-2" style={{ display: 'grid', placeItems: 'center', color: '#6B7280' }}>
              No image selected
            </div>
          )}
        </div>
      </div>
      <div className="mt-3 row">
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onFile} />
        <button type="button" className="btn" onClick={pick} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Choose Image'}
        </button>
      </div>
      {error && <div className="alert alert-error mt-2">{error}</div>}
    </div>
  );
}
