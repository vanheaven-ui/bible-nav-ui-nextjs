"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { fetchBibleBooks, fetchBibleChapter, Verse } from "@/lib/bibleApi";

import {
  getFavoriteVerses,
  addFavoriteVerse,
  deleteFavoriteVerse,
  FavoriteVerse,
} from "@/lib/backendApi";

import { Heart } from "lucide-react";

interface BibleChapter {
  chapter: number;
  verses: Verse[];
}

const ChapterVersesPage: React.FC = () => {
  const { bookName, chapterNumber } = useParams();
  const router = useRouter();
  const [chapter, setChapter] = useState<BibleChapter | null>(null);
  const [bookChapters, setBookChapters] = useState<number>(0);
  const [favorites, setFavorites] = useState<FavoriteVerse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scrollVerse, setScrollVerse] = useState<number | "">("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  // Ref map for verses
  const verseRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const loadFavorites = async () => {
    if (!token) return;
    try {
      const { verses } = await getFavoriteVerses(token);
      setFavorites(verses);
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
    }
  };

  const toggleFavorite = async (verse: Verse) => {
    if (!token) {
      console.log("Please login to favorite verses.");
      return;
    }

    const existing = favorites.find(
      (f) =>
        f.book === decodeURIComponent(bookName as string) &&
        f.chapter === Number(chapterNumber) &&
        f.verse_number === verse.verse_number
    );

    if (existing) {
      try {
        await deleteFavoriteVerse(token, existing.id);
        setFavorites(favorites.filter((f) => f.id !== existing.id));
      } catch (err) {
        console.error("Failed to delete favorite:", err);
      }
    } else {
      try {
        const { verse: newFav } = await addFavoriteVerse(token, {
          book: decodeURIComponent(bookName as string),
          chapter: Number(chapterNumber),
          verse_number: verse.verse_number,
          verse_text: verse.text,
        });
        setFavorites([...favorites, newFav]);
      } catch (err) {
        console.error("Failed to add favorite:", err);
      }
    }
  };

  // Scroll to a verse
  const handleScrollToVerse = () => {
    if (scrollVerse && verseRefs.current[scrollVerse]) {
      verseRefs.current[scrollVerse]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  useEffect(() => {
    const loadChapter = async () => {
      if (!bookName || !chapterNumber) return;

      setLoading(true);
      setError(null);

      try {
        const allBooks = await fetchBibleBooks();
        const foundBook = allBooks.find(
          (b) => b.name === decodeURIComponent(bookName as string)
        );
        if (foundBook) setBookChapters(foundBook.chapters);

        const bibleChapter = await fetchBibleChapter(
          decodeURIComponent(bookName as string),
          Number(chapterNumber)
        );

        if (bibleChapter) {
          setChapter({
            chapter: bibleChapter.chapter,
            verses: bibleChapter.verses.map((v) => ({
              verse_number: v.verse,
              text: v.text,
            })),
          });
        } else {
          setError("Chapter not found.");
        }
      } catch (err: unknown) {
        console.error("Failed to fetch chapter:", err);
        setError("An error occurred while fetching this chapter.");
      } finally {
        setLoading(false);
      }
    };

    loadChapter();
    loadFavorites();
  }, [bookName, chapterNumber]);

  const currentChapter = Number(chapterNumber);

  return (
    <div className="flex-1 flex flex-col items-center justify-start py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-6 p-10 bg-white rounded-xl shadow-lg bg-opacity-80 backdrop-blur-sm">
        <h1 className="text-3xl font-extrabold text-center text-blue-800 mb-4">
          {decodeURIComponent(bookName as string)} {chapterNumber}
        </h1>

        {/* Scroll to Verse Input with Improved Tooltip */}
        <div className="flex justify-center mb-4 space-x-2 relative group">
          <input
            type="number"
            min={1}
            placeholder="Verse #"
            value={scrollVerse}
            onChange={(e) => setScrollVerse(Number(e.target.value))}
            className="w-24 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {/* Improved Tooltip */}
          <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 p-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-10 scale-95 group-hover:scale-100 origin-bottom">
            <span className="relative z-10">
              Enter a verse number to jump to it.
            </span>
            <div className="absolute w-3 h-3 bg-slate-800 -top-1 left-1/2 transform -translate-x-1/2 rotate-45"></div>
          </div>
          <button
            onClick={handleScrollToVerse}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-600 text-lg animate-pulse">
            Loading verses...
          </p>
        ) : error ? (
          <p className="text-center text-red-600 text-lg">{error}</p>
        ) : (
          <>
            <div className="space-y-4">
              {chapter?.verses.map((v) => {
                const isFav = favorites.some(
                  (f) =>
                    f.book === decodeURIComponent(bookName as string) &&
                    f.chapter === Number(chapterNumber) &&
                    f.verse_number === v.verse_number
                );
                return (
                  <Link
                    href={`/books/${bookName}/${chapterNumber}/${v.verse_number}`}
                    key={v.verse_number}
                    className="block"
                  >
                    <div
                      ref={(el: HTMLDivElement | null) => {
                        verseRefs.current[v.verse_number] = el;
                      }}
                      className="flex items-start justify-between p-4 bg-gray-50 rounded-lg shadow hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start space-x-3">
                        <span className="font-bold text-blue-700 w-10 text-right">
                          {v.verse_number}
                        </span>
                        <p className="text-gray-800 leading-relaxed">
                          {v.text}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault(); 
                          toggleFavorite(v);
                        }}
                        className={`ml-4 p-2 rounded-full transition ${
                          isFav
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                        title={
                          isFav ? "Remove from favorites" : "Add to favorites"
                        }
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            isFav ? "fill-red-500" : "fill-none"
                          }`}
                        />
                      </button>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="flex justify-between items-center mt-8">
              {currentChapter > 1 ? (
                <button
                  onClick={() =>
                    router.push(`/books/${bookName}/${currentChapter - 1}`)
                  }
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 transition-colors"
                >
                  ← Previous Chapter
                </button>
              ) : (
                <div />
              )}

              {currentChapter < bookChapters ? (
                <button
                  onClick={() =>
                    router.push(`/books/${bookName}/${currentChapter + 1}`)
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
                >
                  Next Chapter →
                </button>
              ) : (
                <div />
              )}
            </div>

            <div className="mt-6 text-center">
              <Link
                href={`/books/${bookName}`}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors"
              >
                📖 Back to Chapters
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChapterVersesPage;
