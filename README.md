# 🍽️ Platewise

An AI design studio for restaurants 🧑‍🍳 Food photos, menus, posters, logos and packaging, all from one line of text.

Small restaurants need tasty-looking visuals for menus, delivery apps and social media, but almost nobody has a photographer or a designer on staff. So: type a line, pick a style, done. Every generation lands in the gallery and the history, so the good ones are easy to find again.

Built with Next.js 16.4, React 19.2, TypeScript, Tailwind CSS 4.1, shadcn/ui, Supabase and Google Gemini through the Vercel AI SDK 5.

## 🍛 Food Generator

Describe a dish and choose photorealistic, artistic, minimalist or rustic. **Enhance with AI** turns a short prompt into a detailed photography brief, and **Surprise Me** suggests ideas when you're stuck.

**How to use:** open the tool from the sidebar, type what you want in the prompt box, pick a style, then press generate. The result shows up in the preview and is saved to your gallery and history automatically.

## 📸 Photo Enhancer

Upload a real phone photo of a dish. Gemini analyses it and produces a professional version.

**How to use:** open the tool from the sidebar, upload your photo in the upload box, pick a style, then press generate. The result shows up in the preview and is saved to your gallery and history automatically.

## 📋 Menu Maker

Restaurant name, cuisine and a list of dishes with prices go in. A styled menu comes out, in modern minimalist, chalkboard, fine dining or vibrant layouts.

**How to use:** open the tool from the sidebar, type your restaurant details and dishes in the form, pick a style, then press generate. The result shows up in the preview and is saved to your gallery and history automatically.

## 📣 Ad Posters

Promotional posters with a purpose-built prompt for posters.

**How to use:** open the tool from the sidebar, type what you want in the prompt box, pick a style, then press generate. The result shows up in the preview and is saved to your gallery and history automatically.

## 🎨 Logo Creator

Logos for your restaurant with a purpose-built prompt for logos.

**How to use:** open the tool from the sidebar, type what you want in the prompt box, pick a style, then press generate. The result shows up in the preview and is saved to your gallery and history automatically.

## 🥡 Packaging Designer

Branded takeout packaging with a purpose-built prompt for packaging.

**How to use:** open the tool from the sidebar, type what you want in the prompt box, pick a style, then press generate. The result shows up in the preview and is saved to your gallery and history automatically.

## 🖼️ Gallery

Every creation in one place, with style filters, sorting, weekly stats, download and delete.

**How to use:** open the tool from the sidebar, use the filters and sorting at the top, then click an image to download or delete it. Everything you generate shows up here automatically.

## 📜 History

Each attempt is logged with its status (completed or failed), the success rate and the enhanced prompt that produced it.

**How to use:** open the tool from the sidebar and scroll through your attempts. Everything you generate shows up here automatically.

## 💡 Tips & Settings

Tips with prompt advice for each tool. Settings has your profile, account details and an optional personal Gemini key that is stored in the browser.

## 👀 Guest demo

Click **Try Live Demo** on the landing page. You get a sample restaurant with 16 images and a full history. No database or API key needed, and every write action shows a read-only notice instead.

## 🔐 Accounts

Email/password and Google sign-in through Supabase Auth. Row Level Security means each user only sees their own data.

## API

- `POST /api/generate-image` image gen for every tool, templates per type (food/menu/poster/logo/packaging), no key = sample images from /public
- `POST /api/enhance-prompt` prompt rewriting
- `POST /api/analyze-image` photo analysis for the enhancer
- all routes: user check first (401), demo cookie = 403, missing prompt/image = 400, key from `x-gemini-api-key` header or `GOOGLE_GENERATIVE_AI_API_KEY`
- history row written before the call, updated after
- tables: profiles, generated_images, generation_history (RLS on all)

## Run

```sh
npm install
npx supabase start
npx supabase db reset
cp env.example .env.local
npm run dev
```

Fill in `.env.local` from `npx supabase status`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `GOOGLE_GENERATIVE_AI_API_KEY` (optional, no key = sample images)
- `GEMINI_TEXT_MODEL`, `GEMINI_IMAGE_MODEL` (optional)

Open http://localhost:3000 🍳

No tests yet. `npx tsc --noEmit` and `npm run lint` pass.