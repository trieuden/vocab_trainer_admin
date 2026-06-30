'use client';

import React from 'react';

export interface BaseToolbarProps {
  children: React.ReactNode;
}

export function BaseToolbar({ children }: BaseToolbarProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>{children}</div>
  );
}
