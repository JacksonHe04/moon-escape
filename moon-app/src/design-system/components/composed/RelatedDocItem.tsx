'use client';

/**
 * RelatedDocItem — 关联文档行。
 *
 * 显示：icon（默认文档）+ 文档名 + 标签（"引用" / "被引用"）。
 *
 * refType:
 * - 'outgoing' → 当前文档链出去 → 「引用」
 * - 'incoming' → 别人链过来 → 「被引用」
 */

import { type ReactNode } from 'react';
import './RelatedDocItem.css';

export type RelatedRefType = 'outgoing' | 'incoming';

export interface RelatedDocItemProps {
  label: string;
  refType: RelatedRefType;
  icon?: ReactNode;
  onClick?: () => void;
}

export function RelatedDocItem({ label, refType, icon, onClick }: RelatedDocItemProps) {
  return (
    <button
      type="button"
      className="moon-related-item"
      data-ref={refType}
      onClick={onClick}
    >
      <span className="moon-related-icon">{icon ?? <DefaultGlyph />}</span>
      <span className="moon-related-label">{label}</span>
      <span className="moon-related-tag">{refType === 'outgoing' ? '引用' : '被引用'}</span>
    </button>
  );
}

function DefaultGlyph() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.5 2.5h6L12.5 5.5v8a1 1 0 01-1 1h-8a1 1 0 01-1-1v-10a1 1 0 011-1z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}