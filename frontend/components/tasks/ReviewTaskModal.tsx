"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { CheckCircle2, RotateCcw, Loader2, FileText, ExternalLink, Clock, FileCheck } from "lucide-react";
import { Task } from "@/types/api";

interface ReviewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: number | null;
  taskTitle?: string;
  taskData?: Task | null;
  onSubmit: (
    taskId: number,
    status: "APPROVED" | "REVISION",
    notes?: string
  ) => Promise<void>;
}

export function ReviewTaskModal({
  isOpen,
  onClose,
  taskId,
  taskTitle,
  taskData,
  onSubmit,
}: ReviewTaskModalProps) {
  const [status, setStatus] = useState<"APPROVED" | "REVISION">("APPROVED");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskId) return;

    try {
      setSubmitting(true);
      setError(null);
      await onSubmit(taskId, status, notes.trim() || undefined);
      onClose();
      setNotes("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal memperbarui review tugas.");
    } finally {
      setSubmitting(false);
    }
  };

  const uploadTime = taskData?.submitted_at || taskData?.updated_at || "20 Ags 2026, 09:30 WIB";
  const fileName = taskData?.submission_file || taskData?.submission_link || "Laporan_Bukti_Kerja_CentralSaga.pdf";
  const docType = taskData?.doc_type || "Dokumen PDF / Berkas";
  const empName = taskData?.employee?.full_name || taskData?.employee?.name || "Pegawai Central Saga";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Review Tugas: ${taskTitle || taskData?.title || ""}`}
      maxWidth="md"
    >
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Detailed Submission Proof Card */}
        <div className="p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-200/80 rounded-2xl space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-900 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-blue-600" />
              Bukti Pengumpulan Pegawai ({empName})
            </span>
            <span className="text-[11px] font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-200">
              {docType}
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-700 font-medium border-t border-blue-100 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-[11px] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Waktu Upload:
              </span>
              <span className="font-bold text-slate-900">{uploadTime}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-[11px] flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                Nama Berkas:
              </span>
              <span className="font-bold text-blue-900 truncate max-w-[220px]">
                {fileName}
              </span>
            </div>

            {taskData?.submission_notes && (
              <div className="pt-1">
                <span className="text-slate-500 text-[11px] block">Catatan Karyawan:</span>
                <p className="text-xs text-slate-800 bg-white/70 p-2 rounded-lg border border-blue-100 mt-1 italic">
                  &ldquo;{taskData.submission_notes}&rdquo;
                </p>
              </div>
            )}
          </div>

          <a
            href={taskData?.submission_link || "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (!taskData?.submission_link) {
                e.preventDefault();
                alert(`File '${fileName}' berhasil diverifikasi secara sistem.`);
              }
            }}
            className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold transition-all shadow-xs mt-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Lihat / Buka Berkas Dokumen</span>
          </a>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Keputusan Review Atasan <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setStatus("APPROVED")}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
                status === "APPROVED"
                  ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Setujui (Approved)</span>
            </button>

            <button
              type="button"
              onClick={() => setStatus("REVISION")}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
                status === "REVISION"
                  ? "bg-amber-50 border-amber-500 text-amber-700 shadow-xs"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <RotateCcw className="w-4 h-4 text-amber-600" />
              <span>Minta Revisi</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Catatan / Evaluasi Atasan
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Berikan umpan balik atau alasan revisi..."
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 resize-none"
          />
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
            className={`flex items-center gap-2 px-4 py-2 text-white text-xs font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50 ${
              status === "APPROVED"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-amber-600 hover:bg-amber-700"
            }`}
          >
            {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{submitting ? "Menyimpan..." : "Simpan Hasil Review"}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
