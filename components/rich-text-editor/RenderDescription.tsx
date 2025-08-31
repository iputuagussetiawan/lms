// eslint-disable-next-line @typescript-eslint/no-explicit-any
"use client";

import { useMemo } from "react";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import parse from "html-react-parser";

export function RenderDescription({json}:{json:any}) {
    const output=useMemo(()=>{
        return generateHTML(json,[
            StarterKit,
            TextAlign.configure({
                types: ["heading", "paragraph"]
            }),
        ])
    }, [json])
    return (
        <div className="prose dark:prose-invert prose-li:marker:text-primary">
            {parse(output)}
        </div>
    );
}