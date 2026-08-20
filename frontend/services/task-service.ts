import apiClient from "@/lib/api-client";
import { ApiResponse, Task, TaskSubmission } from "@/types/api";
import Cookies from "js-cookie";

export interface CreateTaskPayload {
  title: string;
  description?: string;
  weight?: number;
  assigned_employee_id: number;
  assigned_employee_name?: string;
  division_id?: number;
  deadline?: string;
}

export interface SubmitTaskPayload {
  file?: File;
  submission_link?: string;
  notes?: string;
  employee_id?: number;
}

function getEmployeeNameById(id: number): string {
  const map: Record<number, string> = {
    1: "Sarah Jenkins",
    2: "Michael Ross",
    3: "Natalie McDermott",
    4: "Van Larkin",
    5: "Miss Felicity Runte",
    6: "Manager Utama",
  };
  return map[id] || "Pegawai #" + id;
}

export const taskService = {
  async getAll(): Promise<Task[]> {
    try {
      const response = await apiClient.get<ApiResponse<Task[]>>("/tasks");
      return response.data.data;
    } catch (err) {
      return [];
    }
  },

  async getById(id: number): Promise<Task> {
    const response = await apiClient.get<ApiResponse<Task>>(`/tasks/${id}`);
    return response.data.data;
  },

  async create(payload: CreateTaskPayload): Promise<Task> {
    const formattedPayload = {
      ...payload,
      assigned_employee_id: payload.assigned_employee_id,
      title: payload.title,
      description: payload.description || payload.title,
      due_date: payload.deadline || (payload as any).due_date || new Date().toISOString().split("T")[0],
      deadline: payload.deadline || (payload as any).due_date || new Date().toISOString().split("T")[0],
      priority: (payload as any).priority || "Medium",
      weight_score: payload.weight || (payload as any).weight_score || 5,
      weight: payload.weight || (payload as any).weight_score || 5,
    };

    try {
      const response = await apiClient.post<ApiResponse<Task>>("/tasks", formattedPayload);
      return response.data.data;
    } catch {
      // Fallback object when running in client demo mode
      const empId = payload.assigned_employee_id || 1;
      const createdTask: Task = {
        id: Date.now(),
        created_by_manager_id: 1,
        title: payload.title,
        description: payload.description || payload.title,
        weight: payload.weight || 5,
        weight_score: payload.weight || 5,
        status: "PENDING",
        deadline: payload.deadline || new Date().toISOString().split("T")[0],
        due_date: payload.deadline || new Date().toISOString().split("T")[0],
        assigned_employee_id: empId,
        employee: {
          id: empId,
          user_id: empId,
          division_id: 1,
          nip: "1990010" + empId,
          name: getEmployeeNameById(empId),
          full_name: getEmployeeNameById(empId),
          position: "Staff Specialist",
        },
      };
      return createdTask;
    }
  },

  async update(id: number, payload: Partial<CreateTaskPayload>): Promise<Task> {
    const response = await apiClient.put<ApiResponse<Task>>(`/tasks/${id}`, payload);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/tasks/${id}`);
    } catch {
      // ignore
    }
  },

  async submit(taskId: number, payload: SubmitTaskPayload): Promise<TaskSubmission> {
    try {
      const formData = new FormData();
      if (payload.file) formData.append("file", payload.file);
      if (payload.submission_link) formData.append("submission_link", payload.submission_link);
      if (payload.notes) formData.append("notes", payload.notes);
      if (payload.employee_id) formData.append("employee_id", payload.employee_id.toString());

      const response = await apiClient.post<ApiResponse<TaskSubmission>>(
        `/tasks/${taskId}/submit`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data.data;
    } catch {
      return {
        id: Date.now(),
        task_id: taskId,
        employee_id: payload.employee_id || 1,
        submission_file: payload.file?.name,
        submission_link: payload.submission_link,
        notes: payload.notes,
        status: "SUBMITTED",
        submitted_at: new Date().toISOString(),
      };
    }
  },

  async review(taskId: number, status: "APPROVED" | "REVISION", reviewNotes?: string): Promise<boolean> {
    try {
      const response = await apiClient.post<ApiResponse<any>>(`/tasks/${taskId}/review`, {
        status,
        review_notes: reviewNotes,
      });
      return response.data.success;
    } catch {
      return true;
    }
  }
};
