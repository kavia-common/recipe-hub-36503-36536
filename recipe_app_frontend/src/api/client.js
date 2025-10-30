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

/**
 * Helpers to map frontend shapes to backend OpenAPI schema
 */
function toRecipeCreateOrUpdate(payload) {
  // Frontend form fields -> backend schema:
  // title (string)
  // description (string | null) - we map from instructions textarea for now
  // servings (int | null) - not provided
  // prep_time_minutes / cook_time_minutes (int | null) - we map form.time to prep_time_minutes
  // ingredients: array of IngredientCreate { name, quantity?, unit?, position }
  // steps: array of StepCreate { instruction, position }
  // tags: array of TagCreate { name }
  // media_assets: array of MediaAssetCreate { url, media_type?, alt_text?, position }
  const ingredientsArray = Array.isArray(payload.ingredients)
    ? payload.ingredients
    : (payload.ingredients || '')
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

  const stepsArray = Array.isArray(payload.steps)
    ? payload.steps
    : (payload.instructions || '')
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

  const mediaAssets = payload.image_url
    ? [{ url: payload.image_url, media_type: 'image', position: 0 }]
    : [];

  return {
    title: payload.title,
    description: payload.instructions || payload.description || null,
    servings: payload.servings ?? null,
    prep_time_minutes: payload.time ? Number(payload.time) : null,
    cook_time_minutes: null,
    ingredients: ingredientsArray.map((name, idx) => ({ name, position: idx })),
    steps: stepsArray.map((instruction, idx) => ({ instruction, position: idx })),
    tags: (payload.tags || []).map((name) => ({ name })),
    media_assets: mediaAssets
  };
}

// PUBLIC_INTERFACE
export const AuthAPI = {
  /** Login with credentials: {email, password} */
  async login(payload) {
    // Backend expects {email, password} and returns {access_token, token_type}
    const { data } = await api.post('/auth/login', payload);
    return data;
  },
  /** Register user: {email, password, full_name?} */
  async register(payload) {
    const body = {
      email: payload.email,
      password: payload.password,
      full_name: payload.name || payload.full_name || null
    };
    const { data } = await api.post('/auth/register', body);
    return data;
  },
  /** Get current user profile (Authorization header already attached) */
  async me() {
    const { data } = await api.get('/auth/me');
    return data;
  }
};

// PUBLIC_INTERFACE
export const RecipeAPI = {
  /** List recipes with optional query: {q, tag, page, page_size} */
  async list(params = {}) {
    const { data } = await api.get('/recipes', {
      params: {
        q: params.q ?? undefined,
        tag: params.tag ?? undefined,
        page: params.page ?? undefined,
        page_size: params.page_size ?? undefined
      }
    });
    return data;
  },
  /** Get single recipe by id */
  async get(id) {
    const { data } = await api.get(`/recipes/${id}`);
    return data;
  },
  /** Create or update recipe using backend schema mapping */
  async save(recipe) {
    const body = toRecipeCreateOrUpdate(recipe);
    if (recipe.id) {
      const { data } = await api.put(`/recipes/${recipe.id}`, body);
      return data;
    }
    const { data } = await api.post('/recipes', body);
    return data;
  },
  /** Upload image file and get URL using backend path /media/upload */
  async uploadImage(file) {
    const form = new FormData();
    form.append('file', file);
    const { data } = await api.post('/media/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    // Normalize return shape to { url }
    if (data?.url) return data;
    if (typeof data === 'string') return { url: data };
    if (data?.location) return { url: data.location };
    if (data?.path) return { url: data.path };
    return data;
  }
};
