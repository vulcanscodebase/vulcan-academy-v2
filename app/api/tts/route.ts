import type { NextApiRequest, NextApiResponse } from 'next';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing text' });
  }

  try {
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.AZURE_SPEECH_KEY!,
      process.env.AZURE_SPEECH_REGION!
    );

    speechConfig.speechSynthesisVoiceName = 'en-IN-Aarti:DragonHDLatestNeural';

    speechConfig.speechSynthesisOutputFormat =
      sdk.SpeechSynthesisOutputFormat.Audio16Khz128KBitRateMonoMp3;

    const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

    synthesizer.speakTextAsync(
      text,
      result => {
        synthesizer.close();

        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          res.setHeader('Content-Type', 'audio/mpeg');
          res.setHeader('Cache-Control', 'no-store');
          res.status(200).send(Buffer.from(result.audioData));
        } else {
          res.status(500).json({ error: 'Speech synthesis failed' });
        }
      },
      error => {
        synthesizer.close();
        console.error('Azure TTS Error:', error);
        res.status(500).json({ error: 'Azure TTS error' });
      }
    );
  } catch (err) {
    console.error('TTS API Fatal Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
