'use client';

import { TreeNode } from './TreeNode';
import type { FileEntry } from '@/types/document';

type FileTreeProps = {
  topEntries: FileEntry[] | null;
  rootHandle: FileSystemDirectoryHandle | null;
  currentFilePath: string | null;
  onPickFile: (handle: FileSystemFileHandle, path: string) => void;
  onRename: (entry: FileEntry, newTitle: string) => Promise<void>;
  onDelete: (entry: FileEntry) => Promise<void>;
  onCreateFile: (parent: FileSystemDirectoryHandle, parentName: string) => Promise<void>;
  onCreateDir: (parent: FileSystemDirectoryHandle) => Promise<void>;
  emptyMessage?: string;
};

export function FileTree(props: FileTreeProps) {
  const { topEntries, rootHandle, currentFilePath, onPickFile, onRename, onDelete, onCreateFile, onCreateDir, emptyMessage } = props;
  if (topEntries === null) {
    return <p className="empty">{emptyMessage ?? '尚未选择目录'}</p>;
  }
  if (topEntries.length === 0) {
    return <p className="empty">目录为空(没有 .md 文件)</p>;
  }
  if (!rootHandle) return null;
  return (
    <ul>
      {topEntries.map((e) => (
        <TreeNode
          key={e.name}
          entry={e}
          parentPath=""
          parentHandle={rootHandle}
          onPickFile={onPickFile}
          onRename={onRename}
          onDelete={onDelete}
          onCreateFile={onCreateFile}
          onCreateDir={onCreateDir}
          activePath={currentFilePath}
        />
      ))}
    </ul>
  );
}
