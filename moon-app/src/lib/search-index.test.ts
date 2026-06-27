import { describe, it, expect, beforeEach } from 'vitest';
import { tokenize2gram, createSearchIndex, addDocument, removeDocument, searchIndex } from './search-index';

describe('tokenize2gram', () => {
  it('splits English on spaces', () => {
    expect(tokenize2gram('hello world')).toEqual(['hello', 'world']);
  });
  it('generates 2-grams for Chinese', () => {
    const tokens = tokenize2gram('你好世界');
    expect(tokens).toContain('你好');
    expect(tokens).toContain('好世');
  });
  it('handles mixed text', () => {
    const tokens = tokenize2gram('Hello 你好 World 世界');
    expect(tokens).toContain('hello');
    expect(tokens).toContain('你好');
    expect(tokens).toContain('world');
  });
});

describe('search index', () => {
  let idx: ReturnType<typeof createSearchIndex>;

  beforeEach(() => {
    idx = createSearchIndex();
  });

  it('adds and finds document by title', () => {
    addDocument(idx, { id: '1', path: './a.md', title: 'Quarterly Report', body: 'Q1 results', tags: [] });
    const results = searchIndex(idx, 'quarterly');
    expect(results.length).toBe(1);
    expect(results[0].id).toBe('1');
  });

  it('finds document by body content', () => {
    addDocument(idx, { id: '2', path: './b.md', title: 'Note', body: 'Contains important keyword', tags: [] });
    const results = searchIndex(idx, 'important');
    expect(results.length).toBe(1);
  });

  it('finds Chinese 2-grams in body', () => {
    addDocument(idx, { id: '3', path: './c.md', title: '日记', body: '今天天气很好', tags: [] });
    const results = searchIndex(idx, '天气');
    expect(results.length).toBe(1);
  });

  it('removes documents', () => {
    addDocument(idx, { id: '4', path: './d.md', title: 'Removable', body: 'x', tags: [] });
    removeDocument(idx, '4');
    expect(searchIndex(idx, 'removable').length).toBe(0);
  });
});
