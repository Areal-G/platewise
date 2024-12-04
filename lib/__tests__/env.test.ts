import { afterEach, describe, expect, it, vi } from "vitest";
import { getSupabaseEnv, requireSupabaseEnv } from "@/lib/env";

afterEach(() => vi.unstubAllEnvs());

describe("Supabase env", () => {
  it("returns null when credentials are missing", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
    expect(getSupabaseEnv()).toBeNull();
    expect(() => requireSupabaseEnv()).toThrow(/NEXT_PUBLIC_SUPABASE_URL/);
  });

  it("returns both values when configured", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon");
    expect(requireSupabaseEnv()).toEqual({ url: "https://example.supabase.co", anonKey: "anon" });
  });
});
