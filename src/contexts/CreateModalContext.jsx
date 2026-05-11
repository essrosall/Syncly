import React, { createContext, useContext, useState } from 'react';

const CreateModalContext = createContext(null);

export const CreateModalProvider = ({ children }) => {
  const [createRequest, setCreateRequest] = useState(null);

  const openCreate = (opts = {}) => setCreateRequest(opts);
  const clearRequest = () => setCreateRequest(null);

  return (
    <CreateModalContext.Provider value={{ createRequest, openCreate, clearRequest }}>
      {children}
    </CreateModalContext.Provider>
  );
};

export const useCreateModal = () => {
  const ctx = useContext(CreateModalContext);
  if (!ctx) throw new Error('useCreateModal must be used within CreateModalProvider');
  return ctx;
};

export default CreateModalContext;
