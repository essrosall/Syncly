import React, { createContext, useContext, useCallback, useState } from 'react';
import Modal from '../components/ui/Modal';

const GlobalModalContext = createContext(null);

const ModalContent = ({ content, props }) => {
  return typeof content === 'function' ? React.createElement(content, props) : content;
};

export const GlobalModalProvider = ({ children }) => {
  const [modal, setModal] = useState(null);

  const openModal = useCallback((content, props = {}) => {
    setModal({ content, props });
  }, []);

  const closeModal = useCallback(() => setModal(null), []);

  return (
    <GlobalModalContext.Provider value={{ modal, openModal, closeModal }}>
      {children}
      {modal && (
        <Modal isOpen={Boolean(modal)} onClose={closeModal} title={modal.props?.title || ''}>
          <ModalContent content={modal.content} props={modal.props} />
        </Modal>
      )}
    </GlobalModalContext.Provider>
  );
};

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
