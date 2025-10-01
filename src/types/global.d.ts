import type { Editor, Element, Text } from "slate";

declare module "slate/dist/index.es" {
  export const isEditor: (value: unknown) => value is Editor;
  export const isElement: (value: unknown) => value is Element;
  export const isText: (value: unknown) => value is Text;
}
