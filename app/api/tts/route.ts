import { NextRequest, NextResponse } from 'next/server';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Invalid or missing text' }, { status: 400 });
    }

    // Debug: Check if Azure credentials are available
    if (!process.env.AZURE_SPEECH_KEY || !process.env.AZURE_SPEECH_REGION) {
      console.error('Missing Azure Speech credentials:', {
        hasKey: !!process.env.AZURE_SPEECH_KEY,
        hasRegion: !!process.env.AZURE_SPEECH_REGION,
        keyLength: process.env.AZURE_SPEECH_KEY?.length,
        region: process.env.AZURE_SPEECH_REGION
      });
      return NextResponse.json({ error: 'Azure Speech credentials not configured' }, { status: 500 });
    }

    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.AZURE_SPEECH_KEY!,
      process.env.AZURE_SPEECH_REGION!
    );

    speechConfig.speechSynthesisVoiceName = 'en-IN-Aarti:DragonHDLatestNeural';

    speechConfig.speechSynthesisOutputFormat =
      sdk.SpeechSynthesisOutputFormat.Audio16Khz128KBitRateMonoMp3;

    const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

    return new Promise((resolve) => {
      synthesizer.speakTextAsync(
        text,
        result => {
          synthesizer.close();

          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            const response = new NextResponse(Buffer.from(result.audioData), {
              status: 200,
              headers: {
                'Content-Type': 'audio/mpeg',
                'Cache-Control': 'no-store',
              },
            });
            resolve(response);
          } else {
            resolve(NextResponse.json({ error: 'Speech synthesis failed' }, { status: 500 }));
          }
        },
        error => {
          synthesizer.close();
          console.error('Azure TTS Error:', error);
          resolve(NextResponse.json({ error: 'Azure TTS error' }, { status: 500 }));
        }
      );
    });
  } catch (err) {
    console.error('TTS API Fatal Error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
