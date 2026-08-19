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
      setTasks(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal memuat daftar tugas.");
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
