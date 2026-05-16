import { useState, useEffect } from 'react';
// touch: trigger dev server refresh
import { MainLayout } from '../components/layout';
import { Card, Input, Button, Badge, Textarea } from '../components/ui';
import { UserRound, BellRing, ShieldCheck, Upload, ChevronDown, Briefcase } from 'lucide-react';
import SearchableTagField from '../components/profile/SearchableTagField';
import {
  HOBBIES_SUGGESTIONS,
  INTERESTS_SUGGESTIONS,
  SCHOOL_SUGGESTIONS,
  WORK_SUGGESTIONS,
} from '../lib/profileSuggestions';

const Settings = () => {
  const STORAGE_KEY = 'syncly:demoSession';
  
  const mockUser = { name: 'Sarah Johnson', email: 'sarah@example.com' };

  const [profileData, setProfileData] = useState({
    firstName: 'Sarah',
    middleName: '',
    lastName: 'Johnson',
    nickname: '',
    name: mockUser.name,
    email: mockUser.email,
    gender: 'female',
    displayPreference: 'nickname', // nickname | first | last | full
    bio: '',
    work: [],
    hobbies: [],
    interests: [],
    educationStatus: 'studying',
    school: [],
    graduatedFrom: [],
    profileImage: null,
    profileImageUrl: null,
  });

  const [saveStatus, setSaveStatus] = useState('');

  const profileCompletion = Math.round(
    (
      [
        profileData.firstName,
        profileData.lastName,
        profileData.email,
        profileData.bio,
        profileData.work.length,
        profileData.hobbies.length,
        profileData.interests.length,
        profileData.educationStatus === 'studying' ? profileData.school.length : profileData.graduatedFrom.length,
      ].filter(Boolean).length / 8
    ) * 100
  );

  const profileTip = profileData.educationStatus === 'studying'
    ? 'Add your current school to make your profile easier to discover.'
    : 'Add your graduated school to help people recognize your background.';

  // Load profile data from localStorage on mount
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedData = JSON.parse(stored);
        setProfileData(prev => ({
          ...prev,
          firstName: parsedData.firstName || prev.firstName,
          lastName: parsedData.lastName || prev.lastName,
          nickname: parsedData.nickname || prev.nickname,
          gender: parsedData.gender || prev.gender,
          displayPreference: parsedData.displayPreference || prev.displayPreference,
          educationStatus: parsedData.educationStatus || prev.educationStatus,
          work: parsedData.work || [],
          hobbies: parsedData.hobbies || [],
          interests: parsedData.interests || [],
          school: parsedData.school || [],
          graduatedFrom: parsedData.graduatedFrom || [],
          ...parsedData,
        }));
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({
          ...prev,
          profileImage: file.name,
          profileImageUrl: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    try {
      // Save to localStorage
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        firstName: profileData.firstName,
        middleName: profileData.middleName,
        lastName: profileData.lastName,
        nickname: profileData.nickname,
        name: profileData.name,
        email: profileData.email,
        gender: profileData.gender,
        displayPreference: profileData.displayPreference,
        educationStatus: profileData.educationStatus,
        bio: profileData.bio,
        work: profileData.work,
        hobbies: profileData.hobbies,
        interests: profileData.interests,
        school: profileData.school,
        graduatedFrom: profileData.graduatedFrom,
        profileImage: profileData.profileImage,
        profileImageUrl: profileData.profileImageUrl,
      }));

      // Trigger event for sidebar to update
      window.dispatchEvent(new Event('syncly:profile-updated'));

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (error) {
      console.error('Failed to save profile:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 2000);
    }
  };

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
          {/* Left column: categorized settings */}
          <div className="space-y-4">
            <Card id="settings-preferences" className="rounded-md border-neutral-200 bg-white p-6 shadow-[0_12px_30px_rgba(17,25,43,0.04)] dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-950 dark:text-neutral-100">Personal</h2>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Basic identity and contact information.</p>
                </div>
                <UserRound size={18} className="text-neutral-400 dark:text-neutral-500" />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Email</label>
                  <Input
                    placeholder="email@example.com"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div />
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">First name</label>
                  <Input
                    placeholder="First name"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Middle name</label>
                  <Input
                    placeholder="Middle name"
                    name="middleName"
                    value={profileData.middleName || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Last name</label>
                  <Input
                    placeholder="Last name"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Nickname</label>
                  <Input
                    placeholder="Nickname"
                    name="nickname"
                    value={profileData.nickname}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Bio</label>
                <Textarea
                  placeholder="Tell us about yourself..."
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  className="resize-none"
                  rows={4}
                />
              </div>
            </Card>

            <Card className="rounded-md border-neutral-200 bg-white p-6 shadow-[0_12px_30px_rgba(17,25,43,0.04)] dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-950 dark:text-neutral-100">Work & Interests</h2>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Search and select work, hobbies, and interests from a richer suggestion list.</p>
                </div>
                <Briefcase size={18} className="text-neutral-400 dark:text-neutral-500" />
              </div>

              <div className="mt-4 space-y-5">
                <SearchableTagField
                  label="Work / Profession"
                  helperText="Choose one or more roles, or add your own custom title."
                  placeholder="Search or add work..."
                  suggestions={WORK_SUGGESTIONS}
                  values={profileData.work}
                  onChange={(nextValues) => setProfileData((prev) => ({ ...prev, work: nextValues }))}
                />

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <SearchableTagField
                    label="Hobbies"
                    helperText="Suggestions update while you type."
                    placeholder="Search or add hobby..."
                    suggestions={HOBBIES_SUGGESTIONS}
                    values={profileData.hobbies}
                    onChange={(nextValues) => setProfileData((prev) => ({ ...prev, hobbies: nextValues }))}
                  />

                  <SearchableTagField
                    label="Interests"
                    helperText="Search, select, and remove items anytime."
                    placeholder="Search or add interest..."
                    suggestions={INTERESTS_SUGGESTIONS}
                    values={profileData.interests}
                    onChange={(nextValues) => setProfileData((prev) => ({ ...prev, interests: nextValues }))}
                  />
                </div>
              </div>
            </Card>

            <Card className="rounded-md border-neutral-200 bg-white p-6 shadow-[0_12px_30px_rgba(17,25,43,0.04)] dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-950 dark:text-neutral-100">Education</h2>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Add where you study now or where you graduated from.</p>
                </div>
                <ChevronDown size={18} className="text-neutral-400 dark:text-neutral-500" />
              </div>

              <div className="mt-4 space-y-4">
                <div className="inline-flex rounded-full bg-neutral-100 p-1 dark:bg-neutral-700">
                  {[
                    { value: 'studying', label: 'Studying now' },
                    { value: 'graduated', label: 'Graduated' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setProfileData((prev) => ({ ...prev, educationStatus: option.value }))}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        profileData.educationStatus === option.value
                          ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-neutral-100'
                          : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                {profileData.educationStatus === 'studying' ? (
                  <SearchableTagField
                    label="Current school / university"
                    helperText="Use this if you're studying right now."
                    placeholder="Search school..."
                    suggestions={SCHOOL_SUGGESTIONS}
                    values={profileData.school}
                    onChange={(nextValues) => setProfileData((prev) => ({ ...prev, school: nextValues }))}
                  />
                ) : (
                  <SearchableTagField
                    label="Graduated from"
                    helperText="Use this if you already graduated."
                    placeholder="Search graduated school..."
                    suggestions={SCHOOL_SUGGESTIONS}
                    values={profileData.graduatedFrom}
                    onChange={(nextValues) => setProfileData((prev) => ({ ...prev, graduatedFrom: nextValues }))}
                  />
                )}
              </div>
            </Card>

            <Card className="rounded-md border-neutral-200 bg-white p-6 shadow-[0_12px_30px_rgba(17,25,43,0.04)] dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-950 dark:text-neutral-100">Preferences</h2>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">How your name appears across the app.</p>
                </div>
                <ChevronDown size={18} className="text-neutral-400 dark:text-neutral-500" />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Gender</label>
                  <div className="relative">
                    <select name="gender" value={profileData.gender} onChange={handleInputChange} className="w-full rounded-md border px-3 py-2 pr-10 text-sm">
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="other">Other</option>
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Display name</label>
                  <div className="relative">
                    <select name="displayPreference" value={profileData.displayPreference} onChange={handleInputChange} className="w-full rounded-md border px-3 py-2 pr-10 text-sm">
                      <option value="nickname">Nickname</option>
                      <option value="first">First name</option>
                      <option value="last">Last name</option>
                      <option value="full">First M. Last (with prefix)</option>
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex justify-end">
              {saveStatus === 'saved' && (
                <span className="flex items-center text-sm text-green-600 dark:text-green-400 mr-4">✓ Changes saved</span>
              )}
              {saveStatus === 'error' && (
                <span className="flex items-center text-sm text-red-600 dark:text-red-400 mr-4">✗ Save failed</span>
              )}
              <Button
                variant="primary"
                className="bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600"
                onClick={handleSaveProfile}
              >
                Save changes
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <Card className="rounded-md border-neutral-200 bg-white p-6 shadow-[0_12px_30px_rgba(17,25,43,0.04)] dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-950 dark:text-neutral-100">Profile at a glance</h2>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">A quick snapshot of what you’ve added.</p>
                </div>
                <Badge variant="primary">{profileCompletion}%</Badge>
              </div>

              <div className="mt-4 space-y-3">
                <div className="h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-700">
                  <div
                    className="h-full rounded-full bg-primary-600 transition-all"
                    style={{ width: `${profileCompletion}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-md bg-neutral-50 px-3 py-2 text-neutral-700 dark:bg-neutral-700/50 dark:text-neutral-200">
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">Work</div>
                    <div className="font-medium">{profileData.work.length} selected</div>
                  </div>
                  <div className="rounded-md bg-neutral-50 px-3 py-2 text-neutral-700 dark:bg-neutral-700/50 dark:text-neutral-200">
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">Hobbies</div>
                    <div className="font-medium">{profileData.hobbies.length} selected</div>
                  </div>
                  <div className="rounded-md bg-neutral-50 px-3 py-2 text-neutral-700 dark:bg-neutral-700/50 dark:text-neutral-200">
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">Interests</div>
                    <div className="font-medium">{profileData.interests.length} selected</div>
                  </div>
                  <div className="rounded-md bg-neutral-50 px-3 py-2 text-neutral-700 dark:bg-neutral-700/50 dark:text-neutral-200">
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">Education</div>
                    <div className="font-medium">{profileData.educationStatus === 'studying' ? 'Studying now' : 'Graduated'}</div>
                  </div>
                </div>

                <div className="rounded-md border border-dashed border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                  {profileTip}
                </div>
              </div>
            </Card>

            {/* Profile summary card on the right with avatar + upload */}
            <Card className="rounded-md border-neutral-200 bg-white p-6 shadow-[0_12px_30px_rgba(17,25,43,0.04)] dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-950 dark:text-neutral-100">Your Profile</h2>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Quick preview and avatar upload</p>
                </div>
                <UserRound size={18} className="text-neutral-400 dark:text-neutral-500" />
              </div>

              <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="order-2 flex-1 lg:order-1">
                  <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{profileData.nickname || profileData.firstName}</div>
                  <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{profileData.email}</div>
                  <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
                    Upload a photo to personalize your workspace and make your profile easier to recognize.
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <label className="relative flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-neutral-300 bg-neutral-50 px-3 py-2 transition-colors hover:border-neutral-400 hover:bg-neutral-100 dark:border-neutral-600 dark:bg-neutral-700/50 dark:hover:bg-neutral-700">
                      <Upload size={14} className="text-neutral-600 dark:text-neutral-400" />
                      <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Change photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    <Button variant="ghost" onClick={() => window.dispatchEvent(new Event('syncly:profile-updated'))}>Preview</Button>
                  </div>
                </div>

                <div className="order-1 flex w-full justify-center lg:order-2 lg:w-auto lg:justify-end">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-700">
                    {profileData.profileImageUrl ? (
                      <img src={profileData.profileImageUrl} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-2xl font-semibold text-neutral-600 dark:text-neutral-300">
                        {(profileData.firstName || 'S')
                          .split(' ')
                          .slice(0, 2)
                          .map(part => part[0]?.toUpperCase() || '')
                          .join('') || 'S'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>

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
