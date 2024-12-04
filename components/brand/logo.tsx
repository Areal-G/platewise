import { useId } from "react";
import { cn } from "@/lib/utils";

// Platewise mark: a plate seen from above with an AI sparkle, on an orange tile
export function LogoMark({ className }: { className?: string }) {
  const gradientId = useId();

  return (
    <svg
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-9 w-9 shrink-0", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FB923C" />
          <stop offset="1" stopColor="#EA580C" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill={`url(#${gradientId})`} />
      {/* Plate rim and well */}
      <circle cx="18" cy="22" r="11" fill="#FFFFFF" />
      <circle cx="18" cy="22" r="7" fill="#FFF7ED" stroke="#FDBA74" strokeWidth="1.25" />
      {/* Sparkle */}
      <path
        d="M30.5 4.5c.45 2.9 1.6 4.05 4.5 4.5-2.9.45-4.05 1.6-4.5 4.5-.45-2.9-1.6-4.05-4.5-4.5 2.9-.45 4.05-1.6 4.5-4.5Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

// Mark + wordmark. Use tone="light" on dark backgrounds.
export function Logo({
  className,
  markClassName,
  textClassName,
  tone = "dark",
}: {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  tone?: "dark" | "light";
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={markClassName} />
      <span
        className={cn(
          "text-xl font-extrabold tracking-tight",
          tone === "light" ? "text-white" : "text-gray-900",
          textClassName
        )}
      >
        Plate
        <span className={tone === "light" ? "text-orange-400" : "text-orange-600"}>wise</span>
      </span>
    </span>
  );
}
