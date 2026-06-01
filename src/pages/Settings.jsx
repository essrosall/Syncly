import { useState, useEffect, useMemo } from 'react';
import usePersistentState from '../hooks/usePersistentState';
// touch: trigger dev server refresh
import { MainLayout } from '../components/layout';
import { Card, Input, Button, Badge, Textarea, TutorialModal } from '../components/ui';
import { UserRound, Upload, ChevronDown, Briefcase } from 'lucide-react';
import SearchableTagField from '../components/profile/SearchableTagField';
import { useGlobalModal } from '../contexts/GlobalModalContext';
import { useAuth } from '../contexts/AuthContext';
import { usePreferences } from '../contexts/PreferencesContext';
import { availableLanguages, textScaleOptions } from '../lib/translations';
import {
  HOBBIES_SUGGESTIONS,
  INTERESTS_SUGGESTIONS,
  SCHOOL_SUGGESTIONS,
  WORK_SUGGESTIONS,
} from '../lib/profileSuggestions';

const Settings = () => {
  const { openModal } = useGlobalModal();
  const { user } = useAuth();
  const { language, setLanguage, textScale, setTextScale, t } = usePreferences();

  const accountKey = useMemo(() => user?.id || user?.email || 'guest', [user]);
  const mockUser = useMemo(() => ({
    name: user?.user_metadata?.full_name || user?.name || 'Sarah Johnson',
    email: user?.email || 'sarah@example.com',
  }), [user]);

  const initialProfile = useMemo(() => ({
    firstName: user ? '' : 'Sarah',
    middleName: '',
    lastName: user ? '' : 'Johnson',
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
    coverImage: null,
    coverImageUrl: null,
  }), [mockUser.email, mockUser.name, user]);

  const [profileDataRaw, setProfileData, resetProfileData] = usePersistentState(`syncly:${accountKey}:profileData`, initialProfile);
  const profileData = useMemo(() => ({
    ...initialProfile,
    ...(profileDataRaw || {}),
    work: Array.isArray(profileDataRaw?.work) ? profileDataRaw.work : [],
    hobbies: Array.isArray(profileDataRaw?.hobbies) ? profileDataRaw.hobbies : [],
    interests: Array.isArray(profileDataRaw?.interests) ? profileDataRaw.interests : [],
    school: Array.isArray(profileDataRaw?.school) ? profileDataRaw.school : [],
    graduatedFrom: Array.isArray(profileDataRaw?.graduatedFrom) ? profileDataRaw.graduatedFrom : [],
  }), [initialProfile, profileDataRaw]);

  // Normalize stored profile data if it becomes malformed (prevents runtime crashes)
  useEffect(() => {
    try {
      if (!profileDataRaw || typeof profileDataRaw !== 'object' || Array.isArray(profileDataRaw)) {
        // reset to initial profile when stored value is invalid
        resetProfileData();
      }
    } catch (err) {
      // best-effort: reset on any unexpected error
      try { resetProfileData(); } catch {}
    }
  }, [profileDataRaw, resetProfileData, initialProfile]);

  const [saveStatus, setSaveStatus] = useState('');

  let profileCompletion = 0;
  try {
    profileCompletion = Math.round(
      (
        [
          profileData.firstName,
          profileData.lastName,
          profileData.email,
          profileData.bio,
          Array.isArray(profileData.work) ? profileData.work.length : 0,
          Array.isArray(profileData.hobbies) ? profileData.hobbies.length : 0,
          Array.isArray(profileData.interests) ? profileData.interests.length : 0,
          profileData.educationStatus === 'studying' ? (Array.isArray(profileData.school) ? profileData.school.length : 0) : (Array.isArray(profileData.graduatedFrom) ? profileData.graduatedFrom.length : 0),
        ].filter(Boolean).length / 8
      ) * 100
    );
  } catch (err) {
    console.error('Failed to compute profileCompletion:', err);
    profileCompletion = 0;
  }

  const profileTip = profileData.educationStatus === 'studying'
    ? t('settings.defaultProfileTipStudying')
    : t('settings.defaultProfileTipGraduated');

  // keep sidebar in sync when profileData changes
  useEffect(() => {
    try {
      window.dispatchEvent(new Event('syncly:profile-updated'));
    } catch {}
  }, [profileData]);

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

  const handleCoverImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({
          ...prev,
          coverImage: file.name,
          coverImageUrl: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveCoverImage = () => {
    setProfileData(prev => ({
      ...prev,
      coverImage: null,
      coverImageUrl: null,
    }));
  };

  const handleSaveProfile = () => {
    try {
      // persisted automatically via usePersistentState; trigger UI sync
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
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-100">{t('settings.title')}</h1>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">{t('settings.subtitle')}</p>
          </div>
          <Badge variant="primary">Active</Badge>
        </div>

        <Card className="rounded-base border-neutral-200 bg-white p-6 shadow-[0_12px_30px_rgba(17,25,43,0.04)] dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-neutral-950 dark:text-neutral-100">{t('settings.yourProfile')}</h2>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{t('settings.yourProfileDesc')}</p>
            </div>
            <UserRound size={18} className="text-neutral-400 dark:text-neutral-500" />
          </div>

          <div className="mt-4 space-y-5">
            <div className="relative overflow-hidden rounded-[20px] border border-neutral-200 bg-neutral-100 shadow-sm dark:border-neutral-700 dark:bg-neutral-700/40">
              <div className="relative h-40 sm:h-48">
                {profileData.coverImageUrl ? (
                  <img src={profileData.coverImageUrl} alt="Cover preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-600 via-violet-600 to-cyan-500 text-center">
                    <div className="rounded-full border border-white/20 bg-white/15 px-5 py-2 text-sm font-semibold tracking-[0.22em] text-white shadow-sm backdrop-blur">
                      SYNCLY
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                <div className="absolute inset-x-4 top-4 flex flex-wrap items-center justify-end gap-2">
                  <label className="relative flex cursor-pointer items-center gap-2 rounded-full border border-white/20 bg-white/90 px-3 py-2 text-xs font-medium text-neutral-800 shadow-sm backdrop-blur transition-colors hover:bg-white dark:bg-neutral-900/80 dark:text-neutral-100 dark:hover:bg-neutral-900">
                    <Upload size={14} />
                    <span>{t('settings.uploadCoverPhoto')}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageUpload}
                      className="hidden"
                    />
                  </label>
                  {profileData.coverImageUrl && (
                    <Button variant="secondary" className="rounded-full px-3 py-2 text-xs" onClick={handleRemoveCoverImage}>
                      {t('settings.removeCoverPhoto')}
                    </Button>
                  )}
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 text-white">
                  <div>
                    <div className="text-sm font-semibold">
                      {profileData.nickname || profileData.firstName || profileData.name}
                    </div>
                    <div className="text-xs text-white/80">{profileData.email}</div>
                  </div>
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-white/90 text-neutral-800 shadow-md dark:bg-neutral-900/90 dark:text-neutral-100">
                    {profileData.profileImageUrl ? (
                      <img src={profileData.profileImageUrl} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-2xl font-semibold">
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

              <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                  <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{profileData.nickname || profileData.firstName}</div>
                  <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{profileData.email}</div>
                  <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
                    Upload a cover photo to make your profile feel more personal.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <label className="relative flex cursor-pointer items-center gap-2 rounded-base border border-dashed border-neutral-300 bg-neutral-50 px-3 py-2 transition-colors hover:border-neutral-400 hover:bg-neutral-100 dark:border-neutral-600 dark:bg-neutral-700/50 dark:hover:bg-neutral-700">
                    <Upload size={14} className="text-neutral-600 dark:text-neutral-400" />
                    <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">{t('settings.changePhoto')}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <Button variant="ghost" onClick={() => window.dispatchEvent(new Event('syncly:profile-updated'))}>{t('settings.preview')}</Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-[1.25fr_0.85fr] lg:items-start">
            <Card id="settings-preferences" className="rounded-base border-neutral-200 bg-white p-6 shadow-[0_12px_30px_rgba(17,25,43,0.04)] dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-950 dark:text-neutral-100">{t('settings.personal')}</h2>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{t('settings.personalDesc')}</p>
                </div>
                <UserRound size={18} className="text-neutral-400 dark:text-neutral-500" />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">{t('settings.email')}</label>
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

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">{t('settings.firstName')}</label>
                  <Input
                    placeholder="First name"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">{t('settings.middleName')}</label>
                  <Input
                    placeholder="Middle name"
                    name="middleName"
                    value={profileData.middleName || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">{t('settings.lastName')}</label>
                  <Input
                    placeholder="Last name"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">{t('settings.nickname')}</label>
                  <Input
                    placeholder="Nickname"
                    name="nickname"
                    value={profileData.nickname}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">{t('settings.bio')}</label>
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

            <Card className="rounded-base border-neutral-200 bg-white p-6 shadow-[0_12px_30px_rgba(17,25,43,0.04)] dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-950 dark:text-neutral-100">{t('settings.workInterests')}</h2>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{t('settings.workInterestsDesc')}</p>
                </div>
                <Briefcase size={18} className="text-neutral-400 dark:text-neutral-500" />
              </div>

              <div className="mt-4 space-y-5">
                <SearchableTagField
                  label={t('settings.workTitle')}
                  helperText="Choose one or more roles, or add your own custom title."
                  placeholder="Search or add work..."
                  storageKey="syncly:profile-work-input"
                  suggestions={WORK_SUGGESTIONS}
                  values={profileData.work}
                  onChange={(nextValues) => setProfileData((prev) => ({ ...prev, work: nextValues }))}
                />

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <SearchableTagField
                    label={t('settings.hobbies')}
                    helperText="Suggestions update while you type."
                    placeholder="Search or add hobby..."
                    storageKey="syncly:profile-hobbies-input"
                    suggestions={HOBBIES_SUGGESTIONS}
                    values={profileData.hobbies}
                    onChange={(nextValues) => setProfileData((prev) => ({ ...prev, hobbies: nextValues }))}
                  />

                  <SearchableTagField
                    label={t('settings.interests')}
                    helperText="Search, select, and remove items anytime."
                    placeholder="Search or add interest..."
                    storageKey="syncly:profile-interests-input"
                    suggestions={INTERESTS_SUGGESTIONS}
                    values={profileData.interests}
                    onChange={(nextValues) => setProfileData((prev) => ({ ...prev, interests: nextValues }))}
                  />
                </div>
              </div>
            </Card>

            <Card className="rounded-base border-neutral-200 bg-white p-6 shadow-[0_12px_30px_rgba(17,25,43,0.04)] dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-950 dark:text-neutral-100">{t('settings.education')}</h2>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{t('settings.educationDesc')}</p>
                </div>
                <ChevronDown size={18} className="text-neutral-400 dark:text-neutral-500" />
              </div>

              <div className="mt-4 space-y-4">
                <div className="inline-flex rounded-full bg-neutral-100 p-1 dark:bg-neutral-700">
                  {[
                    { value: 'studying', label: t('settings.studyingNow') },
                    { value: 'graduated', label: t('settings.graduated') },
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
                    label={t('settings.currentSchool')}
                    helperText="Use this if you're studying right now."
                    placeholder="Search school..."
                    storageKey="syncly:profile-school-input"
                    suggestions={SCHOOL_SUGGESTIONS}
                    values={profileData.school}
                    onChange={(nextValues) => setProfileData((prev) => ({ ...prev, school: nextValues }))}
                  />
                ) : (
                  <SearchableTagField
                    label={t('settings.graduatedFrom')}
                    helperText="Use this if you already graduated."
                    placeholder="Search graduated school..."
                    storageKey="syncly:profile-graduated-input"
                    suggestions={SCHOOL_SUGGESTIONS}
                    values={profileData.graduatedFrom}
                    onChange={(nextValues) => setProfileData((prev) => ({ ...prev, graduatedFrom: nextValues }))}
                  />
                )}
              </div>
            </Card>

            <Card className="rounded-base border-neutral-200 bg-white p-6 shadow-[0_12px_30px_rgba(17,25,43,0.04)] dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-950 dark:text-neutral-100">{t('settings.preferences')}</h2>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{t('settings.preferencesDesc')}</p>
                </div>
                <ChevronDown size={18} className="text-neutral-400 dark:text-neutral-500" />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">{t('settings.gender')}</label>
                  <div className="relative">
                    <select name="gender" value={profileData.gender} onChange={handleInputChange} className="w-full rounded-base border px-3 py-2 pr-10 text-sm">
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="other">Other</option>
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">{t('settings.displayName')}</label>
                  <div className="relative">
                    <select name="displayPreference" value={profileData.displayPreference} onChange={handleInputChange} className="w-full rounded-base border px-3 py-2 pr-10 text-sm">
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

            <Card className="rounded-base border-neutral-200 bg-white p-6 shadow-[0_12px_30px_rgba(17,25,43,0.04)] dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-950 dark:text-neutral-100">{t('settings.appearance')}</h2>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{t('settings.appearanceDesc')}</p>
                </div>
                <ChevronDown size={18} className="text-neutral-400 dark:text-neutral-500" />
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">{t('common.language')}</label>
                  <select
                    value={language}
                    onChange={(event) => setLanguage(event.target.value)}
                    className="w-full rounded-base border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm outline-none transition focus:border-primary-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  >
                    {availableLanguages.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">{t('common.textSize')}</label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {textScaleOptions.map((option) => {
                      const isActive = textScale === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setTextScale(option.value)}
                          className={`rounded-base border px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900' : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'}`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex justify-end">
              {saveStatus === 'saved' && (
                <span className="mr-4 flex items-center text-sm text-green-600 dark:text-green-400">✓ {t('settings.changesSaved')}</span>
              )}
              {saveStatus === 'error' && (
                <span className="mr-4 flex items-center text-sm text-red-600 dark:text-red-400">✗ {t('settings.saveFailed')}</span>
              )}
              <Button
                variant="primary"
                className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
                onClick={handleSaveProfile}
              >
                {t('settings.saveChanges')}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="rounded-base border-neutral-200 bg-white p-6 shadow-[0_12px_30px_rgba(17,25,43,0.04)] dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-950 dark:text-neutral-100">{t('settings.profileAtGlance')}</h2>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{t('settings.profileAtGlanceDesc')}</p>
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

                <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4 lg:grid-cols-2">
                  <div className="rounded-base bg-neutral-50 px-3 py-2 text-neutral-700 dark:bg-neutral-700/50 dark:text-neutral-200">
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">Work</div>
                    <div className="font-medium">{profileData.work.length} selected</div>
                  </div>
                  <div className="rounded-base bg-neutral-50 px-3 py-2 text-neutral-700 dark:bg-neutral-700/50 dark:text-neutral-200">
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">Hobbies</div>
                    <div className="font-medium">{profileData.hobbies.length} selected</div>
                  </div>
                  <div className="rounded-base bg-neutral-50 px-3 py-2 text-neutral-700 dark:bg-neutral-700/50 dark:text-neutral-200">
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">Interests</div>
                    <div className="font-medium">{profileData.interests.length} selected</div>
                  </div>
                  <div className="rounded-base bg-neutral-50 px-3 py-2 text-neutral-700 dark:bg-neutral-700/50 dark:text-neutral-200">
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">Education</div>
                    <div className="font-medium">{profileData.educationStatus === 'studying' ? 'Studying now' : 'Graduated'}</div>
                  </div>
                </div>

                <div className="rounded-base border border-dashed border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                  {profileTip}
                </div>
              </div>
            </Card>

            <Card id="settings-tutorials" className="rounded-base border-neutral-200 bg-white p-6 shadow-[0_12px_30px_rgba(17,25,43,0.04)] dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-950 dark:text-neutral-100">{t('settings.tutorials')}</h2>
                  <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">{t('settings.tutorialsDesc')}</p>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => openModal(TutorialModal, {
                    title: 'Product Tour',
                    sizeClass: 'max-w-7xl',
                    shell: false,
                    onClose: () => {
                      try {
                        window.localStorage.setItem('syncly:seenTutorialTour', JSON.stringify({ completedAt: new Date().toISOString() }));
                      } catch {
                        // ignore storage issues
                      }
                    },
                  })}
                >
                  View Tutorial
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
