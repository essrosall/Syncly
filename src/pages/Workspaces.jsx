import React from 'react';
import { MainLayout } from '../components/layout';
import { Card, Button } from '../components/ui';

const Workspaces = () => {
  const mockUser = { name: 'Sarah Johnson', email: 'sarah@example.com' };

  const workspaces = [
    { id: 1, name: 'Product Design', members: 5 },
    { id: 2, name: 'Mobile App', members: 3 },
    { id: 3, name: 'Backend Services', members: 4 },
  ];

  return (
    <MainLayout user={mockUser} activeTab="workspaces">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1 text-neutral-900 dark:text-neutral-100">Workspaces</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Manage your teams and projects</p>
          </div>
          <Button variant="primary">Create Workspace</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((ws) => (
            <Card key={ws.id} hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">{ws.name}</p>
                  <p className="text-sm text-neutral-700 dark:text-neutral-400">{ws.members} members</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm">Open</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Workspaces;
