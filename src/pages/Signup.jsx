import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Button } from '../components/ui';
import PolicyModal from '../components/ui/PolicyModal';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import logoUrl from '../assets/logo.svg';

// Password strength helpers
const ratePassword = (pw = '') => {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 1;
  if (/[0-9]/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  // normalize to 0..3
  if (score <= 1) return 0; // weak
  if (score === 2) return 1; // so-so
  if (score === 3) return 2; // good
  return 3; // strong
};

const pwLabel = (score) => (score === 0 ? 'Weak' : score === 1 ? 'Fair' : score === 2 ? 'Good' : 'Strong');
const pwColor = (score) => (score === 0 ? '#ef4444' : score === 1 ? '#f97316' : score === 2 ? '#f59e0b' : '#10b981');
const pwPercent = (score) => (score === 0 ? 8 : score === 1 ? 33 : score === 2 ? 66 : 100);

const Signup = () => {
  const { register, handleSubmit, formState: { errors }, setValue, watch, getValues } = useForm();
  const email = watch('email', '');
  const password = watch('password', '');
  const confirm = watch('confirmPassword', '');
  const termsAccepted = watch('terms', false);
  const [confirmFocused, setConfirmFocused] = useState(false);
  const confirmState = confirmFocused && confirm.length > 0
    ? (confirm === password ? 'match' : 'mismatch')
    : 'idle';
  const canSubmit =
    email.trim().length > 0 &&
    password.length > 0 &&
    confirm.length > 0 &&
    ratePassword(password) >= 2 &&
    confirm === password &&
    Boolean(termsAccepted);

  useEffect(() => {
    // If password is empty or strength drops below Good, clear confirmPassword
    if (!password || ratePassword(password) < 2) {
      const current = getValues('confirmPassword');
      if (current) {
        setValue('confirmPassword', '', { shouldDirty: true, shouldValidate: true });
      }
    }
  }, [password, setValue, getValues]);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPolicy, setShowPolicy] = useState(null); // 'terms' | 'privacy' | null
  const { signUp, isSupabaseConfigured } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setSubmitting(true);
    setErrorMessage('');

    const { error } = await signUp({
      email: data.email,
      password: data.password,
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
              <label className="mb-2 block text-sm font-medium text-neutral-700">Email</label>
              <Input type="email" placeholder="you@example.com" {...register('email', { required: 'Email is required', setValueAs: v => (typeof v === 'string' ? v.trim() : v), pattern: { value: /\\S+@\\S+\\.\\S+/, message: 'Invalid email' } })} error={errors.email && errors.email.message} className="bg-white text-neutral-900" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">Password</label>
              <Input
                type="password"
                placeholder="Create password"
                showPasswordToggle
                {...register('password', {
                  required: 'Password required',
                  minLength: { value: 8, message: 'Minimum 8 characters' },
                  validate: (val) => {
                    const score = ratePassword(val);
                    return score >= 2 || 'Password strength must be Good or Strong';
                  }
                })}
                error={errors.password && errors.password.message}
                className={`bg-white text-neutral-900`}
              />

              {/* Password strength indicator (moving line) */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-out ${password ? 'max-h-16 opacity-100 translate-y-0 mt-3' : 'max-h-0 opacity-0 -translate-y-1 mt-0 pointer-events-none'}`}
                aria-hidden={!password}
              >
                <div className="h-0.5 w-full bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="h-0.5 rounded-full transform origin-left transition-all duration-200 ease-linear"
                    style={{ transform: `scaleX(${password ? (pwPercent(ratePassword(password)) / 100) : 0})`, backgroundColor: pwColor(ratePassword(password)) }}
                    role="progressbar"
                    aria-valuenow={ratePassword(password)}
                    aria-valuemin={0}
                    aria-valuemax={3}
                    aria-label="Password strength"
                  />
                </div>
                <p className="text-xs mt-2 text-neutral-600">Password strength: <span className="font-medium">{pwLabel(ratePassword(password))}</span></p>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">Confirm password</label>
              <Input
                type="password"
                placeholder="Confirm password"
                showPasswordToggle
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (val) => val === getValues('password') || 'Passwords do not match'
                })}
                error={errors.confirmPassword && errors.confirmPassword.message}
                className={`bg-white text-neutral-900 ${( !password || ratePassword(password) < 2) ? 'opacity-60 bg-neutral-50 cursor-not-allowed' : ''}`}
                style={confirmState === 'match' ? { borderColor: '#10b981', boxShadow: '0 0 0 1px #10b981', transition: 'border-color 150ms ease, box-shadow 150ms ease' } : confirmState === 'mismatch' ? { borderColor: '#ef4444', boxShadow: '0 0 0 1px #ef4444', transition: 'border-color 150ms ease, box-shadow 150ms ease' } : { transition: 'border-color 150ms ease, box-shadow 150ms ease' }}
                disabled={!password || ratePassword(password) < 2}
                aria-disabled={!password || ratePassword(password) < 2}
                onFocus={() => setConfirmFocused(true)}
                onBlur={() => setConfirmFocused(false)}
              />
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
              disabled={submitting || !canSubmit}
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

