"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth-service";
import { Toast } from "@/components/ui/Toast";
import { Mail, Lock, Loader2, Sparkles, ShieldCheck, UserCheck, Briefcase } from "lucide-react";

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

  const executeLogin = async (loginEmail: string, loginPass: string, roleTitle: string) => {
    setLoading(true);
    setToast({ type: "success", message: null });

    try {
      const { user } = await authService.login({ email: loginEmail, password: loginPass });
      setToast({
        type: "success",
        message: `Autentikasi Berhasil! Masuk sebagai ${user.name} (${user.role}). Mengalihkan ke Dashboard...`,
      });
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (err: any) {
      setToast({
        type: "error",
        message:
          err.response?.data?.message ||
          "Gagal Masuk: Kombinasi email atau password salah (401 Unauthorized).",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeLogin(email, password, "User");
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

      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 relative z-10 backdrop-blur-sm space-y-6">
        {/* Brand Header with Central Saga Logo */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold mx-auto mb-3 shadow-md">
            <Sparkles className="w-6 h-6 text-blue-200" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Performa.id
          </h1>
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-0.5">
            Central Saga Enterprise
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Sistem Informasi Kinerja & Audit Pegawai (SIM-KAP)
          </p>
        </div>

        {/* 1-Click Role Login Demo Picker */}
        <div className="space-y-2">
          <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider text-center">
            Demo Login 1-Klik Berdasarkan Role Spatie RBAC:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail("admin@gmail.com");
                setPassword("password");
                executeLogin("admin@gmail.com", "password", "ADMIN");
              }}
              className="p-3 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 rounded-2xl text-left transition-all cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center gap-1.5 font-bold text-rose-900 text-xs mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>ADMIN</span>
              </div>
              <p className="text-[10px] text-rose-700 font-medium leading-tight">
                Full System Control (8 Menu Sidebar)
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setEmail("manager@gmail.com");
                setPassword("password");
                executeLogin("manager@gmail.com", "password", "MANAGER");
              }}
              className="p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 rounded-2xl text-left transition-all cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center gap-1.5 font-bold text-blue-900 text-xs mb-1">
                <Briefcase className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>MANAGER</span>
              </div>
              <p className="text-[10px] text-blue-700 font-medium leading-tight">
                Assign & Review (5 Menu Sidebar)
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setEmail("employee@gmail.com");
                setPassword("password");
                executeLogin("employee@gmail.com", "password", "EMPLOYEE");
              }}
              className="p-3 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 rounded-2xl text-left transition-all cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs mb-1">
                <UserCheck className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span>EMPLOYEE</span>
              </div>
              <p className="text-[10px] text-slate-600 font-medium leading-tight">
                Submit & Scorecard (3 Menu Sidebar)
              </p>
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider absolute">
            atau masukan manual
          </span>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Email / Username
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gmail.com / manager@gmail.com / employee@gmail.com"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all"
              />
            </div>
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
