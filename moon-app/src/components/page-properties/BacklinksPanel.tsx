'use client';

import { useEffect, useState } from 'react';
import { extractMdLinks } from '@/lib/double-link';

type BacklinksPanelProps = {
  currentPath: string;
  currentNotionId: string | undefined;
  allFiles: { path: string; text: string }[];
  onPickFile: (path: string) => void;
};

export function BacklinksPanel({ currentPath, currentNotionId, allFiles, onPickFile }: BacklinksPanelProps) {
  const [open, setOpen] = useState(false);
  const [backlinks, setBacklinks] = useState<{ path: string; snippet: string }[]>([]);

  useEffect(() => {
    const result: { path: string; snippet: string }[] = [];
    const currentFileName = currentPath.split('/').pop() ?? '';
    for (const f of allFiles) {
      if (f.path === currentPath) continue;
      const links = extractMdLinks(f.text);
      for (const link of links) {
        const matchByFile = link.href.endsWith(currentFileName);
        const matchById = currentNotionId ? link.href.includes(currentNotionId) : false;
        if (matchByFile || matchById) {
          result.push({ path: f.path, snippet: link.text });
        }
      }
    }
    setBacklinks(result);
  }, [currentPath, currentNotionId, allFiles]);

  return (
    <div className="backlinks-panel">
      <div className="backlinks-header" onClick={() => setOpen(!open)}>
        <span>{open ? '▼' : '▶'}</span>
        <span>反向链接 ({backlinks.length})</span>
      </div>
      {open && (
        <ul className="backlinks-list">
          {backlinks.length === 0 ? (
            <li className="empty">暂无反向链接</li>
          ) : backlinks.map((b, i) => (
            <li key={i} onClick={() => onPickFile(b.path)}>
              {b.path}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
