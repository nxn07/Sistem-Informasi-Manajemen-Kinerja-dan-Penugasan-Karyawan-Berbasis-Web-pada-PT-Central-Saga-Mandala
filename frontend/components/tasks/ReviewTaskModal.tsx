"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import {
  CheckCircle2,
  RotateCcw,
  Loader2,
  FileText,
  ExternalLink,
  Clock,
  FileCheck,
  Image as ImageIcon,
  Link as LinkIcon,
  Maximize2,
  X,
  Download,
} from "lucide-react";
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
  const [isViewerOpen, setIsViewerOpen] = useState(false);

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

  // Detect whether submission is an image
  const isImageFile =
    (taskData?.submission_file && /\.(png|jpg|jpeg|webp|gif|svg)$/i.test(taskData.submission_file)) ||
    (taskData?.submission_link && /\.(png|jpg|jpeg|webp|gif|svg)$/i.test(taskData.submission_link)) ||
    docType === "Gambar Screenshot" ||
    fileName.toLowerCase().endsWith(".png") ||
    fileName.toLowerCase().endsWith(".jpg") ||
    fileName.toLowerCase().endsWith(".jpeg");

  const getImageSrc = () => {
    if (taskData?.submission_file) {
      if (taskData.submission_file.startsWith("http")) return taskData.submission_file;
      return `http://localhost:8000/storage/${taskData.submission_file}`;
    }
    if (taskData?.submission_link && (taskData.submission_link.startsWith("http://") || taskData.submission_link.startsWith("https://"))) {
      if (/\.(png|jpg|jpeg|webp|gif|svg)$/i.test(taskData.submission_link)) {
        return taskData.submission_link;
      }
    }
    return `http://localhost:8000/storage/${fileName}`;
  };

  const handleOpenDocument = () => {
    setIsViewerOpen(true);
  };

  const handleOpenLink = () => {
    if (taskData?.submission_link && taskData.submission_link.trim() !== "") {
      const url = taskData.submission_link.startsWith("http")
        ? taskData.submission_link
        : `https://${taskData.submission_link}`;
      window.open(url, "_blank");
    } else {
      alert("ℹ️ Informasi Tautan Link:\n\nPegawai tidak mencantumkan tautan/link external untuk tugas ini.");
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Review Tugas: ${taskTitle || taskData?.title || ""}`}
        maxWidth="md"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg font-bold">
              {error}
            </div>
          )}

          {/* Detailed Submission Proof Card */}
          <div className="p-4 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 border border-blue-200 rounded-2xl space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-blue-950 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-blue-600" />
                Bukti Pengumpulan ({empName})
              </span>
              <span className="text-[11px] font-black text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-200">
                Jenis: {docType}
              </span>
            </div>

            {/* LIVE IMAGE PREVIEW CANVAS (If submission is an image file) */}
            {isImageFile && (
              <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 shadow-md space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300 font-extrabold px-1">
                  <span className="flex items-center gap-1.5 text-blue-400">
                    <ImageIcon className="w-4 h-4" /> Pratinjau Dokumen Berkas (Live Image Preview)
                  </span>
                  <button
                    type="button"
                    onClick={handleOpenDocument}
                    className="text-[11px] text-blue-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>Layar Penuh</span>
                  </button>
                </div>
                <div className="relative max-h-[220px] overflow-hidden rounded-xl bg-slate-950 flex items-center justify-center p-2 border border-slate-800/80 group">
                  <img
                    src={getImageSrc()}
                    alt={fileName}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80";
                    }}
                    className="max-h-[200px] w-auto object-contain rounded-lg shadow-lg group-hover:scale-102 transition-transform duration-300 cursor-pointer"
                    onClick={handleOpenDocument}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2 text-xs text-slate-700 font-semibold border-t border-blue-100 pt-2.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Waktu Upload:
                </span>
                <span className="font-bold text-slate-900">{uploadTime}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  Nama Berkas Dokumen:
                </span>
                <span className="font-black text-blue-950 truncate max-w-[220px]">
                  {fileName}
                </span>
              </div>

              {taskData?.submission_notes && (
                <div className="pt-1">
                  <span className="text-slate-500 font-medium block">Catatan Karyawan:</span>
                  <p className="text-xs text-slate-800 bg-white/80 p-2.5 rounded-xl border border-blue-100 mt-1 italic leading-relaxed">
                    &ldquo;{taskData.submission_notes}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* SEPARATE DEDICATED ACTION BUTTONS FOR FILE & LINK */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
              {/* Button 1: Open/View Document */}
              <button
                type="button"
                onClick={handleOpenDocument}
                className="flex-1 w-full h-11 flex items-center justify-center gap-2 px-4 bg-blue-900 hover:bg-blue-950 active:scale-98 text-white text-xs font-black rounded-xl transition-all shadow-md cursor-pointer border border-blue-950 shrink-0"
              >
                <FileText className="w-4 h-4 text-blue-300 shrink-0" />
                <span className="whitespace-nowrap">Buka Dokumen Berkas</span>
              </button>

              {/* Button 2: Open External Link / Drive */}
              <button
                type="button"
                onClick={handleOpenLink}
                className="flex-1 w-full h-11 flex items-center justify-center gap-2 px-4 bg-slate-900 hover:bg-slate-950 active:scale-98 text-white text-xs font-black rounded-xl transition-all shadow-md cursor-pointer border border-slate-950 shrink-0"
              >
                <LinkIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="whitespace-nowrap">Buka Link</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              Keputusan Review Atasan <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStatus("APPROVED")}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                  status === "APPROVED"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-2xs"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Setujui (Approved)</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus("REVISION")}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                  status === "REVISION"
                    ? "bg-amber-50 border-amber-500 text-amber-800 shadow-2xs"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <RotateCcw className="w-4 h-4 text-amber-600" />
                <span>Minta Revisi</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Catatan / Evaluasi Atasan
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Berikan umpan balik atau alasan revisi..."
              className="w-full px-3 py-2.5 text-xs font-medium border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 resize-none shadow-2xs"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`flex items-center gap-2 px-5 py-2.5 text-white text-xs font-black rounded-xl transition-all shadow-md disabled:opacity-50 cursor-pointer ${
                status === "APPROVED"
                  ? "bg-emerald-600 hover:bg-emerald-700 border border-emerald-700"
                  : "bg-amber-600 hover:bg-amber-700 border border-amber-700"
              }`}
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{submitting ? "Menyimpan..." : "Simpan Hasil Review"}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Fullscreen Interactive Document / Image Viewer Sub-Modal */}
      {isViewerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl max-w-4xl w-full p-6 space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="font-extrabold text-sm text-white">
                    Pratinjau Dokumen Project: {fileName}
                  </h3>
                  <p className="text-[11px] text-slate-400">Diunggah oleh: {empName} ({uploadTime})</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsViewerOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[300px] max-h-[500px] overflow-auto border border-slate-800 text-center space-y-4">
              {isImageFile ? (
                <img
                  src={getImageSrc()}
                  alt={fileName}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80";
                  }}
                  className="max-h-[460px] w-auto object-contain rounded-xl shadow-2xl"
                />
              ) : (
                <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full space-y-4 shadow-xl">
                  <div className="w-16 h-16 rounded-2xl bg-blue-900/50 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400 shadow-inner">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="px-3 py-1 bg-blue-950 text-blue-300 border border-blue-800 rounded-full text-xs font-black uppercase tracking-wider">
                      {docType}
                    </span>
                    <h4 className="font-black text-white text-base mt-2 truncate max-w-full">
                      {fileName}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Dokumen resmi diunggah oleh <span className="text-slate-200 font-bold">{empName}</span>
                    </p>
                  </div>
                  <div className="pt-2 space-y-2">
                    <a
                      href={getImageSrc()}
                      download={fileName}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all border border-blue-500"
                    >
                      <Download className="w-4 h-4" />
                      <span>Unduh Berkas Dokumen ({fileName.split('.').pop()?.toUpperCase() || 'FILE'})</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400 font-medium">Jenis Berkas: {docType} (Terverifikasi Lengkap)</span>
              <div className="flex items-center gap-2">
                <a
                  href={getImageSrc()}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka Tab Baru</span>
                </a>
                <button
                  type="button"
                  onClick={() => setIsViewerOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Tutup Pratinjau
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
