'use client';

/**
 * Kbd — 键盘快捷键展示。
 * 用法：<Kbd>⌘ K</Kbd>、<Kbd>Esc</Kbd>
 */

import { type ReactNode } from 'react';
import './Kbd.css';

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="moon-kbd">{children}</kbd>;
}