import React from 'react';
import { LayoutDashboard, CheckSquare, Briefcase, BarChart3, Settings, Plus } from 'lucide-react';
import { Button } from '../ui';

const Sidebar = ({ activeTab = 'dashboard' }) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/',
    },
    {
      id: 'tasks',
      label: 'My Tasks',
      icon: CheckSquare,
      href: '/tasks',
    },
    {
      id: 'workspaces',
      label: 'Workspaces',
      icon: Briefcase,
      href: '/workspaces',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      href: '/analytics',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      href: '/settings',
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-neutral-900 border-r border-neutral-800 h-screen sticky top-0">
      {/* Create New */}
      <div className="p-4 border-b border-neutral-800">
        <Button className="w-full" variant="primary">
          <Plus size={18} /> New Task
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <a
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </a>
          );
        })}
      </nav>

      {/* Help Section */}
      <div className="p-4 border-t border-neutral-800">
        <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-4 text-center">
          <p className="text-sm text-neutral-300 mb-3">Need help getting started?</p>
          <Button variant="primary" size="sm" className="w-full">View Tutorials</Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
