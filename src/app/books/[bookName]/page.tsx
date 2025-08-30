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
    <div className="flex-1 flex flex-col items-center justify-start py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8 p-10 bg-white rounded-xl shadow-lg bg-opacity-80 backdrop-blur-sm">
        <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-8">
          {book ? book.name : decodeURIComponent(bookName as string)}
        </h1>
        <p className="text-center text-gray-600 text-xl font-semibold mb-6">
          Select a chapter
        </p>

        {loading ? (
          <p className="text-center text-gray-600 text-lg">
            Loading chapters...
          </p>
        ) : error ? (
          <p className="text-center text-red-600 text-lg">{error}</p>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {chapters.map((chapterNum) => (
              <Link
                key={chapterNum}
                href={`/books/${bookName}/${chapterNum}`}
                className="flex flex-col items-center justify-center p-4 bg-blue-100 rounded-lg shadow-md hover:bg-blue-200 transition-colors duration-200 text-center text-blue-800 font-semibold text-lg h-24"
              >
                <span className="text-2xl">{chapterNum}</span>
                {book?.chapter_verses && (
                  <span className="text-sm text-gray-600 mt-1">
                    {book.chapter_verses[chapterNum]} verses
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookChaptersPage;
