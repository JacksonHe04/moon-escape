'use client';

/**
 * TocItem — 右栏「目录」tab 的 heading 项。
 *
 * depth 决定左缩进；active 表示当前视口正显示这个 heading。
 */

import { type ReactNode } from 'react';
import './TocItem.css';

export interface TocItemProps {
  depth: number; // 1-6
  label: string;
  active?: boolean;
  onClick?: () => void;
  icon?: ReactNode;
}

export function TocItem({ depth, label, active = false, onClick, icon }: TocItemProps) {
  const cappedDepth = Math.min(Math.max(depth, 1), 6);
  return (
    <button
      type="button"
      className="moon-toc-item"
      data-depth={cappedDepth}
      data-active={active || undefined}
      onClick={onClick}
      style={{ paddingLeft: 8 + (cappedDepth - 1) * 12 }}
    >
      {icon && <span className="moon-toc-icon">{icon}</span>}
      <span className="moon-toc-label">{label}</span>
    </button>
  );
}