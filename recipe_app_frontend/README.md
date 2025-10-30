# Lightweight React Template for KAVIA

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

## Features

- Lightweight and modern UI
- Minimal dependencies for quick loading times
- Simple to understand and extend

## Environment

- Frontend reads API base URL from `REACT_APP_API_BASE` (defaults to `http://localhost:3001`).
- Backend CORS should allow `http://localhost:3000`.
- Backend serves media under `/media` and accepts uploads at `/media/upload`.

Example `.env`:
```
REACT_APP_API_BASE=http://localhost:3001
REACT_APP_FRONTEND_URL=http://localhost:3000
```

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
- Recipe list parameters: `q`, `tag`, `page`, `page_size`.
- Recipe details render nested `ingredients`, `steps`, `tags`, and `media_assets`.
- Editor creates/updates recipes mapped to backend schema and handles image uploads to `/media/upload`.
