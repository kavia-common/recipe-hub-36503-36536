import axios from 'axios';
import { storage } from '../utils/storage';
import { authEvents } from '../state/auth';

/**
 * Axios API client configured with:
 * - Base URL from REACT_APP_API_BASE (defaults to http://localhost:3001)
 * - Authorization header when token exists
 * - 401 interceptor to trigger logout
 */
const baseURL = process.env.REACT_APP_API_BASE || 'http://localhost:3001';

export const api = axios.create({
  baseURL,
  withCredentials: false
});

// Attach token on requests
api.interceptors.request.use((config) => {
  const token = storage.getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 - broadcast logout
api.interceptors.response.use(
  (resp) => resp,
  (error) => {
    if (error?.response?.status === 401) {
      // Notify listeners (AuthProvider will handle)
      authEvents.dispatchEvent(new Event('logout'));
    }
    return Promise.reject(error);
  }
);

// PUBLIC_INTERFACE
export const AuthAPI = {
  /** Login with credentials: {email, password} */
  async login(payload) {
    // Backend expects OAuth2PasswordRequestForm by spec, but many FastAPI templates also accept JSON.
    // We try JSON first; adjust backend if needed. Payload: { email, password }
    const { data } = await api.post('/auth/login', payload);
    return data;
  },
  /** Register user: {email, password, name} */
  async register(payload) {
    const { data } = await api.post('/auth/register', payload);
    return data;
  },
  /** Get current user profile */
  async me() {
    const { data } = await api.get('/auth/me');
    return data;
  }
};

// PUBLIC_INTERFACE
export const RecipeAPI = {
  /** List recipes with optional query: {q, tags, difficulty, page} */
  async list(params = {}) {
    const { data } = await api.get('/recipes', { params });
    return data;
  },
  /** Get single recipe by id */
  async get(id) {
    const { data } = await api.get(`/recipes/${id}`);
    return data;
  },
  /** Create or update recipe */
  async save(recipe) {
    if (recipe.id) {
      const { data } = await api.put(`/recipes/${recipe.id}`, recipe);
      return data;
    }
    const { data } = await api.post('/recipes', recipe);
    return data;
  },
  /** Upload image file and get URL using backend path /media/upload */
  async uploadImage(file) {
    const form = new FormData();
    form.append('file', file);
    const { data } = await api.post('/media/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  }
};
