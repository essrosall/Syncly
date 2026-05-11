import React from 'react';
import { MainLayout } from '../components/layout';
import { Card, Badge } from '../components/ui';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { TrendingUp, Clock3, CheckCircle2, ChartColumnIncreasing, Sparkles } from 'lucide-react';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Analytics = () => {
  const mockUser = { name: 'Sarah Johnson', email: 'sarah@example.com' };

  const data = {
    labels: ['Focus', 'Breaks', 'Meetings', 'Planning'],
    datasets: [
      {
        label: 'Time Distribution',
        data: [60, 18, 14, 8],
        backgroundColor: ['#1e5aa6', '#10b981', '#f59e0b', '#9ca3af'],
        borderRadius: 10,
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
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: '#6b7280',
        },
      },
      y: {
        ticks: {
          color: '#6b7280',
        },
      },
    },
  };

  return (
    <MainLayout user={mockUser} activeTab="analytics">
      <div className="space-y-6 animate-fade-in-up">
        <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
          <Card className="rounded-lg bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 text-white shadow-[0_30px_90px_rgba(30,90,166,0.18)]">
            <div className="relative p-6 lg:p-8">
              <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
              <div className="relative space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
                  <Sparkles size={14} /> Analytics overview
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight">Analytics</h1>
                  <p className="mt-2 max-w-2xl text-sm text-white/80 lg:text-base">Track focus, progress, and delivery patterns across your workspaces.</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-1">
            <Card className="rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Productivity score</p>
                  <p className="mt-3 text-3xl font-semibold text-neutral-900 dark:text-neutral-100">82%</p>
                  <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">+6% this month</p>
                </div>
                <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">
                  <TrendingUp size={20} />
                </div>
              </div>
            </Card>

            <Card className="rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Completed tasks</p>
                  <p className="mt-3 text-3xl font-semibold text-neutral-900 dark:text-neutral-100">18</p>
                  <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">This week across all projects</p>
                </div>
                <div className="rounded-lg bg-primary-500/10 p-3 text-primary-600 dark:text-primary-400">
                  <CheckCircle2 size={20} />
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.45fr_0.95fr]">
          <Card className="rounded-lg p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Focus Distribution</h2>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">How time is being spent this week</p>
              </div>
              <Badge variant="primary" size="sm">This week</Badge>
            </div>
            <div className="mt-6 h-72">
              <Bar data={data} options={chartOptions} />
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Key Metrics</h2>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Fast read on the current workflow</p>
                </div>
                <ChartColumnIncreasing size={18} className="text-neutral-400" />
              </div>
              <ul className="mt-5 space-y-4 text-sm text-neutral-700 dark:text-neutral-300">
                <li className="flex items-center justify-between rounded-lg bg-neutral-100 px-4 py-3 dark:bg-neutral-900">
                  <span>Average Focus Time</span>
                  <strong>45 min</strong>
                </li>
                <li className="flex items-center justify-between rounded-lg bg-neutral-100 px-4 py-3 dark:bg-neutral-900">
                  <span>Completed Tasks / Week</span>
                  <strong>8</strong>
                </li>
                <li className="flex items-center justify-between rounded-lg bg-neutral-100 px-4 py-3 dark:bg-neutral-900">
                  <span>Productivity Score</span>
                  <strong>82%</strong>
                </li>
              </ul>
            </Card>

            <Card className="rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Trend Notes</h2>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Observations from this period</p>
                </div>
                <Clock3 size={18} className="text-neutral-400" />
              </div>
              <p className="mt-5 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                Focus time is strongest in the morning, review periods are shrinking, and task throughput is steady. The next improvement point is reducing mid-day context switching.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Badge variant="success">Stable output</Badge>
                <Badge variant="warning">Mid-day dips</Badge>
                <Badge variant="primary">Morning focus</Badge>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Analytics;
