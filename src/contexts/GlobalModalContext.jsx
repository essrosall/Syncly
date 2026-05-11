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
  if (!ctx) throw new Error('useGlobalModal must be used within GlobalModalProvider');
  return ctx;
};

export default GlobalModalProvider;
