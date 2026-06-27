'use client';

/**
 * Tooltip — 简易 tooltip。
 * 通过包裹 children + 监听 mouseEnter/Leave 实现。
 *
 * 简化版：不计算位置，只做基础 title 行为（浏览器原生）+ 自定义 UI。
 * 这里我们用 Radix 风格：CSS-only，hover 时显示，靠 sibling selector。
 */

import { type ReactNode } from 'react';
import './Tooltip.css';

export interface TooltipProps {
  label: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  children: ReactNode;
}

export function Tooltip({ label, side = 'bottom', children }: TooltipProps) {
  return (
    <span className="moon-tooltip-wrap" data-side={side}>
      {children}
      <span role="tooltip" className="moon-tooltip">
        {label}
      </span>
    </span>
  );
}