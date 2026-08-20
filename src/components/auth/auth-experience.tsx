"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  MessageSquareText,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, Input } from "@/components/ui";
import { usePortalStore, useStoreHydrated } from "@/stores/portal-store";

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-stus-muted">
      {children}
    </span>
  );
}

function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="grid min-h-dvh overflow-hidden bg-[#073b8f] lg:grid-cols-[57%_43%]">
      <section
        className="hidden min-h-dvh bg-no-repeat lg:block"
        style={{
          backgroundImage: "url('/login-reference.png')",
          backgroundPosition: "left top",
          backgroundSize: "100vw 100%",
        }}
        aria-label="STUS Chat Portal"
      />
      <section
        className="relative flex min-h-dvh items-center justify-center overflow-hidden px-5 py-8 sm:px-8"
        style={{
          backgroundImage:
            "radial-gradient(circle at 80% 16%, rgba(77,139,255,.42), transparent 30%), linear-gradient(145deg, #0b55b6 0%, #063d91 55%, #032765 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(120deg, transparent 68%, white 68.2%, transparent 68.5%), radial-gradient(circle, white 1px, transparent 1.5px)",
            backgroundSize: "100% 100%, 15px 15px",
            maskImage: "linear-gradient(to left, black, transparent 68%)",
          }}
        />
        <div className="relative z-10 w-full max-w-[480px] rounded-[24px] border border-white/70 bg-[linear-gradient(145deg,rgba(255,255,255,.97),rgba(235,240,252,.94))] px-7 py-8 shadow-[0_30px_80px_rgba(0,17,65,.35)] backdrop-blur-xl sm:px-10 sm:py-10">
          <div className="mx-auto mb-5 grid size-16 place-items-center rounded-[18px] bg-[linear-gradient(145deg,#1680ff,#0746b9)] text-white shadow-[0_12px_28px_rgba(6,69,180,.28)]">
            <MessageSquareText size={32} strokeWidth={2.1} />
          </div>
          {children}
        </div>
      </section>
    </main>
  );
}

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
        <h2 className="text-[1.55rem] font-bold leading-tight tracking-[-0.025em] text-[#0b1f4d]">
          Welcome back
        </h2>
        <p className="mt-1.5 text-[12.5px] text-[#68738e]">
          Sign in to continue to your dashboard
        </p>
      </div>

      <form
        className="mt-7 space-y-3.5"
        onSubmit={handleSubmit(async ({ email }) => {
          await new Promise((resolve) => setTimeout(resolve, 500));
          signIn(email);
          router.push("/dashboard");
        })}
      >
        <label className="block">
          <span className="sr-only">Username or email</span>
          <span className="relative block">
            <Mail size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#53617e]" />
            <input
              type="email"
              autoComplete="email"
              placeholder="Username or Email"
              autoFocus
              aria-describedby={errors.email ? "email-error" : undefined}
              aria-invalid={Boolean(errors.email)}
              className="h-[52px] w-full rounded-[10px] border border-white/80 bg-white/80 pl-12 pr-4 text-[13.5px] text-[#12254e] shadow-[0_7px_22px_rgba(29,57,115,.08)] transition placeholder:text-[#7b849a] hover:bg-white focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100/70"
              {...register("email")}
            />
          </span>
          {errors.email && (
            <span id="email-error" role="alert" className="mt-1.5 block text-[11.5px] font-semibold text-red-600">
              {errors.email.message}
            </span>
          )}
        </label>

        <label className="block">
          <span className="sr-only">Password</span>
          <span className="relative block">
            <LockKeyhole size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#53617e]" />
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Password"
              aria-describedby={errors.password ? "password-error" : capsLock ? "caps-lock" : undefined}
              aria-invalid={Boolean(errors.password)}
              onKeyDown={(event) => setCapsLock(event.getModifierState("CapsLock"))}
              onKeyUp={(event) => setCapsLock(event.getModifierState("CapsLock"))}
              className="h-[52px] w-full rounded-[10px] border border-white/80 bg-white/80 pl-12 pr-12 text-[13.5px] text-[#12254e] shadow-[0_7px_22px_rgba(29,57,115,.08)] transition placeholder:text-[#7b849a] hover:bg-white focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100/70"
              {...register("password")}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2 top-2 grid size-9 cursor-pointer place-items-center rounded-lg text-[#53617e] transition hover:bg-blue-50 hover:text-primary"
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </span>
          {capsLock && !errors.password && (
            <span id="caps-lock" className="mt-1.5 block text-[11px] font-semibold text-amber-700">
              Caps Lock is on
            </span>
          )}
          {errors.password && (
            <span id="password-error" role="alert" className="mt-1.5 block text-[11.5px] font-semibold text-red-600">
              {errors.password.message}
            </span>
          )}
        </label>

        <div className="flex items-center justify-between gap-4 pt-1">
          <label className="flex cursor-pointer items-center gap-2 text-[12px] text-[#26375b]">
            <input type="checkbox" className="size-4 rounded accent-[#1269df]" {...register("remember")} />
            Remember me
          </label>
          <Link href="/forgot-password" className="text-[12px] font-medium text-[#0b55be] hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="relative flex h-[52px] w-full cursor-pointer items-center justify-center rounded-[10px] bg-[linear-gradient(90deg,#1675f0,#0751c4)] px-5 text-[14px] font-semibold text-white shadow-[0_12px_28px_rgba(7,75,185,.25)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
          {!isSubmitting && <ArrowUpRight size={18} className="absolute right-5" />}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-[#cfd7e7]" />
        <span className="text-xs text-[#69758d]">or</span>
        <span className="h-px flex-1 bg-[#cfd7e7]" />
      </div>

      <button
        type="button"
        className="flex h-11 w-full cursor-pointer items-center justify-center gap-3 rounded-[9px] border border-white/90 bg-white/80 text-[13px] font-medium text-[#1b2948] shadow-[0_7px_22px_rgba(29,57,115,.07)] transition hover:bg-white"
      >
        <span className="text-base font-bold text-[#4285f4]">G</span>
        Sign in with Google
      </button>

      <p className="mt-6 text-center text-[12px] text-[#68738e]">
        Need help?{" "}
        <a href="mailto:support@stus.digital" className="font-medium text-[#0b55be] hover:underline">
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
      <Link href="/login" className="mb-7 inline-flex items-center gap-2 text-[13px] font-semibold text-primary">
        <ArrowLeft size={16} /> Back to sign in
      </Link>

      {sent ? (
        <div>
          <span className="grid size-12 place-items-center rounded-xl bg-green-50 text-green-600">
            <CheckCircle2 size={24} />
          </span>
          <h2 className="mt-5 text-[1.4rem] font-bold tracking-[-0.02em] text-stus-dark">Check your inbox</h2>
          <p className="mt-2.5 text-[13px] leading-6 text-stus-muted">
            We sent a secure password link. It expires in 20 minutes.
          </p>
          <Button className="mt-6 h-11 rounded-md text-sm" onClick={() => setSent(false)}>
            Send again
          </Button>
        </div>
      ) : (
        <>
          <Eyebrow>Account recovery</Eyebrow>
          <h2 className="mt-2.5 text-[1.55rem] font-bold leading-tight tracking-[-0.02em] text-stus-dark">
            {reset ? "Set a new password" : "Forgot your password?"}
          </h2>
          <p className="mt-1.5 text-[13px] leading-6 text-stus-muted">
            {reset
              ? "Enter your account email to continue the secure reset."
              : "Enter your work email and we'll send you a secure reset link."}
          </p>
          <form className="mt-7 space-y-4" onSubmit={handleSubmit(() => setSent(true))}>
            <label className="block">
              <span className="mb-1.5 block">
                <Eyebrow>Work email</Eyebrow>
              </span>
              <Input type="email" placeholder="name@stus.digital" className="h-11 rounded-md text-[13.5px]" {...register("email")} />
              {errors.email && (
                <span className="mt-1.5 block text-[11.5px] font-semibold text-red-600">{errors.email.message}</span>
              )}
            </label>
            <Button type="submit" className="h-11 w-full rounded-md text-sm">
              Send secure link
            </Button>
          </form>
        </>
      )}
    </AuthShell>
  );
}