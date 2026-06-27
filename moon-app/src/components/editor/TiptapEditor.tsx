'use client';

import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import type { Editor } from '@tiptap/react';
import { splitYAML } from '@/lib/frontmatter';
import { mdToHtml, htmlToMd } from '@/lib/markdown-serde';

type TiptapEditorProps = {
  fileHandle: FileSystemFileHandle | null;
  filePath: string | null;
  onChange: (markdown: string) => void;
  editorRef?: (editor: Editor | null) => void;
};

export function TiptapEditor({ fileHandle, filePath, onChange, editorRef }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'tiptap-link' },
      }),
      Placeholder.configure({ placeholder: '开始写作…' }),
    ],
    content: '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      // 把 Tiptap 内部 HTML 序列化为 Markdown
      onChange(htmlToMd(editor.getHTML()));
    },
    editorProps: {
      attributes: { class: 'tiptap-content' },
      handleClick(_view, _pos, event) {
        const target = event.target as HTMLElement | null;
        if (!target) return false;
        const link = target.closest('a[href]') as HTMLAnchorElement | null;
        if (!link) return false;
        if (!event.metaKey && !event.ctrlKey) return false;
        const href = link.getAttribute('href');
        if (!href || !href.endsWith('.md')) return false;
        event.preventDefault();
        window.dispatchEvent(new CustomEvent('double-link-click', { detail: { href } }));
        return true;
      },
    },
  });

  useEffect(() => {
    if (editorRef) editorRef(editor);
  }, [editor, editorRef]);

  useEffect(() => {
    if (!editor || !fileHandle) return;
    void (async () => {
      try {
        const file = await fileHandle.getFile();
        const text = await file.text();
        const { body } = splitYAML(text);
        const html = mdToHtml(body);
        editor.commands.setContent(html, { parseOptions: { preserveWhitespace: 'full' } });
      } catch (err) {
        console.error('load file failed:', err);
      }
    })();
  }, [editor, fileHandle, filePath]);

  if (!editor) return null;

  return (
    <div className="tiptap-wrapper">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const btn = (active: boolean) => `toolbar-btn ${active ? 'active' : ''}`;
  return (
    <div className="tiptap-toolbar">
      <button type="button" className={btn(editor.isActive('bold'))} onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
      <button type="button" className={btn(editor.isActive('italic'))} onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
      <button type="button" className={btn(editor.isActive('underline'))} onClick={() => editor.chain().focus().toggleUnderline().run()}>U</button>
      <button type="button" className={btn(editor.isActive('strike'))} onClick={() => editor.chain().focus().toggleStrike().run()}>S</button>
      <span className="toolbar-sep" />
      <button type="button" className={btn(editor.isActive('heading', { level: 1 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
      <button type="button" className={btn(editor.isActive('heading', { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
      <button type="button" className={btn(editor.isActive('heading', { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
      <span className="toolbar-sep" />
      <button type="button" className={btn(editor.isActive('bulletList'))} onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
      <button type="button" className={btn(editor.isActive('orderedList'))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>
      <button type="button" className={btn(editor.isActive('blockquote'))} onClick={() => editor.chain().focus().toggleBlockquote().run()}>❝</button>
      <button type="button" className={btn(editor.isActive('codeBlock'))} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>{'</>'}</button>
      <span className="toolbar-sep" />
      <button type="button" className={btn(editor.isActive('link'))} onClick={() => {
        const url = window.prompt('链接 URL', editor.getAttributes('link').href ?? '');
        if (url === null) return;
        if (url === '') editor.chain().focus().unsetLink().run();
        else editor.chain().focus().setLink({ href: url }).run();
      }}>🔗</button>
      <span className="toolbar-sep" />
      <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>↶</button>
      <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>↷</button>
    </div>
  );
}
