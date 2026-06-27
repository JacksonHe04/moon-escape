'use client';

import type { SearchResult } from '@/hooks/useSearchIndex';

type SearchResultsProps = {
  results: SearchResult[];
  query: string;
  onPick: (result: SearchResult) => void;
};

export function SearchResults({ results, query, onPick }: SearchResultsProps) {
  if (results.length === 0) {
    return <div className="search-empty">{query ? '无匹配结果' : '输入关键词开始搜索'}</div>;
  }
  return (
    <ul className="search-results">
      {results.map((r) => (
        <li key={r.id} onClick={() => onPick(r)}>
          <div className="result-title">{r.title}</div>
          <div className="result-path">{r.path || r.id}</div>
        </li>
      ))}
    </ul>
  );
}
