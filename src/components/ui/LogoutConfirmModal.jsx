import { AlertTriangle, LogOut } from 'lucide-react';
import { Button } from './index';

const LogoutConfirmModal = ({ onConfirm, onCancel, isSigningOut = false }) => {
  return (
    <div className="space-y-4">

      <div className="flex items-start gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-[0_14px_35px_rgba(17,25,43,0.06)] dark:border-neutral-700 dark:bg-neutral-800">
        <div className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 text-neutral-700 shadow-sm dark:border-neutral-700 dark:bg-neutral-700 dark:text-neutral-200">
          <AlertTriangle size={18} strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold tracking-tight text-neutral-950 dark:text-neutral-100">
            Are you sure you want to log out?
          </p>
          <p className="mt-1 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            You’ll need to sign in again to continue using Syncly.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-neutral-300">
        <p className="font-medium text-neutral-900 dark:text-neutral-100">Quick note</p>
        <p className="mt-1 leading-6">
          This action will end your current session and return you to the login page.
        </p>
      </div>

      <div className="flex gap-3 pt-1">
        <Button
          variant="secondary"
          className="flex-1 justify-center rounded-md"
          onClick={onCancel}
          disabled={isSigningOut}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          className="flex-1 justify-center rounded-md shadow-sm"
          onClick={onConfirm}
          disabled={isSigningOut}
        >
          <LogOut size={16} />
          {isSigningOut ? 'Logging out…' : 'Log out'}
        </Button>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;