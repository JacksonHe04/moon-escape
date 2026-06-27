'use client';

import { useCallback, useEffect, useState } from 'react';
import { useDirectory } from '@/hooks/useDirectory';
import { useFileTree } from '@/hooks/useFileTree';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useSearchIndex } from '@/hooks/useSearchIndex';
import { FileTree } from '@/components/file-tree/FileTree';
import { Editor } from '@/components/editor/Editor';
import { PageProperties } from '@/components/page-properties/PageProperties';
import { PromptDialog } from '@/components/file-tree/ContextMenu';
import { SearchPanel } from '@/components/search/SearchPanel';
import { joinDocument } from '@/lib/markdown-serde';
import { resolveMdPath } from '@/lib/double-link';
import { getFileHandleByPath, scanMdFilesRecursively } from '@/lib/fs-access';
import type { FileEntry } from '@/types/document';

import '@/components/file-tree/file-tree.css';
import '@/components/editor/editor.css';
import '@/components/page-properties/page-properties.css';
import '@/components/search/search.css';

export default function Page() {
  const { dirHandle, topEntries, status, errorMsg, pickDirectory, reauthorize } = useDirectory();
  const [currentFile, setCurrentFile] = useState<{ handle: FileSystemFileHandle; path: string } | null>(null);
  const [frontmatter, setFrontmatter] = useState<Record<string, unknown>>({});
  const [bodyMd, setBodyMd] = useState('');
  const [dirty, setDirty] = useState(false);
  const [creatingInRoot, setCreatingInRoot] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [allFileTexts, setAllFileTexts] = useState<{ path: string; text: string }[]>([]);
  const search = useSearchIndex(dirHandle);

  const handlePickFile = useCallback((handle: FileSystemFileHandle, path: string) => {
    setCurrentFile({ handle, path });
    setDirty(false);
  }, []);

  const handleTreeChange = useCallback(() => {}, []);

  const fileTree = useFileTree({
    rootHandle: dirHandle,
    onTreeChange: handleTreeChange,
    onOpenFile: (handle, path) => { setCurrentFile({ handle, path }); setDirty(false); },
  });

  const saveFile = useCallback(async () => {
    if (!currentFile) return;
    const text = joinDocument(frontmatter, bodyMd);
    const writable = await currentFile.handle.createWritable();
    await writable.write(text);
    await writable.close();
    setDirty(false);
  }, [currentFile, frontmatter, bodyMd]);

  const autoSave = useAutoSave({ isDirty: dirty, save: saveFile });

  // 双链点击
  useEffect(() => {
    const handler = async (e: Event) => {
      const detail = (e as CustomEvent).detail as { href: string };
      if (!currentFile || !dirHandle) return;
      const allFiles = new Set(allFileTexts.map((f) => f.path));
      const resolved = resolveMdPath(currentFile.path, detail.href, allFiles);
      if (!resolved) {
        window.alert(`链接目标不存在: ${detail.href}`);
        return;
      }
      const target = allFileTexts.find((f) => f.path === resolved);
      if (!target) {
        console.warn('已解析但索引缺失:', resolved);
        return;
      }
      try {
        const handle = await getFileHandleByPath(dirHandle, resolved);
        setCurrentFile({ handle, path: resolved });
        setDirty(false);
      } catch (err) {
        console.error('跳转失败:', err);
      }
    };
    window.addEventListener('double-link-click', handler);
    return () => window.removeEventListener('double-link-click', handler);
  }, [currentFile, dirHandle, allFileTexts]);

  // 加载所有文件文本(供 backlinks)
  useEffect(() => {
    if (!dirHandle) {
      setAllFileTexts([]);
      return;
    }
    void (async () => {
      try {
        const files = await scanMdFilesRecursively(dirHandle);
        const out: { path: string; text: string }[] = [];
        for (const fileRef of files) {
          try {
            const file = await fileRef.handle.getFile();
            out.push({ path: fileRef.path, text: await file.text() });
          } catch { /* skip */ }
        }
        setAllFileTexts(out);
      } catch (err) {
        console.error('加载所有文件文本失败:', err);
      }
    })();
  }, [dirHandle, currentFile]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        autoSave.saveNow();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [autoSave]);

  const saveButtonText = (() => {
    switch (autoSave.status) {
      case 'saving': return '保存中…';
      case 'saved': return `已保存 ${autoSave.lastSavedAt?.toLocaleTimeString('zh-CN') ?? ''}`;
      case 'error': return `失败 ${autoSave.error ?? ''}`;
      case 'dirty': return '未保存 *';
      default: return '保存';
    }
  })();

  const dirPathText =
    status === 'ready' && dirHandle
      ? `已选择(已记住): ${dirHandle.name}/`
      : status === 'needs-reauth' && dirHandle
        ? `已记住 ${dirHandle.name}/, 但需要重新授权`
        : status === 'denied'
          ? '权限被拒绝, 缓存已清'
          : '';

  return (
    <>
      <header>
        <h1>Leave the Moon</h1>
        <button onClick={pickDirectory} disabled={status === 'unsupported'}>
          {dirHandle ? '切换目录' : '选择 local/ 目录'}
        </button>
        {status === 'needs-reauth' && (
          <button onClick={reauthorize}>重新授权</button>
        )}
        {dirHandle && (
          <>
            <button onClick={() => setSearchOpen(true)}>🔍 搜索 (Ctrl+K)</button>
            <button onClick={() => setCreatingInRoot(true)}>+ 新建文件</button>
          </>
        )}
        <span className="hint">{dirPathText}</span>
        {search.building && <span className="hint">索引中… {search.progress.done}/{search.progress.total}</span>}
        {errorMsg && <span className="hint" style={{ color: 'crimson' }}>{errorMsg}</span>}
      </header>

      <main>
        <aside id="fileTree" aria-label="文件树">
          <FileTree
            topEntries={topEntries}
            rootHandle={dirHandle}
            currentFilePath={currentFile?.path ?? null}
            onPickFile={handlePickFile}
            onRename={fileTree.rename}
            onDelete={(entry: FileEntry) => dirHandle ? fileTree.remove(entry, dirHandle) : Promise.resolve()}
            onCreateFile={fileTree.createNewFile}
            onCreateDir={fileTree.createNewDir}
            emptyMessage={status === 'needs-reauth' ? '需要重新授权' : undefined}
          />
        </aside>
        <section id="editor">
          <div className="editor-toolbar">
            <span className="hint">{currentFile?.path ?? '未选择文件'}</span>
            <button onClick={autoSave.saveNow} disabled={!currentFile || autoSave.status === 'saving'}>
              {saveButtonText}
            </button>
          </div>
          <Editor
            fileHandle={currentFile?.handle ?? null}
            filePath={currentFile?.path ?? null}
            onDirtyChange={setDirty}
            onFrontmatterChange={setFrontmatter}
            onBodyChange={setBodyMd}
          />
        </section>
        <PageProperties
          fileHandle={currentFile?.handle ?? null}
          currentPath={currentFile?.path ?? ''}
          allFileTexts={allFileTexts}
          onFrontmatterChange={setFrontmatter}
        />
      </main>

      {creatingInRoot && dirHandle && (
        <PromptDialog
          title="新建文件 (在根目录)"
          onConfirm={async () => {
            await fileTree.createNewFile(dirHandle, dirHandle.name);
            setCreatingInRoot(false);
          }}
          onCancel={() => setCreatingInRoot(false)}
        />
      )}

      <SearchPanel
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        search={search.search}
        onPick={async (r) => {
          if (!dirHandle) return;
          try {
            const handle = await getFileHandleByPath(dirHandle, r.path);
            handlePickFile(handle, r.path);
          } catch (err) {
            console.error('打开搜索结果失败:', err);
          }
        }}
      />
    </>
  );
}
