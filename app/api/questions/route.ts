import path from "path"
import fs from "fs/promises"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const titleQuery = searchParams.get("title")
  const modeQuery = searchParams.get("mode") || "Basic" // default to Basic if not provided

  if (!titleQuery) {
    return new Response(JSON.stringify({ error: "Missing 'title' query parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    const filePath = path.join(process.cwd(), "app", "data", "questions.json")
    const fileContents = await fs.readFile(filePath, "utf-8")
    const questionsMap = JSON.parse(fileContents)

    const jobEntry = Object.entries(questionsMap).find(
      ([key]) => key.toLowerCase() === titleQuery.toLowerCase()
    )
    const jobQuestions = jobEntry?.[1] || questionsMap["General"]

    if (!jobQuestions) {
      return new Response(JSON.stringify({ error: "No questions available." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    if ((jobEntry?.[0] || "General") === "General") {
      return new Response(JSON.stringify({ questions: jobQuestions.slice(0, 3) }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    }

    const normalizedMode = modeQuery.charAt(0).toUpperCase() + modeQuery.slice(1).toLowerCase()
    const modeQuestions = jobQuestions[normalizedMode]

    if (!modeQuestions) {
      // Fallback to General if mode not found
      const generalQuestions = questionsMap["General"]
      const fallbackQuestions = generalQuestions.slice(0, 3)
      return new Response(
        JSON.stringify({ questions: fallbackQuestions, fallback: true }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // Build selected questions
    const pools = ["Pool1", "Pool2", "Pool3"]
    const selectedQuestions: string[] = []

    // Q1 is always "Tell me about yourself"
    selectedQuestions.push("Tell me about yourself")

    // Q2-Q4: pick one random question from Pool1, Pool2, Pool3
    pools.forEach((pool, index) => {
      const poolQuestions = modeQuestions[pool]
      if (poolQuestions && poolQuestions.length > 0) {
        const randomIndex = Math.floor(Math.random() * poolQuestions.length)
        selectedQuestions.push(poolQuestions[randomIndex])
      } else {
        // Fallback to General questions if pool missing or empty
        const generalQuestions = questionsMap["General"]
        if (generalQuestions && generalQuestions.length > index) {
          selectedQuestions.push(generalQuestions[index])
        } else {
          selectedQuestions.push("No question available")
        }
      }
    })

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
