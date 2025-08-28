"use client";

import { searchBibleVerses, SearchResult } from "@/lib/bibleApi";
import React, { useState } from "react";

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = query.trim();
    if (!cleanQuery) return;

    setLoading(true);
    setError(null);

    try {
      const data = await searchBibleVerses(cleanQuery);
      if (data.length === 0) {
        setError("No results found. Try another search.");
      }
      setResults(data);
    } catch (err) {
      setError("Failed to search. Please try again later.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 md:p-10 text-gray-800 bg-gray-50">
      <main className="w-full max-w-3xl">
        <header className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-blue-800 drop-shadow-md">
            Quick Search
          </h1>
          <p className="mt-3 text-lg md:text-xl text-gray-600 font-light">
            Find a verse instantly by typing a keyword, book, or passage.
          </p>
        </header>

        {/* Search Form */}
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row items-center gap-3 mb-10"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. John 3:16"
            className="flex-1 p-4 rounded-2xl border border-gray-300 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-200 text-lg"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-4 bg-blue-600 text-white font-semibold rounded-2xl shadow-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {/* Results Section */}
        <section className="bg-white p-8 rounded-3xl shadow-2xl ring-4 ring-blue-100 ring-opacity-50 transition-all duration-500 hover:scale-[1.01]">
          {error && <p className="text-red-500 text-center">{error}</p>}

          {results.length > 0 && !error && (
            <ul className="space-y-6">
              {results.map((r, idx) => (
                <li
                  key={idx}
                  className="p-4 rounded-xl border border-blue-200 hover:bg-blue-50 transition-colors"
                >
                  <p className="font-serif text-lg md:text-xl italic text-gray-800 leading-relaxed">
                    &quot;{r.text}&quot;
                  </p>
                  <p className="mt-2 text-sm font-sans text-gray-500 not-italic">
                    - {r.book} {r.chapter}:{r.verse}
                  </p>
                </li>
              ))}
            </ul>
          )}

          {!loading && results.length === 0 && !error && (
            <p className="text-gray-400 text-center italic">
              Try searching for a verse above.
            </p>
          )}
        </section>
      </main>
    </div>
  );
};

export default SearchPage;
