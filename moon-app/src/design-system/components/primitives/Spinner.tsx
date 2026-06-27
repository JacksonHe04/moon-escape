'use client';

/**
 * Spinner — 加载指示。
 * 极简：CSS-only 转圈，无依赖。
 */

import './Spinner.css';

export interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md';
}

export function Spinner({ size = 'md' }: SpinnerProps) {
  return <span className="moon-spinner" data-size={size} role="status" aria-label="loading" />;
}