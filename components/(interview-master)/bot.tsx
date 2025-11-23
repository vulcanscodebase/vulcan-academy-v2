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
  const synth = useRef<SpeechSynthesis | null>(null);
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synth.current = window.speechSynthesis;
    }
  }, []);

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
    if (!question || hasSpoken || isRecording || !synth.current || !isInterviewStarted) return;

    synth.current.cancel();

    utterance.current = new SpeechSynthesisUtterance(question);
    utterance.current.rate = 0.9;
    utterance.current.pitch = 1.0;
    utterance.current.volume = 1.0;

    const voices = synth.current.getVoices();
    const preferredVoice = voices.find(
      voice =>
        voice.name.includes('Sarah') ||
        voice.name.includes('Google UK English Female') ||
        voice.name.includes('Microsoft Sarah')
    );
    if (preferredVoice) {
      utterance.current.voice = preferredVoice;
    }

    utterance.current.onstart = () => {
      setHasSpoken(false);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(err => console.warn('Avatar video failed to play:', err));
      }
    };

    utterance.current.onend = () => {
      videoRef.current?.pause();
      setHasSpoken(true);
      onSpeechEnd?.();
    };

    utterance.current.onerror = () => {
      videoRef.current?.pause();
      setHasSpoken(true);
      onSpeechEnd?.();
    };

    const timer = setTimeout(() => {
      synth.current!.speak(utterance.current!);
    }, 800);

    return () => {
      clearTimeout(timer);
      synth.current!.cancel();
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

