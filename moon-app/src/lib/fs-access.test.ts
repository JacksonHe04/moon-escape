import { describe, it, expect } from 'vitest';
import {
  slugify,
  generateUniqueFilename,
  scanMdFilesRecursively,
  getFileHandleByPath,
} from './fs-access';

describe('slugify', () => {
  it('lowercases and replaces spaces', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });
  it('preserves Chinese characters', () => {
    expect(slugify('测试页面')).toBe('测试页面');
  });
  it('removes /', () => {
    expect(slugify('a/b/c')).toBe('a-b-c');
  });
});

describe('generateUniqueFilename', () => {
  it('returns base if not exists', () => {
    const exists = (_n: string) => false;
    expect(generateUniqueFilename('hello.md', exists)).toBe('hello.md');
  });
  it('appends -1 when base exists', () => {
    const exists = (n: string) => n === 'hello.md';
    expect(generateUniqueFilename('hello.md', exists)).toBe('hello-1.md');
  });
  it('appends -2 when base and -1 exist', () => {
    const exists = (n: string) => n === 'hello.md' || n === 'hello-1.md';
    expect(generateUniqueFilename('hello.md', exists)).toBe('hello-2.md');
  });
});

describe('scanMdFilesRecursively', () => {
  it('recursively scans directory and finds markdown files', async () => {
    const mockFile1 = { kind: 'file', name: 'a.md' };
    const mockFile2 = { kind: 'file', name: 'b.md' };
    const mockFile3 = { kind: 'file', name: 'c.txt' };
    const mockSubDir = {
      kind: 'directory',
      name: 'sub',
      entries: async function* () {
        yield ['b.md', mockFile2];
        yield ['c.txt', mockFile3];
      },
    };
    const mockRoot = {
      kind: 'directory',
      name: 'root',
      entries: async function* () {
        yield ['a.md', mockFile1];
        yield ['sub', mockSubDir];
      },
    };

    const results = await scanMdFilesRecursively(mockRoot as any);
    expect(results).toHaveLength(2);
    expect(results[0]).toEqual({ handle: mockFile1, path: 'a.md' });
    expect(results[1]).toEqual({ handle: mockFile2, path: 'sub/b.md' });
  });
});

describe('getFileHandleByPath', () => {
  it('resolves file handles correctly', async () => {
    const mockFile = { name: 'b.md', kind: 'file' };
    const mockSubDir = {
      name: 'sub',
      kind: 'directory',
      getDirectoryHandle: async (name: string) => {
        if (name === 'dir') return mockSubSubDir;
        throw new Error('Not found');
      },
    };
    const mockSubSubDir = {
      name: 'dir',
      kind: 'directory',
      getFileHandle: async (name: string) => {
        if (name === 'b.md') return mockFile;
        throw new Error('Not found');
      },
    };
    const mockRoot = {
      name: 'root',
      kind: 'directory',
      getDirectoryHandle: async (name: string) => {
        if (name === 'sub') return mockSubDir;
        throw new Error('Not found');
      },
    };

    const handle = await getFileHandleByPath(mockRoot as any, 'sub/dir/b.md');
    expect(handle).toBe(mockFile);
  });
});

