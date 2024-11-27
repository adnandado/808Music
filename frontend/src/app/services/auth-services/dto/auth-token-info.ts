export interface AuthTokenInfo {
  userId: number;
  username?: string;
  email?: string;
  isAdmin: boolean;
  token: string;
  refreshToken: string;
  rememberMe: boolean;
}
