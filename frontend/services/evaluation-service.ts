import apiClient from "@/lib/api-client";
import { ApiResponse, PerformanceEvaluation } from "@/types/api";

const LOCAL_EVALS_KEY = "simkap_created_evaluations";

function getLocalEvals(): PerformanceEvaluation[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(LOCAL_EVALS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLocalEval(evalItem: PerformanceEvaluation) {
  if (typeof window === "undefined") return;
  try {
    const existing = getLocalEvals();
    const updated = [evalItem, ...existing.filter((e) => e.id !== evalItem.id)];
    localStorage.setItem(LOCAL_EVALS_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

function getFallbackEvals(): PerformanceEvaluation[] {
  return [
    {
      id: 1,
      task_id: 1,
      employee_id: 1,
      kpi_criteria_id: 1,
      score: 93.0,
      feedback_notes: "Kinerja sangat memuaskan, seluruh tugas terselesaikan dengan akurasi tinggi.",
      created_at: "2026-08-19",
      employee: { id: 1, user_id: 1, division_id: 1, nip: "19900101", name: "Sarah Jenkins", full_name: "Sarah Jenkins", position: "Finance Specialist" },
      task: { id: 1, title: "Q3 Financial Audit Report", created_by_manager_id: 1, assigned_employee_id: 1, status: "APPROVED" },
    },
    {
      id: 2,
      task_id: 2,
      employee_id: 2,
      kpi_criteria_id: 2,
      score: 90.7,
      feedback_notes: "Proaktif dan sigap dalam menangani kendala teknis infrastruktur.",
      created_at: "2026-08-19",
      employee: { id: 2, user_id: 2, division_id: 1, nip: "19900102", name: "Michael Ross", full_name: "Michael Ross", position: "IT Operations" },
      task: { id: 2, title: "Server Migration Phase 2", created_by_manager_id: 1, assigned_employee_id: 2, status: "PENDING" },
    },
    {
      id: 3,
      task_id: 3,
      employee_id: 3,
      kpi_criteria_id: 3,
      score: 86.8,
      feedback_notes: "Komunikasi tim berjalan baik, kepatuhan terhadap deadline sangat konsisten.",
      created_at: "2026-08-19",
      employee: { id: 3, user_id: 3, division_id: 2, nip: "19900103", name: "Natalie McDermott", full_name: "Natalie McDermott", position: "HR Specialist" },
      task: { id: 3, title: "Employee Onboarding Manual Update", created_by_manager_id: 1, assigned_employee_id: 3, status: "SUBMITTED" },
    },
  ];
}

function mergeEvals(serverEvals: PerformanceEvaluation[], localEvals: PerformanceEvaluation[]): PerformanceEvaluation[] {
  const map = new Map<number, PerformanceEvaluation>();
  localEvals.forEach((e) => map.set(e.id, e));
  serverEvals.forEach((e) => {
    if (!map.has(e.id)) map.set(e.id, e);
  });
  return Array.from(map.values());
}

export const evaluationService = {
  async getAll(): Promise<PerformanceEvaluation[]> {
    try {
      const response = await apiClient.get<ApiResponse<PerformanceEvaluation[]>>("/evaluations");
      const serverData = response.data.data || [];
      const localData = getLocalEvals();
      const combined = mergeEvals(serverData, localData);
      return combined.length > 0 ? combined : mergeEvals(getFallbackEvals(), localData);
    } catch {
      const localData = getLocalEvals();
      return mergeEvals(getFallbackEvals(), localData);
    }
  },

  async getMyEvaluation(): Promise<PerformanceEvaluation[]> {
    try {
      const response = await apiClient.get<ApiResponse<PerformanceEvaluation[]>>("/evaluations/me");
      return response.data.data;
    } catch {
      return this.getAll();
    }
  },

  async create(payload: Partial<PerformanceEvaluation>): Promise<PerformanceEvaluation> {
    try {
      const response = await apiClient.post<ApiResponse<PerformanceEvaluation>>("/evaluations", payload);
      const newEval = response.data.data;
      saveLocalEval(newEval);
      return newEval;
    } catch {
      const newId = Date.now();
      const newEval: PerformanceEvaluation = {
        id: newId,
        task_id: payload.task_id || 1,
        employee_id: payload.employee_id || 1,
        kpi_criteria_id: payload.kpi_criteria_id || 1,
        score: payload.score || 85.0,
        feedback_notes: payload.feedback_notes || "Penilaian kinerja berhasil dicatat.",
        created_at: new Date().toISOString().split("T")[0],
      };
      saveLocalEval(newEval);
      return newEval;
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/evaluations/${id}`);
    } catch {
      // ignore
    }
    if (typeof window !== "undefined") {
      const local = getLocalEvals().filter((e) => e.id !== id);
      localStorage.setItem(LOCAL_EVALS_KEY, JSON.stringify(local));
    }
  }
};
