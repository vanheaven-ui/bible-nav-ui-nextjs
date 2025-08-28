"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { fetchVerseOfTheDay } from "../lib/bibleApi";
import { useAuthStore } from "../store/authStore";

interface VerseData {
  text: string;
  reference: string;
  version: string;
}

const HomePage: React.FC = () => {
  const [verseOfTheDay, setVerseOfTheDay] = useState<VerseData | null>(null);
  const [loadingVerse, setLoadingVerse] = useState<boolean>(true);
  const [verseError, setVerseError] = useState<string | null>(null);

  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const getVerse = async () => {
      setLoadingVerse(true);
      setVerseError(null);
      const data = await fetchVerseOfTheDay();
      if (data && data.verse && data.verse.details) {
        setVerseOfTheDay({
          text: data.verse.details.text,
          reference: data.verse.details.reference,
          version: data.verse.details.version,
        });
      } else {
        setVerseError(
          "Failed to load Verse of the Day. Please try again later."
        );
      }
      setLoadingVerse(false);
    };

    getVerse();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 text-gray-800">
      <main className="w-full max-w-5xl flex flex-col items-center">
        <header className="text-center mb-12">
          <h1 className="text-6xl sm:text-7xl font-extrabold text-blue-900 drop-shadow-md">
            Welcome to <span className="text-amber-500">Bible Nav</span>
          </h1>
          <p className="mt-3 text-xl md:text-2xl text-gray-600 font-light">
            Your journey through the scriptures begins here.
          </p>
        </header>
        {/* Verse of the Day Section */}
        <section className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl ring-4 ring-blue-100 ring-opacity-50 w-full max-w-xl text-center transition-all duration-500 hover:scale-[1.02] transform">
          <h2 className="text-3xl font-bold text-blue-700 mb-5 flex items-center justify-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-8 h-8 text-amber-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            Verse of the Day
          </h2>
          <div className="font-serif text-lg md:text-xl italic text-gray-800 leading-relaxed min-h-[8rem] flex items-center justify-center">
            {loadingVerse ? (
              <p className="text-gray-500">Loading verse...</p>
            ) : verseError ? (
              <p className="text-red-500">{verseError}</p>
            ) : verseOfTheDay ? (
              <div>
                <p>&quot;{verseOfTheDay.text}&quot;</p>
                <p className="mt-4 text-sm font-sans text-gray-500 not-italic">
                  - {verseOfTheDay.reference} ({verseOfTheDay.version})
                </p>
              </div>
            ) : (
              <p className="text-gray-500">
                No verse available today.
              </p>
            )}
          </div>
        </section>
        {/* Feature Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          <Link href="/books" className="group p-8 bg-white rounded-3xl shadow-lg border border-gray-200 hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
            <h3 className="text-2xl font-bold text-blue-700 group-hover:text-blue-800 transition-colors">
              Explore Books
              <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
            </h3>
            <p className="mt-2 text-gray-600">Find any book, chapter, or verse with ease.</p>
          </Link>
          <Link href="/favorites" className="group p-8 bg-white rounded-3xl shadow-lg border border-gray-200 hover:bg-yellow-50 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
            <h3 className="text-2xl font-bold text-yellow-600 group-hover:text-yellow-700 transition-colors">
              Manage Favorites
              <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
            </h3>
            <p className="mt-2 text-gray-600">Keep track of your most cherished verses and revisit them anytime.</p>
          </Link>
          {isAuthenticated && (
            <Link href="/search" className="group p-8 bg-white rounded-3xl shadow-lg border border-gray-200 hover:bg-green-50 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
              <h3 className="text-2xl font-bold text-green-700 group-hover:text-green-800 transition-colors">
                Quick Search
                <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
              </h3>
              <p className="mt-2 text-gray-600">Find a specific verse or passage quickly.</p>
            </Link>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;