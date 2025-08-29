"use client";

import React, { useState, useEffect, useRef, memo, useCallback } from "react";
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
import { Heart, Pencil } from "lucide-react";
import { Tooltip } from "react-tooltip";

interface BibleChapter {
  chapter: number;
  verses: Verse[];
}

interface SlateNode {
  children: { text: string }[];
}

interface VerseItemProps {
  verse: Verse;
  bookName: string;
  chapterNumber: number;
  isFav: boolean;
  userNote?: Note;
  toggleFavorite: (verse: Verse) => void;
}

const VerseItem: React.FC<VerseItemProps> = memo(
  ({ verse, bookName, chapterNumber, isFav, userNote, toggleFavorite }) => {
    const router = useRouter();

    const getPlainText = (content: string): string => {
      try {
        const parsedContent: SlateNode[] = JSON.parse(content);
        return parsedContent
          .map((node) => node.children.map((child) => child.text).join(""))
          .join(" ");
      } catch (e) {
        console.error("Failed to parse note content:", e);
        return "Error loading note content.";
      }
    };

    return (
      <div
        className="flex items-start justify-between p-4 bg-gray-50 rounded-lg shadow hover:bg-gray-100 transition-colors cursor-pointer"
        onClick={() =>
          router.push(
            `/books/${bookName}/${chapterNumber}/${verse.verse_number}`
          )
        }
      >
        <div className="flex items-start space-x-3">
          <span className="font-bold text-blue-700 w-10 text-right">
            {verse.verse_number}
          </span>
          <p className="text-gray-800 leading-relaxed">{verse.text}</p>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          {userNote && (
            <div
              className="p-1 rounded-full text-blue-500"
              data-tooltip-id="note-tooltip"
              data-tooltip-content={getPlainText(userNote.content)}
              onClick={(e) => e.stopPropagation()}
            >
              <Pencil className="h-4 w-4" />
            </div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(verse);
            }}
            className={`p-2 rounded-full transition ${
              isFav ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"
            }`}
            title={isFav ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`h-5 w-5 ${isFav ? "fill-red-500" : "fill-none"}`}
            />
          </button>
        </div>
      </div>
    );
  }
);

VerseItem.displayName = "VerseItem";

const ChapterVersesPage: React.FC = () => {
  const { bookName, chapterNumber } = useParams();
  const router = useRouter();

  // Narrow types to string / number
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
  const [scrollVerse, setScrollVerse] = useState<number | "">("");

  const verseRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  // Toggle favorite verse
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

  // Scroll to specific verse
  const handleScrollToVerse = useCallback(() => {
    if (typeof scrollVerse === "number" && verseRefs.current[scrollVerse]) {
      verseRefs.current[scrollVerse]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [scrollVerse]);

  // Load chapter, favorites, and notes
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

      setLoading(false);
    };

    loadData();
  }, [decodedBookName, chapterNum, token]);

  return (
    <div className="flex-1 flex flex-col items-center justify-start py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-6 p-10 bg-white rounded-xl shadow-lg bg-opacity-80 backdrop-blur-sm">
        <h1 className="text-3xl font-extrabold text-center text-blue-800 mb-4">
          {decodedBookName} {chapterNum}
        </h1>

        <div className="flex justify-center mb-4 space-x-2 relative group">
          <input
            type="number"
            min={1}
            placeholder="Verse #"
            value={scrollVerse}
            onChange={(e) => setScrollVerse(Number(e.target.value))}
            className="w-24 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
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
                />
              );
            })}
          </div>
        )}

        <div className="flex justify-between items-center mt-8">
          {chapterNum > 1 && (
            <button
              onClick={() =>
                router.push(`/books/${decodedBookName}/${chapterNum - 1}`)
              }
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 transition-colors"
            >
              ← Previous Chapter
            </button>
          )}
          {chapterNum < bookChapters && (
            <button
              onClick={() =>
                router.push(`/books/${decodedBookName}/${chapterNum + 1}`)
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
            >
              Next Chapter →
            </button>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link
            href={`/books/${decodedBookName}`}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors"
          >
            📖 Back to Chapters
          </Link>
        </div>
      </div>
      <Tooltip id="note-tooltip" />
    </div>
  );
};

export default ChapterVersesPage;
