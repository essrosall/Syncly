import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getTranslation, textScaleOptions } from '../lib/translations';

const PREFERENCES_KEY = 'syncly:preferences';

const detectInitialLanguage = () => {
  try {
    const stored = window.localStorage.getItem(PREFERENCES_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.language) return parsed.language;
    }
  } catch {
    // ignore malformed preference data
  }

  try {
    const browserLanguage = window.navigator.language?.slice(0, 2)?.toLowerCase();
    if (browserLanguage === 'es') return 'es';
    if (browserLanguage === 'tl' || browserLanguage === 'fi') return 'fil';
  } catch {
    // ignore browser language lookup issues
  }

  return 'en';
};

const detectInitialScale = () => {
  try {
    const stored = window.localStorage.getItem(PREFERENCES_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const matched = textScaleOptions.find((option) => option.value === parsed?.textScale);
      if (matched) return matched.value;
    }
  } catch {
    // ignore malformed preference data
  }

  return 1;
};

const PreferencesContext = createContext(null);

export const PreferencesProvider = ({ children }) => {
  const [language, setLanguageState] = useState(detectInitialLanguage);
  const [textScale, setTextScaleState] = useState(detectInitialScale);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = language;
    root.dataset.language = language;
  }, [language]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${Math.round(16 * textScale)}px`;
  }, [textScale]);

  useEffect(() => {
    try {
      window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify({ language, textScale }));
    } catch {
      // ignore persistence issues
    }
  }, [language, textScale]);

  const value = useMemo(() => {
    const t = (path) => getTranslation(language, path);

    return {
      language,
      setLanguage: setLanguageState,
      textScale,
      setTextScale: setTextScaleState,
      t,
    };
  }, [language, textScale]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within PreferencesProvider');
  }
  return context;
};
