import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RecipeAPI } from '../api/client';
import ImageUploader from '../components/ImageUploader';

// PUBLIC_INTERFACE
export default function RecipeEditorPage() {
  /** Editor for creating or updating a recipe. */
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    time: '',
    difficulty: 'Easy',
    image_url: '',
    ingredients: [],
    instructions: ''
  });
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(!id);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const data = await RecipeAPI.get(id);
        setForm({
          title: data.title || '',
          time: data.time || '',
          difficulty: data.difficulty || 'Easy',
          image_url: data.image_url || '',
          ingredients: data.ingredients || [],
          instructions: data.instructions || data.description || ''
        });
      } catch {
        // ignore
      } finally {
        setLoaded(true);
      }
    };
    load();
  }, [id]);

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const payload = {
        ...form,
        ingredients: Array.isArray(form.ingredients) ? form.ingredients : (form.ingredients || '').split('\n').filter(Boolean),
      };
      const saved = await RecipeAPI.save(id ? { ...payload, id } : payload);
      setMessage('Saved successfully');
      if (!id && saved?.id) navigate(`/recipes/${saved.id}`);
    } catch (e2) {
      setMessage('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (!loaded) return <div className="container"><div className="card">Loading...</div></div>;

  return (
    <div className="container">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>{id ? 'Edit Recipe' : 'New Recipe'}</h2>
        {message && <div className={`alert ${message.includes('Failed') ? 'alert-error' : 'alert-success'} mt-2`}>{message}</div>}

        <form className="mt-3" onSubmit={submit}>
          <div className="form-row">
            <div>
              <label className="helper">Title</label>
              <input className="input mt-2" value={form.title} onChange={e => setField('title', e.target.value)} required />
            </div>
            <div>
              <label className="helper">Time (min)</label>
              <input className="input mt-2" type="number" value={form.time} onChange={e => setField('time', e.target.value)} />
            </div>
          </div>

          <div className="form-row mt-2">
            <div>
              <label className="helper">Difficulty</label>
              <select className="select mt-2" value={form.difficulty} onChange={e => setField('difficulty', e.target.value)}>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
            <div>
              <label className="helper">Image URL (optional)</label>
              <input className="input mt-2" value={form.image_url} onChange={e => setField('image_url', e.target.value)} placeholder="https://..." />
            </div>
          </div>

          <div className="mt-3">
            <ImageUploader value={form.image_url} onChange={(url) => setField('image_url', url)} />
          </div>

          <div className="mt-3">
            <label className="helper">Ingredients (one per line)</label>
            <textarea
              className="textarea mt-2"
              rows={6}
              value={Array.isArray(form.ingredients) ? form.ingredients.join('\n') : (form.ingredients || '')}
              onChange={e => setField('ingredients', e.target.value)}
            />
          </div>

          <div className="mt-3">
            <label className="helper">Instructions</label>
            <textarea
              className="textarea mt-2"
              rows={8}
              value={form.instructions}
              onChange={e => setField('instructions', e.target.value)}
            />
          </div>

          <div className="row mt-3">
            <button className="btn" type="button" onClick={() => navigate(-1)}>Cancel</button>
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
