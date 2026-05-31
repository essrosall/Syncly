import { useCallback, useEffect, useRef, useState } from 'react';

const cloneValue = (value) => {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return value;
  }
};

const readStoredValue = (key, fallbackValue) => {
  if (typeof window === 'undefined') {
    return cloneValue(fallbackValue);
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : cloneValue(fallbackValue);
  } catch {
    return cloneValue(fallbackValue);
  }
};

const usePersistentState = (key, fallbackValue) => {
  const [value, setValue] = useState(() => readStoredValue(key, fallbackValue));
  const previousKeyRef = useRef(key);

  useEffect(() => {
    if (previousKeyRef.current === key) return;

    previousKeyRef.current = key;
    setValue(readStoredValue(key, fallbackValue));
  }, [fallbackValue, key]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore storage errors
    }
  }, [key, value]);

  const resetValue = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // ignore storage errors
      }
    }

    setValue(cloneValue(fallbackValue));
  }, [fallbackValue, key]);

  return [value, setValue, resetValue];
};

export default usePersistentState;
