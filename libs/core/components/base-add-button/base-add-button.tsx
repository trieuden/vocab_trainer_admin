'use client';

import React from 'react';

export interface BaseAddButtonProps {
  label: string;
  onClick: () => void;
}

export function BaseAddButton({ label, onClick }: BaseAddButtonProps) {
  return (
    <button
      onClick={onClick}
      suppressHydrationWarning
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: '8px 16px',
        fontSize: 13,
        fontWeight: 600,
        color: '#fff',
        background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
        border: 'none',
        borderRadius: 9,
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(59,130,246,0.35)',
        fontFamily: 'inherit',
        marginLeft: 'auto',
        flexShrink: 0,
      }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M12 5v14M5 12h14" />
      </svg>
      {label}
    </button>
  );
}
