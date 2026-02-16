import path from "path"
import fs from "fs/promises"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const titleQuery = searchParams.get("title")
  const modeQuery = searchParams.get("mode") || "Basic"

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

    // case-insensitive role/key lookup
    const jobEntry = Object.entries(questionsMap).find(
      ([key]) => key.toLowerCase() === titleQuery.toLowerCase()
    )
    const roleName = jobEntry?.[0] || "General"
    const roleData = jobEntry?.[1] || questionsMap["General"]

    // Normalize mode (Basic / Advanced)
    const normalizedMode =
      modeQuery.charAt(0).toUpperCase() + modeQuery.slice(1).toLowerCase()

    // Special handling for TEACHER role
    const isTeacher = roleName.toLowerCase() === "teacher"
    if (isTeacher) {
      const modeQuestions = roleData[normalizedMode] || roleData["Basic"]

      const teacherQ1 = "Tell me about yourself"
      const teacherQ2 = modeQuestions?.Pool1?.length
        ? modeQuestions.Pool1[Math.floor(Math.random() * modeQuestions.Pool1.length)]
        : "Explain your educational background."

      const teacherQ3 = "Explain a topic of your choice in 2 minutes"

      const teacherQ4 = modeQuestions?.Pool2?.length
        ? modeQuestions.Pool2[Math.floor(Math.random() * modeQuestions.Pool2.length)]
        : "Describe how you teach complex subjects."

      return new Response(
        JSON.stringify({
          questions: [teacherQ1, teacherQ2, teacherQ3, teacherQ4],
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // Special handling for CABIN CREW role
    const isCabinCrew = roleName.toLowerCase() === "cabin crew"
    if (isCabinCrew) {
      const modeQuestions = roleData[normalizedMode] || roleData["Basic"]

      const cabinPools = ["Pool1", "Pool2", "Pool3", "Pool4"]
      const selectedCabinQuestions: string[] = ["Tell me about yourself"]

      cabinPools.forEach((pool) => {
        const poolQuestions = modeQuestions?.[pool]

        if (poolQuestions && poolQuestions.length > 0) {
          const randomIndex = Math.floor(Math.random() * poolQuestions.length)
          selectedCabinQuestions.push(poolQuestions[randomIndex])
        } else {
          selectedCabinQuestions.push("No question available")
        }
      })

      return new Response(
        JSON.stringify({
          questions: selectedCabinQuestions,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      )
    }


    const modeQuestions = roleData[normalizedMode]
    const generalRole = questionsMap["General"]

    // If mode missing → fallback to General
    const activeModeData =
      modeQuestions ||
      generalRole["Basic"] ||
      {}

    // Q1 — always this
    const selectedQuestions: string[] = ["Tell me about yourself"]

    // pools to pull from
    const pools = ["Pool1", "Pool2", "Pool3"]

    pools.forEach((pool, index) => {
      const poolQuestions = activeModeData[pool]

      if (poolQuestions && poolQuestions.length > 0) {
        const randomIndex = Math.floor(Math.random() * poolQuestions.length)
        selectedQuestions.push(poolQuestions[randomIndex])
      } else {
        // Fallback to General → same pool index (0,1,2)
        const fallbackPool = generalRole["Basic"][pool]

        if (fallbackPool && fallbackPool.length > 0) {
          const randomIndex = Math.floor(Math.random() * fallbackPool.length)
          selectedQuestions.push(fallbackPool[randomIndex])
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
