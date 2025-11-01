import React from "react";
import Link from "next/link"; // If using Next.js — if not, use <a>

export function InterviewMaster() {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-semibold py-20">Tests</h1>

      <div className="w-80 border rounded-2xl shadow-md overflow-hidden bg-white">
        {/* Image */}
        <div className="h-40 bg-gray-100 flex items-center justify-center">
          <img
            src="/english360logo.png"
            alt="English 360 logo"
            className="h-32 object-contain"
          />
        </div>

        {/* Content */}
        <div className="p-4 text-center">
          <h2 className="text-lg font-bold mb-2 text-left">English 360</h2>
          <p className="text-gray-600 text-sm mb-3 text-left">
            Welcome to English 360, your comprehensive solution for mastering
            the fundamentals of the English language. Designed for learners of
            all levels...
          </p>
          <p className="font-semibold text-lg mb-3 text-left">₹10</p>

          {/* Buttons */}
          <div className="flex justify-center gap-3">
            <button className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition">
              Know More
            </button>

            <Link
              href="https://vulcans-ai-exp.vercel.app/"
              target="_blank"
              className="bg-green-600 text-white px-9 py-2 rounded-md hover:bg-green-700 transition flex items-center gap-2"
            >
              Buy Now 
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
