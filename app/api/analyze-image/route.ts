import { getAiContext, TEXT_MODEL } from "@/lib/ai";
import { generateText } from "ai";
import { getErrorMessage } from "@/lib/errors";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return Response.json({ error: "Image is required" }, { status: 400 });
    }

    const ctx = await getAiContext(req);
    if (ctx.error) return ctx.error;

    if (!ctx.google) {
      return Response.json({
        success: true,
        demo: true,
        description:
          "A freshly prepared dish plated on a clean white ceramic plate, garnished with chopped herbs, with glossy sauce and vibrant colors, lit by soft natural light with a shallow depth of field, styled for a premium restaurant menu.",
      });
    }

    // Remove data:image/jpeg;base64, prefix if present
    const base64Image = image.replace(
      /^data:image\/(png|jpeg|jpg|webp);base64,/,
      ""
    );

    const result = await generateText({
      model: ctx.google(TEXT_MODEL),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this food image and provide a highly detailed, appetizing description that could be used as a prompt to generate a professional, high-quality version of this dish. Focus on the ingredients, textures, lighting, plating, and mood. Make it sound delicious and restaurant-quality.",
            },
            { type: "image", image: base64Image },
          ],
        },
      ],
    });

    return Response.json({
      success: true,
      description: result.text,
    });
  } catch (error: unknown) {
    console.error("Error analyzing image:", error);
    return Response.json(
      { error: getErrorMessage(error, "Failed to analyze image") },
      { status: 500 }
    );
  }
}
