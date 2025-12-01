"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar,
  Award,
  TrendingUp,
  Eye,
  Download,
  ArrowLeft,
  Briefcase,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Interview {
  _id: string;
  jobRole: string;
  startedAt: string;
  completedAt?: string;
  status: string;
  questionsData?: any[];
  userId?: {
    _id: string;
    name: string;
    email: string;
    profilePhoto?: string;
  };
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
  metadata?: {
    atsScore?: number;
    resumeTips?: string[];
  };
}

export default function MyInterviews() {
  const router = useRouter();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthAndFetchInterviews = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/signin");
        return;
      }

      // Get user ID from localStorage or context
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setUserId(user.id || user._id);
          await fetchUserInterviews(user.id || user._id);
        } catch (err) {
          console.error("Error parsing user:", err);
          setError("Failed to load user information");
          setIsLoading(false);
        }
      } else {
        setError("User not found. Please login again.");
        setIsLoading(false);
      }
    };

    checkAuthAndFetchInterviews();
  }, [router]);

  const fetchUserInterviews = async (uid: string) => {
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/interviews/user/${uid}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch interviews");
      }

      const data = await response.json();
      // Deduplicate interviews by _id to prevent showing duplicates
      const uniqueInterviews = (data.interviews || []).reduce((acc: Interview[], current: Interview) => {
        const exists = acc.find(item => item._id === current._id);
        if (!exists) {
          acc.push(current);
        }
        return acc;
      }, []);
      setInterviews(uniqueInterviews);
    } catch (err) {
      console.error("Error fetching interviews:", err);
      setError("Failed to load interviews");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "started":
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "abandoned":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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

  const handleDownloadPDF = async (interviewId: string) => {
    if (isGeneratingPDF) return;

    setIsGeneratingPDF(interviewId);
    try {
      // Fetch full interview details
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
      const interview = data.interview;

      if (!interview || !interview.report) {
        throw new Error("Interview report not found");
      }

      const reportId = `RPT-${new Date().getFullYear()}-${String(
        new Date().getMonth() + 1
      ).padStart(2, "0")}-${String(Math.floor(Math.random() * 1000)).padStart(
        3,
        "0"
      )}`;

      // Prepare feedback text
      const feedbackText = [
        interview.report.strengths && interview.report.strengths.length > 0 
          ? `Strengths:\n${interview.report.strengths.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n')}` 
          : '',
        interview.report.improvements && interview.report.improvements.length > 0 
          ? `Areas for Improvement:\n${interview.report.improvements.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n')}` 
          : '',
        interview.report.tips && interview.report.tips.length > 0 
          ? `Tips:\n${interview.report.tips.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n')}` 
          : '',
        interview.report.overallFeedback ? `\nOverall Feedback:\n${interview.report.overallFeedback}` : '',
      ].filter(Boolean).join('\n\n') || 'No feedback available';

      // Prepare question data
      const questionData = (interview.questionsData || []).map((q: any) => ({
        question: q.question || 'No question',
        answer: q.transcript || 'No answer provided',
      }));

      // Prepare resume analysis
      const resumeAnalysisText = interview.metadata?.atsScore 
        ? `ATS Score: ${interview.metadata.atsScore}/100\n\nImprovement Suggestions:\n${(interview.metadata.resumeTips || []).map((tip: string, i: number) => `${i + 1}. ${tip}`).join('\n')}`
        : interview.resume?.evaluation 
          ? `ATS Score: ${interview.resume.evaluation.atsScore || 'N/A'}/100\n\nImprovement Suggestions:\n${(interview.resume.evaluation.resumeTips || []).map((tip: string, i: number) => `${i + 1}. ${tip}`).join('\n')}`
          : 'No resume analysis available';

      const pdfData = {
        reportDate: new Date().toLocaleDateString(),
        reportId,
        candidateName: interview.userId?.name || 'Unknown',
        candidateEmail: interview.userId?.email || '',
        jobRole: interview.jobRole || 'General Interview',
        allQuestionData: questionData,
        feedback: feedbackText,
        resumeAnalysis: resumeAnalysisText,
      };

      const pdfResponse = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pdfData),
      });

      if (!pdfResponse.ok) {
        const errorData = await pdfResponse.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate PDF");
      }

      // Create blob and download
      const blob = await pdfResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Interview_Report_${interview.jobRole.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("Error generating PDF:", error);
      alert(error?.message || "Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your interviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/user-profile">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Profile
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  My
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ml-2">
                    Interviews
                  </span>
                </h1>
                <p className="text-gray-600 mt-1">
                  View all your completed interview sessions
                </p>
              </div>
            </div>

            <Link href="/interview">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                New Interview
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        ) : interviews.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-12 text-center shadow-lg border border-gray-200/20">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">No interviews yet</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start your first AI interview session to practice and get personalized
              feedback
            </p>
            <Link href="/interview">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                Start Your First Interview
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {interviews.map((interview, index) => (
              <motion.div
                key={interview._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/20 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {interview.jobRole || "General Interview"}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {formatDate(interview.startedAt)}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          interview.status
                        )}`}
                      >
                        {interview.status.charAt(0).toUpperCase() +
                          interview.status.slice(1)}
                      </span>

                      {interview.status === "completed" &&
                        interview.report?.metrics && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
                            <Award className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-blue-700">
                              Score: {calculateOverallScore(interview.report.metrics)}%
                            </span>
                          </div>
                        )}

                      {interview.completedAt && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          Completed: {formatDate(interview.completedAt)}
                        </div>
                      )}
                    </div>

                    {interview.report?.strengths &&
                      interview.report.strengths.length > 0 && (
                        <div className="bg-green-50 rounded-lg p-3 mb-3">
                          <p className="text-sm font-medium text-green-800 mb-1">
                            Top Strength
                          </p>
                          <p className="text-sm text-green-700">
                            {interview.report.strengths[0]}
                          </p>
                        </div>
                      )}
                  </div>

                  <div className="flex flex-col gap-2 md:ml-4">
                    <Button
                      onClick={() =>
                        router.push(`/user-profile/interviews/${interview._id}`)
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>

                    {interview.status === "completed" && interview.report?.metrics && (
                      <Button 
                        variant="outline"
                        onClick={() => handleDownloadPDF(interview._id)}
                        disabled={isGeneratingPDF === interview._id}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {isGeneratingPDF === interview._id ? "Generating..." : "Download Report"}
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

