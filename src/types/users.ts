export type UserRole = 'subscriber' | 'editor' | 'author' | 'admin' | 'superadmin';

export interface UserProfile {
  id: string;
  email: string | null;
  username: string | null;
  role: UserRole | null;
}