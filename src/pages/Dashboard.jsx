import { MainLayout } from '../components/layout';
import { Card, Badge, Button } from '../components/ui';
import { TrendingUp, Users, CheckCircle, Clock, CalendarDays, MoreHorizontal, ClipboardList, CheckCircle2, Layers3 } from 'lucide-react';

const Dashboard = () => {
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
    { label: 'Active Tasks', value: '12', tone: 'bg-neutral-900 text-white', icon: CheckCircle },
    { label: 'Completed This Week', value: '8', tone: 'bg-neutral-100 text-neutral-950 border border-neutral-200', icon: TrendingUp },
    { label: 'Team Members', value: '5', tone: 'bg-neutral-100 text-neutral-950 border border-neutral-200', icon: Users },
    { label: 'Hours Focused', value: '24.5', tone: 'bg-neutral-100 text-neutral-950 border border-neutral-200', icon: Clock },
  ];

  const quickStats = [
    { label: 'Open Workspaces', value: '6', icon: Layers3 },
    { label: 'Tasks in Progress', value: '2', icon: ClipboardList },
    { label: 'Completed Tasks', value: '18', icon: CheckCircle2 },
    { label: 'Team Members', value: '5', icon: Users },
  ];

  const today = new Date().toLocaleDateString();

  return (
    <MainLayout user={mockUser} activeTab="dashboard">
      <div className="space-y-6 animate-fade-in-up">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">Workspace Overview</h1>
            <p className="mt-2 text-sm text-neutral-500">Overview of your active workspaces, recent tasks, and team productivity.</p>
          </div>
          <Button variant="primary" size="sm" className="bg-neutral-900 text-white hover:bg-neutral-800">
            Import Tasks
          </Button>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.7fr_0.95fr]">
          <div className="space-y-4">
            <Card className="rounded-md border-neutral-200 bg-neutral-100 p-6 shadow-[0_12px_30px_rgba(17,25,43,0.04)]">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-4">
                  <div className="h-3 w-24 rounded-full bg-white shadow-sm" />
                  <div>
                    <p className="text-3xl font-semibold tracking-tight text-neutral-950">Welcome back, Sarah Johnson!</p>
                    <p className="mt-1 text-sm text-neutral-500">Description here</p>
                  </div>
                </div>
                <div className="rounded-2xl bg-white px-4 py-3 text-sm text-neutral-600 shadow-sm">{today}</div>
              </div>

              <div className="mt-10 grid gap-3 md:grid-cols-3">
                {topMetrics.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <div key={metric.label} className="rounded-md bg-white p-4 shadow-sm">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${metric.tone}`.trim()}>
                        <Icon size={15} />
                      </div>
                      <p className="mt-6 text-sm text-neutral-500">{metric.label}</p>
                      <p className="mt-1 text-2xl font-semibold text-neutral-950">{metric.value}</p>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="rounded-md border-neutral-200 bg-neutral-100 p-5 shadow-[0_12px_30px_rgba(17,25,43,0.04)]">
                <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-950">Recent Tasks</h2>
                  <p className="text-sm text-neutral-500">Latest updates across your team to help you prioritize what matters most.</p>
                </div>
                <a href="/tasks" className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm">View All Tasks</a>
              </div>

              <div className="mt-5 space-y-3">
                {recentTasks.map((task) => (
                  <div key={task.id} className="rounded-md bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-neutral-950">{task.title}</p>
                          <Badge variant={task.priority === 'High' ? 'error' : task.priority === 'Medium' ? 'warning' : 'default'} size="sm">
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="mt-2 text-sm text-neutral-500">{task.desc}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                          <span className="rounded-full bg-neutral-100 px-3 py-1">Assigned to <strong className="text-neutral-800">{task.assignee}</strong></span>
                          <span>{task.time}</span>
                        </div>
                      </div>
                      <Badge variant={task.status === 'Done' ? 'success' : task.status === 'In progress' ? 'primary' : 'default'} size="sm">
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
            {quickStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="rounded-md border-neutral-200 bg-white p-5 shadow-[0_12px_30px_rgba(17,25,43,0.04)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-neutral-500">{stat.label}</p>
                      <p className="mt-3 text-3xl font-semibold text-neutral-950">{stat.value}</p>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-900">
                      <Icon size={18} />
                    </div>
                  </div>
                </Card>
              );
            })}

            <Card className="rounded-md border-neutral-200 bg-white p-5 shadow-[0_12px_30px_rgba(17,25,43,0.04)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold text-neutral-950">Upcoming Deadlines</h3>
                  <p className="text-sm text-neutral-500">Description here</p>
                </div>
                <CalendarDays size={18} className="text-neutral-400" />
              </div>
              <div className="mt-5 space-y-3">
                <div className="rounded-md bg-neutral-100 p-4">
                  <p className="font-medium text-neutral-950">Landing Page Design</p>
                  <p className="mt-1 text-sm text-neutral-500">Due in 2 days</p>
                </div>
                <div className="rounded-md bg-neutral-100 p-4">
                  <p className="font-medium text-neutral-950">API Integration</p>
                  <p className="mt-1 text-sm text-neutral-500">Due in 5 days</p>
                </div>
              </div>
            </Card>

            <Card className="rounded-md border-neutral-200 bg-white p-5 shadow-[0_12px_30px_rgba(17,25,43,0.04)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold text-neutral-950">Quick Actions</h3>
                  <p className="text-sm text-neutral-500">Description here</p>
                </div>
                <MoreHorizontal size={18} className="text-neutral-400" />
              </div>
              <div className="mt-5 space-y-3">
                <button className="w-full rounded-md border border-neutral-200 bg-neutral-50 px-4 py-4 text-left text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-100">
                  Create a new task
                </button>
                <button className="w-full rounded-md border border-neutral-200 bg-neutral-50 px-4 py-4 text-left text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-100">
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
