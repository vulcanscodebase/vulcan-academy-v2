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
  const isFetchingAudio = useRef<boolean>(false);

  const fetchAzureTTS = async (text: string): Promise<string | null> => {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('TTS request failed');
      }

      const audioBlob = await response.blob();
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.error('Azure TTS Error:', error);
      return null;
    }
  };

  useEffect(() => {
    if (isInterviewStarted && videoRef.current) {
      const video = videoRef.current;
      video.load();
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
    }
  }, [question, currentQuestionNumber]);

  useEffect(() => {
    if (!question || hasSpoken || isRecording || !isInterviewStarted || isFetchingAudio.current) return;

    const speakQuestion = async () => {
      isFetchingAudio.current = true;
      
      try {
        const audioUrl = await fetchAzureTTS(question);
        
        if (audioUrl && audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.load();
          
          // Play audio immediately on all devices
          const playAudioImmediately = () => {
            audioRef.current!.play().then(() => {
              console.log('Aarti voice playing successfully');
              setHasSpoken(false);
              if (videoRef.current) {
                videoRef.current.currentTime = 0;
                videoRef.current.play().catch(err => console.warn('Avatar video failed to play:', err));
              }
            }).catch((error) => {
              console.error('Audio playback failed:', error);
              // Continue interview flow even if audio fails
              setHasSpoken(true);
              onSpeechEnd?.();
              URL.revokeObjectURL(audioUrl);
              isFetchingAudio.current = false;
            });
          };

          audioRef.current.onplay = () => {
            setHasSpoken(false);
            if (videoRef.current) {
              videoRef.current.currentTime = 0;
              videoRef.current.play().catch(err => console.warn('Avatar video failed to play:', err));
            }
          };

          audioRef.current.onended = () => {
            videoRef.current?.pause();
            setHasSpoken(true);
            onSpeechEnd?.();
            URL.revokeObjectURL(audioUrl);
            isFetchingAudio.current = false;
          };

          audioRef.current.onerror = (error) => {
            console.error('Audio playback error:', error);
            videoRef.current?.pause();
            setHasSpoken(true);
            onSpeechEnd?.();
            URL.revokeObjectURL(audioUrl);
            isFetchingAudio.current = false;
          };

          // Mobile and desktop compatibility
          (audioRef.current as any).playsInline = true;
          audioRef.current.muted = false;
          audioRef.current.volume = 1.0;
          
          // Try to play immediately on all devices
          const timer = setTimeout(() => {
            playAudioImmediately();
          }, 800);

          return () => clearTimeout(timer);
        } else {
          setHasSpoken(true);
          onSpeechEnd?.();
          isFetchingAudio.current = false;
        }
      } catch (error) {
        console.error('Speech synthesis failed:', error);
        setHasSpoken(true);
        onSpeechEnd?.();
        isFetchingAudio.current = false;
      }
    };

    speakQuestion();
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
      <audio
        ref={audioRef}
        preload="none"
        playsInline
        crossOrigin="anonymous"
      />
    </div>
  );
};

export default BotInterviewer;

