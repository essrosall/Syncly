import React from 'react';
import { Sun, Moon } from 'lucide-react';
import useTheme from '../../hooks/useTheme';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggle } = useTheme();

  return (
    <button 
      onClick={toggle} 
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 text-neutral-900 shadow-lg shadow-black/10 transition-all hover:scale-105 hover:bg-neutral-800 hover:text-white dark:border-white dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-100 dark:hover:text-neutral-950 ${className}`}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};

export default ThemeToggle;
