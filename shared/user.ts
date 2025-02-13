export class User {
  id?: number;
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  status?: string;
  token?: string | null;
  refreshToken?: string | null;
  refreshTokenExpiry?: Date | null;
  role?: string;
  email?: string;
}
