import { type NextRequest, NextResponse } from "next/server"
import { google } from "@ai-sdk/google"
import { generateText } from "ai"
import { z } from "zod"

// Input validation schema
const requestBodySchema = z.object({
  text: z.string().min(10, "Resume text is too short"),
  jobTitle: z.string().min(1, "Job title is required"),
})


export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = requestBodySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: `Validation error: ${parsed.error.errors[0].message}` },
        { status: 400 }
      )
    }

    const { text, jobTitle } = parsed.data

    // Truncate text if too long
    const maxTextLength = 8000
    const truncatedText =
      text.length > maxTextLength ? text.substring(0, maxTextLength) + "..." : text

    const prompt = `
You are an ATS (Applicant Tracking System) optimization assistant.

Analyze the following resume for the job title "${jobTitle}" and return ONLY a valid JSON object with these exact fields:

{
  "atsScore": <integer 0-100>,
  "tips": ["<tip1>", "<tip2>", "<tip3>"],
  "followUpQuestions": ["<resume-based question 1>", "<resume-based question 2>"]
}

Rules:
- atsScore: Integer between 0-100 based on job relevance
- tips: Exactly 3 actionable resume improvement tips
- followUpQuestions: 2 specific questions about their experience/skills found in the resume
- Return ONLY the JSON object, no other text

Resume Text:
${truncatedText}
`.trim()

    const result = await generateText({
      model: google("gemini-2.0-flash-lite"),
      messages: [{ role: "user", content: prompt }],
      maxTokens: 1000,
      temperature: 0.3,
    })

    let output = result.text.trim()

    // Clean up formatting issues
    output = output
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim()

    // Extract JSON if wrapped in extra text
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

      // Fallback response
      return NextResponse.json({
        status: "success",
        evaluation: {
          atsScore: 70,
          tips: [
            "Highlight your most recent and relevant skills more clearly",
            "Include measurable achievements where possible",
            "Tailor your resume summary to show intent for your career path",
          ],
          followUpQuestions: [
            `Can you elaborate on your most significant achievement from your resume?`,
            `What motivated you to pursue the skills listed in your resume?`,
          ],
          technicalQuestions: [
            "What kind of job are you applying for?",
            "What experience have you gained so far?",
          ],
        },
      })
    }

    // Validate model output
    const validationResult = z
      .object({
        atsScore: z.number().int().min(0).max(100),
        tips: z.array(z.string()).length(3),
        followUpQuestions: z.array(z.string()).length(2),
      })
      .safeParse(parsedOutput)

    if (!validationResult.success) {
      console.error("Validation Error:", validationResult.error)

      // Return fallback if validation fails
      return NextResponse.json({
        status: "success",
        evaluation: {
          atsScore: parsedOutput.atsScore || 70,
          tips:
            Array.isArray(parsedOutput.tips) && parsedOutput.tips.length >= 3
              ? parsedOutput.tips.slice(0, 3)
              : [
                  "Highlight your most recent and relevant skills more clearly",
                  "Include measurable achievements where possible",
                  "Tailor your resume summary to show intent for your career path",
                ],
          followUpQuestions:
            Array.isArray(parsedOutput.followUpQuestions) &&
            parsedOutput.followUpQuestions.length >= 2
              ? parsedOutput.followUpQuestions.slice(0, 2)
              : [
                  `Can you elaborate on your most significant achievement from your resume?`,
                  `What motivated you to pursue the skills listed in your resume?`,
                ],
          technicalQuestions: [
            "What kind of job are you applying for?",
            "What experience have you gained so far?",
          ],
        },
      })
    }

    // Return validated data + hardcoded technical questions
    return NextResponse.json({
      status: "success",
      evaluation: {
        atsScore: validationResult.data.atsScore,
        tips: validationResult.data.tips,
        followUpQuestions: validationResult.data.followUpQuestions,
        technicalQuestions: [
          "What kind of job are you applying for?",
          "What experience have you gained so far?",
        ],
      },
    })
  } catch (error) {
    console.error("❌ Error evaluating resume (general):", error)

    if (error instanceof Error) {
      if (error.message.includes("rate limit")) {
        return NextResponse.json(
          { error: "Service temporarily unavailable. Please try again in a moment." },
          { status: 429 }
        )
      }
      if (error.message.includes("timeout")) {
        return NextResponse.json(
          { error: "Request timeout. Please try again." },
          { status: 408 }
        )
      }
    }

    return NextResponse.json(
      { error: "Failed to evaluate resume. Please try again." },
      { status: 500 }
    )
  }
}
