# Agents Guide

This document provides conventions and rules for all contributors.

## Changelog Rules
- File: `CHANGELOG.md` at repository root.
- Follow [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format.
- Place entries under the `## [Unreleased]` section using `### Added`, `### Changed`, etc.
- Every task must add at least one bullet describing the change.

## Interdependent Changes
- Update related modules, schemas, endpoints, and frontend code together in the same task.

## Code Conventions
- **Backend (NestJS)**: use module-based structure (`src/<feature>/<feature>.module.ts`).
- **Frontend**: use feature-based folders under `src/features`.
- Run Prettier and ESLint before committing.
- Naming: `PascalCase` for classes/components, `camelCase` for variables/functions, `kebab-case` for filenames.

## Docker Requirements
- Prefer environment variables for configuration.
- When adding dependencies or services, update Dockerfiles and `docker-compose.yml` accordingly.

## Running & Testing
- Install dependencies with `npm install` in affected packages.
- Run `npm run lint` and tests (`npm test` if available`) before committing.
- Use `docker compose up --build` to run the full stack.

## Updating This Document
- Expand this guide as new conventions emerge.
- Adjust relevant sections within the same commit as the change.
- Reflect modifications in `CHANGELOG.md`.

