import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import Modal from '../components/ui/Modal';

const GlobalModalContext = createContext(null);

const ModalContent = ({ content, props }) => {
  return typeof content === 'function' ? React.createElement(content, props) : content;
};

export const GlobalModalProvider = ({ children }) => {
  const [modal, setModal] = useState(null);

  const openModal = useCallback((content, props = {}) => {
    try {
      window.dispatchEvent(new Event('syncly:close-local-modals'));
    } catch {}

    setModal({ content, props });
  }, []);

  const closeModal = useCallback(() => {
    setModal((currentModal) => {
      try {
        currentModal?.props?.onClose?.();
      } catch {
        // ignore modal close callback errors
      }

      return null;
    });
  }, []);

  // Close global modal when a local modal requests global modals to close
  useEffect(() => {
    const handleCloseGlobal = () => closeModal();
    try {
      window.addEventListener('syncly:close-global-modals', handleCloseGlobal);
    } catch {}
    return () => {
      try {
        window.removeEventListener('syncly:close-global-modals', handleCloseGlobal);
      } catch {}
    };
  }, [closeModal]);

  return (
    <GlobalModalContext.Provider value={{ modal, openModal, closeModal }}>
      {children}
      {modal && modal.props?.shell === false ? (
        <ModalContent content={modal.content} props={modal.props} />
      ) : modal ? (
        <Modal
          isOpen={Boolean(modal)}
          onClose={closeModal}
          title={modal.props?.title || ''}
          className={modal.props?.className || ''}
        >
          <ModalContent content={modal.content} props={modal.props} />
        </Modal>
      ) : null}
    </GlobalModalContext.Provider>
  );
};

// (no-op) all global/local close listeners are registered inside the provider

export const useGlobalModal = () => {
  const ctx = useContext(GlobalModalContext);
  if (!ctx) {
    // Fallback to a no-op implementation to avoid crashing if the provider
    // isn't mounted (helps during dev and prevents a full white screen).
    // Consumers should still prefer having the provider mounted.
    // eslint-disable-next-line no-console
    console.warn('useGlobalModal: GlobalModalProvider not found — returning noop methods');
    return {
      modal: null,
      openModal: () => {},
      closeModal: () => {},
    };
  }

  return ctx;
};

export default GlobalModalProvider;
