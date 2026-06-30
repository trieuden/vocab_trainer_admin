'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import styles from './base-popup.module.css';

export interface BasePopupProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function BasePopup({ open, title, onClose, children }: BasePopupProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.popup}
        role="dialog"
        aria-modal="true"
        aria-labelledby="base-popup-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          <h3 id="base-popup-title" className={styles.title}>
            {title}
          </h3>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Đóng popup">
            <X size={18} />
          </button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
