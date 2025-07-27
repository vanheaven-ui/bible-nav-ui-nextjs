// src/app/page.tsx
// This is the main homepage of your Bible Nav application using the App Router.

"use client"; // This component uses client-side hooks like useState, useEffect, useRouter
import React, { useState, useEffect } from "react";
import Link from "next/link"; // Import Link for navigation
import { fetchVerseOfTheDay } from "../lib/bibleApi";
import { useAuthStore } from "../store/authStore"; // Import the Zustand auth store

interface VerseData {
  text: string;
  reference: string;
  version: string;
}

const HomePage: React.FC = () => {
  const [verseOfTheDay, setVerseOfTheDay] = useState<VerseData | null>(null);
  const [loadingVerse, setLoadingVerse] = useState<boolean>(true);
  const [verseError, setVerseError] = useState<string | null>(null);

  const { isAuthenticated, user } = useAuthStore();

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
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="min-h-screen flex flex-col items-center justify-between">
      {/* Header/Navigation is now handled by src/app/layout.tsx */}

      <main className="flex flex-col items-center justify-center flex-1 w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-blue-800 leading-tight animate-fade-in-down">
          Welcome to <span className="text-yellow-600">Bible Nav</span>!
        </h1>

        <p className="mt-4 text-xl sm:text-2xl text-gray-700 animate-fade-in-up">
          Your journey through the scriptures begins here.
        </p>

        {/* Verse of the Day Section */}
        <section className="mt-12 p-8 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-xl max-w-xl w-full text-center border border-blue-200 animate-fade-in">
          <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center justify-center gap-2">
            <svg
              xmlns="http://www.w3.org/2500/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-7 h-7 text-yellow-600"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6a.75.75 0 0 0 .054.24l2.25 2.815a.75.75 0 1 0 1.196-.952L13.5 11.25V6Z"
                clipRule="evenodd"
              />
            </svg>
            Verse of the Day
          </h2>
          {loadingVerse ? (
            <p className="text-lg italic text-gray-600">Loading verse...</p>
          ) : verseError ? (
            <p className="text-lg italic text-red-500">{verseError}</p>
          ) : verseOfTheDay ? (
            <>
              <p className="text-lg italic text-gray-800 leading-relaxed">
                &quot;{verseOfTheDay.text}&quot;
              </p>
              <p className="text-sm text-gray-600 mt-3">
                - {verseOfTheDay.reference} ({verseOfTheDay.version})
              </p>
            </>
          ) : (
            <p className="text-lg italic text-gray-600">
              No verse available today.
            </p>
          )}
        </section>

        {/* Feature Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          <Link
            href="/books"
            className="group p-8 bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1"
          >
            <h3 className="text-2xl font-bold text-blue-700 group-hover:text-blue-800 transition-colors">
              Explore Books{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                &rarr;
              </span>
            </h3>
            <p className="mt-4 text-lg text-gray-600">
              Find any book, chapter, or verse in the Bible with ease.
            </p>
          </Link>

          <Link
            href="/favorites"
            className="group p-8 bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl hover:border-yellow-300 transition-all duration-300 transform hover:-translate-y-1"
          >
            <h3 className="text-2xl font-bold text-yellow-600 group-hover:text-yellow-700 transition-colors">
              Manage Favorites{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                &rarr;
              </span>
            </h3>
            <p className="mt-4 text-lg text-gray-600">
              Keep track of your most cherished verses and revisit them anytime.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
