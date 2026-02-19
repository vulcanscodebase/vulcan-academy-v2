import { type NextRequest, NextResponse } from "next/server"; // Import necessary types from Next.js
import { z } from "zod"; // Import Zod for schema validation

// Define the schema for validating the audio file using Zod
const audioFileSchema = z.object({
  audio: z.instanceof(Blob).refine((blob) => blob.size > 0, {
    message: "No audio file provided or the file is empty", // Error message if the file is empty
  }),
});

// Main handler for POST request (this is where the server will handle the request)
export async function POST(req: NextRequest) {
  try {
    // Step 1: Retrieve the form data from the request (this is how we get the file sent from the frontend)
    const formData = await req.formData();
    const audioFile = formData.get("audio");

    // Step 2: Validate the audio file using the Zod schema
    const validationResult = audioFileSchema.safeParse({ audio: audioFile });

    if (!validationResult.success) {
      // If validation fails, return a 400 error with the validation message
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    // Step 3: Upload the audio file to AssemblyAI
    const uploadResponse = await fetch("https://api.assemblyai.com/v2/upload", {
      method: "POST",
      headers: {
        authorization: process.env.ASSEMBLYAI_API_KEY!,
      },
      body: audioFile,
    });

    // Check if the upload was successful
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text(); // Capture error message if upload fails
      console.error("AssemblyAI Upload Error:", errorText); // Log the error
      return NextResponse.json({ error: "Failed to upload audio to AssemblyAI" }, { status: 500 }); // Return server error
    }

    // Parse the response from the upload
    const uploadData = await uploadResponse.json();
    const audioUrl = uploadData.upload_url; // Extract the uploaded file's URL

    // Step 4: Start the transcription process by passing the uploaded audio URL
    const transcriptionResponse = await fetch("https://api.assemblyai.com/v2/transcript", {
      method: "POST", // Sending a POST request to start transcription
      headers: {
        authorization: process.env.ASSEMBLYAI_API_KEY!, // Use the AssemblyAI API key
        "Content-Type": "application/json", // Set the content type as JSON
      },
      body: JSON.stringify({
        audio_url: audioUrl, // Pass the URL of the uploaded audio file
        language_detection: true, // Optional: Enable language detection
        speech_models: ["universal-2"],
      }),
    });

    // Check if the transcription request was successful
    if (!transcriptionResponse.ok) {
      const errorText = await transcriptionResponse.text(); // Capture error message if transcription fails
      console.error("AssemblyAI Transcription Error:", errorText); // Log the error
      return NextResponse.json({ error: "Failed to start transcription process" }, { status: 500 }); // Return server error
    }

    // Parse the transcription response to get the transcription ID
    const transcriptionData = await transcriptionResponse.json();
    const transcriptId = transcriptionData.id; // Extract the ID of the transcription job

    // Return the transcript ID to the client (this can be used for later fetching the result)
    return NextResponse.json({ transcriptId });

  } catch (error) {
    // Catch any unexpected errors during the transcription process
    console.error("Error during transcription:", error);
    return NextResponse.json({ error: "An error occurred during transcription." }, { status: 500 }); // Return server error
  }
}
