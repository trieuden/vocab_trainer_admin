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
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
            {field.label}
          </span>
          <input
            type="text"
            value={values[field.key] ?? ''}
            onChange={(e) => onChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-2.5 py-1.5 text-[13px] border border-slate-300 dark:border-slate-700 rounded-md outline-none bg-white dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-normal focus:border-blue-500 dark:focus:border-blue-400 transition-colors box-border"
          />
        </label>
      ))}
    </div>
  );

  if (!collapsible) {
    return form;
  }

  return (
    <div className="w-full border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm transition-colors">
      <div
        onClick={() => setIsOpen((v) => !v)}
        className={`flex items-center justify-between cursor-pointer select-none transition-all duration-300 ${
          isOpen ? 'mb-3 pb-2 border-b border-slate-200 dark:border-slate-800' : ''
        }`}
      >
        <span className="text-[13px] font-medium text-slate-800 dark:text-slate-200">{panelTitle}</span>
        <button
          type="button"
          className="h-9 w-9 rounded-md bg-transparent border-none text-slate-500 dark:text-slate-400 cursor-pointer flex items-center justify-center hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          aria-label={isOpen ? 'Collapse advanced search' : 'Expand advanced search'}
        >
          <ChevronDown
            size={16}
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 300ms ease-in-out',
            }}
          />
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateRows: isOpen ? '1fr' : '0fr',
          opacity: isOpen ? 1 : 0,
          transition: 'all 300ms ease-in-out',
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {form}

            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 10 }}>
              <button
                type="button"
                onClick={onSearch}
                className="h-8 px-3 border-none rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 text-white cursor-pointer text-xs font-medium inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity"
              >
                <Search size={14} />
                {searchLabel ?? t('search')}
              </button>

              {onReset && (
                <button
                  type="button"
                  onClick={onReset}
                  className="h-8 px-3 border border-slate-300 dark:border-slate-700 rounded-md bg-transparent text-slate-700 dark:text-slate-300 cursor-pointer text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {resetLabel ?? t('cancel')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
