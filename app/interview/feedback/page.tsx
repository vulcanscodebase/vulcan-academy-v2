"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Star,
  Download,
  Home,
  ChevronLeft,
  ChevronRight,
  Play,
  Award,
  TrendingUp,
  Target,
  Lightbulb,
  Sparkles,
  CheckCircle,
  BarChart3,
  User,
  MessageSquare,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/(layout-wrapper)/navbar";
import { toast } from "sonner";

interface InterviewMetrics {
  confidence: number;
  bodyLanguage: number;
  knowledge: number;
  skillRelevance: number;
  fluency: number;
  feedback: string;
}

interface QuestionData {
  question: string;
  questionNumber: number;
  transcript: string;
  metrics: InterviewMetrics;
  audioURL?: string;
}

export default function FeedbackPage() {
  const router = useRouter();
  const [interviewMetrics, setInterviewMetrics] =
    useState<InterviewMetrics | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [allQuestionData, setAllQuestionData] = useState<QuestionData[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [debugInfo] = useState<string[]>([]);
  const [showDebug, setShowDebug] = useState(false);
  const [feedback, setFeedback] = useState<{
    strengths: string[];
    improvements: string[];
    tips: string[];
  }>({
    strengths: [],
    improvements: [],
    tips: [],
  });
  // const [loading] = useState<boolean>(true)
  const [resumeAnalysis, setResumeAnalysis] = useState<{
    atsScore: number;
    tips: string[];
  }>({
    atsScore: 0,
    tips: [],
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    setIsLoaded(true);

    const loadDataAndFetchFeedback = async () => {
      try {
        const storedInterviewId = localStorage.getItem("interviewId");
        const storedTranscript = localStorage.getItem("interview_transcript");
        const storedAllQuestions = localStorage.getItem(
          "interview_transcripts"
        );
        const storedScore = localStorage.getItem("atsScore");
        const storedTips = localStorage.getItem("resumeTips");

        if (storedInterviewId) {
          setInterviewId(storedInterviewId);
        }

        if (storedScore && storedTips) {
          setResumeAnalysis({
            atsScore: Number.parseInt(storedScore, 10),
            tips: JSON.parse(storedTips),
          });
        }

        if (storedTranscript) {
          setTranscript(storedTranscript);
        }

        if (storedAllQuestions) {
          try {
            const parsedQuestions = JSON.parse(
              storedAllQuestions
            ) as QuestionData[];

            // Sanitize audioURL to only allow same-origin or relative paths
            const sanitizeAudioURL = (
              url: string | undefined
            ): string | undefined => {
              if (!url) return undefined;
              try {
                const allowedOrigin = window.location.origin;
                const parsed = new URL(url, allowedOrigin);
                if (parsed.origin === allowedOrigin || url.startsWith("/")) {
                  return parsed.href;
                }
              } catch {
                return undefined;
              }
              return undefined;
            };

            // Normalize metrics and transcript for display stability
            const normalizeMetrics = (
              m: InterviewMetrics | undefined | null
            ): InterviewMetrics => {
              return {
                confidence:
                  typeof m?.confidence === "number" && !isNaN(m.confidence)
                    ? m.confidence
                    : 0,
                bodyLanguage:
                  typeof m?.bodyLanguage === "number" && !isNaN(m.bodyLanguage)
                    ? m.bodyLanguage
                    : 0,
                knowledge:
                  typeof m?.knowledge === "number" && !isNaN(m.knowledge)
                    ? m.knowledge
                    : 0,
                skillRelevance:
                  typeof m?.skillRelevance === "number" &&
                  !isNaN(m.skillRelevance)
                    ? m.skillRelevance
                    : 0,
                fluency:
                  typeof m?.fluency === "number" && !isNaN(m.fluency)
                    ? m.fluency
                    : 0,
                feedback:
                  typeof m?.feedback === "string" && m.feedback.trim() !== ""
                    ? m.feedback
                    : "Transcript is empty",
              };
            };

            const sanitizedQuestions = parsedQuestions.map((q) => ({
              ...q,
              transcript:
                typeof q.transcript === "string" && q.transcript.trim() !== ""
                  ? q.transcript
                  : "Transcript is empty",
              metrics: normalizeMetrics(
                q.metrics as unknown as InterviewMetrics
              ),
              audioURL: sanitizeAudioURL(q.audioURL),
            }));

            setAllQuestionData(sanitizedQuestions);

            if (sanitizedQuestions.length > 0) {
              setSelectedQuestion(0);
              // Automatically load the first question's data
              setTranscript(
                typeof sanitizedQuestions[0].transcript === "string" &&
                  sanitizedQuestions[0].transcript.trim() !== ""
                  ? sanitizedQuestions[0].transcript
                  : "Transcript is empty"
              );
              setInterviewMetrics(sanitizedQuestions[0].metrics);

              // setLoading(true)

              const payload = sanitizedQuestions.map(
                ({ question, transcript, questionNumber }) => ({
                  question,
                  transcript,
                  questionNumber,
                })
              );

              try {
                const res = await fetch("/api/interview-feedback", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ transcriptData: payload }),
                });

                if (!res.ok) throw new Error("Failed to fetch feedback");

                const feedData = await res.json();
                const feedbackRaw = feedData.feedback
                  .replace(/```json|```/g, "")
                  .trim();

                try {
                  const parsedFeedback = JSON.parse(feedbackRaw);
                  setFeedback({
                    strengths: parsedFeedback.strengths || [],
                    improvements: parsedFeedback.improvements || [],
                    tips: parsedFeedback.tips || [],
                  });
                } catch (e) {
                  console.error("Failed to parse feedback JSON:", e);
                }
              } catch (apiError: unknown) {
                console.error("Error fetching feedback:", apiError);
              } finally {
                // setLoading(false)
              }
            }
          } catch (parseError) {
            console.error("Error parsing questions:", parseError);
          }
        }
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };

    loadDataAndFetchFeedback();
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Submit feedback to backend
  const submitFeedbackUpdate = useCallback(async () => {
    try {
      setIsSubmittingFeedback(true);

      if (!interviewId) {
        throw new Error("Interview ID not found");
      }
      
      console.log("Submitting feedback update for interview:", interviewId);
      console.log("Feedback data:", feedback);
      console.log("All question data length:", allQuestionData.length);

      // Calculate metrics - always provide metrics even if empty to ensure report displays
      const metrics = allQuestionData.length > 0
        ? {
            avgConfidence:
              allQuestionData.reduce(
                (sum, q) => sum + (q.metrics?.confidence || 0),
                0
              ) / allQuestionData.length,
            avgBodyLanguage:
              allQuestionData.reduce(
                (sum, q) => sum + (q.metrics?.bodyLanguage || 0),
                0
              ) / allQuestionData.length,
            avgKnowledge:
              allQuestionData.reduce(
                (sum, q) => sum + (q.metrics?.knowledge || 0),
                0
              ) / allQuestionData.length,
            avgSkillRelevance:
              allQuestionData.reduce(
                (sum, q) => sum + (q.metrics?.skillRelevance || 0),
                0
              ) / allQuestionData.length,
            avgFluency:
              allQuestionData.reduce(
                (sum, q) => sum + (q.metrics?.fluency || 0),
                0
              ) / allQuestionData.length,
            totalQuestions: allQuestionData.length,
          }
        : {
            // Provide default metrics if no question data
            avgConfidence: 0,
            avgBodyLanguage: 0,
            avgKnowledge: 0,
            avgSkillRelevance: 0,
            avgFluency: 0,
            totalQuestions: 0,
          };

      //  Only submit if we have actual feedback content or valid metrics
      const hasValidFeedback = feedback.strengths.length > 0 || feedback.improvements.length > 0 || feedback.tips.length > 0;
      const hasValidMetrics = allQuestionData.length > 0 && allQuestionData.some(q => q.metrics && (q.metrics.confidence || q.metrics.knowledge || q.metrics.fluency));
      
      // Don't save report if no valid data
      if (!hasValidFeedback && !hasValidMetrics) {
        console.log("No valid feedback or metrics to save. Skipping report submission.");
        setFeedbackSubmitted(true); // Mark as submitted to prevent retry
        return null;
      }

      const payload = {
        report: {
          strengths: feedback.strengths.length > 0 ? feedback.strengths : [],
          improvements: feedback.improvements.length > 0 ? feedback.improvements : [],
          tips: feedback.tips.length > 0 ? feedback.tips : [],
          overallFeedback:
            feedback.strengths.length > 0
              ? `Strong in: ${feedback.strengths[0]}. Areas to improve: ${
                  feedback.improvements[0] || "communication skills"
                }.`
              : hasValidMetrics ? "Interview completed with recorded responses" : "",
          metrics: metrics, // Always include metrics
        },
      };

      const backendUrl =
        process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:5000/api";
      // Ensure we don't double up on /api
      const apiUrl = backendUrl.endsWith('/api') 
        ? `${backendUrl}/interviews/${interviewId}/feedback`
        : `${backendUrl}/api/interviews/${interviewId}/feedback`;
      const response = await fetch(apiUrl,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update feedback");
      }

      const result = await response.json();
      console.log("Feedback updated successfully:", result);
      console.log("Interview status after update:", result.interview?.status);
      console.log("Interview completedAt:", result.interview?.completedAt);
      
      if (result.interview?.status === "completed") {
        toast.success("Interview completed and report saved successfully!");
      } else {
        console.warn("Warning: Interview status is not 'completed' after feedback update:", result.interview?.status);
        toast.warning("Report saved, but interview status may not be updated. Please refresh the page.");
      }
      
      setFeedbackSubmitted(true);
      
      return result;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      console.error("Error updating feedback:", errorMsg);
      alert(`Error saving feedback: ${errorMsg}`);
    } finally {
      setIsSubmittingFeedback(false);
    }
  }, [interviewId, feedback, allQuestionData]);

  // Auto-submit feedback and report to backend after it's loaded
  useEffect(() => {
    // Wait a bit for feedback to be fully loaded
    const timer = setTimeout(() => {
      // Submit if we have interviewId and haven't submitted yet (even if feedback is empty)
      if (interviewId && !feedbackSubmitted && isLoaded) {
        console.log("Auto-submitting feedback update...");
        console.log("Feedback strengths length:", feedback.strengths.length);
        console.log("All question data length:", allQuestionData.length);
        // Save report to backend automatically
        submitFeedbackUpdate();
      }
    }, 2000); // Wait 2 seconds for feedback to be fully loaded

    return () => clearTimeout(timer);
  }, [feedback, interviewId, feedbackSubmitted, submitFeedbackUpdate, isLoaded, allQuestionData]);

  // Helper for safe numeric values
  const safeValue = (val: number | undefined) =>
    typeof val === "number" && !isNaN(val) ? val : 0;

  // Stable average sentiment calc
  const averageSentiment = useMemo(() => {
    if (allQuestionData.length === 0) return null;

    const totalConfidence = allQuestionData.reduce(
      (sum, q) => sum + safeValue(q.metrics?.confidence),
      0
    );
    const totalBodyLanguage = allQuestionData.reduce(
      (sum, q) => sum + safeValue(q.metrics?.bodyLanguage),
      0
    );
    const totalKnowledge = allQuestionData.reduce(
      (sum, q) => sum + safeValue(q.metrics?.knowledge),
      0
    );
    const totalFluency = allQuestionData.reduce(
      (sum, q) => sum + safeValue(q.metrics?.fluency),
      0
    );
    const totalSkillRelevance = allQuestionData.reduce(
      (sum, q) => sum + safeValue(q.metrics?.skillRelevance),
      0
    );

    const numQuestions = allQuestionData.length;
    const totalScore =
      totalConfidence +
      totalKnowledge +
      totalFluency +
      totalSkillRelevance;
    const totalPossible = 20 * numQuestions;
    const percentageScore = (totalScore / totalPossible) * 100;

    const getThreshold = (x: number) => (x / 500) * totalPossible;
    const thresholds = {
      excellent: getThreshold(375),
      good: getThreshold(340),
      average: getThreshold(300),
      belowAverage: getThreshold(250),
    };

    let grade = "Re-attempt";
    if (totalScore >= thresholds.excellent) grade = "Excellent";
    else if (totalScore >= thresholds.good) grade = "Good";
    else if (totalScore >= thresholds.average) grade = "Average";
    else if (totalScore >= thresholds.belowAverage) grade = "Below Average";

    return {
      confidence: Math.round(totalConfidence / numQuestions),
      bodyLanguage: Math.round(totalBodyLanguage / numQuestions),
      knowledge: Math.round(totalKnowledge / numQuestions),
      fluency: Math.round(totalFluency / numQuestions),
      skillRelevance: Math.round(totalSkillRelevance / numQuestions),
      score: totalScore,
      outOf: totalPossible,
      percentage: percentageScore.toFixed(2),
      grade,
    };
  }, [allQuestionData]);

  // Handle question selection
  const handleQuestionSelect = (index: number) => {
    if (!allQuestionData[index]) return;
    setSelectedQuestion(index);
    setTranscript(allQuestionData[index].transcript);
    setInterviewMetrics(allQuestionData[index].metrics);
  };

  // StarRating component
  function StarRating({ value }: { value: number }) {
    return (
      <div className="flex space-x-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i < value ? "text-blue-500 fill-blue-500" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-green-500 to-emerald-500";
    if (score >= 60) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "Excellent":
        return "text-green-600";
      case "Good":
        return "text-blue-600";
      case "Average":
        return "text-yellow-600";
      case "Below Average":
        return "text-orange-600";
      default:
        return "text-red-600";
    }
  };

  // Server-side PDF generation function
  const handleGeneratePDF = async () => {
    if (isGeneratingPDF) return;

    setIsGeneratingPDF(true);
    try {
      const reportId = `FB-${new Date().getFullYear()}-${String(
        new Date().getMonth() + 1
      ).padStart(2, "0")}-${String(Math.floor(Math.random() * 1000)).padStart(
        3,
        "0"
      )}`;

      // Prepare feedback text from strengths, improvements, and tips
      const feedbackText = [
        feedback.strengths && feedback.strengths.length > 0 
          ? `Strengths:\n${feedback.strengths.map((s, i) => `${i + 1}. ${s}`).join('\n')}` 
          : '',
        feedback.improvements && feedback.improvements.length > 0 
          ? `Areas for Improvement:\n${feedback.improvements.map((s, i) => `${i + 1}. ${s}`).join('\n')}` 
          : '',
        feedback.tips && feedback.tips.length > 0 
          ? `Tips:\n${feedback.tips.map((s, i) => `${i + 1}. ${s}`).join('\n')}` 
          : '',
      ].filter(Boolean).join('\n\n') || 'No feedback available';

      // Prepare resume analysis text
      const resumeAnalysisText = resumeAnalysis && resumeAnalysis.atsScore > 0
        ? `ATS Score: ${resumeAnalysis.atsScore}/100\n\nImprovement Suggestions:\n${(resumeAnalysis.tips || []).map((tip: string, i: number) => `${i + 1}. ${tip}`).join('\n')}`
        : 'No resume analysis available';

      // Prepare question data with full metrics and feedback
      const questionData = allQuestionData.map((q: QuestionData) => ({
        question: q.question || 'No question',
        answer: q.transcript || 'No answer provided',
        questionNumber: q.questionNumber || 0,
        metrics: q.metrics ? {
          confidence: q.metrics.confidence || 0,
          bodyLanguage: q.metrics.bodyLanguage || 0,
          knowledge: q.metrics.knowledge || 0,
          skillRelevance: q.metrics.skillRelevance || 0,
          fluency: q.metrics.fluency || 0,
          feedback: q.metrics.feedback || '',
        } : null,
      }));

      const pdfData = {
        reportDate: new Date().toLocaleDateString(),
        downloadTimestamp: new Date().toLocaleString(),
        reportId,
        allQuestionData: questionData,
        feedback: feedbackText,
        resumeAnalysis: resumeAnalysisText,
        reportType: 'user',
      };

      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pdfData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate PDF");
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Interview_Feedback_Report.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("Error generating PDF:", error);
      toast.error(error?.message || "Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Navbar />

      <div className="pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Your Interview
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Performance Report
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Comprehensive insights and personalized recommendations to help
              you excel in future interviews.
            </p>
          </motion.div>

          {/* Report Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-gray-200/20 mb-8"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Report Generated
                </h2>
                <p className="text-gray-600">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="text-right">
                <h2 className="text-lg font-semibold text-gray-900">
                  Report ID
                </h2>
                <p className="text-gray-600 font-mono">
                  FB-{new Date().getFullYear()}-
                  {String(new Date().getMonth() + 1).padStart(2, "0")}-
                  {String(Math.floor(Math.random() * 1000)).padStart(3, "0")}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Overall Performance */}
          {averageSentiment && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-gray-200/20 mb-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Overall Performance
                </h2>
              </div>

              {/* Score Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {averageSentiment.score}/{averageSentiment.outOf}
                  </div>
                  <p className="text-gray-600">Total Score</p>
                </div>
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {averageSentiment.percentage}%
                  </div>
                  <p className="text-gray-600">Performance</p>
                </div>
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50">
                  <div
                    className={`text-3xl font-bold mb-2 ${getGradeColor(
                      averageSentiment.grade
                    )}`}
                  >
                    {averageSentiment.grade}
                  </div>
                  <p className="text-gray-600">Grade</p>
                </div>
              </div>

              {/* Detailed Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {[
                  {
                    label: "Confidence",
                    value: averageSentiment.confidence,
                    icon: <TrendingUp className="w-5 h-5" />,
                  },
                  {
                    label: "Body Language",
                    value: averageSentiment.bodyLanguage,
                    icon: <User className="w-5 h-5" />,
                  },
                  {
                    label: "Knowledge",
                    value: averageSentiment.knowledge,
                    icon: <Lightbulb className="w-5 h-5" />,
                  },
                  {
                    label: "Fluency",
                    value: averageSentiment.fluency,
                    icon: <MessageSquare className="w-5 h-5" />,
                  },
                  {
                    label: "Skill Relevance",
                    value: averageSentiment.skillRelevance,
                    icon: <Target className="w-5 h-5" />,
                  },
                ].map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="text-center p-4 rounded-2xl bg-gray-50/50"
                  >
                    <div className="flex items-center justify-center space-x-2 mb-2 text-gray-600">
                      {metric.icon}
                      <span className="font-medium">{metric.label}</span>
                    </div>
                    <StarRating value={metric.value} />
                    <p className="text-sm text-gray-500 mt-1">
                      {metric.value}/5
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Question Navigation */}
          {allQuestionData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-gray-200/20 mb-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Interview Questions
              </h2>
              <div className="flex flex-wrap gap-3">
                {allQuestionData.map((q, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuestionSelect(index)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      selectedQuestion === index
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Question {q.questionNumber}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Selected Question Details */}
          {selectedQuestion !== null && allQuestionData[selectedQuestion] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-gray-200/20 mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Question {allQuestionData[selectedQuestion].questionNumber}{" "}
                  Analysis
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setSelectedQuestion(Math.max(0, selectedQuestion - 1))
                    }
                    disabled={selectedQuestion === 0}
                    className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedQuestion(
                        Math.min(
                          allQuestionData.length - 1,
                          selectedQuestion + 1
                        )
                      )
                    }
                    disabled={selectedQuestion === allQuestionData.length - 1}
                    className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-blue-50/50 rounded-2xl">
                  <h3 className="font-medium text-gray-900 mb-2">Question</h3>
                  <p className="text-gray-700 italic">
                    &ldquo;{allQuestionData[selectedQuestion].question}&rdquo;
                  </p>
                </div>

                {transcript && (
                  <div className="p-4 bg-gray-50/50 rounded-2xl">
                    <h3 className="font-medium text-gray-900 mb-2">
                      Your Response
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {transcript}
                    </p>
                  </div>
                )}

                {allQuestionData[selectedQuestion].audioURL && (
                  <div className="p-4 bg-green-50/50 rounded-2xl">
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Play className="w-5 h-5 mr-2" />
                      Audio Playback
                    </h3>
                    <audio
                      controls
                      src={allQuestionData[selectedQuestion].audioURL}
                      className="w-full"
                    >
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}

                {interviewMetrics && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      {[
                        {
                          label: "Confidence",
                          value: interviewMetrics.confidence,
                        },
                        {
                          label: "Body Language",
                          value: interviewMetrics.bodyLanguage,
                        },
                        {
                          label: "Knowledge",
                          value: interviewMetrics.knowledge,
                        },
                        { label: "Fluency", value: interviewMetrics.fluency },
                        {
                          label: "Skill Relevance",
                          value: interviewMetrics.skillRelevance,
                        },
                      ].map((metric) => (
                        <div
                          key={metric.label}
                          className="text-center p-3 rounded-2xl bg-gray-50/50"
                        >
                          <p className="font-medium text-gray-900 mb-1">
                            {metric.label}
                          </p>
                          <StarRating value={metric.value} />
                          <p className="text-sm text-gray-500 mt-1">
                            {metric.value}/5
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-purple-50/50 rounded-2xl">
                      <h3 className="font-medium text-gray-900 mb-2">
                        Vulcan Prep 360 Feedback
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {interviewMetrics.feedback}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* Feedback Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Strengths */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-gray-200/20"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Strengths
                </h2>
              </div>
              <div className="space-y-4">
                {feedback?.strengths?.map((strength, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-start space-x-3 p-3 rounded-2xl bg-green-50/50"
                  >
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                    <p className="text-gray-700 leading-relaxed">{strength}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Areas for Improvement */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-gray-200/20"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Areas to Improve
                </h2>
              </div>
              <div className="space-y-4">
                {feedback?.improvements?.map((improvement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-start space-x-3 p-3 rounded-2xl bg-orange-50/50"
                  >
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-2"></div>
                    <p className="text-gray-700 leading-relaxed">
                      {improvement}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Tips and Resume Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Interview Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-gray-200/20"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Interview Tips
                </h2>
              </div>
              <div className="space-y-4">
                {feedback?.tips?.map((tip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    className="flex items-start space-x-3 p-3 rounded-2xl bg-blue-50/50"
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                    <p className="text-gray-700 leading-relaxed">{tip}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Resume Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-gray-200/20"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Resume Analysis
                </h2>
              </div>

              {resumeAnalysis.atsScore > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">ATS Score</span>
                    <span
                      className={`font-bold text-2xl px-3 py-1 rounded-xl ${getScoreColor(
                        resumeAnalysis.atsScore
                      )}`}
                    >
                      {resumeAnalysis.atsScore}/100
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${getScoreGradient(
                        resumeAnalysis.atsScore
                      )} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${resumeAnalysis.atsScore}%` }}
                      transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">
                  Improvement Suggestions
                </h3>
                {resumeAnalysis.tips && resumeAnalysis.tips.length > 0 ? (
                  resumeAnalysis.tips.map((tip, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.3 + index * 0.1 }}
                      className="flex items-start space-x-3 p-3 rounded-2xl bg-purple-50/50"
                    >
                      <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                      <p className="text-gray-700 leading-relaxed">{tip}</p>
                    </motion.div>
                  ))
                ) : (
                  <>
                    <div className="flex items-start space-x-3 p-3 rounded-2xl bg-purple-50/50">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                      <p className="text-gray-700 leading-relaxed">
                        Highlight key achievements and tailor your resume to
                        each job.
                      </p>
                    </div>
                    <div className="flex items-start space-x-3 p-3 rounded-2xl bg-purple-50/50">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                      <p className="text-gray-700 leading-relaxed">
                        Use action verbs and quantify your accomplishments when
                        possible.
                      </p>
                    </div>
                    <div className="flex items-start space-x-3 p-3 rounded-2xl bg-purple-50/50">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                      <p className="text-gray-700 leading-relaxed">
                        Keep your formatting consistent and easy to scan.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
          >
            <Button
              onClick={() => router.push("/")}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Home className="mr-2 w-5 h-5" />
              Go to Home
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={handleGeneratePDF}
              disabled={isGeneratingPDF || !isMounted}
              className="px-8 py-4 rounded-2xl text-lg font-semibold border-2 hover:bg-gray-50 transition-all duration-300 bg-transparent"
            >
              <Download className="mr-2 w-5 h-5" />
              {isGeneratingPDF ? "Generating PDF..." : "Download Report as PDF"}
            </Button>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="mt-16 pt-8 border-t border-gray-200/20 text-center text-gray-600"
          >
            <p className="text-lg font-medium mb-2">
              &ldquo;Every step forward is progress—keep growing!&rdquo;
            </p>
            <p className="text-sm">
              Contact us at support@interviewai.com | ©{" "}
              {new Date().getFullYear()} InterviewAI. All rights reserved.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
