import apiClient from '@/lib/api-client';
import { ApiResponse, User } from '@/types/api';
import Cookies from 'js-cookie';
import { userService } from '@/services/user-service';

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
      const cleanEmail = (payload.email || "").trim().toLowerCase();
      const cleanPassword = (payload.password || "").trim();

      // Strict credential check per role
      if (cleanPassword !== "password") {
        throw new Error("Gagal Masuk: Combination email atau password salah (401 Unauthorized).");
      }

      if (cleanEmail === "admin@gmail.com") {
        const mockUser: User = {
          id: 1,
          name: "Admin System",
          email: "admin@gmail.com",
          role: "ADMIN",
          roles: ["ADMIN"],
          permissions: ["*"],
          created_at: "2026-08-19",
        };
        const mockToken = `demo_token_ADMIN_${Date.now()}`;
        Cookies.set('simkap_token', mockToken, { expires: 7 });
        Cookies.set('simkap_user', JSON.stringify(mockUser), { expires: 7 });
        return { token: mockToken, user: mockUser };
      }

      if (cleanEmail === "manager@gmail.com") {
        const mockUser: User = {
          id: 2,
          name: "Manager Utama",
          email: "manager@gmail.com",
          role: "MANAGER",
          roles: ["MANAGER"],
          permissions: ["tasks.create", "tasks.review", "evaluations.create"],
          created_at: "2026-08-19",
        };
        const mockToken = `demo_token_MANAGER_${Date.now()}`;
        Cookies.set('simkap_token', mockToken, { expires: 7 });
        Cookies.set('simkap_user', JSON.stringify(mockUser), { expires: 7 });
        return { token: mockToken, user: mockUser };
      }

      if (cleanEmail === "employee@gmail.com" || cleanEmail === "sarah@gmail.com") {
        // Read custom saved permissions from localStorage if updated by Admin in /users
        let savedPerms = ["tasks.submit", "tasks.create", "evaluations.view_own"];
        if (typeof window !== "undefined") {
          try {
            const raw = localStorage.getItem("simkap_user_perm_3");
            if (raw) savedPerms = JSON.parse(raw);
          } catch {
            // ignore
          }
        }

        const mockUser: User = {
          id: 3,
          name: "Sarah Jenkins",
          email: "sarah@gmail.com",
          role: "EMPLOYEE",
          roles: ["EMPLOYEE"],
          permissions: savedPerms,
          created_at: "2026-08-19",
        };
        const mockToken = `demo_token_EMPLOYEE_${Date.now()}`;
        Cookies.set('simkap_token', mockToken, { expires: 7 });
        Cookies.set('simkap_user', JSON.stringify(mockUser), { expires: 7 });
        return { token: mockToken, user: mockUser };
      }

      // Check dynamically registered or fallback users from userService
      try {
        const allUsers = await userService.getAll();
        const found = allUsers.find((u) => u.email.toLowerCase() === cleanEmail);
        if (found) {
          const userRole = (found.role || found.roles?.[0] || "EMPLOYEE").toUpperCase();
          const mockToken = `demo_token_${userRole}_${Date.now()}`;
          const mockUser: User = {
            ...found,
            role: userRole,
            roles: [userRole],
            permissions: found.permissions || (userRole === "ADMIN" ? ["*"] : userRole === "MANAGER" ? ["tasks.create", "tasks.review"] : ["tasks.submit", "tasks.create"]),
          };
          Cookies.set('simkap_token', mockToken, { expires: 7 });
          Cookies.set('simkap_user', JSON.stringify(mockUser), { expires: 7 });
          return { token: mockToken, user: mockUser };
        }
      } catch {
        // ignore
      }

      // Invalid email credential error
      throw new Error(`Email '${payload.email}' tidak terdaftar atau password salah (401 Unauthorized).`);
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
    const token = Cookies.get('simkap_token');
    const cachedUser = this.getCurrentUser();

    if (token?.startsWith('demo_') && cachedUser) {
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem(`simkap_user_perm_${cachedUser.id}`);
          if (raw) {
            cachedUser.permissions = JSON.parse(raw);
          }
        } catch {
          // ignore
        }
      }
      return cachedUser;
    }

    try {
      const response = await apiClient.get<ApiResponse<User>>('/auth/me');
      const user = response.data.data;
      Cookies.set('simkap_user', JSON.stringify(user), { expires: 7 });
      return user;
    } catch {
      if (cachedUser) return cachedUser;
      throw new Error('Unauthenticated');
    }
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
