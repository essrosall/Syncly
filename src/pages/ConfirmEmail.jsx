import { Link, useLocation } from 'react-router-dom';
import { Button } from '../components/ui';

const ConfirmEmail = () => {
  const location = useLocation();
  const email = location?.state?.email || '';

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-neutral-900 px-6">
      <div className="max-w-xl xl:max-w-2xl w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Check your email</h1>
        <p className="text-neutral-600 mb-6">We sent a confirmation link to <strong className="text-neutral-900">{email || 'your email'}</strong>. Please follow the link in the message to verify your account.</p>
        <div className="flex justify-center gap-3">
          <Link to="/login">
            <Button variant="outline" className="px-4 py-2">Back to sign in</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmail;
