"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchBibleBooks, SuperSearchBibleBook } from "@/lib/bibleApi";

const BookChaptersPage: React.FC = () => {
  const { bookName } = useParams();
  const [book, setBook] = useState<SuperSearchBibleBook | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getBookChapters = async () => {
      if (!bookName) return;

      setLoading(true);
      setError(null);

      try {
        const allBooks = await fetchBibleBooks();
        const foundBook = allBooks.find(
          (b) => b.name === decodeURIComponent(bookName as string)
        );

        if (foundBook) {
          setBook(foundBook);
        } else {
          setError("Book not found.");
        }
      } catch (err: unknown) {
        console.error("Failed to fetch book details:", err);
        setError("An error occurred while fetching book details.");
      } finally {
        setLoading(false);
      }
    };

    getBookChapters();
  }, [bookName]);

  const chapters = book
    ? Array.from({ length: book.chapters }, (_, i) => i + 1)
    : [];

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden text-[#495057]">
      {/* Background Image & Overlay */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/parchment-bg.png')" }}
      />
      <div className="absolute inset-0 -z-10 bg-[#f9f5e7]/85"></div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-6xl w-full p-6 sm:p-10 rounded-xl shadow-xl space-y-12 bg-[#f9f5e7]/50 backdrop-blur-md border border-[#6b705c]/30">
          {/* Main Book Heading */}
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-[#6b705c] mb-6 relative after:absolute after:w-24 after:h-1 after:bg-[#d4af37] after:left-1/2 after:-translate-x-1/2 after:mt-2">
            {book ? book.name : decodeURIComponent(bookName as string)}
          </h1>

          <p className="text-center text-[#495057] text-xl font-semibold mb-6">
            Select a chapter
          </p>

          {loading ? (
            <p className="text-center text-[#495057] text-lg animate-pulse">
              Loading chapters...
            </p>
          ) : error ? (
            <p className="text-center text-[#a4161a] text-lg">{error}</p>
          ) : (
            // Responsive chapter container
            <div className="w-full">
              {/* Small screens: horizontal scroll */}
              <div className="flex flex-row flex-nowrap gap-4 overflow-x-auto sm:hidden px-2">
                {chapters.map((chapterNum) => (
                  <Link
                    key={chapterNum}
                    href={`/books/${bookName}/${chapterNum}`}
                    className="flex-shrink-0 relative flex flex-col items-center justify-center px-4 py-3 rounded-3xl shadow-lg border border-[#6b705c]/20 backdrop-blur-sm bg-[#f9f5e7]/60 text-[#495057] font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl break-words min-w-[80px]"
                  >
                    <span className="absolute -inset-1 bg-gradient-to-r from-[#d4af37]/20 via-[#a4161a]/15 to-[#6b705c]/20 rounded-3xl blur-2xl opacity-30 z-0"></span>
                    <span className="relative z-10 text-xl font-bold text-[#a4161a]">
                      {chapterNum}
                    </span>
                    {book?.chapter_verses && (
                      <span className="relative z-10 text-xs text-[#6b705c] mt-1 text-center">
                        {book.chapter_verses[chapterNum]} verses
                      </span>
                    )}
                  </Link>
                ))}
              </div>

              {/* Medium+ screens: responsive grid */}
              <div className="hidden sm:grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-4 sm:gap-6">
                {chapters.map((chapterNum) => (
                  <Link
                    key={chapterNum}
                    href={`/books/${bookName}/${chapterNum}`}
                    className="relative flex flex-col items-center justify-center px-4 py-3 sm:px-5 sm:py-4 rounded-3xl shadow-lg border border-[#6b705c]/20 backdrop-blur-sm bg-[#f9f5e7]/60 text-[#495057] font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl break-words"
                  >
                    <span className="absolute -inset-1 bg-gradient-to-r from-[#d4af37]/20 via-[#a4161a]/15 to-[#6b705c]/20 rounded-3xl blur-2xl opacity-30 z-0"></span>
                    <span className="relative z-10 text-xl sm:text-2xl font-bold text-[#a4161a]">
                      {chapterNum}
                    </span>
                    {book?.chapter_verses && (
                      <span className="relative z-10 text-xs sm:text-sm text-[#6b705c] mt-1 text-center">
                        {book.chapter_verses[chapterNum]} verses
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookChaptersPage;
