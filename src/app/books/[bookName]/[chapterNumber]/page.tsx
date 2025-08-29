"use client";

import React, { useState } from "react";

interface SlateTextNode {
  text: string;
}

interface SlateElementNode {
  children: SlateTextNode[];
}

interface Note {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  verse_id: string;
}

interface VerseItemProps {
  verseId: string;
  notes: Note[];
}

const VerseItem: React.FC<VerseItemProps> = ({ verseId, notes }) => {
  const [showNotes, setShowNotes] = useState(false);

  // Convert Slate JSON to plain text
  const getPlainText = (content: string): string => {
    try {
      const parsedContent: SlateElementNode[] = JSON.parse(content);
      return parsedContent
        .map((node) => node.children.map((child) => child.text).join(""))
        .join(" ");
    } catch (e) {
      console.error("Failed to parse note content:", e);
      return "Error loading note content.";
    }
  };

  return (
    <div className="border rounded p-3 mb-3 shadow-sm bg-white">
      <div className="flex justify-between items-center">
        <p className="font-semibold">Verse {verseId}</p>
        <button
          onClick={() => setShowNotes((prev) => !prev)}
          className="text-blue-600 text-sm underline"
        >
          {showNotes ? "Hide Notes" : "Show Notes"}
        </button>
      </div>

      {showNotes && (
        <ul className="mt-3 space-y-2">
          {notes.length === 0 ? (
            <li className="text-gray-500 text-sm">No notes available.</li>
          ) : (
            notes.map((note) => (
              <li
                key={note.id}
                className="border rounded p-2 bg-gray-50 text-sm"
              >
                <p>{getPlainText(note.content)}</p>
                <span className="text-xs text-gray-400 block mt-1">
                  Created: {new Date(note.created_at).toLocaleString()}
                </span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default VerseItem;
