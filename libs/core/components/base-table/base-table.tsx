'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings2, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import styles from './base-table.module.css';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type SortDirection = 'asc' | 'desc' | null;

export interface BaseTableColumn<T = Record<string, unknown>> {
  /** Unique key matching a field in the data row (or custom render) */
  key: string;
  /** Header label */
  title: React.ReactNode;
  /** Render a custom cell. Receives the row and its index. */
  render?: (row: T, rowIndex: number) => React.ReactNode;
  /** Initial column width in pixels. Defaults to 150. */
  width?: number;
  /** Minimum column width in pixels. Defaults to 60. */
  minWidth?: number;
  /** Whether the column can be sorted. Defaults to false. */
  sortable?: boolean;
  /** Whether the column can be hidden via the column picker. Defaults to true. */
  hideable?: boolean;
  /** Whether the column is visible by default. Defaults to true. */
  defaultVisible?: boolean;
  /** Alignment for both header and cell. Defaults to 'left'. */
  align?: 'left' | 'center' | 'right';
  /** Ghim cột khi cuộn ngang: trái hoặc phải (nhiều cột ghim cùng phía được xếp theo thứ tự). */
  pinned?: 'left' | 'right';
}

export interface BaseTableProps<T = Record<string, unknown>> {
  columns: BaseTableColumn<T>[];
  data: T[];
  /** Row key accessor – returns a unique string/number for each row */
  rowKey?: (row: T, index: number) => React.Key;
  /** Show a loading skeleton overlay */
  loading?: boolean;
  /** Empty-state message */
  emptyText?: string;
  /** Called when a sortable column header is clicked */
  onSort?: (key: string, direction: SortDirection) => void;
  className?: string;
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function defaultRowKey<T>(_row: T, index: number): React.Key {
  return index;
}

/** Luôn kèm index để tránh trùng key khi rowKey (vd. theo từ) lặp lại giữa các dòng. */
function stableTrKey<T>(rowKeyFn: (row: T, index: number) => React.Key, row: T, ri: number): string {
  return `${String(rowKeyFn(row, ri))}::${ri}`;
}

function stickyLeftOffset<T>(
  visibleColumns: BaseTableColumn<T>[],
  colIndex: number,
  widths: Record<string, number>
): number | null {
  const col = visibleColumns[colIndex];
  if (col.pinned !== 'left') return null;
  let offset = 0;
  for (let j = 0; j < colIndex; j++) {
    if (visibleColumns[j].pinned === 'left') {
      offset += widths[visibleColumns[j].key] ?? 150;
    }
  }
  return offset;
}

function stickyRightOffset<T>(
  visibleColumns: BaseTableColumn<T>[],
  colIndex: number,
  widths: Record<string, number>
): number | null {
  const col = visibleColumns[colIndex];
  if (col.pinned !== 'right') return null;
  let offset = 0;
  for (let j = visibleColumns.length - 1; j > colIndex; j--) {
    if (visibleColumns[j].pinned === 'right') {
      offset += widths[visibleColumns[j].key] ?? 150;
    }
  }
  return offset;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

function BaseTableInner<T = Record<string, unknown>>(
  props: BaseTableProps<T>,
  _ref: React.ForwardedRef<HTMLDivElement>
) {
  const {
    columns,
    data,
    rowKey = defaultRowKey,
    loading = false,
    emptyText,
    onSort,
    className = '',
  } = props;

  const { t } = useTranslation('common');
  const resolvedEmptyText = emptyText ?? t('no_data');

  // ── Column visibility ──────────────────────────────────────────────────
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(() => {
    const set = new Set<string>();
    columns.forEach((col) => {
      if (col.defaultVisible !== false) set.add(col.key);
    });
    return set;
  });

  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close picker when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    }
    if (pickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [pickerOpen]);

  const toggleColumn = (key: string) => {
    setVisibleKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        // Prevent hiding the last visible column
        if (next.size <= 1) return prev;
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  // ── Column widths ──────────────────────────────────────────────────────
  const [widths, setWidths] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    columns.forEach((col) => {
      map[col.key] = col.width ?? 150;
    });
    return map;
  });

  const resizingRef = useRef<{
    key: string;
    startX: number;
    startWidth: number;
    minWidth: number;
  } | null>(null);

