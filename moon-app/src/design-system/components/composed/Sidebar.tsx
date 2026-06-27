'use client';

/**
 * Sidebar — 可折叠的侧栏容器。
 * 用法：左栏、右栏共用，区别只在 side prop 和内部布局。
 *
 * collapsed 状态由父组件控制（用 useSidebarState）。
 * 折叠后变 48px 宽，只露折叠按钮（chevron）+ tooltip 提示展开。
 */

import { type ReactNode } from 'react';
import { IconButton } from '../primitives/IconButton';
import { Tooltip } from '../primitives/Tooltip';
import './Sidebar.css';

export interface SidebarProps {
  side: 'left' | 'right';
  collapsed: boolean;
  onToggleCollapsed: () => void;
  children: ReactNode;
}

export function Sidebar({ side, collapsed, onToggleCollapsed, children }: SidebarProps) {
  return (
    <aside
      data-side={side}
      data-collapsed={collapsed || undefined}
      className="moon-sidebar"
    >
      <div className="moon-sidebar-content">{children}</div>
      <div className="moon-sidebar-edge">
        <Tooltip label={collapsed ? '展开' : '收起'} side={side === 'left' ? 'right' : 'left'}>
          <IconButton
            icon={
              side === 'left' ? (
                collapsed ? (
                  <ChevronRightGlyph />
                ) : (
                  <ChevronLeftGlyph />
                )
              ) : collapsed ? (
                <ChevronLeftGlyph />
              ) : (
                <ChevronRightGlyph />
              )
            }
            size="sm"
            onClick={onToggleCollapsed}
            aria-label={collapsed ? '展开侧栏' : '收起侧栏'}
          />
        </Tooltip>
      </div>
    </aside>
  );
}

// Inline SVG glyphs（先用本地 SVG 避免 lucide 版本不一致问题）
function ChevronLeftGlyph() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightGlyph() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}