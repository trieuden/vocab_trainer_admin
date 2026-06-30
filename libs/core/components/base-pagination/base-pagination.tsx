'use client';
import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import styles from './base-pagination.module.css';

export interface BasePaginationProps {
  page: number;           // 1-based current page
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export function BasePagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  className = '',
}: BasePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = Math.min((page - 1) * pageSize + 1, total);
  const end = Math.min(page * pageSize, total);

  // Build page number buttons (show up to 5 around current)
  const getPages = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 4) pages.push('...');
      const lo = Math.max(2, page - 1);
      const hi = Math.min(totalPages - 1, page + 1);
      for (let i = lo; i <= hi; i++) pages.push(i);
      if (page < totalPages - 3) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {/* Info */}
      <span className={styles.info}>
        {total === 0 ? 'Không có dữ liệu' : `${start}–${end} / ${total} bản ghi`}
      </span>

      {/* Page size select */}
      {onPageSizeChange && (
        <div className={styles.pageSizeWrap}>
          <span className={styles.pageSizeLabel}>Hiển thị</span>
          <select
            className={styles.pageSizeSelect}
            value={pageSize}
            onChange={(e) => { onPageSizeChange(Number(e.target.value)); onPageChange(1); }}
          >
            {pageSizeOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}

      {/* Navigation */}
      <div className={styles.navWrap}>
        <button className={styles.navBtn} disabled={page <= 1} onClick={() => onPageChange(1)} title="Trang đầu">
          <ChevronsLeft size={14} />
        </button>
        <button className={styles.navBtn} disabled={page <= 1} onClick={() => onPageChange(page - 1)} title="Trang trước">
          <ChevronLeft size={14} />
        </button>

        {getPages().map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className={styles.ellipsis}>…</span>
          ) : (
            <button
              key={p}
              className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`}
              onClick={() => onPageChange(p as number)}
            >
              {p}
            </button>
          )
        )}

        <button className={styles.navBtn} disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} title="Trang sau">
          <ChevronRight size={14} />
        </button>
        <button className={styles.navBtn} disabled={page >= totalPages} onClick={() => onPageChange(totalPages)} title="Trang cuối">
          <ChevronsRight size={14} />
        </button>
      </div>
    </div>
  );
}
