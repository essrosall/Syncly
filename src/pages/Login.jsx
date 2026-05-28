import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Button, Alert } from '../components/ui';
import Modal from '../components/ui/Modal';
import logoUrl from '../assets/logo.svg';
import { Mail, Lock, RefreshCcw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ratePassword, pwLabel, pwColor, pwPercent } from '../lib/passwordStrength';

const REMEMBERED_EMAIL_KEY = 'syncly:rememberedEmail';
const LOGIN_WELCOME_NOTICE_KEY = 'syncly:loginWelcomeNotice';
const ACTIVE_LOGIN_SESSION_KEY = 'syncly:activeLoginSession';
const RESET_RESEND_SECONDS = 45;

const OtpCodeInput = ({ value, onChange, disabled = false }) => {
  const inputRefs = useRef([]);
  const digits = Array.from({ length: 6 }, (_, index) => value[index] || '');

  const focusAt = (index) => {
    const input = inputRefs.current[index];
    if (input) input.focus();
  };

  const handleChange = (index, nextValue) => {
    const digit = nextValue.replace(/\D/g, '').slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = digit;
    onChange(nextDigits.join('').slice(0, 6));

    if (digit && index < 5) {
      focusAt(index + 1);
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      focusAt(index - 1);
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      focusAt(index - 1);
    }

    if (event.key === 'ArrowRight' && index < 5) {
      focusAt(index + 1);
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    onChange(pasted);
    focusAt(Math.min(pasted.length, 5));
  };

  return (
    <div className="grid grid-cols-6 gap-2 sm:gap-3">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(node) => {
            inputRefs.current[index] = node;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          className="h-14 rounded-xl border border-neutral-200 bg-white text-center text-xl font-semibold tracking-[0.25em] text-neutral-900 shadow-sm outline-none transition focus:border-success-500 focus:ring-2 focus:ring-success-200 disabled:cursor-not-allowed disabled:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-success-400 dark:focus:ring-success-900/50 dark:disabled:bg-neutral-800"
          aria-label={`One-time code digit ${index + 1}`}
        />
      ))}
    </div>
  );
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formNotice, setFormNotice] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetStep, setResetStep] = useState('email');
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSubmitting, setResetSubmitting] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);
  const resetSubmittedRef = useRef(false);
  const navigate = useNavigate();
  const { signIn, signOut, requestPasswordReset, verifyPasswordResetOtp, updatePassword, isSupabaseConfigured } = useAuth();

  useEffect(() => {
    try {
      const savedEmail = window.localStorage.getItem(REMEMBERED_EMAIL_KEY);
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    } catch {
      // ignore storage issues
    }
  }, []);

  const clearResetState = () => {
    setResetStep('email');
    setResetEmail('');
    setResetCode('');
    setResetPassword('');
    setResetConfirmPassword('');
    setResetMessage('');
    setResetError('');
    setResetSubmitting(false);
    setResendSeconds(0);
    resetSubmittedRef.current = false;
  };

  const openForgotPassword = () => {
    setResetEmail(email);
    setResetStep('email');
    setResetCode('');
    setResetPassword('');
    setResetConfirmPassword('');
    setResetMessage('');
    setResetError('');
    setResendSeconds(0);
    resetSubmittedRef.current = false;
    setForgotPasswordOpen(true);
  };

  const closeForgotPassword = () => {
    setForgotPasswordOpen(false);
    clearResetState();
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setErrorMessage('');
    setFormNotice(null);

    const normalizedEmail = email.trim().toLowerCase();

    const { error } = await signIn({ email: normalizedEmail, password });

    if (error) {
      setErrorMessage(error.message || 'Unable to sign in. Please check your credentials.');
      setSubmitting(false);
      return;
    }

    try {
      const loginSession = {
        email: normalizedEmail,
        signedInAt: new Date().toISOString(),
      };

      window.sessionStorage.setItem(LOGIN_WELCOME_NOTICE_KEY, JSON.stringify(loginSession));
      window.sessionStorage.setItem(ACTIVE_LOGIN_SESSION_KEY, JSON.stringify(loginSession));
    } catch {
      // ignore storage issues
    }

    try {
      if (rememberMe) {
        window.localStorage.setItem(REMEMBERED_EMAIL_KEY, normalizedEmail);
      } else {
        window.localStorage.removeItem(REMEMBERED_EMAIL_KEY);
      }
    } catch {
      // ignore storage issues
    }

    navigate('/');
  };

  const handleSendResetCode = async (e) => {
    e.preventDefault();

    const normalizedEmail = resetEmail.trim().toLowerCase();
    if (!normalizedEmail) {
      setResetError('Email is required.');
      return;
    }

    setResetSubmitting(true);
    setResetError('');
    setResetMessage('');

    const { error, demoCode } = await requestPasswordReset({ email: normalizedEmail });

    if (error) {
      setResetError(error.message || 'We could not send a reset code right now.');
      setResetSubmitting(false);
      return;
    }

    setResetEmail(normalizedEmail);
    setResetStep('otp');
    setResetCode('');
    setResetMessage(
      isSupabaseConfigured
        ? 'Enter the 6-digit code you received by email.'
        : `Demo reset code: ${demoCode}. Enter it below to continue.`
    );
    setResendSeconds(RESET_RESEND_SECONDS);
    setResetSubmitting(false);
  };

  const handleResendResetCode = async () => {
    if (resendSeconds > 0 || resetSubmitting) return;

    setResetSubmitting(true);
    setResetError('');
    setResetMessage('');

    const { error, demoCode } = await requestPasswordReset({ email: resetEmail.trim().toLowerCase() });

    if (error) {
      setResetError(error.message || 'We could not resend the code right now.');
      setResetSubmitting(false);
      return;
    }

    setResetMessage(
      isSupabaseConfigured
        ? 'A new 6-digit code has been sent.'
        : `Demo reset code: ${demoCode}.`
    );
    setResendSeconds(RESET_RESEND_SECONDS);
    setResetSubmitting(false);
  };

  const handleVerifyResetCode = async (e) => {
    e.preventDefault();

    const normalizedEmail = resetEmail.trim().toLowerCase();
    const normalizedCode = resetCode.trim();

    if (normalizedCode.length !== 6) {
      setResetError('Enter the 6-digit code from your email.');
      return;
    }

    setResetSubmitting(true);
    setResetError('');

    const verified = await verifyPasswordResetOtp({ email: normalizedEmail, token: normalizedCode });
    if (verified.error) {
      setResetError(verified.error.message || 'The code could not be verified.');
      setResetSubmitting(false);
      return;
    }

    setResetStep('password');
    setResetMessage('Code verified. Create your new password below.');
    setResetSubmitting(false);
  };

  const handleCompleteReset = async (e) => {
    e.preventDefault();

    const normalizedEmail = resetEmail.trim().toLowerCase();
    const normalizedCode = resetCode.trim();

    if (!normalizedEmail) {
      setResetError('Email is required.');
      return;
    }

    if (!normalizedCode) {
      setResetError('The code is required.');
      return;
    }

    if (ratePassword(resetPassword) < 2) {
      setResetError('Password strength must be Good or Strong.');
      return;
    }

    if (resetPassword !== resetConfirmPassword) {
      setResetError('Passwords do not match.');
      return;
    }

    setResetSubmitting(true);
    setResetError('');

    const updated = await updatePassword({ password: resetPassword });
    if (updated.error) {
      setResetError(updated.error.message || 'We could not update your password.');
      setResetSubmitting(false);
      return;
    }

    try {
      await signOut();
    } catch {
      // ignore sign-out issues after reset
    }

    try {
      window.localStorage.setItem(REMEMBERED_EMAIL_KEY, normalizedEmail);
    } catch {
      // ignore storage issues
    }

    setEmail(normalizedEmail);
    setPassword('');
    setRememberMe(true);
    setResetStep('done');
    setFormNotice({
      type: 'success',
      title: 'Password updated',
      message: 'Your password has been changed. Sign in with the new password now.',
    });
    setResetMessage('Your password has been updated. You can now sign in with the new password.');
    setResetSubmitting(false);
  };

  useEffect(() => {
    if (resetStep !== 'otp') return undefined;

    if (resendSeconds <= 0) return undefined;

    const timer = window.setInterval(() => {
      setResendSeconds((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resetStep, resendSeconds]);

  return (
    <div className="min-h-screen flex bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100 pb-20 sm:pb-0">
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
            <img src={logoUrl} alt="Logo" className="w-10 h-10 mb-4 lg:hidden filter invert dark:invert-0" />
            <h2 className="mt-4 text-3xl font-bold text-neutral-900 dark:text-neutral-100">Sign in to your account</h2>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Enter your credentials to access your workspace.</p>
          </div>

          {formNotice && (
            <div className="mb-4">
              <Alert type={formNotice.type} title={formNotice.title} message={formNotice.message} />
            </div>
          )}

          {!isSupabaseConfigured && (
            <div className="rounded-md border border-neutral-700/60 bg-neutral-800/60 px-3 py-2 text-xs text-neutral-200 mb-4 dark:border-neutral-200/70 dark:bg-neutral-100 dark:text-neutral-700">
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
                className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Password</label>
              <Input
                type="password"
                icon={Lock}
                showPasswordToggle
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-neutral-600 bg-neutral-800 dark:border-neutral-300 dark:bg-white"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me on this device
              </label>
              <button type="button" onClick={openForgotPassword} className="font-medium text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100">
                Forgot password?
              </button>
            </div>

            <Button
              variant="primary"
              className="w-full rounded-md bg-neutral-900 py-3 text-white hover:bg-neutral-800"
              type="submit"
              disabled={submitting}
            >
              Get Started
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-500 mb-3 dark:text-neutral-400">Don&apos;t have an account?{' '}
              <Link to="/signup" className="font-medium text-neutral-900 hover:text-neutral-700 dark:text-neutral-100 dark:hover:text-neutral-300">Create an account</Link>
            </p>
          </div>
        </div>
      </div>

      <Modal
        isOpen={forgotPasswordOpen}
        onClose={closeForgotPassword}
        title="Reset your password"
        className="max-w-xl"
      >
        <div className="space-y-5">
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
            <p className="font-medium text-neutral-900 dark:text-neutral-100">How this works</p>
            <p className="mt-2">
              Enter your email, verify the 6-digit code sent to that inbox, then set a new password here.
            </p>
          </div>

          {resetMessage && (
              <div className="rounded-xl border border-success-200 bg-success-50 px-4 py-3 text-sm text-success-700 dark:border-success-900 dark:bg-success-950/30 dark:text-success-200">
              {resetMessage}
            </div>
          )}

          {resetError && (
            <div className="rounded-xl border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700 dark:border-error-900 dark:bg-error-950/30 dark:text-error-200">
              {resetError}
            </div>
          )}

          {resetStep === 'email' && (
            <form className="space-y-4" onSubmit={handleSendResetCode}>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  icon={Mail}
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100"
                  required
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={closeForgotPassword}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="w-full sm:w-auto bg-neutral-900 text-white hover:bg-neutral-800" disabled={resetSubmitting}>
                  Send code
                </Button>
              </div>
            </form>
          )}

          {resetStep === 'otp' && (
            <form className="space-y-4" onSubmit={handleVerifyResetCode}>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Code sent to {resetEmail}</label>
                <OtpCodeInput value={resetCode} onChange={setResetCode} disabled={resetSubmitting} />
              </div>

              <div className="flex items-center justify-between gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                <span>{resendSeconds > 0 ? `Resend available in 00:${String(resendSeconds).padStart(2, '0')}` : 'Didn’t get a code?'}</span>
                <button
                  type="button"
                  onClick={handleResendResetCode}
                  disabled={resendSeconds > 0 || resetSubmitting}
                  className="inline-flex items-center gap-2 font-medium text-neutral-700 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-300 dark:hover:text-white"
                >
                  <RefreshCcw size={14} />
                  Resend code
                </button>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  className="text-sm font-medium text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
                  onClick={() => {
                    setResetStep('email');
                    setResetCode('');
                    setResetError('');
                    setResetMessage('');
                    setResendSeconds(0);
                  }}
                >
                  Use a different email
                </button>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={closeForgotPassword}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" className="w-full sm:w-auto bg-neutral-900 text-white hover:bg-neutral-800" disabled={resetSubmitting || resetCode.length !== 6}>
                    Verify code
                  </Button>
                </div>
              </div>
            </form>
          )}

          {resetStep === 'password' && (
            <form className="space-y-4" onSubmit={handleCompleteReset}>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">New password</label>
                <Input
                  type="password"
                  placeholder="Create a new password"
                  showPasswordToggle
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                  className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100"
                  required
                />

                <div
                  className={`overflow-hidden transition-all duration-300 ease-out ${resetPassword ? 'max-h-16 opacity-100 translate-y-0 mt-3' : 'max-h-0 opacity-0 -translate-y-1 mt-0 pointer-events-none'}`}
                  aria-hidden={!resetPassword}
                >
                  <div className="h-0.5 w-full bg-neutral-200 rounded-full overflow-hidden">
                    <div
                      className="h-0.5 rounded-full transform origin-left transition-all duration-200 ease-linear"
                      style={{ transform: `scaleX(${resetPassword ? (pwPercent(ratePassword(resetPassword)) / 100) : 0})`, backgroundColor: pwColor(ratePassword(resetPassword)) }}
                      role="progressbar"
                      aria-valuenow={ratePassword(resetPassword)}
                      aria-valuemin={0}
                      aria-valuemax={3}
                      aria-label="Password strength"
                    />
                  </div>
                  <p className="text-xs mt-2 text-neutral-600 dark:text-neutral-400">
                    Password strength: <span className="font-medium">{pwLabel(ratePassword(resetPassword))}</span>
                  </p>
                </div>
              </div>

              <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Confirm new password</label>
                <Input
                  type="password"
                  placeholder="Retype the new password"
                  showPasswordToggle
                  value={resetConfirmPassword}
                  onChange={(e) => setResetConfirmPassword(e.target.value)}
                    className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100"
                  required
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  className="text-sm font-medium text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
                  onClick={() => {
                    setResetStep('otp');
                    setResetPassword('');
                    setResetConfirmPassword('');
                    setResetError('');
                    setResetMessage('');
                  }}
                >
                  Back to code
                </button>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={closeForgotPassword}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" className="w-full sm:w-auto bg-neutral-900 text-white hover:bg-neutral-800" disabled={resetSubmitting || ratePassword(resetPassword) < 2 || resetPassword !== resetConfirmPassword}>
                    Reset password
                  </Button>
                </div>
              </div>
            </form>
          )}

          {resetStep === 'done' && (
            <div className="space-y-4">
              <Alert type="success" title="Password updated" message={resetMessage} />

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={closeForgotPassword}>
                  Close
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  className="w-full sm:w-auto bg-neutral-900 text-white hover:bg-neutral-800"
                  onClick={() => {
                    closeForgotPassword();
                    setEmail(resetEmail);
                    setRememberMe(true);
                  }}
                >
                  Back to sign in
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Login;
