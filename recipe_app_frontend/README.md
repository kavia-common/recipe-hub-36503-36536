# Lightweight React Template for KAVIA

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

## Features

- Lightweight and modern UI
- Minimal dependencies for quick loading times
- Simple to understand and extend

## Environment

- Frontend reads API base URL from `REACT_APP_API_BASE` (defaults to `http://localhost:3001`).
- Backend CORS must include `http://localhost:3000` during development.
- Backend serves media under `/media` and accepts uploads at `/media/upload`.
- Relative media URLs from the backend are automatically normalized to absolute using `REACT_APP_API_BASE`.

Example `.env`:
```
REACT_APP_API_BASE=http://localhost:3001
REACT_APP_FRONTEND_URL=http://localhost:3000
```

See `.env.example` in this folder for the complete list of supported env vars.

## Getting Started

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

## Notes on Integration

- Auth flows send `Authorization: Bearer <token>` and redirect to login on `401`.
- Endpoints used (from backend OpenAPI):
  - POST `/auth/register`
  - POST `/auth/login` (expects `{ access_token, token_type }`)
  - GET `/auth/me`
  - GET `/recipes` with params `q`, `tag`, `page`, `page_size`
  - GET `/recipes/{id}`
  - POST `/recipes` and PUT `/recipes/{id}` with `RecipeCreate`/`RecipeUpdate` shapes
  - POST `/media/upload` for file uploads; served at `/media/...`
- Recipe details render nested `ingredients`, `steps`, `tags`, and `media_assets`.
- Editor creates/updates recipes mapped to backend schema and handles image uploads to `/media/upload`.

## Smoke-check flow

1. Register → Login (creates a user, then fetches `/auth/me`).
2. Create recipe with image:
   - Use URL or upload via `/media/upload` (response URL is normalized to absolute, and display uses that).
   - Save via POST `/recipes`.
3. List → View → Edit:
   - List from GET `/recipes`.
   - View details at GET `/recipes/{id}`.
   - Edit via PUT `/recipes/{id}`.
4. Share/public:
   - Public viewing assumes backend allows unauthenticated GET on `/recipes` and `/recipes/{id}`.
