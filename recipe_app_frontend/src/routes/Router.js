import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import RecipeListPage from '../pages/RecipeListPage';
import RecipeDetailPage from '../pages/RecipeDetailPage';
import RecipeEditorPage from '../pages/RecipeEditorPage';
import { useAuth } from '../state/auth';

function Protected({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// PUBLIC_INTERFACE
export default function AppRouter() {
  /** Defines public and protected routes for the app. */
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RecipeListPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/recipes/:id" element={<RecipeDetailPage />} />
        <Route
          path="/editor/:id"
          element={
            <Protected>
              <RecipeEditorPage />
            </Protected>
          }
        />
        <Route
          path="/editor"
          element={
            <Protected>
              <RecipeEditorPage />
            </Protected>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
