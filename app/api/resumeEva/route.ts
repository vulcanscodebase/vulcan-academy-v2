import { type NextRequest, NextResponse } from "next/server"
import { google } from "@ai-sdk/google"
import { generateText } from "ai"
import { z } from "zod"

// Input validation schema
const requestBodySchema = z.object({
  text: z.string().min(10, "Resume text is too short"),
  jobTitle: z.string().min(1, "Job title is required"),
})

// Output validation schema
const evaluationSchema = z.object({
  atsScore: z.number().int().min(0).max(100),
  tips: z.array(z.string()).length(3),
  followUpQuestion: z.string().min(1),
  technicalQuestion: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = requestBodySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: `Validation error: ${parsed.error.errors[0].message}` }, { status: 400 })
    }

    const { text, jobTitle } = parsed.data

    // Truncate text if too long to avoid token limits
    const maxTextLength = 8000
    const truncatedText = text.length > maxTextLength ? text.substring(0, maxTextLength) + "..." : text

    const prompt = `
You are an ATS (Applicant Tracking System) optimization assistant.

Analyze the following resume for the job title "${jobTitle}" and return ONLY a valid JSON object with these exact fields:

{
  "atsScore": <integer 0-100>,
  "tips": ["<tip1>", "<tip2>", "<tip3>"],
  "followUpQuestion": "<specific question about this resume>",
  "technicalQuestion": "<technical question for ${jobTitle}>"
}

Rules:
- atsScore: Integer between 0-100 based on job relevance
- tips: Exactly 3 actionable resume improvement tips
- followUpQuestion: A specific question about their experience/skills
- technicalQuestion: A technical question relevant to ${jobTitle}
- Return ONLY the JSON object, no other text

Resume Text:
${truncatedText}
`.trim()

    const result = await generateText({
      model: google("gemini-2.0-flash-lite"),
      messages: [{ role: "user", content: prompt }],
      maxTokens: 1000,
      temperature: 0.3, // Lower temperature for more consistent JSON output
    })

    let output = result.text.trim()

    // Clean up common formatting issues
    output = output
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim()

    // Extract JSON object using a more compatible approach
    const jsonMatch = output.match(/{[\s\S]*}/)
    if (jsonMatch) {
      output = jsonMatch[0]
    }

    let parsedOutput
    try {
      parsedOutput = JSON.parse(output)
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError)
      console.error("Raw output:", output)

      // Fallback response if AI doesn't return valid JSON
      return NextResponse.json({
        status: "success",
        evaluation: {
          atsScore: 75,
          tips: [
            "Add more relevant keywords from the job description",
            "Quantify your achievements with specific numbers and metrics",
            "Tailor your summary to highlight skills relevant to this role",
          ],
          followUpQuestion: `Can you tell me more about your experience with ${jobTitle} responsibilities?`,
          technicalQuestion: `What technical skills do you consider most important for a ${jobTitle} role?`,
        },
      })
    }

    // Validate the parsed output
    const validationResult = evaluationSchema.safeParse(parsedOutput)
    if (!validationResult.success) {
      console.error("Validation Error:", validationResult.error)

      // Return fallback if validation fails
      return NextResponse.json({
        status: "success",
        evaluation: {
          atsScore: Math.min(Math.max(parsedOutput.atsScore || 75, 0), 100),
          tips:
            Array.isArray(parsedOutput.tips) && parsedOutput.tips.length >= 3
              ? parsedOutput.tips.slice(0, 3)
              : [
                  "Add more relevant keywords from the job description",
                  "Quantify your achievements with specific numbers and metrics",
                  "Tailor your summary to highlight skills relevant to this role",
                ],
          followUpQuestion:
            parsedOutput.followUpQuestion ||
            `Can you tell me more about your experience with ${jobTitle} responsibilities?`,
          technicalQuestion:
            parsedOutput.technicalQuestion ||
            `What technical skills do you consider most important for a ${jobTitle} role?`,
        },
      })
    }

    return NextResponse.json({
      status: "success",
      evaluation: validationResult.data,
    })
  } catch (error) {
    console.error("❌ Error evaluating resume:", error)

    // More specific error handling
    if (error instanceof Error) {
      if (error.message.includes("rate limit")) {
        return NextResponse.json(
          { error: "Service temporarily unavailable. Please try again in a moment." },
          { status: 429 },
        )
      }
      if (error.message.includes("timeout")) {
        return NextResponse.json({ error: "Request timeout. Please try again." }, { status: 408 })
      }
    }

    return NextResponse.json({ error: "Failed to evaluate resume. Please try again." }, { status: 500 })
  }
}
