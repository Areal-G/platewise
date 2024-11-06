# 🍽️ Platewise

Type "crispy masala dosa with coconut chutney", pick a style, get a menu-ready food photo. That's the whole idea.

- 🍛 Food Generator: describe a dish, pick a style, get a photo
- ✨ Enhance with AI: turns a short prompt into a proper photo brief
- 🖼️ Gallery: everything you've made, in one place
- 📜 History: every attempt with its status
- 🔐 Sign in with email and password (Supabase Auth)

Built with Next.js, Supabase and Google Gemini via the Vercel AI SDK.

## Run

```sh
npm install
npx supabase start
npx supabase db reset
cp env.example .env.local
npm run dev
```

Fill `.env.local` with what `npx supabase status` prints. Add `GOOGLE_GENERATIVE_AI_API_KEY` for real images, then open http://localhost:3000 🍳