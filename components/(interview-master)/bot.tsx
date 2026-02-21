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
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const isPlayingRef = useRef<boolean>(false);

  // Initialize and unlock AudioContext on user interaction
  const getAudioContext = useCallback((): AudioContext => {
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioCtx();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  // Unlock AudioContext on user interaction (click/touch)
  useEffect(() => {
    const handleInteraction = () => {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume().then(() => {
          console.log('AudioContext resumed on user interaction');
        });
      }
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, [getAudioContext]);

  // When interview starts, ensure AudioContext is ready
  useEffect(() => {
    if (isInterviewStarted) {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
    }
  }, [isInterviewStarted, getAudioContext]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sourceNodeRef.current) {
        try { sourceNodeRef.current.stop(); } catch { }
        sourceNodeRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  // Prime video for mobile
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

  // Reset when question changes
  useEffect(() => {
    if (question && (question !== lastQuestionRef.current || currentQuestionNumber !== lastQuestionNumberRef.current)) {
      setHasSpoken(false);
      lastQuestionRef.current = question;
      lastQuestionNumberRef.current = currentQuestionNumber;

      // Stop any currently playing audio
      if (sourceNodeRef.current && isPlayingRef.current) {
        try { sourceNodeRef.current.stop(); } catch { }
        sourceNodeRef.current = null;
        isPlayingRef.current = false;
      }
    }
  }, [question, currentQuestionNumber]);

  // Fetch and play TTS audio using AudioContext (works on mobile)
  useEffect(() => {
    if (!question || hasSpoken || isRecording || !isInterviewStarted) return;

    let cancelled = false;

    const fetchAndPlayAudio = async () => {
      try {
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: question }),
        });

        if (!response.ok) throw new Error('TTS API request failed');
        if (cancelled) return;

        const arrayBuffer = await response.arrayBuffer();
        if (cancelled) return;

        const ctx = getAudioContext();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
        if (cancelled) return;

        // Stop any previous audio
        if (sourceNodeRef.current && isPlayingRef.current) {
          try { sourceNodeRef.current.stop(); } catch { }
        }

        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        sourceNodeRef.current = source;

        isPlayingRef.current = true;
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(err => console.warn('Avatar video failed to play:', err));
        }

        source.onended = () => {
          if (cancelled) return;
          isPlayingRef.current = false;
          videoRef.current?.pause();
          setHasSpoken(true);
          onSpeechEnd?.();
        };

        source.start(0);
      } catch (error) {
        console.error('Error fetching/playing TTS:', error);
        if (!cancelled) {
          setHasSpoken(true);
          onSpeechEnd?.();
        }
      }
    };

    const timer = setTimeout(() => { fetchAndPlayAudio(); }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (sourceNodeRef.current && isPlayingRef.current) {
        try { sourceNodeRef.current.stop(); } catch { }
        sourceNodeRef.current = null;
        isPlayingRef.current = false;
      }
    };
  }, [question, hasSpoken, isRecording, onSpeechEnd, isInterviewStarted, getAudioContext]);

  // FIX: When user starts recording (interrupts the avatar speaking),
  // stop audio AND mark as already spoken so it does NOT replay
  useEffect(() => {
    if (isRecording) {
      videoRef.current?.pause();
      if (sourceNodeRef.current && isPlayingRef.current) {
        try { sourceNodeRef.current.stop(); } catch { }
        sourceNodeRef.current = null;
        isPlayingRef.current = false;
      }
      // Mark question as already spoken so it won't repeat after recording stops
      setHasSpoken(true);
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
