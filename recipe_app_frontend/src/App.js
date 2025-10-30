import React from 'react';
import './App.css';
import { AuthProvider } from './state/auth';
import AppRouter from './routes/Router';
import NavBar from './components/NavBar';

// PUBLIC_INTERFACE
function App() {
  /** Root application component that wires providers and main router. */
  return (
    <AuthProvider>
      <div className="app-shell">
        <NavBar />
        <main className="app-content container">
          <AppRouter />
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
