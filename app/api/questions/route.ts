import path from "path"
import fs from "fs/promises"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get("title")
  const mode = searchParams.get("mode") || "Basic" // default to Basic if not provided

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

    // Fallback to "General" if title not found
    const jobQuestions = questionsMap[title] || questionsMap["General"]

    if (!jobQuestions) {
      return new Response(JSON.stringify({ error: "No questions available." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    // If General, just return its questions
    if (title === "General") {
      return new Response(JSON.stringify({ questions: jobQuestions.slice(0, 3) }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Ensure mode exists in data
    const modeQuestions = jobQuestions[mode]
    if (!modeQuestions) {
      return new Response(JSON.stringify({ error: `No questions found for mode '${mode}'` }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    const pools = ["Pool1", "Pool2", "Pool3"]

    const selectedQuestions: string[] = []

    // Always Q1 is "Tell me about yourself"
    selectedQuestions.push("Tell me about yourself")

    // For Q2, Q3, Q4: pick one random question from Pool1, Pool2, Pool3
    pools.forEach((pool, index) => {
      const poolQuestions = modeQuestions[pool]
      if (poolQuestions && poolQuestions.length > 0) {
        const randomIndex = Math.floor(Math.random() * poolQuestions.length)
        selectedQuestions.push(poolQuestions[randomIndex])
      } else {
        // If pool missing or empty, fallback to General questions (skip Q1)
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
