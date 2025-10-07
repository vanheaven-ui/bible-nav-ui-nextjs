// frontend/src/app/not-found.tsx (or 404.tsx in older Next.js)

"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Search, Home, Frown } from "lucide-react";

const NotFoundPage: React.FC = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden text-[#2d2a26]">
      {/* Background parchment and soft glows (Consistent Theme) */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/parchment-bg.png')" }}
      />
      <div className="absolute inset-0 -z-10 bg-[#f9f5e7]/85" />
      <div className="absolute top-1/4 left-1/4 w-[35vw] h-[35vw] rounded-full bg-[#d4af37]/20 blur-[150px] -z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] rounded-full bg-[#a4161a]/15 blur-[180px] -z-0"></div>

      {/* Main Content Card with Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
        className="relative z-10 p-10 sm:p-16 max-w-2xl w-full text-center 
                   bg-white/80 backdrop-blur-md rounded-3xl shadow-3xl 
                   border-4 border-double border-[#d4af37]/70"
      >
        {/* Title/Error Code */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-9xl font-extrabold text-[#a4161a] drop-shadow-md"
        >
          404
        </motion.h1>

        {/* Thematic Message */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#6b705c] mt-4 mb-4 leading-snug">
          The Scroll is <span className="text-[#a4161a]">Unwritten</span> Here
        </h2>
        <p className="text-lg font-light text-[#495057] mb-8">
          Alas, this verse or chapter does not exist in our current Scripture
          Canvas. The path you sought appears to be an apocryphal route.
        </p>

        {/* Suggested Actions (Modern Grid Layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          {/* Action 1: Go Home */}
          <Link
            href="/"
            className="flex flex-col items-center p-4 rounded-xl border border-[#6b705c]/20 bg-[#f9f5e7] hover:bg-[#d4af37]/20 transition-all shadow-md hover:shadow-lg group"
          >
            <Home className="w-8 h-8 text-[#6b705c] group-hover:text-[#d4af37]" />
            <span className="mt-2 text-sm font-semibold text-[#6b705c]">
              Go to Homepage
            </span>
          </Link>

          {/* Action 2: Start a Search */}
          <Link
            href="/search"
            className="flex flex-col items-center p-4 rounded-xl border border-[#6b705c]/20 bg-[#f9f5e7] hover:bg-[#a4161a]/20 transition-all shadow-md hover:shadow-lg group"
          >
            <Search className="w-8 h-8 text-[#6b705c] group-hover:text-[#a4161a]" />
            <span className="mt-2 text-sm font-semibold text-[#6b705c]">
              Start a New Search
            </span>
          </Link>

          {/* Action 3: Explore Books */}
          <Link
            href="/books"
            className="flex flex-col items-center p-4 rounded-xl border border-[#6b705c]/20 bg-[#f9f5e7] hover:bg-[#6b705c]/20 transition-all shadow-md hover:shadow-lg group"
          >
            <BookOpen className="w-8 h-8 text-[#6b705c] group-hover:text-[#6b705c]" />
            <span className="mt-2 text-sm font-semibold text-[#6b705c]">
              Explore Bible Books
            </span>
          </Link>
        </div>

        <p className="mt-8 text-xs text-[#6b705c]/70 flex items-center justify-center italic">
          <Frown className="w-3 h-3 mr-1" /> If you believe this is an error,
          please check the URL or contact support.
        </p>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
