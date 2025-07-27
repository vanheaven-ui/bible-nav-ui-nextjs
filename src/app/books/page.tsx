// src/app/books/page.tsx
// This page displays a list of all Bible books.

"use client"; // This component uses client-side hooks

import React, { useState, useEffect } from "react";
import Link from "next/link"; // For linking to individual book pages (future feature)
import { fetchBibleBooks } from "../../lib/bibleApi"; // Import the API utility

const BooksPage: React.FC = () => {
  const [books, setBooks] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedBooks = await fetchBibleBooks();
        if (fetchedBooks && fetchedBooks.length > 0) {
          setBooks(fetchedBooks);
        } else {
          setError("No Bible books found or API returned empty data.");
        }
      } catch (err: unknown) {
        console.error("Failed to fetch Bible books:", err);
        if (err instanceof Error) {
          setError(
            err.message || "An unexpected error occurred while fetching books."
          );
        } else {
          setError("An unknown error occurred while fetching books.");
        }
      } finally {
        setLoading(false);
      }
    };

    getBooks();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="flex-1 flex flex-col items-center justify-start py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8 p-10 bg-white rounded-xl shadow-lg bg-opacity-80 backdrop-blur-sm">
        <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-8">
          Explore Bible Books
        </h1>

        {loading ? (
          <p className="text-center text-gray-600 text-lg">
            Loading Bible books...
          </p>
        ) : error ? (
          <p className="text-center text-red-600 text-lg">{error}</p>
        ) : books.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            No books available at this time.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {books.map((bookName) => (
              <Link
                key={bookName}
                href={`/books/${encodeURIComponent(bookName)}`} // Future: Link to a specific book's chapters
                className="p-4 bg-blue-100 rounded-lg shadow-md hover:bg-blue-200 transition-colors duration-200 text-center text-blue-800 font-semibold text-lg flex items-center justify-center h-24"
              >
                {bookName}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BooksPage;
