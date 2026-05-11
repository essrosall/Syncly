import React from 'react';
import { MainLayout } from '../components/layout';
import { Card, Badge } from '../components/ui';
import { TrendingUp, Users, CheckCircle, Clock, CalendarDays, ArrowUpRight, MoreHorizontal, Sparkles, ClipboardList, KanbanSquare, CheckCircle2 } from 'lucide-react';

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
    { id: 1, title: 'Design landing page', status: 'In-progress', priority: 'High', desc: 'Finalize hero section and CTA', assignee: 'Alex', time: '2h ago' },
    { id: 2, title: 'Fix login bug', status: 'Done', priority: 'High', desc: 'Resolve redirect after OAuth', assignee: 'Maya', time: '1d ago' },
    { id: 3, title: 'Update documentation', status: 'Pending', priority: 'Medium', desc: 'Add API examples and auth guide', assignee: 'You', time: '3d ago' },
    { id: 4, title: 'Database optimization', status: 'In-progress', priority: 'Low', desc: 'Add indexes and analyze queries', assignee: 'Sam', time: '5d ago' },
  ];

  return (
    <MainLayout user={mockUser} activeTab="dashboard">
      <div className="space-y-6 animate-fade-in-up">
        {/* Hero */}
        <div className="grid gap-6 xl:grid-cols-[1.7fr_0.9fr]">
          <Card className="overflow-hidden rounded-lg border-white/60 bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 text-white shadow-[0_30px_90px_rgba(30,90,166,0.25)]">
            <div className="relative p-6 lg:p-8">
              <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-emerald-300/15 blur-3xl" />
              <div className="relative space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
                      <Sparkles size={14} /> Daily overview
                    </div>
                    <h1 className="mt-4 text-3xl lg:text-4xl font-semibold tracking-tight">Welcome back, Sarah!</h1>
                    <p className="mt-2 max-w-2xl text-sm text-white/80 lg:text-base">A clean snapshot of your tasks, deadlines, and team progress in one calm workspace.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-white/15 px-4 py-3 backdrop-blur">
                      <p className="text-xs uppercase tracking-[0.24em] text-white/70">Today</p>
                      <p className="mt-1 text-sm font-medium">Sun, 12 June 2026</p>
                    </div>
                    <button className="inline-flex items-center gap-2 rounded-2xl bg-neutral-950 px-4 py-3 text-sm font-medium text-white shadow-lg transition-transform hover:-translate-y-0.5">
                      <ArrowUpRight size={16} /> Export
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-3xl bg-white/15 p-5 backdrop-blur">
                    <p className="text-sm text-white/80">Active Tasks</p>
                    <p className="mt-3 text-3xl font-semibold">12</p>
                    <p className="mt-2 text-xs text-emerald-200">+3.2% from last month</p>
                  </div>
                  <div className="rounded-3xl bg-white/15 p-5 backdrop-blur">
                    <p className="text-sm text-white/80">Completed This Week</p>
                    <p className="mt-3 text-3xl font-semibold">8</p>
                    <p className="mt-2 text-xs text-emerald-200">+12% from last week</p>
                  </div>
                  <div className="rounded-3xl bg-white/15 p-5 backdrop-blur">
                    <p className="text-sm text-white/80">Hours Focused</p>
                    <p className="mt-3 text-3xl font-semibold">24.5</p>
                    <p className="mt-2 text-xs text-emerald-200">+4.8% productivity lift</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-1">
            <Card className="rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Upcoming deadline</p>
                  <h3 className="mt-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">Landing Page Design</h3>
                </div>
                <CalendarDays size={20} className="text-primary-500" />
              </div>
              <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">Due in 2 days</p>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-primary-500 to-emerald-500" />
              </div>
            </Card>

            <Card className="rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Focus balance</p>
                  <h3 className="mt-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">24.5 hrs</h3>
                </div>
                <Clock size={20} className="text-emerald-500" />
              </div>
              <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">A steady week with fewer distractions and faster completion.</p>
            </Card>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card className="rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Open Workspaces</p>
                <p className="mt-3 text-3xl font-semibold text-neutral-900 dark:text-neutral-100">6</p>
                <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">+1 this week</p>
              </div>
              <div className="rounded-lg bg-primary-500/10 p-3 text-primary-600 dark:text-primary-400">
                <KanbanSquare size={20} />
              </div>
            </div>
          </Card>

          <Card className="rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Tasks in Progress</p>
                <p className="mt-3 text-3xl font-semibold text-neutral-900 dark:text-neutral-100">2</p>
                <p className="mt-2 text-xs text-red-500">1 due soon</p>
              </div>
              <div className="rounded-lg bg-amber-500/10 p-3 text-amber-600">
                <ClipboardList size={20} />
              </div>
            </div>
          </Card>

          <Card className="rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Completed Tasks</p>
                <p className="mt-3 text-3xl font-semibold text-neutral-900 dark:text-neutral-100">18</p>
                <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">+4 this week</p>
              </div>
              <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={20} />
              </div>
            </div>
          </Card>

          <Card className="rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Team Members</p>
                <p className="mt-3 text-3xl font-semibold text-neutral-900 dark:text-neutral-100">5</p>
                <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">Active across 3 workspaces</p>
              </div>
              <div className="rounded-lg bg-primary-500/10 p-3 text-primary-600 dark:text-primary-400">
                <Users size={20} />
              </div>
            </div>
          </Card>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.45fr_0.95fr]">
          <Card className="rounded-xl p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Recent Tasks</h2>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Your latest work across the board</p>
              </div>
              <a href="/tasks" className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700">
                View all <ArrowUpRight size={14} />
              </a>
            </div>

            <div className="mt-6 space-y-4">
              {recentTasks.map((task) => (
                <div key={task.id} className="rounded-lg border border-neutral-200/80 bg-white p-5 shadow-sm transition-transform hover:-translate-y-0.5 dark:border-neutral-800 dark:bg-neutral-900/80">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-neutral-900 dark:text-neutral-100">{task.title}</p>
                        <Badge variant={task.priority === 'High' ? 'error' : task.priority === 'Medium' ? 'warning' : 'default'} size="sm">
                          {task.priority}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{task.desc}</p>
                      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                        <span className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 dark:bg-neutral-800">Assigned to <strong className="text-neutral-800 dark:text-neutral-100">{task.assignee}</strong></span>
                        <span>{task.time}</span>
                      </div>
                    </div>
                    <Badge
                      variant={
                        task.status === 'Done'
                          ? 'success'
                          : task.status === 'In-progress'
                          ? 'primary'
                          : 'default'
                      }
                      size="sm"
                      className="rounded-full px-3 py-1"
                    >
                      {task.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Upcoming Deadlines</h3>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">What needs attention next</p>
                </div>
                <MoreHorizontal size={18} className="text-neutral-400" />
              </div>
              <div className="mt-5 space-y-4">
                <div className="rounded-lg border border-warning-200 bg-warning-500/10 p-4 dark:border-warning-500/30">
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Landing Page Design</p>
                  <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">Due in 2 days</p>
                </div>
                <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900/80">
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">API Integration</p>
                  <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">Due in 5 days</p>
                </div>
              </div>
            </Card>

            <Card className="rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Quick Actions</h3>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Fast access to frequent tasks</p>
                </div>
                <MoreHorizontal size={18} className="text-neutral-400" />
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <button className="rounded-lg border border-neutral-200 bg-white px-4 py-4 text-left text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-100 dark:hover:bg-neutral-800">
                  Create a new task
                </button>
                <button className="rounded-lg border border-neutral-200 bg-white px-4 py-4 text-left text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-100 dark:hover:bg-neutral-800">
                  Review blocked items
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
