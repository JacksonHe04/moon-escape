'use client';

/**
 * WorkspaceSwitcher — 左栏顶部的工作区切换器（灰色圆角边框包裹，去掉月亮图标与分割线）。
 */

import { ChevronDown, RefreshCw, AlertCircle } from 'lucide-react';

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
  const isUnsupported = status === 'unsupported';
  const needsReauth = status === 'needs-reauth';

  return (
    <div className="flex flex-col gap-1 p-4 pb-2 w-full">
      {/* 工作区行：灰色圆角边框包裹，不要月亮 icon。背景比侧栏更深一点让边框可见 */}
      <button
        type="button"
        onClick={onPick}
        disabled={isUnsupported}
        className="flex items-center gap-2.5 w-full text-left py-2.5 px-3.5 border border-borderStrong/60 rounded-lg bg-appBg hover:bg-sidebarHoverBg hover:border-accent/40 transition-all duration-120 select-none font-sans text-fg disabled:cursor-not-allowed focus:outline-none shadow-xs"
        title={isUnsupported ? '浏览器不支持 File System Access API' : '点击切换工作区'}
      >
        <span className="flex-1 truncate text-[13px] font-semibold text-fg">
          {name ?? '未选择工作区'}
        </span>
        {needsReauth ? (
          <span
            role="button"
            className="flex items-center justify-center p-1 rounded hover:bg-sidebarActiveBg text-accent cursor-pointer transition-colors duration-120"
            title="重新申请访问权限"
            onClick={(e) => {
              e.stopPropagation();
              onReauthorize();
            }}
          >
            <RefreshCw size={12} className="animate-spin-slow" />
          </span>
        ) : (
          <ChevronDown size={13} className="text-fgMuted flex-shrink-0" />
        )}
      </button>

      {/* 状态提示 */}
      {status === 'needs-reauth' && (
        <div className="flex items-center gap-1.5 px-3.5 py-1 text-xs text-warning font-sans mt-0.5">
          <AlertCircle size={12} className="flex-shrink-0" />
          <span>权限失效，请重新授权</span>
        </div>
      )}
      {status === 'denied' && (
        <div className="flex items-center gap-1.5 px-3.5 py-1 text-xs text-danger font-sans mt-0.5">
          <AlertCircle size={12} className="flex-shrink-0" />
          <span>权限被拒绝</span>
        </div>
      )}
      {status === 'unsupported' && (
        <div className="flex items-center gap-1.5 px-3.5 py-1 text-xs text-danger font-sans mt-0.5">
          <AlertCircle size={12} className="flex-shrink-0" />
          <span>请用 Chrome / Edge / Arc</span>
        </div>
      )}
    </div>
  );
}