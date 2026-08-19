"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { SubmitTaskPayload } from "@/services/task-service";
import { UploadCloud, Link as LinkIcon, FileCheck, Loader2 } from "lucide-react";

interface SubmitTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: number | null;
  taskTitle?: string;
  onSubmit: (taskId: number, payload: SubmitTaskPayload) => Promise<void>;
}

export function SubmitTaskModal({
  isOpen,
  onClose,
  taskId,
  taskTitle,
  onSubmit,
}: SubmitTaskModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [submissionLink, setSubmissionLink] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskId) return;
    if (!file && !submissionLink.trim()) {
      setError("Silakan unggah file bukti atau cantumkan tautan hasil kerja.");
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
      setError(err.response?.data?.message || "Gagal mengumpulkan tugas.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Pengumpulan Tugas: ${taskTitle || ""}`}
      maxWidth="lg"
    >
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Lampirkan Berkas Bukti Kerja (PDF / Gambar)
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
                className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-xl cursor-pointer bg-slate-50 hover:bg-blue-50/40 transition-colors text-xs text-slate-600 font-medium"
              >
                <UploadCloud className="w-5 h-5 text-slate-400" />
                <span>Pilih Berkas Dari Komputer</span>
              </label>
            ) : (
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-xl bg-slate-50 text-xs">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium text-slate-800 truncate max-w-xs">{file.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-rose-500 hover:underline"
                >
                  Hapus
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
            <span>Tautan / Link Hasil Kerja (Google Drive, GitHub, Figma, dll.)</span>
          </label>
          <input
            type="url"
            value={submissionLink}
            onChange={(e) => setSubmissionLink(e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Catatan Tambahan untuk Atasan
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tuliskan penjelasan singkat mengenai pengumpulan tugas ini..."
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
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50"
          >
            {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{submitting ? "Mengirim..." : "Kumpulkan Tugas"}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
