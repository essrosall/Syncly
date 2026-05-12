import React, { useState } from 'react';
import { Button, Input } from '../ui';
import { useGlobalModal } from '../../contexts/GlobalModalContext';
import { useToast } from '../../contexts/ToastContext';

const STORAGE_KEY = 'syncly:demoSession';

const ProfileEditForm = ({ user }) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const { closeModal } = useGlobalModal();
  const { addToast } = useToast();

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextProfile = {
      name: name.trim(),
      email: email.trim(),
      signedInAt: new Date().toISOString(),
    };

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProfile));
      window.dispatchEvent(new Event('syncly:profile-updated'));
    } catch {
      // Ignore storage failures; the modal still closes cleanly.
    }

    addToast({
      title: 'Profile updated',
      message: 'Your profile changes were saved.',
      variant: 'success',
    });

    closeModal();
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Name</label>
        <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Email</label>
        <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={closeModal}>Cancel</Button>
        <Button variant="primary" type="submit">Save profile</Button>
      </div>
    </form>
  );
};

export default ProfileEditForm;