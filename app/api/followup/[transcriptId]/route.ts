import { type NextRequest, NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { z } from "zod";

// ✅ Transcript ID validation schema
const transcriptIdSchema = z.object({
  transcriptId: z.string().min(1, "Transcript ID is required"),
});

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ transcriptId: string }> }
) {
  try {
    const params = await context.params;
    const validation = transcriptIdSchema.safeParse({
      transcriptId: params.transcriptId,
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { question } = await request.json();
    const transcriptId = validation.data.transcriptId;

    // 🔹 Fetch transcript from AssemblyAI
    const transcriptRes = await fetch(
      `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
      {
        method: "GET",
        headers: {
          authorization: process.env.ASSEMBLYAI_API_KEY!,
          "Content-Type": "application/json",
        },
      }
    );

    if (!transcriptRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch transcript" },
        { status: 500 }
      );
    }

    const transcriptData = await transcriptRes.json();

    // 🔹 Still processing → return 202
    if (["processing", "queued"].includes(transcriptData.status)) {
      return NextResponse.json(
        {
          status: transcriptData.status,
          message: "Transcription is still processing",
        },
        { status: 202 }
      );
    }

    // 🔹 Error in transcription
    if (transcriptData.status === "error") {
      return NextResponse.json(
        {
          status: "error",
          error: transcriptData.error,
        },
        { status: 500 }
      );
    }

    // 🔹 Completed transcript → now generate follow-up
    if (transcriptData.status === "completed") {
      const transcript = transcriptData.text?.trim();

      if (!transcript) {
        // Completed but no transcript text
        return NextResponse.json(
          {
            status: "completed",
            followUpQuestion: null,
            message: "Transcript is empty",
          },
          { status: 200 }
        );
      }

      try {
        const prompt = `
You are an AI interviewer following up on a candidate's answer.

Original Question: "${question}"

Candidate's Answer Transcript:
"""
${transcript}
"""

Generate ONE thoughtful and context-aware follow-up question. 
It should dive deeper into the candidate's reasoning, clarify ambiguity, 
or explore implications of their answer. Be concise and specific.

Respond ONLY with the follow-up question text. Do not add any explanation or formatting.
`.trim();

        const result = await generateText({
          model: google("gemini-2.0-flash-lite"),
          messages: [{ role: "user", content: prompt }],
        });

        const followUp = result.text.trim();

        if (!followUp) {
          // Transcript ready but AI failed to generate follow-up
          return NextResponse.json(
            {
              status: "completed",
              followUpQuestion: null,
              message: "Transcript ready but follow-up could not be generated",
            },
            { status: 500 }
          );
        }

        // ✅ Success → Only now return 200
        const estimatedPromptTokens = Math.ceil(prompt.length / 4);
        const estimatedOutputTokens = Math.ceil(followUp.length / 4);

        console.log("Estimated Prompt Tokens:", estimatedPromptTokens);
        console.log("Estimated Output Tokens:", estimatedOutputTokens);
        console.log("Generated follow-up:", followUp);

        return NextResponse.json(
          {
            status: "completed",
            followUpQuestion: followUp,
          },
          { status: 200 }
        );
      } catch (err) {
        console.error("Follow-up generation failed:", err);
        return NextResponse.json(
          {
            status: "completed",
            followUpQuestion: null,
            error: "Transcript ready but follow-up generation failed",
          },
          { status: 500 }
        );
      }
    }

    // 🔹 Catch-all for unknown statuses
    return NextResponse.json(
      { status: transcriptData.status, message: "Unknown status" },
      { status: 500 }
    );
  } catch (error) {
    console.error("POST follow-up error:", error);
    return NextResponse.json(
      { error: "Error generating follow-up question." },
      { status: 500 }
    );
  }
}
