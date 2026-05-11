import React from 'react';
import { MainLayout } from '../components/layout';
import { Card, Button, Badge } from '../components/ui';
import { FolderKanban, Users, ArrowUpRight, MoreHorizontal, Layers3, Sparkles } from 'lucide-react';

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
        <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
          <Card className="rounded-lg bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 text-white shadow-[0_30px_90px_rgba(30,90,166,0.18)]">
            <div className="relative p-6 lg:p-8">
              <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
              <div className="relative space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
                  <Sparkles size={14} /> Workspace hub
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight">Workspaces</h1>
                  <p className="mt-2 max-w-2xl text-sm text-white/80 lg:text-base">Organize teams, projects, and delivery stages without the finance clutter.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="secondary" className="bg-white text-primary-700 hover:bg-neutral-50">
                    <FolderKanban size={18} /> Create Workspace
                  </Button>
                  <Button variant="ghost" className="border border-white/20 text-white hover:bg-white/10">
                    <ArrowUpRight size={18} /> View activity
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-1">
            <Card className="rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Total Workspaces</p>
                  <p className="mt-3 text-3xl font-semibold text-neutral-900 dark:text-neutral-100">3</p>
                  <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">Across design, mobile, backend</p>
                </div>
                <div className="rounded-lg bg-primary-500/10 p-3 text-primary-600 dark:text-primary-400">
                  <Layers3 size={20} />
                </div>
              </div>
            </Card>

            <Card className="rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Active Members</p>
                  <p className="mt-3 text-3xl font-semibold text-neutral-900 dark:text-neutral-100">12</p>
                  <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">+2 this week</p>
                </div>
                <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">
                  <Users size={20} />
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {workspaces.map((ws) => (
            <Card key={ws.id} className="rounded-lg p-6 transition-transform hover:-translate-y-0.5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge variant={ws.color} size="sm">{ws.status}</Badge>
                  <p className="mt-3 text-xl font-semibold text-neutral-900 dark:text-neutral-100">{ws.name}</p>
                  <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">{ws.members} members collaborating in real time</p>
                </div>
                <button className="rounded-lg border border-neutral-200 bg-white p-2 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
                  <MoreHorizontal size={16} />
                </button>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-400">
                  <span>Progress</span>
                  <span>{ws.progress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-emerald-500" style={{ width: `${ws.progress}%` }} />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Open for updates</span>
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
