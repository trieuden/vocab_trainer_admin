'use client';

import React from 'react';
import styles from './base-button.module.css';

export type BaseButtonVariant = 'primary';

export interface BaseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BaseButtonVariant;
  /** Icon hoặc spinner đặt trước nội dung chữ */
  startIcon?: React.ReactNode;
}

export function BaseButton({
  variant = 'primary',
  className = '',
  startIcon,
  children,
  type = 'button',
  ...rest
}: BaseButtonProps) {
  const variantClass = variant === 'primary' ? styles.primary : '';
  return (
    <button type={type} className={`${styles.button} ${variantClass} ${className}`.trim()} {...rest}>
      {startIcon ? <span className={styles.iconSlot}>{startIcon}</span> : null}
      {children}
    </button>
  );
}
