'use client';

import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import styles from './base-drawer.module.css';

export interface BaseDrawerProps {
  open: boolean;
  title: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
  /** Width của Drawer (vd: '600px', '800px', '75vw', 800). Mặc định là '800px'. */
  width?: string | number;
  /** Tùy chọn footer cố định ở đáy drawer nếu cần */
  footer?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  /** Cho phép đóng khi bấm vào nền mờ (mặc định: true) */
  closeOnOverlayClick?: boolean;
  /** Cho phép đóng khi bấm phím ESC (mặc định: true) */
  closeOnEsc?: boolean;
}

export function BaseDrawer({
  open,
  title,
  onClose,
  children,
  width = '800px',
  footer,
  className = '',
  bodyClassName = '',
  headerClassName = '',
  footerClassName = '',
  closeOnOverlayClick = true,
  closeOnEsc = true,
}: BaseDrawerProps) {
  // Đóng khi nhấn phím Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === 'Escape') {
        onClose();
      }
    },
    [closeOnEsc, onClose]
  );

  // Khóa cuộn trang khi drawer mở
  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, handleKeyDown]);

  if (!open || typeof window === 'undefined') {
    return null;
  }

  const resolvedWidth = typeof width === 'number' ? `${width}px` : width;

  return createPortal(
    <div
      className={styles.overlay}
      onClick={() => {
        if (closeOnOverlayClick) onClose();
      }}
      aria-hidden="true"
    >
      <div
        className={`${styles.drawer} ${className}`.trim()}
        style={{ width: resolvedWidth }}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`${styles.header} ${headerClassName}`.trim()}>
          <h2 className={styles.title}>{title}</h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Đóng drawer"
            title="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nội dung */}
        <div className={`${styles.body} custom-scrollbar ${bodyClassName}`.trim()}>
          {children}
        </div>

        {/* Footer (nếu có) */}
        {footer && (
          <div className={`${styles.footer} ${footerClassName}`.trim()}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
