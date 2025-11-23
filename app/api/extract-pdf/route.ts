import { type NextRequest, NextResponse } from "next/server"
import pdfParse from "pdf-parse"

// POST handler
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file")

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file uploaded or invalid file format." }, { status: 400 })
    }

    const fileBlob = file as File

    // Validate file type
    if (fileBlob.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed." }, { status: 400 })
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (fileBlob.size > maxSize) {
      return NextResponse.json({ error: "File size exceeds 5MB limit." }, { status: 400 })
    }

    // Convert file to buffer directly without filesystem operations
    const arrayBuffer = await fileBlob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Parse PDF directly from buffer
    const parsed = await pdfParse(buffer)

    if (!parsed.text || parsed.text.trim().length === 0) {
      return NextResponse.json(
        { error: "Could not extract text from PDF. Please ensure the PDF contains readable text." },
        { status: 400 },
      )
    }

    return NextResponse.json({
      text: parsed.text.trim(),
      pages: parsed.numpages,
      info: parsed.info,
    })
  } catch (error) {
    console.error("Error during PDF processing:", error)

    // More specific error handling
    if (error instanceof Error) {
      if (error.message.includes("Invalid PDF")) {
        return NextResponse.json({ error: "Invalid PDF file. Please upload a valid PDF document." }, { status: 400 })
      }
      if (error.message.includes("encrypted")) {
        return NextResponse.json(
          { error: "Encrypted PDFs are not supported. Please upload an unencrypted PDF." },
          { status: 400 },
        )
      }
    }

    return NextResponse.json(
      { error: "Failed to process PDF. Please try again with a different file." },
      { status: 500 },
    )
  }
}
