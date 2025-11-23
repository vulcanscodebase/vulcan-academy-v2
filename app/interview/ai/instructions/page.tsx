"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronDown, Play, Sparkles, Award, Users, Target, BarChart3, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function InterviewInstructions() {
  const [expandedSteps, setExpandedSteps] = useState<number[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/signin");
      return;
    }
    setIsLoaded(true)
  }, [router])

  const toggleExpand = (stepId: number) => {
    setExpandedSteps((prev) => (prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]))
  }

  const instructionSteps = [
    {
      id: 1,
      icon: <Award className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: "Resume Analysis",
      summary: "Your resume has been analyzed and optimized for the interview process.",
      details:
        "Our AI has reviewed your experience, skills, and achievements to create personalized questions that highlight your strengths and identify areas for improvement.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: 2,
      icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: "AI Interviewer Setup",
      summary: "Meet your AI interviewer who will conduct a natural, adaptive conversation.",
      details:
        "The AI interviewer uses advanced natural language processing to create realistic interview scenarios, adapting questions based on your responses and industry standards.",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: 3,
      icon: <Target className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: "Interview Process",
      summary: "Engage in a structured interview with real-time performance tracking.",
      details:
        "Answer questions naturally while our system evaluates your confidence, communication skills, technical knowledge, and overall presentation in real-time.",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: 4,
      icon: <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: "Performance Evaluation",
      summary: "Receive comprehensive feedback and actionable insights.",
      details:
        "Get detailed analysis of your performance including confidence levels, body language assessment, technical accuracy, and personalized recommendations for improvement.",
      color: "from-orange-500 to-red-500",
    },
  ]

  const preparationTips = [
    "Ensure you're in a quiet, well-lit environment",
    "Test your camera and microphone beforehand",
    "Prepare examples of your key achievements",
    "Review the job description and requirements",
    "Practice speaking clearly and confidently",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex flex-col">
      <nav className="backdrop-blur-xl bg-white/80 border-b border-gray-200/20 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <span className="text-base sm:text-lg font-semibold tracking-tight">Vulcan Interview Master</span>
            </Link>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="hidden sm:inline">Step 3 of 5</span>
                <span className="sm:hidden">3/5</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 px-4 sm:px-6 py-4 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-4 sm:mb-6"
          >
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-2">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Interview Preparation Guide
              </span>
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="space-y-3 sm:space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2 sm:gap-3">
                {instructionSteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border border-gray-200/20 hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="flex items-start space-x-2 sm:space-x-3 mb-2">
                      <div
                        className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg`}
                      >
                        {step.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1 leading-tight">
                          {step.id}. {step.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 mb-2 leading-relaxed">{step.summary}</p>

                    <AnimatePresence>
                      {expandedSteps.includes(step.id) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mb-2"
                        >
                          <div className="text-xs text-gray-500 leading-relaxed p-2 bg-gray-50/50 rounded-lg sm:rounded-xl">
                            {step.details}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button
                      onClick={() => toggleExpand(step.id)}
                      className="flex items-center text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors group-hover:translate-x-1 duration-300"
                    >
                      {expandedSteps.includes(step.id) ? "Show less" : "Learn more"}
                      <ChevronDown
                        className={`ml-1 w-3 h-3 transition-transform ${expandedSteps.includes(step.id) ? "rotate-180" : ""}`}
                      />
                    </button>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="bg-gradient-to-r from-green-50 to-emerald-50 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border-2 border-green-200/50"
              >
                <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                    <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-green-800">Quick Tips</h3>
                    <p className="text-xs text-green-600">Essential preparation guidelines</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {preparationTips.map((tip, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.05 }}
                      className="flex items-start space-x-2 group bg-white/60 rounded-lg sm:rounded-xl p-2 hover:bg-white/80 transition-colors"
                    >
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 mt-1.5 sm:mt-2 group-hover:bg-emerald-600 transition-colors flex-shrink-0"></div>
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">
                        {tip}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200/20 overflow-hidden h-fit"
            >
              <div className="h-32 sm:h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative flex items-center justify-center">
                <div className="text-center text-white">
                  <Play className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 opacity-80" />
                  <p className="text-base sm:text-lg font-medium">Video Tutorial</p>
                  <p className="text-xs sm:text-sm opacity-80">Complete Interview Guide</p>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Interview Preparation</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                  Watch this comprehensive guide to understand the AI interview process and learn proven strategies for
                  success. Get insights on body language, communication techniques, and how to showcase your skills
                  effectively.
                </p>

                <Link href="/interview/ai">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl sm:rounded-2xl py-2.5 sm:py-3 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                    Start Interview
                    <ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

