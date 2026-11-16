<div align="center">

# Platewise

**An AI design studio for restaurants: food photos, menus, posters, logos and packaging from one line of text.**

![Next.js](https://img.shields.io/badge/Next.js-16.4-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19.2-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Postgres_+_Auth-3FCF8E?logo=supabase&logoColor=white)
![Gemini](https://img.shields.io/badge/Google_Gemini-AI_SDK_5-4285F4?logo=googlegemini&logoColor=white)
[![Live demo](https://img.shields.io/badge/demo-live-ff6a00)](https://platewise.arealjagema.com)

[Features](#features) · [Design](#design) · [Screenshots](#screenshots) · [Tech stack](#tech-stack) · [Getting started](#getting-started)

</div>

<br>

![Platewise dashboard in a browser with the mobile landing page beside it](readme/hero.png)

## Overview

Small restaurants need appetizing visuals for menus, delivery apps and social media, but rarely have a photographer or a designer. Platewise turns a line of text into those assets. A cook types "crispy masala dosa with coconut chutney", picks a style and gets a menu-ready photo. The same flow produces full menu layouts, promotional posters, logos and branded takeout packaging.

Every generation is saved to a searchable gallery and logged in a history view with its status and the AI-enhanced prompt, so good results are easy to find and reuse.

## Live demo

A read-only guest demo runs at **https://platewise.arealjagema.com**. It is built from the [`demo`](https://github.com/Areal-G/platewise/tree/demo) branch, which swaps Supabase for an in-memory sample restaurant so it needs no database or API key. This `main` branch is the full app.

Locally, `npm run seed` fills your database with the same sample restaurant (16 images and a full history) behind a login you choose. Without a Gemini key, the generators return bundled sample images that match the dish in your prompt, so every tool works end to end. Add `GOOGLE_GENERATIVE_AI_API_KEY`, or paste your own key in **Settings**, to generate real images.

## Features

### Food Generator

Describe a dish, choose photorealistic, artistic, minimalist or rustic, and get a menu-ready photo. **Enhance with AI** rewrites a short prompt into a detailed photography brief, and **Surprise Me** suggests ideas when you're stuck.

![Food Generator with a masala dosa result](readme/food-generator.png)

### Menu Maker

Restaurant name, cuisine and a list of dishes with prices in; a styled menu out, in modern minimalist, chalkboard, fine dining or vibrant layouts.

![Menu Maker with an elegant fine dining menu](readme/menu-maker.png)

### Gallery

Every creation in one place, with style filters, sorting, weekly stats, download and delete.

![Gallery of generated food photos, menus, posters and logos](readme/gallery.png)

### History

Each attempt is logged with its status (completed or failed), the success rate and the enhanced prompt that produced it.

![Generation history with statuses and enhanced prompts](readme/history.png)

**Also included**
- **Photo Enhancer:** upload a real phone photo; Gemini analyses it and produces a professional version.
- **Ad Posters, Logo Creator, Packaging Designer:** purpose-built prompts for each asset type.
- **Tips and best practices**, profile settings and an optional personal Gemini key stored in the browser.
- **Accounts:** email/password and Google sign-in through Supabase Auth, with Row Level Security so each user only sees their own data.

## Design

- **Color.** One confident brand orange (`oklch(0.65 0.25 45)`) for actions and the active nav item, with a distinct accent color per tool (orange, violet, blue, red, pink, green) so each generator is recognisable at a glance.
- **Typography.** Geist Sans for the interface and Pacifico script for the brand accent in headlines ("Restaurant Design Studio"), loaded through `next/font`.
- **Layout.** A fixed sidebar with icon + label navigation on desktop, generous card spacing and an image-first dashboard where recent creations are the visual focus.
- **Responsive.** On phones the sidebar becomes a bottom tab bar and every tool stacks into a single column, as shown below.
- **States.** Generators show a clear empty preview before the first run, a progress state while generating and a clear error message instead of failing silently.
- **Light only.** The app ships a single light theme; dark mode is not implemented.

![Three phones showing the landing page, dashboard and gallery](readme/mobile.png)

## Screenshots

| | |
| --- | --- |
| <img src="readme/landing-top.png" width="440" alt="Landing page"><br>**Landing page.** Hero, tool overview and sign-up. | <img src="readme/tips.png" width="440" alt="Tips and guide"><br>**Tips & guide.** Prompt advice and examples for each tool. |
| <img src="readme/settings.png" width="440" alt="Settings"><br>**Settings.** Profile, account details and an optional personal Gemini key. | <img src="readme/features.png" width="440" alt="Landing feature cards"><br>**Feature cards.** The landing page stacks one card per tool as you scroll. |

## Tech stack

| Layer | Technology | Why |
| --- | --- | --- |
| Framework | Next.js 16.4 (App Router, Turbopack), React 19.2 | Server route handlers for AI calls next to a client-heavy dashboard |
| Language | TypeScript 5.9 | Shared types across routes, Supabase rows and UI |
| Styling | Tailwind CSS 4.1, shadcn/ui, Radix primitives | Accessible primitives with a custom brand layer |
| AI | Vercel AI SDK 5 with `@ai-sdk/google` 2 | One API for Gemini text and image models, easy to swap models |
| Data and auth | Supabase (PostgreSQL, Auth), `@supabase/ssr` 0.7 | Auth, Postgres and RLS in one service, with cookie sessions for SSR |
| UI extras | Embla Carousel 8, date-fns, lucide-react | Landing carousels, date formatting, icons |

## Architecture

```mermaid
flowchart LR
  subgraph Browser
    UI["Dashboard tools<br/>(client components)"]
  end
  subgraph Next["Next.js 16"]
    PX["proxy.ts<br/>Supabase session refresh"]
    API1["POST /api/generate-image"]
    API2["POST /api/enhance-prompt"]
    API3["POST /api/analyze-image"]
  end
  G["Google Gemini<br/>text + image models"]
  SB[("Supabase<br/>profiles · generated_images<br/>generation_history (RLS)")]
  SAMPLE["/public sample images<br/>(no API key)"]

  UI --> PX
  UI -- "prompt, style, type" --> API1 & API2 & API3
  API1 & API2 & API3 -- "key from env or x-gemini-api-key" --> G
  API1 -. "no key configured" .-> SAMPLE
  UI -- "save image + history row" --> SB
```

**Key decisions**
- **One AI context per request.** `getAiContext()` resolves the signed-in user and a Gemini provider. A key sent from Settings (`x-gemini-api-key`) wins over the server key.
- **Prompt templates per asset type.** The image route wraps the user's text in a template for food, menu, poster, logo or packaging, so short inputs still produce composed, on-brand results.
- **Runs without a key.** With no Gemini key, the routes return bundled sample images matched to the dish in the prompt, so the full flow (generate, save, gallery, history) works for local development and reviews.
- **History as an audit trail.** Each attempt writes a `generation_history` row before the call and updates it with the result, so failures are visible next to successes.

## Engineering highlights

- **Authorization in two layers.** Route handlers check the Supabase user before any AI call, and Postgres Row Level Security limits every table to `auth.uid()`, so a bug in the UI can't leak another restaurant's images.
- **Cost safety.** Every AI route requires a signed-in user, and users can bring their own Gemini key so the shared key isn't the only option.
- **Input checks.** Each route rejects a missing prompt or image with a `400` before it reaches the model.
- **Graceful degradation.** No key, no network or a failed generation each lead to a clear state: sample images, a toast, or a failed row in History.
- **Session handling.** `proxy.ts` refreshes the Supabase session on every request, so server components and route handlers always see a valid user.

```ts
// lib/ai.ts
export async function getAiContext(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: Response.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const apiKey =
    req.headers.get("x-gemini-api-key") ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  // No key configured: run in demo mode with sample assets from /public
  if (!apiKey) {
    return { error: undefined, user, google: null };
  }
  // ...
```


## Getting started

**Prerequisites:** Node.js 20 or newer and npm, Docker for the local Supabase stack, and optionally a Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey).

```bash
git clone <your-fork-url> platewise
cd platewise
npm install
```

Start Supabase locally and apply the schema in `supabase/migrations`:

```bash
npx supabase start
```

```bash
npx supabase db reset
```

Create `.env.local` from the template and fill in the values printed by `npx supabase status`:

```bash
cp .env.example .env.local
```

Optionally load the sample restaurant. It needs `SUPABASE_SERVICE_ROLE_KEY` (the `service_role key` from `npx supabase status`) and signs in with `SEED_OWNER_EMAIL` / `SEED_OWNER_PASSWORD`; against a local Supabase those default to the local-only values in `supabase/seed.mjs`. Running it again updates the same rows.

```bash
npm run seed
```

```bash
npm run dev
```

Open http://localhost:3000. You should see the landing page; sign up, or sign in with the seeded account to see the sample dashboard.

<details>
<summary><b>Environment variables</b></summary>

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Supabase API URL (local: `http://127.0.0.1:54321`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | Supabase anon key, protected by RLS |
| `NEXT_PUBLIC_SITE_URL` | yes | Base URL for auth redirects |
| `GOOGLE_GENERATIVE_AI_API_KEY` | optional | Shared Gemini key. Without it, the tools return sample images. |
| `GEMINI_TEXT_MODEL`, `GEMINI_IMAGE_MODEL` | optional | Override the default Gemini models |
| `SUPABASE_SERVICE_ROLE_KEY` | seed only | Lets `npm run seed` create the sample account; never sent to the browser |
| `SEED_OWNER_EMAIL`, `SEED_OWNER_PASSWORD` | seed only | Login for the seeded account; required for a hosted project, local-only defaults otherwise |

</details>

<details>
<summary><b>Scripts</b></summary>

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server on port 3000 |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript type check |
| `npm test` | Unit tests (Vitest) |
| `npm run seed` | Load the sample restaurant into Supabase |

</details>

<details>
<summary><b>Project structure</b></summary>

```
app/
  page.tsx                 landing page
  (auth)/                  login, signup and auth server actions
  auth/callback/           OAuth and email link callback
  api/
    generate-image/        image generation for every tool
    enhance-prompt/        prompt rewriting
    analyze-image/         photo analysis for the enhancer
  dashboard/               dashboard, generate, enhance, menu, posters,
                           logo, packaging, gallery, history, tips, settings
components/
  landing/                 hero, carousel, features, how it works, FAQ
  dashboard/               sidebar, mobile nav, load error state
  brand/ layout/ ui/       logo, navbar, footer, shadcn/ui primitives
lib/
  ai.ts                    AI context, models and sample-image fallback
  demo-images.ts           sample images returned when no Gemini key is set
  supabase/                browser, server and middleware clients
supabase/
  migrations/              tables, RLS policies and profile trigger
  seed.mjs                 sample restaurant for npm run seed
proxy.ts                   session refresh on every request
public/dishes, features/   sample images for seed data and no-key mode
```

</details>

## Testing & quality

Unit tests cover the shared helpers; CI runs lint, type check and tests on every push.

```bash
npm test
```

```bash
npm run typecheck
```

```bash
npm run lint
```

## Deployment

Deploy to Vercel with a hosted Supabase project.

1. Create a Supabase project, link it (`npx supabase link --project-ref <ref>`) and run `npx supabase db push`.
2. Under Authentication → URL Configuration, set the Site URL and add `https://<your-domain>/**` to the redirect URLs. Enable the Google provider if you want Google sign-in.
3. Import the repository in Vercel and set the environment variables above, with `NEXT_PUBLIC_SITE_URL=https://<your-domain>`.

## Roadmap

- Store generated images in Supabase Storage instead of base64 data URLs in the `generated_images` table.
- Make the no-key sample matcher prefer the dish name over shared words (a "paneer tikka masala" prompt can return the masala dosa sample).
- Validate request bodies with schemas (Zod is installed but not used yet).
- Add tests for the AI routes and the RLS policies.
- Per-user rate limits and usage quotas for the shared Gemini key.