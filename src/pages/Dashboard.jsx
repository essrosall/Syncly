import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../components/layout';
import { Card, Button, Badge, Modal, EmptyStateCard, TutorialModal } from '../components/ui';
import { TrendingUp, Users, CheckCircle, CalendarDays, ClipboardList, CheckCircle2, Layers3, AlertTriangle, Sparkles, PartyPopper, ArrowRight, X } from 'lucide-react';
import { useLayout } from '../contexts/LayoutContext';
import { useGlobalModal } from '../contexts/GlobalModalContext';
import { useAuth } from '../contexts/AuthContext';
import useTheme from '../hooks/useTheme';

const TASKS_STORAGE_KEY = 'syncly:tasks';
const WORKSPACES_STORAGE_KEY = 'syncly:workspaces';
const LOGIN_WELCOME_NOTICE_KEY = 'syncly:loginWelcomeNotice';
const ACTIVE_LOGIN_SESSION_KEY = 'syncly:activeLoginSession';
const BANNER_DISMISSAL_KEY_PREFIX = 'syncly:dailyBannerDismissed:';

const defaultTasks = {
  todo: [
    { id: 1, title: 'Setup database', priority: 'high', assignee: 'You', dueDate: '2024-05-15', description: 'Configure schema, migrations, and initial tables.' },
    { id: 2, title: 'Create API documentation', priority: 'medium', assignee: 'Alex', dueDate: '2024-05-20', description: 'Document endpoints, request payloads, and response examples.' },
  ],
  'in-progress': [
    { id: 3, title: 'Design landing page', priority: 'high', assignee: 'You', dueDate: '2024-05-12', description: 'Sketch the hero section, layout, and visual direction.' },
    { id: 4, title: 'Implement user auth', priority: 'high', assignee: 'Mike', dueDate: '2024-05-18', description: 'Wire up login, signup, and session handling.' },
  ],
  review: [
    { id: 5, title: 'Performance optimization', priority: 'low', assignee: 'Sarah', dueDate: '2024-05-22', description: 'Profile slow flows and reduce rendering overhead.' },
  ],
  done: [
    { id: 6, title: 'Project setup', priority: 'high', assignee: 'You', dueDate: '2024-05-10', description: 'Initialize the repo, tooling, and starter structure.' },
    { id: 7, title: 'Team onboarding', priority: 'medium', assignee: 'Admin', dueDate: '2024-05-09', description: 'Prepare kickoff notes, access, and checklist items.' },
  ],
};

const readStoredJson = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;

  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : fallback;
  } catch {
    return fallback;
  }
};

const readSessionJson = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;

  try {
    // Prefer localStorage for session persistence across refreshes, fall back to sessionStorage
    const rawLocal = window.localStorage.getItem(key);
    if (rawLocal) return JSON.parse(rawLocal);

    const storedValue = window.sessionStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : fallback;
  } catch {
    return fallback;
  }
};

const defaultWorkspaces = [
  { id: 1, name: 'Product Design' },
  { id: 2, name: 'Mobile App' },
  { id: 3, name: 'Backend Services' },
];

