'use client';

/**
 * RelatedDocItem — 关联文档行（完全重构为 Tailwind CSS，消除 RelatedDocItem.css 依赖，并统一使用 Lucide 图标）。
 */

import { type ReactNode } from 'react';
import { FileText } from 'lucide-react';

export type RelatedRefType = 'outgoing' | 'incoming';

export interface RelatedDocItemProps {
  label: string;
  refType: RelatedRefType;
  icon?: ReactNode;
  onClick?: () => void;
}

export function RelatedDocItem({ label, refType, icon, onClick }: RelatedDocItemProps) {
  const tagClasses = refType === 'outgoing'
    ? 'bg-accentMuted text-accent'
    : 'bg-sidebarActiveBg text-fgMuted';

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 w-full text-left py-1.5 px-2.5 rounded transition-colors duration-120 select-none font-sans text-xs hover:bg-sidebarHoverBg text-fgSecondary hover:text-fg focus:outline-none"
    >
      <span className="flex items-center justify-center flex-shrink-0 text-fgMuted">
        {icon ?? <FileText size={14} />}
      </span>
      <span className="truncate flex-1 font-medium">{label}</span>
      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold flex-shrink-0 tracking-wider ${tagClasses}`}>
        {refType === 'outgoing' ? '引用' : '被引用'}
      </span>
    </button>
  );
}