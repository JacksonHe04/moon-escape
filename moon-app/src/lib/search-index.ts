import MiniSearch from 'minisearch';

export type IndexedDoc = {
  id: string;
  path: string;
  title: string;
  body: string;
  tags: string[];
};

export function tokenize2gram(text: string): string[] {
  const out: string[] = [];
  const words = text.split(/[\s,;.!?。,;.!?、]+/).filter(Boolean);
  for (const w of words) {
    if (/^[\x00-\x7F]+$/.test(w)) {
      out.push(w.toLowerCase());
    } else if (/[一-龥]/.test(w)) {
      for (let i = 0; i < w.length - 1; i++) {
        if (/[一-龥]/.test(w[i]) && /[一-龥]/.test(w[i + 1])) {
          out.push(w.slice(i, i + 2));
        }
      }
      if (w.length <= 2) out.push(w);
    } else {
      out.push(w);
    }
  }
  return out;
}

export function createSearchIndex(): MiniSearch<IndexedDoc> {
  return new MiniSearch<IndexedDoc>({
    fields: ['title', 'body', 'tags'],
    storeFields: ['path', 'title'],
    tokenize: tokenize2gram,
    searchOptions: {
      boost: { title: 3, tags: 2 },
      fuzzy: 0.2,
    },
  });
}

export function addDocument(idx: MiniSearch<IndexedDoc>, doc: IndexedDoc): void {
  idx.add(doc);
}

export function removeDocument(idx: MiniSearch<IndexedDoc>, id: string): void {
  idx.remove({ id } as IndexedDoc);
}

export function searchIndex(idx: MiniSearch<IndexedDoc>, query: string): { id: string; path: string; title: string; score: number }[] {
  if (!query.trim()) return [];
  return idx.search(query.trim()).slice(0, 20) as unknown as { id: string; path: string; title: string; score: number }[];
}
