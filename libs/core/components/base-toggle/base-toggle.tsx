'use client';
import React, { useId } from 'react';
import styles from './base-toggle.module.css';

export interface BaseToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export function BaseToggle({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md',
}: BaseToggleProps) {
  const id = useId();

  return (
    <label
      htmlFor={id}
      className={`${styles.label} ${disabled ? styles.disabled : ''}`}
    >
      <span
        className={`${styles.track} ${styles[size]} ${checked ? styles.trackOn : styles.trackOff}`}
      >
        <input
          id={id}
          type="checkbox"
          className={styles.input}
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className={`${styles.thumb} ${checked ? styles.thumbOn : ''} ${styles[`thumb_${size}`]}`} />
      </span>
      {label && <span className={styles.labelText}>{label}</span>}
    </label>
  );
}
