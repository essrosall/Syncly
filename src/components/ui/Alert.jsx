import React from 'react';
import { X } from 'lucide-react';

const Alert = ({
  type = 'info',
  title,
  message,
  onClose,
  action,
}) => {
  const styles = {
    info: 'bg-info-50 border border-info-200 text-info-800 dark:bg-info-950/40 dark:border-info-800 dark:text-info-100',
    success: 'bg-success-50 border border-success-200 text-success-800 dark:bg-success-950/35 dark:border-success-800 dark:text-success-100',
    warning: 'bg-warning-50 border border-warning-200 text-warning-800 dark:bg-warning-950/35 dark:border-warning-800 dark:text-warning-100',
    error: 'bg-error-50 border border-error-200 text-error-800 dark:bg-error-950/35 dark:border-error-800 dark:text-error-100',
  };

  return (
    <div className={`rounded-base p-4 ${styles[type]}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          {title && <h3 className="font-semibold mb-1">{title}</h3>}
          {message && <p className="text-sm opacity-90">{message}</p>}
        </div>
        <div className="flex items-center gap-2">
          {action && <button onClick={action.onClick} className="text-sm font-medium hover:underline">{action.label}</button>}
          {onClose && (
            <button
              onClick={onClose}
              className="text-current/60 hover:text-current transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alert;
