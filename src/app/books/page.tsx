"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { fetchBibleBooks, SuperSearchBibleBook } from "../../lib/bibleApi";

const OLD_TESTAMENT_COUNT = 39;

const BooksPage: React.FC = () => {
  const [books, setBooks] = useState<SuperSearchBibleBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedBooks = await fetchBibleBooks();
        if (fetchedBooks?.length) {
          setBooks(fetchedBooks);
        } else {
          setError("No Bible books found.");
        }
      } catch (err: unknown) {
        console.error(err);
        setError(
          err instanceof Error
            ? err.message
            : "Unexpected error while fetching books."
        );
      } finally {
        setLoading(false);
      }
    };
    getBooks();
  }, []);

  const oldTestamentBooks = useMemo(
    () => books.filter((b) => b.id <= OLD_TESTAMENT_COUNT),
    [books]
  );
  const newTestamentBooks = useMemo(
    () => books.filter((b) => b.id > OLD_TESTAMENT_COUNT),
    [books]
  );

  const renderBookPills = (bookList: SuperSearchBibleBook[]) => (
    <div className="w-full">
      {/* Small screens: horizontal scroll */}
      <div className="flex flex-row flex-nowrap gap-4 overflow-x-auto sm:hidden px-2">
        {bookList.map((book) => (
          <Link
            key={book.id}
            href={`/books/${encodeURIComponent(book.name)}`}
            className="
              flex-shrink-0 relative flex flex-col items-center justify-center
              px-4 py-3 min-h-[80px] max-h-[100px] min-w-[100px]
              rounded-3xl font-semibold text-center transition-all duration-500
              bg-[#f9f5e7]/70 text-[#495057] border border-transparent
              shadow-inner hover:shadow-2xl hover:scale-105 overflow-hidden
            "
            title={book.name}
          >
            <span className="absolute inset-0 z-0 rounded-3xl bg-gradient-to-r from-[#d4af37]/30 via-[#a4161a]/15 to-[#6b705c]/20 blur-xl opacity-50"></span>
            <span className="relative z-10 text-lg font-bold text-[#a4161a] truncate w-full">
              {book.name}
            </span>
            <span className="relative z-10 text-xs text-[#6b705c] mt-1 text-center">
              {book.chapters} Chapters
            </span>
          </Link>
        ))}
      </div>

      {/* Medium+ screens: flex-wrap grid */}
      <div className="hidden sm:flex flex-wrap justify-center gap-4 md:gap-6">
        {bookList.map((book) => (
          <Link
            key={book.id}
            href={`/books/${encodeURIComponent(book.name)}`}
            className="
              relative inline-flex flex-col items-center justify-center
              px-5 sm:px-6 py-3 sm:py-4 min-h-[80px] max-h-[100px] max-w-[160px]
              rounded-3xl font-semibold text-center transition-all duration-500
              bg-[#f9f5e7]/70 text-[#495057] border border-transparent
              shadow-inner hover:shadow-2xl hover:scale-105 overflow-hidden
            "
            title={book.name}
          >
            <span className="absolute inset-0 z-0 rounded-3xl bg-gradient-to-r from-[#d4af37]/30 via-[#a4161a]/15 to-[#6b705c]/20 blur-xl opacity-50"></span>
            <span className="relative z-10 text-lg sm:text-xl font-bold text-[#a4161a] truncate w-full">
              {book.name}
            </span>
            <span className="relative z-10 text-sm sm:text-base text-[#6b705c] mt-1">
              {book.chapters} Chapters
            </span>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen flex flex-col text-[#495057]">
      {/* Hero Background */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/parchment-bg.jpg')" }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#f9f5e7]/90 to-[#f9f5e7]/70"></div>

      <div className="relative z-10 flex-1 flex flex-col items-center py-16 px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-7xl w-full p-8 sm:p-12 rounded-xl shadow-xl space-y-12 bg-[#f9f5e7]/50 backdrop-blur-md border border-[#6b705c]/30">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-[#6b705c] mb-6">
            Explore Bible Books
          </h1>

          {loading ? (
            <p className="text-center text-[#495057] text-lg animate-pulse">
              Loading Bible books...
            </p>
          ) : error ? (
            <p className="text-center text-[#a4161a] text-lg">{error}</p>
          ) : books.length === 0 ? (
            <p className="text-center text-[#6b705c] text-lg">
              No books available at this time.
            </p>
          ) : (
            <>
              {/* Old Testament Section */}
              <div className="space-y-6">
                <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#6b705c] relative after:absolute after:w-24 after:h-1 after:bg-[#d4af37] after:left-1/2 after:-translate-x-1/2 after:mt-2">
                  Old Testament
                </h2>
                {renderBookPills(oldTestamentBooks)}
              </div>

              {/* New Testament Section */}
              <div className="space-y-6 mt-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#6b705c] relative after:absolute after:w-24 after:h-1 after:bg-[#d4af37] after:left-1/2 after:-translate-x-1/2 after:mt-2">
                  New Testament
                </h2>
                {renderBookPills(newTestamentBooks)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BooksPage;
