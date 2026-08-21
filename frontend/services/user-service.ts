import apiClient from "@/lib/api-client";
import { ApiResponse, User } from "@/types/api";

const LOCAL_USERS_KEY = "simkap_created_users";

function getLocalUsers(): User[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(LOCAL_USERS_KEY);
    if (!data) return [];
    const parsed: User[] = JSON.parse(data);
    return parsed.map((u) => {
      const cleanEmail = u.email?.toLowerCase().trim();
      const userRole = (u.role || u.roles?.[0] || "EMPLOYEE").toUpperCase();
      const savedByEmail = cleanEmail ? localStorage.getItem(`simkap_user_perm_${cleanEmail}`) : null;

      let perms = u.permissions;
      if (savedByEmail) {
        try {
          perms = JSON.parse(savedByEmail);
        } catch {
          // ignore
        }
      }

      if (userRole === "EMPLOYEE" && perms) {
        perms = perms.filter((p: string) => ["tasks.create", "tasks.submit", "tasks.review"].includes(p));
      } else if (userRole === "MANAGER" && perms) {
        perms = perms.filter((p: string) => ["tasks.create", "tasks.submit", "tasks.review", "evaluations.create", "users.delete"].includes(p));
      }

      return {
        ...u,
        role: userRole,
        roles: [userRole],
        permissions: perms && perms.length > 0 ? perms : (userRole === "ADMIN" ? ["*"] : userRole === "MANAGER" ? ["tasks.create", "tasks.submit", "tasks.review"] : ["tasks.submit"]),
      };
    });
  } catch {
    return [];
  }
}

function saveLocalUser(user: User) {
  if (typeof window === "undefined") return;
  try {
    const existing = getLocalUsers();
    const cleanEmail = user.email?.toLowerCase().trim();
    const updated = [user, ...existing.filter((u) => u.email?.toLowerCase().trim() !== cleanEmail)];
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(updated));

    if (user.permissions && cleanEmail) {
      localStorage.setItem(`simkap_user_perm_${cleanEmail}`, JSON.stringify(user.permissions));
    }
  } catch {
    // ignore
  }
}

function getFallbackUsers(): User[] {
  return [
    { id: 1, name: "Sarah Jenkins", email: "sarah@gmail.com", role: "EMPLOYEE", roles: ["EMPLOYEE"], permissions: ["tasks.submit"], created_at: "2026-08-19" },
    { id: 2, name: "Michael Ross", email: "michael@gmail.com", role: "EMPLOYEE", roles: ["EMPLOYEE"], permissions: ["tasks.submit", "tasks.create"], created_at: "2026-08-19" },
    { id: 3, name: "Natalie McDermott", email: "natalie@gmail.com", role: "EMPLOYEE", roles: ["EMPLOYEE"], permissions: ["tasks.submit"], created_at: "2026-08-19" },
    { id: 4, name: "Van Larkin", email: "van@gmail.com", role: "EMPLOYEE", roles: ["EMPLOYEE"], permissions: ["tasks.submit"], created_at: "2026-08-19" },
    { id: 5, name: "Miss Felicity Runte", email: "felicity@gmail.com", role: "EMPLOYEE", roles: ["EMPLOYEE"], permissions: ["tasks.submit"], created_at: "2026-08-19" },
    { id: 6, name: "Manager Utama", email: "manager@gmail.com", role: "MANAGER", roles: ["MANAGER"], permissions: ["tasks.create", "tasks.submit", "tasks.review"], created_at: "2026-08-19" },
    { id: 7, name: "Admin System", email: "admin@gmail.com", role: "ADMIN", roles: ["ADMIN"], permissions: ["*"], created_at: "2026-08-19" },
    { id: 8, name: "Manager Operasional", email: "manager2@gmail.com", role: "MANAGER", roles: ["MANAGER"], permissions: ["tasks.create", "tasks.submit", "tasks.review"], created_at: "2026-08-19" },
  ];
}

function mergeUsers(serverUsers: User[], localUsers: User[]): User[] {
  const map = new Map<string, User>();
  
  const fixedIdMap: Record<string, number> = {
    "sarah@gmail.com": 1,
    "michael@gmail.com": 2,
    "natalie@gmail.com": 3,
    "van@gmail.com": 4,
    "felicity@gmail.com": 5,
    "manager@gmail.com": 6,
    "admin@gmail.com": 7,
    "manager2@gmail.com": 8,
  };

  serverUsers.forEach((u) => {
    const key = (u.email || u.name || String(u.id)).toLowerCase().trim();
    map.set(key, u);
  });
  localUsers.forEach((u) => {
    const key = (u.email || u.name || String(u.id)).toLowerCase().trim();
    const existing = map.get(key);
    map.set(key, existing ? { ...existing, ...u } : u);
  });

  return Array.from(map.values()).map((user) => {
    const cleanEmail = user.email?.toLowerCase().trim() || "";
    const fixedId = fixedIdMap[cleanEmail] || user.id;
    const userRole = (user.role || user.roles?.[0] || "EMPLOYEE").toUpperCase();

    let perms = user.permissions;
    if (typeof window !== "undefined" && cleanEmail) {
      const savedByEmail = localStorage.getItem(`simkap_user_perm_${cleanEmail}`);
      if (savedByEmail) {
        try {
          perms = JSON.parse(savedByEmail);
        } catch {
          // ignore
        }
      }
    }

    if (userRole === "EMPLOYEE" && perms) {
      perms = perms.filter((p: string) => ["tasks.create", "tasks.submit", "tasks.review"].includes(p));
    } else if (userRole === "MANAGER" && perms) {
      perms = perms.filter((p: string) => ["tasks.create", "tasks.submit", "tasks.review", "evaluations.create", "users.delete"].includes(p));
    }

    return {
      ...user,
      id: fixedId,
      role: userRole,
      roles: [userRole],
      permissions: perms && perms.length > 0 ? perms : (userRole === "ADMIN" ? ["*"] : userRole === "MANAGER" ? ["tasks.create", "tasks.review"] : ["tasks.submit"]),
    };
  });
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
