"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeSlash, ShieldCheck, Warning } from "@phosphor-icons/react";
import { useAuth } from "@/components/admin/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace("/dashboard/admin");
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) { setError("Please fill in all fields"); return; }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      router.push("/dashboard/admin");
    } else {
      setError(result.error || "Login failed");
    }
  };

  if (isLoading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-matter">
        <div className="w-6 h-6 border-2 border-[#E08A3C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex font-matter bg-white">
      {/* Left — branding panel */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[540px] flex-col justify-between p-12 border-r border-[#EBEBEB] shrink-0 relative overflow-hidden">
        <Image src="/bg.png" alt="" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        <div className="relative z-10">
          <Image
            src="https://homeguruworld.com/wp-content/uploads/2022/04/Homeguru-Logo-1.png"
            alt="HomeGuru"
            width={140}
            height={40}
            className="object-contain brightness-0 invert drop-shadow-md"
            priority
          />
          <div className="mt-16">
            <h1 className="text-[36px] font-semibold text-white leading-tight font-season drop-shadow-lg">
              Admin<br />Command Center
            </h1>
            <p className="text-[14px] text-white/90 mt-4 leading-relaxed max-w-[340px] drop-shadow-sm">
              Super admin dashboard for HomeGuru platform operations, financial oversight, AI governance, and system control.
            </p>
          </div>
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3 px-4 py-3.5 bg-white/15 backdrop-blur-md rounded-xl border border-white/25 shadow-lg">
            <ShieldCheck size={18} weight="fill" className="text-[#E08A3C] shrink-0 drop-shadow-sm" />
            <div>
              <p className="text-[12px] font-semibold text-white">Aegis Auth Gateway</p>
              <p className="text-[10px] text-white/70">MFA enforced · Session timeout: 4h · All logins audit-logged</p>
            </div>
          </div>
          <p className="text-[10px] text-white/50 px-1">
            Protected by Aegis Security. Unauthorized access attempts are logged and reported.
          </p>
        </div>
      </div>

      {/* Right — login form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="lg:hidden mb-10">
            <Image
              src="https://homeguruworld.com/wp-content/uploads/2022/04/Homeguru-Logo-1.png"
              alt="HomeGuru"
              width={120}
              height={36}
              className="object-contain"
              priority
            />
          </div>

          <div className="mb-8">
            <h2 className="text-[22px] font-medium text-[#1A1A1A] font-season">Sign in</h2>
            <p className="text-[13px] text-[#ACACAC] mt-1.5">Enter your admin credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-[11px] font-medium text-[#999] uppercase tracking-wider mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="admin@homeguruworld.com"
                autoComplete="email"
                autoFocus
                className="w-full h-[46px] px-4 border border-[#EBEBEB] rounded-xl text-[14px] text-[#1A1A1A] placeholder:text-[#DCDCDC] focus:outline-none focus:border-[#E08A3C] focus:shadow-[0_0_0_3px_rgba(224,138,60,0.08)] transition-all font-matter bg-white"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-medium text-[#999] uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full h-[46px] px-4 pr-12 border border-[#EBEBEB] rounded-xl text-[14px] text-[#1A1A1A] placeholder:text-[#DCDCDC] focus:outline-none focus:border-[#E08A3C] focus:shadow-[0_0_0_3px_rgba(224,138,60,0.08)] transition-all font-matter bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#CACACA] hover:text-[#999] bg-transparent border-none cursor-pointer transition-colors"
                >
                  {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 bg-[#FFF1E6] border border-[#E08A3C]/15 rounded-xl">
                <Warning size={14} weight="fill" className="text-[#C2571A] shrink-0" />
                <p className="text-[12px] text-[#C2571A]">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full h-[46px] rounded-xl text-[14px] font-medium transition-all cursor-pointer border-none flex items-center justify-center gap-2 ${
                loading
                  ? "bg-[#F0F0F0] text-[#CACACA] cursor-not-allowed"
                  : "bg-[#1A1A1A] text-white hover:bg-[#333] active:scale-[0.98]"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#CACACA] border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Sign in to Dashboard"
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-8 px-4 py-3.5 bg-[#FAFAFA] rounded-xl border border-[#F0F0F0]">
            <p className="text-[10px] font-medium text-[#ACACAC] uppercase tracking-wider mb-2">Demo Credentials</p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#888]">admin@homeguruworld.com</span>
                <span className="text-[11px] font-mono text-[#CACACA]">admin123</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#888]">finance@homeguruworld.com</span>
                <span className="text-[11px] font-mono text-[#CACACA]">admin123</span>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-[#DCDCDC] text-center mt-6">
            HomeGuru Admin v2.0 · Aegis Auth Gateway · All sessions are monitored
          </p>
        </div>
      </div>
    </div>
  );
}
