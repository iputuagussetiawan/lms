"use client";

import { useMemo } from "react";
import { generateHTML } from "@tiptap/html";
import type { JSONContent } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import parse from "html-react-parser";

interface RenderDescriptionProps {
  json: JSONContent | null; // accept tiptap JSON or null
}

export function RenderDescription({ json }: RenderDescriptionProps) {
  const output = useMemo(() => {
    if (!json) return ""; // safety check

    return generateHTML(json, [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ]);
  }, [json]);

  return (
    <div className="prose dark:prose-invert prose-li:marker:text-primary">
      {parse(output)}
    </div>
  );
}
