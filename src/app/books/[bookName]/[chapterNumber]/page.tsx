"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { fetchBibleChapter, Verse } from "@/lib/bibleApi";
import {
  getFavoriteVerses,
  addFavoriteVerse,
  deleteFavoriteVerse,
  getNotes,
  addNote,
  deleteNote,
  Note,
  FavoriteVerse,
} from "@/lib/backendApi";
import { Heart } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Descendant, Node, Element, Text } from "slate";
import NoteEditor from "@/components/NoteEditor";
import NoteCard from "@/components/NoteCard";
import Spinner from "@/components/Spinner";

interface BibleChapter {
  chapter: number;
  verses: Verse[];
}

const ChapterVersesPage: React.FC = () => {
  const params = useParams();
  const bookNameParam = Array.isArray(params.bookName)
    ? params.bookName[0]
    : params.bookName;
  const chapterNumberParam = Array.isArray(params.chapterNumber)
    ? params.chapterNumber[0]
    : params.chapterNumber;

  const decodedBookName = bookNameParam
    ? decodeURIComponent(bookNameParam as string)
    : "";
  const chapterNum = chapterNumberParam ? Number(chapterNumberParam) : 0;

  const [chapter, setChapter] = useState<BibleChapter | null>(null);
  const [favorites, setFavorites] = useState<FavoriteVerse[]>([]);
  const [userNotes, setUserNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favoriteLoading, setFavoriteLoading] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);
  const [notesForVerse, setNotesForVerse] = useState<Note[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentNoteContent, setCurrentNoteContent] = useState<Descendant[]>([
    { type: "paragraph", children: [{ text: "" }] } as Element,
  ]);
  const [mobileEditingVerse, setMobileEditingVerse] = useState<number | null>(
    null
  );

  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  const verseRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Load chapter + favorites + notes
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const bibleChapter = await fetchBibleChapter(
          decodedBookName,
          chapterNum
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

        if (token) {
          const [favs, notes] = await Promise.all([
            getFavoriteVerses(),
            getNotes({ book: decodedBookName, chapter: chapterNum }),
          ]);
          setFavorites(favs?.verses || []);
          setUserNotes(Array.isArray(notes) ? notes : []);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load chapter.");
      }
      setLoading(false);
    };
    loadData();
  }, [decodedBookName, chapterNum, token]);

  // Toggle favorite
  const toggleFavorite = useCallback(
    async (verse: Verse) => {
      if (!decodedBookName || !chapterNum) return;
      setFavoriteLoading(verse.verse_number);
      const existing = favorites.find(
        (f) =>
          f.book === decodedBookName &&
          f.chapter === chapterNum &&
          f.verseNumber === verse.verse_number
      );
      try {
        if (existing) {
          await deleteFavoriteVerse(existing.id);
          setFavorites((prev) => prev.filter((f) => f.id !== existing.id));
        } else {
          const newFav = await addFavoriteVerse({
            book: decodedBookName,
            chapter: chapterNum,
            verseNumber: verse.verse_number,
            verseText: verse.text,
          });
          setFavorites((prev) => [...prev, newFav]);
        }
      } catch (err) {
        console.error("Failed to toggle favorite:", err);
      } finally {
        setFavoriteLoading(null);
      }
    },
    [favorites, decodedBookName, chapterNum]
  );

  // Open verse panel
  const openVersePanel = useCallback(
    (verse: Verse) => {
      setSelectedVerse(verse);
      const notes = Array.isArray(userNotes)
        ? userNotes.filter(
            (n) =>
              n.book === decodedBookName &&
              n.chapter === chapterNum &&
              n.verse === verse.verse_number
          )
        : [];
      setNotesForVerse(notes);
      setIsEditing(false);
      setCurrentNoteContent([
        { type: "paragraph", children: [{ text: "" }] } as Element,
      ]);
      setMobileEditingVerse(null);
    },
    [userNotes, decodedBookName, chapterNum]
  );

  // Save note
  const handleSaveNote = useCallback(
    async (verseNumber?: number) => {
      const verse = verseNumber
        ? chapter?.verses.find((v) => v.verse_number === verseNumber)
        : selectedVerse;
      if (!verse) return;

      if (
        currentNoteContent.length === 1 &&
        (currentNoteContent[0] as Element).children.length > 0 &&
        ((currentNoteContent[0] as Element).children[0] as unknown as Text)
          .text === ""
      ) {
        return alert("Note is empty.");
      }

      try {
        setSaveLoading(true);
        const newNote = await addNote({
          book: decodedBookName,
          chapter: chapterNum,
          verse: verse.verse_number,
          content: currentNoteContent,
        });
        setUserNotes((prev) => [...prev, newNote]);

        if (verseNumber) {
          setMobileEditingVerse(null);
        } else {
          setNotesForVerse((prev) => [...prev, newNote]);
          setIsEditing(false);
        }

        setCurrentNoteContent([
          { type: "paragraph", children: [{ text: "" }] } as Element,
        ]);
      } catch (err) {
        console.error(err);
        alert("Failed to save note.");
      } finally {
        setSaveLoading(false);
      }
    },
    [currentNoteContent, selectedVerse, chapter, decodedBookName, chapterNum]
  );

  // Delete note
  const handleDeleteNote = useCallback(async (noteId: number) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      setDeleteLoading(noteId);
      await deleteNote(noteId);
      setUserNotes((prev) => prev.filter((n) => n.id !== noteId));
      setNotesForVerse((prev) => prev.filter((n) => n.id !== noteId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete note.");
    } finally {
      setDeleteLoading(null);
    }
  }, []);

  const getPlainText = useCallback((content: Descendant[]) => {
    if (!content) return "";
    return content.map((node) => Node.string(node)).join(" ");
  }, []);

  return (
    <div className="relative min-h-screen flex text-[#495057]">
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/parchment-bg.png')" }}
      />
      <div className="absolute inset-0 -z-10 bg-[#f9f5e7]/85" />

      <div className="flex w-full h-screen">
        {/* Left: Verses */}
        <div className="flex-1 overflow-y-auto h-screen">
          <div className="sticky top-0 z-10 bg-[#f9f5e7]/95 p-6 border-b border-[#6b705c]/20">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#6b705c]">
              {decodedBookName} {chapterNum}
            </h1>
          </div>

          <div className="p-6">
            {loading ? (
              <p className="animate-pulse">Loading verses...</p>
            ) : error ? (
              <p className="text-[#a4161a]">{error}</p>
            ) : (
              <div
                className={`grid gap-4 transition-all duration-500 ${
                  selectedVerse
                    ? "grid-cols-1"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                }`}
              >
                {chapter?.verses.map((verse) => {
                  const isFav = favorites.some(
                    (f) =>
                      f.book === decodedBookName &&
                      f.chapter === chapterNum &&
                      f.verseNumber === verse.verse_number
                  );

                  const verseNotes = Array.isArray(userNotes)
                    ? userNotes.filter(
                        (n) =>
                          n.book === decodedBookName &&
                          n.chapter === chapterNum &&
                          n.verse === verse.verse_number
                      )
                    : [];

                  return (
                    <motion.div
                      key={verse.verse_number}
                      ref={(el: HTMLDivElement | null) => {
                        verseRefs.current[verse.verse_number] = el;
                      }}
                      onClick={() => openVersePanel(verse)}
                      layout
                      whileHover={{ scale: 1.03 }}
                      className="flex flex-col p-4 rounded-xl cursor-pointer shadow border border-[#6b705c]/30 bg-[#f9f5e7]/60"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-[#a4161a]">
                          {verse.verse_number}
                        </span>
                        {favoriteLoading === verse.verse_number ? (
                          <Spinner />
                        ) : (
                          <Heart
                            size={20}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(verse);
                            }}
                            className="cursor-pointer transition-colors"
                            stroke={isFav ? "#a4161a" : "#6b705c"}
                            fill={isFav ? "#a4161a" : "none"}
                          />
                        )}
                      </div>
                      <p>{verse.text}</p>

                      {/* Mobile notes */}
                      <div className="mt-4 space-y-2 sm:hidden">
                        {verseNotes.map((note) => (
                          <NoteCard
                            key={note.id}
                            note={note}
                            getPlainText={getPlainText}
                            onDelete={(id) => handleDeleteNote(id)}
                            deleteLoading={deleteLoading === note.id}
                          />
                        ))}

                        {mobileEditingVerse === verse.verse_number ? (
                          <div
                            className="space-y-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <NoteEditor
                              initialContent={currentNoteContent}
                              onContentChange={setCurrentNoteContent}
                              placeholder="Write your note..."
                            />
                            <div className="flex space-x-2 mt-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMobileEditingVerse(null);
                                }}
                                className="px-3 py-1 bg-[#6b705c] text-white rounded-lg text-sm"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSaveNote(verse.verse_number);
                                }}
                                className="px-3 py-1 bg-[#a4161a] text-white rounded-lg text-sm flex items-center space-x-1"
                                disabled={saveLoading}
                              >
                                {saveLoading && <Spinner size={4} />}
                                <span>Save</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setMobileEditingVerse(verse.verse_number);
                            }}
                            className="px-2 py-1 bg-[#a4161a] text-white rounded text-sm"
                          >
                            + Add Note
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Desktop verse panel */}
        <AnimatePresence>
          {selectedVerse && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="hidden sm:flex w-1/2 bg-[#fdf6e3]/95 border-l border-[#d4af37]/30 shadow-xl flex-col h-screen sticky top-0"
            >
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 flex justify-between items-center border-b border-[#6b705c]/20 bg-[#fdf6e3] sticky top-0 z-10">
                  <h2 className="text-lg sm:text-xl font-semibold">
                    {decodedBookName} {chapterNum}:{selectedVerse.verse_number}
                  </h2>
                  <button onClick={() => setSelectedVerse(null)}>✕</button>
                </div>

                <div className="p-4 border-b border-[#6b705c]/20 bg-[#fdf6e3]">
                  <p className="mb-3">{selectedVerse.text}</p>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="mt-3 px-3 py-1 bg-[#a4161a] text-white rounded-lg"
                    >
                      + Add Note
                    </button>
                  )}
                </div>

                <div className="p-4 space-y-3">
                  {notesForVerse.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      getPlainText={getPlainText}
                      onDelete={(id) => handleDeleteNote(id)}
                      deleteLoading={deleteLoading === note.id}
                    />
                  ))}

                  {isEditing && (
                    <NoteEditor
                      initialContent={currentNoteContent}
                      onContentChange={setCurrentNoteContent}
                      placeholder="Write your note..."
                    />
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="p-4 border-t border-[#6b705c]/20 flex justify-end space-x-2 bg-[#fdf6e3] sticky bottom-0">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1 bg-[#6b705c] text-white rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveNote()}
                    className="px-3 py-1 bg-[#a4161a] text-white rounded-lg flex items-center space-x-1"
                    disabled={saveLoading}
                  >
                    {saveLoading && <Spinner size={4} />}
                    <span>Save</span>
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChapterVersesPage;
