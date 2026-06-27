'use client';

/**
 * SidebarItem — 左栏文件树的最小行单元（完全重构为 Tailwind CSS，并统一使用 Lucide 图标）。
 */

import { type ReactNode } from 'react';
import { ChevronRight, ChevronDown, FileText } from 'lucide-react';

export interface SidebarItemProps {
  icon?: ReactNode;
  emoji?: string;
  label: string;
  depth?: number;
  active?: boolean;
  hasChildren?: boolean;
  expanded?: boolean;
  onClick?: () => void;
  onToggle?: () => void;
}

export function SidebarItem({
  icon,
  emoji,
  label,
  depth = 0,
  active = false,
  hasChildren = false,
  expanded = false,
  onClick,
  onToggle,
}: SidebarItemProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={`flex items-center gap-1.5 py-1 px-2 cursor-pointer rounded transition-colors duration-120 text-[13px] font-sans select-none ${
        active
          ? 'bg-accentMuted text-accent'
          : 'text-fg hover:bg-sidebarHoverBg'
      }`}
      style={{ paddingLeft: 8 + depth * 14 }}
    >
      {hasChildren ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle?.();
          }}
          className="flex items-center justify-center w-4 h-4 rounded hover:bg-sidebarHoverBg text-fgMuted focus:outline-none"
          aria-label={expanded ? '折叠' : '展开'}
        >
          {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </button>
      ) : (
        <span className="w-4" />
      )}
      <span className="flex items-center justify-center w-4 h-4 flex-shrink-0">
        {emoji ? (
          <span className="text-sm leading-none">{emoji}</span>
        ) : icon ? (
          icon
        ) : (
          <FileText size={14} className="text-fgMuted" />
        )}
      </span>
      <span className="truncate flex-1 font-medium">{label}</span>
    </div>
  );
}