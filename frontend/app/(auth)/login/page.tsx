"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { authService } from "@/services/auth-service";
import { Toast } from "@/components/ui/Toast";
import { Mail, Lock, Loader2 } from "lucide-react";
import centralSagaLogo from "@/public/central-saga-logo.png";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string | null;
  }>({
    type: "success",
    message: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setToast({ type: "success", message: null });

    try {
      const { user } = await authService.login({ email, password });
      setToast({
        type: "success",
        message: `Autentikasi Berhasil! Masuk sebagai ${user.name} (${user.role}). Mengalihkan...`,
      });
      setTimeout(() => {
        router.push("/");
      }, 800);
    } catch (err: any) {
      setToast({
        type: "error",
        message:
          err.message ||
          err.response?.data?.message ||
          "Gagal Masuk: Kombinasi email atau password salah (401 Unauthorized).",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Subtle Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60" />

      {/* Floating Success / Error Toast Popup */}
      <Toast
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, message: null })}
      />

      <div className="max-w-md w-full bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-9 relative z-10 border border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.14),0_0_35px_rgba(16,185,129,0.12)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.18),0_0_45px_rgba(16,185,129,0.18)] transition-all duration-300 space-y-6">
        {/* Brand Header with Official Central Saga Green Logo & Name */}
        <div className="text-center">
          <div className="w-20 h-20 rounded-3xl bg-white p-3.5 flex items-center justify-center border-2 border-emerald-500/40 mx-auto mb-4 shadow-xl shadow-emerald-500/15 ring-4 ring-emerald-500/10 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300">
            <Image src={centralSagaLogo} alt="Central Saga" className="w-full h-full object-contain drop-shadow-xs" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Central Saga
          </h1>
          <p className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest mt-0.5">
            Enterprise Performance
          </p>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Sistem Informasi Kinerja & Audit Pegawai (SIM-KAP)
          </p>
        </div>

        {/* Clean Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Email / Username
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
              <input
                type="email"
                required
                suppressHydrationWarning
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@centralsaga.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
              <input
                type="password"
                required
                suppressHydrationWarning
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="remember"
              defaultChecked
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="remember" className="text-xs text-slate-600 font-medium cursor-pointer">
              Remember Me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-900 hover:bg-blue-950 active:scale-98 text-white font-bold rounded-xl text-xs flex items-center justify-center transition-all shadow-md disabled:opacity-50 cursor-pointer mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span>Memproses Autentikasi...</span>
              </>
            ) : (
              <span>Masuk ke Dashboard</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
