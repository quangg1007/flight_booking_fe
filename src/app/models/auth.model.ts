export interface LoginResponse {
  user: string;
  accessToken: string;
  refreshToken: string;
  isAdmin: 'user' | 'admin';
}
