// Sample assets served when no Gemini API key is configured.

const DEMO_DISHES = [
  "caesar-salad",
  "chocolate-lava-cake",
  "chole-bhature",
  "gajar-halwa",
  "gulab-jamun",
  "margherita-pizza",
  "masala-dosa",
  "palak-paneer",
  "paneer-tikka-masala",
  "pasta-alfredo",
  "veg-biryani",
  "veggie-burger",
];

const DEMO_FEATURES: Record<string, string> = {
  menu: "/features/menu.jpg",
  poster: "/features/poster.jpg",
  logo: "/features/logo.jpg",
  packaging: "/features/packaging.jpg",
};

// Picks a sample image, preferring a dish whose name appears in the prompt
export function demoImageUrl(prompt: string, type: string) {
  if (DEMO_FEATURES[type]) return DEMO_FEATURES[type];

  const text = prompt.toLowerCase();
  const match = DEMO_DISHES.find((dish) =>
    dish.split("-").some((word) => word.length > 3 && text.includes(word))
  );
  const dish =
    match || DEMO_DISHES[Math.floor(Math.random() * DEMO_DISHES.length)];
  return `/dishes/${dish}.webp`;
}
