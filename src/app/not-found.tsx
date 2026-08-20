import Link from "next/link";
import { ArrowLeft, MapPinOff } from "lucide-react";
import { StusBrand } from "@/components/brand";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center p-6">
      <div className="max-w-md text-center">
        <div className="mb-10 flex justify-center"><StusBrand /></div>
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-blue-50 text-primary"><MapPinOff size={28} /></span>
        <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-primary">404 error</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-stus-dark">Page not found</h1>
        <p className="mt-4 text-sm leading-6 text-stus-muted">The page may have moved, or you may not have access to this support workspace route.</p>
        <Link href="/dashboard" className="mt-7 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white hover:bg-primary-hover">
          <ArrowLeft size={17} /> Return to dashboard
        </Link>
      </div>
    </main>
  );
}
