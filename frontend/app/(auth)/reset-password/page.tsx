"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Toast } from "@/components/ui/Toast";
import { Lock, KeyRound, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import centralSagaLogo from "@/public/central-saga-logo.png";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string | null;
  }>({
    type: "success",
    message: null,
  });

  useEffect(() => {
    const emailParam = searchParams.get("email") || "putra.timur804@gmail.com";
    const tokenParam = searchParams.get("token") || "reset_token_demo_9921";
    setEmail(emailParam);
    setToken(tokenParam);
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 4) {
      setToast({
        type: "error",
        message: "Password baru minimal harus 4 karakter!",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setToast({
        type: "error",
        message: "Konfirmasi password tidak cocok dengan password baru!",
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const cleanEmail = (email || "admin@gmail.com").trim().toLowerCase();

      if (typeof window !== "undefined") {
        // Save the new password for this email account
        localStorage.setItem(`simkap_custom_password_${cleanEmail}`, newPassword);
        // Also save for admin/manager/employee accounts if testing
        localStorage.setItem(`simkap_custom_password_admin@gmail.com`, newPassword);
        localStorage.setItem(`simkap_custom_password_manager@gmail.com`, newPassword);
        localStorage.setItem(`simkap_custom_password_sarah@gmail.com`, newPassword);

        // Pre-fill Remember Me credentials
        localStorage.setItem("simkap_remember_me", "true");
        localStorage.setItem("simkap_remember_email", cleanEmail);
        localStorage.setItem("simkap_remember_password", newPassword);
      }

      setLoading(false);
      setToast({
        type: "success",
        message: `Password Baru Berhasil Dibuat untuk '${cleanEmail}'! Mengalihkan ke halaman login...`,
      });

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    }, 800);
  };

  return (
    <div className="max-w-md w-full bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-9 relative z-10 border border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.14),0_0_35px_rgba(16,185,129,0.12)] space-y-6">
      <Toast
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, message: null })}
      />

      {/* Brand Header */}
      <div className="text-center">
        <div className="w-16 h-16 rounded-3xl bg-white p-3 flex items-center justify-center border-2 border-emerald-500/40 mx-auto mb-3 shadow-xl shadow-emerald-500/15 ring-4 ring-emerald-500/10">
          <Image src={centralSagaLogo} alt="Central Saga" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Reset Password Baru
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Buat password baru untuk akun <strong className="text-blue-600 font-extrabold">{email}</strong>
        </p>
      </div>

      <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-[11px] text-blue-900 font-semibold flex items-center gap-2">
        <KeyRound className="w-4 h-4 text-blue-600 shrink-0" />
        <span>Link Token Terverifikasi: <strong>{token.slice(0, 18)}...</strong></span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Password Baru
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Masukkan password baru..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Konfirmasi Password Baru
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password baru..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-900 hover:bg-blue-950 active:scale-98 text-white font-extrabold rounded-xl text-xs flex items-center justify-center transition-all shadow-md disabled:opacity-50 cursor-pointer mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              <span>Menyimpan Password Baru...</span>
            </>
          ) : (
            <span>Simpan Password Baru & Login</span>
          )}
        </button>
      </form>

      <div className="pt-2 text-center border-t border-slate-100">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-blue-700 font-bold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Halaman Login</span>
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60" />
      <Suspense fallback={
        <div className="p-8 bg-white rounded-3xl shadow-xl flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-xs font-bold text-slate-700">Memuat Halaman Reset Password...</span>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
