import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createClient } from "@/lib/supabase/server";
import { DEMO_COOKIE } from "@/lib/demo";

export const TEXT_MODEL = process.env.GEMINI_TEXT_MODEL || "gemini-3-pro-preview";
export const IMAGE_MODEL =
  process.env.GEMINI_IMAGE_MODEL || "gemini-3-pro-image-preview";

// Resolves the logged-in user and a Gemini provider for an API request.
// The user's own key (sent from Settings) takes precedence over the shared key.
export async function getAiContext(req: Request) {
  if (req.headers.get("cookie")?.includes(`${DEMO_COOKIE}=1`)) {
    return {
      error: Response.json(
        { error: "Guest demo is read-only. Create a free account to generate." },
        { status: 403 }
      ),
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: Response.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const apiKey =
    req.headers.get("x-gemini-api-key") ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  // No key configured: run in demo mode with sample assets from /public
  if (!apiKey) {
    return { error: undefined, user, google: null };
  }

  return {
    error: undefined,
    user,
    google: createGoogleGenerativeAI({ apiKey }),
  };
}
