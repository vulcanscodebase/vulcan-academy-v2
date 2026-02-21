import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Define the schema for validating the audio file using Zod
const audioFileSchema = z.object({
  audio: z.instanceof(Blob).refine((blob) => blob.size > 0, {
    message: "No audio file provided or the file is empty",
  }),
});

// Main handler for POST request
export async function POST(req: NextRequest) {
  try {
    // Step 1: Retrieve the form data from the request
    const formData = await req.formData();
    const audioFile = formData.get("audio");

    // Step 2: Validate the audio file using the Zod schema
    const validationResult = audioFileSchema.safeParse({ audio: audioFile });

    if (!validationResult.success) {
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
      const errorText = await uploadResponse.text();
      console.error("AssemblyAI Upload Error:", errorText);
      return NextResponse.json({ error: "Failed to upload audio to AssemblyAI" }, { status: 500 });
    }

    // Parse the response from the upload
    const uploadData = await uploadResponse.json();
    const audioUrl = uploadData.upload_url;

    // Step 4: Start the transcription process
    const transcriptionResponse = await fetch("https://api.assemblyai.com/v2/transcript", {
      method: "POST",
      headers: {
        authorization: process.env.ASSEMBLYAI_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        audio_url: audioUrl,
        language_detection: true,
        speech_models: ["universal-2"],
      }),
    });

    // Check if the transcription request was successful
    if (!transcriptionResponse.ok) {
      const errorText = await transcriptionResponse.text();
      console.error("AssemblyAI Transcription Error:", errorText);
      return NextResponse.json({ error: "Failed to start transcription process" }, { status: 500 });
    }

    // Parse the transcription response to get the transcription ID
    const transcriptionData = await transcriptionResponse.json();
    const transcriptId = transcriptionData.id;

    // Return the transcript ID to the client
    return NextResponse.json({ transcriptId });

  } catch (error) {
    console.error("Error during transcription:", error);
    return NextResponse.json({ error: "An error occurred during transcription." }, { status: 500 });
  }
}
