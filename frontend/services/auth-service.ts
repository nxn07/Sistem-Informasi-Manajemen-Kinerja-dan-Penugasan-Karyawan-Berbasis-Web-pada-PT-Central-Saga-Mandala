import apiClient from '@/lib/api-client';
import { ApiResponse, User } from '@/types/api';
import Cookies from 'js-cookie';

export interface LoginPayload {
  email?: string;
  username?: string;
  password?: string;
}

export interface AuthResponseData {
  token: string;
  user: User;
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponseData> {
    const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/login', payload);
    const { token, user } = response.data.data;
    
    Cookies.set('simkap_token', token, { expires: 7, secure: process.env.NODE_ENV === 'production' });
    Cookies.set('simkap_user', JSON.stringify(user), { expires: 7 });
    
    return { token, user };
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore if session is already expired
    } finally {
      Cookies.remove('simkap_token');
      Cookies.remove('simkap_user');
      window.location.href = '/login';
    }
  },

  async getMe(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    const user = response.data.data;
    Cookies.set('simkap_user', JSON.stringify(user), { expires: 7 });
    return user;
  },

  getCurrentUser(): User | null {
    const userCookie = Cookies.get('simkap_user');
    if (!userCookie) return null;
    try {
      return JSON.parse(userCookie) as User;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!Cookies.get('simkap_token');
  }
};
