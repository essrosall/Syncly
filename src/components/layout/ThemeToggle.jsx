import React from 'react';
import { Sun, Moon } from 'lucide-react';
import useTheme from '../../hooks/useTheme';

const ThemeToggle = () => {
  const { theme, toggle } = useTheme();

  return (
    <button 
      onClick={toggle} 
      className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-neutral-700 bg-neutral-800 text-white shadow-sm transition-colors hover:text-neutral-800 hover:bg-neutral-50 dark:border-neutral-200 dark:bg-white dark:text-neutral-800 dark:hover:bg-neutral-700 dark:hover:text-white"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};

export default ThemeToggle;
