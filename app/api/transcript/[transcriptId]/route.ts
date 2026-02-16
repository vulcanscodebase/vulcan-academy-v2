import { type NextRequest, NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { z } from "zod";

// ✅ Transcript ID validation
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
      transcriptId: params.transcriptId, // ✅ then use it
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }
    

    const { question } = await request.json();
    const transcriptId = validation.data.transcriptId;

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

    if (["processing", "queued"].includes(transcriptData.status)) {
      return NextResponse.json(
        {
          status: transcriptData.status,
          message: "Transcription is still processing",
        },
        { status: 202 }
      );
    }

    if (transcriptData.status === "error") {
      return NextResponse.json(
        {
          status: "error",
          error: transcriptData.error,
        },
        { status: 500 }
      );
    }

    if (transcriptData.status === "completed") {
      const transcript = transcriptData.text?.trim();
      if (!transcript) {
        return NextResponse.json({
          status: "completed",
          transcript: "",
          confidence: null,
          bodyLanguage: null,
          knowledge: null,
          skillRelevance: null,
          feedback: "Transcript is empty",
        });
      }

      const prompt = `
You are an AI interviewer evaluating a candidate’s spoken answer.

Question: "${question}"

Transcript of the answer:
"""
${transcript}
"""

Evaluate the response with the following metrics (each from 1 to 10):
- "confidence": 1 to 10 (how self-assured the speaker sounds)
- "bodyLanguage": 1 to 10 (inferred from tone, pauses, and delivery—how engaged and expressive they sound)
- "knowledge": 1 to 10 (how well the candidate understands the topic)
- "skillRelevance": 1 to 10 (how relevant the answer is to job-related skills)
- "fluency": 1 to 10 (how smoothly and clearly the candidate speaks, including grammar, pacing, and coherence)
- "feedback": A sentence or two validating the answer, mentioning improvement areas, praising correctness, or identifying missing skills.

Respond ONLY in the following JSON format:
{
  "confidence": number,
  "bodyLanguage": number,
  "knowledge": number,
  "skillRelevance": number,
  "fluency": number,
  "feedback": "..."
}
`.trim();

      const result = await generateText({
        model: google("gemini-2.0-flash-lite"),
        messages: [{ role: "user", content: prompt }],
      });

      

      const output = result.text.trim();
      const estimatedPromptTokens = Math.ceil(prompt.length / 4);
      const estimatedOutputTokens = Math.ceil(output.length / 4);

      console.log("Estimated Prompt Tokens:", estimatedPromptTokens);
      console.log("Estimated Output Tokens:", estimatedOutputTokens);
      console.log("AI raw output:", output);

      const match = output.match(/{[\s\S]*?}/);
      if (!match) throw new Error("No valid JSON found");

      const metrics = JSON.parse(match[0]) as {
        confidence: number;
        bodyLanguage: number;
        knowledge: number;
        skillRelevance: number;
        fluency: number;
        feedback: string;
      };

      return NextResponse.json({
        status: "completed",
        transcript,
        ...metrics,
      });
    }

    return NextResponse.json(
      { status: transcriptData.status, message: "Unknown status" },
      { status: 500 }
    );
  } catch (error) {
    console.error("POST transcript error:", error);
    return NextResponse.json(
      { error: "Error evaluating transcript." },
      { status: 500 }
    );
  }
}
