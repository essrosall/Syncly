import { useEffect, useMemo, useState } from 'react';
import { MainLayout } from '../components/layout';
import { Card, Badge } from '../components/ui';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { TrendingUp, Clock3, ChartColumnIncreasing } from 'lucide-react';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const TASKS_STORAGE_KEY = 'syncly:tasks';
const WORKSPACES_STORAGE_KEY = 'syncly:workspaces';

const defaultTasks = {
  todo: [],
  'in-progress': [],
  review: [],
  done: [],
};

const readStoredJson = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const parseDueDate = (value) => {
  if (!value) return null;

  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatMetricValue = (value, suffix = '') => `${value}${suffix}`;

const flattenTasks = (taskColumns) =>
  Object.entries(taskColumns || {}).flatMap(([columnId, tasks]) =>
    (tasks || []).map((task) => ({ ...task, columnId }))
  );

const Analytics = () => {
  const mockUser = { name: 'Sarah Johnson', email: 'sarah@example.com' };
  const [taskColumns, setTaskColumns] = useState(() => readStoredJson(TASKS_STORAGE_KEY, defaultTasks));
  const [workspaces, setWorkspaces] = useState(() => readStoredJson(WORKSPACES_STORAGE_KEY, []));

  useEffect(() => {
    const syncTasks = () => setTaskColumns(readStoredJson(TASKS_STORAGE_KEY, defaultTasks));
    const syncWorkspaces = () => setWorkspaces(readStoredJson(WORKSPACES_STORAGE_KEY, []));

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
  }, []);

  const analytics = useMemo(() => {
    const allTasks = flattenTasks(taskColumns);
    const activeTasks = allTasks.filter((task) => task.columnId !== 'done');
    const completedTasks = allTasks.filter((task) => task.columnId === 'done');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdueTasks = activeTasks.filter((task) => {
      const dueDate = parseDueDate(task.dueDate);
      return dueDate ? dueDate < today : false;
    });

    const dueSoonTasks = activeTasks.filter((task) => {
      const dueDate = parseDueDate(task.dueDate);
      if (!dueDate) return false;

      const diffDays = Math.round((dueDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
      return diffDays >= 0 && diffDays <= 2;
    });

    const statusCounts = {
      'To Do': taskColumns.todo?.length || 0,
      'In Progress': taskColumns['in-progress']?.length || 0,
      Review: taskColumns.review?.length || 0,
      Done: taskColumns.done?.length || 0,
    };

    const priorityCounts = allTasks.reduce(
      (accumulator, task) => {
        const priority = task.priority || 'medium';
        accumulator[priority] = (accumulator[priority] || 0) + 1;
        return accumulator;
      },
      { high: 0, medium: 0, low: 0 }
    );

    const averageFocusMinutes = allTasks.length > 0
      ? Math.round(
          allTasks.reduce((total, task) => {
            if (task.columnId === 'done') return total + 55;
            if (task.priority === 'high') return total + 40;
            if (task.priority === 'medium') return total + 32;
            return total + 24;
          }, 0) / allTasks.length
        )
      : 0;

    const productivityScore = Math.min(
      100,
      Math.round(
        (completedTasks.length * 18) +
        (dueSoonTasks.length * 4) -
        (overdueTasks.length * 6) +
        (allTasks.length > 0 ? 24 : 0)
      )
    );

    const topWorkspace = [...(workspaces || [])]
      .map((workspace) => {
        const workspaceName = String(workspace.name || '').toLowerCase();
        const workspaceTokens = [workspaceName, ...(workspace.keywords || []).map((item) => String(item).toLowerCase())].filter(Boolean);
        const matchedTasks = allTasks.filter((task) => {
          const haystack = `${task.title} ${task.description || ''} ${task.assignee || ''}`.toLowerCase();
          return workspaceTokens.some((token) => haystack.includes(token));
        });

        return {
          ...workspace,
          matchedTasks: matchedTasks.length,
        };
      })
      .sort((a, b) => b.matchedTasks - a.matchedTasks)[0] || null;

    return {
      allTasks,
      activeTasks,
      completedTasks,
      overdueTasks,
      dueSoonTasks,
      statusCounts,
      priorityCounts,
      averageFocusMinutes,
      productivityScore,
      totalTasks: allTasks.length,
      completionRate: allTasks.length > 0 ? Math.round((completedTasks.length / allTasks.length) * 100) : 0,
      workspaceCount: (workspaces || []).length,
      topWorkspace,
    };
  }, [taskColumns, workspaces]);

  const data = {
    labels: Object.keys(analytics.statusCounts),
    datasets: [
      {
        label: 'Task Count',
        data: Object.values(analytics.statusCounts),
        backgroundColor: ['#1e5aa6', '#10b981', '#f59e0b', '#9ca3af'],
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    indexAxis: 'y',
    maintainAspectRatio: true,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
      interaction: {
        mode: 'index',
        intersect: false,
      },
    scales: {
      x: {
        beginAtZero: true,
          grid: {
            color: '#e5e7eb',
          },
        ticks: {
          color: '#6b7280',
        },
      },
      y: {
          grid: {
            display: false,
          },
        ticks: {
          color: '#6b7280',
        },
      },
    },
  };

  const topWorkspaceCode = analytics.topWorkspace?.inviteCode || analytics.topWorkspace?.name || 'No workspace yet';

  return (
    <MainLayout user={mockUser} activeTab="analytics">
      <div className="space-y-6 animate-fade-in-up">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-100">Analytics</h1>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Track task throughput, workspace activity, and the work that is still in flight.</p>
          </div>
          <Badge variant="primary" size="sm">Live from tasks</Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="rounded-base border-neutral-200 bg-white p-5 shadow-[0_12px_30px_rgba(17,25,43,0.04)] dark:border-neutral-700 dark:bg-neutral-800">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Active tasks</p>
            <p className="mt-2 text-3xl font-semibold text-neutral-950 dark:text-neutral-100">{analytics.activeTasks.length}</p>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Open work that still needs attention.</p>
          </Card>

          <Card className="rounded-base border-neutral-200 bg-white p-5 shadow-[0_12px_30px_rgba(17,25,43,0.04)] dark:border-neutral-700 dark:bg-neutral-800">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Completion rate</p>
            <p className="mt-2 text-3xl font-semibold text-neutral-950 dark:text-neutral-100">{formatMetricValue(analytics.completionRate, '%')}</p>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Share of tasks already closed out.</p>
          </Card>

          <Card className="rounded-base border-neutral-200 bg-white p-5 shadow-[0_12px_30px_rgba(17,25,43,0.04)] dark:border-neutral-700 dark:bg-neutral-800">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Due soon</p>
            <p className="mt-2 text-3xl font-semibold text-neutral-950 dark:text-neutral-100">{analytics.dueSoonTasks.length}</p>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Tasks due in the next two days.</p>
          </Card>

          <Card className="rounded-base border-neutral-200 bg-white p-5 shadow-[0_12px_30px_rgba(17,25,43,0.04)] dark:border-neutral-700 dark:bg-neutral-800">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Workspaces</p>
            <p className="mt-2 text-3xl font-semibold text-neutral-950 dark:text-neutral-100">{analytics.workspaceCount}</p>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 truncate" title={topWorkspaceCode}>Top match: {topWorkspaceCode}</p>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.45fr_0.95fr]">
          <Card className="rounded-base border-neutral-200 bg-white p-6 shadow-[0_12px_30px_rgba(17,25,43,0.04)] dark:border-neutral-700 dark:bg-neutral-800">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-neutral-950 dark:text-neutral-100">Task Distribution</h2>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Live breakdown of tasks across the board</p>
              </div>
              <ChartColumnIncreasing size={18} className="text-neutral-400 dark:text-neutral-500" />
            </div>
            <div className="mt-6 h-64 sm:h-72">
              <Bar data={data} options={chartOptions} />
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="rounded-base border-neutral-200 bg-white p-6 shadow-[0_12px_30px_rgba(17,25,43,0.04)] dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-950 dark:text-neutral-100">Key Metrics</h2>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">A quick read on what the board looks like now</p>
                </div>
                <TrendingUp size={18} className="text-neutral-400 dark:text-neutral-500" />
              </div>
              <ul className="mt-5 space-y-3 text-sm text-neutral-700 dark:text-neutral-200">
                <li className="flex items-center justify-between rounded-base bg-neutral-100 px-4 py-3 dark:border dark:border-neutral-700 dark:bg-neutral-800">
                  <span>Average Focus Time</span>
                  <strong>{formatMetricValue(analytics.averageFocusMinutes, ' min')}</strong>
                </li>
                <li className="flex items-center justify-between rounded-base bg-neutral-100 px-4 py-3 dark:border dark:border-neutral-700 dark:bg-neutral-800">
                  <span>Completed Tasks</span>
                  <strong>{analytics.completedTasks.length}</strong>
                </li>
                <li className="flex items-center justify-between rounded-base bg-neutral-100 px-4 py-3 dark:border dark:border-neutral-700 dark:bg-neutral-800">
                  <span>Productivity Score</span>
                  <strong>{formatMetricValue(analytics.productivityScore, '%')}</strong>
                </li>
                <li className="flex items-center justify-between rounded-base bg-neutral-100 px-4 py-3 dark:border dark:border-neutral-700 dark:bg-neutral-800">
                  <span>Overdue Tasks</span>
                  <strong>{analytics.overdueTasks.length}</strong>
                </li>
              </ul>
            </Card>

            <Card className="rounded-base border-neutral-200 bg-white p-6 shadow-[0_12px_30px_rgba(17,25,43,0.04)] dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-950 dark:text-neutral-100">Trend Notes</h2>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">What the current board is signaling</p>
                </div>
                <Clock3 size={18} className="text-neutral-400 dark:text-neutral-500" />
              </div>
              <p className="mt-5 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                {analytics.overdueTasks.length > 0
                  ? `${analytics.overdueTasks.length} overdue task${analytics.overdueTasks.length === 1 ? '' : 's'} need attention first.`
                  : 'Nothing is overdue right now, so the board is moving in the right direction.'}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Badge variant="success">{analytics.completedTasks.length} completed</Badge>
                <Badge variant="warning">{analytics.dueSoonTasks.length} due soon</Badge>
                <Badge variant="primary">{analytics.workspaceCount} workspaces</Badge>
              </div>
            </Card>
          </div>
        </div>

        <Card className="rounded-base border-neutral-200 bg-white p-6 shadow-[0_12px_30px_rgba(17,25,43,0.04)] dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-neutral-950 dark:text-neutral-100">Priority Mix</h2>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">How the work is split across urgency levels</p>
            </div>
            <Badge variant="primary" size="sm">Live counts</Badge>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              { label: 'High', value: analytics.priorityCounts.high || 0, tone: 'error' },
              { label: 'Medium', value: analytics.priorityCounts.medium || 0, tone: 'warning' },
              { label: 'Low', value: analytics.priorityCounts.low || 0, tone: 'success' },
            ].map((item) => (
              <div key={item.label} className="rounded-base border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{item.label}</p>
                <div className="mt-2 flex items-end justify-between gap-3">
                  <p className="text-2xl font-semibold text-neutral-950 dark:text-neutral-100">{item.value}</p>
                  <Badge variant={item.tone} size="sm">Tasks</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Analytics;
