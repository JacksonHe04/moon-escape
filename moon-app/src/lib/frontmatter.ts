import * as yaml from 'js-yaml';
import type { Frontmatter } from '@/types/document';

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

export function splitYAML(text: string): { frontmatter: Frontmatter; body: string } {
  const match = text.match(FRONTMATTER_RE);
  if (!match) return { frontmatter: {}, body: text };

  let parsed: Frontmatter;
  try {
    const result = yaml.load(match[1]);
    parsed = result && typeof result === 'object' && !Array.isArray(result)
      ? (result as Frontmatter)
      : {};
  } catch (err) {
    console.warn('YAML parse failed, treating as no frontmatter:', err);
    return { frontmatter: {}, body: text };
  }

  const body = text.slice(match[0].length).replace(/^\n/, '');
  return { frontmatter: parsed, body };
}

export function joinYAML(frontmatter: Frontmatter, body: string): string {
  if (Object.keys(frontmatter).length === 0) return body;
  const yamlStr = yaml.dump(frontmatter, { lineWidth: -1, noRefs: true });
  return `---\n${yamlStr}---\n\n${body}`;
}
