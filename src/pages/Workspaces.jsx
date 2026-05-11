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
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">Workspaces</h1>
            <p className="mt-2 text-sm text-neutral-500">Short description</p>
          </div>
          <Button variant="primary" size="sm" className="bg-neutral-900 text-white hover:bg-neutral-800">
            <FolderKanban size={18} /> Create Workspace
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="rounded-md border-neutral-200 bg-white p-6 shadow-[0_12px_30px_rgba(17,25,43,0.04)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-neutral-500">Total Workspaces</p>
                <p className="mt-3 text-3xl font-semibold text-neutral-950">3</p>
                <p className="mt-2 text-xs text-neutral-500">Across design, mobile, backend</p>
              </div>
              <div className="rounded-2xl bg-neutral-100 p-3 text-neutral-900">
                <Layers3 size={20} />
              </div>
            </div>
          </Card>

          <Card className="rounded-md border-neutral-200 bg-white p-6 shadow-[0_12px_30px_rgba(17,25,43,0.04)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-neutral-500">Active Members</p>
                <p className="mt-3 text-3xl font-semibold text-neutral-950">12</p>
                <p className="mt-2 text-xs text-neutral-500">+2 this week</p>
              </div>
              <div className="rounded-2xl bg-neutral-100 p-3 text-neutral-900">
                <Users size={20} />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {workspaces.map((ws) => (
            <Card key={ws.id} className="rounded-md border-neutral-200 bg-white p-6 shadow-[0_12px_30px_rgba(17,25,43,0.04)] transition-transform hover:-translate-y-0.5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge variant={ws.color} size="sm">{ws.status}</Badge>
                  <p className="mt-3 text-xl font-semibold text-neutral-950">{ws.name}</p>
                  <p className="mt-2 text-sm text-neutral-500">{ws.members} members collaborating in real time</p>
                </div>
                <button className="rounded-xl border border-neutral-200 bg-neutral-50 p-2 text-neutral-500">
                  <MoreHorizontal size={16} />
                </button>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between text-sm text-neutral-500">
                  <span>Progress</span>
                  <span>{ws.progress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
                  <div className="h-full rounded-full bg-neutral-900" style={{ width: `${ws.progress}%` }} />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm text-neutral-500">Open for updates</span>
                <Button variant="secondary" size="sm">Open</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Workspaces;
