'use client';

/**
 * Divider — 水平分割线。
 */

import './Divider.css';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
}

export function Divider({ orientation = 'horizontal', spacing = 'md' }: DividerProps) {
  return <hr className="moon-divider" data-orient={orientation} data-spacing={spacing} />;
}