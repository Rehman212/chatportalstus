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
      <span
        className={`grid size-10 shrink-0 place-items-center rounded-xl text-base font-black tracking-tight ${
          light
            ? "bg-white text-primary"
            : "bg-primary text-white shadow-[0_8px_22px_rgb(1_63_146/0.25)]"
        }`}
      >
        S
      </span>
      {!compact && (
        <span className="leading-none">
          <span
            className={`block text-xl font-black tracking-[-0.04em] ${
              light ? "text-white" : "text-stus-dark"
            }`}
          >
            STUS
          </span>
          <span
            className={`mt-1 block text-[10px] font-bold uppercase tracking-[0.18em] ${
              light ? "text-blue-100" : "text-stus-muted"
            }`}
          >
            Support Portal
          </span>
        </span>
      )}
    </Link>
  );
}
