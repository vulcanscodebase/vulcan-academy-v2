"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronRight, Play, Lightbulb, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/(layout-wrapper)/navbar"

export default function InterviewInstructions() {
  const [expandedSteps, setExpandedSteps] = useState<number[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/signin")
      return
    }
    setIsLoaded(true)
  }, [router])

  const toggleExpand = (stepId: number) => {
    setExpandedSteps((prev) => (prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]))
  }

  const importantInstructions = [
    "Once the interview begins, it cannot be paused or restarted. Please start only when you are ready to answer questions continuously for approximately 15 minutes.",
    "Each question is generated based on your previous answers. Make sure your responses are clear, accurate, and well-structured, as they directly influence the next questions.",
    "Ideal answer duration: 1–2 minutes. Answers longer than 3 minutes will not be considered.",
    "Keep your responses focused and relevant.",
    "Ensure you are in a quiet environment with minimal distractions. Use a stable internet connection and test your microphone/camera (if applicable) before starting.",
    "Take a few seconds (maximum 8 seconds) to organize your thoughts before answering. Well-thought-out responses are valued more than rushed ones.",
    "Answer based on your own knowledge and experience. There are no trick questions—authentic responses lead to better evaluation.",
    "Avoid using notes, browsers, or external help during the interview to ensure an accurate assessment.",
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
      <Navbar />

      <div className="flex-1 px-4 sm:px-6 py-4 overflow-y-auto pt-24">
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
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="bg-gradient-to-r from-amber-50 to-orange-50 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border-2 border-amber-200/50"
              >
                <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-amber-900">Important Instructions</h3>
                    <p className="text-xs text-amber-700">Before You Start</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {importantInstructions.map((instruction, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="flex items-start space-x-2 group bg-white/60 rounded-lg sm:rounded-xl p-2 hover:bg-white/80 transition-colors"
                    >
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-500 mt-1.5 sm:mt-2 group-hover:bg-orange-600 transition-colors flex-shrink-0"></div>
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">
                        {instruction}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

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
                    <h3 className="text-sm sm:text-base font-bold text-green-800">Preparation Tips</h3>
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
              className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200/20 overflow-hidden h-fit lg:sticky lg:top-24"
            >
              <div className="h-48 sm:h-64 lg:h-80 bg-gradient-to-br from-blue-500 to-purple-600 relative flex items-center justify-center">
                <div className="text-center text-white">
                  <Play className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 opacity-80" />
                  <p className="text-lg sm:text-xl font-medium">Video Tutorial</p>
                  <p className="text-sm sm:text-base opacity-80">Complete Interview Guide</p>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Interview Preparation</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                  Watch this comprehensive guide to understand the Vulcan Prep interview process and learn proven strategies for
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
