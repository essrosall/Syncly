import { Bell, X, Trash2, CheckCircle, Clock3, MessageSquare } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext';

const NotificationsPanel = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  } = useNotifications();

  const formatRelativeTime = (isoDate) => {
    const timestamp = Date.parse(isoDate);
    if (Number.isNaN(timestamp)) return 'Just now';

    const diffMs = Date.now() - timestamp;
    const diffMinutes = Math.floor(diffMs / 60000);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const sortedNotifications = useMemo(() => {
    return [...notifications].sort((a, b) => Date.parse(b.createdAt || 0) - Date.parse(a.createdAt || 0));
  }, [notifications]);

  const handleOpenNotification = (notification) => {
    markAsRead(notification.id);

    if (notification.path) {
      navigate(notification.path);
    }

    onClose();
  };

  const getNotificationIcon = (type) => {
    if (type === 'comment') return <MessageSquare size={14} className="text-neutral-600 dark:text-neutral-300" />;
    if (type === 'due-date') return <Clock3 size={14} className="text-amber-600 dark:text-amber-400" />;
    return <Bell size={14} className="text-neutral-600 dark:text-neutral-300" />;
  };

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
          {sortedNotifications.length > 0 ? (
            <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {sortedNotifications.map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => handleOpenNotification(notif)}
                  className={`w-full px-4 py-3 text-left transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-700 ${
                    !notif.read ? 'bg-neutral-50 dark:bg-neutral-700/50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-700">
                        {getNotificationIcon(notif.type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{notif.title}</p>
                      <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">{notif.message}</p>
                      <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-500">{formatRelativeTime(notif.createdAt)}</p>
                    </div>
                    {!notif.read && <div className="mt-1 h-2 w-2 rounded-full bg-primary-500" />}
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
        {sortedNotifications.length > 0 && (
          <div className="border-t border-neutral-200 bg-white px-4 py-2 dark:border-neutral-700 dark:bg-neutral-800">
            <div className="flex gap-2">
              <button
                onClick={markAllAsRead}
                className="flex-1 rounded-md px-3 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
              >
                Mark all read
              </button>
              <button
                onClick={clearAll}
                className="flex-1 rounded-md px-3 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationsPanel;
