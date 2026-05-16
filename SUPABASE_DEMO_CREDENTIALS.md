Demo Supabase test account

- Purpose: quick test account for local/manual testing of Supabase-backed features.

Credentials (suggested test user):
- Email: demo@syncly.app
- Password: DemoPass123!

Notes:
- Create this user via the app Signup page or directly in the Supabase Auth → Users panel.
- Do NOT use this account for production or real data.
- For full admin operations (migrations), use the Supabase service role key stored securely in server/CI env vars as `SUPABASE_SERVICE_ROLE_KEY`. Never expose the service role key to client code or commit it to the repo.

Testing steps:
1. Start the dev server: `npm run dev`.
2. Open the app and sign up using the demo credentials or create the user from the Supabase dashboard.
3. After signing in, create a task; it should persist to the `tasks` table in your Supabase project.
4. Check `notifications` and `task_comments` in the Supabase Table editor to verify persisted data.

If you want, I can create the test user for you given a secure way to provide the admin key, or you can create it manually in Supabase.