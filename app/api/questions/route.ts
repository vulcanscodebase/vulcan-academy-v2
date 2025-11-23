import path from "path"
import fs from "fs/promises"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get("title")

  if (!title) {
    return new Response(JSON.stringify({ error: "Missing 'title' query parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    const filePath = path.join(process.cwd(), "app", "data", "questions.json")
    const fileContents = await fs.readFile(filePath, "utf-8")
    const questionsMap = JSON.parse(fileContents)

    // Fallback to "General" if not found
    const jobQuestions = questionsMap[title] || questionsMap["General"]

    if (!jobQuestions || jobQuestions.length < 1) {
      return new Response(
        JSON.stringify({ error: "Not enough questions available for this title." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // Always make first question "Tell me about yourself"
    const firstQuestion = "Tell me about yourself"

    // Exclude duplicates if "Tell me about yourself" is already in jobQuestions
    const remainingQuestions = jobQuestions.filter(
      (q: string) => q.trim().toLowerCase() !== firstQuestion.toLowerCase()
    )

    // Shuffle remaining and pick 2 random ones
    const shuffled = remainingQuestions.sort(() => 0.5 - Math.random())
    const randomQuestions = shuffled.slice(0, 2)

    // Final array: [Tell me about yourself, random1, random2]
    const selectedQuestions = [firstQuestion, ...randomQuestions]

    return new Response(JSON.stringify({ questions: selectedQuestions }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error reading questions JSON:", error)
    return new Response(JSON.stringify({ error: "Failed to load questions." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
