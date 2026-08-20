"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { CreateTaskModal } from "@/components/tasks/CreateTaskModal";
import { SubmitTaskModal } from "@/components/tasks/SubmitTaskModal";
import { ReviewTaskModal } from "@/components/tasks/ReviewTaskModal";
import { TaskDetailModal } from "@/components/tasks/TaskDetailModal";
import { Toast } from "@/components/ui/Toast";
import { useTasks, getDocTypeLabel } from "@/hooks/useTasks";
import {
  Calendar,
  CheckSquare,
  Clock,
  Filter,
  LayoutGrid,
  Loader2,
  Plus,
  Search,
  Table,
  Trash2,
  UploadCloud,
  User as UserIcon,
  PlayCircle,
  FileCheck,
  RotateCcw,
  UserCheck,
  Eye,
} from "lucide-react";
import { Task } from "@/types/api";

export default function TasksPage() {
  const { user } = useAuth();
  const rawRole = (user?.role || user?.roles?.[0] || "ADMIN").toUpperCase();
  const isEmployee = rawRole === "EMPLOYEE";
  const isAdminOrManager = !isEmployee;

  // Custom Spatie RBAC Permission Check
  const userPermissions = user?.permissions || [];
  const canCreateTask =
    isAdminOrManager ||
    userPermissions.includes("tasks.create") ||
    userPermissions.includes("tasks.*") ||
    userPermissions.includes("*");

  const canReviewTask =
    isAdminOrManager ||
    userPermissions.includes("tasks.review") ||
    userPermissions.includes("tasks.*") ||
    userPermissions.includes("*");

  const {
    tasks,
    loading,
    error,
    createTask,
    updateTaskStatus,
    submitTask,
    reviewTask,
    deleteTask,
  } = useTasks();

  // View Mode: 'table' or 'grid'
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [employeeFilter, setEmployeeFilter] = useState<"MY_TASKS" | "ALL_TASKS">("ALL_TASKS");

  // Toast Notification States
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string | null;
  }>({
    type: "success",
    message: null,
  });

  // Modal control states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [submitTaskTarget, setSubmitTaskTarget] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const [reviewTaskTarget, setReviewTaskTarget] = useState<Task | null>(null);
  const [selectedDetailTask, setSelectedDetailTask] = useState<Task | null>(null);

  // Loading state for single delete action
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Calculate Metrics from tasks array
  const metrics = useMemo(() => {
    return {
      pending: tasks.filter((t) => t.status === "PENDING").length,
      inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
      awaitingApproval: tasks.filter((t) => t.status === "SUBMITTED").length,
      approved: tasks.filter(
        (t) => t.status === "APPROVED" || t.status === "COMPLETED"
      ).length,
    };
  }, [tasks]);

  // Computed Filtered Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const empName = task.employee?.full_name || task.employee?.name || "";
      const loggedUserName = user?.name || "Sarah Jenkins";
      
      const isAssignedToMe =
        empName.toLowerCase().includes(loggedUserName.toLowerCase()) ||
        loggedUserName.toLowerCase().includes(empName.toLowerCase());

      const matchesEmployeeFilter =
        !isEmployee ||
        employeeFilter === "ALL_TASKS" ||
        (employeeFilter === "MY_TASKS" && isAssignedToMe);

      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        empName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === "ALL" || task.status === selectedStatus;

      return matchesEmployeeFilter && matchesSearch && matchesStatus;
    });
  }, [tasks, searchQuery, selectedStatus, isEmployee, employeeFilter, user]);

  // Helper Badge Renderers with Clean Subtle Borders
  const getStatusBadge = (status: Task["status"]): React.ReactNode => {
    const badges: Record<string, React.ReactNode> = {
      PENDING: (
        <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
          PENDING
        </span>
      ),
      IN_PROGRESS: (
        <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          IN_PROGRESS
        </span>
      ),
      SUBMITTED: (
        <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-purple-50 text-purple-700 border border-purple-200">
          SUBMITTED
        </span>
      ),
      APPROVED: (
        <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          APPROVED
        </span>
      ),
      COMPLETED: (
        <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          COMPLETED
        </span>
      ),
      REJECTED: (
        <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-rose-50 text-rose-700 border border-rose-200">
          REJECTED
        </span>
      ),
      REVISION: (
        <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
          REVISION
        </span>
      ),
    };
    return (
      badges[status] || (
        <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
          {status}
        </span>
      )
    );
  };

  const getPriorityBadge = (weight: number) => {
    if (weight >= 8) {
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-50 text-rose-700 border border-rose-200">
          ! Urgent
        </span>
      );
    } else if (weight >= 6) {
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
          ^ High
        </span>
      );
    } else if (weight >= 4) {
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          - Medium
        </span>
      );
    } else {
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-600 border border-slate-200">
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
        message: "Tugas Baru Berhasil Ditugaskan!",
      });
    } catch (err: any) {
      setToast({
        type: "error",
        message: err.response?.data?.message || "Gagal membuat tugas.",
      });
      throw err;
    }
  };

  const handleQuickStatusChange = async (
    taskId: number,
    newStatus: Task["status"]
  ) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      setToast({
        type: "success",
        message: `Status tugas berhasil diperbarui menjadi '${newStatus}'!`,
      });
    } catch {
      setToast({
        type: "error",
        message: "Gagal memperbarui status tugas.",
      });
    }
  };

  const handleSubmitTaskAction = async (taskId: number, payload: any) => {
    try {
      await submitTask(taskId, payload);
      const docTypeDetected = getDocTypeLabel(payload.file?.name || payload.submission_link);
      setToast({
        type: "success",
        message: `Bukti Kerja '${payload.file?.name || "Dokumen"}' (${docTypeDetected}) Berhasil Perbaiki & Dikumpulkan Ulang! Terakhir Diubah: ${new Date().toLocaleString("id-ID")}`,
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
        message: `Hasil Review Berhasil Disimpan (${
          status === "APPROVED" ? "Disetujui / Approved" : "Diminta Revisi"
        })! Terakhir Diubah: ${new Date().toLocaleString("id-ID")}`,
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
          message: "Tugas berhasil dihapus.",
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

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
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

      {/* Page Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Task Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor and assign departmental objectives.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle Button */}
          <div className="flex items-center p-1 bg-slate-100/80 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === "table"
                  ? "bg-white text-slate-900 shadow-2xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Tampilan Tabel Bergaris Column (Presisi Grid)"
            >
              <Table className="w-4 h-4" />
              <span className="hidden sm:inline">Tabel Grid</span>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === "grid"
                  ? "bg-white text-slate-900 shadow-2xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Tampilan Kartu (Grid)"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Kartu</span>
            </button>
          </div>

          {/* Tombol Tambah Tugas */}
          {canCreateTask && (
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-900 hover:bg-blue-950 active:scale-98 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ Assign New Task</span>
            </button>
          )}
        </div>
      </div>

      {/* Employee Task Scope Selector */}
      {isEmployee && (
        <div className="p-3 bg-blue-50/80 border border-blue-200/80 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-2xs">
          <span className="text-blue-900 font-bold flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-blue-600" />
            Filter Tampilan Tugas Karyawan ({user?.name || "Sarah Jenkins"}):
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEmployeeFilter("ALL_TASKS")}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                employeeFilter === "ALL_TASKS"
                  ? "bg-blue-900 text-white border-blue-900 shadow-xs"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              👥 Semua Tugas Tim
            </button>
            <button
              onClick={() => setEmployeeFilter("MY_TASKS")}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                employeeFilter === "MY_TASKS"
                  ? "bg-blue-900 text-white border-blue-900 shadow-xs"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              👤 Tugas Saya Saja
            </button>
          </div>
        </div>
      )}

      {/* Metrics Banner (Clean Subtle Border) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Pending</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
              {metrics.pending}
            </h3>
          </div>
          <div className="p-2.5 bg-slate-50 text-slate-600 rounded-xl border border-slate-200">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white border border-blue-200/80 rounded-2xl shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-blue-900">In Progress</p>
            <h3 className="text-2xl font-extrabold text-blue-950 mt-1">
              {metrics.inProgress}
            </h3>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-200">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white border border-purple-200/80 rounded-2xl shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-purple-900">Awaiting Approval</p>
            <h3 className="text-2xl font-extrabold text-purple-950 mt-1">
              {metrics.awaitingApproval}
            </h3>
          </div>
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl border border-purple-200">
            <CheckSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white border border-emerald-200/80 rounded-2xl shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-900">Approved & Done</p>
            <h3 className="text-2xl font-extrabold text-emerald-950 mt-1">
              {metrics.approved}
            </h3>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200">
            <CheckSquare className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Toolbar Search & Status Filter */}
      <div className="p-3 bg-white border border-slate-200/80 rounded-2xl shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
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
              className="px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white text-slate-700 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="SUBMITTED">SUBMITTED</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REVISION">REVISION</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            Showing {filteredTasks.length} tasks
          </span>
        </div>
      </div>

      {/* Error state alert */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
          {error}
        </div>
      )}

      {/* Content Rendering: Loading vs Table vs Grid */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center space-y-3 bg-white border border-slate-200/80 rounded-2xl">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-xs font-semibold text-slate-500">
            Memuat data tugas...
          </p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="py-16 text-center bg-white border border-slate-200/80 rounded-2xl space-y-2">
          <Clock className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">Tidak ada tugas ditemukan</h3>
          <p className="text-xs text-slate-400">
            Coba ubah kata kunci pencarian atau filter status.
          </p>
        </div>
      ) : viewMode === "table" ? (
        /* SLEEK MODERN TABLE VIEW (WITH SUBTLE ELEGANT COLUMN LINES & SOFT STRIPING) */
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-12 border-r border-slate-200/60 text-center">#</th>
                  <th className="py-3.5 px-4 min-w-[220px] border-r border-slate-200/60">TITLE & DESKRIPSI</th>
                  <th className="py-3.5 px-4 min-w-[160px] border-r border-slate-200/60">EMPLOYEE</th>
                  <th className="py-3.5 px-4 min-w-[120px] border-r border-slate-200/60">DUE DATE</th>
                  <th className="py-3.5 px-4 min-w-[110px] border-r border-slate-200/60">PRIORITY</th>
                  <th className="py-3.5 px-4 min-w-[170px] border-r border-slate-200/60">STATUS & WAKTU DIUBAH</th>
                  <th className="py-3.5 px-4 text-center min-w-[200px]">ACTIONS & BERKAS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filteredTasks.map((task, idx) => {
                  const docLabel = task.doc_type || getDocTypeLabel(task.submission_file || task.submission_link);
                  const lastModified = task.submitted_at || task.updated_at || "20 Ags 2026, 09:30 WIB";
                  const empName = task.employee?.full_name || task.employee?.name || "";
                  const loggedUserName = user?.name || "Sarah Jenkins";
                  
                  const isTaskAssignedToMe =
                    empName.toLowerCase().includes(loggedUserName.toLowerCase()) ||
                    loggedUserName.toLowerCase().includes(empName.toLowerCase());

                  return (
                    <tr
                      key={task.id}
                      className="even:bg-slate-50/50 hover:bg-slate-50/90 transition-colors duration-150"
                    >
                      <td className="py-4 px-4 text-slate-400 font-bold border-r border-slate-100 text-center">
                        {String(idx + 1).padStart(2, "0")}
                      </td>
                      
                      {/* Title & Deskripsi */}
                      <td className="py-4 px-4 border-r border-slate-100">
                        <button
                          onClick={() => setSelectedDetailTask(task)}
                          className="font-bold text-slate-900 hover:text-blue-600 text-left line-clamp-1 transition-colors cursor-pointer group flex items-center gap-1.5"
                        >
                          <span>{task.title}</span>
                          <Eye className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                        </button>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {task.description || "Tidak ada deskripsi tambahan."}
                        </p>
                      </td>

                      {/* Employee Column */}
                      <td className="py-4 px-4 border-r border-slate-100">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                            {empName.slice(0, 2).toUpperCase() || "PE"}
                          </div>
                          <span className="font-semibold text-slate-800 line-clamp-1">
                            {empName || `Emp #${task.assigned_employee_id}`}
                          </span>
                        </div>
                      </td>

                      {/* Due Date Column */}
                      <td className="py-4 px-4 border-r border-slate-100 text-slate-500">
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {formatDate(task.deadline ?? task.due_date)}
                        </span>
                      </td>

                      {/* Priority Column */}
                      <td className="py-4 px-4 border-r border-slate-100">
                        {getPriorityBadge(task.weight ?? task.weight_score ?? 5)}
                      </td>
                      
                      {/* STATUS + TERAKHIR DIUBAH + JENIS DOKUMEN */}
                      <td className="py-4 px-4 border-r border-slate-100">
                        <div className="space-y-1">
                          <div>{getStatusBadge(task.status)}</div>
                          <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>Diubah: {lastModified}</span>
                          </div>
                          {(task.submission_file || task.submission_link || task.status === "SUBMITTED") && (
                            <button
                              onClick={() => setSelectedDetailTask(task)}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9.5px] font-extrabold rounded bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 border border-blue-200 transition-all cursor-pointer shadow-2xs"
                              title="Klik untuk melihat berkas"
                            >
                              <FileCheck className="w-3 h-3" />
                              {docLabel}
                            </button>
                          )}
                        </div>
                      </td>

                      {/* ACTIONS COLUMN */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex flex-col items-center justify-center gap-1.5">
                          {/* Pegawai View Actions */}
                          {isEmployee && (
                            <div className="flex flex-col items-center gap-1">
                              <div className="flex items-center gap-1">
                                {isTaskAssignedToMe && (
                                  <>
                                    {task.status === "PENDING" && (
                                      <button
                                        onClick={() => handleQuickStatusChange(task.id, "IN_PROGRESS")}
                                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 text-[11px] font-bold rounded-lg transition-all cursor-pointer inline-flex items-center gap-1 shadow-2xs border border-blue-200"
                                      >
                                        <PlayCircle className="w-3.5 h-3.5" />
                                        <span>Mulai Kerja</span>
                                      </button>
                                    )}
                                    {task.status === "IN_PROGRESS" && (
                                      <button
                                        onClick={() =>
                                          setSubmitTaskTarget({
                                            id: task.id,
                                            title: task.title,
                                          })
                                        }
                                        className="px-2.5 py-1 bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-700 text-[11px] font-bold rounded-lg transition-all cursor-pointer inline-flex items-center gap-1 shadow-2xs border border-purple-200"
                                      >
                                        <UploadCloud className="w-3.5 h-3.5" />
                                        <span>Kumpulkan</span>
                                      </button>
                                    )}
                                    {(task.status === "REVISION" || task.status === "REJECTED") && (
                                      <button
                                        onClick={() =>
                                          setSubmitTaskTarget({
                                            id: task.id,
                                            title: task.title,
                                          })
                                        }
                                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-800 text-[11px] font-bold rounded-lg transition-all cursor-pointer inline-flex items-center gap-1 shadow-2xs border border-amber-200"
                                      >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                        <span>Perbaiki & Ajukan</span>
                                      </button>
                                    )}
                                  </>
                                )}

                                {/* Detail Button */}
                                <button
                                  onClick={() => setSelectedDetailTask(task)}
                                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1 border border-slate-200"
                                  title="Lihat Detail & Berkas Project"
                                >
                                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                                  <span>Detail</span>
                                </button>

                                {canReviewTask && (
                                  <button
                                    onClick={() => setReviewTaskTarget(task)}
                                    className="px-2 py-1 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 text-[11px] font-bold rounded-lg transition-colors border border-emerald-200 cursor-pointer"
                                  >
                                    Review
                                  </button>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Admin & Manager View Actions */}
                          {isAdminOrManager && (
                            <div className="flex flex-col items-center gap-1">
                              <div className="flex items-center gap-1.5">
                                {(task.status === "SUBMITTED" || task.status === "IN_PROGRESS" || task.submission_file) ? (
                                  <button
                                    onClick={() => setReviewTaskTarget(task)}
                                    className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 text-[11px] font-bold rounded-lg transition-all cursor-pointer shadow-2xs border border-emerald-200 flex items-center gap-1"
                                  >
                                    <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Review & Berkas</span>
                                  </button>
                                ) : (
                                  <select
                                    value={task.status}
                                    onChange={(e) =>
                                      handleQuickStatusChange(task.id, e.target.value as Task["status"])
                                    }
                                    className="px-2 py-1 text-[11px] font-semibold border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                                    title="Ubah Status Langsung"
                                  >
                                    <option value="PENDING">PENDING</option>
                                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                                    <option value="SUBMITTED">SUBMITTED</option>
                                    <option value="APPROVED">APPROVED</option>
                                    <option value="REVISION">REVISION</option>
                                    <option value="REJECTED">REJECTED</option>
                                  </select>
                                )}

                                <button
                                  onClick={() => setSelectedDetailTask(task)}
                                  className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-blue-200"
                                  title="Lihat Detail & Berkas Project"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => handleDelete(task.id)}
                                  disabled={deletingId === task.id}
                                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50 cursor-pointer border border-transparent hover:border-rose-200"
                                  title="Delete Task"
                                >
                                  {deletingId === task.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </button>
                              </div>

                              {/* Upload Detail Snippet */}
                              {(task.submission_file || task.submission_link) && (
                                <button
                                  onClick={() => setSelectedDetailTask(task)}
                                  className="text-[9.5px] text-blue-700 hover:underline font-semibold bg-blue-50/80 px-2 py-0.5 rounded border border-blue-200 max-w-[170px] truncate cursor-pointer text-left shadow-2xs"
                                  title={`${task.submission_file || task.submission_link} (${lastModified}) - Klik untuk buka`}
                                >
                                  📄 {task.submission_file || "Link Drive"}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID VIEW (KARTU SLEEK ELEGANT BORDER-1) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => {
            const docLabel = task.doc_type || getDocTypeLabel(task.submission_file || task.submission_link);
            const lastModified = task.submitted_at || task.updated_at || "20 Ags 2026, 09:30 WIB";
            const empName = task.employee?.full_name || task.employee?.name || "";
            const loggedUserName = user?.name || "Sarah Jenkins";
            
            const isTaskAssignedToMe =
              empName.toLowerCase().includes(loggedUserName.toLowerCase()) ||
              loggedUserName.toLowerCase().includes(empName.toLowerCase());

            return (
              <div
                key={task.id}
                className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-2xs hover:shadow-md hover:border-blue-400 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    {getStatusBadge(task.status)}
                    {getPriorityBadge(task.weight ?? task.weight_score ?? 5)}
                  </div>
                  
                  {/* Last Modified & Doc Type Header Badge */}
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-3 pt-1 border-t border-slate-100">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {lastModified}
                    </span>
                    {(task.submission_file || task.submission_link || task.status === "SUBMITTED") && (
                      <button
                        onClick={() => setSelectedDetailTask(task)}
                        className="px-1.5 py-0.5 text-[9px] font-extrabold rounded bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 border border-blue-200 transition-colors cursor-pointer"
                      >
                        📄 {docLabel}
                      </button>
                    )}
                  </div>

                  <h3
                    onClick={() => setSelectedDetailTask(task)}
                    className="font-extrabold text-slate-900 mb-1.5 text-base line-clamp-1 group-hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    {task.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                    {task.description || "No description provided."}
                  </p>
                </div>

                <div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span className="flex items-center gap-1 text-slate-500 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {formatDate(task.deadline ?? task.due_date)}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-800 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
                      <UserIcon className="w-3 h-3 text-slate-400" />
                      {empName || `Emp #${task.assigned_employee_id}`}
                    </span>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    {isEmployee && (
                      <>
                        <div className="flex items-center gap-1.5 w-full">
                          {isTaskAssignedToMe && (
                            <>
                              {task.status === "PENDING" && (
                                <button
                                  onClick={() => handleQuickStatusChange(task.id, "IN_PROGRESS")}
                                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-2xs border border-blue-200"
                                >
                                  <PlayCircle className="w-3.5 h-3.5" />
                                  <span>Mulai Kerja</span>
                                </button>
                              )}
                              {task.status === "IN_PROGRESS" && (
                                <button
                                  onClick={() =>
                                    setSubmitTaskTarget({ id: task.id, title: task.title })
                                  }
                                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-700 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-2xs border border-purple-200"
                                >
                                  <UploadCloud className="w-3.5 h-3.5" />
                                  <span>Kumpulkan Bukti</span>
                                </button>
                              )}
                              {(task.status === "REVISION" || task.status === "REJECTED") && (
                                <button
                                  onClick={() =>
                                    setSubmitTaskTarget({ id: task.id, title: task.title })
                                  }
                                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-800 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-2xs border border-amber-200"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  <span>Perbaiki & Ajukan</span>
                                </button>
                              )}
                            </>
                          )}

                          <button
                            onClick={() => setSelectedDetailTask(task)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1 border border-slate-200"
                            title="Lihat Detail & Berkas"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-600" />
                            <span>Detail</span>
                          </button>
                        </div>
                      </>
                    )}

                    {isAdminOrManager && (
                      <>
                        {(task.status === "SUBMITTED" || task.status === "IN_PROGRESS" || task.submission_file) ? (
                          <button
                            onClick={() => setReviewTaskTarget(task)}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-2xs border border-emerald-200"
                          >
                            <CheckSquare className="w-3.5 h-3.5" />
                            <span>Review & Berkas</span>
                          </button>
                        ) : (
                          <select
                            value={task.status}
                            onChange={(e) =>
                              handleQuickStatusChange(task.id, e.target.value as Task["status"])
                            }
                            className="flex-1 px-2 py-1 text-xs font-semibold border border-slate-200 rounded-xl bg-slate-50 focus:outline-none cursor-pointer"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="IN_PROGRESS">IN_PROGRESS</option>
                            <option value="SUBMITTED">SUBMITTED</option>
                            <option value="APPROVED">APPROVED</option>
                            <option value="REVISION">REVISION</option>
                            <option value="REJECTED">REJECTED</option>
                          </select>
                        )}

                        <button
                          onClick={() => setSelectedDetailTask(task)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer border border-slate-200"
                          title="Lihat Detail & Berkas Project"
                        >
                          <Eye className="w-4 h-4 text-blue-600" />
                        </button>

                        <button
                          onClick={() => handleDelete(task.id)}
                          disabled={deletingId === task.id}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors disabled:opacity-50 cursor-pointer border border-slate-200"
                          title="Delete Task"
                        >
                          {deletingId === task.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
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
        taskData={reviewTaskTarget}
        onSubmit={handleReviewTaskAction}
      />

      {/* Task Detail & Document Viewer Modal */}
      <TaskDetailModal
        isOpen={!!selectedDetailTask}
        onClose={() => setSelectedDetailTask(null)}
        task={selectedDetailTask}
      />
    </div>
  );
}
