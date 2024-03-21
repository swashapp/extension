export function normalizeEmail(email: string): string {
  const [user, domain] = email.toLowerCase().split('@');

  let normalized = user.split('+')[0];
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    normalized = normalized.replace(/\./g, '');
    return `${normalized}@gmail.com`;
  }

  return `${normalized}@${domain}`;
}
