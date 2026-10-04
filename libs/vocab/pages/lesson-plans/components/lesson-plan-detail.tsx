'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseLoading, BasePopup } from '@/core/components';
import { EGame, ELessonPlan } from '@/core/enums';
import { useLessonPlanDetail } from '../hooks/lesson-plan-detail';
import { LessonPlanSlideshow } from './lesson-plan-slideshow';
import { ClipboardList, BookOpen, List, Headphones, Edit3, MessageCircle, Info } from 'lucide-react';
import { useAppTheme } from '@/vocab/providers';
import type { LessonPlanSectionBlock, LessonPlanWordDto, LessonPlanQuestionDto } from '@/core/api/lesson_plans/dtos';

const gameTypeMap: Record<string, string> = {
  [EGame.GameType.CROSSWORD.code]: EGame.GameType.CROSSWORD.name,
  [EGame.GameType.FLASHCARD.code]: EGame.GameType.FLASHCARD.name,
};

const WordsTable = ({ block }: { block?: LessonPlanSectionBlock | null }) => {
  const { t: tl } = useTranslation('lesson_plans');

  const words: LessonPlanWordDto[] = block?.words ?? [];
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
        {words.map((w: LessonPlanWordDto, i: number) => (
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

const QuestionsTable = ({ block }: { block?: LessonPlanSectionBlock | null }) => {
  const { t: tl } = useTranslation('lesson_plans');

  const questions: LessonPlanQuestionDto[] = block?.questions ?? [];
  if (!questions.length) {
    return <div className="mt-2 text-[13px] text-slate-400 italic">{tl('detail.no_questions')}</div>;
  }

  return (
    <div className="mt-3 flex flex-col gap-2.5">
      {questions.map((q: LessonPlanQuestionDto, i: number) => (
        <div key={q.id ?? i} className="border border-slate-200 rounded-lg p-2.5 bg-slate-50 text-[13px] dark:bg-white/5 dark:border-white/10">
          <div className="font-semibold text-slate-800 mb-1.5 dark:text-slate-200">
            {i + 1}. {q.question}
          </div>
          <div className="flex flex-col gap-1 pl-2">
            {(q.answers ?? []).map((ans, ai: number) => {
              const letter = String.fromCharCode(65 + ai);
              const isCorrect = ans.isRight;
              return (
                <div
                  key={ans.id ?? ai}
                  className={`text-[12.5px] ${
                    isCorrect
                      ? 'text-emerald-600 font-semibold dark:text-emerald-300'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {letter}. {ans.answer} {isCorrect && '✓'}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

const SectionContent = ({
  refType,
  block,
}: {
  refType?: string | null;
  block?: LessonPlanSectionBlock | null;
}) => {
  const { t: tl } = useTranslation('lesson_plans');

  if (!block && !refType) {
    return <div className="text-[13px] text-slate-400 italic">—</div>;
  }

  const isGame = refType === ELessonPlan.LessonPlanType.GAME.code;
  const isTask = refType === ELessonPlan.LessonPlanType.TASK.code;

  return (
    <div className="mt-2">
      <div className="text-[12px] text-slate-500 font-medium mb-1 dark:text-slate-400">
        {isGame && (
          <span className="inline-block bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[11px] font-semibold mr-1.5 dark:bg-blue-900/40 dark:text-blue-300">
            {tl('detail.game_prefix')} {gameTypeMap[block?.type ?? ''] ?? block?.type ?? 'Game'}
          </span>
        )}
        {isTask && (
          <span className="inline-block bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-[11px] font-semibold mr-1.5 dark:bg-purple-900/40 dark:text-purple-300">
            {tl('detail.task')}
          </span>
        )}
        {block?.name && <span className="font-semibold text-slate-700 dark:text-slate-300">{block.name}</span>}
      </div>

      <WordsTable block={block} />
      <QuestionsTable block={block} />
    </div>
  );
};

interface LessonPlanDetailProps {
  id: string | null;
  open: boolean;
  onClose: () => void;
}

export const LessonPlanDetail = ({ id, open, onClose }: LessonPlanDetailProps) => {
  const { t: tl } = useTranslation('lesson_plans');
  const { data, loading } = useLessonPlanDetail(id);
  const [showSlideshow, setShowSlideshow] = useState(false);
  const theme = useAppTheme();

  const sections: {
    key: string;
    label: string;
    icon: React.ReactNode;
    refType?: string | null;
    block?: LessonPlanSectionBlock | null;
  }[] = [
    { key: 'warmUp', label: tl('col_warm_up'), icon: <ClipboardList size={16} />, refType: data?.warmUpType, block: data?.warmUp },
    { key: 'vocab', label: tl('col_vocab'), icon: <BookOpen size={16} />, refType: data?.vocabType, block: data?.vocab },
    { key: 'grammar', label: tl('col_grammar'), icon: <List size={16} />, refType: data?.grammarType, block: data?.grammar },
    { key: 'listening', label: tl('col_listening'), icon: <Headphones size={16} />, refType: data?.listeningType, block: data?.listening },
    { key: 'writing', label: tl('col_writing'), icon: <Edit3 size={16} />, refType: data?.writingType, block: data?.writing },
    { key: 'speaking', label: tl('col_speaking'), icon: <MessageCircle size={16} />, refType: data?.speakingType, block: data?.speaking },
  ];

  return (
    <>
      <BasePopup open={open} onClose={onClose} title={data?.name ? `${tl('detail.title')}: ${data.name}` : tl('detail.title')}>
        {loading ? (
          <BaseLoading label="Loading..." />
        ) : !data ? (
          <div className="p-4 text-slate-400 text-[13px]">{tl('slideshow.no_content')}</div>
        ) : (
          <div className="flex flex-col gap-4 p-1 max-h-[75vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[13px] dark:bg-white/5 dark:border-white/10">
              <div>
                <span className="text-slate-500 font-medium dark:text-slate-400">{tl('col_teacher')}: </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{data.user?.name ?? '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium dark:text-slate-400">{tl('col_level')}: </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{data.level ?? '—'}</span>
              </div>
              {data.description && (
                <div className="col-span-2">
                  <span className="text-slate-500 font-medium dark:text-slate-400">Description: </span>
                  <span className="text-slate-700 dark:text-slate-300">{data.description}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {sections.map((sec) => (
                <div
                  key={sec.key}
                  className="border border-slate-200 rounded-xl p-3.5 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:bg-slate-900 dark:border-slate-800"
                >
                  <div className="flex items-center gap-2 font-bold text-slate-800 text-[13.5px] border-b border-slate-100 pb-2 dark:text-slate-200 dark:border-white/5">
                    <span className="text-blue-600 dark:text-blue-400">{sec.icon}</span>
                    <span>{sec.label}</span>
                  </div>
                  <SectionContent refType={sec.refType} block={sec.block} />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
              <button
                type="button"
                onClick={() => setShowSlideshow(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
              >
                {tl('detail.slideshow')}
              </button>
            </div>
          </div>
        )}
      </BasePopup>

      {showSlideshow && data && (
        <LessonPlanSlideshow data={data} onClose={() => setShowSlideshow(false)} />
      )}
    </>
  );
};
