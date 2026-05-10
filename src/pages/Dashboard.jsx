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
    { id: 1, title: 'Design landing page', status: 'in-progress', priority: 'high' },
    { id: 2, title: 'Fix login bug', status: 'done', priority: 'high' },
    { id: 3, title: 'Update documentation', status: 'pending', priority: 'medium' },
    { id: 4, title: 'Database optimization', status: 'in-progress', priority: 'low' },
  ];

  return (
    <MainLayout user={mockUser} activeTab="dashboard">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Welcome back, Sarah!</h1>
          <p className="text-neutral-400">Here's what's happening with your tasks today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} hover>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-neutral-400 text-sm mb-2">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
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
                <h2 className="text-2xl font-bold">Recent Tasks</h2>
                <a href="/tasks" className="text-primary-400 hover:text-primary-300 text-sm font-medium">View all</a>
              </div>
              <div className="space-y-4">
                {recentTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-lg hover:bg-neutral-800 transition-colors">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <Badge variant={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'default'} size="sm" className="mt-2">
                        {task.priority}
                      </Badge>
                    </div>
                    <Badge
                      variant={
                        task.status === 'done'
                          ? 'success'
                          : task.status === 'in-progress'
                          ? 'primary'
                          : 'default'
                      }
                    >
                      {task.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Upcoming */}
          <div>
            <Card>
              <h3 className="text-xl font-bold mb-4">Upcoming Deadlines</h3>
              <div className="space-y-4">
                <div className="p-3 bg-neutral-800/50 rounded-lg border border-warning-500/30">
                  <p className="text-sm font-medium">Landing Page Design</p>
                  <p className="text-xs text-neutral-400 mt-1">Due in 2 days</p>
                </div>
                <div className="p-3 bg-neutral-800/50 rounded-lg">
                  <p className="text-sm font-medium">API Integration</p>
                  <p className="text-xs text-neutral-400 mt-1">Due in 5 days</p>
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
