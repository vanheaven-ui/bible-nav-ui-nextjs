import React from "react";
import { FileText } from "lucide-react";
import { Descendant } from "slate";
import { Note } from "@/lib/backendApi";

const NotePreview: React.FC<{
  note: Note;
  getPlainText: (content: Descendant[]) => string;
}> = ({ note, getPlainText }) => {
  const content = JSON.parse(note.content) as Descendant[];
  const plainText = getPlainText(content);
  const preview =
    plainText.length > 50 ? plainText.substring(0, 50) + "..." : plainText;

  return (
    <div className="flex items-start text-sm text-[#6b705c] mt-2 p-2 bg-[#fff8e1] rounded-lg border border-[#d4af37]/30">
      <FileText
        size={16}
        className="text-[#a4161a] flex-shrink-0 mt-0.5 mr-2"
      />
      <p className="italic leading-snug">{preview}</p>
    </div>
  );
};

export default NotePreview;
