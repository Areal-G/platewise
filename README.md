# 🍽️ Platewise

![Next.js](https://img.shields.io/badge/Next.js-16.4-000000?logo=nextdotjs&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Postgres_+_Auth-3FCF8E?logo=supabase&logoColor=white)
![Gemini](https://img.shields.io/badge/Google_Gemini-AI_SDK_5-4285F4?logo=googlegemini&logoColor=white)
![Demo](https://img.shields.io/badge/demo-guest_login-ff6a00)

**An AI design studio for restaurants.** Food photos, menus, posters, logos and packaging, all from one line of text 🧑‍🍳

Small restaurants need appetizing visuals for menus, delivery apps and social media, but rarely have a photographer or a designer around. With Platewise a cook types "crispy masala dosa with coconut chutney", picks a style and gets a menu-ready photo. The same flow makes full menus, promo posters, logos and branded takeout packaging.

Every generation is saved to a searchable gallery and logged in a history view with its status and the AI-enhanced prompt, so the good stuff is easy to find and reuse.

## 🧰 Tools

| Tool | What it does | Route |
| --- | --- | --- |
| 🍛 Food Generator | Describe a dish, pick photorealistic, artistic, minimalist or rustic, get a menu-ready photo. **Enhance with AI** expands short prompts; **Surprise Me** helps when you're stuck. | `/dashboard/generate` |
| 📸 Photo Enhancer | Upload a real phone photo; Gemini analyses it and makes a professional version. | `/dashboard/enhance` |
| 📋 Menu Maker | Name, cuisine and dishes with prices in; a styled menu out (modern minimalist, chalkboard, fine dining or vibrant). | `/dashboard/menu` |
| 📣 Ad Posters | Promotional posters from a purpose-built prompt. | `/dashboard/posters` |
| 🎨 Logo Creator | Logos for the restaurant. | `/dashboard/logo` |
| 🥡 Packaging Designer | Branded takeout packaging. | `/dashboard/packaging` |
| 🖼️ Gallery | Every creation, with style filters, sorting, weekly stats, download and delete. | `/dashboard/gallery` |
| 📜 History | Each attempt with its status, the success rate and the enhanced prompt behind it. | `/dashboard/history` |
| 💡 Tips | Prompt advice and examples for each tool. | `/dashboard/tips` |
| ⚙️ Settings | Profile, account details and an optional personal Gemini key stored in the browser. | `/dashboard/settings` |

Under the hood every image tool calls the same route, `POST /api/generate-image`, which wraps your text in a template for food, menu, poster, logo or packaging. That's why a short input still comes out composed and on-brand. Prompt rewriting goes through `POST /api/enhance-prompt` and photo analysis through `POST /api/analyze-image`.

## 👀 Guest demo

No account needed. Click **Try Live Demo** on the landing page and you land on the dashboard of a sample restaurant with 16 images and a full history.

- The demo runs in the browser, with no database and no API key.
- A cookie swaps the Supabase client for an in-memory one full of sample data.
- Every write action shows a read-only notice instead of failing.
- The AI routes refuse demo requests with a `403`, so the demo can never spend API credit.

Every action that would create, change or delete data starts with one tiny guard:

```ts
// lib/demo.ts
export function guardDemo() {
  if (!isDemoMode()) return false;
  window.dispatchEvent(new Event(DEMO_READONLY_EVENT));
  return true;
}
```

Prefer your own account? Sign up locally (email confirmation is off in the local Supabase config). Without a Gemini key the tools return bundled sample images that match the dish in your prompt, so everything works end to end. Add a key to get real images 🎉

Real accounts use email/password or Google sign-in through Supabase Auth, and Row Level Security keeps each restaurant's images to itself.

## 🥘 Stack

| Layer | Tech |
| --- | --- |
| Framework | Next.js 16.4 (App Router, Turbopack), React 19.2 |
| Language | TypeScript 5.9 |
| Styling | Tailwind CSS 4.1, shadcn/ui, Radix primitives |
| AI | Vercel AI SDK 5 with `@ai-sdk/google` |
| Data & auth | Supabase (PostgreSQL, Auth), `@supabase/ssr` |
| Extras | Embla Carousel, date-fns, lucide-react |

A few things worth knowing:

- **Two layers of auth.** Route handlers check the Supabase user before any AI call, and Row Level Security limits every table to its owner.
- **Bring your own key.** A key pasted in Settings is sent as `x-gemini-api-key` and wins over the server key.
- **History as an audit trail.** A `generation_history` row is written before each call and updated with the result, so failures show up next to successes.
- **Session refresh.** `proxy.ts` refreshes the Supabase session on every request.
- **Input checks.** A missing prompt or image gets a `400` before it ever reaches the model.
- **Graceful fallbacks.** No key, no network or a failed generation each end in a clear state: sample images, a toast, or a failed row in History.

Where things live:

```
app/api/            generate-image, enhance-prompt, analyze-image
app/dashboard/      every tool, plus gallery, history, tips, settings
lib/ai.ts           AI context, models and the sample-image fallback
lib/demo.ts         guest demo cookie and read-only guard
supabase/           migrations: tables, RLS policies, profile trigger
public/dishes/      sample images for the demo and no-key mode
```

## 🛠️ Setup

You'll need Node.js 20+, npm and Docker. A Gemini API key from Google AI Studio is optional.

```sh
git clone <your-fork-url> platewise
cd platewise
npm install
```

Then get Supabase going:

1. Start the local stack:

   ```sh
   npx supabase start
   ```

2. Apply the schema in `supabase/migrations` (tables, RLS policies and the profile trigger):

   ```sh
   npx supabase db reset
   ```

3. Create your env file:

   ```sh
   cp env.example .env.local
   ```

4. Paste the URL and anon key printed by `npx supabase status` into `.env.local`.

Now start the app:

```sh
npm run dev
```

Open http://localhost:3000. You should see the landing page, and **Try Live Demo** opens the sample dashboard right away 🍳

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server on port 3000 |
| `npm run build` | Production build |
| `npm start` | Serve the build |
| `npm run lint` | ESLint |

Going live? Vercel plus a hosted Supabase project works nicely:

1. Create a Supabase project, link it with `npx supabase link --project-ref <ref>` and run `npx supabase db push`.
2. Under Authentication → URL Configuration, set the Site URL and add `https://<your-domain>/**` to the redirect URLs.
3. Turn on the Google provider if you want Google sign-in.
4. Import the repo in Vercel and set the env vars below, with `NEXT_PUBLIC_SITE_URL=https://<your-domain>`.

## 🔑 Env

| Variable | Required | What for |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Supabase API URL (local: `http://127.0.0.1:54321`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | Supabase anon key, protected by RLS |
| `NEXT_PUBLIC_SITE_URL` | yes | Base URL for auth redirects |
| `GOOGLE_GENERATIVE_AI_API_KEY` | no | Shared Gemini key. Without it you get sample images. |
| `GEMINI_TEXT_MODEL`, `GEMINI_IMAGE_MODEL` | no | Override the default models |

A key pasted in **Settings** is stored in your browser and sent per request, so you can try real generations without touching the server env.

There's no test suite yet, but `npx tsc --noEmit` and `npm run lint` both pass ✅