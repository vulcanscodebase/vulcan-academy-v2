import { type NextRequest, NextResponse } from "next/server"
import pdfParse from "pdf-parse"
import { extractText, getDocumentProxy } from "unpdf"
import { exec } from "child_process"
import { promisify } from "util"
import fs from "fs"
import path from "path"
import os from "os"

const execAsync = promisify(exec)

// Clean and normalize extracted text
function cleanExtractedText(text: string): string {
  return text
    // Remove excessive whitespace but keep some structure
    .replace(/[ \t]+/g, ' ')
    // Remove special characters that might cause issues
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Normalize multiple newlines
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

// Check if extracted text is meaningful
function isTextMeaningful(text: string): boolean {
  const cleanedText = text.replace(/\s+/g, ' ').trim()
  // At least 50 characters
  return cleanedText.length >= 50
}

// Extract text using unpdf library (handles complex PDFs better)
async function extractWithUnpdf(buffer: Buffer): Promise<{ text: string; pages: number }> {
  try {
    const uint8Array = new Uint8Array(buffer)
    const pdf = await getDocumentProxy(uint8Array)
    const result = await extractText(pdf, { mergePages: true })

    // Handle both string and array results
    const textContent = typeof result.text === 'string'
      ? result.text
      : Array.isArray(result.text)
        ? result.text.join('\n')
        : String(result.text || '')

    return {
      text: textContent,
      pages: pdf.numPages
    }
  } catch (error) {
    console.error("unpdf extraction error:", error)
    throw error
  }
}

// Extract text from PDF using OCR (for image-based PDFs)
async function extractWithOCR(buffer: Buffer): Promise<string> {
  const tempDir = os.tmpdir()
  const tempId = `pdf_ocr_${Date.now()}_${Math.random().toString(36).substring(7)}`
  const tempPdfPath = path.join(tempDir, `${tempId}.pdf`)
  const tempImageBase = path.join(tempDir, tempId)

  try {
    // Write PDF to temp file
    fs.writeFileSync(tempPdfPath, buffer)

    // Convert PDF to images using pdftoppm (from poppler-utils)
    // -png outputs PNG format, -r 150 sets resolution to 150 DPI
    await execAsync(`pdftoppm -png -r 150 "${tempPdfPath}" "${tempImageBase}"`)

    // Find all generated image files
    const files = fs.readdirSync(tempDir).filter(f => f.startsWith(tempId) && f.endsWith('.png'))

    if (files.length === 0) {
      throw new Error("No images generated from PDF")
    }

    console.log(`OCR: Found ${files.length} page images`)

    // Run Tesseract OCR on each image and collect text
    const textParts: string[] = []

    for (const file of files.sort()) {
      const imagePath = path.join(tempDir, file)
      try {
        const { stdout } = await execAsync(`tesseract "${imagePath}" stdout -l eng --psm 6`)
        if (stdout.trim()) {
          textParts.push(stdout.trim())
        }
        // Clean up image file
        fs.unlinkSync(imagePath)
      } catch (ocrError) {
        console.error(`OCR error on ${file}:`, ocrError)
        // Clean up image file even on error
        try { fs.unlinkSync(imagePath) } catch (e) { /* ignore */ }
      }
    }

    // Clean up temp PDF
    fs.unlinkSync(tempPdfPath)

    return textParts.join('\n\n')
  } catch (error) {
    // Clean up on error
    try { fs.unlinkSync(tempPdfPath) } catch (e) { /* ignore */ }

    // Clean up any leftover images
    const files = fs.readdirSync(tempDir).filter(f => f.startsWith(tempId))
    for (const file of files) {
      try { fs.unlinkSync(path.join(tempDir, file)) } catch (e) { /* ignore */ }
    }

    throw error
  }
}

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

    // Convert file to buffer
    const arrayBuffer = await fileBlob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    let extractedText = ""
    let pageCount = 0
    let extractionMethod = ""

    // Method 1: Try unpdf (better for complex layouts)
    try {
      console.log("Attempting text extraction with unpdf...")
      const unpdfResult = await extractWithUnpdf(buffer)
      extractedText = cleanExtractedText(unpdfResult.text)
      pageCount = unpdfResult.pages
      extractionMethod = "unpdf"
      console.log(`unpdf extracted ${extractedText.length} characters from ${pageCount} pages`)
    } catch (unpdfError) {
      console.error("unpdf extraction failed:", unpdfError)
    }

    // Method 2: If unpdf fails or gives minimal text, try pdf-parse
    if (!isTextMeaningful(extractedText)) {
      try {
        console.log("Trying pdf-parse extraction...")
        const parsed = await pdfParse(buffer)
        const parsedText = cleanExtractedText(parsed.text)

        if (parsedText.length > extractedText.length) {
          extractedText = parsedText
          pageCount = parsed.numpages
          extractionMethod = "pdf-parse"
        }

        console.log(`pdf-parse extracted ${parsedText.length} characters from ${parsed.numpages} pages`)
      } catch (parseError) {
        console.error("pdf-parse extraction failed:", parseError)
      }
    }

    // Method 3: If still no text, try OCR (for image-based PDFs)
    if (!isTextMeaningful(extractedText)) {
      try {
        console.log("Text extraction minimal, attempting OCR...")
        const ocrText = await extractWithOCR(buffer)
        const cleanedOcrText = cleanExtractedText(ocrText)
        console.log(`OCR extracted ${cleanedOcrText.length} characters`)

        if (cleanedOcrText.length > extractedText.length) {
          extractedText = cleanedOcrText
          extractionMethod = "ocr"
        }
      } catch (ocrError) {
        console.error("OCR extraction failed:", ocrError)
      }
    }

    // Check if we got meaningful text
    if (!extractedText || !isTextMeaningful(extractedText)) {
      return NextResponse.json(
        {
          error: "Could not extract text from this PDF. The file may be corrupted or protected. Please try re-exporting your resume as a PDF from Word or Google Docs.",
        },
        { status: 400 },
      )
    }

    console.log(`Final extraction using ${extractionMethod}: ${extractedText.length} characters from ${pageCount} pages`)

    return NextResponse.json({
      text: extractedText,
      pages: pageCount,
      method: extractionMethod,
      charactersExtracted: extractedText.length,
    })
  } catch (error) {
    console.error("Error during PDF processing:", error)

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
      { error: "Failed to process PDF. Please try uploading a different version of your resume." },
      { status: 500 },
    )
  }
}
