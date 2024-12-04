import { DEMO_READONLY_EVENT, exitDemo } from "@/lib/demo";

const DEMO_USER_ID = "00000000-0000-0000-0000-00000000demo";

const demoUser = {
  id: DEMO_USER_ID,
  email: "guest@platewise.app",
  created_at: hoursAgo(24 * 30),
  user_metadata: { full_name: "Guest Chef" },
};

function hoursAgo(hours: number) {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

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

const generatedImages = samples.map((s, i) => ({
  id: `demo-image-${i + 1}`,
  user_id: DEMO_USER_ID,
  prompt: s.prompt,
  enhanced_prompt: s.enhanced ?? null,
  style: s.style,
  image_url: s.image,
  created_at: hoursAgo(s.hours),
}));

const generationHistory = [
  ...generatedImages.map((img, i) => ({
    id: `demo-history-${i + 1}`,
    user_id: DEMO_USER_ID,
    prompt: img.prompt,
    enhanced_prompt: img.enhanced_prompt,
    style: img.style,
    status: "completed",
    error_message: null as string | null,
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
];

const tables: Record<string, Record<string, unknown>[]> = {
  generated_images: generatedImages,
  generation_history: generationHistory,
  profiles: [
    {
      id: DEMO_USER_ID,
      email: demoUser.email,
      full_name: demoUser.user_metadata.full_name,
      avatar_url: null,
      created_at: demoUser.created_at,
      updated_at: demoUser.created_at,
    },
  ],
};

const readOnlyError = { message: "Guest demo is read-only" };

function notifyReadOnly() {
  window.dispatchEvent(new Event(DEMO_READONLY_EVENT));
}

// Minimal stand-in for the Supabase query builder over in-memory rows
class DemoQuery {
  private filters: Array<(row: Record<string, unknown>) => boolean> = [];
  private sort?: { column: string; ascending: boolean };
  private bounds?: [number, number];
  private countRows = false;
  private headOnly = false;
  private singleRow = false;
  private isWrite = false;

  constructor(private rows: Record<string, unknown>[]) {}

  select(_columns?: string, options?: { count?: string; head?: boolean }) {
    this.countRows = !!options?.count;
    this.headOnly = !!options?.head;
    return this;
  }
  insert() {
    this.isWrite = true;
    return this;
  }
  update() {
    this.isWrite = true;
    return this;
  }
  upsert() {
    this.isWrite = true;
    return this;
  }
  delete() {
    this.isWrite = true;
    return this;
  }
  eq(column: string, value: unknown) {
    this.filters.push((row) => row[column] === value);
    return this;
  }
  gte(column: string, value: string) {
    this.filters.push((row) => String(row[column]) >= value);
    return this;
  }
  order(column: string, options?: { ascending?: boolean }) {
    this.sort = { column, ascending: options?.ascending ?? true };
    return this;
  }
  range(from: number, to: number) {
    this.bounds = [from, to];
    return this;
  }
  limit(count: number) {
    this.bounds = [0, count - 1];
    return this;
  }
  single() {
    this.singleRow = true;
    return this;
  }
  maybeSingle() {
    return this.single();
  }

  private execute() {
    if (this.isWrite) {
      notifyReadOnly();
      return { data: null, count: null, error: readOnlyError };
    }

    let result = this.rows.filter((row) => this.filters.every((f) => f(row)));
    const count = result.length;

    if (this.sort) {
      const { column, ascending } = this.sort;
      result = [...result].sort((a, b) => {
        const cmp = String(a[column]).localeCompare(String(b[column]));
        return ascending ? cmp : -cmp;
      });
    }
    if (this.bounds) {
      result = result.slice(this.bounds[0], this.bounds[1] + 1);
    }

    const data = this.headOnly
      ? null
      : this.singleRow
        ? (result[0] ?? null)
        : result;
    return { data, count: this.countRows ? count : null, error: null };
  }

  then<T>(
    resolve: (value: ReturnType<DemoQuery["execute"]>) => T,
    reject?: (reason: unknown) => T
  ) {
    return Promise.resolve(this.execute()).then(resolve, reject);
  }
}

export function createDemoClient() {
  return {
    auth: {
      getUser: async () => ({ data: { user: demoUser }, error: null }),
      getSession: async () => ({
        data: { session: { user: demoUser } },
        error: null,
      }),
      updateUser: async () => {
        notifyReadOnly();
        return { data: { user: demoUser }, error: readOnlyError };
      },
      signOut: async () => {
        exitDemo();
        return { error: null };
      },
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe() {} } },
      }),
    },
    from: (table: string) => new DemoQuery(tables[table] ?? []),
  };
}
