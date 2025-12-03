"use client";

import {
  HelpCircle,
  Play,
  StopCircle,
  Sparkles,
  CheckCircle,
  Clock,
  User,
  Mic,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import BotInterviewer from "@/components/(interview-master)/bot";
import { Navbar } from "@/components/(layout-wrapper)/navbar";

export default function InterviewAI() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [earlyFollowUpInsertIndex, setEarlyFollowUpInsertIndex] = useState(2);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamCleanupRef = useRef<MediaStream | null>(null);
  const [recordingDone, setRecordingDone] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);

  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showRecordingStoppedPopup, setShowRecordingStoppedPopup] =
    useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const videoChunksRef = useRef<Blob[]>([]);

  const [interviewStarted, setInterviewStarted] = useState(false);
  const [currentQuestionRecording, setCurrentQuestionRecording] =
    useState(false);

  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(
    null
  );
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [isProcessingAnswer, setIsProcessingAnswer] = useState(false);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [interviewId, setInterviewId] = useState<string | null>(null);

  const addDebugLog = (message: string) => {
    console.log(message);
    setDebugInfo((prev) => [
      ...prev,
      `${new Date().toISOString().split("T")[1].split(".")[0]}: ${message}`,
    ]);
  };

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return;
    }
    
    setIsLoaded(true);
    const storedTitle = localStorage.getItem("jobTitle");
    const storedMode = localStorage.getItem("interviewMode") ?? "";

    if (storedTitle) {
      const rawFollowUps = localStorage.getItem("followUpQuestions");
      const rawTechnicals = localStorage.getItem("technicalQuestions");
      const singleFollowUp = localStorage.getItem("followUpQuestion");

      const parseArray = (raw: string | null): string[] => {
        if (!raw) return [];
        try {
          const arr = JSON.parse(raw);
          if (!Array.isArray(arr)) return [];
          return arr.filter(
            (q: unknown) =>
              typeof q === "string" &&
              q.trim() !== "" &&
              q !== "undefined" &&
              q !== "null"
          );
        } catch {
          return [];
        }
      };

      const followUps = parseArray(rawFollowUps);
      const technicals = parseArray(rawTechnicals);
      const sanitizedSingleFollowUp =
        singleFollowUp &&
        singleFollowUp !== "undefined" &&
        singleFollowUp !== "null" &&
        singleFollowUp.trim() !== ""
          ? singleFollowUp
          : null;

      fetch(`/api/questions?title=${encodeURIComponent(storedTitle)}&mode=${encodeURIComponent(storedMode)}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch questions");
          return res.json();
        })
        .then((data) => {
          const modifiedQuestions = [...data.questions];

          if (followUps.length > 0) {
            modifiedQuestions.splice(1, 0, ...followUps);
          } else if (sanitizedSingleFollowUp) {
            modifiedQuestions.splice(1, 0, sanitizedSingleFollowUp);
          }

          if (technicals.length > 0) {
            modifiedQuestions.push(...technicals);
            modifiedQuestions.splice(-technicals.length, technicals.length);
          }

          setQuestions(modifiedQuestions);
        })
        .catch((error) => {
          console.error("Error fetching questions:", error);
        });
    }
  }, [router]);

  const handleStartInterview = async () => {
    try {
      addDebugLog("Starting interview stream...");
      addDebugLog("Starting interview...");

      if (!interviewId) {
        addDebugLog("Calling backend API to start interview session...");
        const newInterviewId = await callStartInterviewAPI();
        if (!newInterviewId) {
          return;
        }
      }

      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }

      let stream: MediaStream | null = null;

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user",
          },
          audio: true,
        });
      } catch {
        console.warn("Video permission denied or failed. Trying audio only...");

        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (audioErr) {
          console.error("Audio permission denied:", audioErr);
          alert("Microphone access is required to proceed with the interview.");
          return;
        }
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        await new Promise((resolve) => {
          videoRef.current!.onloadedmetadata = () => {
            videoRef
              .current!.play()
              .then(() => {
                addDebugLog("Video playback started successfully");
                resolve(true);
              })
              .catch((err) => {
                console.error("Video playback error:", err);
                addDebugLog(`Video playback error: ${err}`);
                resolve(false);
              });
          };
        });
      } else {
        throw new Error("Video element not found");
      }

      setMediaStream(stream);
      mediaStreamCleanupRef.current = stream;
      setInterviewStarted(true);

      setRecordingStartTime(Date.now());
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);

      addDebugLog("Interview stream started successfully");
    } catch (err) {
      console.error("Media stream error:", err);
      addDebugLog(`Error starting video stream: ${err}`);
      alert(
        "Error accessing camera/microphone. Please ensure you have granted the necessary permissions."
      );
    }
  };

  const handleStartQuestionRecording = async () => {
    if (!interviewStarted) {
      await handleStartInterview();
    }

    try {
      if (mediaStream) {
        const audioTracks = mediaStream.getAudioTracks();
        if (audioTracks.length > 0) {
          const audioStream = new MediaStream([audioTracks[0]]);
          const audioRecorder = new MediaRecorder(audioStream);
          mediaRecorderRef.current = audioRecorder;
          audioChunksRef.current = [];

          audioRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
              audioChunksRef.current.push(e.data);
            }
          };

          audioRecorder.start();
          addDebugLog(
            `Question audio recording started for question ${
              currentQuestion + 1
            }`
          );
        }
      }

      setIsRecording(true);
      setCurrentQuestionRecording(true);
    } catch (err) {
      console.error("Audio recording error:", err);
      addDebugLog(`Error starting question recording: ${err}`);
      alert("Error starting audio recording for this question.");
    }
  };

  const handleStopQuestionRecording = async () => {
    const audioRecorder = mediaRecorderRef.current;

    if (!audioRecorder || audioRecorder.state === "inactive") {
      addDebugLog("Audio recorder not active");
    } else {
      audioRecorder.onstop = async () => {
        addDebugLog(
          `Audio recording stopped for question ${currentQuestion + 1}`
        );
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const audioURL = URL.createObjectURL(audioBlob);

        const formData = new FormData();
        formData.append("audio", audioBlob);

        setIsProcessingAnswer(true);
        processingTimeoutRef.current = setTimeout(() => {
          addDebugLog("Processing timeout reached - allowing user to continue");
          setIsProcessingAnswer(false);

          if (currentQuestion < questions.length - 1) {
            setTimeout(() => {
              setCurrentQuestion((prev) => prev + 1);
              setRecordingDone(false);
              setShowRecordingStoppedPopup(false);
            }, 1500);
          }
        }, 60000);

        try {
          const res = await fetch("/api/transcribe", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(
              `Failed to send audio for transcription: ${
                errorData.error || res.statusText
              }`
            );
          }

          const data = await res.json();
          addDebugLog(`Transcript ID: ${data.transcriptId}`);

          if (!data.transcriptId) {
            throw new Error("No transcript ID received from server");
          }

          let transcriptData = null;
          let attempts = 0;
          const maxAttempts = 30;

          while (attempts < maxAttempts) {
            addDebugLog(`Polling attempt ${attempts + 1}/${maxAttempts}`);

            const transcriptRes = await fetch(
              `/api/transcript/${data.transcriptId}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  question: questions[currentQuestion],
                }),
              }
            );
            if (!transcriptRes.ok) {
              const errorData = await transcriptRes.json();
              throw new Error(
                `Failed to fetch transcript: ${
                  errorData.error || transcriptRes.statusText
                }`
              );
            }

            transcriptData = await transcriptRes.json();

            if (transcriptData.status === "completed") {
              if (currentQuestion < 5) {
                try {
                  const followUpRes = await fetch(
                    `/api/followup/${data.transcriptId}`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        question: questions[currentQuestion],
                      }),
                    }
                  );

                  if (!followUpRes.ok) {
                    const errorData = await followUpRes.json();
                    throw new Error(
                      `Failed to get follow-up: ${
                        errorData.error || followUpRes.statusText
                      }`
                    );
                  }

                  const followUpData = await followUpRes.json();
                  const followUpQuestion = followUpData.followUpQuestion;

                  if (followUpQuestion) {
                    const updatedQuestions = [...questions];
                  
                    if (currentQuestion < 2) {
                      // Insert follow-ups of Q1/Q2 in order at indexes 2 → 3
                      updatedQuestions.splice(earlyFollowUpInsertIndex, 0, followUpQuestion);
                      // Move pointer forward so next follow-up goes right after it
                      setEarlyFollowUpInsertIndex((prev) => prev + 1);
                      addDebugLog(
                        `Follow-up inserted at index ${earlyFollowUpInsertIndex}: "${followUpQuestion}"`
                      );
                    } else {
                      // All other follow-ups appended at end
                      updatedQuestions.push(followUpQuestion);
                      addDebugLog(`Follow-up appended to end: "${followUpQuestion}"`);
                    }
                  
                    setQuestions(updatedQuestions);
                  }
                } catch (followUpError) {
                  console.error(
                    "Error getting follow-up question:",
                    followUpError
                  );
                  addDebugLog("Follow-up generation failed.");
                }
              }

              addDebugLog("Received transcript data successfully");

              const metricsToStore = {
                confidence: transcriptData.confidence,
                bodyLanguage: transcriptData.bodyLanguage,
                knowledge: transcriptData.knowledge,
                skillRelevance: transcriptData.skillRelevance,
                fluency: transcriptData.fluency,
                feedback: transcriptData.feedback,
              };

              const existingTranscripts = localStorage.getItem(
                "interview_transcripts"
              )
                ? JSON.parse(
                    localStorage.getItem("interview_transcripts") || "[]"
                  )
                : [];

              existingTranscripts.push({
                question: questions[currentQuestion],
                questionNumber: currentQuestion + 1,
                transcript: transcriptData.transcript,
                metrics: metricsToStore,
                audioURL: audioURL,
              });

              localStorage.setItem(
                "interview_transcripts",
                JSON.stringify(existingTranscripts)
              );

              localStorage.setItem(
                "interview_transcript",
                transcriptData.transcript
              );
              localStorage.setItem(
                "interview_metrics",
                JSON.stringify(metricsToStore)
              );

              addDebugLog(
                `Transcription completed for question ${currentQuestion + 1}`
              );

              if (currentQuestion < questions.length - 1) {
                setTimeout(() => {
                  setCurrentQuestion((prev) => prev + 1);
                  setRecordingDone(false);
                  setShowRecordingStoppedPopup(false);
                }, 1500);
              }
              break;
            } else if (transcriptData.status === "error") {
              throw new Error(
                `Transcription failed: ${
                  transcriptData.error || "Unknown error"
                }`
              );
            } else if (
              transcriptData.status === "processing" ||
              transcriptData.status === "queued"
            ) {
              addDebugLog(
                `Transcription status: ${transcriptData.status} (${
                  attempts + 1
                }/${maxAttempts})`
              );
            } else {
              addDebugLog(`Unexpected status: ${transcriptData.status}`);
            }

            attempts++;
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }

          if (attempts >= maxAttempts) {
            throw new Error("Transcription timed out after 1 minute");
          }

          if (processingTimeoutRef.current) {
            clearTimeout(processingTimeoutRef.current);
          }
          setIsProcessingAnswer(false);
          addDebugLog("All APIs completed successfully");
        } catch (err) {
          console.error("Transcription error:", err);
          addDebugLog(`Transcription error: ${err}`);
          const errorMessage =
            err instanceof Error ? err.message : "An unknown error occurred";
          alert(`Transcription error: ${errorMessage}`);

          if (processingTimeoutRef.current) {
            clearTimeout(processingTimeoutRef.current);
          }
          setIsProcessingAnswer(false);
        }

        audioChunksRef.current = [];
      };

      audioRecorder.stop();
    }

    setIsRecording(false);
    setCurrentQuestionRecording(false);
    setShowRecordingStoppedPopup(true);
    setRecordingDone(true);
  };

  const callStartInterviewAPI = async () => {
    try {
      const jobTitle = localStorage.getItem("jobTitle");
      const resumeText = localStorage.getItem("resumeText");
      const resumeFileName = localStorage.getItem("resumeFileName");

      if (!jobTitle) {
        throw new Error("Job title not found. Please upload resume first.");
      }

      const payload = {
        jobRole: jobTitle,
        resumeText: resumeText || undefined,
        resumeFileName: resumeFileName || "resume.pdf",
      };

      const backendUrl =
        process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/interviews/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to start interview");
      }

      const data = await response.json();
      setInterviewId(data.interview._id);
      localStorage.setItem("interviewId", data.interview._id);
      addDebugLog(`Interview started with ID: ${data.interview._id}`);

      return data.interview._id;
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to start interview";
      addDebugLog(`Error starting interview: ${errorMsg}`);
      alert(`Error: ${errorMsg}`);
      return null;
    }
  };

  const submitCompleteInterviewAPI = async () => {
    try {
      addDebugLog("Submitting interview completion to backend...");
      const allQuestionData = localStorage.getItem("interview_transcripts")
        ? JSON.parse(localStorage.getItem("interview_transcripts") || "[]")
        : [];
      if (!interviewId) {
        throw new Error("Interview ID is missing");
      }
      const payload = {
        interviewId,
        questionsData: allQuestionData.map((q: any) => ({
          question: q.question,
          questionNumber: q.questionNumber,
          transcript: q.transcript,
          metrics: q.metrics,
          audioURL: q.audioURL,
        })),
        metadata: {
          atsScore: parseInt(localStorage.getItem("atsScore") || "0", 10),
          resumeTips: localStorage.getItem("resumeTips")
            ? JSON.parse(localStorage.getItem("resumeTips") || "[]")
            : [],
          totalQuestions: allQuestionData.length,
          interviewDuration: recordingStartTime
            ? Math.floor((Date.now() - recordingStartTime) / 1000)
            : 0,
        },
      };
      addDebugLog(
        `Sending completion with ${allQuestionData.length} questions`
      );
      const backendUrl =
        process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:5000/api";
      // Ensure we don't double up on /api
      const apiUrl = backendUrl.endsWith('/api') 
        ? `${backendUrl}/interviews/complete`
        : `${backendUrl}/interviews/complete`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to complete interview");
      }
      const result = await response.json();
      addDebugLog("Interview marked as complete on backend");
      console.log("Complete interview response:", result);
      return result;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      addDebugLog(`Error completing interview: ${errorMsg}`);
      console.error("Complete interview API error:", errorMsg);
    }
  };

  const handleEndInterview = async () => {
    try {
      if (
        videoRecorderRef.current &&
        videoRecorderRef.current.state !== "inactive"
      ) {
        addDebugLog("Ending interview and submitting to backend...");

        addDebugLog("Stopping full interview video recorder");

        videoRecorderRef.current.onstop = async () => {
          addDebugLog(
            `Full interview video recording stopped, chunks: ${videoChunksRef.current.length}`
          );

          const videoBlob = new Blob(videoChunksRef.current, {
            type: "video/webm",
          });
          addDebugLog(
            `Full interview video blob created, size: ${videoBlob.size} bytes`
          );

          const videoURL = URL.createObjectURL(videoBlob);
          addDebugLog(`Full interview video URL created: ${videoURL}`);

          sessionStorage.setItem("interview_recording", videoURL);

          sessionStorage.setItem("interview_debug", JSON.stringify(debugInfo));

          if (recordingStartTime) {
            const duration = Math.floor(
              (Date.now() - recordingStartTime) / 1000
            );
            sessionStorage.setItem("interview_duration", duration.toString());
            addDebugLog(`Recording duration: ${duration} seconds`);
          }

          addDebugLog("Full interview video recording saved to sessionStorage");

          // ✅ Complete the interview before navigating
          if (interviewId) {
            try {
              await submitCompleteInterviewAPI();
              addDebugLog("Interview completion API called successfully");
            } catch (err) {
              console.error("Error completing interview:", err);
              addDebugLog(`Error completing interview: ${err}`);
            }
          } else {
            addDebugLog(
              "Warning: No interview ID found, but continuing to feedback page"
            );
          }

          try {
            const reader = new FileReader();
            reader.readAsDataURL(videoBlob);
            reader.onloadend = async () => {
              addDebugLog(
                "Video processing complete, navigating to feedback page"
              );
              // Small delay to ensure API call completes
              await new Promise(resolve => setTimeout(resolve, 500));
              router.push("/interview/feedback");
            };
          } catch (err) {
            console.error("Error processing video blob:", err);
            addDebugLog(`Error processing video: ${err}`);
            // Small delay before navigation
            setTimeout(() => {
              router.push("/interview/feedback");
            }, 500);
          }
        };

        videoRecorderRef.current.stop();
      } else {
        addDebugLog(
          "Video recorder not active, cannot end interview recording"
        );
        // ✅ Complete the interview even if video recorder is not active
        if (interviewId) {
          try {
            await submitCompleteInterviewAPI();
            addDebugLog("Interview completion API called successfully");
          } catch (err) {
            console.error("Error completing interview:", err);
            addDebugLog(`Error completing interview: ${err}`);
          }
        }
        router.push("/interview/feedback");
      }

      if (timerRef.current) clearInterval(timerRef.current);
    } catch (error) {
      console.error("Error in handleEndInterview:", error);
      addDebugLog(`Error ending interview: ${error}`);
      router.push("/interview/feedback");
    }
  };

  const handleExitInterview = () => {
    setShowExitConfirm(true);
  };

  const handleHelp = () => {
    alert(
      "Make sure:\n- Camera is not blocked.\n- Microphone is connected.\n- Permissions are granted.\n- Use Chrome/Edge for best experience.\n\nThe entire interview is being recorded from start to finish. Each question's audio is processed separately for transcription."
    );
  };

  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        setMediaStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access denied");
        addDebugLog(`Camera access denied: ${err}`);
      }
    };

    initCamera();

    sessionStorage.removeItem("interview_recording");
    sessionStorage.removeItem("interview_recording_data");
    localStorage.removeItem("interview_transcripts");

    addDebugLog("Interview page initialized");

    return () => {
      const streamAtCleanup = mediaStreamCleanupRef.current;
      if (streamAtCleanup) {
        streamAtCleanup.getTracks().forEach((track) => {
          track.stop();
          addDebugLog(`Stopped media track: ${track.kind}`);
        });
      }

      if (timerRef.current) clearInterval(timerRef.current);
      if (processingTimeoutRef.current)
        clearTimeout(processingTimeoutRef.current);

      const currentVideoRecorder = videoRecorderRef.current;
      if (currentVideoRecorder && currentVideoRecorder.state !== "inactive") {
        currentVideoRecorder.stop();
        addDebugLog("Video recorder stopped during cleanup");
      }

      addDebugLog("Interview page cleanup complete");
    };
  }, []);

  const isLastQuestion = currentQuestion === questions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex flex-col pt-20">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
        transition={{ duration: 0.6 }}
        className="text-center py-3 sm:py-4 px-4 sm:px-6 flex-shrink-0"
      >
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-1 sm:mb-2">
          AI Interview
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ml-2">
            Experience
          </span>
        </h1>
        <p className="text-gray-600 text-xs sm:text-sm">
          Engage naturally with our AI interviewer and showcase your best self.
        </p>
      </motion.div>

      <div className="flex-1 px-4 sm:px-6 pb-4 min-h-0 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-6 h-full">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="lg:col-span-2 min-h-0 order-2 lg:order-1"
            >
              <div className="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border border-gray-200/20 h-full flex flex-col">
                <div className="grid grid-cols-1 gap-3 sm:gap-4 h-full">
                  <div className="flex justify-center">
                    <div className="scale-75 sm:scale-100">
                      <BotInterviewer
                        question={questions[currentQuestion]}
                        isRecording={isRecording}
                        isInterviewStarted={interviewStarted}
                        currentQuestionNumber={currentQuestion}
                      />
                    </div>
                  </div>

                  <div className="flex-1 min-h-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                        {currentQuestion + 1}
                      </div>
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-900">
                        Current Question
                      </h3>
                    </div>
                    <div className="p-2 sm:p-3 bg-blue-50/50 rounded-lg sm:rounded-xl border border-blue-200/20 overflow-y-auto max-h-24 sm:max-h-32">
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                        {questions[currentQuestion]}
                      </p>
                    </div>
                  </div>

                  <div className="text-center flex-shrink-0">
                    {interviewStarted && (
                      <div className="flex items-center justify-center space-x-2 text-xs text-gray-600">
                        <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                        <span>Interview in progress</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="lg:col-span-3 min-h-0 order-1 lg:order-2"
            >
              <div className="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border border-gray-200/20 h-full flex flex-col">
                <div className="relative rounded-lg sm:rounded-xl overflow-hidden bg-gray-900 mb-3 sm:mb-4 flex-1 min-h-0">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />

                  {interviewStarted && (
                    <>
                      <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-md sm:rounded-lg text-xs font-mono flex items-center space-x-1">
                        <Clock className="w-2 h-2 sm:w-3 sm:h-3" />
                        <span>
                          {String(Math.floor(seconds / 60)).padStart(2, "0")}:
                          {String(seconds % 60).padStart(2, "0")}
                        </span>
                      </div>

                      <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-red-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-md sm:rounded-lg text-xs flex items-center space-x-1">
                        <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full animate-pulse"></div>
                        <span className="font-medium">Recording</span>
                      </div>

                      {currentQuestionRecording && (
                        <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-blue-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-md sm:rounded-lg text-xs flex items-center space-x-1">
                          <Mic className="w-2 h-2 sm:w-3 sm:h-3" />
                          <span className="font-medium">Recording Answer</span>
                        </div>
                      )}
                    </>
                  )}

                  {!interviewStarted && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white/80">
                        <User className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 opacity-60" />
                        <p className="text-sm sm:text-lg font-medium">
                          Ready to start your interview
                        </p>
                        <p className="text-xs sm:text-sm opacity-80">
                          Click &quot;Start Interview&quot; to begin
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2 sm:space-y-3 flex-shrink-0">
                  {!interviewStarted ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center"
                    >
                      <button
                        onClick={handleStartInterview}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto"
                      >
                        <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Start Interview</span>
                      </button>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                      {!currentQuestionRecording ? (
                        <button
                          onClick={handleStartQuestionRecording}
                          disabled={recordingDone || isProcessingAnswer}
                          className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex items-center space-x-2 justify-center ${
                            recordingDone || isProcessingAnswer
                              ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                              : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                          }`}
                        >
                          <Mic className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>
                            {isProcessingAnswer
                              ? "Processing..."
                              : "Record Answer"}
                          </span>
                        </button>
                      ) : (
                        <button
                          onClick={handleStopQuestionRecording}
                          className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 justify-center"
                        >
                          <StopCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Stop & Submit</span>
                        </button>
                      )}

                      <button
                        onClick={handleEndInterview}
                        disabled={!isLastQuestion || !recordingDone}
                        className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex items-center space-x-2 justify-center ${
                          isLastQuestion && recordingDone
                            ? "animate-pulse ring-2 ring-blue-300"
                            : ""
                        }`}
                      >
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>End Interview</span>
                      </button>
                    </div>
                  )}

                  <div className="text-center">
                    <div className="inline-flex items-center space-x-2 bg-blue-50/50 border border-blue-200/20 rounded-lg sm:rounded-xl px-2 sm:px-3 py-1 sm:py-1.5 text-xs text-blue-800">
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full"></div>
                      <span>
                        {!interviewStarted
                          ? "Grant permissions to begin"
                          : isLastQuestion
                          ? "Record final answer, then click 'End Interview'"
                          : "Record your answer to continue"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showExitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6"
            onClick={() => setShowExitConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white/90 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl border border-gray-200/20 max-w-sm sm:max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3">
                  <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  Exit Interview?
                </h3>
                <p className="text-gray-600 mb-4 text-xs sm:text-sm">
                  Your interview progress will be lost if you exit now. Are you
                  sure you want to continue?
                </p>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={() => setShowExitConfirm(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg sm:rounded-xl font-medium transition-colors text-xs sm:text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => router.push("/interview/feedback")}
                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-2 rounded-lg sm:rounded-xl font-medium transition-all text-xs sm:text-sm"
                  >
                    Exit Interview
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRecordingStoppedPopup && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-4 right-4 bg-green-500/90 backdrop-blur-xl text-white px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl shadow-lg border border-green-400/20 flex items-center space-x-2 z-50"
          >
            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-medium text-xs sm:text-sm">
              Answer recorded successfully!
            </span>
            <button
              onClick={() => setShowRecordingStoppedPopup(false)}
              className="text-white/80 hover:text-white transition-colors text-xs sm:text-sm"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

