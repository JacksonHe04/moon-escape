'use client';

import { useCallback, useState } from 'react';
import { readDirectoryEntries } from '@/lib/fs-access';
import type { FileEntry } from '@/types/document';
import { ContextMenu, PromptDialog, ConfirmDialog } from './ContextMenu';

type TreeNodeProps = {
  entry: FileEntry;
  parentPath: string;
  parentHandle: FileSystemDirectoryHandle;
  onPickFile: (handle: FileSystemFileHandle, path: string) => void;
  onRename: (entry: FileEntry, newTitle: string) => Promise<void>;
  onDelete: (entry: FileEntry) => Promise<void>;
  onCreateFile: (parent: FileSystemDirectoryHandle, parentName: string) => Promise<void>;
  onCreateDir: (parent: FileSystemDirectoryHandle) => Promise<void>;
  activePath: string | null;
};

export function TreeNode(props: TreeNodeProps) {
  const { entry, parentPath, parentHandle, onPickFile, onRename, onDelete, onCreateFile, onCreateDir, activePath } = props;
  const [open, setOpen] = useState(true);
  const [kids, setKids] = useState<FileEntry[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const [renaming, setRenaming] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [creatingFile, setCreatingFile] = useState(false);
  const [creatingDir, setCreatingDir] = useState(false);

  const path = parentPath ? `${parentPath}/${entry.name}` : entry.name;

  const toggle = useCallback(async () => {
    if (entry.kind !== 'dir') return;
    if (kids === null) {
      setLoading(true);
      try {
        const k = await readDirectoryEntries(entry.handle as FileSystemDirectoryHandle);
        setKids(k);
        setOpen(true);
      } finally {
        setLoading(false);
      }
    } else {
      setOpen(!open);
    }
  }, [entry.handle, entry.kind, kids, open]);

  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenu({ x: e.clientX, y: e.clientY });
  };

  if (entry.kind === 'dir') {
    const dirHandle = entry.handle as FileSystemDirectoryHandle;
    return (
      <li className="dir">
        <div className="label" onClick={toggle} onContextMenu={onContextMenu}>
          {open ? '📂' : '📁'} {entry.name}
        </div>
        {open && kids && (
          <ul>
            {kids.map((k) => (
              <TreeNode
                key={k.name}
                entry={k}
                parentPath={path}
                parentHandle={dirHandle}
                onPickFile={onPickFile}
                onRename={onRename}
                onDelete={onDelete}
                onCreateFile={onCreateFile}
                onCreateDir={onCreateDir}
                activePath={activePath}
              />
            ))}
          </ul>
        )}
        {loading && <div className="hint">加载中…</div>}
        {menu && (
          <ContextMenu
            x={menu.x} y={menu.y}
            onClose={() => setMenu(null)}
            actions={[
              { label: '在此新建文件', onClick: () => setCreatingFile(true) },
              { label: '在此新建文件夹', onClick: () => setCreatingDir(true) },
              { label: '重命名', onClick: () => setRenaming(true) },
              { label: '删除', onClick: () => setConfirmingDelete(true), danger: true },
            ]}
          />
        )}
        {renaming && (
          <PromptDialog
            title={`重命名 "${entry.name}"`}
            defaultValue={entry.name}
            onConfirm={async (v) => { await onRename(entry, v); setRenaming(false); }}
            onCancel={() => setRenaming(false)}
          />
        )}
        {confirmingDelete && (
          <ConfirmDialog
            title={`删除 "${entry.name}"?`}
            message="将删除整个文件夹及其所有内容,操作不可撤销。"
            onConfirm={async () => { await onDelete(entry); setConfirmingDelete(false); }}
            onCancel={() => setConfirmingDelete(false)}
          />
        )}
        {creatingFile && (
          <PromptDialog
            title={`在 ${entry.name}/ 新建文件`}
            onConfirm={async (v) => { await onCreateFile(dirHandle, path); setCreatingFile(false); }}
            onCancel={() => setCreatingFile(false)}
          />
        )}
        {creatingDir && (
          <PromptDialog
            title={`在 ${entry.name}/ 新建文件夹`}
            onConfirm={async (v) => { await onCreateDir(dirHandle); setCreatingDir(false); }}
            onCancel={() => setCreatingDir(false)}
          />
        )}
      </li>
    );
  }

  const isActive = activePath === path;
  return (
    <li className="file">
      <div
        className={isActive ? 'file active' : 'file'}
        onClick={() => onPickFile(entry.handle as FileSystemFileHandle, path)}
        onContextMenu={onContextMenu}
        title={path}
      >
        📄 {entry.name}
      </div>
      {menu && (
        <ContextMenu
          x={menu.x} y={menu.y}
          onClose={() => setMenu(null)}
          actions={[
            { label: '重命名', onClick: () => setRenaming(true) },
            { label: '删除', onClick: () => setConfirmingDelete(true), danger: true },
          ]}
        />
      )}
      {renaming && (
        <PromptDialog
          title={`重命名 "${entry.name}"`}
          defaultValue={entry.name.replace(/\.md$/, '')}
          onConfirm={async (v) => { await onRename(entry, v); setRenaming(false); }}
          onCancel={() => setRenaming(false)}
        />
      )}
      {confirmingDelete && (
        <ConfirmDialog
          title={`删除 "${entry.name}"?`}
          message="操作不可撤销。"
          onConfirm={async () => { await onDelete(entry); setConfirmingDelete(false); }}
          onCancel={() => setConfirmingDelete(false)}
        />
      )}
    </li>
  );
}
