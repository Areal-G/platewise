// Guest demo mode: lets visitors explore the dashboard with sample data,
// without an account or database. Everything is read-only.

export const DEMO_COOKIE = "platewise_demo";
export const DEMO_READONLY_EVENT = "platewise:demo-readonly";

export function isDemoMode() {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split("; ")
    .some((c) => c === `${DEMO_COOKIE}=1`);
}

export function enterDemo() {
  document.cookie = `${DEMO_COOKIE}=1; path=/; max-age=${60 * 60 * 24}; samesite=lax`;
}

export function exitDemo() {
  document.cookie = `${DEMO_COOKIE}=; path=/; max-age=0; samesite=lax`;
}

// Call at the start of any action that would create, change or delete data.
// Returns true (and shows the read-only notice) when in demo mode.
export function guardDemo() {
  if (!isDemoMode()) return false;
  window.dispatchEvent(new Event(DEMO_READONLY_EVENT));
  return true;
}
