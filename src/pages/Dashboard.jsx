import React from 'react';
import { MainLayout } from '../components/layout';
import { Card, Badge } from '../components/ui';
import { TrendingUp, Users, CheckCircle, Clock } from 'lucide-react';

const Dashboard = () => {
  const mockUser = {
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
  };

  const stats = [
    {
      label: 'Active Tasks',
      value: '12',
      icon: CheckCircle,
      color: 'primary',
    },
    {
      label: 'Completed This Week',
      value: '8',
      icon: TrendingUp,
      color: 'success',
    },
    {
      label: 'Team Members',
      value: '5',
      icon: Users,
      color: 'info',
    },
    {
      label: 'Hours Focused',
      value: '24.5',
      icon: Clock,
      color: 'warning',
    },
  ];

  const recentTasks = [
    { id: 1, title: 'Design landing page', status: 'in-progress', priority: 'high', desc: 'Finalize hero section and CTA', assignee: 'Alex', time: '2h ago' },
    { id: 2, title: 'Fix login bug', status: 'done', priority: 'high', desc: 'Resolve redirect after OAuth', assignee: 'Maya', time: '1d ago' },
    { id: 3, title: 'Update documentation', status: 'pending', priority: 'medium', desc: 'Add API examples and auth guide', assignee: 'You', time: '3d ago' },
    { id: 4, title: 'Database optimization', status: 'in-progress', priority: 'low', desc: 'Add indexes and analyze queries', assignee: 'Sam', time: '5d ago' },
  ];

  return (
    <MainLayout user={mockUser} activeTab="dashboard">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2 text-neutral-900 dark:text-neutral-100">Welcome back, Sarah!</h1>
          <p className="text-neutral-700 dark:text-neutral-400">Here's what's happening with your tasks today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} hover>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-2">{stat.label}</p>
                    <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-${stat.color}-500/20`}>
                    <Icon size={24} className={`text-${stat.color}-400`} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Recent Tasks</h2>
                <a href="/tasks" className="text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 text-sm font-medium">View all</a>
              </div>
              <div className="space-y-4">
                {recentTasks.map((task) => (
                  <div key={task.id} className="flex items-start justify-between p-4 bg-white dark:bg-neutral-800/50 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700">
                    <div className="flex-1">
                      <p className="font-medium text-neutral-900 dark:text-neutral-100">{task.title}</p>
                      <p className="text-sm text-neutral-700 dark:text-neutral-400 mt-1">{task.desc}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <Badge variant={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'default'} size="sm">
                          {task.priority}
                        </Badge>
                        <span className="text-xs text-neutral-700 dark:text-neutral-400">Assigned to <strong className="text-neutral-900 dark:text-neutral-100">{task.assignee}</strong></span>
                        <span className="text-xs text-neutral-600 dark:text-neutral-400">• {task.time}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <Badge
                        variant={
                          task.status === 'done'
                            ? 'success'
                            : task.status === 'in-progress'
                            ? 'primary'
                            : 'default'
                        }
                        size="sm"
                        className="rounded-md px-2 py-0.5 text-xs"
                      >
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Upcoming */}
          <div>
            <Card>
              <h3 className="text-xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">Upcoming Deadlines</h3>
              <div className="space-y-4">
                <div className="p-3 bg-neutral-100 dark:bg-neutral-800/50 rounded-lg border border-warning-300 dark:border-warning-500/30">
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Landing Page Design</p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">Due in 2 days</p>
                </div>
                <div className="p-3 bg-neutral-100 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">API Integration</p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">Due in 5 days</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
