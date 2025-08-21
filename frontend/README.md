# Frontend

React frontend for LunchSync. Requires the backend API URL via `VITE_API_URL`.

## Development

```bash
npm install
VITE_API_URL=http://localhost:3000 npm run dev
```

## Production

```bash
VITE_API_URL=http://localhost:3000 npm run build
npm run preview
```

Routes are served through React Router. Authentication uses JWT stored in
localStorage and role-based guards. Run `npm run lint` before committing.
