"use client";

import { useState, useMemo } from "react";
import { useTasks } from "@/hooks/useTasks";
import { Can } from "@/components/shared/Can";
import { formatDate } from "@/lib/utils";
import { CreateTaskModal } from "@/components/tasks/CreateTaskModal";
import { SubmitTaskModal } from "@/components/tasks/SubmitTaskModal";
import { ReviewTaskModal } from "@/components/tasks/ReviewTaskModal";
import { TaskGridSkeleton } from "@/components/tasks/TaskCardSkeleton";
import { Toast } from "@/components/ui/Toast";
import {
  Loader2,
  Plus,
  Calendar,
  AlertCircle,
  UploadCloud,
  CheckSquare,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  FileCheck,
  Briefcase,
  User as UserIcon,
  LayoutGrid,
  Table,
  AlertOctagon,
} from "lucide-react";
import { Task } from "@/types/api";

export default function TasksPage() {
  const { tasks, loading, error, createTask, submitTask, reviewTask, deleteTask } =
    useTasks();

  // View Mode: 'table' (Presisi Screenshot) or 'grid'
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // Toast Notification States
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string | null;
  }>({
    type: "success",
    message: null,
  });

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [submitTaskTarget, setSubmitTaskTarget] = useState<{
    id: number;
    title: string;
  } | null>(null);

  const [reviewTaskTarget, setReviewTaskTarget] = useState<{
    id: number;
    title: string;
  } | null>(null);

  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Computed Analytics Stats
  const stats = useMemo(() => {
    return {
      totalPending: tasks.filter(
        (t) => t.status === "PENDING"
      ).length,
      inProgress: tasks.filter(
        (t) => t.status === "IN_PROGRESS"
      ).length,
      awaitingApproval: tasks.filter(
        (t) => t.status === "SUBMITTED" || t.status === "REVISION"
      ).length,
      completed: tasks.filter(
        (t) => t.status === "APPROVED" || t.status === "COMPLETED"
      ).length,
    };
  }, [tasks]);

  // Computed Filtered Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.employee?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.employee?.full_name?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === "ALL" || task.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchQuery, selectedStatus]);

  const getStatusBadge = (status: Task["status"]) => {
    const colors: Record<Task["status"], string> = {
      PENDING: "bg-slate-100 text-slate-700 border-slate-300",
      IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
      SUBMITTED: "bg-purple-50 text-purple-700 border-purple-200",
      APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
      REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
      COMPLETED: "bg-teal-50 text-teal-700 border-teal-200",
      REVISION: "bg-orange-50 text-orange-700 border-orange-200",
    };

    return (
      <span
        className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border shadow-2xs ${
          colors[status] || "bg-slate-100 text-slate-800 border-slate-200"
        }`}
      >
        {status}
      </span>
    );
  };

  const getPriorityBadge = (weight: number = 5) => {
    if (weight >= 8) {
      return (
        <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-rose-100 text-rose-800 border border-rose-200 inline-flex items-center gap-1">
          <AlertOctagon className="w-3 h-3" /> ! Urgent
        </span>
      );
    } else if (weight >= 6) {
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
          ^ High
        </span>
      );
    } else if (weight >= 4) {
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
          - Medium
        </span>
      );
    } else {
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
          v Low
        </span>
      );
    }
  };

  const handleCreateTask = async (payload: any) => {
    try {
      await createTask(payload);
      setToast({
        type: "success",
        message: "Tugas Baru Berhasil Ditugaskan oleh Admin!",
      });
    } catch (err: any) {
      setToast({
        type: "error",
        message: err.response?.data?.message || "Gagal membuat tugas.",
      });
      throw err;
    }
  };

  const handleSubmitTaskAction = async (taskId: number, payload: any) => {
    try {
      await submitTask(taskId, payload);
      setToast({
        type: "success",
        message: "Bukti Kerja Berhasil Dikumpulkan!",
      });
    } catch (err: any) {
      setToast({
        type: "error",
        message: err.response?.data?.message || "Gagal mengumpulkan bukti kerja.",
      });
      throw err;
    }
  };

  const handleReviewTaskAction = async (
    taskId: number,
    status: "APPROVED" | "REVISION",
    notes?: string
  ) => {
    try {
      await reviewTask(taskId, status, notes);
      setToast({
        type: "success",
        message: `Tugas Berhasil ${
          status === "APPROVED" ? "Disetujui (Approved)" : "Diminta Revisi"
        }!`,
      });
    } catch (err: any) {
      setToast({
        type: "error",
        message: err.response?.data?.message || "Gagal mereview tugas.",
      });
      throw err;
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus tugas ini?")) {
      try {
        setDeletingId(id);
        await deleteTask(id);
        setToast({
          type: "success",
          message: "Tugas Berhasil Dihapus oleh Admin!",
        });
      } catch (err: any) {
        setToast({
          type: "error",
          message: err.response?.data?.message || "Gagal menghapus tugas.",
        });
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification Popup */}
      <Toast
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, message: null })}
      />

      {/* Top Bar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Task Management
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Monitor and assign departmental objectives.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="p-1 bg-slate-200/80 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === "table"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Tampilan Tabel (Presisi Screenshot)"
            >
              <Table className="w-4 h-4" />
              <span className="hidden sm:inline">Tabel</span>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === "grid"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Tampilan Kartu (Grid)"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Kartu</span>
            </button>
          </div>

          {/* Tombol Tambah Tugas (Admin / Manager Only) */}
          <Can role={["ADMIN", "MANAGER"]}>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-900 hover:bg-blue-950 active:scale-98 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Assign New Task</span>
            </button>
          </Can>
        </div>
      </div>

      {/* Admin Summary Metric Stat Cards (4 Cards Grid - Match Screenshot) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold mb-1">Total Pending</p>
            <p className="text-2xl font-bold text-slate-900">{stats.totalPending}</p>
          </div>
          <div className="p-2.5 bg-slate-100 text-slate-600 rounded-xl">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold mb-1">In Progress</p>
            <p className="text-2xl font-bold text-slate-900">{stats.inProgress}</p>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold mb-1">Awaiting Approval</p>
            <p className="text-2xl font-bold text-slate-900">{stats.awaitingApproval}</p>
          </div>
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
            <FileCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold mb-1">Approved & Done</p>
            <p className="text-2xl font-bold text-slate-900">{stats.completed}</p>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-3 bg-white border border-slate-200/80 rounded-2xl shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks or employee name..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white font-medium text-slate-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="APPROVED">Approved</option>
              <option value="REVISION">Revision</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
          <span className="text-xs font-medium text-slate-400">
            Showing {filteredTasks.length} tasks
          </span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <TaskGridSkeleton count={6} />
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200/80 rounded-2xl shadow-2xs">
          <p className="text-slate-500 text-sm font-medium">
            Tidak ada data tugas yang tersedia.
          </p>
        </div>
      ) : viewMode === "table" ? (
        /* TABLE VIEW (Presisi Sesuai Screenshot User) */
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filteredTasks.map((task, index) => (
                  <tr key={task.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4 text-center text-slate-400 font-bold">
                      {String(index + 1).padStart(2, "0")}
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold text-slate-900">{task.title}</p>
                      <p className="text-[11px] text-slate-400 truncate max-w-xs">
                        {task.description || "No description provided."}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                          {(
                            task.employee?.full_name ||
                            task.employee?.name ||
                            "Emp"
                          )
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-800">
                          {task.employee?.full_name ||
                            task.employee?.name ||
                            (task.assigned_employee_id
                              ? `Emp #${task.assigned_employee_id}`
                              : "Pegawai")}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {formatDate(task.deadline ?? task.due_date)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {getPriorityBadge(task.weight ?? task.weight_score ?? 5)}
                    </td>
                    <td className="py-4 px-4">{getStatusBadge(task.status)}</td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* Tombol Kumpulkan (Pegawai Only) */}
                        <Can role={["EMPLOYEE"]}>
                          {task.status !== "APPROVED" &&
                            task.status !== "COMPLETED" && (
                              <button
                                onClick={() =>
                                  setSubmitTaskTarget({
                                    id: task.id,
                                    title: task.title,
                                  })
                                }
                                className="px-2.5 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer"
                              >
                                Kumpulkan
                              </button>
                            )}
                        </Can>

                        {/* Tombol Review (Admin / Manager Only) */}
                        <Can role={["ADMIN", "MANAGER"]}>
                          {(task.status === "SUBMITTED" ||
                            task.status === "IN_PROGRESS") && (
                            <button
                              onClick={() =>
                                setReviewTaskTarget({
                                  id: task.id,
                                  title: task.title,
                                })
                              }
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer"
                            >
                              Review
                            </button>
                          )}
                        </Can>

                        {/* Tombol Hapus (Admin / Manager Only) */}
                        <Can role={["ADMIN", "MANAGER"]}>
                          <button
                            onClick={() => handleDelete(task.id)}
                            disabled={deletingId === task.id}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                            title="Delete Task"
                          >
                            {deletingId === task.id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </Can>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  {getStatusBadge(task.status)}
                  {getPriorityBadge(task.weight ?? task.weight_score ?? 5)}
                </div>
                <h3 className="font-bold text-slate-900 mb-1.5 text-base line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {task.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                  {task.description || "No description provided."}
                </p>
              </div>

              <div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="flex items-center gap-1 text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {formatDate(task.deadline ?? task.due_date)}
                  </span>
                  <span className="flex items-center gap-1 font-medium text-slate-700 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                    <UserIcon className="w-3 h-3 text-slate-400" />
                    {task.employee?.full_name ||
                      task.employee?.name ||
                      (task.assigned_employee_id
                        ? `Emp #${task.assigned_employee_id}`
                        : "Pegawai")}
                  </span>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100/60">
                  <Can role={["EMPLOYEE"]}>
                    {task.status !== "APPROVED" && task.status !== "COMPLETED" && (
                      <button
                        onClick={() =>
                          setSubmitTaskTarget({ id: task.id, title: task.title })
                        }
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-2xs"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Kumpulkan</span>
                      </button>
                    )}
                  </Can>

                  <Can role={["ADMIN", "MANAGER"]}>
                    {(task.status === "SUBMITTED" || task.status === "IN_PROGRESS") && (
                      <button
                        onClick={() =>
                          setReviewTaskTarget({ id: task.id, title: task.title })
                        }
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-2xs"
                      >
                        <CheckSquare className="w-3.5 h-3.5" />
                        <span>Review</span>
                      </button>
                    )}
                  </Can>

                  <Can role={["ADMIN", "MANAGER"]}>
                    <button
                      onClick={() => handleDelete(task.id)}
                      disabled={deletingId === task.id}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                      title="Delete Task"
                    >
                      {deletingId === task.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </Can>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateTaskModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateTask}
      />

      <SubmitTaskModal
        isOpen={!!submitTaskTarget}
        onClose={() => setSubmitTaskTarget(null)}
        taskId={submitTaskTarget?.id ?? null}
        taskTitle={submitTaskTarget?.title}
        onSubmit={handleSubmitTaskAction}
      />

      <ReviewTaskModal
        isOpen={!!reviewTaskTarget}
        onClose={() => setReviewTaskTarget(null)}
        taskId={reviewTaskTarget?.id ?? null}
        taskTitle={reviewTaskTarget?.title}
        onSubmit={handleReviewTaskAction}
      />
    </div>
  );
}
