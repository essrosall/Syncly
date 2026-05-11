import { MainLayout } from '../components/layout';
import { Card, Input, Button, Badge } from '../components/ui';
import { UserRound, BellRing, ShieldCheck } from 'lucide-react';

const Settings = () => {
  const mockUser = { name: 'Sarah Johnson', email: 'sarah@example.com' };

  return (
    <MainLayout user={mockUser} activeTab="settings">
      <div className="space-y-6 animate-fade-in-up">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">Settings</h1>
            <p className="mt-2 text-sm text-neutral-500">Short description</p>
          </div>
          <Badge variant="primary">Active</Badge>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.35fr_0.95fr]">
          <Card className="rounded-md border-neutral-200 bg-white p-6 shadow-[0_12px_30px_rgba(17,25,43,0.04)] space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-neutral-950">Profile</h2>
                <p className="mt-1 text-sm text-neutral-500">Update your identity and contact details</p>
              </div>
              <UserRound size={18} className="text-neutral-400" />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input placeholder="Full name" defaultValue={mockUser.name} />
              <Input placeholder="Email" defaultValue={mockUser.email} />
            </div>
            <div className="flex justify-end">
              <Button variant="primary" className="bg-neutral-900 text-white hover:bg-neutral-800">Save changes</Button>
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="rounded-md border-neutral-200 bg-white p-6 shadow-[0_12px_30px_rgba(17,25,43,0.04)]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-950">Notifications</h2>
                  <p className="mt-1 text-sm text-neutral-500">Stay updated without the noise</p>
                </div>
                <BellRing size={18} className="text-neutral-400" />
              </div>
              <div className="mt-5 space-y-3 text-sm text-neutral-700">
                <div className="rounded-md bg-neutral-100 px-4 py-3">Task reminders enabled</div>
                <div className="rounded-md bg-neutral-100 px-4 py-3">Workspace mentions enabled</div>
              </div>
            </Card>

            <Card className="rounded-md border-neutral-200 bg-white p-6 shadow-[0_12px_30px_rgba(17,25,43,0.04)]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-950">Security</h2>
                  <p className="mt-1 text-sm text-neutral-500">Basic account protection</p>
                </div>
                <ShieldCheck size={18} className="text-neutral-400" />
              </div>
              <p className="mt-5 text-sm text-neutral-600">Your workspace access is protected with standard sign-in controls.</p>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
