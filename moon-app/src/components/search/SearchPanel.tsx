'use client';

import { useState, useEffect, useRef } from 'react';
import { SearchResults } from './SearchResults';
import type { SearchResult } from '@/hooks/useSearchIndex';

type SearchPanelProps = {
  open: boolean;
  onClose: () => void;
  search: (query: string) => SearchResult[];
  onPick: (result: SearchResult) => void;
};

export function SearchPanel({ open, onClose, search, onPick }: SearchPanelProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;
  const results = search(query);

  return (
    <div className="search-backdrop" onClick={onClose}>
      <div className="search-panel" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索文件名或内容… (Esc 关闭)"
          className="search-input"
        />
        <SearchResults results={results} query={query} onPick={(r) => { onPick(r); onClose(); }} />
      </div>
    </div>
  );
}
