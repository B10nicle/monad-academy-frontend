export type UserRole = 'USER' | 'ADMIN';

export type UserStatus = 'PENDING_EMAIL_VERIFICATION' | 'ACTIVE' | 'BLOCKED' | 'DELETED';

export interface CurrentUser {
  id: number;
  email: string;
  username: string;
  role: UserRole;
  status: UserStatus;
}
