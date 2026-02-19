import { NextRequest, NextResponse } from 'next/server';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Invalid or missing text' }, { status: 400 });
    }

    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.AZURE_SPEECH_KEY!,
      process.env.AZURE_SPEECH_REGION!
    );

    // Using the specific neural voice requested
    speechConfig.speechSynthesisVoiceName = 'en-IN-Aarti:DragonHDLatestNeural';

    // Set output format to MP3
    speechConfig.speechSynthesisOutputFormat =
      sdk.SpeechSynthesisOutputFormat.Audio16Khz128KBitRateMonoMp3;

    const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

    // Wrap the callback-based SDK in a Promise to use with async/await
    const audioData = await new Promise<ArrayBuffer>((resolve, reject) => {
      synthesizer.speakTextAsync(
        text,
        result => {
          synthesizer.close();
          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            resolve(result.audioData);
          } else {
            reject(new Error(`Speech synthesis failed: ${result.errorDetails}`));
          }
        },
        error => {
          synthesizer.close();
          reject(error);
        }
      );
    });

    // Return the audio as binary data with correct content type
    return new Response(audioData, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });

  } catch (error: any) {
    console.error('TTS API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Error generating speech' },
      { status: 500 }
    );
  }
}
