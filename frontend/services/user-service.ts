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
      const savedStatus = cleanEmail ? localStorage.getItem(`simkap_user_status_${cleanEmail}`) : null;

      let hasSavedPerms = false;
      let perms = u.permissions;
      if (savedByEmail !== null) {
        try {
          perms = JSON.parse(savedByEmail);
          hasSavedPerms = true;
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
        status: (savedStatus as "ACTIVE" | "INACTIVE") || u.status || "ACTIVE",
        permissions: hasSavedPerms ? (perms || []) : (perms && perms.length > 0 ? perms : (userRole === "ADMIN" ? ["*"] : userRole === "MANAGER" ? ["tasks.create", "tasks.submit", "tasks.review"] : ["tasks.submit"])),
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
    if (user.status && cleanEmail) {
      localStorage.setItem(`simkap_user_status_${cleanEmail}`, user.status);
    }
  } catch {
    // ignore
  }
}

function getFallbackUsers(): User[] {
  return [
    { id: 1, name: "Admin System", email: "admin@gmail.com", role: "ADMIN", roles: ["ADMIN"], status: "ACTIVE", permissions: ["*"], is_primary_admin: true, created_at: "2026-08-19" },
    { id: 2, name: "admin edo", email: "adminEdo@gmail.com", role: "ADMIN", roles: ["ADMIN"], status: "ACTIVE", permissions: ["*"], is_primary_admin: false, created_at: "2026-08-19" },
    { id: 3, name: "Manager Utama", email: "manager@gmail.com", role: "MANAGER", roles: ["MANAGER"], status: "ACTIVE", permissions: ["tasks.create", "tasks.submit", "tasks.review"], is_primary_admin: false, created_at: "2026-08-19" },
    { id: 4, name: "Manager Operasional", email: "manager2@gmail.com", role: "MANAGER", roles: ["MANAGER"], status: "ACTIVE", permissions: ["tasks.create", "tasks.submit", "tasks.review"], is_primary_admin: false, created_at: "2026-08-19" },
    { id: 5, name: "Sarah Jenkins", email: "sarah@gmail.com", role: "EMPLOYEE", roles: ["EMPLOYEE"], status: "ACTIVE", permissions: ["tasks.submit"], is_primary_admin: false, created_at: "2026-08-19" },
    { id: 6, name: "Michael Ross", email: "michael@gmail.com", role: "EMPLOYEE", roles: ["EMPLOYEE"], status: "ACTIVE", permissions: ["tasks.submit", "tasks.create"], is_primary_admin: false, created_at: "2026-08-19" },
    { id: 7, name: "Natalie McDermott", email: "natalie@gmail.com", role: "EMPLOYEE", roles: ["EMPLOYEE"], status: "ACTIVE", permissions: ["tasks.submit"], is_primary_admin: false, created_at: "2026-08-19" },
    { id: 8, name: "Van Larkin", email: "van@gmail.com", role: "EMPLOYEE", roles: ["EMPLOYEE"], status: "ACTIVE", permissions: ["tasks.submit"], is_primary_admin: false, created_at: "2026-08-19" },
    { id: 9, name: "Miss Felicity Runte", email: "felicity@gmail.com", role: "EMPLOYEE", roles: ["EMPLOYEE"], status: "ACTIVE", permissions: ["tasks.submit"], is_primary_admin: false, created_at: "2026-08-19" },
    { id: 10, name: "Bertrand", email: "bertrand@gmail.com", role: "EMPLOYEE", roles: ["EMPLOYEE"], status: "ACTIVE", permissions: ["tasks.submit"], is_primary_admin: false, created_at: "2026-08-19" },
    { id: 11, name: "Anna Lee", email: "anna@gmail.com", role: "EMPLOYEE", roles: ["EMPLOYEE"], status: "ACTIVE", permissions: ["tasks.submit"], is_primary_admin: false, created_at: "2026-08-19" },
    { id: 12, name: "David Tran", email: "david@gmail.com", role: "EMPLOYEE", roles: ["EMPLOYEE"], status: "ACTIVE", permissions: ["tasks.submit"], is_primary_admin: false, created_at: "2026-08-19" },
  ];
}

const fixedNameMap: Record<string, string> = {
  "admin@gmail.com": "Admin System",
  "adminedo@gmail.com": "admin edo",
  "manager@gmail.com": "Manager Utama",
  "manager2@gmail.com": "Manager Operasional",
  "sarah@gmail.com": "Sarah Jenkins",
  "michael@gmail.com": "Michael Ross",
  "natalie@gmail.com": "Natalie McDermott",
  "van@gmail.com": "Van Larkin",
  "felicity@gmail.com": "Miss Felicity Runte",
  "bertrand@gmail.com": "Bertrand",
  "anna@gmail.com": "Anna Lee",
  "david@gmail.com": "David Tran",
};

const fixedIdMap: Record<string, number> = {
  "admin@gmail.com": 1,
  "adminedo@gmail.com": 2,
  "manager@gmail.com": 3,
  "manager2@gmail.com": 4,
  "sarah@gmail.com": 5,
  "michael@gmail.com": 6,
  "natalie@gmail.com": 7,
  "van@gmail.com": 8,
  "felicity@gmail.com": 9,
  "bertrand@gmail.com": 10,
  "anna@gmail.com": 11,
  "david@gmail.com": 12,
};

