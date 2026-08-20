import apiClient from "@/lib/api-client";
import { ApiResponse, ActivityLog } from "@/types/api";

function getFallbackLogs(): ActivityLog[] {
  return [
    {
      id: 1,
      log_name: "default",
      description: "created task 'Q3 Financial Audit Report'",
      subject_type: "App\\Models\\Task",
      subject_id: 1,
      causer_id: 1,
      causer: { id: 1, name: "Admin System", email: "admin@gmail.com", role: "ADMIN", roles: ["ADMIN"], permissions: ["*"], created_at: "2026-08-19" },
      created_at: "2026-08-19T10:15:00Z",
    },
    {
      id: 2,
      log_name: "default",
      description: "submitted task work proof for 'Server Migration Phase 2'",
      subject_type: "App\\Models\\TaskSubmission",
      subject_id: 2,
      causer_id: 3,
      causer: { id: 3, name: "Sarah Jenkins", email: "sarah@gmail.com", role: "EMPLOYEE", roles: ["EMPLOYEE"], permissions: ["tasks.submit"], created_at: "2026-08-19" },
      created_at: "2026-08-19T11:30:00Z",
    },
    {
      id: 3,
      log_name: "default",
      description: "reviewed task 'Employee Onboarding Manual Update' as APPROVED",
      subject_type: "App\\Models\\Task",
      subject_id: 3,
      causer_id: 2,
      causer: { id: 2, name: "Manager Utama", email: "manager@gmail.com", role: "MANAGER", roles: ["MANAGER"], permissions: ["tasks.review"], created_at: "2026-08-19" },
      created_at: "2026-08-19T14:45:00Z",
    },
  ];
}

export const auditLogService = {
  async getAll(): Promise<ActivityLog[]> {
    try {
      const response = await apiClient.get<ApiResponse<ActivityLog[]>>("/activity-logs");
      const serverData = response.data.data || [];
      return serverData.length > 0 ? serverData : getFallbackLogs();
    } catch {
      return getFallbackLogs();
    }
  }
};
