import { useEffect, useState } from 'react';

const THEME_KEY = 'syncly:theme';

export default function useTheme() {
  // start explicitly in light mode to avoid unexpected dark paint on mount
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const root = document.documentElement;
    // Force light mode on mount to ensure consistent UI for now
    root.classList.add('light');
    root.classList.remove('dark');
    try {
      localStorage.setItem(THEME_KEY, 'light');
    } catch (e) {}
  }, []);

  // allow toggling during runtime (stored preference will be respected after toggling)
  const toggle = () => setTheme((t) => {
    const next = t === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (e) {}
    const root = document.documentElement;
    if (next === 'dark') {
      root.classList.remove('light');
      root.classList.add('dark');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    return next;
  });

  return { theme, setTheme, toggle };
}
