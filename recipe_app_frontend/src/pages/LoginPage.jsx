import React, { useState } from 'react';
import { useAuth } from '../state/auth';
import { Link, useNavigate } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function LoginPage() {
  /** Login page with email/password form. */
  const { login, error, setError, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const ok = await login(email, password);
    if (ok) navigate('/');
  };

  return (
    <div className="container" style={{ maxWidth: 440 }}>
      <div className="card">
        <h2 style={{ margin: 0 }}>Welcome back</h2>
        <div className="helper">Sign in to continue</div>

        {error && <div className="alert alert-error mt-3">{error}</div>}

        <form className="mt-3" onSubmit={submit} onChange={() => setError(null)}>
          <div className="mt-2">
            <label className="helper">Email</label>
            <input className="input mt-2" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="mt-2">
            <label className="helper">Password</label>
            <input className="input mt-2" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div className="mt-3 row space-between">
            <Link to="/register" className="helper">Create an account</Link>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
