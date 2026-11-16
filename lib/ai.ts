import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createClient } from "@/lib/supabase/server";

export const TEXT_MODEL = process.env.GEMINI_TEXT_MODEL || "gemini-3-pro-preview";
export const IMAGE_MODEL =
  process.env.GEMINI_IMAGE_MODEL || "gemini-3-pro-image-preview";

// Resolves the logged-in user and a Gemini provider for an API request.
// The user's own key (sent from Settings) takes precedence over the shared key.
export async function getAiContext(req: Request) {
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
