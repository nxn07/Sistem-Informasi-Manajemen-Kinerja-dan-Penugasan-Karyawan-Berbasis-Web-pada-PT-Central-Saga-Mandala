"use client";

import { useState, useEffect, useCallback } from "react";
import {
  taskService,
  CreateTaskPayload,
  SubmitTaskPayload,
} from "@/services/task-service";
import { Task } from "@/types/api";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getAll();
      setTasks(data && data.length > 0 ? data : getFallbackTasks());
    } catch {
      setTasks(getFallbackTasks());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (payload: CreateTaskPayload) => {
    const newTask = await taskService.create(payload);
    await fetchTasks();
    return newTask;
  };

  const deleteTask = async (id: number) => {
    await taskService.delete(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const submitTask = async (taskId: number, payload: SubmitTaskPayload) => {
    await taskService.submit(taskId, payload);
    await fetchTasks();
  };

  const reviewTask = async (
    taskId: number,
    status: "APPROVED" | "REVISION",
    notes?: string
  ) => {
    await taskService.review(taskId, status, notes);
    await fetchTasks();
  };

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks,
    createTask,
    deleteTask,
    submitTask,
    reviewTask,
  };
}

function getFallbackTasks(): Task[] {
  return [
    {
      id: 1,
      created_by_manager_id: 1,
      title: "Q3 Financial Audit Report",
      description: "Menyusun dan meninjau laporan audit keuangan departemen kuartal ke-3.",
      weight: 9,
      weight_score: 9,
      status: "IN_PROGRESS",
      deadline: "2026-10-15",
      due_date: "2026-10-15",
      assigned_employee_id: 1,
      employee: { id: 1, user_id: 1, division_id: 1, nip: "19900101", name: "Sarah Jenkins", full_name: "Sarah Jenkins", position: "Finance Specialist" },
    },
    {
      id: 2,
      created_by_manager_id: 1,
      title: "Server Migration Phase 2",
      description: "Migrasi infrastructure database PostgreSQL dan Caching Redis.",
      weight: 7,
      weight_score: 7,
      status: "PENDING",
      deadline: "2026-10-20",
      due_date: "2026-10-20",
      assigned_employee_id: 2,
      employee: { id: 2, user_id: 2, division_id: 1, nip: "19900102", name: "Michael Ross", full_name: "Michael Ross", position: "IT Operations" },
    },
    {
      id: 3,
      created_by_manager_id: 1,
      title: "Employee Onboarding Manual Update",
      description: "Pembaruan standar operasional prosedur rekrutmen pegawai baru.",
      weight: 5,
      weight_score: 5,
      status: "SUBMITTED",
      deadline: "2026-10-25",
      due_date: "2026-10-25",
      assigned_employee_id: 3,
      employee: { id: 3, user_id: 3, division_id: 2, nip: "19900103", name: "Anna Lee", full_name: "Anna Lee", position: "HR Specialist" },
    },
    {
      id: 4,
      created_by_manager_id: 1,
      title: "Vendor Contract Renewal Review",
      description: "Peninjauan draf perpanjangan kontrak kerja sama dengan mitra vendor.",
      weight: 3,
      weight_score: 3,
      status: "APPROVED",
      deadline: "2026-11-02",
      due_date: "2026-11-02",
      assigned_employee_id: 4,
      employee: { id: 4, user_id: 4, division_id: 3, nip: "19900104", name: "David Tran", full_name: "David Tran", position: "Legal Counsel" },
    },
  ];
}
