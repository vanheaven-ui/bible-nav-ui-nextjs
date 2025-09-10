"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  createEditor,
  Descendant,
  Editor,
  Text,
  Element,
  Node,
  BaseText,
} from "slate";
import { Slate, Editable, withReact, RenderLeafProps } from "slate-react";
import { withHistory } from "slate-history";
import { useParams } from "next/navigation";
import { addNote, getNotes, deleteNote, type Note } from "@/lib/backendApi";
import { fetchBibleVerse } from "@/lib/bibleApi";
import { motion, AnimatePresence } from "framer-motion";

const isText = (node: Node): node is Text => Text.isText(node);
const isEmptyBlock = (editor: Editor, node: Node) => {
  if (Element.isElement(node) && !editor.isVoid(node)) {
    const childrenAreText = node.children.every(isText);
    const childrenAreEmpty = (node.children as BaseText[]).every(
      (n) => n.text === ""
    );
    return childrenAreText && childrenAreEmpty;
  }
  return false;
};

type CustomMarks = "bold" | "italic" | "underline";
interface CustomText extends BaseText {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

const VerseNotePage: React.FC = () => {
  const { bookName: encodedBookName, chapterNumber, verseNumber } = useParams();
  const bookName = encodedBookName
    ? decodeURIComponent(encodedBookName as string)
    : "";

  const [verseText, setVerseText] = useState("Loading verse...");
  const [userNotes, setUserNotes] = useState<Note[]>([]);
  const [currentNoteContent, setCurrentNoteContent] = useState<Descendant[]>(
    []
  );
  const [showSaved, setShowSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [highlightedWords, setHighlightedWords] = useState<number[]>([]);

  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const notesEndRef = useRef<HTMLDivElement>(null);

  const initialValue: Descendant[] = useMemo(
    () => [{ type: "paragraph", children: [{ text: "" }] }],
    []
  );

  const renderLeaf = useCallback(
    ({ attributes, children, leaf }: RenderLeafProps) => {
      let content = children;
      if ((leaf as CustomText).bold) content = <strong>{content}</strong>;
      if ((leaf as CustomText).italic) content = <em>{content}</em>;
      if ((leaf as CustomText).underline) content = <u>{content}</u>;
      return <span {...attributes}>{content}</span>;
    },
    []
  );

  const toggleFormat = (format: CustomMarks) => {
    const isActive = isFormatActive(editor, format);
    if (isActive) Editor.removeMark(editor, format);
    else Editor.addMark(editor, format, true);
  };

  const isFormatActive = (editor: Editor, format: CustomMarks) => {
    const marks = Editor.marks(editor) as CustomText | null;
    return !!marks?.[format];
  };

  useEffect(() => {
    const fetchVerseAndNotes = async () => {
      setLoading(true);
      setError(null);
      const reference = `${bookName} ${chapterNumber}:${verseNumber}`;

      try {
        const fetchedVerse = await fetchBibleVerse(reference);
        setVerseText(fetchedVerse?.text ?? "Verse not found.");
        if (!fetchedVerse) setError("Verse not found.");
      } catch (err) {
        setVerseText("Failed to load verse text.");
        setError("Failed to load verse text. Please try again.");
      }

      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const existingNotes = await getNotes(token, {
            book: bookName,
            chapter: Number(chapterNumber),
            verse: Number(verseNumber),
          });
          setUserNotes(existingNotes);
        } catch (err) {
          setError("Failed to load your notes. Please try again.");
        }
      }
      setLoading(false);
    };

    fetchVerseAndNotes();
  }, [bookName, chapterNumber, verseNumber]);

  const handleAddNote = () => {
    setIsEditing(true);
    setCurrentNoteContent(initialValue);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentNoteContent(initialValue);
    setError(null);
  };

  const saveNote = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return setError("Please login to save notes.");
    if (currentNoteContent.every((node) => isEmptyBlock(editor, node)))
      return setError("Note is empty and cannot be saved.");

    try {
      const newNote = await addNote(token, {
        book: bookName,
        chapter: Number(chapterNumber),
        verse: Number(verseNumber),
        content: JSON.stringify(currentNoteContent),
      });
      setUserNotes((prev) => [...prev, newNote]);
      setShowSaved(true);
      setError(null);
      setTimeout(() => setShowSaved(false), 2000);
      setIsEditing(false);
      setTimeout(
        () => notesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
        50
      );
    } catch (err) {
      setError("Failed to save note. Please try again.");
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    const token = localStorage.getItem("authToken");
    if (!token) return setError("Please login to delete notes.");
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await deleteNote(token, noteId);
      setUserNotes((prev) => prev.filter((n) => n.id !== noteId));
      setError(null);
    } catch (err) {
      setError("Failed to delete note. Please try again.");
    }
  };

  const getPlainText = (content: Descendant[]): string =>
    content.map((node) => Node.string(node)).join(" ");

  const verseWords = useMemo(() => verseText.split(" "), [verseText]);

  return (
    <div className="relative min-h-screen flex flex-col lg:flex-row bg-[#f9f5e7] text-[#2d2a26]">
      {/* Left pane: Verse */}
      <div className="lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-xl p-10 rounded-3xl shadow-2xl bg-gradient-to-br from-[#fff8f0]/80 to-[#f9f5e7]/90 border border-[#d4af37]/50">
          {/* Main Heading with gold underline */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-[#6b705c] mb-6 relative after:absolute after:w-24 after:h-1 after:bg-[#d4af37] after:left-1/2 after:-translate-x-1/2 after:mt-2">
            {bookName} {chapterNumber}:{verseNumber}
          </h1>

          {loading ? (
            <p className="text-center text-[#495057] animate-pulse">
              Loading verse...
            </p>
          ) : (
            <p className="text-center text-lg italic text-[#2d2a26]">
              {verseWords.map((word, idx) => (
                <span
                  key={idx}
                  className={`transition-colors ${
                    highlightedWords.includes(idx)
                      ? "bg-[#d4af37]/30 rounded px-1"
                      : ""
                  }`}
                >
                  {word}{" "}
                </span>
              ))}
            </p>
          )}
          {error && <p className="text-red-600 mt-2 text-center">{error}</p>}
        </div>
      </div>

      {/* Right pane: Notes */}
      <div className="lg:w-1/2 flex flex-col p-6 space-y-6 max-h-screen overflow-y-auto border-l border-[#d4af37]/20">
        <div className="flex justify-between items-center sticky top-0 bg-[#f9f5e7]/95 z-10 py-2">
          {/* Subheading for Notes */}
          <h2 className="text-2xl font-semibold text-[#6b705c] mb-4">
            My Notes
          </h2>
          {!isEditing && (
            <button
              onClick={handleAddNote}
              className="px-4 py-2 bg-[#a4161a] text-white rounded-2xl hover:bg-[#822121] transition-colors shadow-md"
            >
              + Add Note
            </button>
          )}
        </div>
      </div>
      <div ref={notesEndRef} />
    </div>
  );
};

export default VerseNotePage;
