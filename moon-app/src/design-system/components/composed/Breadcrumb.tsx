'use client';

/**
 * Breadcrumb — 路径面包屑（完全重构为 Tailwind CSS）。
 */

import { Fragment, type ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbSegment {
  label: string;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  segments: BreadcrumbSegment[];
  root?: ReactNode;
}

export function Breadcrumb({ segments, root }: BreadcrumbProps) {
  return (
    <nav aria-label="路径" className="flex items-center gap-1.5 min-w-0 max-w-full text-xs font-sans text-fgMuted select-none">
      {root && <span className="flex items-center text-fgMuted flex-shrink-0">{root}</span>}
      {segments.map((seg, i) => {
        const isLast = i === segments.length - 1;
        return (
          <Fragment key={`${seg.label}-${i}`}>
            {(i > 0 || root) && (
              <span className="flex items-center text-fgMuted/50 flex-shrink-0" aria-hidden>
                <ChevronRight size={12} />
              </span>
            )}
            {seg.onClick && !isLast ? (
              <button
                type="button"
                className="truncate max-w-[140px] font-medium cursor-pointer hover:text-fg hover:underline focus:outline-none"
                onClick={seg.onClick}
              >
                {seg.label}
              </button>
            ) : (
              <span className={`truncate font-medium ${isLast ? 'text-fg font-semibold max-w-[200px]' : 'max-w-[140px]'}`}>
                {seg.label}
              </span>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}