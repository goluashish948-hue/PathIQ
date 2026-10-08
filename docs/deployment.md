# Deployment & Environment Guide

## 1. Local Zero-Docker Standalone Run
PathIQ is pre-configured to run locally with zero cloud or Docker dependencies using SQLite and mock adapters:
```bash
# 1. Install dependencies
npm install

# 2. Push database schema & seed demo data
npm run migrate
npm run seed

# 3. Start development server (API: 5000, Client: 5173)
npm run dev
```

## 2. Production Docker Deployment
For full production with PostgreSQL, Redis, MinIO, and MailHog:
```bash
docker compose up -d
```
All environment variables are documented in `.env.example`.
