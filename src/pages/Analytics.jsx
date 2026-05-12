import { MainLayout } from '../components/layout';
import { Card, Badge } from '../components/ui';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { TrendingUp, Clock3, ChartColumnIncreasing } from 'lucide-react';

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
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-100">Analytics</h1>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Track productivity metrics, time allocation, and team performance.</p>
          </div>
          <Badge variant="primary" size="sm">This week</Badge>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.45fr_0.95fr]">
            <Card className="rounded-md border-neutral-200 bg-white p-6 shadow-[0_12px_30px_rgba(17,25,43,0.04)] dark:border-neutral-700 dark:bg-neutral-800">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-neutral-950 dark:text-neutral-100">Focus Distribution</h2>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Breakdown of weekly time spent across activities</p>
              </div>
              <ChartColumnIncreasing size={18} className="text-neutral-400 dark:text-neutral-500" />
            </div>
            <div className="mt-6 h-72">
              <Bar data={data} options={chartOptions} />
            </div>
          </Card>

          <div className="space-y-4">
              <Card className="rounded-md border-neutral-200 bg-white p-6 shadow-[0_12px_30px_rgba(17,25,43,0.04)] dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-950 dark:text-neutral-100">Key Metrics</h2>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Performance indicators at a glance</p>
                </div>
                <TrendingUp size={18} className="text-neutral-400 dark:text-neutral-500" />
              </div>
              <ul className="mt-5 space-y-3 text-sm text-neutral-700 dark:text-neutral-200">
                  <li className="flex items-center justify-between rounded-md bg-neutral-100 px-4 py-3 dark:bg-neutral-800 dark:border dark:border-neutral-700">
                  <span>Average Focus Time</span>
                  <strong>45 min</strong>
                </li>
                  <li className="flex items-center justify-between rounded-md bg-neutral-100 px-4 py-3 dark:bg-neutral-800 dark:border dark:border-neutral-700">
                  <span>Completed Tasks / Week</span>
                  <strong>8</strong>
                </li>
                  <li className="flex items-center justify-between rounded-md bg-neutral-100 px-4 py-3 dark:bg-neutral-800 dark:border dark:border-neutral-700">
                  <span>Productivity Score</span>
                  <strong>82%</strong>
                </li>
              </ul>
            </Card>

            <Card className="rounded-md border-neutral-200 bg-white p-6 shadow-[0_12px_30px_rgba(17,25,43,0.04)] dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-950 dark:text-neutral-100">Trend Notes</h2>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Observations from this period</p>
                </div>
                <Clock3 size={18} className="text-neutral-400 dark:text-neutral-500" />
              </div>
              <p className="mt-5 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                Focus time is strongest in the morning, review periods are shrinking, and task throughput is steady.
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
