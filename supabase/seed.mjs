// Fills a Supabase project with a sample restaurant: one owner account,
// 16 generated images and their generation history.
// Run with: npm run seed (reads .env.local). Safe to run again: rows have
// fixed IDs and are upserted, and the owner account is reused.

import { createClient } from "@supabase/supabase-js";

// Local-only defaults for the seeded login. They are used only when the
// Supabase URL points at this machine; a hosted project needs both
// SEED_OWNER_EMAIL and SEED_OWNER_PASSWORD set explicitly.
const LOCAL_OWNER_EMAIL = "owner@platewise.local";
const LOCAL_OWNER_PASSWORD = "platewise-local-only";
const OWNER_NAME = "Sample Chef";

const samples = [
  {
    prompt: "Margherita pizza with fresh basil",
    enhanced:
      "Wood-fired Margherita pizza with bubbling fresh mozzarella, San Marzano tomato sauce and torn basil leaves, blistered golden crust, 45-degree angle, soft natural light, rustic wooden board",
    style: "photorealistic",
    image: "/dishes/margherita-pizza.webp",
    hours: 1,
  },
  {
    prompt: "Creamy paneer tikka masala with naan",
    enhanced:
      "Paneer Tikka Masala with tender cottage cheese cubes in rich tomato gravy, garnished with fresh coriander, served with warm naan, shallow depth of field, vibrant orange-red tones",
    style: "photorealistic",
    image: "/dishes/paneer-tikka-masala.webp",
    hours: 3,
  },
  {
    prompt: "Chocolate lava cake with vanilla ice cream",
    enhanced:
      "Molten chocolate lava cake split open with glossy ganache flowing out, vanilla bean ice cream and raspberries, dark moody backdrop, dramatic side lighting",
    style: "artistic",
    image: "/dishes/chocolate-lava-cake.webp",
    hours: 6,
  },
  {
    prompt: "Elegant dinner menu for Biryani Blues",
    style: "menu",
    image: "/features/menu.jpg",
    hours: 9,
  },
  {
    prompt: "Crispy masala dosa with chutneys",
    style: "rustic",
    image: "/dishes/masala-dosa.webp",
    hours: 14,
  },
  {
    prompt: "Weekend burger deal poster, 20% off",
    style: "poster",
    image: "/features/poster.jpg",
    hours: 20,
  },
  {
    prompt: "Gulab jamun in rose-cardamom syrup",
    enhanced:
      "Soft gulab jamun soaked in fragrant rose-cardamom syrup, garnished with pistachios and silver leaf, white ceramic bowl, minimalist composition, soft studio lighting",
    style: "minimalist",
    image: "/dishes/gulab-jamun.webp",
    hours: 27,
  },
  {
    prompt: "Logo for a cozy cafe called Brew & Bite",
    style: "logo",
    image: "/features/logo.jpg",
    hours: 34,
  },
  {
    prompt: "Fragrant veg biryani in a clay pot",
    style: "photorealistic",
    image: "/dishes/veg-biryani.webp",
    hours: 46,
  },
  {
    prompt: "Kraft paper takeout box with our branding",
    style: "packaging",
    image: "/features/packaging.jpg",
    hours: 58,
  },
  {
    prompt: "Classic Caesar salad with parmesan crisps",
    style: "artistic",
    image: "/dishes/caesar-salad.webp",
    hours: 75,
  },
  {
    prompt: "Phone photo of our pasta alfredo",
    enhanced:
      "Creamy fettuccine alfredo twirled high on a white plate, cracked black pepper and parmesan shavings, glossy sauce, warm restaurant lighting",
    style: "enhanced",
    image: "/dishes/pasta-alfredo.webp",
    hours: 96,
  },
  {
    prompt: "Palak paneer in a copper bowl",
    style: "rustic",
    image: "/dishes/palak-paneer.webp",
    hours: 130,
  },
  {
    prompt: "Loaded veggie burger with fries",
    style: "photorealistic",
    image: "/dishes/veggie-burger.webp",
    hours: 170,
  },
  {
    prompt: "Chole bhature street-food style",
    style: "artistic",
    image: "/dishes/chole-bhature.webp",
    hours: 220,
  },
  {
    prompt: "Warm gajar halwa with nuts",
    style: "minimalist",
    image: "/dishes/gajar-halwa.webp",
    hours: 290,
  },
];

