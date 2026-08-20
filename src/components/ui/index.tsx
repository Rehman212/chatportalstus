"use client";

import {
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  useEffect,
} from "react";
import { AlertCircle, Inbox, X } from "lucide-react";
import { cn, initials } from "@/lib/utils";

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "icon";
}) {
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover shadow-sm",
    secondary:
      "border border-stus-border bg-white text-stus-dark hover:border-stus-blue-light hover:bg-blue-50/60",
    ghost: "text-stus-muted hover:bg-blue-50 hover:text-primary",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };
  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-4 text-sm",
    icon: "size-10",
  };
  return (
    <button
      type={type}
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl font-bold transition disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}

export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "surface-shadow rounded-2xl border border-stus-border bg-white",
        className,
      )}
      {...props}
    />
  );
}

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-xl border border-stus-border bg-white px-3.5 text-sm text-stus-dark placeholder:text-slate-400 transition hover:border-stus-blue-light focus:border-primary focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "blue" | "green" | "amber" | "red" | "purple" | "neutral" | "lime";
  className?: string;
}) {
  const tones = {
    blue: "bg-blue-50 text-primary ring-blue-100",
    green: "bg-green-50 text-green-700 ring-green-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    red: "bg-red-50 text-red-700 ring-red-100",
    purple: "bg-violet-50 text-violet-700 ring-violet-100",
    neutral: "bg-slate-100 text-slate-600 ring-slate-200",
    lime: "bg-[#eef4c9] text-[#52620d] ring-[#dbe69a]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Avatar({
  name,
  size = "md",
  online,
}: {
  name: string;
  size?: "sm" | "md" | "lg";
  online?: boolean;
}) {
  const sizes = { sm: "size-8 text-xs", md: "size-10 text-sm", lg: "size-14 text-base" };
  return (
    <span className="relative inline-flex shrink-0">
      <span
        className={cn(
          "grid place-items-center rounded-full bg-gradient-to-br from-blue-100 to-violet-100 font-extrabold text-primary",
          sizes[size],
        )}
      >
        {initials(name)}
      </span>
      {online !== undefined && (
        <span
          className={cn(
            "absolute bottom-0 right-0 size-3 rounded-full border-2 border-white",
            online ? "bg-green-500" : "bg-slate-400",
          )}
        />
      )}
    </span>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="grid min-h-56 place-items-center px-6 text-center">
      <div>
        <span className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-blue-50 text-primary">
          <Inbox size={22} />
        </span>
        <h3 className="font-bold text-stus-dark">{title}</h3>
        <p className="mt-1 max-w-sm text-sm leading-6 text-stus-muted">
          {description}
        </p>
      </div>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse-soft rounded-lg bg-slate-200/80",
        className,
      )}
    />
  );
}

export function Dialog({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4 backdrop-blur-[2px]"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className="surface-shadow w-full max-w-md rounded-2xl border border-stus-border bg-white"
      >
        <div className="flex items-center justify-between border-b border-stus-border px-5 py-4">
          <h2 id="dialog-title" className="font-extrabold text-stus-dark">
            {title}
          </h2>
          <Button variant="ghost" size="icon" aria-label="Close" onClick={onClose}>
            <X size={19} />
          </Button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
      <AlertCircle size={18} />
      {message}
    </div>
  );
}
