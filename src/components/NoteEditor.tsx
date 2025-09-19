"use client";

import React, { useCallback, useState } from "react";
import {
  createEditor,
  Descendant,
  Editor,
  Transforms,
  isEditor,
  Element as SlateElement,
} from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { Bold, Italic, List, ListOrdered } from "lucide-react";

interface NoteEditorProps {
  initialContent: Descendant[];
  onContentChange: (content: Descendant[]) => void;
  placeholder: string;
}

const LIST_TYPES = ["numbered-list", "bulleted-list"];

const NoteEditor: React.FC<NoteEditorProps> = ({
  initialContent,
  onContentChange,
  placeholder,
}) => {
  const [editor] = useState(() => withReact(createEditor()));

  const toggleMark = useCallback((editor: Editor, format: string) => {
    const isActive = isMarkActive(editor, format);
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  }, []);

  const isMarkActive = useCallback((editor: Editor, format: string) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format as keyof typeof marks] === true : false;
  }, []);

  const isBlockActive = useCallback((editor: Editor, format: string) => {
    const { selection } = editor;
    if (!selection) return false;

    const [match] = Array.from(
      Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: (n) =>
          !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
      })
    );
    return !!match;
  }, []);

  const toggleBlock = useCallback(
    (editor: Editor, format: string) => {
      const isActive = isBlockActive(editor, format);
      const isList = LIST_TYPES.includes(format);

      Transforms.unwrapNodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          LIST_TYPES.includes(n.type),
        split: true,
      });

      const newProperties: Partial<SlateElement> = {
        type: (isActive ? "paragraph" : isList ? "list-item" : format) as any, 
      };
      Transforms.setNodes(editor, newProperties);

      if (!isActive && isList) {
        const block = { type: format, children: [] } as SlateElement;
        Transforms.wrapNodes(editor, block);
      }
    },
    [isBlockActive]
  );

  const renderElement = useCallback(
    ({ attributes, children, element }: any) => {
      // 'any' should be replaced with proper types
      switch (element.type) {
        case "list-item":
          return <li {...attributes}>{children}</li>;
        case "bulleted-list":
          return <ul {...attributes}>{children}</ul>;
        case "numbered-list":
          return <ol {...attributes}>{children}</ol>;
        default:
          return <p {...attributes}>{children}</p>;
      }
    },
    []
  );

  const renderLeaf = useCallback(({ attributes, children, leaf }: any) => {
    // 'any' should be replaced with proper types
    if (leaf.bold) {
      children = <strong>{children}</strong>;
    }
    if (leaf.italic) {
      children = <em>{children}</em>;
    }
    return <span {...attributes}>{children}</span>;
  }, []);

  return (
    <Slate
      editor={editor}
      initialValue={initialContent}
      onChange={onContentChange}
    >
      <div className="flex space-x-2 p-2 border-b border-gray-300 bg-gray-100 rounded-t-lg">
        <button
          className={`p-1 rounded ${
            isMarkActive(editor, "bold") ? "bg-gray-300" : "hover:bg-gray-200"
          }`}
          onMouseDown={(event) => {
            event.preventDefault();
            toggleMark(editor, "bold");
          }}
        >
          <Bold size={16} />
        </button>
        <button
          className={`p-1 rounded ${
            isMarkActive(editor, "italic") ? "bg-gray-300" : "hover:bg-gray-200"
          }`}
          onMouseDown={(event) => {
            event.preventDefault();
            toggleMark(editor, "italic");
          }}
        >
          <Italic size={16} />
        </button>
        <button
          className={`p-1 rounded ${
            isBlockActive(editor, "bulleted-list")
              ? "bg-gray-300"
              : "hover:bg-gray-200"
          }`}
          onMouseDown={(event) => {
            event.preventDefault();
            toggleBlock(editor, "bulleted-list");
          }}
        >
          <List size={16} />
        </button>
        <button
          className={`p-1 rounded ${
            isBlockActive(editor, "numbered-list")
              ? "bg-gray-300"
              : "hover:bg-gray-200"
          }`}
          onMouseDown={(event) => {
            event.preventDefault();
            toggleBlock(editor, "numbered-list");
          }}
        >
          <ListOrdered size={16} />
        </button>
      </div>
      <div className="border border-gray-300 rounded-b-lg min-h-[100px] p-2 flex items-start">
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder={placeholder}
          className="w-full min-h-[80px] focus:outline-none"
        />
      </div>
    </Slate>
  );
};

export default NoteEditor;
