"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
} from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { fetchBibleBooks, fetchBibleChapter, Verse } from "@/lib/bibleApi";
import {
  getFavoriteVerses,
  addFavoriteVerse,
  deleteFavoriteVerse,
  getNotes,
  FavoriteVerse,
  Note,
} from "@/lib/backendApi";
import { Tooltip } from "react-tooltip";
import VerseItem from "@/components/VerseItem";

interface BibleChapter {
  chapter: number;
  verses: Verse[];
}

const ChapterVersesPage: React.FC = () => {
  const { bookName, chapterNumber } = useParams();
  const router = useRouter();

  const decodedBookName =
    typeof bookName === "string" ? decodeURIComponent(bookName) : "";
  const chapterNum =
    typeof chapterNumber === "string" ? Number(chapterNumber) : 0;

  const [chapter, setChapter] = useState<BibleChapter | null>(null);
  const [bookChapters, setBookChapters] = useState<number>(0);
  const [favorites, setFavorites] = useState<FavoriteVerse[]>([]);
  const [userNotes, setUserNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentVerse, setCurrentVerse] = useState<number | null>(null);
  const [scrollVerse, setScrollVerse] = useState<number | "">("");

  const verseRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  const toggleFavorite = useCallback(
    async (verse: Verse) => {
      if (!token || !decodedBookName || !chapterNum) return;
      const existing = favorites.find(
        (f) =>
          f.book === decodedBookName &&
          f.chapter === chapterNum &&
          f.verse_number === verse.verse_number
      );

      try {
        if (existing) {
          await deleteFavoriteVerse(token, existing.id);
          setFavorites((prev) => prev.filter((f) => f.id !== existing.id));
        } else {
          const { verse: newFav } = await addFavoriteVerse(token, {
            book: decodedBookName,
            chapter: chapterNum,
            verse_number: verse.verse_number,
            verse_text: verse.text,
          });
          setFavorites((prev) => [...prev, newFav]);
        }
      } catch (err) {
        console.error("Failed to toggle favorite:", err);
      }
    },
    [favorites, token, decodedBookName, chapterNum]
  );

  const handleScrollToVerse = useCallback(() => {
    if (typeof scrollVerse === "number" && verseRefs.current[scrollVerse]) {
      verseRefs.current[scrollVerse]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      setCurrentVerse(scrollVerse);
    }
  }, [scrollVerse]);

  useEffect(() => {
    const loadData = async () => {
      if (!decodedBookName || !chapterNum) {
        setError("Invalid book or chapter.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const [allBooks, bibleChapter] = await Promise.all([
          fetchBibleBooks(),
          fetchBibleChapter(decodedBookName, chapterNum),
        ]);

        const foundBook = allBooks.find((b) => b.name === decodedBookName);
        if (foundBook) setBookChapters(foundBook.chapters);

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
      } catch (err) {
        console.error("Failed to fetch chapter:", err);
        setError("An error occurred while fetching this chapter.");
      }

      if (token) {
        try {
          const [favs, notes] = await Promise.all([
            getFavoriteVerses(token),
            getNotes(token, { book: decodedBookName, chapter: chapterNum }),
          ]);
          setFavorites(favs.verses);
          setUserNotes(notes);
        } catch (err) {
          console.error("Failed to fetch user data:", err);
        }
      }

      const urlParams = new URLSearchParams(window.location.search);
      const verseParam = urlParams.get("verse");
      if (verseParam) {
        const verseNum = Number(verseParam);
        setCurrentVerse(verseNum);
        setTimeout(() => {
          verseRefs.current[verseNum]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
      }

      setLoading(false);
    };

    loadData();
  }, [decodedBookName, chapterNum, token]);

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden text-[#495057]">
      {/* Background */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/parchment-bg.jpg')" }}
      />
      <div className="absolute inset-0 -z-10 bg-[#f9f5e7]/85" />

      {/* Main Container */}
      <div className="relative z-10 flex-1 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-6xl w-full p-8 sm:p-10 rounded-xl shadow-xl space-y-12 bg-[#f9f5e7]/50 backdrop-blur-md border border-[#6b705c]/30">
          {/* Main Heading with gold underline */}
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-[#6b705c] mb-6 relative after:absolute after:w-24 after:h-1 after:bg-[#d4af37] after:left-1/2 after:-translate-x-1/2 after:mt-2">
            {decodedBookName} {chapterNum}
          </h1>

          <p className="text-center text-[#495057] text-xl font-semibold mb-6">
            Read and reflect on each verse
          </p>

          {/* Scroll to verse input */}
          <div className="flex justify-center mb-6 space-x-4">
            <input
              type="number"
              min={1}
              placeholder="Verse #"
              value={scrollVerse}
              onChange={(e) => setScrollVerse(Number(e.target.value))}
              className="w-24 px-3 py-2 rounded-lg border-2 border-[#6b705c]/40 focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-colors bg-[#f9f5e7] text-[#2d2a26]"
            />
            <button
              onClick={handleScrollToVerse}
              className="px-6 py-2 bg-[#a4161a] text-white rounded-lg font-bold shadow-md hover:bg-[#822121] transition-colors"
            >
              Go
            </button>
          </div>

          {/* Verses List */}
          {loading ? (
            <p className="text-center text-[#495057] text-lg animate-pulse">
              Loading verses...
            </p>
          ) : error ? (
            <p className="text-center text-[#a4161a] text-lg">{error}</p>
          ) : (
            <div className="space-y-4">
              {chapter?.verses.map((v) => {
                const isFav = favorites.some(
                  (f) =>
                    f.book === decodedBookName &&
                    f.chapter === chapterNum &&
                    f.verse_number === v.verse_number
                );
                const userNote = userNotes.find(
                  (n) =>
                    n.book === decodedBookName &&
                    n.chapter === chapterNum &&
                    n.verse === v.verse_number
                );

                return (
                  <VerseItem
                    key={v.verse_number}
                    verse={v}
                    bookName={decodedBookName}
                    chapterNumber={chapterNum}
                    isFav={isFav}
                    userNote={userNote}
                    toggleFavorite={toggleFavorite}
                    isCurrent={currentVerse === v.verse_number}
                    onClick={() =>
                      router.push(
                        `/books/${encodeURIComponent(
                          decodedBookName
                        )}/${chapterNum}/${v.verse_number}`
                      )
                    }
                    ref={(el: HTMLDivElement | null) => {
                      verseRefs.current[v.verse_number] = el;
                    }}
                  />
                );
              })}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            {chapterNum > 1 && (
              <button
                onClick={() =>
                  router.push(`/books/${decodedBookName}/${chapterNum - 1}`)
                }
                className="px-4 py-2 bg-[#6b705c] text-white rounded-lg shadow-md hover:bg-[#5a5f4f] transition-colors"
              >
                ← Previous
              </button>
            )}
            {chapterNum < bookChapters && (
              <button
                onClick={() =>
                  router.push(`/books/${decodedBookName}/${chapterNum + 1}`)
                }
                className="px-4 py-2 bg-[#a4161a] text-white rounded-lg shadow-md hover:bg-[#822121] transition-colors"
              >
                Next →
              </button>
            )}
          </div>

          <div className="mt-6 text-center">
            <Link
              href={`/books/${decodedBookName}`}
              className="px-4 py-2 bg-[#d4af37] text-white rounded-lg shadow-md hover:bg-[#b5952f] transition-colors"
            >
              📖 Back to Chapters
            </Link>
          </div>
        </div>
      </div>
      <Tooltip id="note-tooltip" />
    </div>
  );
};

export default ChapterVersesPage;
