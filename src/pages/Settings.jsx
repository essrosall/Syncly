import React from 'react';
import { MainLayout } from '../components/layout';
import { Card, Input, Button, Badge } from '../components/ui';
import { UserRound, BellRing, ShieldCheck, Palette } from 'lucide-react';

const Settings = () => {
  const mockUser = { name: 'Sarah Johnson', email: 'sarah@example.com' };

  return (
    <MainLayout user={mockUser} activeTab="settings">
      <div className="space-y-6 animate-fade-in-up">
        <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
          <Card className="rounded-lg bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 text-white shadow-[0_30px_90px_rgba(30,90,166,0.18)]">
            <div className="p-6 lg:p-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
                <Palette size={14} /> Preferences
              </div>
              <h1 className="mt-4 text-3xl lg:text-4xl font-semibold tracking-tight">Settings</h1>
              <p className="mt-2 max-w-2xl text-sm text-white/80 lg:text-base">Adjust account details, workspace behavior, and notification preferences.</p>
            </div>
          </Card>

          <Card className="rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Account</p>
                <p className="mt-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100">{mockUser.name}</p>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{mockUser.email}</p>
              </div>
              <div className="rounded-lg bg-primary-500/10 p-3 text-primary-600 dark:text-primary-400">
                <UserRound size={20} />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.95fr]">
          <Card className="rounded-lg p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Profile</h2>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Update your identity and contact details</p>
              </div>
              <Badge variant="primary">Active</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Full name" defaultValue={mockUser.name} />
              <Input placeholder="Email" defaultValue={mockUser.email} />
            </div>
            <div className="flex justify-end">
              <Button variant="primary">Save changes</Button>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Notifications</h2>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Stay updated without the noise</p>
                </div>
                <BellRing size={18} className="text-neutral-400" />
              </div>
              <div className="mt-5 space-y-3 text-sm text-neutral-700 dark:text-neutral-300">
                <div className="rounded-lg bg-neutral-100 px-4 py-3 dark:bg-neutral-900">Task reminders enabled</div>
                <div className="rounded-lg bg-neutral-100 px-4 py-3 dark:bg-neutral-900">Workspace mentions enabled</div>
              </div>
            </Card>

            <Card className="rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Security</h2>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Basic account protection</p>
                </div>
                <ShieldCheck size={18} className="text-neutral-400" />
              </div>
              <p className="mt-5 text-sm text-neutral-600 dark:text-neutral-400">Your workspace access is protected with standard sign-in controls.</p>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
