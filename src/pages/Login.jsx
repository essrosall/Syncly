import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Button, Card } from '../components/ui';
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
    <div className="min-h-screen bg-transparent p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-neutral-100 text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-neutral-100">
            <span className="text-lg font-semibold">S</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-100">Welcome back</h1>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Sign in to continue into your workspace.</p>
        </div>

        <Card className="space-y-6 rounded-md border-neutral-200 bg-white/90 shadow-[0_18px_50px_rgba(17,25,43,0.06)] dark:border-neutral-700 dark:bg-neutral-800">
          {!isSupabaseConfigured && (
            <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:border-amber-700/40 dark:bg-amber-900/20 dark:text-amber-300">
              Supabase environment variables are not configured yet. Running in local demo auth mode.
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                icon={Lock}
                showPasswordToggle
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {errorMessage && (
              <p className="text-sm text-error-500">{errorMessage}</p>
            )}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                <input type="checkbox" className="h-4 w-4 rounded border-neutral-300 dark:border-neutral-700" />
                Remember me
              </label>
              <a href="#" className="font-medium text-neutral-700 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-neutral-100">
                Forgot password?
              </a>
            </div>

            <Button variant="primary" className="w-full bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600" type="submit" disabled={submitting}>
              Sign In <ArrowRight size={18} />
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200 dark:border-neutral-800" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" className="w-full">Google</Button>
            <Button variant="secondary" className="w-full">GitHub</Button>
          </div>
        </Card>

        <p className="mt-6 text-center text-sm text-neutral-500">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-medium text-neutral-800 hover:text-neutral-950 dark:text-neutral-200 dark:hover:text-neutral-100">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
