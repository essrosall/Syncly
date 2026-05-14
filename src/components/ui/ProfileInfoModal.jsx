import { X, Mail, Briefcase, Heart, FileText } from 'lucide-react';
import { Button } from './index';

const ProfileInfoModal = ({ profile, onClose, onEdit }) => {
  if (!profile) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-700">
            <h2 className="text-lg font-semibold text-neutral-950 dark:text-neutral-100">Profile Information</h2>
            <button
              onClick={onClose}
              className="rounded-md p-1 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-700"
              aria-label="Close"
            >
              <X size={20} className="text-neutral-500" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6 px-6 py-6">
            {/* Avatar and Name */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 text-neutral-950 dark:bg-neutral-700 dark:text-neutral-100 overflow-hidden">
                {profile.profileImageUrl ? (
                  <img src={profile.profileImageUrl} alt={profile.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-3xl font-semibold">
                    {(profile.name || 'S')
                      .split(' ')
                      .slice(0, 2)
                      .map(part => part[0]?.toUpperCase() || '')
                      .join('') || 'S'}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-semibold text-neutral-950 dark:text-neutral-100">{profile.displayName || profile.name}</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">{profile.email}</p>
            </div>

            {/* Name details */}
            <div className="grid grid-cols-3 gap-3 text-sm text-neutral-700 dark:text-neutral-300">
              <div>
                <div className="text-xs text-neutral-500">First name</div>
                <div className="font-medium text-neutral-900 dark:text-neutral-100">{profile.firstName}</div>
              </div>
              <div>
                <div className="text-xs text-neutral-500">Last name</div>
                <div className="font-medium text-neutral-900 dark:text-neutral-100">{profile.lastName}</div>
              </div>
              <div>
                <div className="text-xs text-neutral-500">Nickname</div>
                <div className="font-medium text-neutral-900 dark:text-neutral-100">{profile.nickname || '—'}</div>
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  <FileText size={16} className="text-neutral-400 dark:text-neutral-500" />
                  Bio
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-300">{profile.bio}</p>
              </div>
            )}

            {/* Work */}
            {profile.work && profile.work.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  <Briefcase size={16} className="text-neutral-400 dark:text-neutral-500" />
                  Work / Profession
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.work.map((item, index) => (
                    <span key={index} className="inline-block rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Hobbies */}
            {profile.hobbies && profile.hobbies.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  <Heart size={16} className="text-neutral-400 dark:text-neutral-500" />
                  Hobbies
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.hobbies.map((item, index) => (
                    <span key={index} className="inline-block rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Interests */}
            {profile.interests && profile.interests.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  <Heart size={16} className="text-neutral-400 dark:text-neutral-500" />
                  Interests
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((item, index) => (
                    <span key={index} className="inline-block rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* No additional info message */}
            {!profile.bio && !profile.work?.length && !profile.hobbies?.length && !profile.interests?.length && (
              <div className="rounded-md bg-neutral-50 px-4 py-3 text-center text-sm text-neutral-500 dark:bg-neutral-700/50 dark:text-neutral-400">
                No additional profile information added yet
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 border-t border-neutral-200 px-6 py-4 dark:border-neutral-700">
            <Button
              variant="secondary"
              className="flex-1 rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              variant="primary"
              className="flex-1 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
              onClick={onEdit}
            >
              Edit Profile
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileInfoModal;
