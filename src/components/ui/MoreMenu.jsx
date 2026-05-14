import { MoreHorizontal, Download, Settings, HelpCircle, LogOut, X } from 'lucide-react';
import { useState } from 'react';

const MoreMenu = ({ isOpen, onClose }) => {
  const menuItems = [
    {
      id: 'export',
      label: 'Export Data',
      description: 'Download your tasks and workspace data',
      icon: Download,
      action: () => {
        console.log('Exporting data...');
        alert('Export functionality coming soon!');
      },
    },
    {
      id: 'preferences',
      label: 'Preferences',
      description: 'Customize your app experience',
      icon: Settings,
      action: () => {
        console.log('Opening preferences...');
        alert('Preferences panel coming soon!');
      },
    },
    {
      id: 'help',
      label: 'Help & Support',
      description: 'Get help and contact support',
      icon: HelpCircle,
      action: () => {
        console.log('Opening help...');
        alert('Help center coming soon!');
      },
    },
    {
      id: 'logout',
      label: 'Sign Out',
      description: 'Log out of your account',
      icon: LogOut,
      action: () => {
        console.log('Logging out...');
        alert('Sign out functionality coming soon!');
      },
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

      <div className={`absolute top-full right-0 mt-2 w-80 max-h-[500px] rounded-md border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800 z-50 overflow-hidden transition-all duration-200 lg:w-80 ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">More Options</h3>
          <button
            onClick={onClose}
            className="lg:hidden rounded-md p-1 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Menu Items */}
        <div className="overflow-y-auto max-h-[400px] divide-y divide-neutral-200 dark:divide-neutral-700">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  item.action();
                  onClose();
                }}
                className={`w-full px-4 py-3 text-left transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-700 ${
                  item.isDangerous ? 'hover:bg-red-50 dark:hover:bg-red-950/30' : ''
                }`}
              >
                <div className="flex items-start gap-3">
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
                    <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                      {item.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-200 bg-white px-4 py-2 dark:border-neutral-700 dark:bg-neutral-800">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Version 1.0.0
          </p>
        </div>
      </div>
    </>
  );
};

export default MoreMenu;
