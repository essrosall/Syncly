import { createContext, useContext, useState } from 'react';

const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
  const STORAGE_KEY = 'syncly:layout';

  // Initialize from localStorage or use defaults
  const [layoutMode, setLayoutModeState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored).mode : 'grid';
    } catch {
      return 'grid';
    }
  });

  const [sidebarWidth, setSidebarWidthState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored).width : 'wide';
    } catch {
      return 'wide';
    }
  });

  // Update layout mode and persist
  const setLayoutMode = (mode) => {
    setLayoutModeState(mode);
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stored, mode }));
    } catch {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ mode, width: sidebarWidth }));
    }
  };

  // Update sidebar width and persist
  const setSidebarWidth = (width) => {
    setSidebarWidthState(width);
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stored, width }));
    } catch {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ mode: layoutMode, width }));
    }
  };

  return (
    <LayoutContext.Provider
      value={{
        layoutMode,
        setLayoutMode,
        sidebarWidth,
        setSidebarWidth,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within LayoutProvider');
  }
  return context;
};
