import { apiRequest } from '../config';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: User;
}

export async function fetchCurrentUser(): Promise<User> {
  const data = await apiRequest<AuthResponse>('/auth/me');
  return data.user;
}

