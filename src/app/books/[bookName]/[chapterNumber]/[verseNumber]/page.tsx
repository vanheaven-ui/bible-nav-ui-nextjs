"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  createEditor,
  Descendant,
  Editor,
  Text,
  Element,
  BaseText,
  Node,
} from "slate";
import { Slate, Editable, withReact, RenderLeafProps } from "slate-react";
import { withHistory } from "slate-history";
import { useParams } from "next/navigation";
import { addNote, getNotes, deleteNote, type Note } from "@/lib/backendApi";
import { fetchBibleVerse } from "@/lib/bibleApi";

// Helper function to check if an object is a Text node
const isText = (node: Node): node is Text => {
  return Text.isText(node);
};

// Helper function to check if a node is an empty block
const isEmptyBlock = (editor: Editor, node: Node): boolean => {
  if (Element.isElement(node) && !editor.isVoid(node)) {
    const childrenAreText = node.children.every(isText);
    const childrenAreEmpty = (node.children as BaseText[]).every(
      (n) => n.text === ""
    );
    return childrenAreText && childrenAreEmpty;
  }
  return false;
};

// Define a type for our custom marks
type CustomMarks = "bold" | "italic" | "underline";

// Define a type for the leaf node to include our custom marks
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

  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const initialValue: Descendant[] = useMemo(
    () => [
      {
        type: "paragraph",
        children: [{ text: "" }],
      },
    ],
    []
  );

  const renderLeaf = useCallback(
    ({ attributes, children, leaf }: RenderLeafProps) => {
      let newChildren: React.ReactNode = children;
      if ((leaf as CustomText).bold) {
        newChildren = <strong>{newChildren}</strong>;
      }
      if ((leaf as CustomText).italic) {
        newChildren = <em>{newChildren}</em>;
      }
      if ((leaf as CustomText).underline) {
        newChildren = <u>{newChildren}</u>;
      }
      return <span {...attributes}>{newChildren}</span>;
    },
    []
  );

  const toggleFormat = (format: CustomMarks) => {
    const isActive = isFormatActive(editor, format);
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  };

  const isFormatActive = (editor: Editor, format: CustomMarks) => {
    const marks = Editor.marks(editor) as CustomText | null;
    if (!marks) return false;
    return !!marks[format];
  };

  useEffect(() => {
    const fetchVerseAndNotes = async () => {
      setLoading(true);
      setError(null);

      const reference = `${bookName} ${chapterNumber}:${verseNumber}`;

      try {
        const fetchedVerse = await fetchBibleVerse(reference);
        if (fetchedVerse) {
          setVerseText(fetchedVerse.text);
        } else {
          setVerseText("Verse not found.");
          setError("Could not find this verse. Please check the reference.");
        }
      } catch (err) {
        setVerseText("Failed to load verse text.");
        console.error("Failed to load verse text:", err);
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
          console.error("Failed to fetch notes:", err);
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
    setIsEditing(false); // Hide the editor
    setCurrentNoteContent(initialValue); // Reset the content
    setError(null); // Clear any errors
  };

  const saveNote = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Please login to save notes.");
      return;
    }

    const isEmpty = currentNoteContent.every((node) =>
      isEmptyBlock(editor, node)
    );

    if (isEmpty) {
      setError("Note is empty and cannot be saved.");
      return;
    }

    try {
      const newNote = await addNote(token, {
        book: bookName as string,
        chapter: Number(chapterNumber),
        verse: Number(verseNumber),
        content: JSON.stringify(currentNoteContent),
      });

      setUserNotes((prevNotes) => [...prevNotes, newNote]);

      setShowSaved(true);
      setError(null);
      setTimeout(() => setShowSaved(false), 2000);
      setIsEditing(false); // Exit editing mode after saving
    } catch (err) {
      console.error(err);
      setError("Failed to save note. Please try again.");
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Please login to delete notes.");
      return;
    }

    // Add a confirmation dialog for better UX
    if (
      window.confirm(
        "Are you sure you want to delete this note? This action cannot be undone."
      )
    ) {
      try {
        await deleteNote(token, noteId);
        // Optimistically update the UI by filtering the deleted note out
        setUserNotes((prevNotes) =>
          prevNotes.filter((note) => note.id !== noteId)
        );
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error("Failed to delete note:", err);
        setError("Failed to delete note. Please try again.");
      }
    }
  };

  const getPlainText = (content: Descendant[]): string => {
    return content.map((node) => Node.string(node)).join(" ");
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">
        {bookName} {chapterNumber}:{verseNumber}
      </h1>

      {loading ? (
        <p>Loading verse...</p>
      ) : (
        <div className="p-4 bg-gray-100 rounded mb-6">{verseText}</div>
      )}

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {!isEditing ? (
        <>
          <h2 className="text-xl font-semibold mb-2">My Notes</h2>
          {userNotes.length > 0 ? (
            userNotes.map((note) => (
              <div
                key={note.id}
                className="border p-4 mb-4 rounded shadow relative"
              >
                <p>{getPlainText(JSON.parse(note.content))}</p>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="absolute top-2 right-2 p-1 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  aria-label="Delete note"
                  title="Delete Note" // Add a title for accessibility
                >
                  {/* Modern Trash Can Icon (simplified SVG) */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.262 9m1.26-7.236c-.198-.145-.421-.24-.654-.24H5.45c-.233 0-.456.095-.654.24a1.125 1.125 0 01-.654 1.045L4 4.75a.75.75 0 000 1.5l.096-.035c.198-.073.398-.11.604-.11h11.8c.206 0 .406.037.604.11L20 6.25a.75.75 0 000-1.5l-.096-.035a1.125 1.125 0 01-.654-1.045c-.198-.145-.421-.24-.654-.24H9.45c-.233 0-.456.095-.654.24a1.125 1.125 0 01-.654 1.045L7.4 4.75a.75.75 0 000 1.5l.096-.035c.198-.073.398-.11.604-.11h-.35a1.125 1.125 0 01-1.045-.654zM3.5 12V6.75a1.5 1.5 0 01-1.5-1.5v-1.5c0-.828.672-1.5 1.5-1.5H7.5a1.5 1.5 0 011.5 1.5v1.5c0 .828-.672 1.5-1.5 1.5h-2.5V12h6.5v-1.5a1.5 1.5 0 011.5-1.5h2.5a1.5 1.5 0 011.5 1.5v1.5c0 .828-.672 1.5-1.5 1.5H16.5v6.75a1.5 1.5 0 01-1.5 1.5H8.25a1.5 1.5 0 01-1.5-1.5V12H3.5z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.262 9M7.5 4.5h.35c.233 0 .456.095.654.24a1.125 1.125 0 01.654 1.045l1.066.38a.75.75 0 000 1.458l-1.066.38c.198.145-.421.24-.654.24H7.5a1.5 1.5 0 01-1.5-1.5v-1.5c0-.828.672-1.5 1.5-1.5zM16.5 4.5h-.35c-.233 0-.456.095-.654.24a1.125 1.125 0 00-.654 1.045l-1.066.38a.75.75 0 000 1.458l1.066.38c.198.145.421.24.654.24h.35a1.5 1.5 0 001.5-1.5v-1.5c0-.828-.672-1.5-1.5-1.5zM12 18.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 mb-4">
              You have no notes for this verse yet.
            </p>
          )}
          <button
            onClick={handleAddNote}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add a Note
          </button>
        </>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-2">Create a New Note</h2>
          <div className="flex space-x-2 mb-2">
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                toggleFormat("bold");
              }}
              className="px-2 py-1 font-bold border rounded"
            >
              B
            </button>
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                toggleFormat("italic");
              }}
              className="px-2 py-1 italic border rounded"
            >
              I
            </button>
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                toggleFormat("underline");
              }}
              className="px-2 py-1 underline border rounded"
            >
              U
            </button>
          </div>

          <Slate
            editor={editor}
            initialValue={currentNoteContent}
            onChange={(value) => setCurrentNoteContent(value)}
          >
            <Editable
              className="border p-4 min-h-[200px] rounded"
              renderLeaf={renderLeaf}
            />
          </Slate>

          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={saveNote}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Note
            </button>
          </div>
          {showSaved && <p className="text-green-600 mt-2">Note saved!</p>}
        </>
      )}
    </div>
  );
};

export default VerseNotePage;
