"use client";

import React, { forwardRef } from "react";
import { Verse } from "@/lib/bibleApi";
import { Note } from "@/lib/backendApi";
import { Heart, Pencil } from "lucide-react";
import { Descendant } from "slate";

// IMPORTANT: Assume 'FormattedText' is available (e.g., from custom.d.ts)
// We define it here for completeness within this file's context:
interface FormattedText {
  text: string;
  bold?: boolean;
  italic?: boolean;
}

// Type Guard to check if a Descendant is a Text node
const isTextNode = (node: Descendant): node is FormattedText => {
  return (node as FormattedText).text !== undefined;
};

interface VerseItemProps {
  verse: Verse;
  bookName: string;
  chapterNumber: number;
  isFav: boolean;
  userNote?: Note;
  toggleFavorite: (verse: Verse) => void;
  onClick?: () => void;
  isCurrent?: boolean;
}

const VerseItem = forwardRef<HTMLDivElement, VerseItemProps>(
  ({ verse, isFav, userNote, toggleFavorite, onClick, isCurrent }, ref) => {
    // RESOLVED FIX: Safely extract text from the Slate structure using a Type Guard.
    const getPlainText = (content: string): string => {
      try {
        // Explicitly cast the parsed content as an array of Slate Descendant nodes
        const parsedContent: Descendant[] = JSON.parse(content) as Descendant[];

        return parsedContent
          .map((node: Descendant) => {
            // Check if the node is a Text leaf node
            if (isTextNode(node)) {
              return node.text;
            }

            // If it's an Element node (like 'paragraph'), it should have children
            // We use the 'in' operator to check for the 'children' property safely
            if ("children" in node && Array.isArray(node.children)) {
              // Recursively map the element's children, ensuring they are also checked
              return node.children
                .map((child: Descendant) =>
                  isTextNode(child) ? child.text : ""
                )
                .join("");
            }
            return "";
          })
          .join(" ");
      } catch (e) {
        // Log the error for debugging
        console.error("Failed to parse Slate content:", e);
        return "Error loading note content.";
      }
    };

    return (
      <div
        ref={ref}
        onClick={onClick}
        className={`relative flex items-start justify-between p-4 rounded-2xl shadow-lg transition-transform transform hover:scale-[1.02] hover:shadow-2xl cursor-pointer
          bg-[#f9f5e7]/60 border border-[#6b705c]/30 backdrop-blur-sm
          ${isCurrent ? "ring-4 ring-[#d4af37]/60 bg-[#fdf6e3]" : ""}`}
      >
        <div className="flex items-start space-x-3">
          <span className="font-bold text-[#a4161a] w-10 text-right">
            {verse.verse_number}
          </span>
          <p className="text-[#2d2a26] leading-relaxed">{verse.text}</p>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          {userNote && (
            <div
              className="p-1 rounded-full text-[#6b705c] z-100"
              data-tooltip-id="note-tooltip"
              // The argument is now correctly handled by the type guard within getPlainText
              data-tooltip-content={getPlainText(userNote.content)}
            >
              <Pencil className="h-4 w-4" />
            </div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(verse);
            }}
            className={`p-2 rounded-full transition-transform transform hover:scale-110 ${
              isFav
                ? "bg-[#a4161a]/20 text-[#a4161a]"
                : "bg-[#6b705c]/10 text-[#6b705c]"
            }`}
            title={isFav ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`h-5 w-5 ${isFav ? "fill-[#a4161a]" : "fill-none"}`}
            />
          </button>
        </div>
      </div>
    );
  }
);

VerseItem.displayName = "VerseItem";

export default VerseItem;
