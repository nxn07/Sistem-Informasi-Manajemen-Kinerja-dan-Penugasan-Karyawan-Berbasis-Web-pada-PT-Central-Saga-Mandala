import apiClient from "@/lib/api-client";
import { ApiResponse, ActivityLog } from "@/types/api";
import { authService } from "./auth-service";

const LOCAL_AUDIT_KEY = "simkap_audit_logs";
const READ_TIMESTAMP_KEY = "simkap_last_read_audit_timestamp";

function getFallbackLogs(): ActivityLog[] {
  return [
    {
      id: 1,
      log_name: "USER_LOGIN",
      description: "Pengguna 'Admin System' (ADMIN) berhasil masuk ke sistem",
      subject_type: "App\\Models\\User",
      subject_id: 1,
      causer_id: 1,
      causer: { id: 1, name: "Admin System", email: "admin@gmail.com", role: "ADMIN", roles: ["ADMIN"], permissions: ["*"], created_at: "2026-08-19" },
      created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
    {
      id: 2,
      log_name: "PROOF_SUBMITTED",
      description: "Sarah Jenkins mengumpulkan bukti pekerjaan untuk tugas 'Server Migration Phase 2'",
      subject_type: "App\\Models\\TaskSubmission",
      subject_id: 2,
      causer_id: 3,
      causer: { id: 3, name: "Sarah Jenkins", email: "sarah@gmail.com", role: "EMPLOYEE", roles: ["EMPLOYEE"], permissions: ["tasks.submit"], created_at: "2026-08-19" },
      created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
    {
      id: 3,
      log_name: "TASK_REVIEWED",
      description: "Manager Utama menyetujui tugas 'Employee Onboarding Manual Update' (APPROVED)",
      subject_type: "App\\Models\\Task",
      subject_id: 3,
      causer_id: 2,
      causer: { id: 2, name: "Manager Utama", email: "manager@gmail.com", role: "MANAGER", roles: ["MANAGER"], permissions: ["tasks.review"], created_at: "2026-08-19" },
      created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
    },
  ];
}

export const auditLogService = {
  logActivity(
    userName?: string,
    actionName?: string,
    subjectType?: string,
    description?: string,
    userRole?: string
  ) {
    if (typeof window === "undefined") return;
    try {
      const currentUser = authService.getCurrentUser();
      const actualName = userName || currentUser?.name || "Admin System";
      const actualRole = userRole || currentUser?.role || "ADMIN";
      const action = (actionName || "ACTIVITY_LOGGED").toUpperCase();
      const subject = subjectType || "System";
      const desc = description || `Pengguna '${actualName}' (${actualRole}) melakukan aktivitas sistem`;

      const existing = auditLogService.getLocalLogs();
      const newEntry: ActivityLog = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        log_name: action,
        description: desc,
        subject_type: subject,
        subject_id: Date.now(),
        causer_id: currentUser?.id || 1,
        causer: {
          id: currentUser?.id || 1,
          name: actualName,
          email: currentUser?.email || `${actualName.toLowerCase().replace(/\s+/g, "")}@gmail.com`,
          role: actualRole,
          roles: [actualRole],
          permissions: currentUser?.permissions || ["*"],
          created_at: new Date().toISOString(),
        },
        created_at: new Date().toISOString(),
      };

      const updated = [newEntry, ...existing];
      localStorage.setItem(LOCAL_AUDIT_KEY, JSON.stringify(updated.slice(0, 100)));
      window.dispatchEvent(new Event("simkap_audit_updated"));
    } catch {
      // ignore
    }
  },

  getLocalLogs(): ActivityLog[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(LOCAL_AUDIT_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  markAsRead() {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(READ_TIMESTAMP_KEY, String(Date.now()));
    } catch {
      // ignore
    }
  },

  getLastReadTime(): number {
    if (typeof window === "undefined") return 0;
    try {
      const raw = localStorage.getItem(READ_TIMESTAMP_KEY);
      return raw ? Number(raw) : 0;
    } catch {
      return 0;
    }
  },

  async getUnreadCount(): Promise<number> {
    try {
      const lastRead = auditLogService.getLastReadTime();
      if (lastRead === 0) {
        const tenMinsAgo = Date.now() - 600000;
        localStorage.setItem(READ_TIMESTAMP_KEY, String(tenMinsAgo));
      }
      const effectiveRead = auditLogService.getLastReadTime();
      const allLogs = await auditLogService.getAll();
      const unread = allLogs.filter((l) => {
        const itemTime = l.created_at ? new Date(l.created_at).getTime() : 0;
        return itemTime > effectiveRead;
      });
      return unread.length;
    } catch {
      return 0;
    }
  },

  async getAll(): Promise<ActivityLog[]> {
    try {
      const localLogs = auditLogService.getLocalLogs();
      const response = await apiClient.get<ApiResponse<ActivityLog[]>>("/activity-logs");
      const serverData = response.data.data || [];
      const merged = [...localLogs, ...(serverData.length > 0 ? serverData : getFallbackLogs())];
      
      const map = new Map<number, ActivityLog>();
      merged.forEach((item) => map.set(item.id, item));
      return Array.from(map.values()).sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    } catch {
      const localLogs = auditLogService.getLocalLogs();
      const fallback = getFallbackLogs();
      const merged = [...localLogs, ...fallback];
      const map = new Map<number, ActivityLog>();
      merged.forEach((item) => map.set(item.id, item));
      return Array.from(map.values()).sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    }
  }
};
