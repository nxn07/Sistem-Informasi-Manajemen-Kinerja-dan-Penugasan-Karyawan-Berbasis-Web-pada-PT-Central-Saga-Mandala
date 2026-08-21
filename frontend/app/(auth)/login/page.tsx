"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { authService } from "@/services/auth-service";
import { Toast } from "@/components/ui/Toast";
import { Mail, Lock, Loader2, KeyRound, CheckCircle2, X } from "lucide-react";
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
      if (savedRemember === "true") {
        const savedEmail = localStorage.getItem("simkap_remember_email");
        const savedPassword = localStorage.getItem("simkap_remember_password");
        if (savedEmail) setEmail(savedEmail);
        if (savedPassword) setPassword(savedPassword);
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
          localStorage.removeItem("simkap_remember_me");
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

  const [resetSent, setResetSent] = useState(false);

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);

    setTimeout(() => {
      const targetEmail = resetEmail || "putra.timur804@gmail.com";
      setResetLoading(false);
      setResetSent(true);
      setToast({
        type: "success",
        message: `Link Reset Password Berhasil Dikirim ke Email '${targetEmail}'! Silakan klik tombol di bawah untuk membuat password baru.`,
      });
    }, 600);
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
                placeholder="admin@gmail.com"
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

          {/* Remember Me Checkbox & Lupa Password Link */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs text-slate-700 font-bold cursor-pointer select-none">
                Remember Me
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-900 hover:bg-blue-950 active:scale-98 text-white font-extrabold rounded-xl text-xs flex items-center justify-center transition-all shadow-md disabled:opacity-50 cursor-pointer mt-2"
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

      {/* Modal Popup: Lupa Password & Kirim Link Reset Email */}
      {isForgotOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 relative">
            <button
              onClick={() => {
                setIsForgotOpen(false);
                setResetSent(false);
              }}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-200">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">
                  Pemulihan Lupa Password
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Kirim link token reset password ke email pegawai / manager
                </p>
              </div>
            </div>

            {!resetSent ? (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    Masukkan Email Pegawai / Manager / Admin
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={resetEmail || "putra.timur804@gmail.com"}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="putra.timur804@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
                    />
                  </div>
                </div>

                {/* Quick Select Buttons for Target Emails */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                  <p className="text-[11px] font-bold text-slate-500">Target Email Uji Coba Pemulihan:</p>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setResetEmail("putra.timur804@gmail.com")}
                      className="px-2.5 py-1 bg-white hover:bg-blue-50 text-blue-900 text-[11px] font-bold rounded-lg border border-blue-200 shadow-2xs cursor-pointer"
                    >
                      📧 putra.timur804@gmail.com (Default Uji Coba)
                    </button>
                    <button
                      type="button"
                      onClick={() => setResetEmail("admin@gmail.com")}
                      className="px-2.5 py-1 bg-white hover:bg-blue-50 text-slate-800 text-[11px] font-bold rounded-lg border border-slate-200 shadow-2xs cursor-pointer"
                    >
                      👑 admin@gmail.com
                    </button>
                    <button
                      type="button"
                      onClick={() => setResetEmail("sarah@gmail.com")}
                      className="px-2.5 py-1 bg-white hover:bg-blue-50 text-slate-800 text-[11px] font-bold rounded-lg border border-slate-200 shadow-2xs cursor-pointer"
                    >
                      👤 sarah@gmail.com
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-[11px] text-blue-900 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Sistem akan mengirim link tautan reset password unik ke email <strong>'{resetEmail || "putra.timur804@gmail.com"}'</strong>.</span>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white font-extrabold rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    {resetLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Mengirim Email...</span>
                      </>
                    ) : (
                      <span>Kirim Link Reset Password</span>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* Success Email Sent Banner & Direct Link Button */
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 space-y-2 shadow-2xs">
                  <div className="flex items-center gap-2 font-black text-sm text-emerald-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Link Reset Berhasil Terkirim!</span>
                  </div>
                  <p className="font-semibold text-xs leading-relaxed">
                    Sistem telah mensimulasikan pengiriman link reset password ke email:
                    <br />
                    <strong className="text-emerald-950 font-black text-sm">{resetEmail || "putra.timur804@gmail.com"}</strong>
                  </p>
                  <p className="text-[11px] text-emerald-700 font-medium">
                    Klik tombol di bawah ini untuk membuka tautan reset password dan membuat password baru Anda.
                  </p>
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotOpen(false);
                      setResetSent(false);
                      router.push(`/reset-password?email=${encodeURIComponent(resetEmail || "putra.timur804@gmail.com")}&token=reset_token_demo_9921`);
                    }}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                  >
                    <span>🔗 Buka Link Reset Password Email</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotOpen(false);
                      setResetSent(false);
                    }}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
                  >
                    Tutup Modal
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
