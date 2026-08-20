import apiClient from "@/lib/api-client";
import { ApiResponse, User } from "@/types/api";

const LOCAL_USERS_KEY = "simkap_created_users";

function getLocalUsers(): User[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(LOCAL_USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLocalUser(user: User) {
  if (typeof window === "undefined") return;
  try {
    const existing = getLocalUsers();
    const updated = [user, ...existing.filter((u) => u.id !== user.id)];
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(updated));

    if (user.permissions) {
      localStorage.setItem(`simkap_user_perm_${user.id}`, JSON.stringify(user.permissions));
    }
  } catch {
    // ignore
  }
}

function getFallbackUsers(): User[] {
  return [
    { id: 1, name: "Sarah Jenkins", email: "sarah@gmail.com", role: "EMPLOYEE", roles: ["EMPLOYEE"], permissions: ["tasks.submit", "tasks.create", "evaluations.view_own"], created_at: "2026-08-19" },
    { id: 2, name: "Michael Ross", email: "michael@gmail.com", role: "EMPLOYEE", roles: ["EMPLOYEE"], permissions: ["tasks.submit"], created_at: "2026-08-19" },
    { id: 3, name: "Natalie McDermott", email: "natalie@gmail.com", role: "EMPLOYEE", roles: ["EMPLOYEE"], permissions: ["tasks.submit"], created_at: "2026-08-19" },
    { id: 4, name: "Van Larkin", email: "van@gmail.com", role: "EMPLOYEE", roles: ["EMPLOYEE"], permissions: ["tasks.submit"], created_at: "2026-08-19" },
    { id: 5, name: "Miss Felicity Runte", email: "felicity@gmail.com", role: "EMPLOYEE", roles: ["EMPLOYEE"], permissions: ["tasks.submit"], created_at: "2026-08-19" },
    { id: 6, name: "Manager Utama", email: "manager@gmail.com", role: "MANAGER", roles: ["MANAGER"], permissions: ["tasks.create", "tasks.review"], created_at: "2026-08-19" },
    { id: 7, name: "Admin System", email: "admin@gmail.com", role: "ADMIN", roles: ["ADMIN"], permissions: ["*"], created_at: "2026-08-19" },
  ];
}

function mergeUsers(serverUsers: User[], localUsers: User[]): User[] {
  const map = new Map<string, User>();
  localUsers.forEach((u) => {
    const key = (u.email || u.name || String(u.id)).toLowerCase().trim();
    map.set(key, u);
  });
  serverUsers.forEach((u) => {
    const key = (u.email || u.name || String(u.id)).toLowerCase().trim();
    map.set(key, u);
  });
  return Array.from(map.values());
}

export const userService = {
  async getAll(): Promise<User[]> {
    try {
      const response = await apiClient.get<ApiResponse<User[]>>("/users");
      const serverData = response.data.data || [];
      const localData = getLocalUsers();
      const combined = mergeUsers(serverData, localData);
      return combined.length > 0 ? combined : mergeUsers(getFallbackUsers(), localData);
    } catch {
      const localData = getLocalUsers();
      return mergeUsers(getFallbackUsers(), localData);
    }
  },

  async getById(id: number): Promise<User> {
    try {
      const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
      return response.data.data;
    } catch {
      const all = await this.getAll();
      const found = all.find((u) => u.id === id);
      if (!found) throw new Error("User tidak ditemukan");
      return found;
    }
  },

  async create(payload: Partial<User> & { password?: string }): Promise<User> {
    try {
      const response = await apiClient.post<ApiResponse<User>>("/users", payload);
      const newUser = response.data.data;
      saveLocalUser(newUser);
      return newUser;
    } catch {
      const newId = Date.now();
      const role = payload.role || "EMPLOYEE";
      const newUser: User = {
        id: newId,
        name: payload.name || "Pegawai Baru",
        email: payload.email || `user${newId}@centralsaga.com`,
        role,
        roles: [role],
        permissions: payload.permissions || (role === "ADMIN" ? ["*"] : role === "MANAGER" ? ["tasks.create", "tasks.review"] : ["tasks.submit", "tasks.create"]),
        created_at: new Date().toISOString().split("T")[0],
      };
      saveLocalUser(newUser);
      return newUser;
    }
  },

  async update(id: number, payload: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, payload);
      const updated = response.data.data;
      saveLocalUser(updated);
      return updated;
    } catch {
      const all = await this.getAll();
      const existing = all.find((u) => u.id === id) || {
        id,
        name: payload.name || "User Updated",
        email: payload.email || "updated@gmail.com",
        role: payload.role || "EMPLOYEE",
        roles: [payload.role || "EMPLOYEE"],
        permissions: [],
        created_at: new Date().toISOString().split("T")[0],
      };
      const updated: User = { ...existing, ...payload };
      saveLocalUser(updated);
      return updated;
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/users/${id}`);
    } catch {
      // ignore
    }
    if (typeof window !== "undefined") {
      const local = getLocalUsers().filter((u) => u.id !== id);
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(local));
    }
  },

  async updateRole(id: number, role: string): Promise<User> {
    return this.update(id, { role, roles: [role] });
  }
};
