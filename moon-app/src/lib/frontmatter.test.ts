import { describe, it, expect } from 'vitest';
import { splitYAML, joinYAML } from './frontmatter';

describe('splitYAML', () => {
  it('returns empty frontmatter when no ---', () => {
    const result = splitYAML('# Hello\n');
    expect(result.frontmatter).toEqual({});
    expect(result.body).toBe('# Hello\n');
  });

  it('parses simple frontmatter', () => {
    const md = `---
title: Hello
tags: [a, b]
---
# Body`;
    const result = splitYAML(md);
    expect(result.frontmatter).toEqual({ title: 'Hello', tags: ['a', 'b'] });
    expect(result.body).toBe('# Body');
  });

  it('handles missing closing ---', () => {
    const md = `---
title: Hello
# Body without closing`;
    const result = splitYAML(md);
    expect(result.frontmatter).toEqual({});
    expect(result.body).toBe(md);
  });

  it('preserves unknown fields as pass-through', () => {
    const md = `---
title: Hello
custom_field: anything
nested:
  a: 1
  b: 2
---
# Body`;
    const result = splitYAML(md);
    expect(result.frontmatter).toEqual({
      title: 'Hello',
      custom_field: 'anything',
      nested: { a: 1, b: 2 },
    });
  });
});

describe('joinYAML', () => {
  it('returns just body when frontmatter is empty', () => {
    expect(joinYAML({}, 'Hello')).toBe('Hello');
  });

  it('formats frontmatter and body', () => {
    const out = joinYAML({ title: 'Hi', tags: ['a'] }, '# Body');
    expect(out).toMatch(/^---\n/);
    expect(out).toContain('title: Hi');
    expect(out).toContain('# Body');
  });

  it('round-trips with splitYAML', () => {
    const original = `---
title: Test
tags: [x, y]
---
content`;
    const { frontmatter, body } = splitYAML(original);
    const joined = joinYAML(frontmatter, body);
    const reparsed = splitYAML(joined);
    expect(reparsed.frontmatter).toEqual(frontmatter);
    expect(reparsed.body).toBe(body);
  });
});
