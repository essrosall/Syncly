import React from 'react';
import { LogOut, Search, Bell } from 'lucide-react';
import { Button } from '../ui';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/90 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-950/85" role="navigation" aria-label="Top utilities">
      <div className="px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 shadow-lg flex items-center justify-center" aria-hidden="true">
            <span className="font-semibold text-white text-sm">S</span>
          </div>
          <span className="font-semibold text-lg text-neutral-900 dark:text-neutral-100" aria-label="Syncly logo">Syncly</span>
        </div>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-lg items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search projects, tasks, or notes"
            className="w-full bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none dark:text-neutral-100"
          />
        </div>

        {/* User & Actions */}
        <div className="flex items-center gap-2 lg:gap-3">
          <button className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-600 shadow-sm transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800" aria-label="Notifications">
            <Bell size={18} />
          </button>
          <ThemeToggle />
          {user && <Button variant="ghost" size="sm" className="h-10 w-10 px-0" onClick={onLogout} aria-label="Log out"><LogOut size={18} /></Button>}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
