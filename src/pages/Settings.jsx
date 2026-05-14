import { useState, useEffect, useRef } from 'react';
import { MainLayout } from '../components/layout';
import { Card, Input, Button, Badge, Textarea } from '../components/ui';
import { UserRound, BellRing, ShieldCheck, Upload, X, Plus, ChevronDown } from 'lucide-react';

const HOBBIES_SUGGESTIONS = ['Photography', 'Gaming', 'Reading', 'Traveling', 'Cooking'];

const INTERESTS_SUGGESTIONS = ['Technology', 'Business', 'Design', 'Science', 'Health'];

const WORK_SUGGESTIONS = ['Software Engineer', 'Product Manager', 'Designer', 'Data Scientist', 'Marketer', 'Sales', 'Developer', 'Consultant', 'Analyst', 'Manager', 'Entrepreneur'];

const Settings = () => {
  const STORAGE_KEY = 'syncly:demoSession';
  
  const mockUser = { name: 'Sarah Johnson', email: 'sarah@example.com' };

  const [profileData, setProfileData] = useState({
    firstName: 'Sarah',
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
    profileImage: null,
    profileImageUrl: null,
  });

  const [saveStatus, setSaveStatus] = useState('');
  const [showWorkSuggestions, setShowWorkSuggestions] = useState(false);
  const [showHobbiesSuggestions, setShowHobbiesSuggestions] = useState(false);
  const [showInterestsSuggestions, setShowInterestsSuggestions] = useState(false);
  const [workInput, setWorkInput] = useState('');
  const [hobbiesInput, setHobbiesInput] = useState('');
  const [interestsInput, setInterestsInput] = useState('');

  const workRef = useRef(null);
  const hobbiesRef = useRef(null);
  const interestsRef = useRef(null);

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
          work: parsedData.work || [],
          hobbies: parsedData.hobbies || [],
          interests: parsedData.interests || [],
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

  // Work/Profession handlers
  const handleAddWork = (value) => {
    if (value.trim() && !profileData.work.includes(value.trim())) {
      setProfileData(prev => ({
        ...prev,
        work: [...prev.work, value.trim()],
      }));
      setWorkInput('');
      setShowWorkSuggestions(false);
    }
  };

  const handleRemoveWork = (index) => {
    setProfileData(prev => ({
      ...prev,
      work: prev.work.filter((_, i) => i !== index),
    }));
  };

  const handleAddHobby = (value) => {
    if (value.trim() && !profileData.hobbies.includes(value.trim())) {
      setProfileData(prev => ({
        ...prev,
        hobbies: [...prev.hobbies, value.trim()],
      }));
      setHobbiesInput('');
      setShowHobbiesSuggestions(false);
    }
  };

  const handleRemoveHobby = (index) => {
    setProfileData(prev => ({
      ...prev,
      hobbies: prev.hobbies.filter((_, i) => i !== index),
    }));
  };

  const handleAddInterest = (value) => {
    if (value.trim() && !profileData.interests.includes(value.trim())) {
      setProfileData(prev => ({
        ...prev,
        interests: [...prev.interests, value.trim()],
      }));
      setInterestsInput('');
      setShowInterestsSuggestions(false);
    }
  };

  const handleRemoveInterest = (index) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index),
    }));
  };

  const getFilteredSuggestions = (input, suggestions, existing) => {
    return suggestions.filter(
      item => item.toLowerCase().includes(input.toLowerCase()) && !existing.includes(item)
    );
  };

  const handleSaveProfile = () => {
    try {
      // Save to localStorage
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        nickname: profileData.nickname,
        name: profileData.name,
        email: profileData.email,
        gender: profileData.gender,
        displayPreference: profileData.displayPreference,
        bio: profileData.bio,
        work: profileData.work,
        hobbies: profileData.hobbies,
        interests: profileData.interests,
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
          <Card className="rounded-md border-neutral-200 bg-white p-6 shadow-[0_12px_30px_rgba(17,25,43,0.04)] space-y-5 dark:border-neutral-700 dark:bg-neutral-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-neutral-950 dark:text-neutral-100">Profile</h2>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Manage your profile information and avatar</p>
              </div>
              <UserRound size={18} className="text-neutral-400 dark:text-neutral-500" />
            </div>

            {/* Profile Image Upload - Enhanced */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Profile Picture</label>
              <div className="flex items-end gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-700 overflow-hidden">
                  {profileData.profileImageUrl ? (
                    <img src={profileData.profileImageUrl} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-lg font-semibold text-neutral-600 dark:text-neutral-300">
                      {(profileData.name || 'S')
                        .split(' ')
                        .slice(0, 2)
                        .map(part => part[0]?.toUpperCase() || '')
                        .join('') || 'S'}
                    </span>
                  )}
                </div>
                <label className="relative flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-neutral-300 bg-neutral-50 px-3 py-2 transition-colors hover:border-neutral-400 hover:bg-neutral-100 dark:border-neutral-600 dark:bg-neutral-700/50 dark:hover:bg-neutral-700">
                  <Upload size={14} className="text-neutral-600 dark:text-neutral-400" />
                  <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">PNG, JPG up to 5MB</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                placeholder="Full name"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
              />
              <Input
                placeholder="Email"
                name="email"
                type="email"
                value={profileData.email}
                onChange={handleInputChange}
              />
            </div>

            {/* First / Last / Nickname */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Input
                placeholder="First name"
                name="firstName"
                value={profileData.firstName}
                onChange={handleInputChange}
              />
              <Input
                placeholder="Last name"
                name="lastName"
                value={profileData.lastName}
                onChange={handleInputChange}
              />
              <Input
                placeholder="Nickname"
                name="nickname"
                value={profileData.nickname}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Gender</label>
                <select name="gender" value={profileData.gender} onChange={handleInputChange} className="w-full rounded-md border px-3 py-2 text-sm">
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Display name</label>
                <select name="displayPreference" value={profileData.displayPreference} onChange={handleInputChange} className="w-full rounded-md border px-3 py-2 text-sm">
                  <option value="nickname">Nickname</option>
                  <option value="first">First name</option>
                  <option value="last">Last name</option>
                  <option value="full">First + Last (with prefix)</option>
                </select>
              </div>
            </div>

            {/* Bio Textarea */}
            <div className="space-y-2">
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

            {/* Work / Profession - Multi-select */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Work / Profession</label>
              <div className="relative" ref={workRef}>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      placeholder="Search or add work..."
                      value={workInput}
                      onChange={(e) => {
                        setWorkInput(e.target.value);
                        setShowWorkSuggestions(true);
                      }}
                      onFocus={() => setShowWorkSuggestions(true)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddWork(workInput);
                        }
                      }}
                    />
                    {showWorkSuggestions && workInput && (
                      <div className="absolute top-full left-0 right-0 mt-1 z-10 rounded-md border border-neutral-200 bg-white shadow-md dark:border-neutral-700 dark:bg-neutral-800 max-h-40 overflow-y-auto">
                        {getFilteredSuggestions(workInput, WORK_SUGGESTIONS, profileData.work).map((suggestion) => (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() => handleAddWork(suggestion)}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                        {!getFilteredSuggestions(workInput, WORK_SUGGESTIONS, profileData.work).length && (
                          <button
                            type="button"
                            onClick={() => handleAddWork(workInput)}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors text-neutral-600 dark:text-neutral-400"
                          >
                            Add "{workInput}" as custom
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="primary"
                    className="rounded-md bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600"
                    onClick={() => handleAddWork(workInput)}
                  >
                    <Plus size={14} />
                  </Button>
                </div>
              </div>
              {profileData.work.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {profileData.work.map((item, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-sm dark:bg-neutral-700"
                    >
                      <span className="text-neutral-700 dark:text-neutral-200">{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveWork(index)}
                        className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Hobbies and Interests - Side by Side */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Hobbies */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Hobbies</label>
                <Input
                  placeholder="Add hobby..."
                  value={hobbiesInput}
                  onChange={(e) => setHobbiesInput(e.target.value)}
                  onFocus={() => setShowHobbiesSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowHobbiesSuggestions(false), 200)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddHobby(hobbiesInput);
                    }
                  }}
                />
                {showHobbiesSuggestions && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Popular hobbies</p>
                    <div className="flex flex-wrap gap-2">
                      {HOBBIES_SUGGESTIONS.filter(h => !profileData.hobbies.includes(h)).map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => handleAddHobby(suggestion)}
                          className="inline-flex rounded-full bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-primary-700 active:scale-95"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {profileData.hobbies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {profileData.hobbies.map((item, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-sm dark:bg-neutral-700"
                      >
                        <span className="text-neutral-700 dark:text-neutral-200">{item}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveHobby(index)}
                          className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Interests */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Interests</label>
                <Input
                  placeholder="Add interest..."
                  value={interestsInput}
                  onChange={(e) => setInterestsInput(e.target.value)}
                  onFocus={() => setShowInterestsSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowInterestsSuggestions(false), 200)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddInterest(interestsInput);
                    }
                  }}
                />
                {showInterestsSuggestions && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Popular interests</p>
                    <div className="flex flex-wrap gap-2">
                      {INTERESTS_SUGGESTIONS.filter(i => !profileData.interests.includes(i)).map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => handleAddInterest(suggestion)}
                          className="inline-flex rounded-full bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-primary-700 active:scale-95"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {profileData.interests.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {profileData.interests.map((item, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-sm dark:bg-neutral-700"
                      >
                        <span className="text-neutral-700 dark:text-neutral-200">{item}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveInterest(index)}
                          className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              {saveStatus === 'saved' && (
                <span className="flex items-center text-sm text-green-600 dark:text-green-400">✓ Changes saved</span>
              )}
              {saveStatus === 'error' && (
                <span className="flex items-center text-sm text-red-600 dark:text-red-400">✗ Save failed</span>
              )}
              <Button
                variant="primary"
                className="bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600"
                onClick={handleSaveProfile}
              >
                Save changes
              </Button>
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
