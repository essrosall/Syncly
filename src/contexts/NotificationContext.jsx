import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';

const NOTIFICATIONS_STORAGE_KEY = 'syncly:notifications';
const TASKS_STORAGE_KEY = 'syncly:tasks';

const NotificationContext = createContext(null);

const readStoredJson = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const createId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const getStartOfToday = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
};

const parseDueDate = (dateString) => {
  if (!dateString) return null;

  const parsed = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return null;

  return parsed;
};

const buildDueDateNotificationTemplates = (tasksByColumn) => {
  const templates = [];
  const today = getStartOfToday();
  const msInDay = 24 * 60 * 60 * 1000;

  Object.entries(tasksByColumn || {}).forEach(([columnId, columnTasks]) => {
    if (columnId === 'done') return;

    (columnTasks || []).forEach((task) => {
      const due = parseDueDate(task.dueDate);
      if (!due) return;

      const diffDays = Math.round((due.getTime() - today.getTime()) / msInDay);
      let severity = null;
      let title = '';
      let message = '';

      if (diffDays < 0) {
        const daysOverdue = Math.abs(diffDays);
        severity = 'overdue';
        title = `Task overdue: ${task.title}`;
        message = `${daysOverdue} day${daysOverdue === 1 ? '' : 's'} overdue. Please review this task.`;
      } else if (diffDays === 0) {
        severity = 'today';
        title = `Task due today: ${task.title}`;
        message = 'This task is due today.';
      } else if (diffDays <= 2) {
        severity = 'soon';
        title = `Upcoming due date: ${task.title}`;
        message = `Due in ${diffDays} day${diffDays === 1 ? '' : 's'}.`;
      }

      if (!severity) return;

      templates.push({
        type: 'due-date',
        title,
        message,
        sourceKey: `due:${task.id}:${task.dueDate}:${severity}`,
        path: `/tasks?taskId=${task.id}`,
        taskId: String(task.id),
      });
    });
  });

  return templates;
};

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState(() => readStoredJson(NOTIFICATIONS_STORAGE_KEY, []));

  useEffect(() => {
    try {
      window.localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    } catch {
      // ignore storage errors
    }
  }, [notifications]);

  // Load notifications from Supabase when available and user is signed in
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!isSupabaseConfigured || !supabase || !user) return;

      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(200);

        if (error) return;
        if (!mounted) return;

        const mapped = (data || []).map((row) => ({
          id: row.id,
          type: row.type || 'update',
          title: row.payload?.title || '',
          message: row.payload?.message || '',
          path: row.payload?.path || null,
          taskId: row.payload?.taskId || null,
          sourceKey: row.payload?.sourceKey || null,
          read: Boolean(row.is_read),
          createdAt: row.created_at,
        }));

        setNotifications(mapped);
      } catch (err) {
        // ignore load errors and fall back to localStorage
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [user]);

  // Realtime subscription for notifications
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase || !user) return undefined;

    const channel = supabase
      .channel(`public:notifications:user=${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, (payload) => {
        const { eventType, new: newRow, old: oldRow } = payload;

        if (payload.eventType === 'INSERT' || payload.event === 'INSERT') {
          const row = newRow || payload;
          const mapped = {
            id: row.id,
            type: row.type || 'update',
            title: row.payload?.title || '',
            message: row.payload?.message || '',
            path: row.payload?.path || null,
            taskId: row.payload?.taskId || null,
            sourceKey: row.payload?.sourceKey || null,
            read: Boolean(row.is_read),
            createdAt: row.created_at,
          };

          setNotifications((prev) => [mapped, ...prev].slice(0, 200));
        }

        if (payload.eventType === 'UPDATE' || payload.event === 'UPDATE') {
          const row = newRow || payload;
          setNotifications((prev) => prev.map((n) => (n.id === row.id ? { ...n, read: Boolean(row.is_read) } : n)));
        }

        if (payload.eventType === 'DELETE' || payload.event === 'DELETE') {
          const row = oldRow || payload;
          setNotifications((prev) => prev.filter((n) => n.id !== row.id));
        }
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  const addNotification = useCallback((notification) => {
    // If Supabase is available and user is signed in, persist to DB
    if (isSupabaseConfigured && supabase && user) {
      (async () => {
        try {
          const payload = {
            title: notification.title || 'Notification',
            message: notification.message || '',
            path: notification.path || null,
            taskId: notification.taskId || null,
            sourceKey: notification.sourceKey || null,
          };

          const { data, error } = await supabase
            .from('notifications')
            .insert([
              {
                user_id: user.id,
                type: notification.type || 'update',
                payload,
                is_read: Boolean(notification.read) || false,
              },
            ])
            .select()
            .single();

          if (error || !data) return;

          const mapped = {
            id: data.id,
            type: data.type,
            title: data.payload?.title || '',
            message: data.payload?.message || '',
            path: data.payload?.path || null,
            taskId: data.payload?.taskId || null,
            sourceKey: data.payload?.sourceKey || null,
            read: Boolean(data.is_read),
            createdAt: data.created_at,
          };

          setNotifications((prev) => [mapped, ...prev].slice(0, 200));
        } catch {
          // fall back to localStorage behaviour on error
          setNotifications((prev) => {
            if (notification.sourceKey && prev.some((item) => item.sourceKey === notification.sourceKey)) {
              return prev;
            }

            const nextNotification = {
              id: createId(),
              type: notification.type || 'update',
              title: notification.title || 'Notification',
              message: notification.message || '',
              path: notification.path || null,
              taskId: notification.taskId || null,
              sourceKey: notification.sourceKey || null,
              read: Boolean(notification.read),
              createdAt: notification.createdAt || new Date().toISOString(),
            };

            return [nextNotification, ...prev].slice(0, 200);
          });
        }
      })();

      return;
    }

    // Fallback: local-only notification
    setNotifications((prev) => {
      if (notification.sourceKey && prev.some((item) => item.sourceKey === notification.sourceKey)) {
        return prev;
      }

      const nextNotification = {
        id: createId(),
        type: notification.type || 'update',
        title: notification.title || 'Notification',
        message: notification.message || '',
        path: notification.path || null,
        taskId: notification.taskId || null,
        sourceKey: notification.sourceKey || null,
        read: Boolean(notification.read),
        createdAt: notification.createdAt || new Date().toISOString(),
      };

      return [nextNotification, ...prev].slice(0, 200);
    });
  }, []);

  const refreshNotifications = useCallback(() => {
    const tasksByColumn = readStoredJson(TASKS_STORAGE_KEY, null);
    if (!tasksByColumn) return;

    const dueTemplates = buildDueDateNotificationTemplates(tasksByColumn);
    const activeDueKeys = new Set(dueTemplates.map((entry) => entry.sourceKey));

    setNotifications((prev) => {
      const kept = prev.filter((entry) => {
        if (entry.type !== 'due-date') return true;
        return entry.sourceKey && activeDueKeys.has(entry.sourceKey);
      });

      const existingKeys = new Set(kept.map((entry) => entry.sourceKey).filter(Boolean));
      const toAdd = dueTemplates
        .filter((entry) => !existingKeys.has(entry.sourceKey))
        .map((entry) => ({
          id: createId(),
          ...entry,
          read: false,
          createdAt: new Date().toISOString(),
        }));

      return [...toAdd, ...kept].slice(0, 200);
    });
  }, []);

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === TASKS_STORAGE_KEY) {
        refreshNotifications();
        return;
      }

      if (event.key === NOTIFICATIONS_STORAGE_KEY) {
        setNotifications(readStoredJson(NOTIFICATIONS_STORAGE_KEY, []));
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [refreshNotifications]);

  const markAsRead = useCallback((id) => {
    if (isSupabaseConfigured && supabase && user) {
      supabase.from('notifications').update({ is_read: true }).eq('id', id).then(() => {
        setNotifications((prev) => prev.map((entry) => (entry.id === id ? { ...entry, read: true } : entry)));
      }).catch(() => {
        setNotifications((prev) => prev.map((entry) => (entry.id === id ? { ...entry, read: true } : entry)));
      });

      return;
    }

    setNotifications((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, read: true } : entry))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    if (isSupabaseConfigured && supabase && user) {
      supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id).then(() => {
        setNotifications((prev) => prev.map((entry) => ({ ...entry, read: true })));
      }).catch(() => {
        setNotifications((prev) => prev.map((entry) => ({ ...entry, read: true })));
      });

      return;
    }

    setNotifications((prev) => prev.map((entry) => ({ ...entry, read: true })));
  }, []);

  const deleteNotification = useCallback((id) => {
    if (isSupabaseConfigured && supabase && user) {
      supabase.from('notifications').delete().eq('id', id).then(() => {
        setNotifications((prev) => prev.filter((entry) => entry.id !== id));
      }).catch(() => {
        setNotifications((prev) => prev.filter((entry) => entry.id !== id));
      });

      return;
    }

    setNotifications((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    if (isSupabaseConfigured && supabase && user) {
      supabase.from('notifications').delete().eq('user_id', user.id).then(() => {
        setNotifications([]);
      }).catch(() => {
        setNotifications([]);
      });

      return;
    }

    setNotifications([]);
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((entry) => !entry.read).length,
    [notifications]
  );

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAll,
      refreshNotifications,
    }),
    [
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAll,
      refreshNotifications,
    ]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }

  return context;
};

export default NotificationProvider;
