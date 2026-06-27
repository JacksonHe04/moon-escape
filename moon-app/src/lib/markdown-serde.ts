import { marked } from 'marked';
import TurndownService from 'turndown';
import type { Frontmatter } from '@/types/document';
import { splitYAML, joinYAML } from './frontmatter';

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  emDelimiter: '_',
});

export function mdToHtml(body: string): string {
  return marked.parse(body, { async: false }) as string;
}

export function htmlToMd(html: string): string {
  return turndown.turndown(html);
}

export function splitDocument(text: string): { frontmatter: Frontmatter; body: string } {
  return splitYAML(text);
}

export function joinDocument(frontmatter: Frontmatter, body: string): string {
  return joinYAML(frontmatter, body);
}
