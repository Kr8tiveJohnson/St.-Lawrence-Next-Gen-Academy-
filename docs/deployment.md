# Deployment Guide — St. Lawrence Next Gen Academy

## Architecture Overview
- **Frontend** — React (Vite) → deployed to Vercel / Netlify / Cloudflare Pages
- **Backend** — Node.js/Express → deployed to Railway / Render / AWS / DigitalOcean
- **Database** — PostgreSQL → managed instance (Railway / Supabase / AWS RDS)
- **Cache** — Redis → Upstash (serverless) or managed Redis
- **Video** — Mux or Cloudflare Stream (managed adaptive streaming)
- **Media** — Cloudinary or AWS S3 (profile photos)
- **Payments** — Paystack (Nigeria primary) + Flutterwave (international)
- **Email** — SendGrid or Postmark

## Environment Setup
1. Copy `.env.example` to `server/.env`
2. Fill in all required values
3. Run `docker-compose up -d` for local Postgres + Redis

## CI/CD
- GitHub Actions recommended
- On push to `main`: run tests → build → deploy

## Mobile Apps (Future)
- React Native or Flutter for iOS/Android
- Shares the same backend API
- Confirm with client before starting (brief §9 open question)
