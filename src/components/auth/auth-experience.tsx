"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Bolt,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { usePortalStore, useStoreHydrated } from "@/stores/portal-store";

function StusMark({ size = "md" }: { size?: "sm" | "md" }) {
  const box = size === "sm" ? "size-9" : "size-11";
  const px = size === "sm" ? 36 : 44;
  return (
    <span className={`relative ${box} overflow-hidden rounded-xl shadow-[0_8px_24px_rgba(1,63,146,.28)]`}>
      <Image
        src="/assests/images/Logo_stus.webp"
        alt="STUS"
        width={px}
        height={px}
        className="size-full object-cover"
        priority
      />
    </span>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.6h5.1c-.2 1.2-.9 2.3-1.9 3l3.1 2.4c1.8-1.7 2.8-4.1 2.8-7 0-.7-.1-1.3-.2-1.9H12z" />
      <path fill="#34A853" d="M5.3 14.3l-.8.6-2.8 2.2C3.6 20.3 7.5 23 12 23c3 0 5.5-1 7.3-2.7l-3.1-2.4c-.9.6-2 1-3.2 1-2.5 0-4.6-1.7-5.4-4z" />
      <path fill="#FBBC05" d="M1.7 7c-.5 1-.8 2.1-.8 3.3s.3 2.3.8 3.3c0 .1 3.6-2.8 3.6-2.8-.2-.6-.3-1.2-.3-1.8s.1-1.2.3-1.8L1.7 7z" />
      <path fill="#4285F4" d="M12 4.8c1.6 0 3.1.6 4.2 1.6L19.1 4C17.1 2.1 14.7 1 12 1 7.5 1 3.6 3.7 1.7 7l3.6 2.8C6.1 6.5 8.8 4.8 12 4.8z" />
    </svg>
  );
}

