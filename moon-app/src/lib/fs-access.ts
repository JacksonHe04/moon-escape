// File System Access API 封装
import type { FileEntry } from '@/types/document';
import { joinYAML, splitYAML } from './frontmatter';

/**
 * 跳过以 "." 开头的隐藏目录/文件（.git / .next / .idea / .DS_Store 等）。
 * 这些通常是工具链产物，不属于用户内容；放进文件树会刷屏、放进索引也会拖慢搜索。
 */
function isHidden(name: string): boolean {
  return name.startsWith('.');
}

export async function readDirectoryEntries(
  handle: FileSystemDirectoryHandle,
): Promise<FileEntry[]> {
  const entries: FileEntry[] = [];
  for await (const [name, child] of handle.entries()) {
    if (isHidden(name)) continue;
    if (child.kind === 'directory') {
      let title = deslugify(name);
      try {
        const indexHandle = await (child as FileSystemDirectoryHandle).getFileHandle('index.md');
        title = await readDocumentTitle(indexHandle, title);
      } catch {
        // 没有 index.md 的纯目录依旧允许显示，但标题退回目录名
      }
      entries.push({
        kind: 'dir',
        name,
        path: '',
        handle: child as FileSystemDirectoryHandle,
        title,
      });
    } else if (child.kind === 'file' && name.endsWith('.md')) {
      if (name === 'index.md') continue;
      const fileHandle = child as FileSystemFileHandle;
      entries.push({
        kind: 'file',
        name,
        path: '',
        handle: fileHandle,
        title: await readDocumentTitle(fileHandle, deslugify(name.replace(/\.md$/i, ''))),
      });
    }
  }
  entries.sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === 'dir' ? -1 : 1;
    return (a.title ?? a.name).localeCompare(b.title ?? b.name, 'zh-Hans-CN');
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

export function deslugify(name: string): string {
  return name.replace(/-/g, ' ').trim() || 'Untitled';
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

export async function readTextFile(handle: FileSystemFileHandle): Promise<string> {
  const file = await handle.getFile();
  return await file.text();
}

export async function writeTextFile(
  handle: FileSystemFileHandle,
  text: string,
): Promise<void> {
  const writable = await handle.createWritable();
  await writable.write(text);
  await writable.close();
}

export async function readDocumentTitle(
  handle: FileSystemFileHandle,
  fallback: string,
): Promise<string> {
  try {
    const { frontmatter } = splitYAML(await readTextFile(handle));
    const title = frontmatter.title;
    return typeof title === 'string' && title.trim() ? title.trim() : fallback;
  } catch {
    return fallback;
  }
}

export async function updateDocumentTitle(
  handle: FileSystemFileHandle,
  title: string,
): Promise<void> {
  const text = await readTextFile(handle);
  const { frontmatter, body } = splitYAML(text);
  await writeTextFile(handle, joinYAML({ ...frontmatter, title }, body));
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
    if (isHidden(name)) continue;
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

export async function getDirectoryHandleByPath(
  rootDir: FileSystemDirectoryHandle,
  relativePath: string,
): Promise<FileSystemDirectoryHandle> {
  const parts = relativePath.split('/').filter(Boolean);
  let currentDir = rootDir;
  for (const part of parts) {
    currentDir = await currentDir.getDirectoryHandle(part);
  }
  return currentDir;
}

export function getParentPath(relativePath: string): string {
  const parts = relativePath.split('/').filter(Boolean);
  parts.pop();
  return parts.join('/');
}

export function getBasename(relativePath: string): string {
  const parts = relativePath.split('/').filter(Boolean);
  return parts[parts.length - 1] ?? '';
}

export async function ensureDocumentContainer(
  rootDir: FileSystemDirectoryHandle,
  filePath: string,
): Promise<{ dirHandle: FileSystemDirectoryHandle; indexHandle: FileSystemFileHandle; path: string }> {
  if (filePath.endsWith('/index.md')) {
    const dirPath = filePath.slice(0, -'/index.md'.length);
    const dirHandle = await getDirectoryHandleByPath(rootDir, dirPath);
    const indexHandle = await dirHandle.getFileHandle('index.md');
    return { dirHandle, indexHandle, path: dirPath };
  }

  const parentPath = getParentPath(filePath);
  const filename = getBasename(filePath);
  const stem = filename.replace(/\.md$/i, '');
  const parentDir = parentPath ? await getDirectoryHandleByPath(rootDir, parentPath) : rootDir;
  const fileHandle = await getFileHandleByPath(rootDir, filePath);
  const original = await readTextFile(fileHandle);
  const dirHandle = await parentDir.getDirectoryHandle(stem, { create: true });
  const indexHandle = await dirHandle.getFileHandle('index.md', { create: true });
  await writeTextFile(indexHandle, original);
  await deleteEntry(parentDir, filename);

  return {
    dirHandle,
    indexHandle,
    path: parentPath ? `${parentPath}/${stem}` : stem,
  };
}
