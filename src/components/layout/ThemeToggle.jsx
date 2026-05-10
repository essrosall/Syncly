import React from 'react';
import { Sun, Moon } from 'lucide-react';
import useTheme from '../../hooks/useTheme';
import { Button } from '../ui';

const ThemeToggle = () => {
  const { theme, toggle } = useTheme();

  return (
    <Button variant="ghost" size="sm" onClick={toggle} aria-label="Toggle theme">
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </Button>
  );
};

export default ThemeToggle;
