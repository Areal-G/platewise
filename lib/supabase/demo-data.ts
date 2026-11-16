// Sample restaurant served by the in-memory Supabase client. IDs are fixed and
// timestamps are anchored to the start of the current UTC day, so every server
// instance and browser builds identical rows.

export interface DemoUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
  email_confirmed_at?: string;
  user_metadata: { full_name?: string; avatar_url?: string };
}

export interface GeneratedImageRow {
  id: string;
  user_id: string;
  prompt: string;
  enhanced_prompt: string | null;
  style: string;
  image_url: string;
  created_at: string;
}

export interface GenerationHistoryRow {
  id: string;
  user_id: string;
  prompt: string;
  enhanced_prompt: string | null;
  style: string;
  status: string;
  error_message: string | null;
  image_id: string | null;
  created_at: string;
}

export interface ProfileRow {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface DemoTables {
  generated_images: GeneratedImageRow[];
  generation_history: GenerationHistoryRow[];
  profiles: ProfileRow[];
}

export const DEMO_USER_ID = "00000000-0000-0000-0000-00000000demo";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

const samples: Array<{
  prompt: string;
  enhanced?: string;
  style: string;
  image: string;
  hours: number;
}> = [
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

// Builds the demo user and tables for the UTC day containing `now`
export function buildDemoData(now: number) {
  const anchor = Math.floor(now / DAY) * DAY;
  const hoursAgo = (hours: number) =>
    new Date(anchor - hours * HOUR).toISOString();

  const user: DemoUser = {
    id: DEMO_USER_ID,
    email: "guest@platewise.app",
    created_at: hoursAgo(24 * 30),
    user_metadata: { full_name: "Guest Chef" },
  };

  const generatedImages: GeneratedImageRow[] = samples.map((s, i) => ({
    id: `demo-image-${i + 1}`,
    user_id: DEMO_USER_ID,
    prompt: s.prompt,
    enhanced_prompt: s.enhanced ?? null,
    style: s.style,
    image_url: s.image,
    created_at: hoursAgo(s.hours),
  }));

  const tables: DemoTables = {
    generated_images: generatedImages,
    generation_history: [
      ...generatedImages.map((img, i) => ({
        id: `demo-history-${i + 1}`,
        user_id: DEMO_USER_ID,
        prompt: img.prompt,
        enhanced_prompt: img.enhanced_prompt,
        style: img.style,
        status: "completed",
        error_message: null,
        image_id: img.id,
        created_at: img.created_at,
      })),
      {
        id: "demo-history-failed-1",
        user_id: DEMO_USER_ID,
        prompt: "Neon sushi platter poster",
        enhanced_prompt: null,
        style: "artistic",
        status: "failed",
        error_message: "API quota exceeded. Please wait a moment and try again.",
        image_id: null,
        created_at: hoursAgo(40),
      },
    ],
    profiles: [
      {
        id: DEMO_USER_ID,
        email: user.email,
        full_name: user.user_metadata.full_name ?? null,
        avatar_url: null,
        created_at: user.created_at,
        updated_at: user.created_at,
      },
    ],
  };

  return { user, tables };
}