const parseDueDate = (dateString) => {
  if (!dateString) return null;

  const parsed = new Date(`${dateString}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatDueDate = (dateString) => {
  const parsed = parseDueDate(dateString);
  if (!parsed) return 'No due date';

  return parsed.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
  });
};

const getDeadlineLabel = (dateString) => {
  const parsed = parseDueDate(dateString);
  if (!parsed) return 'No due date';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.round((parsed.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
  if (diffDays < 0) return `${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'} overdue`;
  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return 'Due tomorrow';
  return `Due in ${diffDays} days`;
};

const getDaySeed = (date = new Date()) => {
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date - startOfYear;
  return Math.floor(diff / 86400000);
};

const pluralize = (count, singular) => `${count} ${singular}${count === 1 ? '' : 's'}`;

const DAILY_PROMPTS = [
  {
    eyebrow: 'Daily focus',
    title: 'Protect one deep-work block today',
    message: 'Pick the hardest task first, clear one distraction, and give it a focused 25-minute block before anything else.',
  },
  {
    eyebrow: 'Momentum',
    title: 'Small wins still move the board',
    message: 'If the full workload feels heavy, finish one small task and let that progress carry the rest of your day forward.',
  },
  {
    eyebrow: 'Consistency',
    title: 'Keep the workflow simple',
    message: 'Group related work together, avoid bouncing between tabs, and close the loop on one thing at a time.',
  },
  {
    eyebrow: 'Focus',
    title: 'Leave a clear next step',
    message: 'Before you stop, write the next action for your most important task so tomorrow starts with less friction.',
  },
  {
    eyebrow: 'Rhythm',
    title: 'Finish before you refresh',
    message: 'Check messages after a task, not before it. Protect the first win of the day and momentum gets easier.',
  },
];

const buildDailyBrief = ({ daySeed }) => {
  const prompt = DAILY_PROMPTS[daySeed % DAILY_PROMPTS.length];

  return {
    variant: 'primary',
    eyebrow: 'Daily motivation',
    title: prompt.title,
    message: prompt.message,
    helper: 'A small step today is still progress.',
    actionLabel: 'Open tasks',
    actionHref: '/tasks',
    icon: Sparkles,
    surfaceClass: 'border-black/10 bg-black text-white shadow-[0_18px_50px_rgba(0,0,0,0.18)] dark:border-white/10 dark:bg-white dark:text-black dark:shadow-[0_18px_50px_rgba(255,255,255,0.12)]',
    pillClass: 'border-white/15 bg-white/10 text-white dark:border-black/10 dark:bg-black/5 dark:text-black',
    accentClass: '',
    iconClass: 'bg-white text-black ring-1 ring-white/25 dark:bg-black dark:text-white dark:ring-black/10',
  };
};

const buildWelcomeModal = ({ activeTasks, completedTasks, overdueTasks, dueSoonTasks }) => {
  if (overdueTasks.length > 0) {
    const nextTask = overdueTasks[0];

    return {
      variant: 'error',
      title: 'Welcome back, your board needs attention',
      message: `You have ${pluralize(overdueTasks.length, 'overdue task')}. Start with ${nextTask.title} to get back on track.`,
      details: overdueTasks.slice(0, 3).map((task) => `${task.title} · ${getDeadlineLabel(task.dueDate)}`),
      primaryLabel: 'Go to tasks',
      primaryHref: '/tasks',
    };
  }

  if (dueSoonTasks.length > 0) {
    const nextTask = dueSoonTasks[0];

    return {
      variant: 'warning',
      title: 'Welcome back, a deadline is near',
      message: `${nextTask.title} is due ${getDeadlineLabel(nextTask.dueDate)}. A quick review now will save time later.`,
      details: dueSoonTasks.slice(0, 3).map((task) => `${task.title} · ${getDeadlineLabel(task.dueDate)}`),
      primaryLabel: 'Review tasks',
      primaryHref: '/tasks',
    };
  }

  if (activeTasks.length === 0 && completedTasks.length > 0) {
    return {
      variant: 'success',
      title: 'Welcome back, everything is complete',
      message: 'Nice work. Your board is clear, which means you can plan the next round of work or simply enjoy the progress you made.',
      details: [
        `${pluralize(completedTasks.length, 'completed task')}`,
        'Nothing is overdue right now.',
      ],
      primaryLabel: 'Open tasks',
      primaryHref: '/tasks',
    };
  }

  if (activeTasks.length === 0) {
    return {
      variant: 'primary',
      title: 'Welcome back, your workspace is ready',
      message: 'You do not have any active tasks yet. Create one to get the day moving and keep your plan visible.',
      details: ['Start with a single clear task.', 'Add a due date so it shows up on the dashboard.'],
      primaryLabel: 'Create first task',
      primaryHref: '/tasks?new=todo',
    };
  }

  return {
    variant: 'primary',
    title: 'Welcome back, you are signed in',
    message: `You have ${pluralize(activeTasks.length, 'active task')} and ${pluralize(completedTasks.length, 'completed task')}. Pick the next move and keep the momentum going.`,
    details: [
      `${pluralize(dueSoonTasks.length, 'task')} due soon`,
      `${pluralize(completedTasks.length, 'task')} already done`,
    ],
    primaryLabel: 'Open tasks',
    primaryHref: '/tasks',
  };
};

const Dashboard = () => {
  const { user } = useAuth();
  const { layoutMode } = useLayout();
  const { openModal } = useGlobalModal();
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';
  const [welcomeModal, setWelcomeModal] = useState(null);
  const [loginSession, setLoginSession] = useState(() => readSessionJson(ACTIVE_LOGIN_SESSION_KEY, null));
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const accountKey = useMemo(() => user?.id || user?.email || 'guest', [user]);
  const [taskColumns, setTaskColumns] = useState(() => readStoredJson(`syncly:${accountKey}:tasks`, defaultTasks));
  const [workspaces, setWorkspaces] = useState(() => readStoredJson(WORKSPACES_STORAGE_KEY, defaultWorkspaces));
  const mockUser = {
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
  };

  useEffect(() => {
    let nextLoginSession = readSessionJson(ACTIVE_LOGIN_SESSION_KEY, null);

    try {
      const rawNotice = window.sessionStorage.getItem(LOGIN_WELCOME_NOTICE_KEY);
      if (rawNotice) {
        const parsedNotice = JSON.parse(rawNotice);
        // If the user hasn't seen the tutorial tour yet, show the tutorial instead
        try {
          const tutorialSeen = window.localStorage.getItem('syncly:seenTutorialTour');
          if (!tutorialSeen) {
            // open tutorial modal (uses global modal provider elsewhere)
            try { openModal(TutorialModal, { shell: false }); } catch {}
            // still record active session but don't show the welcome modal
            nextLoginSession = parsedNotice;
            window.sessionStorage.setItem(ACTIVE_LOGIN_SESSION_KEY, JSON.stringify(parsedNotice));
            window.sessionStorage.removeItem(LOGIN_WELCOME_NOTICE_KEY);
          } else {
            setWelcomeModal(parsedNotice);
            nextLoginSession = parsedNotice;
            window.sessionStorage.setItem(ACTIVE_LOGIN_SESSION_KEY, JSON.stringify(parsedNotice));
            window.sessionStorage.removeItem(LOGIN_WELCOME_NOTICE_KEY);
          }
        } catch {
          setWelcomeModal(parsedNotice);
          nextLoginSession = parsedNotice;
          window.sessionStorage.setItem(ACTIVE_LOGIN_SESSION_KEY, JSON.stringify(parsedNotice));
          window.sessionStorage.removeItem(LOGIN_WELCOME_NOTICE_KEY);
        }
      }
    } catch {
      // ignore malformed session storage
    }

    setLoginSession(nextLoginSession);

    if (nextLoginSession?.signedInAt) {
      const dismissalKey = `${BANNER_DISMISSAL_KEY_PREFIX}${nextLoginSession.signedInAt}`;
      setBannerDismissed(window.sessionStorage.getItem(dismissalKey) === '1');
    } else {
      setBannerDismissed(false);
    }

    const syncTasks = () => setTaskColumns(readStoredJson(`syncly:${accountKey}:tasks`, defaultTasks));
    const syncWorkspaces = () => setWorkspaces(readStoredJson(WORKSPACES_STORAGE_KEY, defaultWorkspaces));

    window.addEventListener('storage', syncTasks);
    window.addEventListener('storage', syncWorkspaces);
    window.addEventListener('syncly:tasks-updated', syncTasks);
    window.addEventListener('syncly:workspaces-updated', syncWorkspaces);

    return () => {
      window.removeEventListener('storage', syncTasks);
      window.removeEventListener('storage', syncWorkspaces);
      window.removeEventListener('syncly:tasks-updated', syncTasks);
      window.removeEventListener('syncly:workspaces-updated', syncWorkspaces);
    };
  }, [accountKey]);

  const bannerDismissalKey = loginSession?.signedInAt ? `${BANNER_DISMISSAL_KEY_PREFIX}${loginSession.signedInAt}` : null;

  const handleDismissBanner = () => {
    if (!bannerDismissalKey) return;

    try {
      window.sessionStorage.setItem(bannerDismissalKey, '1');
    } catch {
      // ignore storage issues
    }

    setBannerDismissed(true);
  };

  const allTasks = useMemo(
    () => Object.entries(taskColumns).flatMap(([columnId, tasks]) => (tasks || []).map((task) => ({ ...task, columnId }))),
    [taskColumns]
  );

  const activeTasks = useMemo(() => allTasks.filter((task) => task.columnId !== 'done'), [allTasks]);
  const completedTasks = useMemo(() => allTasks.filter((task) => task.columnId === 'done'), [allTasks]);
  const overdueTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return activeTasks.filter((task) => {
      const due = parseDueDate(task.dueDate);
      return due && due < today;
    });
  }, [activeTasks]);

  const dueSoonTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const twoDaysFromNow = new Date(today);
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);

    return activeTasks.filter((task) => {
      const due = parseDueDate(task.dueDate);
      return due && due >= today && due <= twoDaysFromNow;
    });
  }, [activeTasks]);

  const upcomingDeadlines = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return [...activeTasks]
      .filter((task) => task.dueDate)
      .sort((a, b) => {
        const aDue = parseDueDate(a.dueDate);
        const bDue = parseDueDate(b.dueDate);
        const aTime = aDue ? aDue.getTime() : Number.POSITIVE_INFINITY;
        const bTime = bDue ? bDue.getTime() : Number.POSITIVE_INFINITY;
        return aTime - bTime;
      })
      .slice(0, 3);
  }, [activeTasks]);

  const recentTasks = useMemo(() => {
    return [...allTasks]
      .filter((task) => task.columnId !== 'done')
      .sort((a, b) => {
        const aDue = parseDueDate(a.dueDate);
        const bDue = parseDueDate(b.dueDate);
        const aTime = aDue ? aDue.getTime() : Number.POSITIVE_INFINITY;
        const bTime = bDue ? bDue.getTime() : Number.POSITIVE_INFINITY;
        return aTime - bTime;
      })
      .slice(0, 4)
      .map((task) => ({
        ...task,
        status: task.columnId === 'in-progress' ? 'In progress' : task.columnId === 'review' ? 'Pending review' : task.columnId === 'done' ? 'Done' : 'To do',
        priority: task.priority.charAt(0).toUpperCase() + task.priority.slice(1),
        desc: task.description || 'No description added yet.',
        time: getDeadlineLabel(task.dueDate),
      }));
  }, [allTasks]);

  const teamMembersCount = useMemo(() => {
    const members = new Set(allTasks.map((task) => task.assignee).filter(Boolean));
    return members.size;
  }, [allTasks]);

  const topMetrics = useMemo(() => ([
    { label: 'Active Tasks', value: String(activeTasks.length), tone: 'bg-neutral-100 text-neutral-950 rounded-base dark:bg-neutral-800 dark:text-neutral-100', icon: CheckCircle },
    { label: 'Completed Tasks', value: String(completedTasks.length), tone: 'bg-neutral-100 text-neutral-950 rounded-base dark:bg-neutral-800 dark:text-neutral-100', icon: TrendingUp },
    { label: 'Team Members', value: String(teamMembersCount), tone: 'bg-neutral-100 text-neutral-950 rounded-base dark:bg-neutral-800 dark:text-neutral-100', icon: Users },
  ]), [activeTasks.length, completedTasks.length, teamMembersCount]);

  const quickStats = useMemo(() => ([
    { label: 'Open Workspaces', value: String(workspaces.length), icon: Layers3 },
    { label: 'Tasks in Progress', value: String(taskColumns['in-progress']?.length || 0), icon: ClipboardList },
    { label: 'Completed Tasks', value: String(completedTasks.length), icon: CheckCircle2 },
    { label: 'Overdue Tasks', value: String(overdueTasks.length), icon: AlertTriangle },
  ]), [completedTasks.length, overdueTasks.length, taskColumns, workspaces.length]);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const daySeed = getDaySeed();
  const dailyBrief = useMemo(() => buildDailyBrief({ daySeed }), [daySeed]);
  const showDailyBanner = Boolean(loginSession) && !bannerDismissed;

  const loginWelcome = useMemo(() => {
    if (!welcomeModal) return null;

    return buildWelcomeModal({ activeTasks, completedTasks, overdueTasks, dueSoonTasks });
  }, [welcomeModal, activeTasks, completedTasks, overdueTasks, dueSoonTasks]);

  return (
    <MainLayout 
      user={mockUser} 
      activeTab="dashboard"
      onNotifications={() => {}}
      onLayout={() => {}}
      onMore={() => {}}
    >
      <div className="dashboard-shell space-y-6 animate-fade-in-up">
        {showDailyBanner && (
          <Card className={`relative overflow-hidden rounded-base p-6 md:p-7 !bg-black !text-white !border-black dark:!bg-white dark:!text-black dark:!border-white ${dailyBrief.surfaceClass}`}>
            <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_28%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.08),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.05),transparent_28%)]" />
            <div aria-hidden="true" className="absolute -right-12 top-8 h-28 w-28 rounded-full bg-white/10 blur-3xl dark:bg-black/10" />
            <div aria-hidden="true" className="absolute -bottom-10 left-8 h-28 w-28 rounded-full bg-white/8 blur-3xl dark:bg-black/10" />
            {/* accent line removed to avoid light-blue highlight */}
            <button
              type="button"
              onClick={handleDismissBanner}
              aria-label="Dismiss daily banner"
              className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white shadow-sm transition hover:bg-white/20 hover:text-white dark:border-black/10 dark:bg-black/5 dark:text-black dark:hover:bg-black/10 dark:hover:text-black"
            >
              <X size={16} />
            </button>
            <div className="relative grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
              <div className="max-w-3xl space-y-4">
                <Badge variant="primary" className={`w-fit border ${dailyBrief.pillClass}`}>
                  {dailyBrief.eyebrow}
                </Badge>
                <div className="space-y-3">
                  <p className="text-2xl font-semibold tracking-tight !text-white dark:!text-black md:text-[1.75rem]">{dailyBrief.title}</p>
                  <p className="max-w-2xl text-sm leading-6 text-white/85 dark:text-black/75">{dailyBrief.message}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-white shadow-sm dark:border-black/15 dark:bg-black/5 dark:text-black">
                      <span className={`flex h-6 w-6 items-center justify-center rounded-full ${dailyBrief.iconClass}`}>
                        <dailyBrief.icon size={13} />
                      </span>
                      <span>{dailyBrief.helper}</span>
                    </span>
                    <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-white dark:border-black/15 dark:bg-black/5 dark:text-black">
                      1 task can change the day
                    </span>
                  </div>
                </div>
                <Link
                  to={dailyBrief.actionHref}
                  className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-white/15 hover:text-white dark:border-black/15 dark:bg-black/5 dark:text-black dark:hover:bg-black/10"
                >
                  {dailyBrief.actionLabel}
                </Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-base border border-white/20 bg-white/5 p-4 shadow-sm dark:border-black/15 dark:bg-black/5">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-base ${dailyBrief.iconClass}`}>
                      <dailyBrief.icon size={18} />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-white dark:text-black">Fresh for today</p>
                      <p className="text-xs text-white/75 dark:text-black/65">Updated for {today}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-base border border-white/20 bg-white/5 p-4 shadow-sm dark:border-black/15 dark:bg-black/5">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/75 dark:text-black/60">Focus cue</p>
                  <p className="mt-2 text-sm leading-6 text-white/85 dark:text-black/60">
                    Start with the next visible task and keep the momentum simple.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-100">Dashboard Overview</h1>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Overview of your active workspaces, recent tasks, and team productivity.</p>
          </div>
          <Button variant="primary" size="sm" className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800">
            Import Tasks
          </Button>
        </div>

        <div className={layoutMode === 'grid' ? 'grid gap-4 xl:grid-cols-[1.7fr_0.95fr]' : 'space-y-4'}>
          <div className={`${isDarkTheme ? 'p-6 bg-white text-neutral-900 border border-neutral-200 shadow-sm rounded-base' : 'p-6 bg-black text-white border border-neutral-800 shadow-sm rounded-base'}`}>
            <div
              aria-hidden="true"
              className="welcome-card-orb"
              style={{
                background: isDarkTheme
                  ? 'radial-gradient(circle, rgba(24,24,27,0.42) 0%, rgba(24,24,27,0.14) 36%, rgba(24,24,27,0) 72%)'
                  : 'radial-gradient(circle, rgba(229,231,235,0.46) 0%, rgba(229,231,235,0.16) 36%, rgba(229,231,235,0) 72%)',
                opacity: isDarkTheme ? 0.22 : 0.36,
                mixBlendMode: isDarkTheme ? 'multiply' : 'soft-light',
              }}
            />
            <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-start">
              <div className="space-y-4">
                <div className={`welcome-card-accent h-3 w-24 rounded-full ${isDarkTheme ? 'bg-neutral-900' : 'bg-white'}`} />
                <div>
                  <p className={`welcome-card-title text-3xl font-semibold tracking-tight ${isDarkTheme ? 'text-neutral-900' : 'text-white'}`}>Welcome back, Sarah Johnson!</p>
                  <p className={`welcome-card-copy mt-1 text-sm ${isDarkTheme ? 'text-neutral-700' : 'text-slate-300'}`}>Here is your live snapshot for tasks, progress, and team activity today.</p>
                </div>
              </div>
              <div className={`welcome-card-pill rounded-base px-4 py-3 text-sm font-medium ${isDarkTheme ? 'border border-neutral-200 bg-neutral-100 text-neutral-900' : 'border border-neutral-800 bg-neutral-900 text-white'}`}>{today}</div>
            </div>

            <div className={layoutMode === 'grid' ? 'mt-10 grid gap-3 md:grid-cols-3' : 'mt-10 grid gap-3 md:grid-cols-2'}>
              {topMetrics.map((metric) => {
                const Icon = metric.icon;
                return (
                  <div key={metric.label} className={`welcome-card-metric rounded-base p-4 ${isDarkTheme ? 'bg-neutral-50 ring-1 ring-neutral-200' : 'bg-neutral-900 ring-1 ring-neutral-800'} ${layoutMode === 'list' ? 'sm:p-5' : ''}`}>
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${metric.tone}`.trim()}>
                      <Icon size={15} />
                    </div>
                    <p className={`welcome-card-stat-label mt-6 text-sm ${isDarkTheme ? 'text-neutral-600' : 'text-slate-300'}`}>{metric.label}</p>
                    <p className={`welcome-card-stat-value mt-1 text-2xl font-semibold ${isDarkTheme ? 'text-neutral-900' : 'text-white'}`}>{metric.value}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={layoutMode === 'grid' ? 'grid gap-4 sm:grid-cols-2' : 'grid gap-4 sm:grid-cols-2'}>
            {quickStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className={`p-5 ${layoutMode === 'list' ? 'min-h-[140px]' : ''}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{stat.label}</p>
                      <p className="mt-3 text-3xl font-semibold text-neutral-950 dark:text-neutral-100">{stat.value}</p>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-base bg-white/70 text-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-200">
                      <Icon size={18} />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <div className={layoutMode === 'grid' ? 'grid gap-4 xl:grid-cols-[1.7fr_0.95fr]' : 'space-y-4'}>
          <Card className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-neutral-950 dark:text-neutral-100">Recent Tasks</h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Latest updates across your team to help you prioritize what matters most.</p>
              </div>
              <a href="/tasks" className="rounded-base bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-neutral-800">View All Tasks</a>
            </div>

            <div className="mt-5 space-y-3">
              {recentTasks.map((task) => {
                const priorityVariant = task.priority === 'High' ? 'error' : task.priority === 'Medium' ? 'warning' : 'success';
                const statusVariant = task.status === 'In progress' ? 'primary' : task.status === 'Done' ? 'success' : task.status === 'Pending' ? 'warning' : 'default';
                return (
                <div key={task.id} className="rounded-base bg-neutral-100 p-4 border border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-neutral-950 dark:text-neutral-100">{task.title}</p>
                        <Badge variant={priorityVariant} size="sm">{task.priority}</Badge>
                      </div>
                      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{task.desc}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                        <span className="rounded-full bg-neutral-100 px-3 py-1 dark:bg-neutral-800">Assigned to <strong className="text-neutral-800 dark:text-neutral-200">{task.assignee}</strong></span>
                        <span>{task.time}</span>
                      </div>
                    </div>
                    <Badge variant={statusVariant} size="sm">{task.status}</Badge>
                  </div>
                </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-neutral-950 dark:text-neutral-100">Upcoming Deadlines</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Stay ahead of important delivery dates this week.</p>
              </div>
              <CalendarDays size={18} className="text-neutral-400 dark:text-neutral-500" />
            </div>
            <div className="mt-5 space-y-3">
              {upcomingDeadlines.length > 0 ? (
                upcomingDeadlines.map((task) => {
                  const due = getDeadlineLabel(task.dueDate);
                  const dueDate = formatDueDate(task.dueDate);
                  const priorityVariant = task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'success';

                  return (
                    <div key={task.id} className="rounded-base border border-neutral-200 bg-neutral-100 p-4 dark:border-neutral-700 dark:bg-neutral-800">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium text-neutral-950 dark:text-neutral-100">{task.title}</p>
                          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{due}</p>
                        </div>
                        <Badge variant={priorityVariant} size="sm">
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </Badge>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                        <span>{task.assignee}</span>
                        <span>{dueDate}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <EmptyStateCard
                  icon={CalendarDays}
                  title="No upcoming deadlines yet."
                  description="Add a due date to a task and it will show up here so the next priority stays visible."
                  className="min-h-[10rem] border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800"
                />
              )}
            </div>
          </Card>
        </div>

        <Modal
          isOpen={Boolean(loginWelcome)}
          onClose={() => setWelcomeModal(null)}
          title={loginWelcome?.title || 'Welcome back'}
          className="max-w-2xl"
        >
          {loginWelcome && (
            <div className="space-y-5">
              <div className={`rounded-base border p-4 ${loginWelcome.variant === 'error' ? 'border-error-200 bg-error-50 dark:border-error-800 dark:bg-error-950/25' : loginWelcome.variant === 'warning' ? 'border-warning-200 bg-warning-50 dark:border-warning-800 dark:bg-warning-950/25' : 'border-success-200 bg-success-50 dark:border-success-800 dark:bg-success-950/25'}`}>
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-full ${loginWelcome.variant === 'error' ? 'bg-error-100 text-error-700 dark:bg-error-900 dark:text-error-100' : loginWelcome.variant === 'warning' ? 'bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-100' : 'bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-100'}`}>
                    {loginWelcome.variant === 'error' ? <AlertTriangle size={18} /> : loginWelcome.variant === 'warning' ? <AlertTriangle size={18} /> : <PartyPopper size={18} />}
                  </div>
                  <div>
                    <Badge variant={loginWelcome.variant === 'error' ? 'error' : loginWelcome.variant === 'warning' ? 'warning' : 'success'}>
                      {loginWelcome.variant === 'error' ? 'Attention needed' : loginWelcome.variant === 'warning' ? 'Warning' : 'Congratulations'}
                    </Badge>
                    <p className="mt-3 text-sm text-neutral-700 dark:text-neutral-300">{loginWelcome.message}</p>
                    {welcomeModal?.email && (
                      <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">Signed in as {welcomeModal.email}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2 rounded-base border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                <p className="font-medium text-neutral-950 dark:text-neutral-100">What to look at next</p>
                <ul className="space-y-2">
                  {loginWelcome.details.map((detail) => (
                    <li key={detail} className="flex items-center gap-2">
                      <ArrowRight size={14} className="text-neutral-500 dark:text-neutral-400" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Link
                  to={loginWelcome.primaryHref}
                  className="inline-flex items-center justify-center rounded-base bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                  onClick={() => setWelcomeModal(null)}
                >
                  {loginWelcome.primaryLabel}
                </Link>
                <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={() => setWelcomeModal(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
