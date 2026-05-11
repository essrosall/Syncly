import React, { useEffect, useState } from 'react';

const VARIANT_STYLES = {
  success: 'bg-emerald-600 text-white',
  error: 'bg-rose-600 text-white',
  warn: 'bg-amber-500 text-black',
  info: 'bg-neutral-900 text-white',
};

const Toast = ({ title, message, variant = 'info', duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(Boolean(message || title));

  useEffect(() => {
    setVisible(Boolean(message || title));
  }, [message, title]);

  useEffect(() => {
    if (!message && !title) return;
    const t = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(t);
  }, [message, title, duration, onClose]);

  if (!message && !title) return null;

  return (
    <div aria-live="polite" className="fixed right-6 top-6 z-50">
      <div
        className={`w-[320px] transform transition-all duration-300 ease-out rounded-md px-4 py-3 shadow-lg ${VARIANT_STYLES[variant] || VARIANT_STYLES.info} ${
          visible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            {title && <div className="font-semibold text-sm mb-0.5">{title}</div>}
            {message && <div className="text-sm text-white/90">{message}</div>}
          </div>
          <button
            aria-label="Close"
            onClick={() => {
              setVisible(false);
              if (onClose) onClose();
            }}
            className="text-white/80 hover:text-white ml-3"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
