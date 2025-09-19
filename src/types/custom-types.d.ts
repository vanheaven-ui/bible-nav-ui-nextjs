import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";

export type ParagraphElement = { type: 'paragraph'; children: Descendant[] };
export type BulletedListElement = { type: 'bulleted-list'; children: Descendant[] };
export type NumberedListElement = { type: 'numbered-list'; children: Descendant[] };
export type ListItemElement = { type: 'list-item'; children: Descendant[] };

// Define a union type for all custom elements
export type CustomElement = ParagraphElement | BulletedListElement | NumberedListElement | ListItemElement;

// Define a type for your text leaves, which can have formatting marks
export type FormattedText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
};

// Define a type for your custom editor that combines Slate and React Editor
declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: FormattedText;
  }
}