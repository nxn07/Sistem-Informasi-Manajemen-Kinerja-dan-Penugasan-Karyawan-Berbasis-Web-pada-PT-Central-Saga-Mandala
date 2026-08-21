"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { SubmitTaskPayload } from "@/services/task-service";
import { UploadCloud, Link as LinkIcon, FileCheck, Loader2, Edit3, RefreshCw } from "lucide-react";
import { Task } from "@/types/api";

interface SubmitTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: number | null;
  taskTitle?: string;
  taskData?: Task | null;
  onSubmit: (taskId: number, payload: SubmitTaskPayload) => Promise<void>;
}

export function SubmitTaskModal({
  isOpen,
  onClose,
  taskId,
  taskTitle,
  taskData,
  onSubmit,
}: SubmitTaskModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [submissionLink, setSubmissionLink] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync existing data when editing/updating document
  useEffect(() => {
    if (taskData) {
      setSubmissionLink(taskData.submission_link || "");
      setNotes(taskData.submission_notes || "");
    } else {
      setSubmissionLink("");
      setNotes("");
    }
    setFile(null);
    setError(null);
  }, [taskData, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskId) return;
    
    // Check if there is a file, link, or existing file
    const hasExistingFile = Boolean(taskData?.submission_file || taskData?.submission_link);
    if (!file && !submissionLink.trim() && !hasExistingFile) {
      setError("Silakan unggah berkas bukti baru atau cantumkan tautan hasil kerja.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onSubmit(taskId, {
        file: file || undefined,
        submission_link: submissionLink.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      onClose();
      setFile(null);
      setSubmissionLink("");
      setNotes("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal memperbarui dokumen tugas.");
    } finally {
      setSubmitting(false);
    }
  };

  const isUpdating = Boolean(taskData?.submission_file || taskData?.submission_link || taskData?.status === "SUBMITTED" || taskData?.status === "REVISION");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isUpdating ? `Perbarui Dokumen Tugas: ${taskTitle || taskData?.title || ""}` : `Pengumpulkan Tugas: ${taskTitle || taskData?.title || ""}`}
      maxWidth="lg"
    >
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-bold">
            {error}
          </div>
        )}

        {/* Existing Attached File Notification */}
        {taskData?.submission_file && !file && (
          <div className="p-3.5 border border-blue-200 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 text-xs flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5">
              <FileCheck className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <span className="text-[10.5px] text-blue-700 font-extrabold block uppercase tracking-wide">
                  Dokumen Terpasang Saat Ini:
                </span>
                <span className="font-black text-blue-950 truncate max-w-xs block text-xs mt-0.5">
                  {taskData.submission_file}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-black text-blue-800 bg-blue-100 px-2.5 py-1 rounded-full border border-blue-200">
              Siap Diperbarui
            </span>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
            <span>Lampirkan / Ganti Berkas Bukti Kerja (PDF / Word / Gambar)</span>
            {isUpdating && <span className="text-[10.5px] text-blue-600 font-semibold">*Pilih file baru jika ingin mengganti</span>}
          </label>
          <div className="relative">
            <input
              type="file"
              onChange={handleFileChange}
              id="submit-file-input"
              className="hidden"
            />
            {!file ? (
              <label
                htmlFor="submit-file-input"
                className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl cursor-pointer bg-slate-50/80 hover:bg-blue-50/40 transition-colors text-xs text-slate-700 font-bold"
              >
                <UploadCloud className="w-5 h-5 text-blue-600" />
                <span>{isUpdating ? "Pilih Berkas Baru Dari Komputer" : "Pilih Berkas Dari Komputer"}</span>
              </label>
            ) : (
              <div className="flex items-center justify-between p-3.5 border border-emerald-300 rounded-2xl bg-emerald-50/60 text-xs">
                <div className="flex items-center gap-2.5">
                  <FileCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-emerald-700 font-bold block uppercase">Berkas Baru Dipilih:</span>
                    <span className="font-extrabold text-slate-900 truncate max-w-xs block">{file.name}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-rose-600 hover:text-rose-700 font-bold bg-white px-2.5 py-1 rounded-lg border border-rose-200 text-[11px]"
                >
                  Batalkan
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1">
            <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
            <span>Tautan / Link Hasil Kerja <span className="text-slate-400 font-normal">(Opsional - Google Drive, GitHub, Figma, dll.)</span></span>
          </label>
          <input
            type="url"
            value={submissionLink}
            onChange={(e) => setSubmissionLink(e.target.value)}
            placeholder="https://drive.google.com/..."
            className="w-full px-3.5 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Catatan Tambahan / Keterangan Pembaharuan
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tuliskan penjelasan singkat mengenai berkas atau revisi tugas ini..."
            className="w-full px-3.5 py-2.5 text-xs font-semibold border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3.5 border-t border-slate-200">
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
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-900 hover:bg-blue-950 text-white text-xs font-black rounded-xl transition-all shadow-md disabled:opacity-50 border border-blue-950 cursor-pointer"
          >
            {submitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : isUpdating ? (
              <RefreshCw className="w-3.5 h-3.5 text-blue-300" />
            ) : (
              <UploadCloud className="w-3.5 h-3.5 text-blue-300" />
            )}
            <span>{submitting ? "Memproses..." : isUpdating ? "Perbarui Dokumen Bukti" : "Kumpulkan Tugas"}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
