import Spinner from "./Spinner";
import { Descendant } from "slate";
import { Note } from "@/lib/backendApi";
import { formatRelativeTime } from "@/lib/formatDate";

interface NoteCardProps {
  note: Note;
  getPlainText: (content: Descendant[]) => string;
  onDelete: (id: number) => void;
  deleteLoading?: boolean;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  getPlainText,
  onDelete,
  deleteLoading,
}) => {
  return (
    <div className="p-3 border rounded-lg bg-white shadow-sm flex justify-between items-start">
      <div>
        <p>{getPlainText(note.content)}</p>
        <div className="text-xs text-gray-500 mt-1">
          Created: {formatRelativeTime(note.createdAt)}
          {note.updatedAt && note.updatedAt !== note.createdAt && (
            <> | Updated: {formatRelativeTime(note.updatedAt)}</>
          )}
        </div>
      </div>
      <button
        onClick={() => onDelete(note.id)}
        className="ml-2 text-red-500"
        disabled={deleteLoading}
      >
        {deleteLoading ? <Spinner size={4} /> : "Delete"}
      </button>
    </div>
  );
};

export default NoteCard;
