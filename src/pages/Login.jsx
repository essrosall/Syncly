import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Button } from '../components/ui';
import logoUrl from '../assets/logo.svg';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { signIn, isSupabaseConfigured } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setErrorMessage('');

    const { error } = await signIn({ email, password });

    if (error) {
      setErrorMessage(error.message || 'Unable to sign in. Please check your credentials.');
      setSubmitting(false);
      return;
    }

    navigate('/');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left hero - full height visual (black background, logo) */}
      <div className="hidden lg:flex w-1/2 min-h-screen bg-neutral-900">
        <div className="h-full flex flex-col justify-center items-start px-12">
          <div className="w-20 h-20 mb-6">
            <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-4xl font-extrabold text-neutral-50 leading-tight mb-4">Your workspace, simplified</h1>
          <p className="text-base text-neutral-300 max-w-md">Organize tasks, notes, and projects in one place — clear, focused, and fast.</p>
        </div>
      </div>

      {/* Right form - full height, minimal */}
      <div className="w-full lg:w-1/2 min-h-screen flex items-center bg-white text-neutral-900">
        <div className="w-full px-8 lg:px-12 py-10 lg:py-16 max-w-md mx-auto">
          <div className="mb-6">
            <h2 className="mt-4 text-3xl font-bold">Sign in to your account</h2>
            <p className="mt-2 text-sm text-neutral-600">Enter your credentials to access your workspace.</p>
          </div>

          {!isSupabaseConfigured && (
            <div className="rounded-md border border-neutral-700/60 bg-neutral-800/60 px-3 py-2 text-xs text-neutral-200 mb-4">
              Supabase environment variables are not configured yet. Running in local demo auth mode.
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white text-neutral-900"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">Password</label>
              <Input
                type="password"
                icon={Lock}
                showPasswordToggle
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white text-neutral-900"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-neutral-700">
                <input type="checkbox" className="h-4 w-4 rounded border-neutral-600 bg-neutral-800" />
                Remember me
              </label>
              <a href="#" className="font-medium text-neutral-700 hover:text-neutral-900">Forgot password?</a>
            </div>

            <Button
              variant="primary"
              className="w-full bg-neutral-900 text-white hover:brightness-95 py-3 rounded-md"
              type="submit"
              disabled={submitting}
            >
              Get Started
            </Button>
          </form>

          {/* Removed OAuth buttons for now — simple flow only */}
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-500 mb-3">Don&apos;t have an account? Create one to get started.</p>
            <div className="flex justify-center">
              <Link to="/signup">
                <Button variant="outline" className="px-4 py-2 rounded-md text-sm text-neutral-900 border-neutral-300">Create an account</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
