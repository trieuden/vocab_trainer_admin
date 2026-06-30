'use client';

import React from 'react';

export interface BaseStatusBadgeProps {
  status: string;
  activeLabel?: string;
  inactiveLabel?: string;
}

export function BaseStatusBadge({
  status,
  activeLabel = 'Hoạt động',
  inactiveLabel = 'Khóa',
}: BaseStatusBadgeProps) {
  const isActive = status === 'active';
  return (
    <span
      suppressHydrationWarning
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '2px 10px',
        borderRadius: 99,
        fontSize: 12,
        fontWeight: 500,
        color: isActive ? '#10b981' : '#6b7280',
        background: isActive ? 'rgba(16,185,129,0.1)' : 'rgba(107,114,128,0.1)',
        border: `1px solid ${isActive ? 'rgba(16,185,129,0.2)' : 'rgba(107,114,128,0.2)'}`,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: isActive ? '#10b981' : '#9ca3af',
          display: 'inline-block',
        }}
      />
      {isActive ? activeLabel : inactiveLabel}
    </span>
  );
}
