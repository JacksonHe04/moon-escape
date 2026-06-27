'use client';

/**
 * IconButton — 方形按钮，只放图标。
 * 用于 toolbar、tab 切换、三点菜单触发器等。
 */

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import './IconButton.css';

export type IconButtonSize = 'sm' | 'md';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  size?: IconButtonSize;
  active?: boolean;
  'aria-label': string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    { icon, size = 'md', active = false, className, ...rest },
    ref,
  ) {
    return (
      <button
        ref={ref}
        data-size={size}
        data-active={active || undefined}
        className={['moon-icon-btn', className].filter(Boolean).join(' ')}
        {...rest}
      >
        <span className="moon-icon-btn-glyph">{icon}</span>
      </button>
    );
  },
);