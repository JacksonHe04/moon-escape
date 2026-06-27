'use client';

/**
 * Button
 *
 * 变体：primary / ghost / danger
 * 尺寸：sm / md
 * 状态：default / hover / active / disabled / loading
 *
 * Notion 风格：克制、扁平、hover 给一点 bg，不靠 shadow。
 */

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Spinner } from './Spinner';
import './Button.css';

export type ButtonVariant = 'primary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'ghost',
    size = 'md',
    loading = false,
    iconLeft,
    iconRight,
    fullWidth = false,
    children,
    disabled,
    className,
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      data-full-width={fullWidth || undefined}
      disabled={disabled || loading}
      className={['moon-btn', className].filter(Boolean).join(' ')}
      {...rest}
    >
      {loading ? (
        <Spinner size="sm" />
      ) : iconLeft ? (
        <span className="moon-btn-icon">{iconLeft}</span>
      ) : null}
      {children && <span className="moon-btn-label">{children}</span>}
      {iconRight && !loading && <span className="moon-btn-icon">{iconRight}</span>}
    </button>
  );
});