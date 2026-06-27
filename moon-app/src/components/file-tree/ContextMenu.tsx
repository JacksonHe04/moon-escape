'use client';

import { useEffect, useRef, useState } from 'react';

type ContextMenuProps = {
  x: number;
  y: number;
  onClose: () => void;
  actions: { label: string; onClick: () => void; danger?: boolean }[];
};

export function ContextMenu({ x, y, onClose, actions }: ContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div ref={ref} className="context-menu" style={{ left: x, top: y }}>
      {actions.map((a, i) => (
        <div
          key={i}
          className={a.danger ? 'menu-item danger' : 'menu-item'}
          onClick={() => { a.onClick(); onClose(); }}
        >
          {a.label}
        </div>
      ))}
    </div>
  );
}

type PromptDialogProps = {
  title: string;
  defaultValue?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
};

export function PromptDialog({ title, defaultValue, onConfirm, onCancel }: PromptDialogProps) {
  const [value, setValue] = useState(defaultValue ?? '');
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && value.trim()) onConfirm(value.trim());
            if (e.key === 'Escape') onCancel();
          }}
        />
        <div className="modal-actions">
          <button onClick={onCancel}>取消</button>
          <button onClick={() => value.trim() && onConfirm(value.trim())} disabled={!value.trim()}>确定</button>
        </div>
      </div>
    </div>
  );
}

type ConfirmDialogProps = {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({ title, message, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onCancel}>取消</button>
          <button className="danger" onClick={onConfirm}>删除</button>
        </div>
      </div>
    </div>
  );
}
