'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { createSearchIndex, addDocument, removeDocument, searchIndex, type IndexedDoc } from '@/lib/search-index';
import type MiniSearch from 'minisearch';
import { splitYAML } from '@/lib/frontmatter';
import { scanMdFilesRecursively } from '@/lib/fs-access';

export type SearchResult = { id: string; path: string; title: string; score: number };

export function useSearchIndex(rootHandle: FileSystemDirectoryHandle | null) {
  const idxRef = useRef<MiniSearch<IndexedDoc> | null>(null);
  const [building, setBuilding] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  const ensureIndex = useCallback(() => {
    if (!idxRef.current) idxRef.current = createSearchIndex();
    return idxRef.current;
  }, []);

  const rebuild = useCallback(async () => {
    if (!rootHandle) return;
    setBuilding(true);
    setProgress({ done: 0, total: 0 });
    const idx = ensureIndex();
    idx.removeAll();
    try {
      const files = await scanMdFilesRecursively(rootHandle);
      setProgress({ done: 0, total: files.length });
      let done = 0;
      for (const fileRef of files) {
        try {
          const file = await fileRef.handle.getFile();
          const text = await file.text();
          const { frontmatter, body } = splitYAML(text);
          const title = String(frontmatter.title ?? fileRef.handle.name.replace(/\.md$/, ''));
          const id = String(frontmatter.notion_id ?? fileRef.path);
          const path = fileRef.path;
          addDocument(idx, {
            id, path, title, body,
            tags: Array.isArray(frontmatter.tags) ? (frontmatter.tags as string[]) : [],
          });
        } catch { /* skip */ }
        done++;
        setProgress({ done, total: files.length });
      }
    } catch (err) {
      console.error('重建索引失败:', err);
    } finally {
      setBuilding(false);
    }
  }, [rootHandle, ensureIndex]);

  const addOne = useCallback(async (handle: FileSystemFileHandle, path: string) => {
    const idx = ensureIndex();
    try {
      const file = await handle.getFile();
      const text = await file.text();
      const { frontmatter, body } = splitYAML(text);
      addDocument(idx, {
        id: String(frontmatter.notion_id ?? path),
        path,
        title: String(frontmatter.title ?? handle.name.replace(/\.md$/, '')),
        body,
        tags: Array.isArray(frontmatter.tags) ? (frontmatter.tags as string[]) : [],
      });
    } catch { /* skip */ }
  }, [ensureIndex]);

  const removeOne = useCallback((id: string) => {
    if (!idxRef.current) return;
    removeDocument(idxRef.current, id);
  }, []);

  const search = useCallback((query: string): SearchResult[] => {
    if (!idxRef.current) return [];
    return searchIndex(idxRef.current, query);
  }, []);

  useEffect(() => {
    if (rootHandle) void rebuild();
    return () => { idxRef.current = null; };
  }, [rootHandle, rebuild]);

  return { rebuild, addOne, removeOne, search, building, progress };
}
