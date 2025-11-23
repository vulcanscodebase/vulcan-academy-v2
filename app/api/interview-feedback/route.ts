import { type NextRequest, NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { z } from "zod";

// Define shape of incoming data
const requestBodySchema = z.object({
  transcriptData: z.array(
    z.object({
      question: z.string(),
      transcript: z.string(),
      questionNumber: z.number(),
    })
  ),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = requestBodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const transcriptData = parsed.data.transcriptData;

    // Construct a full formatted transcript string
    const fullTranscript = transcriptData
      .map(
        (item) =>
          `Q${item.questionNumber}: ${item.question}\nAnswer: ${item.transcript}`
      )
      .join("\n\n");

    const prompt = `
You are an experienced interview coach.

Evaluate the following interview transcript and give feedback categorized under 3 sections: "Strengths", "Areas to Improve", and "Interview Tips". 

Please return your response strictly in this JSON format:

{
  "strengths": [
    "Point 1",
    "Point 2",
    "Point 3"
  ],
  "improvements": [
    "Point 1",
    "Point 2",
    "Point 3"
  ],
  "tips": [
    "Tip 1",
    "Tip 2",
    "Tip 3"
  ]
}

Avoid commentary outside of the JSON. Do not include any headings, emojis, or formatting like bold or bullet points. Be concise but informative. Make sure all fields are always present.

Here is the interview transcript:
"""
${fullTranscript}
"""
Be precise, helpful, and constructive.
`.trim();

    const result = await generateText({
      model: google("gemini-2.0-flash-lite"),
      messages: [{ role: "user", content: prompt }],
    });

    const feedback = result.text.trim();
    console.log("🔍 Gemini Feedback Output:\n", feedback);

    return NextResponse.json({
      status: "success",
      feedback,
    });
  } catch (error) {
    console.error("Error generating interview feedback:", error);
    return NextResponse.json(
      { error: "Failed to generate feedback." },
      { status: 500 }
    );
  }
}
