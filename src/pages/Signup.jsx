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
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f2e8_0%,#f3ede1_100%)] p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-900 text-white shadow-sm">
            <span className="text-lg font-semibold">S</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">Create your account</h1>
          <p className="mt-2 text-sm text-neutral-500">Start collaborating with your team.</p>
        </div>

        <Card className="rounded-md border-neutral-200 bg-white/90 shadow-[0_18px_50px_rgba(17,25,43,0.06)]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">Full name</label>
              <Input placeholder="Your name" {...register('name', { required: 'Name is required' })} error={errors.name && errors.name.message} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">Email</label>
              <Input type="email" placeholder="you@example.com" {...register('email', { required: 'Email is required', pattern: { value: /\\S+@\\S+\\.\\S+/, message: 'Invalid email' } })} error={errors.email && errors.email.message} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">Password</label>
              <Input type="password" placeholder="Create password" {...register('password', { required: 'Password required', minLength: { value: 8, message: 'Minimum 8 characters' } })} error={errors.password && errors.password.message} />
            </div>

            <Button variant="primary" className="w-full bg-neutral-900 text-white hover:bg-neutral-800" type="submit">Create account</Button>
          </form>
        </Card>

        <p className="mt-6 text-center text-sm text-neutral-500">Already have an account? <Link to="/login" className="font-medium text-neutral-800 hover:text-neutral-950">Sign in</Link></p>
      </div>
    </div>
  );
};

export default Signup;
