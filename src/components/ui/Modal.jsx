import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
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

  useEffect(() => {
    if (!isOpen) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <>
      {/* Backdrop - cover full viewport so entire app darkens */}
      <div
        className="fixed inset-0 bg-black/50 z-[9999] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[10000] p-4 overflow-y-auto">
        <div
          className={`w-full max-w-lg max-h-[calc(100vh-4rem)] overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[0_14px_35px_rgba(17,25,43,0.08)] dark:border-neutral-700 dark:bg-neutral-800 ${className}`}
          onClick={(e) => e.stopPropagation()}
        >


          {/* Header */}
          <div className="sticky top-0 flex items-center justify-between border-b border-neutral-200/80 bg-white px-5 py-4 dark:border-neutral-700/80 dark:bg-neutral-800">
            <h2 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-neutral-100">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="rounded-md p-1 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-700"
              aria-label="Close modal"
            >
              <X size={20} className="text-neutral-600 dark:text-neutral-400" />
            </button>
          </div>

          {/* Content */}
          <div className="px-5 py-5">
            <ModalErrorBoundary onClose={onClose}>{children}</ModalErrorBoundary>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
};

class ModalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // log error
    // eslint-disable-next-line no-console
    console.error('Modal rendering error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-5 text-sm text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
          <div className="mb-4 text-sm text-red-600 dark:text-red-400">An error occurred while rendering this content.</div>
          <button
            onClick={this.props.onClose}
            className="rounded-md bg-neutral-100 px-4 py-2 text-sm text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600"
          >
            Close
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default Modal;
