'use client';

import { useState } from 'react';

type FieldType = 'string' | 'text' | 'datetime' | 'list' | 'select' | 'link' | 'readonly';

type FieldCardProps = {
  name: string;
  type: FieldType;
  value: unknown;
  required?: boolean;
  options?: string[];
  onChange: (newValue: unknown) => void;
  error?: string;
};

export function FieldCard({ name, type, value, required, options, onChange, error }: FieldCardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<string>(serializeValue(value));

  const commit = () => {
    try {
      onChange(parseValue(draft, type));
      setEditing(false);
    } catch (err) {
      console.error('Field parse error:', err);
    }
  };

  return (
    <div className={`field-card ${error ? 'has-error' : ''}`}>
      <div className="field-header">
        <span className="field-name">{name}{required && <span className="required">*</span>}</span>
        <span className="field-type">{type}</span>
      </div>
      {type === 'readonly' ? (
        <div className="field-readonly">{String(value ?? '')}</div>
      ) : editing ? (
        <div className="field-edit">
          {type === 'text' ? (
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => { if (e.key === 'Escape') setEditing(false); }}
              autoFocus
              rows={3}
            />
          ) : type === 'list' ? (
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => { if (e.key === 'Escape') setEditing(false); }}
              placeholder="逗号分隔,如: a, b, c"
              autoFocus
            />
          ) : type === 'select' ? (
            <select
              value={draft}
              onChange={(e) => { setDraft(e.target.value); }}
              onBlur={commit}
              onKeyDown={(e) => { if (e.key === 'Escape') setEditing(false); }}
              autoFocus
            >
              {options?.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          ) : type === 'datetime' ? (
            <input
              type="datetime-local"
              value={toDatetimeLocal(draft)}
              onChange={(e) => setDraft(fromDatetimeLocal(e.target.value))}
              onBlur={commit}
              onKeyDown={(e) => { if (e.key === 'Escape') setEditing(false); }}
              autoFocus
            />
          ) : type === 'link' ? (
            <input
              type="url"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => { if (e.key === 'Escape') setEditing(false); }}
              placeholder="https://..."
              autoFocus
            />
          ) : (
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => { if (e.key === 'Escape') setEditing(false); }}
              autoFocus
            />
          )}
          {error && <div className="field-error">{error}</div>}
        </div>
      ) : (
        <div
          className="field-display"
          onClick={() => { setDraft(serializeValue(value)); setEditing(true); }}
        >
          {value === undefined || value === null || value === '' ? (
            <span className="empty">空</span>
          ) : (
            <span>{displayValue(value, type)}</span>
          )}
        </div>
      )}
    </div>
  );
}

function serializeValue(v: unknown): string {
  if (v === undefined || v === null) return '';
  if (Array.isArray(v)) return v.join(', ');
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

function parseValue(s: string, type: FieldType): unknown {
  if (s.trim() === '') return '';
  switch (type) {
    case 'list': return s.split(',').map((x) => x.trim()).filter(Boolean);
    case 'datetime': return new Date(s).toISOString();
    default: return s;
  }
}

function displayValue(v: unknown, type: FieldType): string {
  if (type === 'datetime' && typeof v === 'string') {
    try { return new Date(v).toLocaleString('zh-CN'); } catch { return v; }
  }
  if (Array.isArray(v)) return v.join(', ');
  return String(v);
}

function toDatetimeLocal(iso: string): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch { return ''; }
}

function fromDatetimeLocal(local: string): string {
  if (!local) return '';
  try {
    return new Date(local).toISOString();
  } catch { return local; }
}
