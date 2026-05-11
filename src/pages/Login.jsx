import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Button, Card } from '../components/ui';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    window.localStorage.setItem(
      'syncly:demoSession',
      JSON.stringify({ email, signedInAt: new Date().toISOString() })
    );
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f2e8_0%,#f3ede1_100%)] p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-neutral-900 text-white shadow-sm">
            <span className="text-lg font-semibold">S</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">Welcome back</h1>
          <p className="mt-2 text-sm text-neutral-500">Sign in to continue into your workspace.</p>
        </div>

        <Card className="space-y-6 rounded-md border-neutral-200 bg-white/90 shadow-[0_18px_50px_rgba(17,25,43,0.06)]">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">Email</label>
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
              <label className="mb-2 block text-sm font-medium text-neutral-700">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-neutral-600">
                <input type="checkbox" className="h-4 w-4 rounded border-neutral-300" />
                Remember me
              </label>
              <a href="#" className="font-medium text-neutral-700 hover:text-neutral-950">
                Forgot password?
              </a>
            </div>

            <Button variant="primary" className="w-full bg-neutral-900 text-white hover:bg-neutral-800" type="submit">
              Sign In <ArrowRight size={18} />
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-neutral-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" className="w-full">Google</Button>
            <Button variant="secondary" className="w-full">GitHub</Button>
          </div>
        </Card>

        <p className="mt-6 text-center text-sm text-neutral-500">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-medium text-neutral-800 hover:text-neutral-950">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
