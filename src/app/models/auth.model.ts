export interface LoginResponse {
  accessToken: string;
  isAdmin: 'user' | 'admin';
}
