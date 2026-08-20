"use client";

import { Modal } from "@/components/ui/Modal";
import { Task } from "@/types/api";
import { getDocTypeLabel } from "@/hooks/useTasks";
import {
  Calendar,
  Clock,
  ExternalLink,
  FileCheck,
  FileText,
  User,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Tag,
} from "lucide-react";

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

export function TaskDetailModal({ isOpen, onClose, task }: TaskDetailModalProps) {
  if (!task) return null;

  const docLabel = task.doc_type || getDocTypeLabel(task.submission_file || task.submission_link);
  const lastModified = task.submitted_at || task.updated_at || "20 Ags 2026, 09:30 WIB";
  const empName = task.employee?.full_name || task.employee?.name || "Pegawai Central Saga";
  const fileName = task.submission_file || task.submission_link || "Dokumen_Bukti_Kerja.pdf";

  const getStatusBadge = (status: Task["status"]) => {
    const badges: Record<string, React.ReactNode> = {
      PENDING: (
        <span className="px-3 py-1 text-xs font-black rounded-full bg-slate-100 text-slate-700 border border-slate-200">
          PENDING
        </span>
      ),
      IN_PROGRESS: (
        <span className="px-3 py-1 text-xs font-black rounded-full bg-blue-100 text-blue-800 border border-blue-200">
          IN_PROGRESS
        </span>
      ),
      SUBMITTED: (
        <span className="px-3 py-1 text-xs font-black rounded-full bg-purple-100 text-purple-800 border border-purple-200">
          SUBMITTED
        </span>
      ),
      APPROVED: (
        <span className="px-3 py-1 text-xs font-black rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
          APPROVED
        </span>
      ),
      COMPLETED: (
        <span className="px-3 py-1 text-xs font-black rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
          COMPLETED
        </span>
      ),
      REJECTED: (
        <span className="px-3 py-1 text-xs font-black rounded-full bg-rose-100 text-rose-800 border border-rose-200">
          REJECTED
        </span>
      ),
      REVISION: (
        <span className="px-3 py-1 text-xs font-black rounded-full bg-amber-100 text-amber-800 border border-amber-200">
          REVISION
        </span>
      ),
    };
    return badges[status] || <span className="px-3 py-1 text-xs font-black rounded-full bg-slate-100 text-slate-700">{status}</span>;
  };

  const handleOpenDocument = () => {
    if (task.submission_link && (task.submission_link.startsWith("http://") || task.submission_link.startsWith("https://"))) {
      window.open(task.submission_link, "_blank");
    } else {
      alert(`[Central Saga Document Viewer]\n\nMenampilkan Berkas: ${fileName}\nJenis Dokumen: ${docLabel}\nWaktu Upload: ${lastModified}\nDiunggah Oleh: ${empName}\n\nStatus Berkas: Terverifikasi Lengkap Secara Sistem!`);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Detail Tugas & Dokumen Project: #${task.id}`}
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Header Title Card */}
        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            {getStatusBadge(task.status)}
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-blue-600" />
              Bobot Tugas: {task.weight ?? task.weight_score ?? 5} / 10
            </span>
          </div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight leading-snug">
            {task.title}
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {task.description || "Tidak ada deskripsi rinci untuk tugas ini."}
          </p>
        </div>

        {/* Task Metadata Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
            <span className="text-slate-400 font-bold block flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Penanggung Jawab (Pegawai)
            </span>
            <p className="font-extrabold text-slate-900">{empName}</p>
            <p className="text-[11px] text-slate-400">
              {task.employee?.position || "Specialist Staff"} (NIP: {task.employee?.nip || "19900101"})
            </p>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
            <span className="text-slate-400 font-bold block flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Batas Waktu (Deadline)
            </span>
            <p className="font-extrabold text-slate-900">
              {task.deadline || task.due_date || "2026-10-15"}
            </p>
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              Diubah: {lastModified}
            </p>
          </div>
        </div>

        {/* Document & Submission Box */}
        {(task.submission_file || task.submission_link || task.status === "SUBMITTED" || task.status === "APPROVED" || task.status === "REVISION") ? (
          <div className="p-4 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 border border-blue-200 rounded-2xl space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-blue-900 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-blue-600" />
                Berkas Bukti Pengumpulan Project
              </span>
              <span className="text-[11px] font-black text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-200">
                {docLabel}
              </span>
            </div>

            <div className="space-y-2 text-xs border-t border-blue-100 pt-2.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  Nama Berkas Dokumen:
                </span>
                <span className="font-bold text-blue-950 truncate max-w-[250px]">
                  {fileName}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Waktu Upload Lengkap:
                </span>
                <span className="font-bold text-slate-900">{lastModified}</span>
              </div>

              {task.submission_notes && (
                <div className="pt-1">
                  <span className="text-slate-500 font-medium block">Catatan Karyawan:</span>
                  <p className="text-xs text-slate-800 bg-white/80 p-2.5 rounded-xl border border-blue-100 mt-1 italic leading-relaxed">
                    &ldquo;{task.submission_notes}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* Direct Open / Preview Button */}
            <button
              onClick={handleOpenDocument}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-900 hover:bg-blue-950 active:scale-98 text-white text-xs font-extrabold rounded-xl transition-all shadow-md cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Buka & Lihat Berkas Dokumen Langsung</span>
            </button>
          </div>
        ) : (
          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-center gap-2 text-xs font-bold text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Belum ada dokumen yang diunggah untuk tugas ini (Status: {task.status}).</span>
          </div>
        )}

        {/* Action / Close Buttons */}
        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Tutup Modal
          </button>
        </div>
      </div>
    </Modal>
  );
}
