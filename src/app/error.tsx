"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="grid min-h-dvh place-items-center p-6">
      <div className="max-w-md text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-amber-50 text-amber-700"><AlertTriangle size={28} /></span>
        <h1 className="mt-6 text-3xl font-black text-stus-dark">Something went wrong</h1>
        <p className="mt-3 text-sm leading-6 text-stus-muted">The workspace could not finish loading. Your saved demo data is still available.</p>
        <Button className="mt-7" onClick={reset}><RotateCcw size={17} /> Try again</Button>
      </div>
    </main>
  );
}
