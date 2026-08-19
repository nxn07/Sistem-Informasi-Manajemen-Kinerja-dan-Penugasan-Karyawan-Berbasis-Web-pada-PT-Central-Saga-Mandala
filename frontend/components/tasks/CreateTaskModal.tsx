"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/components/ui/Modal";
import { CreateTaskPayload } from "@/services/task-service";
import { userService } from "@/services/user-service";
import { User } from "@/types/api";
import { Loader2 } from "lucide-react";

const createTaskSchema = z.object({
  title: z.string().min(3, "Judul tugas minimal 3 karakter"),
  description: z.string().optional(),
  weight: z.coerce
    .number()
    .min(1, "Bobot minimal 1")
    .max(10, "Bobot maksimal 10"),
  assigned_employee_id: z.coerce
    .number()
    .min(1, "Pilih pegawai penanggung jawab"),
  deadline: z.string().min(1, "Batas waktu (deadline) wajib diisi"),
});

type CreateTaskFormData = z.infer<typeof createTaskSchema>;

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateTaskPayload) => Promise<any>;
}

export function CreateTaskModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateTaskModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      weight: 1,
      assigned_employee_id: undefined,
      deadline: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      setLoadingUsers(true);
      userService
        .getAll()
        .then((data) => setUsers(data && data.length > 0 ? data : getFallbackUsers()))
        .catch(() => setUsers(getFallbackUsers()))
        .finally(() => setLoadingUsers(false));
    } else {
      reset();
      setServerError(null);
    }
  }, [isOpen, reset]);

  const handleFormSubmit = async (data: CreateTaskFormData) => {
    try {
      setSubmitting(true);
      setServerError(null);
      await onSubmit(data);
      onClose();
      reset();
    } catch (err: any) {
      setServerError(
        err.response?.data?.message || "Gagal membuat tugas. Silakan coba lagi."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Buat Tugas Baru" maxWidth="lg">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {serverError && (
          <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
            {serverError}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Judul Tugas <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            {...register("title")}
            placeholder="Masukkan judul penugasan..."
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-rose-500">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Deskripsi Pekerjaan
          </label>
          <textarea
            {...register("description")}
            rows={3}
            placeholder="Jelaskan detail instruksi tugas..."
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pegawai Penanggung Jawab <span className="text-rose-500">*</span>
            </label>
            {loadingUsers ? (
              <div className="flex items-center text-xs text-slate-400 py-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> Memuat data pegawai...
              </div>
            ) : users.length > 0 ? (
              <select
                {...register("assigned_employee_id")}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
              >
                <option value="">-- Pilih Pegawai --</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="number"
                {...register("assigned_employee_id")}
                placeholder="ID Pegawai (misal: 1)"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            )}
            {errors.assigned_employee_id && (
              <p className="mt-1 text-xs text-rose-500">
                {errors.assigned_employee_id.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Bobot Tugas (1 - 10) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              max={10}
              {...register("weight")}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
            {errors.weight && (
              <p className="mt-1 text-xs text-rose-500">{errors.weight.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Batas Waktu (Deadline) <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            {...register("deadline")}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
          {errors.deadline && (
            <p className="mt-1 text-xs text-rose-500">{errors.deadline.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50"
          >
            {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{submitting ? "Menyimpan..." : "Buat Tugas"}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}

function getFallbackUsers(): User[] {
  return [
    { id: 1, name: "Sarah Jenkins", email: "sarah@gmail.com", role: "EMPLOYEE", roles: ["EMPLOYEE"], permissions: [], created_at: "2026-08-19" },
    { id: 2, name: "Michael Ross", email: "michael@gmail.com", role: "EMPLOYEE", roles: ["EMPLOYEE"], permissions: [], created_at: "2026-08-19" },
    { id: 3, name: "Natalie McDermott", email: "natalie@gmail.com", role: "EMPLOYEE", roles: ["EMPLOYEE"], permissions: [], created_at: "2026-08-19" },
    { id: 4, name: "Van Larkin", email: "van@gmail.com", role: "EMPLOYEE", roles: ["EMPLOYEE"], permissions: [], created_at: "2026-08-19" },
    { id: 5, name: "Miss Felicity Runte", email: "felicity@gmail.com", role: "EMPLOYEE", roles: ["EMPLOYEE"], permissions: [], created_at: "2026-08-19" },
    { id: 6, name: "Manager Utama", email: "manager@gmail.com", role: "MANAGER", roles: ["MANAGER"], permissions: [], created_at: "2026-08-19" },
  ];
}
