'use client';

import React from 'react';
import styles from './base-stat-card.module.css';

export interface BaseStatCardProps {
  /** Tiêu đề nhỏ phía trên */
  label: string;
  /** Giá trị hiển thị to */
  value: string | number;
  /** Màu của value */
  color?: string;
  /** Dòng phụ bên dưới value */
  sub?: string;
  /** Icon hiện ở góc phải trên (optional) */
  icon?: React.ReactNode;
  /** Class tuỳ chỉnh bên ngoài */
  className?: string;
}

export function BaseStatCard({
  label,
  value,
  color = '#3b82f6',
  sub,
  icon,
  className = '',
}: BaseStatCardProps) {
  return (
    <div className={`${styles.card} ${className}`}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        {icon && <span className={styles.icon}>{icon}</span>}
      </div>
      <span className={styles.value} style={{ color }}>
        {value}
      </span>
      {sub && <span className={styles.sub}>{sub}</span>}
    </div>
  );
}
