import { describe, expect, it } from "vitest";
import { createDemoClient } from "@/lib/supabase/demo-client";
import { buildDemoData, DEMO_USER_ID } from "@/lib/supabase/demo-data";

const signedIn = () =>
  createDemoClient({ isSignedIn: () => true, signOut: () => {} });

describe("demo data", () => {
  it("is identical for every build on the same UTC day", () => {
    const morning = Date.UTC(2026, 0, 15, 1, 30);
    const evening = Date.UTC(2026, 0, 15, 22, 5);
    expect(buildDemoData(morning)).toEqual(buildDemoData(evening));
  });

  it("uses fixed, unique row IDs", () => {
    const { tables } = buildDemoData(Date.UTC(2026, 0, 15));
    const ids = [...tables.generated_images, ...tables.generation_history].map(
      (row) => row.id
    );
    expect(new Set(ids).size).toBe(ids.length);
    expect(tables.generated_images[0].id).toBe("demo-image-1");
    expect(tables.generation_history.at(-1)?.id).toBe("demo-history-failed-1");
  });

  it("links every completed history row to its image", () => {
    const { tables } = buildDemoData(Date.UTC(2026, 0, 15));
    const imageIds = new Set(tables.generated_images.map((img) => img.id));
    for (const row of tables.generation_history) {
      if (row.status === "completed") expect(imageIds.has(row.image_id!)).toBe(true);
    }
  });
});

describe("demo client auth", () => {
  it("has no user until the guest demo is entered", async () => {
    const client = createDemoClient({ isSignedIn: () => false, signOut: () => {} });
    const { data } = await client.auth.getUser();
    expect(data.user).toBeNull();
  });

  it("returns the guest user inside the demo", async () => {
    const { data } = await signedIn().auth.getUser();
    expect(data.user).toMatchObject({ id: DEMO_USER_ID, email: "guest@platewise.app" });
  });

  it("signs out by leaving the demo", async () => {
    let inDemo = true;
    const client = createDemoClient({
      isSignedIn: () => inDemo,
      signOut: () => {
        inDemo = false;
      },
    });
    await client.auth.signOut();
    expect((await client.auth.getUser()).data.user).toBeNull();
  });

  it("refuses password sign-in and sign-up with a clear message", async () => {
    const client = signedIn();
    const login = await client.auth.signInWithPassword({ email: "a@b.co", password: "x" });
    const signup = await client.auth.signUp({ email: "a@b.co", password: "x" });
    expect(login.error?.message).toMatch(/Try Live Demo/);
    expect(signup.error?.message).toMatch(/Sign-up is disabled/);
  });
});

describe("demo client queries", () => {
  it("counts and lists the newest images like the dashboard", async () => {
    const client = signedIn();
    const [{ count }, { data }] = await Promise.all([
      client
        .from("generated_images")
        .select("*", { count: "exact", head: true })
        .eq("user_id", DEMO_USER_ID),
      client
        .from("generated_images")
        .select("*")
        .eq("user_id", DEMO_USER_ID)
        .order("created_at", { ascending: false })
        .limit(6),
    ]);
    expect(count).toBe(16);
    expect(data).toHaveLength(6);
    expect(data![0].prompt).toBe("Margherita pizza with fresh basil");
  });

  it("filters, sorts and paginates the gallery", async () => {
    const { data, count } = await signedIn()
      .from("generated_images")
      .select("*", { count: "exact" })
      .eq("style", "photorealistic")
      .order("created_at", { ascending: true })
      .range(0, 1);
    expect(count).toBe(4);
    expect(data!.map((img) => img.prompt)).toEqual([
      "Loaded veggie burger with fries",
      "Fragrant veg biryani in a clay pot",
    ]);
  });

  it("counts recent images with gte", async () => {
    const { tables } = buildDemoData(Date.now());
    const since = tables.generated_images[5].created_at;
    const { count } = await signedIn()
      .from("generated_images")
      .select("*", { count: "exact", head: true })
      .gte("created_at", since);
    expect(count).toBe(6);
  });

  it("splits history by status", async () => {
    const client = signedIn();
    const status = (value: string) =>
      client
        .from("generation_history")
        .select("*", { count: "exact", head: true })
        .eq("status", value);
    const [completed, failed] = await Promise.all([status("completed"), status("failed")]);
    expect(completed.count).toBe(16);
    expect(failed.count).toBe(1);
  });

  it("returns a single profile row", async () => {
    const { data } = await signedIn()
      .from("profiles")
      .select("*")
      .eq("id", DEMO_USER_ID)
      .single();
    expect(data?.full_name).toBe("Guest Chef");
  });

  it("refuses writes and leaves the data unchanged", async () => {
    const client = signedIn();
    const insert = await client
      .from("generated_images")
      .insert({ prompt: "New dish" })
      .select()
      .single();
    const remove = await client.from("generated_images").delete().eq("id", "demo-image-1");
    expect(insert.error?.message).toBe("Guest demo is read-only");
    expect(remove.error?.message).toBe("Guest demo is read-only");

    const { count } = await client
      .from("generated_images")
      .select("*", { count: "exact", head: true });
    expect(count).toBe(16);
  });
});
