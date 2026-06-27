'use client';

/**
 * PropertyRow — 11 字段卡的最小单元。
 *
 * 布局：icon (左) + 字段名 (左) + 可编辑值 (右)
 * category = 'okf' → contract 色；'notion' → source 色
 */

import { type ReactNode } from 'react';
import './PropertyRow.css';

export interface PropertyRowProps {
  icon: ReactNode;
  name: string;
  value: ReactNode;
  category?: 'okf' | 'notion';
  onClick?: () => void;
  placeholder?: string;
}

export function PropertyRow({
  icon,
  name,
  value,
  category = 'okf',
  onClick,
  placeholder,
}: PropertyRowProps) {
  const hasValue = value !== null && value !== undefined && value !== '';
  return (
    <button
      type="button"
      className="moon-property-row"
      data-category={category}
      onClick={onClick}
    >
      <span className="moon-property-icon">{icon}</span>
      <span className="moon-property-name">{name}</span>
      <span className="moon-property-value" data-empty={!hasValue || undefined}>
        {hasValue ? value : placeholder ?? '点击编辑'}
      </span>
    </button>
  );
}