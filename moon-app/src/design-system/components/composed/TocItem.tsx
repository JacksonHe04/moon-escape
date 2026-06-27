'use client';

/**
 * TocItem — 右栏「目录」tab 的 heading 项（完全重构为 Tailwind CSS，消除 TocItem.css 依赖）。
 */

import { type ReactNode } from 'react';

export interface TocItemProps {
  depth: number; // 1-6
  label: string;
  active?: boolean;
  onClick?: () => void;
  icon?: ReactNode;
}

export function TocItem({ depth, label, active = false, onClick, icon }: TocItemProps) {
  const cappedDepth = Math.min(Math.max(depth, 1), 6);
  const stateClasses = active
    ? 'text-accent font-semibold bg-accentMuted'
    : 'text-fgSecondary hover:bg-sidebarHoverBg hover:text-fg';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 w-full text-left py-1 px-2 rounded transition-colors duration-120 select-none font-sans text-xs ${stateClasses}`}
      style={{ paddingLeft: 8 + (cappedDepth - 1) * 12 }}
    >
      {icon && <span className="flex items-center justify-center flex-shrink-0">{icon}</span>}
      <span className="truncate flex-1">{label}</span>
    </button>
  );
}