'use client';

/**
 * Breadcrumb — 路径面包屑。
 * 传入 path segments，每段可点击 / 不可点击。
 *
 * 用法：<Breadcrumb path={['a', 'b', 'c.md']} />
 */

import { Fragment, type ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import './Breadcrumb.css';

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
    <nav aria-label="路径" className="moon-breadcrumb">
      {root && <span className="moon-breadcrumb-root">{root}</span>}
      {segments.map((seg, i) => {
        const isLast = i === segments.length - 1;
        return (
          <Fragment key={`${seg.label}-${i}`}>
            {(i > 0 || root) && (
              <span className="moon-breadcrumb-sep" aria-hidden>
                <ChevronRight size={12} />
              </span>
            )}
            {seg.onClick && !isLast ? (
              <button
                type="button"
                className="moon-breadcrumb-item moon-breadcrumb-item-clickable"
                onClick={seg.onClick}
              >
                {seg.label}
              </button>
            ) : (
              <span className="moon-breadcrumb-item" data-current={isLast || undefined}>
                {seg.label}
              </span>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}