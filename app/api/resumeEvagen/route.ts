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

    // Truncate long resumes
    const maxTextLength = 8000
    const truncatedText =
      text.length > maxTextLength ? text.substring(0, maxTextLength) + "..." : text

      const prompt = `
      You are an interview preparation assistant.
      
      Analyze the following resume specifically for the job title "${jobTitle}" and return ONLY a valid JSON object with these exact fields:
      
      {
        "atsScore": <integer 0-100>,
        "tips": ["<tip1>", "<tip2>", "<tip3>"],
        "followUpQuestion": "<a single resume-based follow-up question>"
      }
      
      Rules:
      - atsScore: Integer between 0-100 based strictly on resume relevance.
      - tips: Exactly 3 improvement tips tied to the resume and job title.
      - followUpQuestion:
          - Must be based strictly on a specific experience, project, achievement, or skill mentioned in the resume.
          - Must NOT reference the job title directly.
          - Must NOT ask about role responsibilities, job duties, or what the position entails.
          - Must NOT ask about general job preparation.
          - Must NOT ask hypothetical questions.
          - Must NOT ask broad or generic questions.
          - Must NOT ask anything resembling: "How have you prepared for the general position?" or "Can you describe the responsibilities of this role?"
          - The question MUST be anchored to content directly found in the resume text.
      - Return ONLY the JSON object, no surrounding text.
      
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

    output = output
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim()

    const jsonMatch = output.match(/{[\s\S]*}/)
    if (jsonMatch) output = jsonMatch[0]

    let parsedOutput
    try {
      parsedOutput = JSON.parse(output)
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError)
      console.error("Raw output:", output)

      // Fallback
      return NextResponse.json({
        status: "success",
        evaluation: {
          atsScore: 70,
          tips: [
            "Highlight your most recent and relevant skills more clearly",
            "Include measurable achievements where possible",
            "Tailor your resume summary to better align with the job title",
          ],
          followUpQuestion:
            "Can you expand on one key accomplishment from your recent experience?",
        },
      })
    }

    // Validate model output
    const validationResult = z
      .object({
        atsScore: z.number().int().min(0).max(100),
        tips: z.array(z.string()).length(3),
        followUpQuestion: z.string(),
      })
      .safeParse(parsedOutput)

    if (!validationResult.success) {
      console.error("Validation Error:", validationResult.error)

      return NextResponse.json({
        status: "success",
        evaluation: {
          atsScore: parsedOutput?.atsScore || 70,
          tips:
            Array.isArray(parsedOutput?.tips) && parsedOutput.tips.length >= 3
              ? parsedOutput.tips.slice(0, 3)
              : [
                  "Highlight your most recent and relevant skills more clearly",
                  "Include measurable achievements where possible",
                  "Tailor your resume summary to better align with the job title",
                ],
          followUpQuestion:
            typeof parsedOutput?.followUpQuestion === "string"
              ? parsedOutput.followUpQuestion
              : "Can you elaborate on a project mentioned in your resume?",
        },
      })
    }

    // Final successful return
    return NextResponse.json({
      status: "success",
      evaluation: {
        atsScore: validationResult.data.atsScore,
        tips: validationResult.data.tips,
        followUpQuestion: validationResult.data.followUpQuestion,
      },
    })
  } catch (error) {
    console.error("❌ General error:", error)

    if (error instanceof Error) {
      if (error.message.includes("rate limit")) {
        return NextResponse.json(
          { error: "Service temporarily unavailable. Please try again." },
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
