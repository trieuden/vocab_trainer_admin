'use client';

import React from 'react';

export interface BasePageHeaderProps {
  title: string;
  description: string;
}

export function BasePageHeader({ title, description }: BasePageHeaderProps) {
  return (
    <div>
      <h1
        suppressHydrationWarning
        style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}
      >
        {title}
      </h1>
      <p suppressHydrationWarning style={{ margin: '4px 0 0', fontSize: 13.5, color: '#6b7280' }}>
        {description}
      </p>
    </div>
  );
}
