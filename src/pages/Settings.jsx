import { MainLayout } from '../components/layout';
import { Card, Input, Button, Badge } from '../components/ui';
import { UserRound, BellRing, ShieldCheck } from 'lucide-react';

const Settings = () => {
  const mockUser = { name: 'Sarah Johnson', email: 'sarah@example.com' };

  return (
    <MainLayout user={mockUser} activeTab="settings">
      <div className="space-y-6 animate-fade-in-up">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div id="settings-overview">
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-100">Settings</h1>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Manage your profile, preferences, and workspace security.</p>
          </div>
          <Badge variant="primary">Active</Badge>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.35fr_0.95fr]">
          <Card className="rounded-md border-neutral-200 bg-white p-6 shadow-[0_12px_30px_rgba(17,25,43,0.04)] space-y-5 dark:border-neutral-700 dark:bg-neutral-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-neutral-950 dark:text-neutral-100">Profile</h2>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Manage your name, email, and contact information</p>
              </div>
              <UserRound size={18} className="text-neutral-400 dark:text-neutral-500" />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input placeholder="Full name" defaultValue={mockUser.name} />
              <Input placeholder="Email" defaultValue={mockUser.email} />
            </div>
            <div className="flex justify-end">
              <Button variant="primary" className="bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600">Save changes</Button>
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="rounded-md border-neutral-200 bg-white p-6 shadow-[0_12px_30px_rgba(17,25,43,0.04)] dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-950 dark:text-neutral-100">Notifications</h2>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Control alerts and email preferences</p>
                </div>
                <BellRing size={18} className="text-neutral-400 dark:text-neutral-500" />
              </div>
              <div className="mt-5 space-y-3 text-sm text-neutral-700 dark:text-neutral-200">
                <div className="rounded-md bg-neutral-100 px-4 py-3 dark:bg-neutral-800 dark:border dark:border-neutral-700">Task reminders enabled</div>
                <div className="rounded-md bg-neutral-100 px-4 py-3 dark:bg-neutral-800 dark:border dark:border-neutral-700">Workspace mentions enabled</div>
              </div>
            </Card>

            <Card className="rounded-md border-neutral-200 bg-white p-6 shadow-[0_12px_30px_rgba(17,25,43,0.04)] dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-950 dark:text-neutral-100">Security</h2>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Basic account protection</p>
                </div>
                <ShieldCheck size={18} className="text-neutral-400 dark:text-neutral-500" />
              </div>
              <p className="mt-5 text-sm text-neutral-600 dark:text-neutral-300">Your workspace access is protected with standard sign-in controls.</p>
            </Card>

            <Card id="settings-documentation" className="rounded-md border-neutral-200 bg-white p-6 shadow-[0_12px_30px_rgba(17,25,43,0.04)] dark:border-neutral-700 dark:bg-neutral-800">
              <h2 className="text-xl font-semibold text-neutral-950 dark:text-neutral-100">Documentation</h2>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Product docs, API usage notes, and setup guides.</p>
            </Card>

            <Card id="settings-tutorials" className="rounded-md border-neutral-200 bg-white p-6 shadow-[0_12px_30px_rgba(17,25,43,0.04)] dark:border-neutral-700 dark:bg-neutral-800">
              <h2 className="text-xl font-semibold text-neutral-950 dark:text-neutral-100">Tutorials</h2>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Step-by-step walkthroughs for common workflows.</p>
            </Card>

            <Card id="settings-community" className="rounded-md border-neutral-200 bg-white p-6 shadow-[0_12px_30px_rgba(17,25,43,0.04)] dark:border-neutral-700 dark:bg-neutral-800">
              <h2 className="text-xl font-semibold text-neutral-950 dark:text-neutral-100">Community</h2>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Get help, ask questions, and share feedback.</p>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
