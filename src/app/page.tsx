"use client";

import React, { useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useAuthStore } from "../store/authStore";
import useVerse from "@/hooks/useVerse";

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { verseData, loading, error, refreshVerse } = useVerse();
  const contentRef = useRef<HTMLDivElement>(null);
  // State to control the unique candle flicker animation
  const [isFlickering, setIsFlickering] = useState(false);

  const featureCards = [
    {
      href: "/books",
      title: "Explore Books",
      description: "Find any book, chapter, or verse with ease.",
      color: "bg-[#6b705c]/30",
      accent: "text-[#6b705c]",
      icon: "📜",
      authRequired: false,
    },
    {
      href: "/favorites",
      title: "Manage Favorites",
      description:
        "Keep track of your most cherished verses and revisit them anytime.",
      color: "bg-[#a4161a]/30",
      accent: "text-[#a4161a]",
      icon: "❤️",
      authRequired: false,
    },
    {
      href: "/search",
      title: "Quick Search",
      description: "Find a specific verse or passage quickly.",
      color: "bg-[#d4af37]/30",
      accent: "text-[#d4af37]",
      icon: "🔍",
      authRequired: true,
    },
  ];

  const scrollToContent = () => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Unique Refresh Function
  const handleRefreshVerse = useCallback(() => {
    // Prevent multiple clicks while loading or animating
    if (loading || isFlickering) return;

    // 1. Start the unique visual feedback (Flickering)
    setIsFlickering(true);

    // 2. Refresh the verse data after a brief delay
    // The delay allows the user to see the "candle" light up/flicker
    setTimeout(() => {
      refreshVerse();

      // 3. Stop flickering animation
      setIsFlickering(false);
    }, 800);
  }, [loading, isFlickering, refreshVerse]);

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden text-[#2d2a26]">
      {/* Background Image */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/parchment-bg.png')" }}
      ></div>

      {/* Transparent parchment overlay */}
      <div className="absolute inset-0 -z-10 bg-[#f9f5e7]/85"></div>

      {/* Sacred Glow */}
      <div className="absolute inset-0 -z-0">
        <div className="absolute top-1/4 left-1/3 w-[30vw] h-[30vw] rounded-full bg-[#d4af37]/25 blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/3 w-[35vw] h-[35vw] rounded-full bg-[#a4161a]/25 blur-[150px]"></div>
      </div>

      {/* Hero Section: two-column layout */}
      <main className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 px-6 sm:px-10 lg:px-16 py-20 items-center">
        {/* Left side: Heading */}
        <header className="text-left space-y-6">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#6b705c] leading-tight">
            Navigate the{" "}
            <span className="text-[#a4161a]">Sacred Narrative</span>
          </h1>
          <p className="text-lg sm:text-xl font-light text-[#495057] max-w-lg">
            Unlock wisdom, find solace, and guide your spiritual path through
            scripture.
          </p>
        </header>

        {/* Right side: Verse of the Day */}
        <section className="relative bg-gradient-to-br from-[#6b705c]/20 to-[#d4af37]/10 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-[#6b705c]/20">
          <span className="absolute top-4 left-6 text-6xl opacity-10 select-none">
            ❝
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-2 text-[#a4161a]">
            <span className="text-[#d4af37]">🕯️</span>
            Verse of the Day
          </h2>
          <div className="font-serif text-lg md:text-xl italic text-[#2d2a26] leading-relaxed min-h-[8rem] text-center">
            {loading || isFlickering ? (
              <p className="text-[#495057] animate-pulse">
                Lighting the candle for new guidance...
              </p>
            ) : error ? (
              <p className="text-[#a4161a] font-sans">{error}</p>
            ) : verseData ? (
              <>
                <p>&ldquo;{verseData.text}&rdquo;</p>
                <p className="mt-4 text-sm font-sans text-[#6b705c] not-italic">
                  – {verseData.reference} ({verseData.version})
                </p>
              </>
            ) : (
              <p className="text-[#6b705c] font-sans">
                No verse available today.
              </p>
            )}
          </div>

          {/* Sacred Candle Flicker Button (Shown when there is an error or no verse) */}
          {(error || !verseData) && (
            <button
              onClick={handleRefreshVerse}
              disabled={loading || isFlickering}
              className={`
                absolute bottom-4 right-4 p-3 rounded-full shadow-lg transition-all duration-300
                font-bold text-sm flex items-center gap-2
                ${
                  loading || isFlickering
                    ? "bg-[#a4161a]/50 cursor-not-allowed"
                    : "bg-[#d4af37] text-[#2d2a26] hover:bg-[#a4161a] hover:text-white"
                }
                ${isFlickering ? "animate-flicker-pulse" : ""}
              `}
              title="Request a new verse"
            >
              <span
                className={`text-xl ${isFlickering ? "animate-spin-slow" : ""}`}
              >
                🕯️
              </span>
              {error ? "Retry Guidance" : "Find Verse"}
            </button>
          )}
        </section>
      </main>

      {/* CTA Below Hero */}
      <div className="flex justify-center mb-16">
        <button
          onClick={scrollToContent}
          className="relative inline-flex items-center gap-3 px-10 py-2 text-lg font-semibold text-white bg-[#a4161a] rounded-full shadow-xl hover:bg-[#822121] transition-all duration-300"
        >
          Explore Your Journey
          <span className="text-2xl">↓</span>
        </button>
      </div>

      {/* Features Section */}
      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-7xl mx-auto py-20 px-6 sm:px-10 lg:px-16"
      >
        <h2 className="text-4xl font-bold text-center mb-16 text-[#6b705c]">
          Discover Our Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {featureCards
            .filter((card) => !card.authRequired || isAuthenticated)
            .map((card, index) => (
              <Link
                key={card.title}
                href={card.href}
                className={`group relative p-8 rounded-3xl shadow-xl border border-[#6b705c]/20
                  ${card.color} backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="relative z-10">
                  <span className={`text-5xl block`}>{card.icon}</span>
                  <h3 className={`mt-4 text-2xl font-bold ${card.accent}`}>
                    {card.title}
                    <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </h3>
                  <p className="mt-2 text-[#495057]">{card.description}</p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
