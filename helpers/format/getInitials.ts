/**
 * Extracts 1-2 uppercase initials from a full name or email address.
 */
export function getInitials(nameOrEmail: string | null | undefined): string {
  if (!nameOrEmail) return 'U';
  const cleanName = nameOrEmail.trim();
  if (cleanName.includes('@')) {
    return cleanName.slice(0, 2).toUpperCase();
  }
  const parts = cleanName.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
