import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, Input, Button } from '../components/ui';

const Signup = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log('Signup data', data);
    // TODO: send to auth backend (Supabase) when ready
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 flex items-center justify-center p-4">
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mx-auto mb-4">
            <span className="font-bold text-white text-lg">S</span>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-neutral-900 dark:text-neutral-100">Create your account</h1>
          <p className="text-neutral-600 dark:text-neutral-400">Start collaborating with your team</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Full name</label>
              <Input placeholder="Your name" {...register('name', { required: 'Name is required' })} error={errors.name && errors.name.message} />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Email</label>
              <Input type="email" placeholder="you@example.com" {...register('email', { required: 'Email is required', pattern: { value: /\\S+@\\S+\\.\\S+/, message: 'Invalid email' } })} error={errors.email && errors.email.message} />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Password</label>
              <Input type="password" placeholder="Create password" {...register('password', { required: 'Password required', minLength: { value: 8, message: 'Minimum 8 characters' } })} error={errors.password && errors.password.message} />
            </div>

            <Button variant="primary" className="w-full" type="submit">Create account</Button>
          </form>
        </Card>

        <p className="text-center text-neutral-600 dark:text-neutral-400 text-sm mt-6">Already have an account? <a href="/login" className="text-primary-400">Sign in</a></p>
      </div>
    </div>
  );
};

export default Signup;
