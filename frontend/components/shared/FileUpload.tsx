"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileCheck, X, Loader2 } from "lucide-react";
import api from "@/lib/api";

interface FileUploadProps {
  taskId?: number;
  onSuccess?: (fileUrl: string) => void;
}

export function FileUpload({ taskId, onSuccess }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    if (taskId) formData.append("task_id", taskId.toString());

    try {
      const response = await api.post("/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = response.data?.url || response.data?.data?.url;
      setUploadedUrl(url);
      if (onSuccess) onSuccess(url);
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal mengunggah file.");
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setUploadedUrl(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={inputRef}
        onChange={handleSelectFile}
        className="hidden"
        id="file-upload"
      />

      {!file ? (
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-6 cursor-pointer bg-slate-50 hover:bg-blue-50/50 transition-colors"
        >
          <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
          <span className="text-sm font-medium text-slate-700">Pilih file bukti atau lampiran</span>
          <span className="text-xs text-slate-400 mt-1">Mendukung PDF, PNG, JPG (Maks. 5MB)</span>
        </label>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <FileCheck className="w-6 h-6 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-slate-800 truncate max-w-xs">{file.name}</p>
              <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!uploadedUrl && (
              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Upload"}
              </button>
            )}
            <button
              type="button"
              onClick={clearFile}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-rose-600 mt-2">{error}</p>}
      {uploadedUrl && <p className="text-xs text-emerald-600 mt-2 font-medium">File berhasil diunggah!</p>}
    </div>
  );
}
