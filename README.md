# 🚀 Syncly

**Syncly** is a modern web-based productivity and collaboration platform designed to help students, teams, and organizations manage tasks, schedules, and workflows in a centralized workspace.

---

## 📋 Prerequisites

Before getting started, ensure you have the following installed:

* Node.js 18+
* npm 9+

---

## ⚙️ Setup

### 1. Clone the Repository

```bash
git clone https://github.com/essrosall/Syncly.git
cd Syncly
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a local environment file:

```bash
cp .env.example .env
```

Then configure the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **Note:** If these variables are not configured, Syncly will run in local demo authentication mode for development purposes.

---

## 🔐 Email Confirmation Setup

For production environments, email verification is recommended to ensure account security.

### Recommended SMTP Provider: Resend

Resend offers a generous free tier and integrates seamlessly with Supabase Authentication.

### Setup Instructions

1. Create an account at https://resend.com
2. Verify your sender email address or domain.
3. Open your Supabase Dashboard.
4. Navigate to:

```text
Authentication → Providers → Email
```

5. Enable **Email Confirmations**.
6. Configure SMTP using the following settings:

```text
Host: smtp.resend.com
Port: 587
Username: resend
Password: YOUR_RESEND_API_KEY
```

7. Configure your application's Site URL and Redirect URL so users are redirected back to:

```text
/confirm-email
```

### Notes

* After registration, users are automatically redirected to the email confirmation page.
* Accounts remain unverified until the confirmation link is clicked.
* Brevo can also be used as an alternative SMTP provider if preferred.

---

## 🚀 Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

---

## 📦 Building for Production

Generate an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 🛠 Tech Stack

* React
* Vite
* JavaScript
* Tailwind CSS
* Supabase
* PostgreSQL
* Vercel

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

### Syncly

**Stay Connected. Stay Organized. Stay Productive.**

</div>
