import { MainLayout } from '../components/layout';
import { Card, Button, Badge } from '../components/ui';
import { TrendingUp, Users, CheckCircle, CalendarDays, MoreHorizontal, ClipboardList, CheckCircle2, Layers3, AlertTriangle } from 'lucide-react';
import { useLayout } from '../contexts/LayoutContext';
import useTheme from '../hooks/useTheme';

const Dashboard = () => {
  const { layoutMode } = useLayout();
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';
  const mockUser = {
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
  };

  const recentTasks = [
    { id: 1, title: 'Design landing page', status: 'In progress', priority: 'High', desc: 'Finalize hero layout and primary CTA, ensure responsive spacing and accessibility.', assignee: 'Alex', time: '2h ago' },
    { id: 2, title: 'Fix login bug', status: 'Done', priority: 'High', desc: 'Resolve redirect race condition after OAuth and restore session safely.', assignee: 'Maya', time: '1d ago' },
    { id: 3, title: 'Update documentation', status: 'Pending', priority: 'Medium', desc: 'Add API usage examples, auth flow, and common troubleshooting steps.', assignee: 'You', time: '3d ago' },
    { id: 4, title: 'Database optimization', status: 'In progress', priority: 'Low', desc: 'Add missing indexes on frequently queried columns and review slow queries.', assignee: 'Sam', time: '5d ago' },
  ];

  const topMetrics = [
    { label: 'Active Tasks', value: '12', tone: 'bg-neutral-100 text-neutral-950 rounded-md dark:bg-neutral-800 dark:text-neutral-100', icon: CheckCircle },
    { label: 'Completed This Week', value: '8', tone: 'bg-neutral-100 text-neutral-950 rounded-md dark:bg-neutral-800 dark:text-neutral-100', icon: TrendingUp },
    { label: 'Team Members', value: '5', tone: 'bg-neutral-100 text-neutral-950 rounded-md dark:bg-neutral-800 dark:text-neutral-100', icon: Users },
  ];

  const quickStats = [
    { label: 'Open Workspaces', value: '6', icon: Layers3 },
    { label: 'Tasks in Progress', value: '2', icon: ClipboardList },
    { label: 'Completed Tasks', value: '18', icon: CheckCircle2 },
    { label: 'Overdue Tasks', value: '3', icon: AlertTriangle },
  ];

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <MainLayout 
      user={mockUser} 
      activeTab="dashboard"
      onNotifications={() => {}}
      onLayout={() => {}}
      onMore={() => {}}
    >
      <div className="dashboard-shell space-y-6 animate-fade-in-up">
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
          <div
            className={`dashboard-welcome-card relative overflow-hidden border p-6 ${isDarkTheme ? 'border-neutral-200 bg-white text-neutral-950' : 'border-neutral-800 bg-neutral-950 text-neutral-100'}`}
          >
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
                <div className={`welcome-card-accent h-3 w-24 rounded-full ${isDarkTheme ? 'bg-neutral-200' : 'bg-white/15'}`} />
                <div>
                  <p className={`welcome-card-title text-3xl font-semibold tracking-tight ${isDarkTheme ? 'text-neutral-950' : 'text-white'}`}>Welcome back, Sarah Johnson!</p>
                  <p className={`welcome-card-copy mt-1 text-sm ${isDarkTheme ? 'text-neutral-600' : 'text-neutral-200'}`}>Here is your live snapshot for tasks, progress, and team activity today.</p>
                </div>
              </div>
              <div className={`welcome-card-pill rounded-md px-4 py-3 text-sm font-medium ${isDarkTheme ? 'border border-neutral-200 bg-neutral-100 text-neutral-700' : 'border border-white/15 bg-white/10 text-white/90'}`}>{today}</div>
            </div>

            <div className={layoutMode === 'grid' ? 'mt-10 grid gap-3 md:grid-cols-3' : 'mt-10 grid gap-3 md:grid-cols-2'}>
              {topMetrics.map((metric) => {
                const Icon = metric.icon;
                return (
                  <div key={metric.label} className={`welcome-card-metric rounded-md p-4 ${isDarkTheme ? 'bg-neutral-50 ring-1 ring-neutral-200/70' : 'bg-white/10 ring-1 ring-white/10'} ${layoutMode === 'list' ? 'sm:p-5' : ''}`}>
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${metric.tone}`.trim()}>
                      <Icon size={15} />
                    </div>
                    <p className={`welcome-card-stat-label mt-6 text-sm ${isDarkTheme ? 'text-neutral-600' : 'text-neutral-200'}`}>{metric.label}</p>
                    <p className={`welcome-card-stat-value mt-1 text-2xl font-semibold ${isDarkTheme ? 'text-neutral-950' : 'text-white'}`}>{metric.value}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={layoutMode === 'grid' ? 'grid gap-4 sm:grid-cols-2' : 'grid gap-4 sm:grid-cols-2'}>
            {quickStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className={`rounded-md border-neutral-200 bg-neutral-100 p-5 shadow-[0_12px_30px_rgba(17,25,43,0.06)] dark:border-neutral-700 dark:bg-neutral-800 ${layoutMode === 'list' ? 'min-h-[140px]' : ''}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{stat.label}</p>
                      <p className="mt-3 text-3xl font-semibold text-neutral-950 dark:text-neutral-100">{stat.value}</p>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-md bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                      <Icon size={18} />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <div className={layoutMode === 'grid' ? 'grid gap-4 xl:grid-cols-[1.7fr_0.95fr]' : 'space-y-4'}>
          <Card className="rounded-md border-neutral-200 bg-neutral-100 p-5 shadow-[0_12px_30px_rgba(17,25,43,0.06)] dark:border-neutral-700 dark:bg-neutral-800">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-neutral-950 dark:text-neutral-100">Recent Tasks</h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Latest updates across your team to help you prioritize what matters most.</p>
              </div>
              <a href="/tasks" className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-neutral-800">View All Tasks</a>
            </div>

            <div className="mt-5 space-y-3">
              {recentTasks.map((task) => {
                const priorityVariant = task.priority === 'High' ? 'error' : task.priority === 'Medium' ? 'warning' : 'success';
                const statusVariant = task.status === 'In progress' ? 'primary' : task.status === 'Done' ? 'success' : task.status === 'Pending' ? 'warning' : 'default';
                return (
                <div key={task.id} className="rounded-md rounded-md bg-neutral-100 p-4 border border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700">
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

          <Card className="rounded-md border-neutral-200 bg-neutral-100 p-5 shadow-[0_12px_30px_rgba(17,25,43,0.06)] dark:border-neutral-700 dark:bg-neutral-800">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-neutral-950 dark:text-neutral-100">Upcoming Deadlines</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Stay ahead of important delivery dates this week.</p>
              </div>
              <CalendarDays size={18} className="text-neutral-400 dark:text-neutral-500" />
            </div>
            <div className="mt-5 space-y-3">
              <div className="rounded-md rounded-md bg-neutral-100 p-4 border border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700">
                <p className="font-medium text-neutral-950 dark:text-neutral-100">Landing Page Design</p>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">Due in 2 days</p>
              </div>
              <div className="rounded-md rounded-md bg-neutral-100 p-4 border border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700">
                <p className="font-medium text-neutral-950 dark:text-neutral-100">API Integration</p>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">Due in 5 days</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="rounded-md border-neutral-200 bg-neutral-100 p-5 shadow-[0_12px_30px_rgba(17,25,43,0.04)] dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-neutral-950 dark:text-neutral-100">Quick Actions</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Jump to common actions and keep momentum.</p>
            </div>
            <MoreHorizontal size={18} className="text-neutral-400 dark:text-neutral-500" />
          </div>
          <div className={layoutMode === 'grid' ? 'mt-5 grid gap-3 sm:grid-cols-2' : 'mt-5 grid gap-3 sm:grid-cols-2'}>
            <button className="w-full rounded-md rounded-md bg-neutral-900 px-4 py-4 text-left text-sm font-medium text-white transition-colors hover:bg-neutral-800">
              Create a new task
            </button>
            <button className="w-full rounded-md rounded-md bg-neutral-900 px-4 py-4 text-left text-sm font-medium text-white transition-colors hover:bg-neutral-800">
              Review blocked items
            </button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
