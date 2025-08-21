# Backend

NestJS API providing authentication, user management, restaurants and menu
endpoints backed by MongoDB.

## Development

```bash
npm install
npm run start:dev
```

## Production

```bash
npm run build
npm run start:prod
```

## Auth

Authenticate with `POST /auth/login` using email and password. Register a new
user via `POST /auth/register`. Include the returned JWT in the `Authorization`
header for secured endpoints.

## Endpoints Overview

- `GET /restaurants` – list restaurants (auth required)
- `POST /restaurants` – create restaurant (admin)
- `POST /restaurants/:restaurantId/menu-items` – manage menu items (admin for
  write, any user for read)
- `POST /users` – manage users (admin)

## Utilities

- `npm run seed` – create default admin user using `ADMIN_EMAIL` and
  `ADMIN_PASSWORD` env vars.
- `npm run migrate` – run MongoDB migrations via `migrate-mongo`.
- `npm run migration:create <name>` – create a new migration skeleton.


