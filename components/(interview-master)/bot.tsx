import React, { useEffect, useRef, useState } from 'react';

interface BotInterviewerProps {
  question: string;
  isRecording: boolean;
  isInterviewStarted: boolean;
  onSpeechEnd?: () => void;
  currentQuestionNumber: number;
}

const BotInterviewer: React.FC<BotInterviewerProps> = ({
  question,
  isRecording,
  isInterviewStarted,
  onSpeechEnd,
  currentQuestionNumber,
}) => {
  const [hasSpoken, setHasSpoken] = useState(false);
  const lastQuestionRef = useRef<string>('');
  const lastQuestionNumberRef = useRef<number>(-1);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Cleanup function to stop audio when component unmounts
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }
  }, []);

  useEffect(() => {
    if (isInterviewStarted && videoRef.current) {
      const video = videoRef.current;
      video.load();
      // Attempt to play and pause to "prime" the video element for mobile browsers
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            video.pause();
          })
          .catch(error => {
            console.warn('Video priming failed:', error);
          });
      }
    }
  }, [isInterviewStarted]);

  useEffect(() => {
    if (question && (question !== lastQuestionRef.current || currentQuestionNumber !== lastQuestionNumberRef.current)) {
      setHasSpoken(false);
      lastQuestionRef.current = question;
      lastQuestionNumberRef.current = currentQuestionNumber;

      // Stop any currently playing audio when question changes
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    }
  }, [question, currentQuestionNumber]);

  useEffect(() => {
    if (!question || hasSpoken || isRecording || !isInterviewStarted) return;

    const fetchAndPlayAudio = async () => {
      try {
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: question }),
        });

        if (!response.ok) {
          throw new Error('TTS API request failed');
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.onplay = () => {
          setHasSpoken(false);
          if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(err => console.warn('Avatar video failed to play:', err));
          }
        };

        audio.onended = () => {
          videoRef.current?.pause();
          setHasSpoken(true);
          onSpeechEnd?.();
          URL.revokeObjectURL(audioUrl); // Cleanup
        };

        audio.onerror = (e) => {
          console.error('Audio playback error', e);
          videoRef.current?.pause();
          setHasSpoken(true);
          onSpeechEnd?.();
        };

        // Add a small delay to ensure UI is ready, similar to original code
        setTimeout(() => {
          audio.play().catch(e => {
            console.error("Audio autoplay failed:", e);
            // If autoplay fails, we should essentially skip to "end" state so the app doesn't hang
            setHasSpoken(true);
            onSpeechEnd?.();
          });
        }, 500);

      } catch (error) {
        console.error('Error fetching/playing TTS:', error);
        // Fallback or just mark as spoken so the flow continues
        setHasSpoken(true);
        onSpeechEnd?.();
      }
    };

    fetchAndPlayAudio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [question, hasSpoken, isRecording, onSpeechEnd, isInterviewStarted]);

  useEffect(() => {
    if (isRecording) {
      videoRef.current?.pause();
    }
  }, [isRecording]);

  return (
    <div className="relative flex flex-col items-center">
      <div className="w-64 h-80 rounded-xl overflow-hidden relative shadow-xl">
        <video
          ref={videoRef}
          className="w-[140%] h-[140%] object-cover transform scale-105"
          style={{ transformOrigin: 'center center' }}
          muted
          playsInline
          loop={false}
          src="https://resource2.heygen.ai/video/transcode/756ce28ce36c415b8ca3414998329b36/720x1280.mp4"
        />
      </div>
    </div>
  );
};

export default BotInterviewer;

