
"use client";

import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";

import Menubar from "./Menubar";
import TextAlign from "@tiptap/extension-text-align";
import type { ControllerRenderProps } from "react-hook-form";

interface RichTextEditorProps {
  field: ControllerRenderProps<any, string>;
}

const RichTextEditor = ({ field }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] p-4 focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-none",
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      field.onChange(JSON.stringify(editor.getJSON()));
    },
    content: field.value ? JSON.parse(field.value) : null,
  });

  return (
    <div className="w-full border border-input rounded-lg overflow-hidden dark:bg-input/30">
      <Menubar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
