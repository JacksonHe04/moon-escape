'use client';

/**
 * SidebarItem — 左栏文件树的最小行单元。
 *
 * Notion 风格：
 * - 缩进用 padding-left
 * - 图标 + 名称
 * - 选中态：bg + accent color
 * - hover 态：bg subtle
 *
 * 可扩展：hasChildren + onToggle 控制展开 / 折叠。
 */

import { type ReactNode } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import './SidebarItem.css';

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
      data-active={active || undefined}
      data-depth={depth}
      className="moon-sidebar-item"
      style={{ paddingLeft: 8 + depth * 14 }}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {hasChildren ? (
        <button
          type="button"
          className="moon-sidebar-item-chevron"
          onClick={(e) => {
            e.stopPropagation();
            onToggle?.();
          }}
          aria-label={expanded ? '折叠' : '展开'}
        >
          {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </button>
      ) : (
        <span className="moon-sidebar-item-chevron-placeholder" />
      )}
      <span className="moon-sidebar-item-glyph">
        {emoji ? (
          <span className="moon-sidebar-item-emoji">{emoji}</span>
        ) : icon ? (
          icon
        ) : (
          <DefaultDocGlyph />
        )}
      </span>
      <span className="moon-sidebar-item-label">{label}</span>
    </div>
  );
}

function DefaultDocGlyph() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.5 2.5h6L12.5 5.5v8a1 1 0 01-1 1h-8a1 1 0 01-1-1v-10a1 1 0 011-1z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path d="M9.5 2.5v3h3" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}