function ProductVisual() {
  return (
    <div className="relative mx-auto mt-8 w-full max-w-[480px]">
      {/* Floating avatars */}
      <div className="absolute -left-2 top-10 z-20 size-10 overflow-hidden rounded-full border-2 border-white/30 bg-[#0254b3] shadow-xl" />
      <div className="absolute right-2 top-4 z-20 size-9 overflow-hidden rounded-full border-2 border-white/30 bg-[#7eb4e6] shadow-xl" />
      <div className="absolute -right-1 bottom-24 z-20 size-8 overflow-hidden rounded-full border-2 border-white/30 bg-[#013f92] shadow-xl" />

      {/* Chat bubbles */}
      <div className="absolute -left-4 top-28 z-20 max-w-[150px] rounded-2xl rounded-bl-md bg-white px-3 py-2 text-[11px] font-semibold leading-4 text-[#013f92] shadow-xl">
        Need help with my supplier account
      </div>
      <div className="absolute -right-2 top-20 z-20 max-w-[140px] rounded-2xl rounded-br-md bg-gradient-to-r from-[#013f92] to-[#0254b3] px-3 py-2 text-[11px] font-semibold leading-4 text-white shadow-xl">
        Context ready — connecting you now
      </div>

      {/* Laptop shell */}
      <div className="relative z-10 mx-auto w-[88%]">
        <div className="overflow-hidden rounded-t-[14px] border border-white/15 bg-[#0a1628] shadow-[0_40px_80px_rgba(0,0,0,.55)]">
          <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
            <span className="size-2 rounded-full bg-[#ff5f57]" />
            <span className="size-2 rounded-full bg-[#febc2e]" />
            <span className="size-2 rounded-full bg-[#28c840]" />
            <span className="ml-2 text-[10px] text-slate-500">STUS Support</span>
          </div>
          <div className="grid grid-cols-[0.9fr_1.1fr] gap-2 p-3">
            <div className="space-y-1.5">
              {["Amna Siddiqui", "Bilal Raza", "Hira Nadeem"].map((name, i) => (
                <div
                  key={name}
                  className={`flex items-center gap-2 rounded-lg px-2 py-1.5 ${i === 0 ? "bg-[#013f92]/50" : "bg-white/[0.04]"}`}
                >
                  <span className="grid size-6 place-items-center rounded-full bg-[#0254b3] text-[8px] font-bold text-white">
                    {name.split(" ").map((p) => p[0]).join("")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[9px] font-semibold text-white">{name}</span>
                    <span className="mt-0.5 block h-1 w-14 rounded-full bg-white/20" />
                  </span>
                </div>
              ))}
            </div>
            <div className="rounded-lg bg-white/[0.04] p-2">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[9px] font-semibold text-slate-300">Response trend</span>
                <span className="text-[8px] text-emerald-400">+12%</span>
              </div>
              <div className="flex h-20 items-end gap-1">
                {[32, 48, 40, 62, 55, 78, 60, 88, 70, 95].map((h, i) => (
                  <span
                    key={i}
                    className="flex-1 rounded-t bg-gradient-to-t from-[#013f92] to-[#7eb4e6]"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto h-2.5 w-[104%] rounded-b-xl bg-[#1a2438]" />
        <div className="mx-auto h-1 w-[28%] rounded-b-md bg-[#111827]" />
      </div>
    </div>
  );
}

function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="grid min-h-dvh overflow-hidden bg-[#eef1f7] lg:grid-cols-2">
      {/* LEFT — marketing */}
      <section className="relative hidden min-h-dvh overflow-hidden bg-[#070d1a] px-10 py-9 text-white xl:px-14 lg:flex lg:flex-col">
        {/* Network glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(2,84,179,.45), transparent 28%), radial-gradient(circle at 70% 60%, rgba(1,63,146,.35), transparent 32%), radial-gradient(circle at 40% 80%, rgba(126,180,230,.2), transparent 24%)",
          }}
        />
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-30"
          aria-hidden
        >
          <defs>
            <linearGradient id="line" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0254b3" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#7eb4e6" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <path d="M40 120 C180 80, 260 220, 420 160 S680 80, 820 200" fill="none" stroke="url(#line)" strokeWidth="1.5" />
          <path d="M20 320 C160 280, 300 400, 480 340 S720 260, 900 380" fill="none" stroke="url(#line)" strokeWidth="1.2" />
          <path d="M80 480 C220 420, 360 560, 540 500 S780 420, 960 540" fill="none" stroke="url(#line)" strokeWidth="1" />
          {[
            [120, 100],
            [280, 180],
            [450, 150],
            [620, 210],
            [200, 340],
            [400, 360],
            [700, 300],
            [180, 470],
            [520, 510],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="3.5" fill="#7eb4e6" opacity="0.75" />
          ))}
        </svg>

        <a href="https://stus.digital" className="relative z-10 inline-flex items-center gap-3">
          <StusMark />
          <span>
            <span className="block text-[20px] font-extrabold leading-none tracking-[0.08em]">STUS</span>
            <span className="mt-1.5 block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7eb4e6]">
              Chat Portal
            </span>
          </span>
        </a>

        <div className="relative z-10 mt-12 max-w-[520px]">
          <h1 className="text-[2.85rem] font-extrabold leading-[1.1] tracking-[-0.04em] xl:text-[3.1rem]">
            Better conversations. Stronger{" "}
            <span className="relative inline-block text-[#7eb4e6]">
              connections.
              <span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-gradient-to-r from-[#013f92] to-[#7eb4e6]" />
            </span>
          </h1>
          <p className="mt-5 max-w-[46ch] text-[14.5px] leading-7 text-slate-400">
            One secure workspace for STUS buyer and supplier support — with context, routing and live chat in a single place.
          </p>

          <ul className="mt-8 space-y-4">
            {[
              {
                icon: ShieldCheck,
                title: "Secure & Reliable",
                detail: "Encrypted sessions with role-based access.",
                tone: "bg-[#013f92]",
              },
              {
                icon: Bolt,
                title: "Real-time Support",
                detail: "Instant handoff from chatbot to agent.",
                tone: "bg-[#0254b3]",
              },
              {
                icon: Users,
                title: "Team Collaboration",
                detail: "Shared notes, assignment and history.",
                tone: "bg-[#012f70]",
              },
            ].map(({ icon: Icon, title, detail, tone }) => (
              <li key={title} className="flex items-start gap-3.5">
                <span className={`grid size-10 shrink-0 place-items-center rounded-full ${tone} text-white shadow-[0_8px_20px_rgba(1,63,146,.35)]`}>
                  <Icon size={17} />
                </span>
                <span>
                  <span className="block text-[13.5px] font-bold text-white">{title}</span>
                  <span className="mt-0.5 block text-[12.5px] leading-5 text-slate-400">{detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 mt-auto pb-2">
          <ProductVisual />
        </div>
      </section>

      {/* RIGHT — form */}
      <section className="relative flex min-h-dvh flex-col items-center justify-center px-5 py-10 sm:px-8">
        <div className="mb-7 flex w-full max-w-[400px] items-center gap-3 lg:hidden">
          <StusMark size="sm" />
          <span>
            <span className="block text-lg font-extrabold tracking-[0.08em] text-[#070d1a]">STUS</span>
            <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#013f92]">
              Chat Portal
            </span>
          </span>
        </div>

        <div className="w-full max-w-[400px] rounded-[24px] bg-white px-8 py-9 shadow-[0_20px_60px_rgba(15,35,70,.12)]">
          {children}
        </div>

        <p className="mt-7 flex items-center gap-2 text-[12px] text-slate-400">
          <LockKeyhole size={13} />
          Your security is our priority
        </p>
      </section>
    </main>
  );
}

const fieldClass =
  "h-[48px] w-full rounded-[12px] border border-slate-200 bg-white pl-11 pr-4 text-[13.5px] text-[#12254e] outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#013f92] focus:ring-4 focus:ring-[#013f92]/12";

const loginSchema = z.object({
  email: z.string().email("Enter a valid work email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean(),
});
type LoginValues = z.infer<typeof loginSchema>;

export function LoginExperience() {
  const router = useRouter();
  const hydrated = useStoreHydrated();
  const authenticated = usePortalStore((state) => state.authenticated);
  const signIn = usePortalStore((state) => state.signIn);
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "ayesha@stus.digital",
      password: "support123",
      remember: true,
    },
  });

  useEffect(() => {
    if (hydrated && authenticated) router.replace("/dashboard");
  }, [authenticated, hydrated, router]);

  return (
    <AuthShell>
      <div className="text-center">
        <span className="mx-auto mb-4 grid size-[52px] place-items-center rounded-2xl border border-slate-100 bg-white shadow-sm">
          <StusMark size="sm" />
        </span>
        <h2 className="text-[1.65rem] font-bold tracking-[-0.03em] text-[#0b1f4d]">Welcome back!</h2>
        <p className="mt-1.5 text-[13px] text-slate-500">Sign in to continue to your account</p>
        <span className="mx-auto mt-3 block h-[3px] w-14 rounded-full bg-gradient-to-r from-[#013f92] to-[#0254b3]" />
      </div>

      <form
        className="mt-7 space-y-4"
        onSubmit={handleSubmit(async ({ email }) => {
          await new Promise((resolve) => setTimeout(resolve, 500));
          signIn(email);
          router.push("/dashboard");
        })}
      >
        <label className="block text-left">
          <span className="mb-1.5 block text-[12px] font-semibold text-[#334155]">Email Address</span>
          <span className="relative block">
            <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              autoFocus
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={fieldClass}
              {...register("email")}
            />
          </span>
          {errors.email && (
            <span id="email-error" role="alert" className="mt-1.5 block text-[11px] font-medium text-red-600">
              {errors.email.message}
            </span>
          )}
        </label>

        <label className="block text-left">
          <span className="mb-1.5 block text-[12px] font-semibold text-[#334155]">Password</span>
          <span className="relative block">
            <LockKeyhole size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : capsLock ? "caps-lock" : undefined}
              onKeyDown={(event) => setCapsLock(event.getModifierState("CapsLock"))}
              onKeyUp={(event) => setCapsLock(event.getModifierState("CapsLock"))}
              className={`${fieldClass} pr-11`}
              {...register("password")}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-1.5 top-1.5 grid size-9 cursor-pointer place-items-center rounded-lg text-slate-400 hover:text-[#013f92]"
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </span>
          {capsLock && !errors.password && (
            <span id="caps-lock" className="mt-1.5 block text-[11px] font-medium text-amber-700">
              Caps Lock is on
            </span>
          )}
          {errors.password && (
            <span id="password-error" role="alert" className="mt-1.5 block text-[11px] font-medium text-red-600">
              {errors.password.message}
            </span>
          )}
        </label>

        <div className="flex items-center justify-between gap-3 pt-0.5">
          <label className="flex cursor-pointer items-center gap-2 text-[12.5px] text-slate-600">
            <input type="checkbox" className="size-4 rounded accent-[#013f92]" {...register("remember")} />
            Remember me
          </label>
          <Link href="/forgot-password" className="text-[12.5px] font-semibold text-[#013f92] hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-1 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[12px] bg-gradient-to-r from-[#013f92] via-[#0254b3] to-[#3d7fd4] text-[14px] font-semibold text-white shadow-[0_12px_28px_rgba(1,63,146,.3)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
          {!isSubmitting && <ArrowRight size={16} />}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-slate-200" />
        <span className="text-[12px] text-slate-400">or continue with</span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <button
        type="button"
        className="flex h-11 w-full cursor-pointer items-center justify-center gap-3 rounded-[12px] border border-slate-200 bg-white text-[13px] font-medium text-[#1b2948] transition hover:bg-slate-50"
      >
        <GoogleIcon />
        Sign in with Google
      </button>

      <p className="mt-6 text-center text-[12.5px] text-slate-500">
        Need help?{" "}
        <a href="mailto:support@stus.digital" className="font-semibold text-[#013f92] hover:underline">
          Contact support
        </a>
      </p>
    </AuthShell>
  );
}

const emailSchema = z.object({ email: z.string().email("Enter a valid email") });

export function PasswordExperience({ reset = false }: { reset?: boolean }) {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  return (
    <AuthShell>
      <Link href="/login" className="mb-6 inline-flex items-center gap-2 text-[13px] font-semibold text-[#013f92]">
        <ArrowLeft size={16} /> Back to sign in
      </Link>

      {sent ? (
        <div className="text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={24} />
          </span>
          <h2 className="mt-5 text-[1.45rem] font-bold tracking-[-0.03em] text-[#0b1f4d]">Check your inbox</h2>
          <p className="mt-2 text-[13px] leading-6 text-slate-500">
            We sent a secure password link. It expires in 20 minutes.
          </p>
          <button
            className="mt-6 h-11 w-full cursor-pointer rounded-[12px] bg-[#013f92] text-sm font-semibold text-white"
            onClick={() => setSent(false)}
          >
            Send again
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-[1.55rem] font-bold tracking-[-0.03em] text-[#0b1f4d]">
            {reset ? "Set a new password" : "Forgot your password?"}
          </h2>
          <p className="mt-2 text-[13px] leading-6 text-slate-500">
            {reset
              ? "Enter your account email to continue the secure reset."
              : "Enter your work email and we'll send you a secure reset link."}
          </p>
          <form className="mt-7 space-y-4" onSubmit={handleSubmit(() => setSent(true))}>
            <label className="block text-left">
              <span className="mb-1.5 block text-[12px] font-semibold text-[#334155]">Email Address</span>
              <span className="relative block">
                <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" placeholder="you@example.com" className={fieldClass} {...register("email")} />
              </span>
              {errors.email && (
                <span className="mt-1.5 block text-[11px] font-medium text-red-600">{errors.email.message}</span>
              )}
            </label>
            <button type="submit" className="h-12 w-full cursor-pointer rounded-[12px] bg-[#013f92] text-sm font-semibold text-white">
              Send secure link
            </button>
          </form>
        </>
      )}
    </AuthShell>
  );
}
