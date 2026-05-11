import React, { createContext, useContext, useCallback, useState } from 'react';

const ToastContext = createContext(null);

let toastId = 1;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ title, message, variant = 'info', duration = 4000 }) => {
    const id = String(toastId++);
    setToasts((t) => [...t, { id, title, message, variant, duration }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}

      {/* Toast container - top-right stack */}
      <div className="fixed right-4 top-4 z-50 flex flex-col items-end gap-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`w-80 transform transition-all duration-300 ease-out rounded-md px-4 py-3 shadow-lg ${
              t.variant === 'success'
                ? 'bg-emerald-600 text-white'
                : t.variant === 'error'
                ? 'bg-rose-600 text-white'
                : t.variant === 'warn'
                ? 'bg-amber-500 text-black'
                : 'bg-neutral-900 text-white'
            }`}
            onAnimationEnd={() => {}}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                {t.title && <div className="font-semibold text-sm mb-0.5">{t.title}</div>}
                {t.message && <div className="text-sm text-white/90">{t.message}</div>}
              </div>
              <button
                aria-label="Close"
                onClick={() => removeToast(t.id)}
                className="text-white/80 hover:text-white ml-3"
              >
                ×
              </button>
            </div>
            {/* auto-dismiss */}
            <AutoDismiss id={t.id} duration={t.duration} onDismiss={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const AutoDismiss = ({ id, duration, onDismiss }) => {
  React.useEffect(() => {
    const t = setTimeout(() => onDismiss(id), duration);
    return () => clearTimeout(t);
  }, [id, duration, onDismiss]);
  return null;
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      addToast: () => {},
      removeToast: () => {},
    };
  }
  return ctx;
};

export default ToastProvider;
