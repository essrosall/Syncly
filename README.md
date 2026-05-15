# Syncly

Syncly is a web-based productivity and collaboration management system.

## Prerequisites

- Node.js 18+
- npm 9+

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

```bash
cp .env.example .env
```

Then set:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

If these are not set, the app runs in local demo auth mode for development.

## Run

```bash
npm run dev
```

## Build

```bash
npm run build
```
