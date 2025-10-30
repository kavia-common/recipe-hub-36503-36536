import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../state/auth';

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <span className="logo">🍲</span>
          <span>Recipe Hub</span>
        </Link>
        <div className="nav-actions">
          {user ? (
            <>
              <Link to="/editor" className="btn btn-secondary">New Recipe</Link>
              <button className="btn" onClick={handleLogout}>Logout</button>
              <div className="btn" title={user.email}>{user.name || 'Account'}</div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
