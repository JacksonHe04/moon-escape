'use client';

/**
 * Tabs — 图标 + 内容切换。
 * 用法：右栏顶部 3 tab 切换（属性 / 目录 / 关联）。
 *
 * 父组件控制激活状态，本组件只渲染触发器和 panel 容器。
 */

import { type ReactNode } from 'react';
import './Tabs.css';

export interface TabItem {
  id: string;
  icon: ReactNode;
  label: string;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
}

export function Tabs({ items, activeId, onChange }: TabsProps) {
  return (
    <div className="moon-tabs" role="tablist">
      {items.map((item) => (
        <button
          key={item.id}
          role="tab"
          aria-selected={item.id === activeId}
          data-active={item.id === activeId || undefined}
          className="moon-tab-trigger"
          onClick={() => onChange(item.id)}
          title={item.label}
        >
          <span className="moon-tab-icon">{item.icon}</span>
        </button>
      ))}
    </div>
  );
}