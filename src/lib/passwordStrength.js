export const ratePassword = (pw = '') => {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 1;
  if (/[0-9]/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  if (score <= 1) return 0;
  if (score === 2) return 1;
  if (score === 3) return 2;
  return 3;
};

export const pwLabel = (score) => (score === 0 ? 'Weak' : score === 1 ? 'Fair' : score === 2 ? 'Good' : 'Strong');
export const pwColor = (score) => (score === 0 ? '#ef4444' : score === 1 ? '#f97316' : score === 2 ? '#f59e0b' : '#10b981');
export const pwPercent = (score) => (score === 0 ? 8 : score === 1 ? 33 : score === 2 ? 66 : 100);
