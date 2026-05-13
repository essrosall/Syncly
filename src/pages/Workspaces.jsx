import { MainLayout } from '../components/layout';
import { Card, Button, Badge } from '../components/ui';
import { FolderKanban, Users, MoreHorizontal, Layers3 } from 'lucide-react';

const Workspaces = () => {
  const mockUser = { name: 'Sarah Johnson', email: 'sarah@example.com' };

  const workspaces = [
    { id: 1, name: 'Product Design', members: 5, progress: 78, status: 'Active', color: 'primary' },
    { id: 2, name: 'Mobile App', members: 3, progress: 52, status: 'Review', color: 'warning' },
    { id: 3, name: 'Backend Services', members: 4, progress: 64, status: 'Active', color: 'success' },
  ];

  return (
    <MainLayout user={mockUser} activeTab="workspaces">
      <div className="space-y-6 animate-fade-in-up">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div id="workspaces-overview">
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-100">Workspaces</h1>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Organize teams and manage projects across dedicated workspaces.</p>
          </div>
          <Button variant="primary" size="sm" className="bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600">
            <FolderKanban size={18} /> Create Workspace
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="rounded-md border-neutral-200 bg-white p-6 shadow-[0_12px_30px_rgba(17,25,43,0.04)] dark:border-neutral-700 dark:bg-neutral-800">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Total Workspaces</p>
                <p className="mt-3 text-3xl font-semibold text-neutral-950 dark:text-neutral-100">3</p>
                <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">Across design, mobile, backend</p>
              </div>
              <div className="rounded-md bg-neutral-100 p-3 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-200">
                <Layers3 size={20} />
              </div>
            </div>
          </Card>

          <Card className="rounded-md border-neutral-200 bg-white p-6 shadow-[0_12px_30px_rgba(17,25,43,0.04)] dark:border-neutral-700 dark:bg-neutral-800">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Active Members</p>
                <p className="mt-3 text-3xl font-semibold text-neutral-950 dark:text-neutral-100">12</p>
                <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">+2 this week</p>
              </div>
              <div className="rounded-md bg-neutral-100 p-3 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-200">
                <Users size={20} />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {workspaces.map((ws) => (
            <Card
              key={ws.id}
              id={`workspace-${ws.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="rounded-md border-neutral-200 bg-white p-6 shadow-[0_12px_30px_rgba(17,25,43,0.04)] transition-transform hover:-translate-y-0.5 dark:border-neutral-700 dark:bg-neutral-800"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge variant={ws.color} size="sm">{ws.status}</Badge>
                  <p className="mt-3 text-xl font-semibold text-neutral-950 dark:text-neutral-100">{ws.name}</p>
                  <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">{ws.members} team members, actively collaborating</p>
                </div>
                <button className="rounded-md border border-neutral-200 bg-neutral-50 p-2 text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                  <MoreHorizontal size={16} />
                </button>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-400">
                  <span>Progress</span>
                  <span>{ws.progress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-700">
                  <div className="h-full rounded-full bg-neutral-900" style={{ width: `${ws.progress}%` }} />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">View workspace details</span>
                <Button variant="secondary" size="sm">Manage</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Workspaces;
