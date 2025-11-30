"use client";

import { Footer } from "@/components/(layout-wrapper)/footer";
import { CourseSection } from "@/components/(interview-master)/coursessection";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sparkles, Target, Award, TrendingUp, Upload, Lock } from "lucide-react";

export default function InterviewPage(){
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
      setIsChecking(false);
      
      // If authenticated, redirect to upload page directly
      if (token) {
        router.push("/interview/upload");
      }
    }, [router]);

    const handleStartInterview = () => {
      if (!isAuthenticated) {
        alert("Please sign in to access the AI Interview Master");
        router.push("/signin");
        return;
      }
      router.push("/interview/upload");
    };

    // Show loading while checking auth
    if (isChecking) {
      return (
        <div className="min-h-screen pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    // Show login required message if not authenticated
    if (!isAuthenticated) {
      return (
        <>
          <section className="relative w-full pt-28 pb-16 md:pt-32 md:pb-24 lg:pt-36 lg:pb-32 bg-gradient-to-br from-gray-50 via-white to-blue-50 min-h-screen flex items-center">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <Lock className="w-12 h-12 text-white" />
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                  Vulcan Interview
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ml-3">
                    Master
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 mb-8">
                  Please sign in to access the Vulcan Interview Master and start your practice interviews.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => router.push("/signin")}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Sign In to Continue
                  </Button>
                  
                  <Button
                    onClick={() => router.push("/signup")}
                    variant="outline"
                    className="px-8 py-6 rounded-2xl text-lg font-semibold border-2"
                  >
                    Create Account
                  </Button>
                </div>

                {/* Features Preview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/20">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Personalized Questions</h3>
                    <p className="text-gray-600 text-sm">
                      Get tailored interview questions based on your resume and target role
                    </p>
                  </div>

                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/20">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Real-time Feedback</h3>
                    <p className="text-gray-600 text-sm">
                      Receive instant analysis on your answers, body language, and communication
                    </p>
                  </div>

                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/20">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
                    <p className="text-gray-600 text-sm">
                      Monitor your improvement with detailed performance reports
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      );
    }

    // If authenticated, this won't show because of redirect above
    return null;

    return(
        <>
        {/* Hero Section */}
        <section className="relative w-full py-16 md:py-24 lg:py-32 bg-gradient-to-br from-gray-50 via-white to-blue-50">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                  AI Interview
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ml-3">
                    Master
                  </span>
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                  Practice with our AI-powered interview system. Get real-time feedback, 
                  improve your skills, and ace your next interview with confidence.
                </p>
                
                <Button
                  onClick={handleStartInterview}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start AI Interview
                </Button>
              </div>

              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl mb-12">
                <Image
                  src="/hero-section.png"
                  alt="Vulcan Interview Master"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/20">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Personalized Questions</h3>
                  <p className="text-gray-600">
                    Get tailored interview questions based on your resume and target role
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/20">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Real-time Feedback</h3>
                  <p className="text-gray-600">
                    Receive instant analysis on your answers, body language, and communication
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/20">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
                  <p className="text-gray-600">
                    Monitor your improvement with detailed performance reports
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <CourseSection />
        <Footer />
        </>
    )
}