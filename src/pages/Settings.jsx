import React from 'react';
import { MainLayout } from '../components/layout';
import { Card, Input, Button } from '../components/ui';

const Settings = () => {
  const mockUser = { name: 'Sarah Johnson', email: 'sarah@example.com' };

  return (
    <MainLayout user={mockUser} activeTab="settings">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-1 text-neutral-900 dark:text-neutral-100">Settings</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Manage your account and preferences</p>
        </div>

        <Card>
          <h2 className="font-semibold mb-4 text-neutral-900 dark:text-neutral-100">Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="Full name" defaultValue={mockUser.name} />
            <Input placeholder="Email" defaultValue={mockUser.email} />
          </div>
          <div className="mt-4">
            <Button variant="primary">Save changes</Button>
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold mb-4 text-neutral-900 dark:text-neutral-100">Preferences</h2>
          <p className="text-sm text-neutral-700 dark:text-neutral-400">Manage workspace preferences and notifications</p>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Settings;
