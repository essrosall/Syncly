import { Bell, X, Trash2, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const NotificationsPanel = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'task', title: 'Task assigned', message: 'Design landing page assigned to you', time: '5m ago', read: false },
    { id: 2, type: 'comment', title: 'New comment', message: 'Alex commented on your task', time: '1h ago', read: false },
    { id: 3, type: 'update', title: 'Project update', message: 'Mobile App workspace was updated', time: '2h ago', read: true },
    { id: 4, type: 'mention', title: 'You were mentioned', message: 'Sarah mentioned you in a discussion', time: '1d ago', read: true },
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div className={`absolute top-full right-0 mt-2 w-96 max-h-[500px] rounded-md border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800 z-50 overflow-hidden transition-all duration-200 ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        {/* Header */}
        <div className="sticky top-0 border-b border-neutral-200 bg-white px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Notifications</h3>
            {unreadCount > 0 && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{unreadCount} unread</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="lg:hidden rounded-md p-1 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700"
            aria-label="Close notifications"
          >
            <X size={18} />
          </button>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto max-h-[400px]">
          {notifications.length > 0 ? (
            <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {notifications.map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`w-full px-4 py-3 text-left transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-700 ${
                    !notif.read ? 'bg-neutral-50 dark:bg-neutral-700/50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 flex-shrink-0 h-2 w-2 rounded-full ${!notif.read ? 'bg-primary-500' : 'bg-transparent'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{notif.title}</p>
                      <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">{notif.message}</p>
                      <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-500">{notif.time}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notif.id);
                      }}
                      className="flex-shrink-0 rounded-md p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                      aria-label="Delete notification"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-12 px-4">
              <Bell size={32} className="text-neutral-300 dark:text-neutral-600" />
              <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">No notifications yet</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t border-neutral-200 bg-white px-4 py-2 dark:border-neutral-700 dark:bg-neutral-800">
            <button
              onClick={clearAll}
              className="w-full rounded-md px-3 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationsPanel;
