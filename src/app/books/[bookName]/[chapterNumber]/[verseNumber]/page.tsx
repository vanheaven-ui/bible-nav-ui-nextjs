"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

// Define a placeholder function for the Bible API to allow the UI to function
const fetchBibleChapter = async (book: string, chapter: number) => {
  return {
    chapter: chapter,
    verses: [
      {
        verse: 1,
        text: "In the beginning was the Word, and the Word was with God, and the Word was God.",
      },
      {
        verse: 2,
        text: "He was with God in the beginning.",
      },
      {
        verse: 3,
        text: "Through him all things were made; without him nothing was made that has been made.",
      },
      {
        verse: 4,
        text: "In him was life, and that life was the light of all mankind.",
      },
      {
        verse: 5,
        text: "The light shines in the darkness, and the darkness has not overcome it.",
      },
      {
        verse: 6,
        text: "There was a man sent from God whose name was John.",
      },
      {
        verse: 7,
        text: "He came as a witness to testify concerning that light, so that through him all might believe.",
      },
      {
        verse: 8,
        text: "He himself was not the light; he came only as a witness to the light.",
      },
      {
        verse: 9,
        text: "The true light that gives light to everyone was coming into the world.",
      },
      {
        verse: 10,
        text: "He was in the world, and though the world was made through him, the world did not recognize him.",
      },
      {
        verse: 11,
        text: "He came to that which was his own, but his own did not receive him.",
      },
      {
        verse: 12,
        text: "Yet to all who did receive him, to those who believed in his name, he gave the right to become children of God—",
      },
      {
        verse: 13,
        text: "children born not of natural descent, nor of human decision or a husband’s will, but born of God.",
      },
      {
        verse: 14,
        text: "The Word became flesh and made his dwelling among us. We have seen his glory, the glory of the one and only Son, who came from the Father, full of grace and truth.",
      },
    ],
  };
};

interface Verse {
  verse_number: number;
  text: string;
}

/**
 * A custom modal component to display messages to the user.
 * It replaces the use of `alert()` and `confirm()` for better UX.
 */
const CustomModal = ({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="relative p-8 bg-white w-96 max-w-lg mx-auto rounded-lg shadow-xl text-center">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Note Saved!
        </h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  );
};

/**
 * The main component for the note-taking page.
 * It displays a specific verse and provides a rich text editor for notes.
 */
const VerseNotePage: React.FC = () => {
  const { bookName, chapterNumber, verseNumber } = useParams();
  const editorRef = useRef<HTMLDivElement>(null);
  const [verse, setVerse] = useState<Verse | null>(null);
  const [loading, setLoading] = useState(true);
  const [noteSaving, setNoteSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch verse text on component mount
  useEffect(() => {
    const fetchVerse = async () => {
      if (!bookName || !chapterNumber || !verseNumber) {
        setError("Missing book, chapter, or verse information.");
        setLoading(false);
        return;
      }

      try {
        const book = decodeURIComponent(bookName as string);
        const chapterNum = Number(chapterNumber);
        const verseNum = Number(verseNumber);

        // Fetch verse content using a placeholder function
        const bibleChapter = await fetchBibleChapter(book, chapterNum);
        const foundVerse = bibleChapter?.verses.find(
          (v) => v.verse === verseNum
        );

        if (foundVerse) {
          setVerse({ verse_number: foundVerse.verse, text: foundVerse.text });
        } else {
          setError("Verse not found.");
        }
      } catch (err) {
        console.error("Failed to fetch verse:", err);
        setError("An error occurred while fetching the verse.");
      } finally {
        setLoading(false);
      }
    };

    fetchVerse();
  }, [bookName, chapterNumber, verseNumber]);

  /**
   * Handles saving the user's note. This is a placeholder for the UI.
   */
  const handleSaveNote = () => {
    const noteContent = editorRef.current?.innerHTML || "";
    if (!noteContent.trim()) {
      setError("Note cannot be empty.");
      return;
    }

    setNoteSaving(true);
    setError(null);

    // Simulate an API call
    setTimeout(() => {
      setNoteSaving(false);
      setShowModal(true); // Show success modal
    }, 1000);
  };

  /**
   * Toggles the bold formatting for the selected text.
   */
  const handleBold = () => {
    document.execCommand("bold", false, undefined);
  };

  /**
   * Toggles the italic formatting for the selected text.
   */
  const handleItalic = () => {
    document.execCommand("italic", false, undefined);
  };

  /**
   * Toggles the underline formatting for the selected text.
   */
  const handleUnderline = () => {
    document.execCommand("underline", false, undefined);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start py-8 px-4 sm:px-6 lg:px-8">
      {showModal && (
        <CustomModal
          message="Your note has been saved!"
          onClose={() => setShowModal(false)}
        />
      )}
      <div className="max-w-4xl w-full space-y-6 p-10 bg-white rounded-xl shadow-lg bg-opacity-80 backdrop-blur-sm">
        <h1 className="text-3xl font-extrabold text-center text-blue-800 mb-4">
          {decodeURIComponent(bookName as string)} {chapterNumber}:{verseNumber}
        </h1>

        {loading ? (
          <p className="text-center text-gray-600 text-lg animate-pulse">
            Loading verse...
          </p>
        ) : error ? (
          <p className="text-center text-red-600 text-lg">{error}</p>
        ) : (
          <>
            <div className="p-4 bg-gray-50 rounded-lg shadow-inner">
              <p className="text-gray-800 leading-relaxed">
                <span className="font-bold text-blue-700 mr-2">
                  {verse?.verse_number}
                </span>
                {verse?.text}
              </p>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-700 mb-2">
                My Notes
              </h2>
              <div className="p-2 border rounded-lg shadow-sm bg-white mb-2">
                <div className="flex space-x-2">
                  <button
                    onClick={handleBold}
                    className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md font-bold hover:bg-gray-300 transition-colors"
                  >
                    B
                  </button>
                  <button
                    onClick={handleItalic}
                    className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md italic hover:bg-gray-300 transition-colors"
                  >
                    I
                  </button>
                  <button
                    onClick={handleUnderline}
                    className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md underline hover:bg-gray-300 transition-colors"
                  >
                    U
                  </button>
                </div>
              </div>
              <div
                ref={editorRef}
                className="w-full h-48 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 overflow-y-auto resize-none"
                contentEditable
              ></div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={handleSaveNote}
                disabled={noteSaving}
                className={`px-6 py-2 rounded-lg shadow transition-colors ${
                  noteSaving
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {noteSaving ? "Saving..." : "Save Note"}
              </button>
            </div>

            <div className="mt-6 text-center">
              <Link
                href={`/books/${bookName}/${chapterNumber}`}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors"
              >
                ← Back to Chapter
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerseNotePage;
