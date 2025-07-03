"use client"

import React from 'react'
import { Editor, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Menubar from './Menubar'
import TextAlign from '@tiptap/extension-text-align'

const RichTextEditor = ({field}:{field:any}) => {
    const editor =useEditor({
        extensions: [StarterKit, 
            TextAlign.configure({
                types: ["heading", "paragraph"]
            }),
        ],

        editorProps: {
            attributes: {
                class: "min-h-[300px] p-4 focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-none",
            }
        },

        immediatelyRender: false,

        onUpdate: ({ editor }) => {
            field.onChange(JSON.stringify(editor.getJSON()))
        },

        content: field.value ? JSON.parse(field.value) : null
    })
    return (
        <div className='w-full border border-input rounded-lg overflow-hidden dark:bg-input/30'>
            <Menubar editor={editor}/>
            <EditorContent editor={editor} />
        </div>
    )
}

export default RichTextEditor