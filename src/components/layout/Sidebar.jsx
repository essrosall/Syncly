import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Briefcase, BarChart3, Settings, Plus, Settings2 } from 'lucide-react';
import { Button } from '../ui';
import { useCreateModal } from '../../contexts/CreateModalContext';
import { useGlobalModal } from '../../contexts/GlobalModalContext';
import TaskCreateForm from '../tasks/TaskCreateForm';
import ProfileEditForm from '../profile/ProfileEditForm';

const STORAGE_KEY = 'syncly:demoSession';

const readProfile = (fallbackUser) => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const stored = raw ? JSON.parse(raw) : null;

    return {
      name: stored?.name || fallbackUser?.name || 'Sarah Johnson',
      email: stored?.email || fallbackUser?.email || 'sarah@example.com',
    };
  } catch {
    return {
      name: fallbackUser?.name || 'Sarah Johnson',
      email: fallbackUser?.email || 'sarah@example.com',
    };
  }
};

const getInitials = (name) => {
  return (name || 'S')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'S';
};

const Sidebar = ({ activeTab = 'dashboard', user }) => {
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
  const [profile, setProfile] = useState(() => readProfile(user));

  useEffect(() => {
    setProfile(readProfile(user));
  }, [user]);

  useEffect(() => {
    const syncProfile = () => setProfile(readProfile(user));

    window.addEventListener('storage', syncProfile);
    window.addEventListener('syncly:profile-updated', syncProfile);

    return () => {
      window.removeEventListener('storage', syncProfile);
      window.removeEventListener('syncly:profile-updated', syncProfile);
    };
  }, [user]);

  return (
    <aside className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 z-50 w-72 flex-col border-r border-neutral-200 bg-white p-4 text-neutral-900 shadow-[0_18px_50px_rgba(17,25,43,0.05)] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
      <div className="space-y-4 border-b border-neutral-200 pb-4 dark:border-neutral-700">
        <div className="flex items-center gap-3 px-1">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-white text-neutral-950 shadow-sm dark:bg-neutral-800 dark:text-neutral-100 dark:border dark:border-neutral-700">
            <span className="text-sm font-semibold">S</span>
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-neutral-100">Syncly.</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Task workspace</p>
          </div>
        </div>
      </div>
      <div className="my-2" />

          <div className="mb-3 px-1 text-xs uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">Profile</div>
          <div className="rounded-md border border-neutral-200 bg-white p-4 shadow-[0_10px_25px_rgba(17,25,43,0.04)] dark:border-neutral-700 dark:bg-neutral-800">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-950 dark:bg-neutral-800 dark:text-neutral-100">
                  <span className="text-sm font-semibold">{getInitials(profile.name)}</span>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-neutral-950 dark:text-neutral-100">{profile.name}</p>
                  <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">{profile.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => openModal(ProfileEditForm, { title: 'Edit Profile', user: profile })}
                className="inline-flex shrink-0 items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                aria-label="Edit profile"
              >
                <Settings2 size={14} />
                Edit
              </button>
            </div>

            <Button
              variant="primary"
              className="mt-4 w-full justify-between rounded-md bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600"
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
              <span className="inline-flex items-center gap-2 text-sm"><Plus size={16} /> New Task</span>
            </Button>
          </div>

      <nav className="flex-1 py-8" aria-label="Primary">
        <div className="mb-3 px-1 text-xs uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">Main</div>
        <div className="space-y-2">
          {navMain.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <NavLink
                key={item.id}
                to={item.href}
                className={`flex items-center gap-3 rounded-md px-4 py-3 text-sm transition-colors ${
                  isActive
                    ? 'bg-neutral-100 text-neutral-900 shadow-sm ring-1 ring-neutral-200 dark:bg-neutral-700 dark:text-neutral-100 dark:ring-0'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-neutral-100'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                    <span className={`flex h-9 w-9 items-center justify-center ${isActive ? 'text-white' : 'text-neutral-600 dark:text-neutral-300'}`}>
                  <Icon size={16} />
                </span>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        <div className="my-5" />

        <div className="mb-3 px-1 text-xs uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">General</div>
        <div className="space-y-2">
          {navManage.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <NavLink
                key={item.id}
                to={item.href}
                className={`flex items-center gap-3 rounded-md px-4 py-3 text-sm transition-colors ${
                  isActive
                    ? 'bg-neutral-100 text-neutral-900 shadow-sm ring-1 ring-neutral-200 dark:bg-neutral-700 dark:text-neutral-100 dark:ring-0'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-neutral-100'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                    <span className={`flex h-9 w-9 items-center justify-center ${isActive ? 'text-white' : 'text-neutral-600 dark:text-neutral-300'}`}>
                  <Icon size={16} />
                </span>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </div>

          
      </nav>

      <div className="border-t border-neutral-200 pt-4 dark:border-neutral-700">
          <div className="rounded-md border border-neutral-200 bg-white p-4 text-center shadow-[0_10px_25px_rgba(17,25,43,0.04)] dark:border-neutral-700 dark:bg-neutral-800">
            <p className="mb-3 text-sm text-neutral-600 dark:text-neutral-300">Need help getting started?</p>
            <Button variant="secondary" size="sm" className="w-full rounded-md bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600">View Tutorials</Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
