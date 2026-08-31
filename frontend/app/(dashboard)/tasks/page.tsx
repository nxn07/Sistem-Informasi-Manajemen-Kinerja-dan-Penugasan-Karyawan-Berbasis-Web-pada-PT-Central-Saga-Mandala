"use client";

import { useState, useMemo, useEffect } from "react";
import Footer from "@/components/shared/Footer";
import { useAuth } from "@/hooks/useAuth";
import { userService } from "@/services/user-service";
import { User } from "@/types/api";
import { auditLogService } from "@/services/audit-log-service";
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
  Edit3,
  Sparkles,
  X,
  ArrowRightLeft,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
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
    refetch,
    createTask,
    updateTaskStatus,
    submitTask,
    reviewTask,
    deleteTask,
    restoreTask,
    permanentDeleteTask,
  } = useTasks();

  // View Mode: 'table' or 'grid'
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Search, Filter & Sort state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [employeeFilter, setEmployeeFilter] = useState<"MY_TASKS" | "ALL_TASKS">("ALL_TASKS");
  const [sortOrder, setSortOrder] = useState<"UPDATED_DESC" | "UPDATED_ASC">("UPDATED_DESC");

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
    taskData?: Task | null;
  } | null>(null);
  const [reviewTaskTarget, setReviewTaskTarget] = useState<Task | null>(null);
  const [selectedDetailTask, setSelectedDetailTask] = useState<Task | null>(null);
  const [reassignTaskTarget, setReassignTaskTarget] = useState<Task | null>(null);
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [selectedNewAssignee, setSelectedNewAssignee] = useState<string>("");

  useEffect(() => {
    userService.getAll().then((data) => {
      const active = data.filter((u) => u.status !== "INACTIVE");
      setActiveUsers(active);
      if (active.length > 0) setSelectedNewAssignee(active[0].name);
    });
  }, []);

  const handleReassignSubmit = async () => {
    if (!reassignTaskTarget || !selectedNewAssignee) return;
    try {
      const targetAssigneeUser = activeUsers.find((u) => u.name === selectedNewAssignee);
      const nowFormatted = new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }) + " WIB";
      const previousOwner = reassignTaskTarget.assignedTo || reassignTaskTarget.employee?.full_name || reassignTaskTarget.employee?.name || "Pegawai Sebelumnya";

      const updatedTask: Task = {
        ...reassignTaskTarget,
        assignedTo: selectedNewAssignee,
        assigned_employee_id: targetAssigneeUser?.id || reassignTaskTarget.assigned_employee_id,
        employee: {
          id: targetAssigneeUser?.id || 1,
          user_id: targetAssigneeUser?.id || 1,
          division_id: 1,
          nip: "EMP-" + (targetAssigneeUser?.id || 1),
          name: selectedNewAssignee,
          full_name: selectedNewAssignee,
          position: targetAssigneeUser?.role || "EMPLOYEE",
        },
        status: "IN_PROGRESS",
        needs_reassignment: false,
        reassigned_by: user?.name || "Manager",
        reassigned_at: nowFormatted,
        previous_assignee: previousOwner,
        updated_at: nowFormatted,
      };

      if (typeof window !== "undefined") {
        // 1. Save to simkap_created_tasks (authoritative key in useTasks)
        const rawCreated = localStorage.getItem("simkap_created_tasks");
        let createdList: Task[] = rawCreated ? JSON.parse(rawCreated) : [];
        const existsInCreated = createdList.some((t) => t.id === reassignTaskTarget.id);
        if (existsInCreated) {
          createdList = createdList.map((t) => (t.id === reassignTaskTarget.id ? updatedTask : t));
        } else {
          createdList.push(updatedTask);
        }
        localStorage.setItem("simkap_created_tasks", JSON.stringify(createdList));

        // 2. Save to simkap_tasks_v2 for backward compatibility
        const rawV2 = localStorage.getItem("simkap_tasks_v2");
        if (rawV2) {
          const listV2 = JSON.parse(rawV2);
          const updatedV2 = listV2.map((t: any) => (t.id === reassignTaskTarget.id ? updatedTask : t));
          localStorage.setItem("simkap_tasks_v2", JSON.stringify(updatedV2));
        }

        window.dispatchEvent(new Event("simkap_tasks_updated"));
        window.dispatchEvent(new Event("storage"));
      }

      auditLogService.logActivity(
        user?.name,
        "TASK_REASSIGNED",
        "App\\Models\\Task",
        `Pengguna '${user?.name || "Admin"}' (${user?.role || "ADMIN"}) memindahkan tugas '${reassignTaskTarget.title}' ke karyawan '${selectedNewAssignee}'`
      );

      await refetch();

      setToast({
        type: "success",
        message: `Tugas '${reassignTaskTarget.title}' berhasil dipindahkan ke '${selectedNewAssignee}'!`,
      });
      setReassignTaskTarget(null);
    } catch {
      setToast({
        type: "error",
        message: "Gagal memindahkan tugas.",
      });
    }
  };

  // Listen for custom edit document events from detail modal
  useEffect(() => {
    const handleEditDocumentEvent = (e: Event) => {
      const customEvent = e as CustomEvent<Task>;
      if (customEvent.detail) {
        setSubmitTaskTarget({
          id: customEvent.detail.id,
          title: customEvent.detail.title,
          taskData: customEvent.detail,
        });
      }
    };
    window.addEventListener("edit-task-document", handleEditDocumentEvent);
    return () => window.removeEventListener("edit-task-document", handleEditDocumentEvent);
  }, []);

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
  const [isRecycleBinOpen, setIsRecycleBinOpen] = useState(false);

  const activeTasks = useMemo(() => tasks.filter((t) => !t.is_deleted), [tasks]);
  const trashedTasks = useMemo(() => tasks.filter((t) => t.is_deleted), [tasks]);

  const parseTaskDate = (dateVal?: string | null): number => {
    if (!dateVal) return 0;
    const directTime = new Date(dateVal).getTime();
    if (!isNaN(directTime)) return directTime;

    const monthMap: Record<string, string> = {
      jan: "01", peb: "02", feb: "02", mar: "03", apr: "04", mei: "05", may: "05",
      jun: "06", jul: "07", ags: "08", aug: "08", sep: "09", okt: "10", oct: "10",
      nop: "11", nov: "11", des: "12", dec: "12"
    };

    const clean = dateVal.replace("WIB", "").trim();
    const parts = clean.split(/[\s,]+/);
    if (parts.length >= 3) {
      const day = parts[0].padStart(2, "0");
      const monthStr = parts[1].toLowerCase().slice(0, 3);
      const month = monthMap[monthStr] || "01";
      const year = parts[2];
      const time = parts[3] || "00:00";
      const isoStr = `${year}-${month}-${day}T${time}:00`;
      const parsed = new Date(isoStr).getTime();
      if (!isNaN(parsed)) return parsed;
    }
    return 0;
  };

  const filteredTasks = useMemo(() => {
    const list = activeTasks.filter((task) => {
      const empName = (task.employee?.full_name || task.employee?.name || "").toLowerCase().trim();
      const loggedUserName = (user?.full_name || user?.name || "Sarah Jenkins").toLowerCase().trim();
      
      // Strict Name Matching: Task is assigned to logged-in employee (Sarah Jenkins)
      const isAssignedToMe = Boolean(
        empName &&
        loggedUserName &&
        (empName.includes(loggedUserName) || loggedUserName.includes(empName))
      );

      // Strict Name Matching: Task was created by logged-in employee (Sarah Jenkins)
      const isCreatedByMe = Boolean(
        task.creator_name &&
        loggedUserName &&
        task.creator_name.toLowerCase().trim().includes(loggedUserName)
      );

      // MY_TASKS strictly shows tasks assigned to the logged-in employee ONLY
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

    return [...list].sort((a, b) => {
      if (sortOrder === "UPDATED_DESC") {
        // Waktu diubah paling baru ke paling lama
        const timeA = parseTaskDate(a.reassigned_at ?? a.updated_at ?? a.submitted_at ?? a.due_date) || 0;
        const timeB = parseTaskDate(b.reassigned_at ?? b.updated_at ?? b.submitted_at ?? b.due_date) || 0;
        return timeB - timeA;
      } else {
        // UPDATED_ASC: Waktu diubah paling lama ke paling baru
        const timeA = parseTaskDate(a.reassigned_at ?? a.updated_at ?? a.submitted_at ?? a.due_date) || 9999999999999;
        const timeB = parseTaskDate(b.reassigned_at ?? b.updated_at ?? b.submitted_at ?? b.due_date) || 9999999999999;
        return timeA - timeB;
      }
    });
  }, [activeTasks, searchQuery, selectedStatus, isEmployee, employeeFilter, user, sortOrder]);

  // Helper Badge Renderers
  const getStatusBadge = (status: Task["status"]): React.ReactNode => {
    const badges: Record<string, React.ReactNode> = {
      PENDING: (
        <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-slate-100 text-slate-700 border border-slate-200/90 shadow-2xs">
          PENDING
        </span>
      ),
      IN_PROGRESS: (
        <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-blue-50 text-blue-800 border border-blue-200/90 shadow-2xs">
          IN_PROGRESS
        </span>
      ),
      SUBMITTED: (
        <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-purple-50 text-purple-800 border border-purple-200/90 shadow-2xs">
          SUBMITTED
        </span>
      ),
      APPROVED: (
        <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/90 shadow-2xs">
          APPROVED
        </span>
      ),
      COMPLETED: (
        <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/90 shadow-2xs">
          COMPLETED
        </span>
      ),
      REJECTED: (
        <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-rose-50 text-rose-800 border border-rose-200/90 shadow-2xs">
          REJECTED
        </span>
      ),
      REVISION: (
        <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-amber-50 text-amber-800 border border-amber-200/90 shadow-2xs">
          REVISION
        </span>
      ),
    };
    return (
      badges[status] || (
        <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-slate-100 text-slate-700 border border-slate-200/90">
          {status}
        </span>
      )
    );
  };

  const getPriorityBadge = (weight: number) => {
    if (weight >= 8) {
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-50 text-rose-800 border border-rose-200/90">
          ! Urgent
        </span>
      );
    } else if (weight >= 6) {
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-800 border border-amber-200/90">
          ^ High
        </span>
      );
    } else if (weight >= 4) {
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-50 text-blue-800 border border-blue-200/90">
          - Medium
        </span>
      );
    } else {
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-700 border border-slate-200/90">
          v Low
        </span>
      );
    }
  };

  const handleCreateTask = async (payload: any) => {
    try {
      await createTask(payload);
      auditLogService.logActivity(
        user?.name,
        "TASK_CREATED",
        "App\\Models\\Task",
        `Pengguna '${user?.name || "Admin"}' (${user?.role || "ADMIN"}) membuat tugas baru '${payload.title}'`
      );
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
      const targetTask = tasks.find((t) => t.id === taskId);
      auditLogService.logActivity(
        user?.name,
        "TASK_STATUS_UPDATED",
        "App\\Models\\Task",
        `Pengguna '${user?.name || "User"}' (${user?.role || "USER"}) mengubah status tugas '${targetTask?.title || `#${taskId}`}' menjadi '${newStatus}'`
      );
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
      auditLogService.logActivity(
        user?.name,
        "PROOF_SUBMITTED",
        "App\\Models\\TaskSubmission",
        `Pegawai '${user?.name || "Sarah Jenkins"}' (${user?.role || "EMPLOYEE"}) mengumpulkan bukti pekerjaan untuk tugas #${taskId}`
      );
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
      auditLogService.logActivity(
        user?.name,
        "TASK_REVIEWED",
        "App\\Models\\Task",
        `Pengguna '${user?.name || "Manager"}' (${user?.role || "MANAGER"}) meninjau tugas #${taskId} (Hasil: ${status})`
      );
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

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus tugas ini?")) {
      const targetTask = tasks.find((t) => t.id === id);
      deleteTask(id);
      auditLogService.logActivity(
        user?.name,
        "TASK_DELETED",
        "App\\Models\\Task",
        `Pengguna '${user?.name || "Admin"}' (${user?.role || "ADMIN"}) menghapus tugas '${targetTask?.title || `#${id}`}'`
      );
      setToast({
        type: "success",
        message: "Tugas berhasil dihapus.",
      });
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
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Monitor and assign departmental objectives.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Segmented Control Toggle (Butter-Smooth Sliding Pill) */}
          <div className="relative flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 shadow-2xs h-10 w-44 select-none">
            {/* Sliding White Active Pill Indicator */}
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-xs border border-slate-200/80 transition-all duration-300 ease-out ${
                viewMode === "table" ? "left-1" : "left-[calc(50%+2px)]"
              }`}
            />

            <button
              onClick={() => setViewMode("table")}
              className={`relative z-10 flex-1 h-8 text-xs flex items-center justify-center gap-1.5 transition-colors duration-200 cursor-pointer ${
                viewMode === "table"
                  ? "text-blue-950 font-black"
                  : "text-slate-500 hover:text-slate-900 font-semibold"
              }`}
              title="Tampilan Tabel"
            >
              <Table className={`w-4 h-4 transition-transform duration-200 ${viewMode === "table" ? "scale-110 text-blue-700" : ""}`} />
              <span>Tabel</span>
            </button>

            <button
              onClick={() => setViewMode("grid")}
              className={`relative z-10 flex-1 h-8 text-xs flex items-center justify-center gap-1.5 transition-colors duration-200 cursor-pointer ${
                viewMode === "grid"
                  ? "text-blue-950 font-black"
                  : "text-slate-500 hover:text-slate-900 font-semibold"
              }`}
              title="Tampilan Kartu"
            >
              <LayoutGrid className={`w-4 h-4 transition-transform duration-200 ${viewMode === "grid" ? "scale-110 text-blue-700" : ""}`} />
              <span>Kartu</span>
            </button>
          </div>

          {/* Tombol Tempat Sampah Penugasan (Admin & Manager) */}
          {isAdminOrManager && (
            <button
              onClick={() => setIsRecycleBinOpen(true)}
              className="flex items-center justify-center gap-2 h-10 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-extrabold transition-all shadow-2xs border border-slate-300 cursor-pointer relative shrink-0"
              title="Tempat Sampah Penugasan (Recycle Bin)"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Tempat Sampah</span>
              {trashedTasks.length > 0 && (
                <span className="ml-1 px-2 py-0.5 text-[10px] font-black rounded-full bg-rose-600 text-white">
                  {trashedTasks.length}
                </span>
              )}
            </button>
          )}

          {/* Tombol Tambah Tugas */}
          {canCreateTask && (
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center justify-center gap-2 h-10 px-4 bg-blue-900 hover:bg-blue-950 active:scale-98 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer shrink-0 border border-blue-950"
            >
              <Plus className="w-4 h-4" />
              <span>Assign New Task</span>
            </button>
          )}
        </div>
      </div>

      {/* Employee Task Scope Selector */}
      {isEmployee && (
        <div className="p-3 bg-blue-50/80 border border-blue-200/80 rounded-2xl flex items-center justify-between text-xs font-bold shadow-2xs">
          <span className="text-blue-900 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-blue-600" />
            Filter Tampilan Tugas Karyawan ({user?.name || "Sarah Jenkins"}):
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEmployeeFilter("ALL_TASKS")}
              className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                employeeFilter === "ALL_TASKS"
                  ? "bg-blue-900 text-white border-blue-900 shadow-xs"
                  : "bg-white text-slate-700 border-slate-200/80 hover:bg-slate-100"
              }`}
            >
              👥 Semua Tugas Tim
            </button>
            <button
              onClick={() => setEmployeeFilter("MY_TASKS")}
              className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                employeeFilter === "MY_TASKS"
                  ? "bg-blue-900 text-white border-blue-900 shadow-xs"
                  : "bg-white text-slate-700 border-slate-200/80 hover:bg-slate-100"
              }`}
            >
              👤 Tugas Saya Saja
            </button>
          </div>
        </div>
      )}

      {/* Metrics Banner (ULTRA-AESTHETIC EXECUTIVE CARDS) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="p-6 bg-white border border-slate-300 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-slate-400 transition-all duration-300 flex items-center justify-between group relative overflow-hidden cursor-pointer">
          <div className="absolute top-0 right-0 w-28 h-28 bg-slate-500/5 rounded-full blur-xl group-hover:bg-slate-500/10 transition-all pointer-events-none" />
          <div>
            <span className="px-3 py-1 text-[10px] font-black rounded-xl bg-slate-100 text-slate-700 border border-slate-200/80 shadow-2xs uppercase tracking-wider">
              Status Pending
            </span>
            <h3 className="text-3xl font-black text-slate-900 mt-2.5 tracking-tight">
              {metrics.pending}
            </h3>
            <p className="text-[11px] font-extrabold text-slate-500 mt-0.5">Total Pending</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 text-white flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shrink-0">
            <Clock className="w-6 h-6 text-slate-200" />
          </div>
        </div>

        <div className="p-6 bg-white border border-slate-300 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-blue-500 transition-all duration-300 flex items-center justify-between group relative overflow-hidden cursor-pointer">
          <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition-all pointer-events-none" />
          <div>
            <span className="px-3 py-1 text-[10px] font-black rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs uppercase tracking-wider">
              Sedang Dikerjakan
            </span>
            <h3 className="text-3xl font-black text-slate-900 mt-2.5 tracking-tight">
              {metrics.inProgress}
            </h3>
            <p className="text-[11px] font-extrabold text-blue-700 mt-0.5">In Progress</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-900 to-indigo-800 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shrink-0">
            <Clock className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="p-6 bg-white border border-slate-300 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-purple-500 transition-all duration-300 flex items-center justify-between group relative overflow-hidden cursor-pointer">
          <div className="absolute top-0 right-0 w-28 h-28 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/10 transition-all pointer-events-none" />
          <div>
            <span className="px-3 py-1 text-[10px] font-black rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white shadow-xs uppercase tracking-wider">
              Menunggu Review
            </span>
            <h3 className="text-3xl font-black text-slate-900 mt-2.5 tracking-tight">
              {metrics.awaitingApproval}
            </h3>
            <p className="text-[11px] font-extrabold text-purple-700 mt-0.5">Awaiting Approval</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-900 to-indigo-800 text-white flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shrink-0">
            <CheckSquare className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="p-6 bg-white border border-slate-300 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-emerald-500 transition-all duration-300 flex items-center justify-between group relative overflow-hidden cursor-pointer">
          <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all pointer-events-none" />
          <div>
            <span className="px-3 py-1 text-[10px] font-black rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs uppercase tracking-wider">
              Disetujui & Selesai
            </span>
            <h3 className="text-3xl font-black text-slate-900 mt-2.5 tracking-tight">
              {metrics.approved}
            </h3>
            <p className="text-[11px] font-extrabold text-emerald-700 mt-0.5">Approved & Done</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-900 to-teal-800 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shrink-0">
            <CheckSquare className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Toolbar Search, Sort & Status Filter (Sleek Single-Frame Floating Toolbar) */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari tugas atau nama pegawai..."
            className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white text-slate-900 shadow-2xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 justify-start lg:justify-end">
          {/* Filter Status */}
          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs font-extrabold border-0 bg-transparent text-slate-800 cursor-pointer focus:outline-none"
            >
              <option value="ALL">Semua Status (All)</option>
              <option value="PENDING">PENDING</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="SUBMITTED">SUBMITTED</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>

          {/* Opsi Urutkan Waktu Diubah (Paling Baru & Paling Lama) */}
          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="text-xs font-extrabold border-0 bg-transparent text-slate-800 cursor-pointer focus:outline-none"
            >
              <option value="UPDATED_DESC">🕒 Waktu Diubah: Paling Baru</option>
              <option value="UPDATED_ASC">🕒 Waktu Diubah: Paling Lama</option>
            </select>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-900 text-white rounded-xl text-xs font-black shadow-xs shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            Total {filteredTasks.length} Tasks
          </span>
        </div>
      </div>

      {/* Error state alert */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold rounded-xl">
          {error}
        </div>
      )}

      {/* Content Rendering: Loading vs Table vs Grid */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center space-y-3 bg-white border border-slate-200/80 rounded-2xl">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-xs font-bold text-slate-600">
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
        /* ORIGINAL APPROVED EXECUTIVE MODERN TABLE (SLEEK SLATE-200 BORDERS & CLEAN COLUMN LINES) */
        <div className="bg-white border border-slate-300 rounded-3xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white text-[11px] font-black uppercase tracking-wider">
                  <th className="py-4 px-4 w-12 border-r border-white/20 text-center">NO.</th>
                  <th className="py-4 px-4 min-w-[220px] border-r border-white/20">TITLE & DESKRIPSI</th>
                  <th className="py-4 px-4 min-w-[160px] border-r border-white/20">EMPLOYEE</th>
                  <th className="py-4 px-4 min-w-[120px] border-r border-white/20">DUE DATE</th>
                  <th className="py-4 px-4 min-w-[110px] border-r border-white/20">PRIORITY</th>
                  <th
                    onClick={() => setSortOrder(sortOrder === "UPDATED_DESC" ? "UPDATED_ASC" : "UPDATED_DESC")}
                    className="py-4 px-4 min-w-[190px] border-r border-white/20 cursor-pointer hover:bg-white/10 transition-colors select-none group"
                    title="Klik untuk mengubah urutan waktu update / perubahan status"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span>STATUS & WAKTU DIUBAH</span>
                      <span className="p-1 rounded bg-white/10 group-hover:bg-white/20">
                        {sortOrder === "UPDATED_DESC" ? (
                          <ArrowDown className="w-3.5 h-3.5 text-amber-400" />
                        ) : (
                          <ArrowUp className="w-3.5 h-3.5 text-amber-400" />
                        )}
                      </span>
                    </div>
                  </th>
                  <th className="py-4 px-4 text-center min-w-[200px]">ACTIONS & BERKAS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 text-xs font-semibold text-slate-800">
                {filteredTasks.map((task, idx) => {
                  const docLabel = task.doc_type || getDocTypeLabel(task.submission_file || task.submission_link);
                  const lastModified = task.submitted_at || task.updated_at || "20 Ags 2026, 09:30 WIB";
                  const empName = task.assignedTo || task.employee?.full_name || task.employee?.name || "";
                  const loggedUserName = user?.name || "Sarah Jenkins";
                  
                  const isTaskAssignedToMe =
                    empName.toLowerCase().includes(loggedUserName.toLowerCase()) ||
                    loggedUserName.toLowerCase().includes(empName.toLowerCase());

                  return (
                    <tr
                      key={task.id}
                      className="even:bg-slate-50/50 hover:bg-blue-50/40 transition-colors duration-150"
                    >
                      <td className="py-4 px-4 text-slate-500 font-extrabold border-r border-slate-300 text-center">
                        {String(idx + 1).padStart(2, "0")}
                      </td>
                      
                      {/* Title & Deskripsi */}
                      <td className="py-4 px-4 border-r border-slate-300">
                        <button
                          onClick={() => setSelectedDetailTask(task)}
                          className="font-extrabold text-slate-900 hover:text-blue-700 text-left line-clamp-1 transition-colors cursor-pointer group flex items-center gap-1.5"
                        >
                          <span>{task.title}</span>
                          <Eye className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                        </button>
                        <p className="text-[11px] text-slate-500 font-medium line-clamp-1 mt-0.5">
                          {task.description || "Tidak ada deskripsi tambahan."}
                        </p>
                      </td>

                      {/* Employee Column */}
                      <td className="py-4 px-4 border-r border-slate-300">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-900 text-white font-black flex items-center justify-center text-[10px] shrink-0 border border-blue-950 shadow-2xs">
                            {empName.slice(0, 2).toUpperCase() || "PE"}
                          </div>
                          <span className="font-extrabold text-slate-900 line-clamp-1">
                            {empName || `Emp #${task.assigned_employee_id}`}
                          </span>
                        </div>
                      </td>

                      {/* Due Date Column */}
                      <td className="py-4 px-4 border-r border-slate-300 text-slate-600">
                        <span className="inline-flex items-center gap-1 font-bold text-slate-800">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {formatDate(task.deadline ?? task.due_date)}
                        </span>
                      </td>

                      {/* Priority Column */}
                      <td className="py-4 px-4 border-r border-slate-300">
                        {getPriorityBadge(task.weight ?? task.weight_score ?? 5)}
                      </td>
                      
                      {/* STATUS + TERAKHIR DIUBAH + INFORMASI DIPINDAHKAN + JENIS DOKUMEN */}
                      <td className="py-4 px-4 border-r border-slate-300">
                        <div className="space-y-1">
                          <div>{getStatusBadge(task.status)}</div>
                          <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>Diubah: {task.reassigned_at || task.updated_at || lastModified}</span>
                          </div>
                          {task.reassigned_by && (
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 text-[9.5px] font-black rounded-lg bg-indigo-50 text-indigo-900 border border-indigo-200 shadow-2xs">
                              <ArrowRightLeft className="w-3 h-3 text-indigo-600 shrink-0" />
                              <span>Dipindahkan: <strong>{task.reassigned_by}</strong></span>
                            </div>
                          )}
                          {task.previous_assignee && (
                            <p className="text-[9px] text-slate-400 font-semibold italic">
                              (Dari: {task.previous_assignee})
                            </p>
                          )}
                          {(task.submission_file || task.submission_link || task.status === "SUBMITTED") && (
                            <button
                              onClick={() => setSelectedDetailTask(task)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 text-[9.5px] font-extrabold rounded bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-800 border border-blue-200/90 transition-all cursor-pointer shadow-2xs"
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
                                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-800 text-[11px] font-black rounded-lg transition-all cursor-pointer inline-flex items-center gap-1 shadow-2xs border border-blue-200/90"
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
                                            taskData: task,
                                          })
                                        }
                                        className="px-2.5 py-1 bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-800 text-[11px] font-black rounded-lg transition-all cursor-pointer inline-flex items-center gap-1 shadow-2xs border border-purple-200/90"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                        <span>Edit / Kumpulkan</span>
                                      </button>
                                    )}
                                    {task.status === "SUBMITTED" && (
                                      <button
                                        onClick={() =>
                                          setSubmitTaskTarget({
                                            id: task.id,
                                            title: task.title,
                                            taskData: task,
                                          })
                                        }
                                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-900 text-[11px] font-black rounded-lg transition-all cursor-pointer inline-flex items-center gap-1 shadow-2xs border border-blue-200/90"
                                        title="Perbarui dokumen yang sudah diunggah"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                        <span>Edit Dokumen</span>
                                      </button>
                                    )}
                                    {(task.status === "REVISION" || task.status === "REJECTED") && (
                                      <button
                                        onClick={() =>
                                          setSubmitTaskTarget({
                                            id: task.id,
                                            title: task.title,
                                            taskData: task,
                                          })
                                        }
                                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-900 text-[11px] font-black rounded-lg transition-all cursor-pointer inline-flex items-center gap-1 shadow-2xs border border-amber-200/90"
                                      >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                        <span>Perbarui & Ajukan</span>
                                      </button>
                                    )}
                                  </>
                                )}

                                {/* Detail Button */}
                                <button
                                  onClick={() => setSelectedDetailTask(task)}
                                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1 border border-slate-200/80"
                                  title="Lihat Detail & Berkas Project"
                                >
                                  <Eye className="w-3.5 h-3.5 text-blue-700" />
                                  <span>Detail</span>
                                </button>

                                {canReviewTask && (
                                  <button
                                    onClick={() => setReviewTaskTarget(task)}
                                    className="px-2 py-1 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-800 text-[11px] font-bold rounded-lg transition-colors border border-emerald-200/90 cursor-pointer"
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
                                    className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-800 text-[11px] font-bold rounded-lg transition-all cursor-pointer shadow-2xs border border-emerald-200/90 flex items-center gap-1"
                                  >
                                    <CheckSquare className="w-3.5 h-3.5 text-emerald-700" />
                                    <span>Review & Berkas</span>
                                  </button>
                                ) : (
                                  <select
                                    value={task.status}
                                    onChange={(e) =>
                                      handleQuickStatusChange(task.id, e.target.value as Task["status"])
                                    }
                                    className="px-2 py-1 text-[11px] font-bold border border-slate-200/80 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
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
                                  className="p-1 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer border border-slate-200/80 hover:border-blue-300"
                                  title="Lihat Detail & Berkas Project"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => {
                                    setReassignTaskTarget(task);
                                    if (activeUsers.length > 0) setSelectedNewAssignee(activeUsers[0].name);
                                  }}
                                  className="px-2 py-1 bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-900 text-[11px] font-bold rounded-lg transition-all cursor-pointer border border-amber-300 shadow-2xs flex items-center gap-1"
                                  title="Pindahkan Tugas ke Karyawan Lain (Pegawai Non-Aktif / Reassign)"
                                >
                                  <UserCheck className="w-3.5 h-3.5 text-amber-700" />
                                  <span>Pindahkan</span>
                                </button>

                                <button
                                  onClick={() => handleDelete(task.id)}
                                  className="p-1 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer border border-slate-200/80 hover:border-rose-300"
                                  title="Delete Task"
                                >
                                  <Trash2 className="w-4 h-4 text-rose-600" />
                                </button>
                              </div>

                              {/* Upload Detail Snippet */}
                              {(task.submission_file || task.submission_link) && (
                                <button
                                  onClick={() => setSelectedDetailTask(task)}
                                  className="text-[9.5px] text-blue-900 hover:underline font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200/90 max-w-[170px] truncate cursor-pointer text-left shadow-2xs"
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
        /* GRID VIEW (KARTU ESTETIK SLEEK SLATE BORDERS) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => {
            const docLabel = task.doc_type || getDocTypeLabel(task.submission_file || task.submission_link);
            const lastModified = task.submitted_at || task.updated_at || "20 Ags 2026, 09:30 WIB";
            const empName = task.assignedTo || task.employee?.full_name || task.employee?.name || "";
            const loggedUserName = user?.name || "Sarah Jenkins";
            
            const isTaskAssignedToMe =
              empName.toLowerCase().includes(loggedUserName.toLowerCase()) ||
              loggedUserName.toLowerCase().includes(empName.toLowerCase());

            return (
              <div
                key={task.id}
                className="p-5 bg-white border border-slate-300 rounded-2xl shadow-sm hover:shadow-lg hover:border-blue-600 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    {getStatusBadge(task.status)}
                    {getPriorityBadge(task.weight ?? task.weight_score ?? 5)}
                  </div>
                  
                  {/* Last Modified & Doc Type Header Badge */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-3 pt-1 border-t border-slate-100">
                    <span className="flex items-center gap-1 font-bold">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {lastModified}
                    </span>
                    {(task.submission_file || task.submission_link || task.status === "SUBMITTED") && (
                      <button
                        onClick={() => setSelectedDetailTask(task)}
                        className="px-1.5 py-0.5 text-[9px] font-black rounded bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-800 border border-blue-200/90 transition-colors cursor-pointer"
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
                  <p className="text-xs text-slate-600 font-medium line-clamp-2 mb-4 leading-relaxed">
                    {task.description || "No description provided."}
                  </p>
                </div>

                <div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1 text-slate-600 font-bold">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {formatDate(task.deadline ?? task.due_date)}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-slate-800 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200/80">
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
                                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-800 text-xs font-black rounded-xl transition-all cursor-pointer shadow-2xs border border-blue-200/90"
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
                                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-800 text-xs font-black rounded-xl transition-all cursor-pointer shadow-2xs border border-purple-200/90"
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
                                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-900 text-xs font-black rounded-xl transition-all cursor-pointer shadow-2xs border border-amber-200/90"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  <span>Perbaiki & Ajukan</span>
                                </button>
                              )}
                            </>
                          )}

                          <button
                            onClick={() => setSelectedDetailTask(task)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black rounded-xl transition-colors cursor-pointer flex items-center gap-1 border border-slate-200/80"
                            title="Lihat Detail & Berkas"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-700" />
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
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-800 text-xs font-black rounded-xl transition-all cursor-pointer shadow-2xs border border-emerald-200/90"
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
                            className="flex-1 px-2 py-1 text-xs font-bold border border-slate-200/80 rounded-xl bg-slate-50 focus:outline-none cursor-pointer"
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
                          className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer border border-slate-200/80 hover:border-blue-300"
                          title="Lihat Detail & Berkas Project"
                        >
                          <Eye className="w-4 h-4 text-blue-700" />
                        </button>

                        <button
                          onClick={() => handleDelete(task.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer border border-slate-200/80 hover:border-rose-300"
                          title="Delete Task"
                        >
                          <Trash2 className="w-4 h-4 text-rose-600" />
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
        taskData={submitTaskTarget?.taskData}
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
        onEditDocument={(t) =>
          setSubmitTaskTarget({
            id: t.id,
            title: t.title,
            taskData: t,
          })
        }
      />

      {/* Modal Pindahkan Tugas (Reassign Task to Active Employee) */}
      {reassignTaskTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200/80 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-200 shadow-2xs">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Pindahkan Tugas Karyawan
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Tugas: <span className="font-bold text-slate-700">{reassignTaskTarget.title}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setReassignTaskTarget(null)}
                className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-medium">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                <p className="font-bold text-xs">Pemilik Tugas Saat Ini:</p>
                <p className="text-xs font-black mt-0.5">{reassignTaskTarget.assignedTo || reassignTaskTarget.employee?.full_name || reassignTaskTarget.employee?.name || "Belum Ditentukan"}</p>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Pilih Karyawan Baru (Aktif):
                </label>
                <select
                  value={selectedNewAssignee}
                  onChange={(e) => setSelectedNewAssignee(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 text-xs font-bold bg-white"
                >
                  {activeUsers.map((u) => (
                    <option key={u.id} value={u.name}>
                      {u.name} ({u.role || "EMPLOYEE"}) — {u.email}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setReassignTaskTarget(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleReassignSubmit}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md border border-amber-700 cursor-pointer"
              >
                Konfirmasi Pindahkan Tugas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Executive Recycle Bin / Tempat Sampah Modal */}
      {isRecycleBinOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-300 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-400">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base flex items-center gap-2">
                    <span>Tempat Sampah Penugasan (Recycle Bin)</span>
                    <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-rose-600 text-white">
                      {trashedTasks.length} Tugas
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-300 font-medium">
                    Daftar tugas yang dihapus dari sistem. Admin & Manager dapat memulihkan (restore) tugas ini kembali.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsRecycleBinOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Table */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {trashedTasks.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-3">
                  <Trash2 className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="font-extrabold text-slate-700 text-sm">Tempat Sampah Kosong</p>
                  <p className="text-xs text-slate-400">Tidak ada tugas yang dihapus saat ini.</p>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-900 text-white text-[11px] font-black uppercase">
                        <th className="py-3 px-4 w-10 border-r border-slate-800 text-center">NO.</th>
                        <th className="py-3 px-4 border-r border-slate-800">JUDUL TUGAS</th>
                        <th className="py-3 px-4 border-r border-slate-800">DITUGASKAN KEPADA</th>
                        <th className="py-3 px-4 border-r border-slate-800">STATUS SEBELUMNYA</th>
                        <th className="py-3 px-4 border-r border-slate-800">WAKTU DIHAPUS</th>
                        <th className="py-3 px-4 text-center">AKSI RECOVERY</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-semibold text-slate-800">
                      {trashedTasks.map((t, idx) => (
                        <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4 text-center text-slate-400 font-bold border-r border-slate-200">
                            {String(idx + 1).padStart(2, "0")}
                          </td>
                          <td className="py-3 px-4 border-r border-slate-200 max-w-[220px]">
                            <p className="font-extrabold text-slate-900 truncate">{t.title}</p>
                            <p className="text-[11px] text-slate-500 truncate">{t.description || "Tanpa deskripsi"}</p>
                          </td>
                          <td className="py-3 px-4 border-r border-slate-200 font-bold text-slate-900">
                            {t.assignedTo || t.employee?.full_name || t.employee?.name || "Karyawan"}
                          </td>
                          <td className="py-3 px-4 border-r border-slate-200">
                            {getStatusBadge(t.status)}
                          </td>
                          <td className="py-3 px-4 border-r border-slate-200 whitespace-nowrap text-[11px] text-slate-600">
                            <p className="font-bold text-slate-800">{t.deleted_at || "Baru saja"}</p>
                            <p className="text-[10px] text-slate-400 font-medium">Oleh: {t.deleted_by || "Admin"}</p>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={async () => {
                                  await restoreTask(t.id);
                                  setToast({
                                    type: "success",
                                    message: `Tugas '${t.title}' berhasil dipulihkan kembali ke penugasan aktif!`,
                                  });
                                }}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1 border border-emerald-700"
                                title="Pulihkan Tugas Kembali"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Pulihkan</span>
                              </button>

                              {rawRole === "ADMIN" && (
                                <button
                                  onClick={async () => {
                                    if (confirm(`Hapus permanen tugas '${t.title}'? Tindakan ini tidak dapat dibatalkan.`)) {
                                      await permanentDeleteTask(t.id);
                                      setToast({
                                        type: "success",
                                        message: `Tugas '${t.title}' telah dihapus secara permanen.`,
                                      });
                                    }
                                  }}
                                  className="p-1.5 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white font-bold text-[11px] rounded-xl transition-all cursor-pointer border border-rose-200"
                                  title="Hapus Permanen"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setIsRecycleBinOpen(false)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-sm cursor-pointer"
              >
                Tutup Tempat Sampah
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
