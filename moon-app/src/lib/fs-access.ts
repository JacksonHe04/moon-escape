// File System Access API 封装
import type { FileEntry } from '@/types/document';

export async function readDirectoryEntries(
  handle: FileSystemDirectoryHandle,
): Promise<FileEntry[]> {
  const entries: FileEntry[] = [];
  for await (const [name, child] of handle.entries()) {
    if (child.kind === 'directory') {
      entries.push({
        kind: 'dir',
        name,
        path: '',
        handle: child as FileSystemDirectoryHandle,
      });
    } else if (child.kind === 'file' && name.endsWith('.md')) {
      entries.push({
        kind: 'file',
        name,
        path: '',
        handle: child as FileSystemFileHandle,
      });
    }
  }
  entries.sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === 'dir' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  return entries;
}

export function slugify(title: string): string {
  return title
    .trim()
    .replace(/[\/\\]/g, '-')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

export function generateUniqueFilename(
  base: string,
  exists: (name: string) => boolean,
): string {
  if (!exists(base)) return base;
  const dot = base.lastIndexOf('.');
  const stem = dot === -1 ? base : base.slice(0, dot);
  const ext = dot === -1 ? '' : base.slice(dot);
  let i = 1;
  while (exists(`${stem}-${i}${ext}`)) i++;
  return `${stem}-${i}${ext}`;
}

export async function createFile(
  parentDir: FileSystemDirectoryHandle,
  name: string,
  initialContent: string,
): Promise<FileSystemFileHandle> {
  const handle = await parentDir.getFileHandle(name, { create: true });
  const writable = await handle.createWritable();
  await writable.write(initialContent);
  await writable.close();
  return handle;
}

export async function createDir(
  parentDir: FileSystemDirectoryHandle,
  name: string,
): Promise<FileSystemDirectoryHandle> {
  return await parentDir.getDirectoryHandle(name, { create: true });
}

export async function renameEntry(
  handle: FileSystemFileHandle | FileSystemDirectoryHandle,
  newName: string,
): Promise<void> {
  // FileSystemHandle.move() is in the spec but not yet in TS lib.dom.d.ts
  // Chrome/Edge support it natively; cast through unknown to bypass type check
  await (handle as unknown as { move: (name: string) => Promise<void> }).move(newName);
}

export async function deleteEntry(
  parentDir: FileSystemDirectoryHandle,
  name: string,
): Promise<void> {
  await parentDir.removeEntry(name, { recursive: true });
}

export interface MdFileRef {
  handle: FileSystemFileHandle;
  path: string;
}

export async function scanMdFilesRecursively(
  dirHandle: FileSystemDirectoryHandle,
  currentPath = '',
): Promise<MdFileRef[]> {
  const files: MdFileRef[] = [];
  for await (const [name, child] of dirHandle.entries()) {
    const childPath = currentPath ? `${currentPath}/${name}` : name;
    if (child.kind === 'file') {
      if (name.endsWith('.md')) {
        files.push({ handle: child as FileSystemFileHandle, path: childPath });
      }
    } else if (child.kind === 'directory') {
      const nested = await scanMdFilesRecursively(child as FileSystemDirectoryHandle, childPath);
      files.push(...nested);
    }
  }
  return files;
}

export async function getFileHandleByPath(
  rootDir: FileSystemDirectoryHandle,
  relativePath: string,
): Promise<FileSystemFileHandle> {
  const parts = relativePath.split('/').filter(Boolean);
  let currentDir = rootDir;
  for (let i = 0; i < parts.length - 1; i++) {
    currentDir = await currentDir.getDirectoryHandle(parts[i]);
  }
  return await currentDir.getFileHandle(parts[parts.length - 1]);
}

