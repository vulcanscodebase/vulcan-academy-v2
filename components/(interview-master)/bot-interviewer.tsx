"use client";

import { motion } from "framer-motion";
import { Bot, Mic, Sparkles } from "lucide-react";

interface BotInterviewerProps {
  question: string;
  isRecording: boolean;
  isInterviewStarted: boolean;
  currentQuestionNumber: number;
}

export default function BotInterviewer({
  question,
  isRecording,
  isInterviewStarted,
  currentQuestionNumber,
}: BotInterviewerProps) {
  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-200/20">
        {/* Bot Avatar */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <motion.div
            animate={{
              scale: isRecording ? [1, 1.05, 1] : 1,
            }}
            transition={{
              duration: 2,
              repeat: isRecording ? Infinity : 0,
              ease: "easeInOut",
            }}
            className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl"
          >
            <Bot className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
            {isRecording && (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-full border-4 border-red-500"
              />
            )}
          </motion.div>

          {/* Status Indicator */}
          <div className="flex flex-col items-center space-y-2">
            {isInterviewStarted ? (
              <>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  {isRecording ? (
                    <>
                      <Mic className="w-4 h-4 text-red-500 animate-pulse" />
                      <span className="font-medium">Listening...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">Ready</span>
                    </>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  Question {currentQuestionNumber + 1}
                </div>
              </>
            ) : (
              <div className="text-sm text-gray-500">
                Waiting to start...
              </div>
            )}
          </div>
        </div>

        {/* Animated Background Elements */}
        {isRecording && (
          <>
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-blue-200/20 -z-10"
            />
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-purple-200/20 -z-10"
            />
          </>
        )}
      </div>
    </div>
  );
}

