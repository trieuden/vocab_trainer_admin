'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseLoading, BasePopup } from '@/core/components';
import { EGame, ELessonPlan } from '@/core/enums';
import { useLessonPlanDetail } from '../hooks/lesson-plan-detail';
import { LessonPlanSlideshow } from './lesson-plan-slideshow';
import { ClipboardList, BookOpen, List, Headphones, Edit3, MessageCircle, Info } from 'lucide-react';
import { useAppTheme } from '@/vocab/providers';

const gameTypeMap = {
  [EGame.GameType.CROSSWORD.code]: EGame.GameType.CROSSWORD.name,
  [EGame.GameType.FLASHCARD.code]: EGame.GameType.FLASHCARD.name,
};

const WordsTable = ({ block }: { block: any }) => {
  const { t: tl } = useTranslation('lesson_plans');

  const words: any[] = block?.words ?? [];
  if (!words.length) {
    return <div className="mt-2 text-[13px] text-slate-400 italic">{tl('detail.no_words')}</div>;
  }

  return (
    <table className="mt-3 w-full border-collapse text-[13px] [&_tr:last-child_td]:border-b-0">
      <thead>
        <tr>
          <th
            className="bg-slate-100 text-slate-500 font-bold text-[11.5px] uppercase tracking-wide px-2.5 py-2 text-left border-b border-slate-200 dark:bg-white/5 dark:text-slate-400 dark:border-white/10"
            style={{ width: 44 }}
          >
            #
          </th>
          <th className="bg-slate-100 text-slate-500 font-bold text-[11.5px] uppercase tracking-wide px-2.5 py-2 text-left border-b border-slate-200 dark:bg-white/5 dark:text-slate-400 dark:border-white/10">
            {tl('flashcard.col_word')}
          </th>
          <th className="bg-slate-100 text-slate-500 font-bold text-[11.5px] uppercase tracking-wide px-2.5 py-2 text-left border-b border-slate-200 dark:bg-white/5 dark:text-slate-400 dark:border-white/10">
            {tl('flashcard.col_phonetic')}
          </th>
          <th className="bg-slate-100 text-slate-500 font-bold text-[11.5px] uppercase tracking-wide px-2.5 py-2 text-left border-b border-slate-200 dark:bg-white/5 dark:text-slate-400 dark:border-white/10">
            {tl('flashcard.col_definition')}
          </th>
          <th className="bg-slate-100 text-slate-500 font-bold text-[11.5px] uppercase tracking-wide px-2.5 py-2 text-left border-b border-slate-200 dark:bg-white/5 dark:text-slate-400 dark:border-white/10">
            {tl('flashcard.col_audio')}
          </th>
        </tr>
      </thead>
      <tbody>
        {words.map((w: any, i: number) => (
          <tr key={w.id ?? i}>
            <td className="px-2.5 py-2 border-b border-slate-100 text-slate-800 align-top break-words dark:text-slate-200 dark:border-white/5" style={{ color: '#94a3b8', textAlign: 'center' }}>
              {i + 1}
            </td>
            <td className="px-2.5 py-2 border-b border-slate-100 text-slate-800 align-top break-words dark:text-slate-200 dark:border-white/5" style={{ fontWeight: 600 }}>
              {w.words ?? '—'}
            </td>
            <td className="px-2.5 py-2 border-b border-slate-100 text-slate-800 align-top break-words dark:text-slate-200 dark:border-white/5">{w.phoneticText ?? '—'}</td>
            <td className="px-2.5 py-2 border-b border-slate-100 text-slate-800 align-top break-words dark:text-slate-200 dark:border-white/5">{w.definition ?? '—'}</td>
            <td className="px-2.5 py-2 border-b border-slate-100 text-slate-800 align-top break-words dark:text-slate-200 dark:border-white/5">
              {w.audio ? (
                <a href={w.audio} target="_blank" rel="noopener noreferrer" className="text-blue-600 no-underline text-[12.5px] hover:underline dark:text-blue-300">
                  {tl('detail.open_audio')}
                </a>
              ) : (
                '—'
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const QuestionsTable = ({ block }: { block: any }) => {
  const { t: tl } = useTranslation('lesson_plans');

  const questions: any[] = block?.questions ?? [];
  if (!questions.length) {
    return <div className="mt-2 text-[13px] text-slate-400 italic">{tl('detail.no_questions')}</div>;
  }

  return (
    <div className="flex flex-col gap-3 mt-2.5">
      {questions.map((q: any, i: number) => (
        <div key={q.id ?? i} className="px-3 py-2.5 border border-slate-200 rounded-lg bg-white dark:bg-white/5 dark:border-white/10">
          <div className="flex gap-2 items-start">
            <span className="font-bold text-blue-600 min-w-[20px]">{i + 1}.</span>
            <span className="font-semibold text-slate-800 text-[13px] dark:text-slate-200">{q.question}</span>
          </div>
          <div className="flex flex-col gap-1 mt-2 pl-7">
            {(q.answers ?? []).map((a: any, aIdx: number) => (
              <div
                key={a.id ?? aIdx}
                className={`flex items-center gap-2 px-2 py-1 rounded-md text-[13px] text-slate-700 dark:text-slate-300 ${a.isRight ? 'bg-green-100 font-semibold dark:bg-green-500/15' : ''}`}
              >
                <span className="font-bold text-slate-500 min-w-[16px] dark:text-slate-400">{String.fromCharCode(65 + aIdx)}</span>
                <span className="flex-1">{a.answer}</span>
                {a.isRight && <span className="text-green-600 font-bold text-[14px]">✓</span>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const SegmentDetail = ({ title, sectionType, block }: { title: string; sectionType: string | null; block: any }) => {
  const { t: tl } = useTranslation('lesson_plans');

  const isTask = sectionType === ELessonPlan.LessonPlanType.TASK.code;
  const isGame = sectionType === ELessonPlan.LessonPlanType.GAME.code;
  const hasQuestions = block?.questions?.length > 0;

  if (!isTask && !isGame) {
    return <div className="mt-2 text-[13px] text-slate-400 italic">{tl('detail.no_data', 'Không có dữ liệu cho phần này')}</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="text-[16px] font-bold text-slate-800 dark:text-slate-100">{title}</div>
      
      {/* Nội dung TASK */}
      <div className="w-full border border-slate-200 rounded-[10px] bg-slate-50 px-3.5 py-3 dark:border-white/10 dark:bg-white/5" hidden={!isTask}>
        <div className="text-[12px] uppercase tracking-wide font-bold text-slate-500 dark:text-slate-400">{tl('detail.task')}</div>
        {hasQuestions ? <QuestionsTable block={block} /> : <div className="mt-2 text-[13px] text-slate-800 dark:text-slate-200">{block?.name ?? tl('add_popup.task_line', { section: title })}</div>}
      </div>

      {/* Nội dung GAME */}
      <div className="w-full border border-slate-200 rounded-[10px] bg-slate-50 px-3.5 py-3 dark:border-white/10 dark:bg-white/5" hidden={!isGame}>
        <div className="text-[12px] uppercase tracking-wide font-bold text-slate-500 dark:text-slate-400">{tl('detail.game')}</div>

        <div className="mt-1.5 py-2 border-b border-dashed border-slate-200 flex items-center gap-2 dark:border-white/10">
          <span className="text-[15px] font-extrabold text-blue-600 tracking-tight dark:text-blue-400">{gameTypeMap[block?.type ?? '']}</span>
        </div>

        <WordsTable block={block} />
      </div>
    </div>
  );
};

// ==============================================================================
// 2. LESSON PLAN DETAIL COMPONENT
// ==============================================================================

interface LessonPlanDetailProps {
  open: boolean;
  id: string | null;
  onClose: () => void;
}

export const LessonPlanDetail = ({ open, id, onClose }: LessonPlanDetailProps) => {
  const { t: tl } = useTranslation('lesson_plans');
  const { t: tc } = useTranslation('common');
  const { data, loading, error } = useLessonPlanDetail(open ? id : null);
  const theme = useAppTheme();

  const [activeTab, setActiveTab] = useState<string>('info');
  const [slideshowOpen, setSlideshowOpen] = useState(false);

  const tabs = [
    { key: 'info', label: tl('add_popup.info'), icon: <Info size={16} /> },
    { key: 'warmUp', label: tl('col_warm_up'), icon: <ClipboardList size={16} /> },
    { key: 'vocab', label: tl('col_vocab'), icon: <BookOpen size={16} /> },
    { key: 'grammar', label: tl('col_grammar'), icon: <List size={16} /> },
    { key: 'listening', label: tl('col_listening'), icon: <Headphones size={16} /> },
    { key: 'writing', label: tl('col_writing'), icon: <Edit3 size={16} /> },
    { key: 'speaking', label: tl('col_speaking'), icon: <MessageCircle size={16} /> },
  ];

  return (
    <BasePopup open={open} onClose={onClose} title={tl('detail.title')}>
      {loading && (
        <div className="flex items-center justify-center min-h-[120px] text-[14px] text-slate-500">
          <BaseLoading label={tc('loading')} />
        </div>
      )}

      {error && !loading && <div className="flex items-center justify-center min-h-[120px] text-[14px] text-slate-500 text-red-600 dark:text-red-400">{error}</div>}

      {data && !loading && (
        <div className="flex gap-5 min-h-[500px]" style={{ backgroundColor: theme.background.primary, color: theme.text.primary }}>
          <div className="w-[220px] shrink-0 flex flex-col gap-1.5 border-r pr-4" style={{ borderColor: theme.background.tertiary }}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 border-0 rounded-lg cursor-pointer text-left text-[14px] font-semibold transition-all duration-200"
                style={{
                  backgroundColor: activeTab === tab.key ? theme.primary.main : 'transparent',
                  color: activeTab === tab.key ? theme.primary.text : theme.text.secondary,
                }}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 flex flex-col min-w-0 pr-1">
            {activeTab === 'info' ? (
              <div>
                <div className="flex flex-row gap-4 items-end">
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-[12px] font-semibold uppercase tracking-wide" style={{ color: theme.text.secondary }}>
                      {tl('add_popup.name')}
                    </label>
                    <div
                      className="flex-1 px-2.5 py-1.5 rounded-lg border text-[13px]"
                      style={{
                        backgroundColor: theme.background.secondary,
                        color: theme.text.primary,
                        borderColor: theme.background.tertiary,
                        minHeight: 34,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {data.name || '—'}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-[12px] font-semibold uppercase tracking-wide" style={{ color: theme.text.secondary }}>
                      {tl('add_popup.level')}
                    </label>
                    <div
                      className="flex-1 px-2.5 py-1.5 rounded-lg border text-[13px]"
                      style={{
                        backgroundColor: theme.background.secondary,
                        color: theme.text.primary,
                        borderColor: theme.background.tertiary,
                        minHeight: 34,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {data.level || '—'}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 min-w-0">
                {tabs.filter(t => t.key !== 'info').map(({ key, label }) => {
                  if (activeTab !== key) return null;
                  return (
                    <SegmentDetail
                      key={key}
                      title={label}
                      sectionType={data[`${key}Type`] ?? null}
                      block={data[key] ?? null}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-end gap-2.5">
        <button
          type="button"
          className="border border-transparent rounded-[10px] px-4 py-2.5 text-[14px] font-semibold cursor-pointer bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => setSlideshowOpen(true)}
        >
          {tl('detail.slideshow')}
        </button>
        <button
          type="button"
          className="border border-transparent rounded-[10px] px-4 py-2.5 text-[14px] font-semibold cursor-pointer bg-transparent border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/5"
          onClick={onClose}
        >
          {tc('cancel')}
        </button>
      </div>

      {slideshowOpen && data && <LessonPlanSlideshow data={data} onClose={() => setSlideshowOpen(false)} />}
    </BasePopup>
  );
};
