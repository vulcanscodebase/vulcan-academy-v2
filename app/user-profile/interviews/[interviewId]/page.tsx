"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Award,
  TrendingUp,
  Target,
  Lightbulb,
  Download,
  Calendar,
  Clock,
  User,
  MessageSquare,
  BarChart3,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
}

interface Interview {
  _id: string;
  jobRole: string;
  startedAt: string;
  completedAt?: string;
  status: string;
  questionsData?: QuestionData[];
  report?: {
    strengths?: string[];
    improvements?: string[];
    tips?: string[];
    overallFeedback?: string;
    metrics?: {
      avgConfidence?: number;
      avgBodyLanguage?: number;
      avgKnowledge?: number;
      avgSkillRelevance?: number;
      avgFluency?: number;
      totalQuestions?: number;
    };
  };
  resume?: {
    text?: string;
    fileName?: string;
    evaluation?: any;
  };
}

export default function InterviewDetails() {
  const router = useRouter();
  const params = useParams();
  const interviewId = params?.interviewId as string;

  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthAndFetchInterview = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/signin");
        return;
      }

      if (!interviewId) {
        setError("Invalid interview ID");
        setIsLoading(false);
        return;
      }

      await fetchInterviewDetails();
    };

    checkAuthAndFetchInterview();
  }, [interviewId, router]);

  const fetchInterviewDetails = async () => {
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:5000/api";
      const response = await fetch(`${backendUrl}/interviews/${interviewId}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch interview details");
      }

      const data = await response.json();
      console.log("Interview data received:", data.interview); // Debug log
      console.log("Interview status:", data.interview?.status);
      console.log("Interview report:", data.interview?.report);
      console.log("Interview report metrics:", data.interview?.report?.metrics);
      
      if (data.interview) {
        setInterview(data.interview);
      } else {
        setError("Interview data not found in response");
      }
    } catch (err) {
      console.error("Error fetching interview:", err);
      setError("Failed to load interview details");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateOverallScore = (metrics?: any) => {
    if (!metrics) return 0;
    const {
      avgConfidence = 0,
      avgBodyLanguage = 0,
      avgKnowledge = 0,
      avgSkillRelevance = 0,
      avgFluency = 0,
    } = metrics;
    const total =
      avgConfidence + avgBodyLanguage + avgKnowledge + avgSkillRelevance + avgFluency;
    return Math.round((total / 25) * 100);
  };

  function StarRating({ value }: { value: number }) {
    return (
      <div className="flex space-x-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < value ? "text-blue-500 fill-blue-500" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading interview details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/user-profile/interviews">
            <Button>Back to Interviews</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading interview details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/user-profile/interviews">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {interview.jobRole || "General Interview"}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(interview.startedAt)}
                  </div>
                  {interview.completedAt && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Completed: {formatDate(interview.completedAt)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Interview Status Info for non-completed interviews or failed reports */}
        {/* Show this section if interview status is not completed OR has no report or report has no metrics */}
        {(interview.status !== "completed" || !interview.report || !interview.report?.metrics) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-gray-200/20 mb-8"
          >
            <div className="text-center">
              {interview.status === "completed" && !interview.report ? (
                // Completed but report generation failed
                <>
                  <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                    Something Went Wrong
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Your interview was completed, but we couldn't generate your feedback report. This may be due to technical issues or insufficient response data during the interview.
                  </p>
                  <div className="mt-6">
                    <span className="px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      Status: Completed (No Report Available)
                    </span>
                  </div>
                  <div className="mt-6">
                    <Link href="/interview">
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                        Take a New Interview
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                // In progress or started
                <>
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Clock className="w-10 h-10 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                    Interview {interview.status === "started" ? "Started" : interview.status === "in_progress" ? "In Progress" : "Not Completed"}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {interview.status === "started" || interview.status === "in_progress"
                      ? "This interview is still in progress. Complete the interview to view detailed feedback and metrics."
                      : "This interview has not been completed yet. Complete the interview to view detailed feedback and metrics."}
                  </p>
                  <div className="mt-6">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                      interview.status === "started" || interview.status === "in_progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      Status: {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                    </span>
                  </div>
                  {interview.status === "started" || interview.status === "in_progress" ? (
                    <div className="mt-6">
                      <Link href="/interview">
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                          Continue Interview
                        </Button>
                      </Link>
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Overall Performance */}
        {interview.report?.metrics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-gray-200/20 mb-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Overall Performance
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {calculateOverallScore(interview.report.metrics)}%
                </div>
                <p className="text-gray-600">Overall Score</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {interview.report.metrics.totalQuestions || 0}
                </div>
                <p className="text-gray-600">Questions Answered</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {interview.status === "completed" ? "✓" : "○"}
                </div>
                <p className="text-gray-600">Status: {interview.status}</p>
              </div>
            </div>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {[
                {
                  label: "Confidence",
                  value: Math.round(interview.report.metrics.avgConfidence || 0),
                  icon: <TrendingUp className="w-5 h-5" />,
                },
                {
                  label: "Body Language",
                  value: Math.round(interview.report.metrics.avgBodyLanguage || 0),
                  icon: <User className="w-5 h-5" />,
                },
                {
                  label: "Knowledge",
                  value: Math.round(interview.report.metrics.avgKnowledge || 0),
                  icon: <Lightbulb className="w-5 h-5" />,
                },
                {
                  label: "Fluency",
                  value: Math.round(interview.report.metrics.avgFluency || 0),
                  icon: <MessageSquare className="w-5 h-5" />,
                },
                {
                  label: "Skill Relevance",
                  value: Math.round(interview.report.metrics.avgSkillRelevance || 0),
                  icon: <Target className="w-5 h-5" />,
                },
              ].map((metric) => (
                <div key={metric.label} className="text-center p-4 rounded-2xl bg-gray-50/50">
                  <div className="flex items-center justify-center space-x-2 mb-2 text-gray-600">
                    {metric.icon}
                    <span className="font-medium text-sm">{metric.label}</span>
                  </div>
                  <StarRating value={metric.value} />
                  <p className="text-sm text-gray-500 mt-1">{metric.value}/5</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Feedback Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Strengths */}
          {interview.report?.strengths && interview.report.strengths.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-gray-200/20"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Strengths</h2>
              </div>
              <div className="space-y-4">
                {interview.report.strengths.map((strength, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 rounded-2xl bg-green-50/50"
                  >
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                    <p className="text-gray-700 leading-relaxed">{strength}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Areas for Improvement */}
          {interview.report?.improvements && interview.report.improvements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-gray-200/20"
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
                {interview.report.improvements.map((improvement, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 rounded-2xl bg-orange-50/50"
                  >
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-2"></div>
                    <p className="text-gray-700 leading-relaxed">{improvement}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Tips */}
        {interview.report?.tips && interview.report.tips.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-gray-200/20"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Interview Tips</h2>
            </div>
            <div className="space-y-4">
              {interview.report.tips.map((tip, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 rounded-2xl bg-blue-50/50"
                >
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  <p className="text-gray-700 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

