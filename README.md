# recipe-hub-36503-36536

Frontend-Backend Integration Notes

- Frontend env:
  - REACT_APP_API_BASE defaults to http://localhost:3001
  - See recipe_app_frontend/.env.example for full list
- Backend expectations for compatibility:
  - CORS must include http://localhost:3000
  - Static media is mounted at /media
  - Upload endpoint is POST /media/upload
- The frontend normalizes relative media URLs (e.g., "/media/abc.jpg") to absolute using REACT_APP_API_BASE.
- Auth: Bearer token attached automatically via axios interceptor; 401 triggers logout event.