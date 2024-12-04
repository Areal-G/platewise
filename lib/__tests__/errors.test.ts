import { describe, expect, it } from "vitest";
import { getErrorMessage } from "@/lib/errors";

describe("getErrorMessage", () => {
  it("uses the message of an Error", () => {
    expect(getErrorMessage(new Error("Quota exceeded"), "fallback")).toBe("Quota exceeded");
  });

  it("accepts a thrown string", () => {
    expect(getErrorMessage("Network down", "fallback")).toBe("Network down");
  });

  it("falls back for unknown or empty values", () => {
    expect(getErrorMessage(undefined, "fallback")).toBe("fallback");
    expect(getErrorMessage({ code: 500 }, "fallback")).toBe("fallback");
    expect(getErrorMessage(new Error(""), "fallback")).toBe("fallback");
  });
});
