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
    info: 'bg-info-500/10 border border-info-500/20 text-info-400',
    success: 'bg-success-500/10 border border-success-500/20 text-success-400',
    warning: 'bg-warning-500/10 border border-warning-500/20 text-warning-400',
    error: 'bg-error-500/10 border border-error-500/20 text-error-400',
  };

  return (
    <div className={`rounded-md p-4 ${styles[type]}`}>
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
              className="text-neutral-400 hover:text-neutral-300 transition-colors"
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
