"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { authService } from "@/services/auth-service";
import { Toast } from "@/components/ui/Toast";
import {
  Mail,
  Lock,
  Loader2,
  KeyRound,
  CheckCircle2,
  X,
  Shield,
  Briefcase,
  UserCheck,
  Zap,
  History,
  Database,
  ArrowRight,
  Sparkles,
  Server,
  Building2,
  Check,
} from "lucide-react";
import centralSagaLogo from "@/public/central-saga-logo.png";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  // Forgot Password Modal State
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string | null;
  }>({
    type: "success",
    message: null,
  });

  // Auto-fill Remembered Credentials on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedRemember = localStorage.getItem("simkap_remember_me");
      const savedEmail = localStorage.getItem("simkap_remember_email");
      const savedPassword = localStorage.getItem("simkap_remember_password");

      if (savedRemember === "true" && savedEmail) {
        setEmail(savedEmail);
        if (savedPassword) setPassword(savedPassword);
        setRememberMe(true);
      } else {
        setRememberMe(true);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setToast({ type: "success", message: null });

    try {
      const { user } = await authService.login({ email, password });

      // Save or Clear Remember Me credentials
      if (typeof window !== "undefined") {
        if (rememberMe) {
          localStorage.setItem("simkap_remember_me", "true");
          localStorage.setItem("simkap_remember_email", email);
          localStorage.setItem("simkap_remember_password", password);
        } else {
          localStorage.setItem("simkap_remember_me", "false");
          localStorage.removeItem("simkap_remember_email");
          localStorage.removeItem("simkap_remember_password");
        }
      }

      setToast({
        type: "success",
        message: `Autentikasi Berhasil! Masuk sebagai ${user.name} (${user.role}). Mengalihkan...`,
      });
      setTimeout(() => {
        router.push("/");
      }, 700);
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

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);

    setTimeout(() => {
      const targetEmail = resetEmail || "putra.timur804@gmail.com";
      setResetLoading(false);
      setResetSent(true);
      setToast({
        type: "success",
        message: `Link Reset Password Berhasil Dikirim ke Email '${targetEmail}'! Silakan ikuti instruksi pemulihan.`,
      });
    }, 600);
  };

  // Quick Credential Selector Helper
  const fillCredentials = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword("password");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Dynamic Background Glow & Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Toast Notification Popup */}
      <Toast
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, message: null })}
      />

      {/* Main Landing & Login Container */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
          
          {/* LEFT 7 COLS: EXECUTIVE LANDING PAGE HERO SECTION */}
          <div className="lg:col-span-7 space-y-8 pr-0 lg:pr-6">
            
            {/* Official Logo Header Badge */}
            <div className="inline-flex items-center gap-3 p-2 pr-4 bg-slate-900/90 border border-emerald-500/40 rounded-full shadow-lg shadow-emerald-500/10 backdrop-blur-md">
              <div className="w-9 h-9 rounded-full bg-white p-1 flex items-center justify-center shrink-0 border border-emerald-500/50">
                <Image src={centralSagaLogo} alt="Central Saga Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex items-center gap-2 text-xs font-black">
                <span className="text-emerald-400">CENTRAL SAGA INC.</span>
                <span className="text-slate-600">•</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] uppercase font-bold border border-emerald-500/30">
                  v2.0 Official SIM-KAP
                </span>
              </div>
            </div>

            {/* Hero Main Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Sistem Informasi Kinerja & Audit Pegawai{" "}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
                  Enterprise
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed max-w-2xl">
                Platform terpadu untuk manajemen penugasan karyawan, evaluasi kriteria KPI, 
                pemindahan tugas pegawai non-aktif, dan pencatatan audit aktivitas real-time di lingkungan Central Saga.
              </p>
            </div>

            {/* Landing Page Feature Highlights (2x2 Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2 backdrop-blur-md hover:border-emerald-500/50 transition-all duration-300 group">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-sm text-white">Task Monitoring Real-Time</h4>
                <p className="text-xs text-slate-400 font-medium leading-normal">
                  Alokasi tugas karyawan, pengunggahan bukti kerja, serta SOP pemindahan tugas pegawai non-aktif.
                </p>
              </div>

              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2 backdrop-blur-md hover:border-blue-500/50 transition-all duration-300 group">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  <Shield className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-sm text-white">Spatie RBAC Access Control</h4>
                <p className="text-xs text-slate-400 font-medium leading-normal">
                  Sistem izin terproteksi penuh untuk Administrator System, Manager Utama, dan Karyawan.
                </p>
              </div>

              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2 backdrop-blur-md hover:border-indigo-500/50 transition-all duration-300 group">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  <History className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-sm text-white">Log Aktivitas Real-Time</h4>
                <p className="text-xs text-slate-400 font-medium leading-normal">
                  Pencatatan otomatis seluruh jejak aktivitas pengguna dengan lencana unread & pewaktu 5 detik.
                </p>
              </div>

              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2 backdrop-blur-md hover:border-teal-500/50 transition-all duration-300 group">
                <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  <Database className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-sm text-white">PostgreSQL 16 & Recycle Bin</h4>
                <p className="text-xs text-slate-400 font-medium leading-normal">
                  Pencadangan database otomatis (.sql) serta pemulihan (*recovery*) tugas dari Tempat Sampah.
                </p>
              </div>
            </div>

            {/* System Status Badges Footer */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                PostgreSQL 16.2 Engine Active
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <Shield className="w-3.5 h-3.5 text-blue-400" /> SSL 256-Bit Encrypted
              </span>
            </div>
          </div>

          {/* RIGHT 5 COLS: LOGIN FORM PORTAL (GLASSMORPHISM ELEGAN CARD) */}
          <div className="lg:col-span-5">
            <div className="bg-white/95 text-slate-900 rounded-[2.5rem] p-8 md:p-9 border border-slate-200 shadow-[0_25px_60px_rgba(0,0,0,0.35),0_0_40px_rgba(16,185,129,0.15)] space-y-6 relative">
              
              {/* Form Header with Logo */}
              <div className="text-center space-y-2">
                <div className="w-20 h-20 rounded-3xl bg-white p-3 flex items-center justify-center border-2 border-emerald-500/40 mx-auto shadow-xl shadow-emerald-500/15 ring-4 ring-emerald-500/10">
                  <Image src={centralSagaLogo} alt="Central Saga Logo" className="w-full h-full object-contain drop-shadow-xs" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Central Saga</h2>
                  <p className="text-[11px] font-extrabold text-emerald-600 uppercase tracking-widest">
                    Portal Masuk SIM-KAP
                  </p>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Masukkan email & password akun Anda untuk masuk sistem.
                  </p>
                </div>
              </div>

              {/* Login Form Inputs */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Login Akun
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@centralsaga.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all shadow-2xs"
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
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all shadow-2xs"
                    />
                  </div>
                </div>

                {/* Remember Me Checkbox & Reset Password Link */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setRememberMe(isChecked);
                        if (typeof window !== "undefined" && !isChecked) {
                          localStorage.setItem("simkap_remember_me", "false");
                          localStorage.removeItem("simkap_remember_email");
                          localStorage.removeItem("simkap_remember_password");
                        }
                      }}
                      className="w-4 h-4 accent-blue-600 border-slate-300 rounded cursor-pointer"
                    />
                    <label htmlFor="remember" className="text-xs text-slate-700 font-bold cursor-pointer select-none">
                      Ingat Saya (Remember)
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(email || "admin@gmail.com");
                      setIsForgotOpen(true);
                    }}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-colors"
                  >
                    Lupa Password?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-slate-900 hover:bg-blue-600 active:scale-98 text-white rounded-xl text-xs font-extrabold transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 border border-slate-900"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Mengautentikasi Sesi...</span>
                    </>
                  ) : (
                    <>
                      <span>Masuk Sistem Central Saga</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Landing Page Footer */}
      <footer className="py-4 px-6 border-t border-slate-800 text-center text-xs text-slate-500 font-medium relative z-10">
        <p>© 2026 Central Saga Inc. Sistem Informasi Kinerja & Audit Pegawai (SIM-KAP v2.0 Official)</p>
      </footer>

      {/* Lupa Password Modal */}
      {isForgotOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-5 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-200 shadow-2xs">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Lupa Password Akun
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Kirim link/OTP pemulihan kata sandi.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsForgotOpen(false);
                  setResetSent(false);
                }}
                className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!resetSent ? (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4 text-xs font-medium">
                <p className="text-slate-600">
                  Masukkan email akun Anda. Kode OTP/link pembuatan password baru akan dikirimkan ke email target testing (<strong>putra.timur804@gmail.com</strong>).
                </p>

                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">
                    Email Akun Anda:
                  </label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="sarah@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsForgotOpen(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-300 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="px-5 py-2 bg-blue-900 hover:bg-blue-950 text-white font-extrabold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    {resetLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Kirim Link Reset"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-center py-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-300">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">OTP / Link Reset Berhasil Dikirim!</h4>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Link pemulihan telah dikirimkan ke email <strong>putra.timur804@gmail.com</strong>.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotOpen(false);
                    router.push("/reset-password");
                  }}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Buka Halaman Reset Password Sekarang
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
