import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Button } from '../components/ui';
import PolicyModal from '../components/ui/PolicyModal';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import logoUrl from '../assets/logo.svg';

const Signup = () => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPolicy, setShowPolicy] = useState(null); // 'terms' | 'privacy' | null
  const { signUp, isSupabaseConfigured } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setSubmitting(true);
    setErrorMessage('');

    const fullName = [data.firstName, data.middleName, data.lastName].filter(Boolean).join(' ');

    const { error } = await signUp({
      email: data.email,
      password: data.password,
      name: fullName,
    });

    if (error) {
      setErrorMessage(error.message || 'Unable to create account. Please try again.');
      setSubmitting(false);
      return;
    }

    // Navigate to confirmation screen where user is instructed to check email
    navigate('/confirm-email', { state: { email: data.email } });
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-1/2 min-h-screen bg-neutral-900">
        <div className="h-full flex flex-col justify-center items-start px-12">
          <div className="w-20 h-20 mb-6">
            <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-4xl font-extrabold text-neutral-50 leading-tight mb-4">Your workspace, simplified</h1>
          <p className="text-base text-neutral-300 max-w-md">Organize tasks, notes, and projects in one place — clear, focused, and fast.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 min-h-screen flex items-center bg-white text-neutral-900">
        <div className="w-full px-12 lg:px-24 py-10 lg:py-16 max-w-lg xl:max-w-2xl mx-auto">
          <div className="mb-6">
            <h2 className="mt-4 text-3xl font-bold">Create your account</h2>
            <p className="mt-2 text-sm text-neutral-600">Start collaborating with your team.</p>
          </div>

          {!isSupabaseConfigured && (
            <div className="rounded-md border border-neutral-700/60 bg-neutral-800/60 px-3 py-2 text-xs text-neutral-200 mb-4">
              Supabase environment variables are not configured yet. Running in local demo auth mode.
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">Name</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Input placeholder="First name" {...register('firstName', { required: 'First name is required' })} error={errors.firstName && errors.firstName.message} className="bg-white text-neutral-900" />
                </div>
                <div>
                  <Input placeholder="Middle name" {...register('middleName')} className="bg-white text-neutral-900" />
                </div>
                <div>
                  <Input placeholder="Last name" {...register('lastName', { required: 'Last name is required' })} error={errors.lastName && errors.lastName.message} className="bg-white text-neutral-900" />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">Email</label>
              <Input type="email" placeholder="you@example.com" {...register('email', { required: 'Email is required', pattern: { value: /\\S+@\\S+\\.\\S+/, message: 'Invalid email' } })} error={errors.email && errors.email.message} className="bg-white text-neutral-900" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">Password</label>
              <Input type="password" placeholder="Create password" showPasswordToggle {...register('password', { required: 'Password required', minLength: { value: 8, message: 'Minimum 8 characters' } })} error={errors.password && errors.password.message} className="bg-white text-neutral-900" />
            </div>

            <div className="flex items-start gap-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('terms', { required: 'You must agree to the terms and privacy policy' })}
                  id="terms"
                  className="h-4 w-4 rounded border-neutral-300"
                />
              </div>
                <label htmlFor="terms" className="text-sm text-neutral-600">
                  I agree to the <button type="button" onClick={() => setShowPolicy('terms')} className="text-neutral-900 font-medium underline">Terms of Service</button> and <button type="button" onClick={() => setShowPolicy('privacy')} className="text-neutral-900 font-medium underline">Privacy Policy</button>.
                </label>
            </div>

              <PolicyModal
                initialSection={showPolicy || 'terms'}
                isOpen={!!showPolicy}
                onClose={() => setShowPolicy(null)}
                onAccept={() => {
                  setValue('terms', true, { shouldValidate: true, shouldDirty: true });
                  setShowPolicy(null);
                }}
              />

            {errors.terms && (
              <p className="text-sm text-error-500">{errors.terms.message}</p>
            )}

            {errorMessage && (
              <p className="text-sm text-error-500">{errorMessage}</p>
            )}

            <Button
              variant="primary"
              className="w-full bg-neutral-900 text-white hover:brightness-95 py-3 rounded-md"
              type="submit"
              disabled={submitting}
            >
              Create account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-500 mb-3">Already have an account?{' '}
              <Link to="/login" className="font-medium text-neutral-900 hover:text-neutral-700">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