const failedSample = {
  prompt: "Neon sushi platter poster",
  style: "artistic",
  error: "API quota exceeded. Please wait a moment and try again.",
  hours: 40,
};

// Fixed UUIDs keep the seed idempotent: a second run updates the same rows
function sampleId(kind, index) {
  return `00000000-0000-4000-${kind}-${String(index).padStart(12, "0")}`;
}

function hoursAgo(hours) {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

function isLocalUrl(url) {
  const { hostname } = new URL(url);
  return hostname === "localhost" || hostname === "127.0.0.1";
}

function readConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error(
      "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local."
    );
  }

  const local = isLocalUrl(url);
  const email =
    process.env.SEED_OWNER_EMAIL || (local ? LOCAL_OWNER_EMAIL : undefined);
  const password =
    process.env.SEED_OWNER_PASSWORD ||
    (local ? LOCAL_OWNER_PASSWORD : undefined);
  if (!email || !password) {
    throw new Error(
      "SEED_OWNER_EMAIL and SEED_OWNER_PASSWORD are required for a hosted Supabase project."
    );
  }

  return { url, serviceRoleKey, email, password };
}

async function findUserByEmail(supabase, email) {
  for (let page = 1; ; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 1000,
    });
    if (error) throw error;
    const user = data.users.find((u) => u.email === email);
    if (user || data.users.length < 1000) return user;
  }
}

async function upsertOwner(supabase, email, password) {
  const attributes = {
    password,
    email_confirm: true,
    user_metadata: { full_name: OWNER_NAME },
  };
  const existing = await findUserByEmail(supabase, email);
  const { data, error } = existing
    ? await supabase.auth.admin.updateUserById(existing.id, attributes)
    : await supabase.auth.admin.createUser({ email, ...attributes });
  if (error) throw error;
  return data.user;
}

async function upsert(supabase, table, rows) {
  const { error } = await supabase.from(table).upsert(rows);
  if (error) throw new Error(`${table}: ${error.message}`);
}

async function seed() {
  const { url, serviceRoleKey, email, password } = readConfig();
  const supabase = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const owner = await upsertOwner(supabase, email, password);

  await upsert(supabase, "profiles", [
    { id: owner.id, email, full_name: OWNER_NAME },
  ]);

  const images = samples.map((sample, i) => ({
    id: sampleId("8000", i + 1),
    user_id: owner.id,
    prompt: sample.prompt,
    enhanced_prompt: sample.enhanced ?? null,
    style: sample.style,
    image_url: sample.image,
    created_at: hoursAgo(sample.hours),
  }));
  await upsert(supabase, "generated_images", images);

  await upsert(supabase, "generation_history", [
    ...images.map((image, i) => ({
      id: sampleId("9000", i + 1),
      user_id: owner.id,
      prompt: image.prompt,
      enhanced_prompt: image.enhanced_prompt,
      style: image.style,
      status: "completed",
      error_message: null,
      image_id: image.id,
      created_at: image.created_at,
    })),
    {
      id: sampleId("9000", samples.length + 1),
      user_id: owner.id,
      prompt: failedSample.prompt,
      enhanced_prompt: null,
      style: failedSample.style,
      status: "failed",
      error_message: failedSample.error,
      image_id: null,
      created_at: hoursAgo(failedSample.hours),
    },
  ]);

  console.log(
    `Seeded ${images.length} images and ${images.length + 1} history rows for ${email}.`
  );
}

seed().catch((error) => {
  console.error(`Seed failed: ${error.message}`);
  process.exit(1);
});
