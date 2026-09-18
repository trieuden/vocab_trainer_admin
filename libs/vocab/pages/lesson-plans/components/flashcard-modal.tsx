'use client';

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Trash2 } from 'lucide-react';
import { BaseButton, BaseTable, type BaseTableColumn } from '@/core/components';
import type { LessonPlanFlashcardApi } from '../hooks/flash-card';

interface FlashcardModalProps {
  flashcard: LessonPlanFlashcardApi;
  onRemoveWord?: (word: string) => void;
}

export const FlashcardModal = ({ flashcard, onRemoveWord }: FlashcardModalProps) => {
  const { inputWord, setInputWord, showSuggest, setShowSuggest, suggestions, loading, words, loadingMap, handleAddWord, removeWord, generateLoading, generateDefinitions, generateAllDefinitions } =
    flashcard;

  const { t } = useTranslation('common');
  const { t: tl } = useTranslation('lesson_plans');

  const columns = useMemo<BaseTableColumn<any>[]>(
    () => [
      {
        key: 'stt',
        title: tl('flashcard.col_stt'),
        width: 56,
        minWidth: 48,
        hideable: false,
        align: 'center',
        render: (_row, rowIndex) => rowIndex + 1,
      },
      {
        key: 'word',
        title: tl('flashcard.col_word'),
        width: 140,
        minWidth: 80,
        hideable: false,
        render: (row) => row?.word ?? t('dash'),
      },
      {
        key: 'audio',
        title: tl('flashcard.col_audio'),
        width: 200,
        minWidth: 100,
        render: (row) => row?.audio ?? '—',
      },
      {
        key: 'phonetic',
        title: tl('flashcard.col_phonetic'),
        width: 140,
        minWidth: 80,
        render: (row) => row?.phoneticText ?? t('dash'),
      },
      {
        key: 'definition',
        title: tl('flashcard.col_definition'),
        width: 280,
        minWidth: 120,
        render: (row) => row?.definition ?? t('dash'),
      },
      {
        key: 'actions',
        title: 'Tác vụ',
        width: 108,
        minWidth: 100,
        hideable: false,
        align: 'center',
        pinned: 'right',
        render: (row) => {
          const rowBusy = !!loadingMap?.[row.word];
          return (
            <div className="inline-flex items-center justify-center gap-1.5">
              <button
                type="button"
                className="inline-flex items-center justify-center w-9 h-9 p-0 border-none rounded-lg bg-transparent text-indigo-500 cursor-pointer transition-colors duration-150 hover:not(:disabled):text-indigo-600 hover:not(:disabled):bg-indigo-50 disabled:opacity-45 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-indigo-500 focus-visible:outline-offset-2 dark:text-indigo-300 dark:hover:not(:disabled):text-indigo-200 dark:hover:not(:disabled):bg-indigo-500/15"
                title={tl('flashcard.fetch_definition_title')}
                aria-label={tl('flashcard.fetch_definition_aria', { word: row.word })}
                disabled={rowBusy}
                onClick={() => void generateDefinitions([row.word])}
              >
                {rowBusy ? <span className="w-4 h-4 rounded-full border-2 border-current border-r-transparent inline-block animate-spin" aria-hidden="true" /> : <Sparkles size={16} strokeWidth={2} />}
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center w-9 h-9 p-0 border-none rounded-lg bg-transparent text-slate-400 cursor-pointer transition-colors duration-150 hover:text-red-600 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2 dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-red-600/10"
                title={tl('flashcard.remove_word_title')}
                aria-label={tl('flashcard.remove_word_aria', { word: row.word })}
                onClick={() => {
                  removeWord(row.word);
                  onRemoveWord?.(row.word);
                }}
              >
                <Trash2 size={16} strokeWidth={2} />
              </button>
            </div>
          );
        },
      },
    ],
    [t, tl, words, loadingMap, generateLoading, generateDefinitions, removeWord, onRemoveWord],
  );

  return (
    <div className="mt-2.5 flex flex-col gap-3">
      <div className="relative">
        <div className="flex items-center gap-2.5 p-2 border border-slate-200 rounded-xl bg-slate-50 dark:border-white/10 dark:bg-white/5">
          <input
            className="flex-1 min-h-[40px] border border-slate-300 rounded-lg py-2.5 px-3 text-[13.5px] text-slate-900 bg-white outline-none transition-colors duration-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 placeholder:text-slate-400 dark:text-slate-200 dark:bg-slate-900/85 dark:border-white/15"
            type="text"
            value={inputWord}
            placeholder={tl('flashcard.search_placeholder')}
            onFocus={() => setShowSuggest(true)}
            onChange={(event) => {
              setInputWord(event.target.value);
              setShowSuggest(true);
            }}
            onKeyDown={(event) => {
              if (event.key !== 'Enter') return;
              if (event.nativeEvent.isComposing) return;
              if (!event.ctrlKey && !event.metaKey) return;
              event.preventDefault();
              void handleAddWord(inputWord);
            }}
          />
        </div>
        {showSuggest && suggestions.length > 0 ? (
          <div className="absolute top-[calc(100%+6px)] left-0 right-0 z-30 border border-slate-200 rounded-lg bg-white max-h-[90px] overflow-auto shadow-lg dark:border-white/10 dark:bg-slate-900 dark:shadow-none">
            {suggestions.map((word, index) => (
              <button
                key={`${word}-${index}`}
                type="button"
                className="w-full border-0 border-b border-slate-100 bg-transparent text-left px-3 py-2.5 text-[13px] text-slate-900 cursor-pointer last:border-b-0 hover:bg-blue-50 dark:text-slate-200 dark:border-white/10 dark:hover:bg-blue-600/20"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  setInputWord(word);
                  setShowSuggest(false);
                  void handleAddWord(word);
                }}
              >
                {word}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      {loading ? <div className="-mt-1 text-xs text-slate-500">{tl('flashcard.suggest_loading')}</div> : null}

      <div className="w-full [&_table_tbody_td]:whitespace-normal [&_table_tbody_td]:overflow-visible [&_table_tbody_td]:min-w-0 [&_table_tbody_td]:break-words [&_table_tbody_td]:align-top">
        <BaseTable<any> className="w-full" columns={columns} data={words} rowKey={(r) => r.word} emptyText={t('no_data')} loading={loading} />
      </div>

      <div className="mt-3 flex flex-col gap-2 items-start">
        <BaseButton
          variant="primary"
          disabled={words.length === 0 || generateLoading}
          onClick={() => void generateAllDefinitions()}
          startIcon={
            generateLoading ? (
              <span className="w-4 h-4 rounded-full border-2 border-current border-r-transparent inline-block animate-spin" aria-hidden="true" />
            ) : (
              <Sparkles size={16} strokeWidth={2} />
            )
          }
        >
          {tl('flashcard.fetch_definitions')}
        </BaseButton>
      </div>
    </div>
  );
};
