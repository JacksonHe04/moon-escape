'use client';

/**
 * WorkspaceSwitcher — 左栏顶部的工作区切换器。
 *
 * 点击展开菜单：
 * - 当前工作区名称（不可点）
 * - "切换目录" → 触发 onPick
 * - "重新授权" → 触发 onReauthorize（仅 status === 'needs-reauth'）
 * - 当前状态文字
 */

import { ChevronDown, FolderOpen, RefreshCw, AlertCircle } from 'lucide-react';
import { useTheme } from '../../theme';
import { Menu, type MenuItem } from '../primitives/Menu';
import { IconButton } from '../primitives/IconButton';
import './WorkspaceSwitcher.css';

export type WorkspaceStatus =
  | 'unsupported'
  | 'idle'
  | 'ready'
  | 'needs-reauth'
  | 'denied';

export interface WorkspaceSwitcherProps {
  name: string | null;
  status: WorkspaceStatus;
  onPick: () => void;
  onReauthorize: () => void;
}

export function WorkspaceSwitcher({
  name,
  status,
  onPick,
  onReauthorize,
}: WorkspaceSwitcherProps) {
  const { resolved } = useTheme();

  const items: MenuItem[] = [
    {
      id: 'pick',
      label: name ? '切换目录' : '选择目录',
      icon: <FolderOpen size={14} />,
      onSelect: onPick,
      disabled: status === 'unsupported',
    },
    ...(status === 'needs-reauth'
      ? [
          {
            id: 'reauth',
            label: '重新授权',
            icon: <RefreshCw size={14} />,
            onSelect: onReauthorize,
          } as MenuItem,
        ]
      : []),
  ];

  return (
    <div className="moon-workspace">
      <Menu
        trigger={
          <button type="button" className="moon-workspace-trigger" data-theme={resolved}>
            <span className="moon-workspace-glyph">
              <MoonLogo />
            </span>
            <span className="moon-workspace-name">{name ?? '未选择工作区'}</span>
            <span className="moon-workspace-chevron">
              <ChevronDown size={12} />
            </span>
          </button>
        }
        items={items}
        align="start"
      />
      {status === 'needs-reauth' && (
        <div className="moon-workspace-warn">
          <AlertCircle size={12} />
          <span>权限失效，请重新授权</span>
        </div>
      )}
      {status === 'denied' && (
        <div className="moon-workspace-warn">
          <AlertCircle size={12} />
          <span>权限被拒绝，缓存已清</span>
        </div>
      )}
      {status === 'unsupported' && (
        <div className="moon-workspace-warn">
          <AlertCircle size={12} />
          <span>浏览器不支持 File System Access API</span>
        </div>
      )}
    </div>
  );
}

// 简易 MOON 字标（项目 logo），先用文字+月相图形占位
function MoonLogo() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="6" fill="currentColor" />
      <circle cx="11" cy="6" r="5" fill="var(--moon-sidebarBg, #f1f1ef)" />
    </svg>
  );
}