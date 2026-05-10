import React, { useState } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import { Button } from '../ui';

const Navbar = ({ user, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="card sticky top-0 z-50 rounded-none border-b border-t-0 border-l-0 border-r-0">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            <span className="font-bold text-white text-sm">S</span>
          </div>
          <span className="font-bold text-lg text-neutral-100">Syncly</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <a href="/" className="text-neutral-300 hover:text-neutral-100 transition-colors">Dashboard</a>
          <a href="/tasks" className="text-neutral-300 hover:text-neutral-100 transition-colors">Tasks</a>
          <a href="/workspaces" className="text-neutral-300 hover:text-neutral-100 transition-colors">Workspaces</a>
          <a href="/analytics" className="text-neutral-300 hover:text-neutral-100 transition-colors">Analytics</a>
        </div>

        {/* User & Actions */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-neutral-100">{user.name}</p>
                <p className="text-xs text-neutral-400">{user.email}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center font-semibold text-white">
                {user.name.charAt(0)}
              </div>
            </div>
          )}
          {user && <Button variant="ghost" size="sm" onClick={onLogout}><LogOut size={18} /></Button>}
          
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-800 px-6 py-4 space-y-2">
          <a href="/" className="block py-2 text-neutral-300 hover:text-neutral-100">Dashboard</a>
          <a href="/tasks" className="block py-2 text-neutral-300 hover:text-neutral-100">Tasks</a>
          <a href="/workspaces" className="block py-2 text-neutral-300 hover:text-neutral-100">Workspaces</a>
          <a href="/analytics" className="block py-2 text-neutral-300 hover:text-neutral-100">Analytics</a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
