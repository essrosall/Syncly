import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, className = '', sizeClass = 'max-w-3xl' }) => {
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
        className="fixed inset-0 z-[9999] bg-[radial-gradient(circle_at_top_left,rgba(93,165,108,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(120,144,168,0.12),transparent_28%),rgba(3,7,18,0.58)] backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[10000] p-4 overflow-y-auto">
        <div
          className={`relative flex w-full max-h-[calc(100vh-2rem)] flex-col ${sizeClass} overflow-hidden rounded-base border border-neutral-200/80 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.98),rgba(250,250,250,0.98))] shadow-[0_30px_80px_rgba(15,23,42,0.14)] dark:border-neutral-700 dark:bg-[linear-gradient(to_bottom,rgba(24,24,27,0.98),rgba(18,18,20,0.98))] ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-success-500 via-info-500 to-warning-500" />


          {/* Header */}
          <div className="sticky top-0 flex items-center justify-between border-b border-neutral-200/80 bg-white/90 px-5 py-4 backdrop-blur-sm dark:border-neutral-700/80 dark:bg-neutral-800/90">
            <h2 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-neutral-100">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="rounded-full border border-neutral-200 bg-neutral-50 p-2 transition-colors hover:border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-700 dark:hover:bg-neutral-600"
              aria-label="Close modal"
            >
              <X size={20} className="text-neutral-600 dark:text-neutral-400" />
            </button>
          </div>

          {/* Content */}
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
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
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 text-sm text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
          <div className="mb-4 text-sm text-error-700 dark:text-error-300">An error occurred while rendering this content.</div>
          <button
            onClick={this.props.onClose}
            className="rounded-md bg-success-500 px-4 py-2 text-sm text-white hover:bg-success-600"
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
