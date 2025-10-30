import React, { useState } from 'react';
import { useAuth } from '../state/auth';
import { Link, useNavigate } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function RegisterPage() {
  /** Registration page with name/email/password. */
  const { register, error, setError, loading } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const ok = await register(form);
    if (ok) navigate('/');
  };

  return (
    <div className="container" style={{ maxWidth: 480 }}>
      <div className="card">
        <h2 style={{ margin: 0 }}>Create account</h2>
        <div className="helper">Join Recipe Hub</div>

        {error && <div className="alert alert-error mt-3">{error}</div>}

        <form className="mt-3" onSubmit={submit} onChange={() => setError(null)}>
          <div className="mt-2">
            <label className="helper">Name</label>
            <input className="input mt-2" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="mt-2">
            <label className="helper">Email</label>
            <input className="input mt-2" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="mt-2">
            <label className="helper">Password</label>
            <input className="input mt-2" type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
          <div className="mt-3 row space-between">
            <Link to="/login" className="helper">Have an account? Sign in</Link>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
