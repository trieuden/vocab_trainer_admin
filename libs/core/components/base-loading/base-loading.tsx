'use client';

import React from 'react';

interface BaseLoadingProps {
  label?: string;
  size?: number;
  labelActive?: boolean;
}

export function BaseLoading({ label = 'Loading...', size = 28, labelActive = true }: BaseLoadingProps) {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: '20px 0',
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          border: '3px solid rgba(59,130,246,0.25)',
          borderTopColor: '#3b82f6',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      {labelActive && <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{label}</span>}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
