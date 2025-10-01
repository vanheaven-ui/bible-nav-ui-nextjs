"use client";

import { searchBibleVerses, SearchResult } from "@/lib/bibleApi";
import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce the query to reduce API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      if (!query.trim()) {
        setResults([]);
        setError(null);
        setLoading(false);
        return;
      }

      const fetchResults = async () => {
        setLoading(true);
        setError(null);

        try {
          const data = await searchBibleVerses(query.trim());
          if (data.length === 0) {
            setError("No results found. Try another search.");
          }
          setResults(data);
        } catch (err: unknown) {
          console.error("Search failed:", err);
          setError("Failed to search. Please try again later.");
          setResults([]);
        } finally {
          setLoading(false);
        }
      };

      fetchResults();
    }, 500); // 500ms debounce

    return () => clearTimeout(handler);
  }, [query]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f9f5e7] text-[#2d2a26] p-6 md:p-10 flex flex-col md:flex-row gap-8">
      {/* Background parchment + glow */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/parchment-bg.png')" }}
      ></div>
      <div className="absolute inset-0 -z-10 bg-[#f9f5e7]/85"></div>
      <div className="absolute top-1/4 left-1/3 w-[30vw] h-[30vw] rounded-full bg-[#d4af37]/20 blur-[120px] -z-0"></div>
      <div className="absolute bottom-1/4 right-1/3 w-[35vw] h-[35vw] rounded-full bg-[#a4161a]/20 blur-[150px] -z-0"></div>

      {/* Left Column: Search */}
      <div className="relative z-10 w-full md:w-1/2 flex flex-col gap-6">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-[#6b705c] drop-shadow-md">
          Quick Search
        </h1>
        <p className="text-lg md:text-xl text-[#495057] font-light">
          Find a verse instantly by typing a keyword, book, or passage.
        </p>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. John 3:16"
          className="flex-1 p-4 rounded-2xl border border-[#6b705c]/30 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-lg"
        />

        {error && (
          <p className="text-[#a4161a] mt-4 text-center md:text-left">
            {error}
          </p>
        )}
      </div>

      {/* Right Column: Results */}
      <div className="relative z-10 w-full md:w-1/2 max-h-[80vh] overflow-y-auto">
        <section className="bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl border border-[#6b705c]/20 transition-all duration-500">
          {loading && (
            <div className="flex justify-center mt-4">
              <Loader2 className="w-6 h-6 animate-spin text-[#a4161a]" />
            </div>
          )}

          {!loading && results.length === 0 && !error && (
            <p className="text-[#6b705c] text-center italic">
              Try searching for a verse.
            </p>
          )}

          {results.length > 0 && !error && (
            <ul className="space-y-6">
              {results.map((r, idx) => (
                <li
                  key={idx}
                  className="p-4 rounded-xl border border-[#6b705c]/30 hover:bg-[#f1ede2] transition-colors"
                >
                  <p className="font-serif text-lg md:text-xl italic leading-relaxed">
                    &quot;{r.text}&quot;
                  </p>
                  <p className="mt-2 text-sm font-sans text-[#495057] not-italic">
                    - {r.book} {r.chapter}:{r.verse}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default SearchPage;
