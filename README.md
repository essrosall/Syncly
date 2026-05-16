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

## Email confirmation setup

For real account verification, the simplest free option is **Resend**. It has a generous free tier and works well as the SMTP provider for Supabase Auth.

### Recommended setup

1. Create a free account at [Resend](https://resend.com).
2. Verify your sender domain or sender address in Resend.
3. In your Supabase project, go to **Authentication → Providers / Email** and enable email confirmations.
4. Set Supabase SMTP to Resend:
	- **Host:** `smtp.resend.com`
	- **Port:** `587`
	- **Username:** `resend`
	- **Password:** your Resend API key
5. Add your app URL and redirect URL so the confirmation link returns to `/confirm-email`.

### Notes

- The app already routes users to `/confirm-email` after signup.
- If Supabase email confirmations are enabled, the account will stay unconfirmed until the user clicks the email link.
- If you want a second free option, Brevo is also a common SMTP provider, but Resend is usually the easiest to set up.

## Run

```bash
npm run dev
```

## Build

```bash
npm run build
```
