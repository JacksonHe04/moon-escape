'use client';

/**
 * Menu — 下拉菜单。
 *
 * 触发器 + 弹出层。
 * 弹出层定位：相对触发器绝对定位，CSS 控制方向。
 * 关闭逻辑：点击外部 / Esc。
 */

import {
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import './Menu.css';

export interface MenuItem {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  shortcut?: string;
  onSelect: () => void;
  disabled?: boolean;
  danger?: boolean;
  separatorAfter?: boolean;
}

export interface MenuProps {
  trigger: ReactElement;
  items: MenuItem[];
  align?: 'start' | 'end';
}

export function Menu({ trigger, items, align = 'start' }: MenuProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  // clone 触发器，挂 onClick
  const clonedTrigger = isValidElement(trigger)
    ? cloneElement(trigger as ReactElement<{ onClick?: (e: React.MouseEvent) => void }>, {
        onClick: (e: React.MouseEvent) => {
          e.stopPropagation();
          setOpen((v) => !v);
          // 触发器原有的 onClick 仍可被调用
          const handler = (trigger.props as { onClick?: (e: React.MouseEvent) => void }).onClick;
          handler?.(e);
        },
      })
    : trigger;

  return (
    <div className="moon-menu-wrap" ref={wrapRef}>
      {clonedTrigger}
      {open && (
        <div
          role="menu"
          data-align={align}
          className="moon-menu"
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((item) => (
            <div key={item.id}>
              <button
                role="menuitem"
                data-danger={item.danger || undefined}
                disabled={item.disabled}
                className="moon-menu-item"
                onClick={() => {
                  if (item.disabled) return;
                  item.onSelect();
                  setOpen(false);
                }}
              >
                {item.icon && <span className="moon-menu-icon">{item.icon}</span>}
                <span className="moon-menu-label">{item.label}</span>
                {item.shortcut && (
                  <span className="moon-menu-shortcut">{item.shortcut}</span>
                )}
              </button>
              {item.separatorAfter && <div className="moon-menu-sep" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}