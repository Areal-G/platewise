import { describe, expect, it } from "vitest";
import { demoImageUrl } from "@/lib/demo-images";

describe("demoImageUrl", () => {
  it("returns the fixed sample for non-food asset types", () => {
    expect(demoImageUrl("anything", "logo")).toBe("/features/logo.jpg");
    expect(demoImageUrl("anything", "menu")).toBe("/features/menu.jpg");
  });

  it("matches a dish named in the prompt", () => {
    expect(demoImageUrl("A rich Margherita pizza on a wooden board", "food")).toBe(
      "/dishes/margherita-pizza.webp"
    );
    expect(demoImageUrl("crispy dosa with chutney", "food")).toBe("/dishes/masala-dosa.webp");
  });

  it("falls back to a random sample dish", () => {
    expect(demoImageUrl("something unrelated", "food")).toMatch(/^\/dishes\/[a-z-]+\.webp$/);
  });
});
