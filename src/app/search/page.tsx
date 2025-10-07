"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { searchBibleVerses, SearchResult } from "@/lib/bibleApi";
import { Loader2, Search, Zap, Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Helper for generating varied grid spans
const getCardSpan = (textLength: number): string => {
  if (textLength < 60) return "col-span-full sm:col-span-3 lg:col-span-2"; // Smallest: 2 units wide
  if (textLength < 120) return "col-span-full sm:col-span-3 lg:col-span-3"; // Medium: 3 units wide
  return "col-span-full sm:col-span-6 lg:col-span-4"; // Largest: 4 units wide
};

const getCardHeight = (textLength: number): string => {
  if (textLength < 60) return "min-h-[7rem]";
  if (textLength < 120) return "min-h-[10rem]";
  return "min-h-[14rem]";
};

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // Debounced search effect
  useEffect(() => {
    const timeout = setTimeout(async () => {
      const trimmed = query.trim();
      if (!trimmed) {
        setResults([]);
        setError(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        let data: SearchResult[] = [];

        // Logic for "Book Chapter:Verse" or "Book Chapter"
        const chapterVerseMatch = trimmed.match(
          /^([A-Za-z]+)\s+(\d+)(?::(\d+))?$/
        );

        if (chapterVerseMatch) {
          const book = chapterVerseMatch[1];
          const chapter = parseInt(chapterVerseMatch[2]);
          const verse = chapterVerseMatch[3]
            ? parseInt(chapterVerseMatch[3])
            : undefined;

          // Attempt to handle full name books like "1 Corinthians"
          const fullQuery = trimmed;

          if (verse) {
            data = await searchBibleVerses(fullQuery);
          } else {
            data = await searchBibleVerses(fullQuery);
          }
        } else {
          // fallback: regular search (word search)
          data = await searchBibleVerses(trimmed);
        }

        if (!data.length)
          setError("No results found for this reference or keyword.");
        setResults(data);
      } catch (err) {
        console.error("Search failed:", err);
        setError("Something went wrong with the connection. Please try again.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleVerseClick = (verse: SearchResult) => {
    // Navigate to the chapter page and scroll to the verse
    router.push(
      `/books/${encodeURIComponent(verse.book)}/${verse.chapter}?verse=${
        verse.verse
      }`
    );
  };

  return (
    <div className="relative min-h-screen bg-[#f9f5e7] text-[#2d2a26] p-4 md:p-8 pt-24 md:pt-32 overflow-hidden">
      {/* Background (Z-index: -20 to -0) */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/parchment-bg.png')" }}
      />
      <div className="absolute inset-0 -z-10 bg-[#f9f5e7]/85" />
      <div className="absolute top-1/4 left-1/3 w-[30vw] h-[30vw] rounded-full bg-[#d4af37]/20 blur-[120px] -z-0" />
      <div className="absolute bottom-1/4 right-1/3 w-[35vw] h-[35vw] rounded-full bg-[#a4161a]/20 blur-[150px] -z-0" />

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Decorative Header (Shown only when no results) */}
        {results.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-16 mt-0 sm:mt-8"
          >
            <h1 className="text-4xl sm:text-6xl font-extrabold text-[#6b705c] drop-shadow-md inline-flex items-center">
              The Scripture Compass
              <Compass className="w-10 h-10 ml-4 text-[#d4af37]" />
            </h1>
            <p className="mt-2 text-xl italic text-[#a4161a]">
              Navigate the text, verse by verse.
            </p>
          </motion.div>
        )}

        {/* Search Bar (Sticky) */}
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 700, damping: 40 }}
          className="sticky top-4 z-20 p-3 bg-white/95 backdrop-blur-xl rounded-[3rem] shadow-2xl border border-[#6b705c]/10 max-w-3xl mx-auto"
        >
          <div className="flex w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a4161a]" />
            <input
              type="text"
              aria-label="Search for a Bible verse (e.g., John 3 or John 3:16)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by reference (e.g., John 3:16) or keywords"
              className="flex-1 p-4 pl-12 rounded-full border border-[#6b705c]/30 shadow-md focus:outline-none focus:ring-4 focus:ring-[#a4161a]/40 text-lg text-[#2d2a26]"
            />
          </div>
        </motion.div>

        {/* Search Results / Status */}
        <section className="mt-12 pt-4">
          <div className="min-h-[20vh] flex flex-col items-center justify-center">
            {/* Loading Status */}
            {loading && (
              <div className="flex justify-center my-12">
                <Loader2 className="w-10 h-10 animate-spin text-[#a4161a]" />
                <p className="ml-3 text-xl text-[#6b705c] font-semibold">
                  Fetching your scripture...
                </p>
              </div>
            )}

            {/* Error Status */}
            {!loading && error && (
              <p className="text-[#a4161a] mt-8 text-center text-lg p-4 bg-[#ffe6e6]/70 rounded-xl border border-[#a4161a]/50 max-w-lg mx-auto">
                {error}
              </p>
            )}

            {/* Initial Placeholder */}
            {!loading && !error && results.length === 0 && !query && (
              <p className="text-[#6b705c] text-center italic mt-8 text-xl max-w-lg mx-auto">
                Start your journey by typing a reference (e.g., **John 3**) or a
                keyword.
              </p>
            )}
          </div>

          {/* Verse Cards Container */}
          <AnimatePresence>
            {results.length > 0 && (
              <motion.ul
                // KEY CHANGE: Use a 6-column grid with auto-rows-max for masonry effect
                className="grid grid-cols-6 gap-6 mt-8 auto-rows-max"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {results.map((r, idx) => (
                  <motion.li
                    key={`${r.book}-${r.chapter}-${r.verse}-${idx}`}
                    initial={{ opacity: 0, scale: 0.7, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      type: "spring",
                      stiffness: 150,
                      damping: 15,
                      delay: idx * 0.03,
                    }}
                    onClick={() => handleVerseClick(r)}
                    // KEY CHANGE: Dynamically apply span and height classes
                    className={`${getCardSpan(r.text.length)} ${getCardHeight(
                      r.text.length
                    )}
                                        group p-5 rounded-xl shadow-lg border border-[#6b705c]/10 bg-white/70 backdrop-blur-sm
                                        cursor-pointer hover:shadow-2xl hover:border-[#d4af37] transition-all duration-300
                                        transform hover:scale-[1.03] flex flex-col justify-between`}
                  >
                    <p className="font-serif text-base italic leading-snug text-[#2d2a26] overflow-hidden">
                      {r.text}
                    </p>
                    <div className="mt-4 pt-2 border-t border-[#d4af37]/50 flex justify-end">
                      <span className="text-xs font-sans text-[#a4161a] font-bold">
                        {r.book} {r.chapter}:{r.verse}
                      </span>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
};

export default SearchPage;
