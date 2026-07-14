'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface AdvancedSearchField {
  key: string;
  label: string;
  placeholder?: string;
  width?: string | number;
}

interface BaseAdvancedSearchProps {
  fields: AdvancedSearchField[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onSearch?: () => void;
  onReset?: () => void;
  /** Nhãn nút Tìm kiếm (bắt buộc khi có onSearch) */
  searchLabel?: string;
  /** Nhãn nút xóa bộ lọc */
  resetLabel?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  panelTitle?: string;
}

export function BaseAdvancedSearch({
  fields,
  values,
  onChange,
  onSearch,
  onReset,
  searchLabel,
  resetLabel,
  collapsible = true,
  defaultOpen = false,
  panelTitle = 'Advanced Search',
}: BaseAdvancedSearchProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { t } = useTranslation('common');
  const form = (
    <div
      style={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 12,
      }}
    >
      {fields.map((field) => (
        <label
          key={field.key}
          style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0, maxWidth: field.width }}
        >
          <span style={{ fontSize: 12, color: '#1e293b', fontWeight: 700 }}>
            {field.label}
          </span>
          <input
            type="text"
            value={values[field.key] ?? ''}
            onChange={(e) => onChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            style={{
              width: '100%',
              padding: '8px 10px',
              fontSize: 13,
              border: '1px solid #d1d5db',
              borderRadius: 6,
              outline: 'none',
              background: 'transparent',
              color: 'inherit',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          />
        </label>
      ))}

    </div>
  );

  if (!collapsible) {
    return form;
  }

  return (
    <div
      style={{
        width: '100%',
        border: '1px solid #d1d5db',
        borderRadius: 8,
        padding: '8px 16px 8px 16px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: isOpen ? 10 : 0,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{panelTitle}</span>
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          style={{
            height: 36,
            // padding: '0 12px',
            // border: '1px solid #d1d5db',
            borderRadius: 6,
            background: 'transparent',
            color: 'inherit',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
          }}
          aria-label={isOpen ? 'Collapse advanced search' : 'Expand advanced search'}
        >
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {isOpen ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {form}

          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button
              type="button"
              onClick={onSearch}
              style={{
                height: 36,
                padding: '0 12px',
                border: 'none',
                borderRadius: 6,
                background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                color: '#fff',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Search size={14} />
              {searchLabel ?? t('search')}
            </button>

            {onReset && (
              <button
                type="button"
                onClick={onReset}
                style={{
                  height: 36,
                  padding: '0 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: 6,
                  background: 'transparent',
                  color: 'inherit',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {resetLabel ?? t('cancel')}
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
