import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Briefcase, BarChart3, Settings, Plus, UserRound } from 'lucide-react';
import { Button } from '../ui';
import { useCreateModal } from '../../contexts/CreateModalContext';
import { useGlobalModal } from '../../contexts/GlobalModalContext';
import { useLayout } from '../../contexts/LayoutContext';
import TaskCreateForm from '../tasks/TaskCreateForm';
import ProfileInfoModal from '../ui/ProfileInfoModal';

const STORAGE_KEY = 'syncly:demoSession';

const readProfile = (fallbackUser) => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const stored = raw ? JSON.parse(raw) : null;

    const firstName = stored?.firstName || fallbackUser?.name?.split(' ')?.[0] || 'Sarah';
    const lastName = stored?.lastName || fallbackUser?.name?.split(' ')?.[1] || 'Johnson';
    const nickname = stored?.nickname || '';
    const gender = stored?.gender || 'female';
    const displayPreference = stored?.displayPreference || 'nickname';

    let displayName = stored?.name || `${firstName} ${lastName}`;
    if (displayPreference === 'nickname' && nickname) displayName = nickname;
    else if (displayPreference === 'first' && firstName) displayName = firstName;
    else if (displayPreference === 'last' && lastName) displayName = lastName;
    else if (displayPreference === 'full' && firstName && lastName) {
      const prefix = gender === 'male' ? 'Mr.' : gender === 'female' ? 'Ms.' : '';
      displayName = `${prefix ? prefix + ' ' : ''}${firstName} ${lastName}`.trim();
    }

    return {
      firstName,
      lastName,
      nickname,
      gender,
      displayPreference,
      name: stored?.name || `${firstName} ${lastName}`,
      displayName,
      email: stored?.email || fallbackUser?.email || 'sarah@example.com',
      profileImageUrl: stored?.profileImageUrl || null,
    };
  } catch {
    return {
      firstName: fallbackUser?.name?.split(' ')?.[0] || 'Sarah',
      lastName: fallbackUser?.name?.split(' ')?.[1] || 'Johnson',
      nickname: '',
      gender: 'female',
      displayPreference: 'nickname',
      name: fallbackUser?.name || 'Sarah Johnson',
      displayName: fallbackUser?.name || 'Sarah Johnson',
      email: fallbackUser?.email || 'sarah@example.com',
      profileImageUrl: null,
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
  const { sidebarWidth } = useLayout();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(() => readProfile(user));
  const [showProfileModal, setShowProfileModal] = useState(false);

  const sidebarWidthClass = {
    compact: 'lg:w-56',
    wide: 'lg:w-72',
    full: 'lg:w-96',
  }[sidebarWidth] || 'lg:w-72';

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
    <aside className={`hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 z-50 flex-col border-r border-neutral-200 bg-white p-4 text-neutral-900 shadow-[0_18px_50px_rgba(17,25,43,0.05)] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 ${sidebarWidthClass}`}>
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
            <div className="flex cursor-pointer items-center gap-3 rounded-md p-2 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-700/50" onClick={() => setShowProfileModal(true)}>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-950 dark:bg-neutral-800 dark:text-neutral-100 overflow-hidden">
                  {profile.profileImageUrl ? (
                    <img src={profile.profileImageUrl} alt={profile.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-sm font-semibold">{getInitials(profile.name)}</span>
                  )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-neutral-950 dark:text-neutral-100">{profile.displayName || profile.name}</p>
                <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">{profile.email}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <Button
                variant="primary"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600"
                onClick={() => setShowProfileModal(true)}
                aria-label="View profile"
              >
                <UserRound size={14} />
              </Button>
              <Button
                variant="primary"
                className="flex-1 justify-between rounded-md bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600"
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
                <span className="inline-flex items-center gap-2 text-xs"><Plus size={14} /> New Task</span>
              </Button>
            </div>
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
                    <span className={`flex h-9 w-9 items-center justify-center ${isActive ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-600 dark:text-neutral-300'}`}>
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
                    <span className={`flex h-9 w-9 items-center justify-center ${isActive ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-600 dark:text-neutral-300'}`}>
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

      {showProfileModal && (
        <ProfileInfoModal
          profile={profile}
          onClose={() => setShowProfileModal(false)}
          onEdit={() => {
            setShowProfileModal(false);
            navigate('/settings');
          }}
        />
      )}
    </aside>
  );
};

export default Sidebar;
