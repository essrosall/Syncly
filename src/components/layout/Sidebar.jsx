import React from 'react';
import { LayoutDashboard, CheckSquare, Briefcase, BarChart3, Settings, Plus } from 'lucide-react';
import { Button } from '../ui';

const Sidebar = ({ activeTab = 'dashboard' }) => {
  const navMain = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, href: '/tasks' },
    { id: 'workspaces', label: 'Workspaces', icon: Briefcase, href: '/workspaces' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/analytics' },
  ];

  const navManage = [
    { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-neutral-50 dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 h-screen sticky top-0">
      {/* Create New */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
        <Button className="w-full" variant="primary">
          <Plus size={18} /> New Task
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4" aria-label="Primary">
        <div className="mb-3 text-xs uppercase text-neutral-600 dark:text-neutral-500 tracking-wider">Main</div>
        <div className="space-y-2 mb-4">
          {navMain.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

              return (
              <a
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                    : 'text-neutral-700 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800/50'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={18} />
                <span className="font-medium">{item.label}</span>
              </a>
            );
          })}
        </div>

        <div className="border-t border-neutral-200 dark:border-neutral-800 my-3" aria-hidden="true" />

        <div className="mb-3 text-xs uppercase text-neutral-600 dark:text-neutral-500 tracking-wider">Manage</div>
        <div className="space-y-2">
          {navManage.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <a
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={18} />
                <span className="font-medium">{item.label}</span>
              </a>
            );
          })}
        </div>
      </nav>

      {/* Help Section */}
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
        <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-4 text-center">
          <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-3">Need help getting started?</p>
          <Button variant="primary" size="sm" className="w-full">View Tutorials</Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
