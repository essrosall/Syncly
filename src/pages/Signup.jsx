import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Input, Button } from '../components/ui';

const Signup = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    window.localStorage.setItem(
      'syncly:demoSession',
      JSON.stringify({ name: data.name, email: data.email, signedInAt: new Date().toISOString() })
    );
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-transparent p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-neutral-100 text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-neutral-100">
            <span className="text-lg font-semibold">S</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-100">Create your account</h1>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Start collaborating with your team.</p>
        </div>

        <Card className="rounded-md border-neutral-200 bg-white/90 shadow-[0_18px_50px_rgba(17,25,43,0.06)] dark:border-neutral-700 dark:bg-neutral-800">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Full name</label>
              <Input placeholder="Your name" {...register('name', { required: 'Name is required' })} error={errors.name && errors.name.message} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">Email</label>
              <Input type="email" placeholder="you@example.com" {...register('email', { required: 'Email is required', pattern: { value: /\\S+@\\S+\\.\\S+/, message: 'Invalid email' } })} error={errors.email && errors.email.message} />
            </div>
              <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Email</label>
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">Password</label>
              <Input type="password" placeholder="Create password" {...register('password', { required: 'Password required', minLength: { value: 8, message: 'Minimum 8 characters' } })} error={errors.password && errors.password.message} />
            </div>
              <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Password</label>
            <Button variant="primary" className="w-full bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600" type="submit">Create account</Button>
          </form>
        </Card>

        <p className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">Already have an account? <Link to="/login" className="font-medium text-neutral-800 hover:text-neutral-950 dark:text-neutral-200 dark:hover:text-neutral-100">Sign in</Link></p>
      </div>
    </div>
  );
};

export default Signup;
