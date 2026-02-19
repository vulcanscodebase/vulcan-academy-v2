import React, { useEffect, useRef, useState, useCallback } from 'react';

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
  const audioUnlockedRef = useRef<boolean>(false);

  // Create a persistent Audio element and unlock it on first user interaction
  // This is critical for mobile browsers which block audio.play() unless
  // it originates from a user gesture (tap/click)
  const unlockAudio = useCallback(() => {
    if (audioUnlockedRef.current) return;

    const audio = new Audio();
    // Play a tiny silent audio to "unlock" the Audio element on mobile
    audio.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABhgC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAYYoRBqSAAAAAAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABhgC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAYYoRBqSAAAAAAAAAAAAAAAAAAAA';
    audio.volume = 0.01;
    const playPromise = audio.play();
    if (playPromise) {
      playPromise
        .then(() => {
          audio.pause();
          audio.currentTime = 0;
          audioUnlockedRef.current = true;
          console.log('Audio unlocked for mobile playback');
        })
        .catch(() => {
          // Silent fail - will retry on next interaction
          console.warn('Audio unlock failed, will retry');
        });
    }
  }, []);

  // Unlock audio when interview starts (triggered by user tap on "Start Interview")
  useEffect(() => {
    if (isInterviewStarted) {
      unlockAudio();
    }
  }, [isInterviewStarted, unlockAudio]);

  // Also try to unlock on any user click/touch as a fallback
  useEffect(() => {
    const handleInteraction = () => {
      unlockAudio();
    };

    document.addEventListener('click', handleInteraction, { once: true });
    document.addEventListener('touchstart', handleInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, [unlockAudio]);

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

        // Mobile Safari requires these attributes
        audio.setAttribute('playsinline', '');
        audio.preload = 'auto';

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

        // Load the audio first, then play
        audio.load();

        // Use canplaythrough event for more reliable playback on mobile
        audio.oncanplaythrough = () => {
          audio.play().catch(e => {
            console.error("Audio autoplay failed:", e);
            // On mobile, if autoplay still fails, show the question anyway
            // and mark as spoken so the flow continues
            setHasSpoken(true);
            onSpeechEnd?.();
          });
        };

      } catch (error) {
        console.error('Error fetching/playing TTS:', error);
        setHasSpoken(true);
        onSpeechEnd?.();
      }
    };

    // Small delay to ensure the component is ready
    const timer = setTimeout(() => {
      fetchAndPlayAudio();
    }, 300);

    return () => {
      clearTimeout(timer);
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
