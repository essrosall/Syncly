import React, { useState } from 'react';
import { Input, Button, Card } from '../components/ui';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: Implement actual authentication
    console.log('Login attempt:', { email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 flex items-center justify-center p-4">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mx-auto mb-4">
            <span className="font-bold text-white text-lg">S</span>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-neutral-900 dark:text-neutral-100">Welcome to Syncly</h1>
          <p className="text-neutral-600 dark:text-neutral-400">Manage tasks and collaborate with your team</p>
        </div>

        {/* Login Form */}
        <Card className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Email Address</label>
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
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Password</label>
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
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-600" />
                <span className="text-neutral-600 dark:text-neutral-400">Remember me</span>
              </label>
              <a href="#" className="text-primary-400 hover:text-primary-300 font-medium">
                Forgot password?
              </a>
            </div>

            <Button variant="primary" className="w-full" type="submit">
              Sign In <ArrowRight size={18} />
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200 dark:border-neutral-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400">Or continue with</span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" className="w-full">Google</Button>
            <Button variant="secondary" className="w-full">GitHub</Button>
          </div>
        </Card>

        {/* Sign Up Link */}
        <p className="text-center text-neutral-400 text-sm mt-6">
          Don't have an account?{' '}
          <a href="/signup" className="text-primary-400 hover:text-primary-300 font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
