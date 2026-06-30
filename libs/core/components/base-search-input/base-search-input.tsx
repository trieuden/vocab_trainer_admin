'use client';

import React from 'react';

export interface BaseSearchInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function BaseSearchInput({
  value,
  onChange,
  placeholder = 'Tìm kiếm...',
}: BaseSearchInputProps) {
  return (
    <div style={{ position: 'relative', flex: '1 1 220px', maxWidth: 320 }}>
      <svg
        style={{
          position: 'absolute',
          left: 11,
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#9ca3af',
          pointerEvents: 'none',
        }}
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          paddingLeft: 32,
          paddingRight: 12,
          paddingTop: 8,
          paddingBottom: 8,
          fontSize: 13,
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          outline: 'none',
          background: 'transparent',
          color: 'inherit',
          fontFamily: 'inherit',
          boxSizing: 'border-box',
        }}
      />
    </div>
  );
}
