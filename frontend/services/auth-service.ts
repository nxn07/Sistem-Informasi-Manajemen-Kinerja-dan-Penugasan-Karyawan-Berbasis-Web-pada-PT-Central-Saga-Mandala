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
    try {
      const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/login', payload);
      const { token, user } = response.data.data;
      
      Cookies.set('simkap_token', token, { expires: 7, secure: process.env.NODE_ENV === 'production' });
      Cookies.set('simkap_user', JSON.stringify(user), { expires: 7 });
      
      return { token, user };
    } catch {
      // Demo Role Login Fallback
      let mockUser: User = {
        id: 1,
        name: "Admin System",
        email: payload.email || "admin@gmail.com",
        role: "ADMIN",
        roles: ["ADMIN"],
        permissions: ["*"],
        created_at: "2026-08-19",
      };

      if (payload.email?.includes("manager")) {
        mockUser = {
          id: 2,
          name: "Manager Utama",
          email: "manager@gmail.com",
          role: "MANAGER",
          roles: ["MANAGER"],
          permissions: ["tasks.create", "tasks.review", "evaluations.create"],
          created_at: "2026-08-19",
        };
      } else if (payload.email?.includes("employee") || payload.email?.includes("sarah")) {
        mockUser = {
          id: 3,
          name: "Sarah Jenkins",
          email: "sarah@gmail.com",
          role: "EMPLOYEE",
          roles: ["EMPLOYEE"],
          permissions: ["tasks.submit", "evaluations.view_own"],
          created_at: "2026-08-19",
        };
      }

      const mockToken = `demo_token_${mockUser.role}_${Date.now()}`;
      Cookies.set('simkap_token', mockToken, { expires: 7 });
      Cookies.set('simkap_user', JSON.stringify(mockUser), { expires: 7 });

      return { token: mockToken, user: mockUser };
    }
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
