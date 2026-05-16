import { Download, Settings, HelpCircle, LogOut, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { isSupabaseConfigured, supabase } from '../../lib/supabaseClient';
import { useGlobalModal } from '../../contexts/GlobalModalContext';
import LogoutConfirmModal from './LogoutConfirmModal';
import SupportCenterModal from './SupportCenterModal';

const MoreMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { addToast } = useToast();
  const { openModal, closeModal } = useGlobalModal();

  const readLocalJson = (key, fallback = null) => {
    if (typeof window === 'undefined') return fallback;

    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  };

  const buildExportPayload = async () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      app: 'Syncly',
      version: '1.0.0',
      source: isSupabaseConfigured && supabase && user ? 'supabase + local fallback' : 'local fallback',
      localStorage: {},
      supabase: {
        profileId: user?.id || null,
        tasks: [],
        notifications: [],
        activityLogs: [],
        taskComments: [],
      },
    };

    if (typeof window !== 'undefined') {
      const keysToExport = [
        'syncly:demoSession',
        'syncly:notifications',
        'syncly:tasks',
        'syncly:taskActivity',
      ];

      keysToExport.forEach((key) => {
        exportData.localStorage[key] = readLocalJson(key);
      });
    }

    if (isSupabaseConfigured && supabase && user) {
      try {
        const [tasksResult, notificationsResult, activityResult, commentsResult] = await Promise.all([
          supabase.from('tasks').select('*').eq('user_id', user.id).order('created_at', { ascending: true }),
          supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: true }),
          supabase.from('activity_logs').select('*').eq('user_id', user.id).order('created_at', { ascending: true }),
          supabase.from('task_comments').select('*').eq('user_id', user.id).order('created_at', { ascending: true }),
        ]);

        exportData.supabase.tasks = tasksResult.data || [];
        exportData.supabase.notifications = notificationsResult.data || [];
        exportData.supabase.activityLogs = activityResult.data || [];
        exportData.supabase.taskComments = commentsResult.data || [];
      } catch {
        // Keep local export if Supabase read fails.
      }
    }

    return exportData;
  };

  const downloadJson = (filename, data) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const openSupport = () => {
    const subject = encodeURIComponent('Syncly Support Request');
    const body = encodeURIComponent('Hi Syncly support,\n\nI need help with: ');
    const mailtoUrl = `mailto:support@syncly.app?subject=${subject}&body=${body}`;

    try {
      window.location.href = mailtoUrl;
    } catch {
      window.open('https://github.com/essrosall/Syncly/issues', '_blank', 'noopener,noreferrer');
    }
  };

  const handleExport = () => {
    (async () => {
      try {
        const payload = await buildExportPayload();
        downloadJson(`syncly-export-${new Date().toISOString().slice(0, 10)}.json`, payload);
        addToast({
          title: 'Export ready',
          message: 'Your data export has been downloaded.',
          variant: 'success',
        });
      } catch {
        addToast({
          title: 'Export failed',
          message: 'Unable to prepare your export right now.',
          variant: 'error',
        });
      }
    })();
  };

  const handlePreferences = () => {
    navigate('/settings#settings-preferences');
  };

  const handleSupport = () => {
    openModal(SupportCenterModal, {
      title: 'Help & Support',
      onClose: closeModal,
    });
  };

  const handleSignOut = async () => {
    openModal(LogoutConfirmModal, {
      title: 'Confirm logout',
      onCancel: closeModal,
      onConfirm: async () => {
        try {
          const { error } = await signOut();
          if (error) throw error;

          closeModal();
          addToast({
            title: 'Signed out',
            message: 'You have been logged out successfully.',
            variant: 'success',
          });
          navigate('/login');
        } catch {
          closeModal();
          addToast({
            title: 'Sign out failed',
            message: 'Unable to sign out right now. Please try again.',
            variant: 'error',
          });
        }
      },
    });
  };

  const menuItems = [
    {
      id: 'export',
      label: 'Export Data',
      description: 'Download your tasks and workspace data',
      icon: Download,
      action: handleExport,
    },
    {
      id: 'preferences',
      label: 'Preferences',
      description: 'Customize your app experience',
      icon: Settings,
      action: handlePreferences,
    },
    {
      id: 'help',
      label: 'Help & Support',
      description: 'Get help and contact support',
      icon: HelpCircle,
      action: handleSupport,
    },
    {
      id: 'logout',
      label: 'Sign Out',
      description: 'Log out of your account',
      icon: LogOut,
      action: handleSignOut,
      isDangerous: true,
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div className={`absolute top-full right-0 mt-2 w-[22rem] max-h-[480px] rounded-xl border border-neutral-200/80 bg-white shadow-xl shadow-black/5 dark:border-neutral-700/80 dark:bg-neutral-800 z-50 overflow-hidden transition-all duration-200 lg:w-[22rem] ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-neutral-200/80 bg-white px-4 py-3.5 dark:border-neutral-700/80 dark:bg-neutral-800">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">More Options</h3>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-neutral-500 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-700 lg:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Menu Items */}
        <div className="overflow-y-auto max-h-[380px] divide-y divide-neutral-200/80 dark:divide-neutral-700/80">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={async () => {
                  await item.action();
                  onClose();
                }}
                className={`w-full px-4 py-3.5 text-left transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-700 ${
                  item.isDangerous ? 'hover:bg-red-50 dark:hover:bg-red-950/30' : ''
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <Icon
                    size={18}
                    className={`mt-0.5 flex-shrink-0 ${
                      item.isDangerous
                        ? 'text-red-500'
                        : 'text-neutral-600 dark:text-neutral-400'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${
                      item.isDangerous
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-neutral-900 dark:text-neutral-100'
                    }`}>
                      {item.label}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
                      {item.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-200/80 bg-white px-4 py-2.5 dark:border-neutral-700/80 dark:bg-neutral-800">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Version 1.0.0
          </p>
        </div>
      </div>
    </>
  );
};

export default MoreMenu;
