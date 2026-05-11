import { NavLink } from 'react-router-dom';
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
    <aside className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 z-50 w-72 flex-col border-r border-neutral-200 bg-white p-4 shadow-sm">
      <div className="space-y-4 border-b border-neutral-200 pb-4">
        <div className="flex items-center gap-3 px-1">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-900 text-white shadow-sm">
            <span className="text-sm font-semibold">S</span>
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight text-neutral-950">Syncly.</p>
            <p className="text-xs text-neutral-500">Task workspace</p>
          </div>
        </div>

        <div className="rounded-md border border-neutral-200 bg-white p-4 shadow-[0_10px_25px_rgba(17,25,43,0.04)]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-900 text-white">
                <span className="text-sm font-semibold">SJ</span>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">Sarah Johnson</p>
                <p className="text-xs text-neutral-500">sarah@example.com</p>
              </div>
            </div>
            <button className="rounded-lg border border-neutral-200 p-1.5 text-neutral-500">
              <Circle size={12} fill="currentColor" />
            </button>
          </div>

          <Button
            variant="primary"
            className="mt-4 w-full justify-between bg-neutral-900 text-white hover:bg-neutral-800"
            onClick={() => {
              try {
                openModal(TaskCreateForm, { column: 'todo' });
              } catch {
                try {
                  openCreate({ column: 'todo' });
                } catch {
                  try {
                    window.localStorage.setItem('syncly:createRequest', JSON.stringify({ column: 'todo' }));
                  } catch {
                    window.location.href = '/tasks';
                    return;
                  }
                }
                if (window.location.pathname !== '/tasks') window.location.href = '/tasks';
              }
            }}
          >
            <span className="inline-flex items-center gap-2"><Plus size={16} /> New Task</span>
            <span className="text-lg leading-none">+</span>
          </Button>
        </div>
      </div>

      <nav className="flex-1 py-5" aria-label="Primary">
        <div className="mb-3 px-1 text-xs uppercase tracking-[0.22em] text-neutral-400">Main</div>
        <div className="space-y-2">
          {navMain.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <NavLink
                key={item.id}
                to={item.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-colors ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className={`flex h-9 w-9 items-center justify-center rounded-full ${isActive ? 'bg-white/15' : 'bg-neutral-900 text-white'}`}>
                  <Icon size={16} />
                </span>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        <div className="my-5 border-t border-neutral-200" aria-hidden="true" />

        <div className="mb-3 px-1 text-xs uppercase tracking-[0.22em] text-neutral-400">General</div>
        <div className="space-y-2">
          {navManage.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <NavLink
                key={item.id}
                to={item.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-colors ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className={`flex h-9 w-9 items-center justify-center rounded-full ${isActive ? 'bg-white/15' : 'bg-neutral-900 text-white'}`}>
                  <Icon size={16} />
                </span>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-neutral-200 pt-4">
        <div className="rounded-md bg-neutral-100 p-4 text-center">
          <p className="mb-3 text-sm text-neutral-700">Need help getting started?</p>
          <Button variant="secondary" size="sm" className="w-full bg-neutral-900 text-white hover:bg-neutral-800">View Tutorials</Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
