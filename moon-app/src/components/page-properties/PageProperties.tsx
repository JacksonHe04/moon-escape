'use client';

import { useState, useEffect } from 'react';
import { FieldCard } from './FieldCard';
import { BacklinksPanel } from './BacklinksPanel';
import { splitYAML, joinYAML } from '@/lib/frontmatter';
import type { Frontmatter } from '@/types/document';

type FieldDef = { type: 'string' | 'text' | 'datetime' | 'list' | 'select' | 'link' | 'readonly'; required?: boolean; options?: string[] };

const FIELD_DEFS: Record<string, FieldDef> = {
  title:              { type: 'string',   required: true },
  type:               { type: 'select',   options: ['Notion Page', 'Notion Database', 'Local Page'] },
  description:        { type: 'text' },
  resource:           { type: 'link' },
  tags:               { type: 'list' },
  timestamp:          { type: 'datetime' },
  notion_id:          { type: 'readonly' },
  created_time:       { type: 'readonly' },
  last_edited_time:   { type: 'datetime' },
  notion_parent_type: { type: 'select',   options: ['workspace', 'page_id', 'database_id'] },
  notion_parent_id:   { type: 'string' },
};

type PagePropertiesProps = {
  fileHandle: FileSystemFileHandle | null;
  currentPath: string;
  allFileTexts: { path: string; text: string }[];
  onFrontmatterChange: (frontmatter: Frontmatter) => void;
};

export function PageProperties({ fileHandle, currentPath, allFileTexts, onFrontmatterChange }: PagePropertiesProps) {
  const [frontmatter, setFrontmatter] = useState<Frontmatter>({});
  const [extraFields, setExtraFields] = useState<string[]>([]);
  const [hasFrontmatter, setHasFrontmatter] = useState(false);

  useEffect(() => {
    if (!fileHandle) {
      setFrontmatter({});
      setHasFrontmatter(false);
      setExtraFields([]);
      return;
    }
    void (async () => {
      try {
        const file = await fileHandle.getFile();
        const text = await file.text();
        const { frontmatter: fm } = splitYAML(text);
        setFrontmatter(fm);
        setHasFrontmatter(Object.keys(fm).length > 0);
        const known = new Set(Object.keys(FIELD_DEFS));
        setExtraFields(Object.keys(fm).filter((k) => !known.has(k)));
      } catch (err) {
        console.error('load frontmatter failed:', err);
      }
    })();
  }, [fileHandle]);

  const updateField = (name: string, value: unknown) => {
    const next = { ...frontmatter, [name]: value };
    setFrontmatter(next);
    onFrontmatterChange(next);
  };

  const addFrontmatter = () => {
    const init: Frontmatter = {
      type: 'Local Page',
      title: 'Untitled',
      notion_id: 'local-' + crypto.randomUUID(),
    };
    setFrontmatter(init);
    setHasFrontmatter(true);
    onFrontmatterChange(init);
  };

  return (
    <aside className="page-properties">
      <h3>页面属性</h3>
      {!hasFrontmatter ? (
        <div className="empty">
          <p>此文件无 frontmatter</p>
          <button onClick={addFrontmatter}>添加 frontmatter</button>
        </div>
      ) : (
        <>
          {Object.entries(FIELD_DEFS).map(([name, def]) => (
            <FieldCard
              key={name}
              name={name}
              type={def.type}
              value={frontmatter[name]}
              required={def.required}
              options={def.options}
              onChange={(v) => updateField(name, v)}
              error={def.required && !frontmatter[name] ? '必填' : undefined}
            />
          ))}
          {extraFields.map((name) => (
            <FieldCard
              key={name}
              name={name}
              type="string"
              value={frontmatter[name]}
              onChange={(v) => updateField(name, v)}
            />
          ))}
          <BacklinksPanel
            currentPath={currentPath}
            currentNotionId={String(frontmatter.notion_id ?? '')}
            allFiles={allFileTexts}
            onPickFile={(p) => console.log('backlink click:', p)}
          />
        </>
      )}
    </aside>
  );
}

