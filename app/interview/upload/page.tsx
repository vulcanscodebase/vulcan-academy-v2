"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  X,
  FileText,
  Briefcase,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Shield,
  Award,
  Clock,
  GraduationCap,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/(layout-wrapper)/navbar";

export default function ResumeUpload() {
  const router = useRouter();
  const [fileName, setFileName] = useState<string | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredRoles, setFilteredRoles] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mode, setMode] = useState<"basic" | "advanced">("basic");
  const [qualification, setQualification] = useState<string>("")
  const [selectedDegreeKey, setSelectedDegreeKey] = useState<string | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      // Check if user is authenticated (customize based on your auth system)
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/signin");
        return;
      }
      setIsAuthenticated(true);
      setIsLoaded(true);
    };
    checkAuth();
  }, [router]);

  const allJobRoles = [
    "Frontend Developer",
    "Backend Developer",
    "UX Designer",
    "Marketing",
    "Sales Executive",
    "Business Analyst",
    "Digital Marketing",
    "Customer Service",
    "Accountant",
    "Teacher",
    "General",
    "Project Management",
    "Civil Engineering",
    "Mechanical Engineering",
    "Electrical Engineering",
    "Electronics and Communication (Embedded Systems and IoT)",
    "Assistant Professor Accounting",
    "Assistant Professor Marketing",
    "Assistant Professor HR", 
  ];

  const degreeOptions: Array<{ key: string; label: string }> = [
    { key: "BE_BTECH_ME_MTECH", label: "BE / BTech / ME / MTech" },
    { key: "BBA_MBA", label: "BBA / MBA" },
    { key: "BCOM_MCOM", label: "BCom / MCom" },
    { key: "BA_MA", label: "BA / MA" },
    { key: "BSC_MSC", label: "BSc / MSc" },
    { key: "OTHERS", label: "Others (Any Graduate)" },
  ]

  const BBA_MBA_AND_BCOM_MCOM_ROLES = [
    "Marketing",
    "Sales Executive",
    "Business Analyst",
    "Digital Marketing",
    "Accountant",
    "Customer Service",
    "Assistant Professor Accounting",
    "Assistant Professor Marketing",
    "Assistant Professor HR",
  ]

  const DEGREE_ROLE_MAP: Record<string, string[]> = {
    BE_BTECH_ME_MTECH: ["Frontend Developer", "Backend Developer", "UX Designer", "Civil Engineering",
      "Mechanical Engineering", "Electrical Engineering", "Electronics and Communication (Embedded Systems and IoT)"],
    BBA_MBA: BBA_MBA_AND_BCOM_MCOM_ROLES,
    BCOM_MCOM: BBA_MBA_AND_BCOM_MCOM_ROLES,
    BA_MA: ["Teacher", "Marketing", "Customer Service"],
    BSC_MSC: ["Business Analyst", "Accountant"],
    OTHERS: ["Customer Service", "Sales Executive", "Marketing", "Project Management"],
  }

  const unique = (arr: string[]) => Array.from(new Set(arr))


  function getPrioritizedRoles(searchTerm = ""): string[] {
    const term = searchTerm.trim().toLowerCase()
    const relevant = selectedDegreeKey ? DEGREE_ROLE_MAP[selectedDegreeKey] || [] : []

    const baseOrder = unique([...relevant, "General", "Teacher"]).filter((role) => allJobRoles.includes(role as typeof allJobRoles[number]))
    const rest = allJobRoles.filter((role) => !baseOrder.includes(role))
    const ordered = [...baseOrder, ...rest]
    const filtered = term ? ordered.filter((r) => r.toLowerCase().includes(term)) : ordered

    return filtered
  }


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setJobTitle(value);
    if (value.length > 0) {
      const matches = allJobRoles.filter((role) =>
        role.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredRoles(matches);
      setShowDropdown(matches.length > 0);
    } else {
      setShowDropdown(false);
    }
  };

  const handleSelectRole = (role: string) => {
    setJobTitle(role);
    setShowDropdown(false);
  };


  const handleSelectDegree = (key: string) => {
    const nextKey = selectedDegreeKey === key ? null : key
    setSelectedDegreeKey(nextKey)
    const matches = getPrioritizedRoles(jobTitle)
    setFilteredRoles(matches)
    setShowDropdown(false) 
  }


  const handleFocusRoles = () => {
    const ordered = getPrioritizedRoles(jobTitle)
    setFilteredRoles(ordered)
    setShowDropdown(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setSelectedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setFileName(file.name);
      setSelectedFile(file);
    }
  };

  const clearFile = () => {
    setFileName(null);
    setSelectedFile(null);
  };

  const isFormValid = jobTitle.trim() !== "" && fileName !== null;

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!isFormValid || !isAuthenticated) {
      alert("Form is incomplete or you are not authenticated.");
      return;
    }

    if (!selectedFile) {
      alert("Please select a PDF file before submitting.");
      return;
    }

    if (!(selectedFile instanceof File)) {
      alert("Invalid file object. Please re-upload your PDF.");
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      alert("Only PDF files are supported.");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (selectedFile.size > maxSize) {
      alert("File size exceeds 5MB limit.");
      return;
    }

    setIsSubmitting(true);

    try {
      localStorage.setItem("jobTitle", jobTitle);
      localStorage.setItem("interviewMode", mode);

      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("/api/extract-pdf", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (!res.ok)
        throw new Error(result.error || "Failed to extract PDF text");

      const endpoint =
        jobTitle.toLowerCase() === "general"
          ? "/api/resumeEvagen"
          : "/api/resumeEva";

      const evalRes = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: result.text,
          jobTitle: jobTitle,
        }),
      });

      const evalResult = await evalRes.json();
      if (!evalRes.ok)
        throw new Error(evalResult.error || "Failed to evaluate resume");

      const evaluation = evalResult.evaluation;
      localStorage.setItem("atsScore", evaluation.atsScore.toString());
      localStorage.setItem("resumeTips", JSON.stringify(evaluation.tips));
      localStorage.setItem("resumeText", result.text);
      localStorage.setItem("resumeFileName", selectedFile.name);

      const isGeneral = jobTitle.toLowerCase() === "general";

      if (isGeneral) {
        const followUpArr = Array.isArray(evaluation.followUpQuestions)
          ? evaluation.followUpQuestions.filter(
              (q: unknown) =>
                typeof q === "string" &&
                q.trim() !== "" &&
                q !== "undefined" &&
                q !== "null"
            )
          : [];
        const technicalArr = Array.isArray(evaluation.technicalQuestions)
          ? evaluation.technicalQuestions.filter(
              (q: unknown) =>
                typeof q === "string" &&
                q.trim() !== "" &&
                q !== "undefined" &&
                q !== "null"
            )
          : [];

        localStorage.setItem("followUpQuestions", JSON.stringify(followUpArr));
        localStorage.setItem(
          "technicalQuestions",
          JSON.stringify(technicalArr)
        );

        if (followUpArr[0]) {
          localStorage.setItem("followUpQuestion", followUpArr[0]);
        } else {
          localStorage.removeItem("followUpQuestion");
        }
        if (technicalArr[0]) {
          localStorage.setItem("technicalQuestion", technicalArr[0]);
        } else {
          localStorage.removeItem("technicalQuestion");
        }
      } else {
        if (typeof evaluation.followUpQuestion === "string") {
          localStorage.setItem("followUpQuestion", evaluation.followUpQuestion);
        }
        localStorage.removeItem("followUpQuestions");
      }

      // ✅ Start interview and deduct license when user proceeds after resume upload
      const backendUrl = process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:5000";
      const startInterviewRes = await fetch(`${backendUrl}/interviews/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          jobRole: jobTitle,
          resumeText: result.text,
          resumeFileName: selectedFile.name,
          resumeEvaluation: evaluation,
        }),
      });

      if (!startInterviewRes.ok) {
        const errorData = await startInterviewRes.json();
        throw new Error(errorData.message || "Failed to start interview. License may be insufficient.");
      }

      const startInterviewData = await startInterviewRes.json();
      localStorage.setItem("interviewId", startInterviewData.interview._id);

      setTimeout(() => {
        router.push("/interview/ai/instructions");
      }, 500);
    } catch (error: unknown) {
      console.error("Submission error:", error);
      alert("Something went wrong while processing the resume.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600">
            Verifying authentication...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Navbar />

      <div className="pt-16 sm:pt-24 pb-8 sm:pb-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center mb-8 sm:mb-12"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 sm:mb-6">
              Let&apos;s Begin Your
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Interview Journey
              </span>
            </h1>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
              Upload your resume and tell us about your dream role. Our
              intelligent system will create a personalized interview experience
              just for you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200/20 p-4 sm:p-8 md:p-12"
          >
            <div className="mb-6 sm:mb-8">
              <label className="block text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2" />
                Select your graduation degree
              </label>

              <div className="relative">
                <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2">
                  {degreeOptions.map((deg) => {
                    const selected = selectedDegreeKey === deg.key
                    return (
                      <button
                        type="button"
                        key={deg.key}
                        onClick={() => handleSelectDegree(deg.key)}
                        className={`whitespace-nowrap px-3 sm:px-4 py-2 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium transition-all duration-200 border ${
                          selected
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow"
                            : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                        }`}
                        title={deg.label}
                      >
                        {deg.label}
                      </button>
                    )
                  })}
                </div>
                <p className="mt-2 text-xs sm:text-sm text-gray-500 flex items-center">
                  <Info className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Relevant roles will be shown first based on your selection.
                </p>
              </div>
            </div>

            {/* Job Title Input */}
            <div className="mb-6 sm:mb-8">
              <label className="block text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2" />
                What role are you interviewing for?
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div ref={wrapperRef} className="relative">
                <div className="relative">
                  <Briefcase className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <Input
                    type="text"
                    placeholder={
                      qualification ? "e.g., Frontend Developer, Product Manager..." : "Select qualification first"
                    }
                    value={jobTitle}
                    onChange={handleInputChange}
                    onFocus={handleFocusRoles}
                    className="pl-10 sm:pl-12 h-12 sm:h-14 text-sm sm:text-lg rounded-xl sm:rounded-2xl border-2 border-gray-200 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                  />
                </div>

                {!selectedDegreeKey && (
                  <p className="mt-2 text-xs sm:text-sm text-gray-500">
                    Please select your qualification to see relevant roles.
                  </p>
                )}

                <AnimatePresence>
                  {showDropdown && selectedDegreeKey && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-10 mt-2 w-full bg-white/90 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl border border-gray-200/20 max-h-48 sm:max-h-60 overflow-auto"
                    >
                      {filteredRoles.map((role, index) => (
                        <motion.div
                          key={`${role}-${index}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.02 }}
                          onClick={() => handleSelectRole(role)}
                          className="px-3 sm:px-4 py-2 sm:py-3 hover:bg-blue-50 cursor-pointer transition-colors text-sm sm:text-base text-gray-700 border-b border-gray-100 last:border-b-0 first:rounded-t-xl sm:first:rounded-t-2xl last:rounded-b-xl sm:last:rounded-b-2xl"
                        >
                          {role}
                        </motion.div>
                      ))}
                      {filteredRoles.length === 0 && (
                        <div className="px-3 sm:px-4 py-3 text-sm text-gray-500">No roles match your search.</div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-6">
            <label className="block text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
              Select the mode of interview preparation
          </label>

          <div className="flex items-center space-x-4">

            <Button
              type="button"
              variant="default"
              onClick={() => setMode("basic")}
              className={
              mode === "basic"
              ? "px-4 py-2 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:opacity-90"
              : "px-4 py-2 text-sm sm:text-base border border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
            }
            >
            Basic
           </Button>

          <Button
            type="button"
            variant="default"
            onClick={() => setMode("advanced")}
            className={
            mode === "advanced"
            ? "px-4 py-2 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:opacity-90"
            : "px-4 py-2 text-sm sm:text-base border border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
            }
          >
          Advanced
          </Button>

            </div>

              <p className="mt-2 text-xs sm:text-sm text-gray-500">
              {mode === "basic"
              ? "Basic mode gives a simple interview preparation flow."
              : "Advanced mode has tougher questions to test your skills."}
              </p>
            </div>


            <div className="mb-6 sm:mb-8">
              <label className="block text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2" />
                Upload your resume
                <span className="text-red-500 ml-1">*</span>
              </label>

              <div
                className={`relative border-2 border-dashed rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-center transition-all duration-300 ${
                  isDragOver
                    ? "border-blue-500 bg-blue-50"
                    : fileName
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/50"
                }`}
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
              >
                <AnimatePresence mode="wait">
                  {!fileName ? (
                    <motion.div
                      key="upload"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="space-y-3 sm:space-y-4"
                    >
                      <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center">
                        <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <div>
                        <p className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                          Drop your resume here
                        </p>
                        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                          or click to browse your files
                        </p>
                        <input
                          type="file"
                          id="resumeUpload"
                          className="hidden"
                          accept=".pdf"
                          onChange={handleFileChange}
                        />
                        <Button
                          type="button"
                          onClick={() =>
                            document.getElementById("resumeUpload")?.click()
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                          Choose File
                        </Button>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500">
                        PDF format, max 5MB
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="uploaded"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="space-y-3 sm:space-y-4"
                    >
                      <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-green-500 rounded-xl sm:rounded-2xl flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <div className="flex items-center justify-center space-x-3 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm">
                        <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                        <span className="font-medium text-gray-900 text-sm sm:text-base truncate max-w-48 sm:max-w-none">
                          {fileName}
                        </span>
                        <button
                          onClick={clearFile}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                      <p className="text-green-600 font-medium text-sm sm:text-base">
                        Resume uploaded successfully!
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gray-50/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200/20">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2" />
                Requirements
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <span>PDF format only</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <span>Maximum 5MB file size</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <span>Include complete work history</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <span>List relevant skills and achievements</span>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}
                className={`w-full h-12 sm:h-14 text-sm sm:text-lg font-semibold rounded-xl sm:rounded-2xl transition-all duration-300 ${
                  isFormValid && !isSubmitting
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Processing Resume...
                  </div>
                ) : isFormValid ? (
                  <>
                    <span className="hidden sm:inline">
                      Continue to Interview Setup
                    </span>
                    <span className="sm:hidden">Continue</span>
                    <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </>
                ) : (
                  "Please complete all fields"
                )}
              </Button>
            </motion.div>

            <p className="text-center text-xs sm:text-sm text-gray-500 mt-4 sm:mt-6 flex items-center justify-center">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Your information is secure and will only be used for interview
              preparation.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

