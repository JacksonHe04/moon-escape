'use client';

import { TiptapEditor } from './TiptapEditor';
import type { Editor as TiptapEditorType } from '@tiptap/react';

type EditorProps = {
  fileHandle: FileSystemFileHandle | null;
  filePath: string | null;
  onDirtyChange: (dirty: boolean) => void;
  onFrontmatterChange: (fm: Record<string, unknown>) => void;
  onBodyChange: (md: string) => void;
  onEditorReady?: (editor: TiptapEditorType | null) => void;
};

export function Editor({
  fileHandle,
  filePath,
  onDirtyChange,
  onFrontmatterChange,
  onBodyChange,
  onEditorReady,
}: EditorProps) {
  return (
    <TiptapEditor
      fileHandle={fileHandle}
      filePath={filePath}
      onChange={(content) => {
        onDirtyChange(true);
        onBodyChange(content);
        onFrontmatterChange({}); // placeholder, Commit 2 wires real frontmatter
      }}
      editorRef={onEditorReady}
    />
  );
}
