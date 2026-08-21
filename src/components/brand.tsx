import Image from "next/image";
import Link from "next/link";

export function StusBrand({
  compact = false,
  light = false,
}: {
  compact?: boolean;
  light?: boolean;
}) {
  return (
    <Link
      href="/dashboard"
      aria-label="STUS Support Portal"
      className="inline-flex items-center gap-3 rounded-xl"
    >
      <span className="relative size-10 shrink-0 overflow-hidden rounded-[10px] shadow-[0_6px_18px_rgba(1,63,146,.35)] ring-1 ring-white/20">
        <Image
          src="/assests/images/Logo_stus.webp"
          alt="STUS"
          width={40}
          height={40}
          className="size-full object-cover"
          priority
        />
      </span>
      {!compact && (
        <span className="leading-none">
          <span
            className={`block text-[17px] font-extrabold tracking-[0.06em] ${
              light ? "text-white" : "text-[#013f92]"
            }`}
          >
            STUS
          </span>
          <span
            className={`mt-1.5 block text-[9px] font-semibold uppercase tracking-[0.18em] ${
              light ? "text-[#c6dbf0]" : "text-stus-muted"
            }`}
          >
            Support Portal
          </span>
        </span>
      )}
    </Link>
  );
}
