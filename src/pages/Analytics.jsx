import React from 'react';
import { MainLayout } from '../components/layout';
import { Card } from '../components/ui';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const Analytics = () => {
  const mockUser = { name: 'Sarah Johnson', email: 'sarah@example.com' };

  const data = {
    labels: ['Focus', 'Breaks', 'Meetings', 'Other'],
    datasets: [
      {
        label: 'Time Distribution',
        data: [60, 20, 10, 10],
        backgroundColor: ['#1e5aa6', '#10b981', '#f59e0b', '#9ca3af'],
      },
    ],
  };

  return (
    <MainLayout user={mockUser} activeTab="analytics">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-neutral-900 dark:text-neutral-100">Analytics</h1>
          <p className="text-neutral-700 dark:text-neutral-400">Visualize your productivity and focus</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <h2 className="font-semibold mb-4 text-neutral-900 dark:text-neutral-100">Focus Distribution</h2>
              <Doughnut data={data} />
            </Card>
          </div>

          <div>
            <Card>
              <h2 className="font-semibold mb-4 text-neutral-900 dark:text-neutral-100">Key Metrics</h2>
              <ul className="space-y-3 text-sm text-neutral-700 dark:text-neutral-400">
                <li>Average Focus Time: 45 min</li>
                <li>Completed Tasks / Week: 8</li>
                <li>Productivity Score: 82%</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Analytics;
