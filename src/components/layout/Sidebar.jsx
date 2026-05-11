import React from 'react';
import { LayoutDashboard, CheckSquare, Briefcase, BarChart3, Settings, Plus, Circle } from 'lucide-react';
import { Button } from '../ui';
import { useCreateModal } from '../../contexts/CreateModalContext';
import { useGlobalModal } from '../../contexts/GlobalModalContext';
import TaskCreateForm from '../tasks/TaskCreateForm';

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

  const { openCreate } = useCreateModal();
  const { openModal } = useGlobalModal();

  return (
    <aside className="hidden lg:flex flex-col w-72 shrink-0 h-[calc(100vh-4rem)] sticky top-16 rounded-2xl border border-neutral-200/80 bg-white/85 backdrop-blur-xl shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:border-neutral-800 dark:bg-neutral-950/80">
      {/* Profile / CTA */}
      <div className="p-5 border-b border-neutral-200/80 dark:border-neutral-800">
        <div className="rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 p-5 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-white/15 flex items-center justify-center text-lg font-semibold">
              S
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-sm font-medium text-white/90">
                <Circle size={10} fill="currentColor" /> Your profile
              </div>
              <p className="truncate text-sm text-white/80">Sarah Johnson</p>
              <p className="truncate text-xs text-white/70">sarah@example.com</p>
            </div>
          </div>
          <div className="mt-4">
            <Button
              variant="secondary"
              className="w-full border border-white/20 bg-white text-primary-700 hover:bg-neutral-50"
              onClick={() => {
                try {
                  openModal(TaskCreateForm, { column: 'todo' });
                } catch (e) {
                  try {
                    openCreate({ column: 'todo' });
                  } catch (ee) {
                    try { window.localStorage.setItem('syncly:createRequest', JSON.stringify({ column: 'todo' })); } catch (eee) {}
                  }
                  if (window.location.pathname !== '/tasks') window.location.href = '/tasks';
                }
              }}
            >
              <Plus size={18} /> New Task
            </Button>

            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => {
                  try {
                    openModal(TaskCreateForm, { column: 'todo', assignee: 'You' });
                  } catch (e) {
                    try { openCreate({ column: 'todo', assignee: 'You' }); } catch (ee) { window.location.href = '/tasks?new=todo&assignee=You'; return; }
                  }
                  if (window.location.pathname !== '/tasks') window.location.href = '/tasks';
                }}
                className="text-sm bg-white/90 text-primary-700 px-3 py-1 rounded-md"
              >
                You
              </button>
              <button
                type="button"
                onClick={() => {
                  try {
                    openModal(TaskCreateForm, { column: 'todo', assignee: 'Alex' });
                  } catch (e) {
                    try { openCreate({ column: 'todo', assignee: 'Alex' }); } catch (ee) { window.location.href = '/tasks?new=todo&assignee=Alex'; return; }
                  }
                  if (window.location.pathname !== '/tasks') window.location.href = '/tasks';
                }}
                className="text-sm bg-white/90 text-primary-700 px-3 py-1 rounded-md"
              >
                Alex
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4" aria-label="Primary">
        <div className="mb-3 text-xs uppercase tracking-[0.24em] text-neutral-500 dark:text-neutral-500">Main menu</div>
        <div className="space-y-2 mb-4">
          {navMain.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

              return (
              <a
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-500/10 text-primary-600 border border-primary-500/20 shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100/70 dark:hover:bg-neutral-800/50'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={18} />
                <span className="font-medium">{item.label}</span>
              </a>
            );
          })}
        </div>

        <div className="border-t border-neutral-200/80 dark:border-neutral-800 my-4" aria-hidden="true" />

        <div className="mb-3 text-xs uppercase tracking-[0.24em] text-neutral-500 dark:text-neutral-500">General</div>
        <div className="space-y-2">
          {navManage.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <a
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-500/10 text-primary-600 border border-primary-500/20 shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100/70 dark:hover:bg-neutral-800/50'
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
      <div className="p-4 border-t border-neutral-200/80 dark:border-neutral-800">
        <div className="rounded-lg bg-neutral-100 p-4 text-center dark:bg-neutral-900/70">
          <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-3">Need help getting started?</p>
          <Button variant="secondary" size="sm" className="w-full">View Tutorials</Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
