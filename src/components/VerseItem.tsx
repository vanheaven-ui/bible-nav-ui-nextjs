"use client";

import React, { forwardRef } from "react";
import { Verse } from "@/lib/bibleApi";
import { Note } from "@/lib/backendApi";
import { Heart, Pencil } from "lucide-react";

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
  onClick?: () => void;
  isCurrent?: boolean;
}

const VerseItem = forwardRef<HTMLDivElement, VerseItemProps>(
  ({ verse, isFav, userNote, toggleFavorite, onClick, isCurrent }, ref) => {
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

export default VerseItem;
