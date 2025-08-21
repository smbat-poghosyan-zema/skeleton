# Monorepo Skeleton

This repository houses a frontend React application and a backend NestJS API.

## Layout

- `frontend/` – Vite + React + TypeScript + Tailwind
- `backend/` – NestJS API server
- `docker-compose.yml` – development stack with MongoDB

## Quickstart

```bash
# install dependencies
cd frontend && npm install
cd ../backend && npm install
```

## Running with Docker Compose

Ensure Docker is installed, then run:

```bash
docker compose up --build
```

- Frontend: http://localhost:8080
- Backend: http://localhost:3000

