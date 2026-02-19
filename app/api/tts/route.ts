import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Invalid or missing text' }, { status: 400 });
    }

    const speechKey = process.env.AZURE_SPEECH_KEY;
    const speechRegion = process.env.AZURE_SPEECH_REGION;

    if (!speechKey || !speechRegion) {
      console.error('Missing AZURE_SPEECH_KEY or AZURE_SPEECH_REGION');
      return NextResponse.json({ error: 'TTS not configured' }, { status: 500 });
    }

    // Use Azure REST API directly (no native SDK dependencies)
    const endpoint = `https://${speechRegion}.tts.speech.microsoft.com/cognitiveservices/v1`;

    const ssml = `
      <speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-IN'>
        <voice name='en-IN-AartiNeural'>
          ${text}
        </voice>
      </speak>
    `;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': speechKey,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
        'User-Agent': 'VulcanAcademy',
      },
      body: ssml,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Azure TTS API Error:', response.status, errorText);
      return NextResponse.json(
        { error: `Azure TTS failed: ${response.status}` },
        { status: 500 }
      );
    }

    const audioBuffer = await response.arrayBuffer();

    return new Response(audioBuffer, {
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
