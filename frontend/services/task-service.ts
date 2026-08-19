import apiClient from "@/lib/api-client";
import { ApiResponse, Task, TaskSubmission } from "@/types/api";

export interface CreateTaskPayload {
  title: string;
  description?: string;
  weight?: number;
  assigned_employee_id: number;
  division_id?: number;
  deadline?: string;
}

export interface SubmitTaskPayload {
  file?: File;
  submission_link?: string;
  notes?: string;
  employee_id?: number;
}

export const taskService = {
  async getAll(): Promise<Task[]> {
    const response = await apiClient.get<ApiResponse<Task[]>>("/tasks");
    return response.data.data;
  },

  async getById(id: number): Promise<Task> {
    const response = await apiClient.get<ApiResponse<Task>>(`/tasks/${id}`);
    return response.data.data;
  },

  async create(payload: CreateTaskPayload): Promise<Task> {
    const response = await apiClient.post<ApiResponse<Task>>("/tasks", payload);
    return response.data.data;
  },

  async update(id: number, payload: Partial<CreateTaskPayload>): Promise<Task> {
    const response = await apiClient.put<ApiResponse<Task>>(`/tasks/${id}`, payload);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  },

  async submit(taskId: number, payload: SubmitTaskPayload): Promise<TaskSubmission> {
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
  },

  async review(taskId: number, status: "APPROVED" | "REVISION", reviewNotes?: string): Promise<boolean> {
    const response = await apiClient.post<ApiResponse<any>>(`/tasks/${taskId}/review`, {
      status,
      review_notes: reviewNotes,
    });
    return response.data.success;
  }
};