function mergeUsers(serverUsers: User[], localUsers: User[]): User[] {
  const map = new Map<string, User>();

  serverUsers.forEach((u) => {
    const key = (u.email || u.name || String(u.id)).toLowerCase().trim();
    map.set(key, u);
  });
  localUsers.forEach((u) => {
    const key = (u.email || u.name || String(u.id)).toLowerCase().trim();
    const existing = map.get(key);
    map.set(key, existing ? { ...existing, ...u } : u);
  });

  return Array.from(map.values())
    .map((user) => {
      const cleanEmail = user.email?.toLowerCase().trim() || "";
      const fixedId = fixedIdMap[cleanEmail] || user.id;
      const isPrimary = user.is_primary_admin ?? (cleanEmail === "admin@gmail.com");
      const userRole = isPrimary ? "ADMIN" : (user.role || user.roles?.[0] || "EMPLOYEE").toUpperCase();
      const resolvedName = fixedNameMap[cleanEmail] || user.name;

      let hasSavedPerms = false;
      let perms = user.permissions;
      let userStatus: "ACTIVE" | "INACTIVE" = user.status || "ACTIVE";

      if (typeof window !== "undefined" && cleanEmail) {
        const savedByEmail = localStorage.getItem(`simkap_user_perm_${cleanEmail}`);
        if (savedByEmail !== null) {
          try {
            perms = JSON.parse(savedByEmail);
            hasSavedPerms = true;
          } catch {
            // ignore
          }
        }
        const savedStatus = localStorage.getItem(`simkap_user_status_${cleanEmail}`);
        if (savedStatus) {
          userStatus = savedStatus as "ACTIVE" | "INACTIVE";
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
        name: resolvedName,
        role: userRole,
        roles: [userRole],
        status: isPrimary ? "ACTIVE" : userStatus,
        is_primary_admin: isPrimary,
        permissions: isPrimary
          ? ["*"]
          : hasSavedPerms
          ? (perms || [])
          : (perms && perms.length > 0 ? perms : (userRole === "ADMIN" ? ["*"] : userRole === "MANAGER" ? ["tasks.create", "tasks.submit", "tasks.review"] : ["tasks.submit"])),
      };
    })
    .sort((a, b) => {
      const getRank = (u: User) => {
        if (u.is_primary_admin || u.email?.toLowerCase().trim() === "admin@gmail.com") return 1;
        const r = (u.role || u.roles?.[0] || "EMPLOYEE").toUpperCase();
        if (r === "ADMIN") return 2;
        if (r === "MANAGER") return 3;
        return 4; // EMPLOYEE
      };

      const rankA = getRank(a);
      const rankB = getRank(b);

      if (rankA !== rankB) {
        return rankA - rankB;
      }

      // Prioritaskan akun aktif jika level jabatan sama
      const statusA = a.status === "INACTIVE" ? 1 : 0;
      const statusB = b.status === "INACTIVE" ? 1 : 0;
      if (statusA !== statusB) {
        return statusA - statusB;
      }

      return a.id - b.id;
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
        status: "ACTIVE",
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
        status: "ACTIVE",
        permissions: [],
        created_at: new Date().toISOString().split("T")[0],
      };
      const updated: User = { ...existing, ...payload };
      saveLocalUser(updated);
      return updated;
    }
  },

  async toggleStatus(id: number): Promise<User> {
    const all = await this.getAll();
    const existing = all.find((u) => u.id === id);
    if (!existing) throw new Error("User tidak ditemukan");

    if (existing.is_primary_admin || existing.email?.toLowerCase().trim() === "admin@gmail.com") {
      throw new Error("Akun Super Admin Utama dilindungi sistem dan tidak dapat dinonaktifkan!");
    }

    const currentStatus = existing.status || "ACTIVE";
    const nextStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    // If deactivating user, set all assigned tasks of this user to PENDING and mark for reassignment
    if (nextStatus === "INACTIVE" && typeof window !== "undefined") {
      try {
        const rawTasks = localStorage.getItem("simkap_tasks_v2");
        if (rawTasks) {
          const tasks = JSON.parse(rawTasks);
          const updatedTasks = tasks.map((t: any) => {
            const isAssigned =
              t.assigned_to_id === id ||
              (t.assignedTo && t.assignedTo.toLowerCase().includes(existing.name.toLowerCase()));
            if (isAssigned) {
              return {
                ...t,
                status: "PENDING",
                assignedTo: "Dialihkan (Non-Aktif)",
                needs_reassignment: true,
                previous_owner: existing.name,
              };
            }
            return t;
          });
          localStorage.setItem("simkap_tasks_v2", JSON.stringify(updatedTasks));
          window.dispatchEvent(new Event("simkap_tasks_updated"));
        }
      } catch {
        // ignore
      }
    }

    const updated = await this.update(id, { status: nextStatus });
    if (typeof window !== "undefined" && existing.email) {
      localStorage.setItem(`simkap_user_status_${existing.email.toLowerCase().trim()}`, nextStatus);
    }
    return updated;
  },

  async delete(id: number): Promise<void> {
    // Instead of permanent deletion, deactivate the user
    await this.toggleStatus(id);
  },

  async updateRole(id: number, role: string): Promise<User> {
    return this.update(id, { role, roles: [role] });
  }
};
