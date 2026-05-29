import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Input, Button } from '../components/ui';
import PolicyModal from '../components/ui/PolicyModal';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import logoUrl from '../assets/logo.svg';
import { ratePassword, pwLabel, pwColor, pwPercent } from '../lib/passwordStrength';

const Signup = () => {
  const { register, handleSubmit, formState: { errors }, setValue, watch, getValues, clearErrors, trigger } = useForm({ mode: 'onChange' });
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

  // Re-run confirm password validation whenever either password field changes.
  useEffect(() => {
    if (!confirm) return;

    if (confirm === password) {
      clearErrors('confirmPassword');
      return;
    }

    trigger('confirmPassword');
  }, [password, confirm, clearErrors, trigger]);

  // Clear email validation error as user types a valid email
  useEffect(() => {
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : email;
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
    if (errors.email && emailValid) {
      clearErrors('email');
    }
  }, [email, errors.email, clearErrors]);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPolicy, setShowPolicy] = useState(null); // 'terms' | 'privacy' | null
  const { signUp, isSupabaseConfigured } = useAuth();
  const [confirmationEmail, setConfirmationEmail] = useState('');

  const pageTitle = 'Create your account';
  const pageSubtitle = 'Start collaborating with your team.';

  const onSubmit = async (data) => {
    try { console.log('[Signup] onSubmit start', { data }); } catch (e) {}
    setSubmitting(true);
    setErrorMessage('');

    const { error } = await signUp({
      email: typeof data.email === 'string' ? data.email.trim().toLowerCase() : data.email,
      password: data.password,
    });

    if (error) {
      setErrorMessage(error.message || 'Unable to create account. Please try again.');
      setSubmitting(false);
      return;
    }

    setConfirmationEmail(typeof data.email === 'string' ? data.email.trim().toLowerCase() : data.email);
    setSubmitting(false);
  };

  const onInvalid = (validationErrors) => {
    const summary = Object.entries(validationErrors || {})
      .map(([key, value]) => `${key}: ${value?.message || 'invalid'}`)
      .join(' | ');
    try { console.log('[Signup] validation blocked submit', validationErrors, summary); } catch (e) {}
    setErrorMessage(summary ? `Validation blocked submit: ${summary}` : 'Validation blocked the submit. Check the console for details.');
  };

  return (
    <div className="min-h-screen flex bg-white text-neutral-00 dark:bg-neutral-900 dark:text-neutral-100 pb-20 sm:pb-0">
      <div className="hidden lg:flex w-1/2 min-h-screen bg-neutral-900 text-neutral-50">
        <div className="h-full flex flex-col justify-center items-start px-12">
          <div className="w-20 h-20 mb-6">
            <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-4xl font-extrabold text-neutral-50 leading-tight mb-4">Your workspace, simplified</h1>
          <p className="text-base text-neutral-300 max-w-md">Organize tasks, notes, and projects in one place — clear, focused, and fast.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 min-h-screen flex items-center bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
        <div className="w-full px-12 lg:px-24 py-10 lg:py-16 max-w-lg xl:max-w-2xl mx-auto">
          <div className="mb-6">
            <h2 className="mt-4 text-3xl font-bold text-neutral-100 dark:text-neutral-900">{pageTitle}</h2>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{pageSubtitle}</p>
          </div>

          {!isSupabaseConfigured && (
            <div className="rounded-md border border-neutral-700/60 bg-neutral-800/60 px-3 py-2 text-xs text-neutral-200 mb-4 dark:border-neutral-200/70 dark:bg-neutral-100 dark:text-neutral-700">
              Supabase environment variables are not configured yet. Running in local demo auth mode.
            </div>
          )}

          {!confirmationEmail ? (
          <form onSubmit={handleSubmit(onSubmit, onInvalid)} onSubmitCapture={() => { try { console.log('[Signup] form onSubmitCapture'); } catch (e) {} }} className="space-y-5">

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                {...register('email', {
                  required: 'Email is required',
                  setValueAs: (v) => (typeof v === 'string' ? v.trim().toLowerCase() : v),
                  validate: (val) => {
                    if (!val) return 'Email is required';
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Invalid email';
                  },
                })}
                error={errors.email && errors.email.message}
                className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Password</label>
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
                className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100"
              />

              <div
                className={`overflow-hidden transition-all duration-300 ease-out ${password ? 'max-h-16 opacity-100 translate-y-0 mt-3' : 'max-h-0 opacity-0 -translate-y-1 mt-0 pointer-events-none'}`}
                aria-hidden={!password}
              >
                <div className="h-0.5 w-full bg-neutral-200 rounded-full overflow-hidden dark:bg-neutral-700">
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
                <p className="text-xs mt-2 text-neutral-600 dark:text-neutral-400">Password strength: <span className="font-medium">{pwLabel(ratePassword(password))}</span></p>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Confirm password</label>
              <Input
                type="password"
                placeholder="Confirm password"
                showPasswordToggle
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (val) => val === getValues('password') || 'Passwords do not match'
                })}
                error={errors.confirmPassword && errors.confirmPassword.message}
                className={`bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100 ${( !password || ratePassword(password) < 2) ? 'opacity-60 bg-neutral-50 cursor-not-allowed dark:bg-neutral-800' : ''}`}
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
                <label htmlFor="terms" className="text-sm text-neutral-600 dark:text-neutral-400">
                  I agree to the <button type="button" onClick={() => setShowPolicy('terms')} className="text-neutral-900 font-medium underline dark:text-neutral-100">Terms of Service</button> and <button type="button" onClick={() => setShowPolicy('privacy')} className="text-neutral-900 font-medium underline dark:text-neutral-100">Privacy Policy</button>.
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
              className="w-full rounded-md bg-neutral-900 py-3 text-white hover:bg-neutral-800"
              type="submit"
              disabled={submitting || !canSubmit}
              onClick={() => {
                try { console.log('[Signup] Create account clicked', { submitting, canSubmit }); } catch (e) {}
              }}
            >
              Create account
            </Button>

            <p className="text-center text-sm text-neutral-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-neutral-900">
                Sign in
              </Link>
            </p>
          </form>
          ) : (
            <div className="space-y-5 rounded-base border border-neutral-200 bg-neutral-50 p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-none">
              <div>
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Check your email</h3>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                  We sent a confirmation link to <span className="font-medium text-neutral-900 dark:text-neutral-100">{confirmationEmail}</span>. Open it to verify your account and finish signing in.
                </p>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-white p-4 text-sm text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                <p className="font-medium text-neutral-900 dark:text-neutral-100">What to do next</p>
                <ul className="mt-2 space-y-2 list-disc pl-5">
                  <li>Check your inbox and spam folder.</li>
                  <li>Click the confirmation link in the message.</li>
                </ul>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link to="/login" className="inline-flex w-full sm:w-auto items-center justify-center rounded-md bg-neutral-900 px-4 py-3 text-sm font-medium text-white hover:brightness-95">
                  Sign in
                </Link>
                <button
                  type="button"
                  className="inline-flex w-full sm:w-auto items-center justify-center rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm font-medium text-neutral-900 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
                  onClick={() => {
                    setConfirmationEmail('');
                    setErrorMessage('');
                  }}
                >
                  Back to signup
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;

