import { getAiContext, TEXT_MODEL } from "@/lib/ai";
import { generateText } from "ai";
import { getErrorMessage } from "@/lib/errors";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return Response.json({ error: "Prompt is required" }, { status: 400 });
    }

    const ctx = await getAiContext(req);
    if (ctx.error) return ctx.error;

    if (!ctx.google) {
      return Response.json({
        enhancedPrompt: `${prompt}, beautifully plated on a rustic ceramic dish, garnished with fresh herbs, soft natural window light, shallow depth of field, 45-degree angle, warm inviting tones, restaurant-quality presentation`,
        demo: true,
      });
    }

    const { text } = await generateText({
      model: ctx.google(TEXT_MODEL),
      prompt: `You are a professional food photography prompt engineer. Transform this simple menu item description into a detailed, professional prompt for AI image generation.

Original description: "${prompt}"

Create a detailed prompt that includes:
- Specific food details (ingredients, preparation style)
- Professional photography terms (lighting, composition, depth of field)
- Styling and presentation details
- Background and props
- Color and texture descriptions
- Make it appetizing and restaurant-quality

Return ONLY the enhanced prompt, no explanations or additional text.`,
      temperature: 0.7,
      maxOutputTokens: 1024,
    });

    return Response.json({ enhancedPrompt: text.trim() });
  } catch (error: unknown) {
    console.error("Error enhancing prompt:", error);
    return Response.json(
      { error: getErrorMessage(error, "Failed to enhance prompt") },
      { status: 500 }
    );
  }
}
