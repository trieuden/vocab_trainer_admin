'use client';

import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FlashcardGame } from '@/vocab/components/core/flashcard-game';
import { MultipleChoiceQuiz } from '@/vocab/components/core/multiple-choice-quiz';

import type { LessonPlanSlideSection } from '@/core/api/lesson_plans/dtos';

interface LessonPlanSlideshowProps {
  data: any;
  onClose: () => void;
}

const SECTION_KEYS = ['warmUp', 'vocab', 'grammar', 'listening', 'writing', 'speaking'] as const;
const SECTION_LABELS: Record<string, string> = {
  warmUp: 'Mở đầu',
  vocab: 'Từ vựng',
  grammar: 'Ngữ pháp',
  listening: 'Nghe',
  writing: 'Viết',
  speaking: 'Nói',
};

export const LessonPlanSlideshow = ({ data, onClose }: LessonPlanSlideshowProps) => {
  const { t: tl } = useTranslation('lesson_plans');
  const [currentIndex, setCurrentIndex] = useState(0);

  const sections = useMemo<LessonPlanSlideSection[]>(() => {
    const result: LessonPlanSlideSection[] = [];

    for (const key of SECTION_KEYS) {
      const block = data?.[key];
      const type = data?.[`${key}Type`];

      if (!block) continue;

      if (type === 'GAME' && block.type === 'FLASHCARD' && block.words?.length) {
        result.push({
          key,
          label: SECTION_LABELS[key] || key,
          type: 'flashcard',
          data: block,
        });
      } else if (type === 'TASK' && block.questions?.length) {
        result.push({
          key,
          label: SECTION_LABELS[key] || key,
          type: 'quiz',
          data: block,
        });
      }
    }

    return result;
  }, [data]);

  const currentSection = sections[currentIndex];

  const handleSectionComplete = () => {
    if (currentIndex + 1 >= sections.length) {
      onClose();
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const handleNext = () => {
    if (currentIndex + 1 < sections.length) setCurrentIndex((i) => i + 1);
  };

  if (!sections.length) {
    return (
      <div className="fixed inset-0 z-[1000] bg-slate-900 flex flex-col">
        <div className="flex items-center justify-between px-5 py-3 bg-slate-800 border-b border-white/10">
          <span className="text-[15px] font-bold text-slate-200">{tl('slideshow.title')}</span>
          <button
            className="w-8 h-8 flex items-center justify-center border-0 rounded-lg bg-white/5 text-slate-400 text-lg cursor-pointer transition-all duration-200 hover:bg-white/10 hover:text-slate-200"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center overflow-y-auto p-5">
          <div className="flex flex-col items-center gap-3 text-slate-500 text-[14px]">
            <div className="text-[48px] opacity-50">📭</div>
            <div>{tl('slideshow.no_content')}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-900 flex flex-col">
      <div className="flex items-center justify-between px-5 py-3 bg-slate-800 border-b border-white/10">
        <span className="text-[15px] font-bold text-slate-200">{tl('slideshow.title')}</span>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400 px-2 py-1 bg-white/5 rounded-full">
            Mục {currentIndex + 1}/{sections.length}
          </span>
          <span className="text-[14px] font-bold text-blue-400">{currentSection.label}</span>
          <span className="text-[11px] font-semibold px-2 py-1 bg-blue-600/15 text-blue-400 rounded-full">{currentSection.type === 'flashcard' ? 'Flashcard' : 'Trắc nghiệm'}</span>
        </div>
        <button
          className="w-8 h-8 flex items-center justify-center border-0 rounded-lg bg-white/5 text-slate-400 text-lg cursor-pointer transition-all duration-200 hover:bg-white/10 hover:text-slate-200"
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center overflow-y-auto p-5">
        {currentSection.type === 'flashcard' && <FlashcardGame words={currentSection.data.words || []} onComplete={handleSectionComplete} />}
        {currentSection.type === 'quiz' && <MultipleChoiceQuiz questions={currentSection.data.questions || []} onComplete={handleSectionComplete} />}
      </div>

      <div className="flex items-center justify-between px-5 py-3 bg-slate-800 border-t border-white/10">
        <button
          className="px-4 py-2 border border-white/10 rounded-lg bg-white/5 text-slate-200 text-[13px] font-semibold cursor-pointer transition-all duration-200 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          ← Trước
        </button>

        <div className="flex gap-2">
          {sections.map((s, idx) => (
            <button
              key={s.key}
              className={`w-2.5 h-2.5 rounded-full border-0 bg-white/15 cursor-pointer transition-all duration-200 p-0 ${
                idx === currentIndex ? 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]' : ''
              } ${idx < currentIndex ? 'bg-green-600' : ''}`}
              onClick={() => setCurrentIndex(idx)}
            />
          ))}
        </div>

        <button
          className="px-4 py-2 border border-white/10 rounded-lg bg-white/5 text-slate-200 text-[13px] font-semibold cursor-pointer transition-all duration-200 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={handleNext}
          disabled={currentIndex + 1 >= sections.length}
        >
          Tiếp →
        </button>
      </div>
    </div>
  );
};
