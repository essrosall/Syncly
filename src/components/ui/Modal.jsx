import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, className = '' }) => {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-x-0 top-16 bottom-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-x-0 top-16 bottom-0 flex items-start justify-center z-50 p-4 overflow-y-auto">
        <div
          className={`bg-white dark:bg-neutral-900 rounded-md shadow-xl max-w-lg w-full max-h-[calc(100vh-5rem)] overflow-y-auto ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
              aria-label="Close modal"
            >
              <X size={20} className="text-neutral-600 dark:text-neutral-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
