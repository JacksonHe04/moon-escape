'use client';

/**
 * Input — 文本输入框。
 * 用途：顶栏搜索、属性面板字段值编辑等。
 */

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import './Input.css';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md';
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    size = 'md',
    iconLeft,
    iconRight,
    fullWidth = false,
    className,
    ...rest
  },
  ref,
) {
  return (
    <div
      data-size={size}
      data-full-width={fullWidth || undefined}
      className={['moon-input-wrap', className].filter(Boolean).join(' ')}
    >
      {iconLeft && <span className="moon-input-icon moon-input-icon-left">{iconLeft}</span>}
      <input ref={ref} className="moon-input" {...rest} />
      {iconRight && <span className="moon-input-icon moon-input-icon-right">{iconRight}</span>}
    </div>
  );
});