  const onResizeMouseDown = useCallback(
    (e: React.MouseEvent, col: BaseTableColumn<T>) => {
      e.preventDefault();
      resizingRef.current = {
        key: col.key,
        startX: e.clientX,
        startWidth: widths[col.key] ?? 150,
        minWidth: col.minWidth ?? 60,
      };

      const onMouseMove = (mv: MouseEvent) => {
        if (!resizingRef.current) return;
        const delta = mv.clientX - resizingRef.current.startX;
        const newWidth = Math.max(
          resizingRef.current.minWidth,
          resizingRef.current.startWidth + delta
        );
        setWidths((prev) => ({ ...prev, [resizingRef.current!.key]: newWidth }));
      };

      const onMouseUp = () => {
        resizingRef.current = null;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [widths]
  );

  // ── Sorting ────────────────────────────────────────────────────────────
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>(null);

  const handleSort = (col: BaseTableColumn<T>) => {
    if (!col.sortable) return;
    let nextDir: SortDirection;
    if (sortKey !== col.key) {
      nextDir = 'asc';
    } else if (sortDir === 'asc') {
      nextDir = 'desc';
    } else if (sortDir === 'desc') {
      nextDir = null;
    } else {
      nextDir = 'asc';
    }
    const nextKey = nextDir === null ? null : col.key;
    setSortKey(nextKey);
    setSortDir(nextDir);
    onSort?.(col.key, nextDir);
  };

  // ── Derived visible columns ────────────────────────────────────────────
  const visibleColumns = columns.filter((col) => visibleKeys.has(col.key));
  const hideableColumns = columns.filter((col) => col.hideable !== false);

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────
  return (
    <div className={`${styles.wrapper} ${className}`}>
      {/* ── Toolbar ── */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarRight} ref={pickerRef}>
          <button
            className={styles.pickerBtn}
            onClick={() => setPickerOpen((v) => !v)}
            title={t('show_hide_columns_title')}
          >
            <Settings2 size={15} />
            {/* <span>{t('columns')}</span> */}
          </button>

          {pickerOpen && (
            <div className={styles.pickerDropdown}>
              <p className={styles.pickerTitle}>{t('toggle_columns')}</p>
              <ul>
                {hideableColumns.map((col) => {
                  const isVisible = visibleKeys.has(col.key);
                  return (
                    <li key={col.key}>
                      <label className={styles.pickerItem}>
                        <input
                          type="checkbox"
                          checked={isVisible}
                          onChange={() => toggleColumn(col.key)}
                        />
                        <span>{col.title}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div className={styles.scrollContainer}>
        <table
          className={styles.table}
          style={{ tableLayout: 'fixed', width: 'max-content', minWidth: '100%' }}
        >
          <colgroup>
            {visibleColumns.map((col) => (
              <col key={col.key} style={{ width: widths[col.key] }} />
            ))}
          </colgroup>

          <thead className={styles.thead}>
            <tr>
              {visibleColumns.map((col, colIndex) => {
                const isSorting = sortKey === col.key;
                const align = col.align ?? 'left';
                const leftPin = stickyLeftOffset(visibleColumns, colIndex, widths);
                const rightPin = stickyRightOffset(visibleColumns, colIndex, widths);
                const pinClass =
                  leftPin !== null ? styles.thPinnedLeft : rightPin !== null ? styles.thPinnedRight : '';

                return (
                  <th
                    key={col.key}
                    className={`${styles.th} ${col.sortable ? styles.thSortable : ''} ${pinClass}`}
                    style={{
                      textAlign: align,
                      userSelect: 'none',
                      ...(leftPin !== null ? { left: leftPin } : {}),
                      ...(rightPin !== null ? { right: rightPin } : {}),
                    }}
                    onClick={() => handleSort(col)}
                  >
                    <div className={styles.thInner}>
                      <span className={styles.thLabel}>{col.title}</span>

                      {col.sortable && (
                        <span className={styles.sortIcon}>
                          {isSorting && sortDir === 'asc' ? (
                            <ChevronUp size={13} />
                          ) : isSorting && sortDir === 'desc' ? (
                            <ChevronDown size={13} />
                          ) : (
                            <ChevronsUpDown size={13} className={styles.sortIdle} />
                          )}
                        </span>
                      )}
                    </div>

                    {/* Resize handle */}
                    <div
                      className={styles.resizeHandle}
                      onMouseDown={(e) => onResizeMouseDown(e, col)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, ri) => (
                <tr key={ri} className={styles.skeletonRow}>
                  {visibleColumns.map((col, colIndex) => {
                    const leftPin = stickyLeftOffset(visibleColumns, colIndex, widths);
                    const rightPin = stickyRightOffset(visibleColumns, colIndex, widths);
                    const pinClass =
                      leftPin !== null ? styles.tdPinnedLeft : rightPin !== null ? styles.tdPinnedRight : '';
                    return (
                      <td
                        key={col.key}
                        className={`${styles.td} ${pinClass}`}
                        style={{
                          ...(leftPin !== null ? { left: leftPin } : {}),
                          ...(rightPin !== null ? { right: rightPin } : {}),
                        }}
                      >
                        <div className={styles.skeletonCell} />
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length} className={styles.empty}>
                  {resolvedEmptyText}
                </td>
              </tr>
            ) : (
              data?.map((row, ri) => (
                <tr key={stableTrKey(rowKey, row, ri)} className={styles.row}>
                  {visibleColumns.map((col, colIndex) => {
                    const align = col.align ?? 'left';
                    const raw = (row as Record<string, unknown>)[col.key];
                    const leftPin = stickyLeftOffset(visibleColumns, colIndex, widths);
                    const rightPin = stickyRightOffset(visibleColumns, colIndex, widths);
                    const pinClass =
                      leftPin !== null ? styles.tdPinnedLeft : rightPin !== null ? styles.tdPinnedRight : '';
                    return (
                      <td
                        key={col.key}
                        className={`${styles.td} ${pinClass}`}
                        style={{
                          textAlign: align,
                          ...(leftPin !== null ? { left: leftPin } : {}),
                          ...(rightPin !== null ? { right: rightPin } : {}),
                        }}
                      >
                        {col.render
                          ? col.render(row, ri)
                          : raw !== undefined && raw !== null
                          ? String(raw)
                          : '—'}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const BaseTable = React.forwardRef(BaseTableInner) as <
  T = Record<string, unknown>
>(
  props: BaseTableProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement;
