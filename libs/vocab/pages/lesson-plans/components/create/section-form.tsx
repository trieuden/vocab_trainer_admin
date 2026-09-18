import React from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/core/components';
import { EGame, ELessonPlan } from '@/core/enums';
import { generateWrongAnswers } from '@/core/api/lesson_plans';
import type { QuestionState, SegmentState } from '@/core/api/lesson_plans/dtos';
import { FlashcardModal } from '../flashcard-modal';

interface SectionFormProps {
  currentState: SegmentState;
  setCurrentState: React.Dispatch<React.SetStateAction<SegmentState>>;
  currentLabel: string;
  currentFlashcard: any;
}

export const SectionForm = ({ currentState, setCurrentState, currentLabel, currentFlashcard }: SectionFormProps) => {
  const { t: tl } = useTranslation('lesson_plans');
  const toast = useToast();

  const handleGenerateWrongAnswers = async (index: number) => {
    const q = currentState.questions[index];
    if (!q.question || !q.correctAnswer) {
      toast.error('Vui lòng nhập câu hỏi và đáp án đúng');
      return;
    }

    setCurrentState((s) => {
      const updated = [...s.questions];
      updated[index] = { ...updated[index], generating: true };
      return { ...s, questions: updated };
    });

    try {
      const result = await generateWrongAnswers(q.question, q.correctAnswer);
      setCurrentState((s) => {
        const updated = [...s.questions];
        updated[index] = { ...updated[index], wrongAnswers: result.wrongAnswers || [], generating: false };
        return { ...s, questions: updated };
      });
    } catch {
      toast.error('Không thể tạo đáp án sai');
      setCurrentState((s) => {
        const updated = [...s.questions];
        updated[index] = { ...updated[index], generating: false };
        return { ...s, questions: updated };
      });
    }
  };

  const handleAddQuestion = () => {
    setCurrentState((s) => ({ ...s, questions: [...s.questions, { question: '', correctAnswer: '', wrongAnswers: [] }] }));
  };

  const handleRemoveQuestion = (index: number) => {
    setCurrentState((s) => ({ ...s, questions: s.questions.filter((_, i) => i !== index) }));
  };

  const handleUpdateQuestion = (index: number, field: keyof QuestionState, value: any) => {
    setCurrentState((s) => {
      const updated = [...s.questions];
      updated[index] = { ...updated[index], [field]: value };
      return { ...s, questions: updated };
    });
  };

  return (
    <div>
      <div className="ml-auto self-end w-fit inline-flex gap-1.5 p-1 rounded-full bg-slate-100 border border-slate-200 mb-4 dark:bg-white/5 dark:border-white/10" role="tablist" aria-label={currentLabel}>
        <button
          type="button"
          role="tab"
          aria-selected={currentState.tab === ELessonPlan.LessonPlanType.TASK.code}
          className={`min-w-[82px] border-0 rounded-full px-3.5 py-1.5 bg-transparent text-slate-900 text-[13px] font-bold cursor-pointer transition-all duration-200 hover:bg-blue-600/10 dark:text-slate-100 dark:hover:bg-blue-600/20 ${currentState.tab === ELessonPlan.LessonPlanType.TASK.code ? 'bg-blue-600 text-white shadow-[0_2px_8px_rgba(37,99,235,0.35)]' : ''}`}
          onClick={() => setCurrentState((s) => ({ ...s, tab: ELessonPlan.LessonPlanType.TASK.code as any }))}
        >
          {tl('add_popup.tab_task')}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={currentState.tab === 'GAME'}
          className={`min-w-[82px] border-0 rounded-full px-3.5 py-1.5 bg-transparent text-slate-900 text-[13px] font-bold cursor-pointer transition-all duration-200 hover:bg-blue-600/10 dark:text-slate-100 dark:hover:bg-blue-600/20 ${currentState.tab === 'GAME' ? 'bg-blue-600 text-white shadow-[0_2px_8px_rgba(37,99,235,0.35)]' : ''}`}
          onClick={() => setCurrentState((s) => ({ ...s, gameVisited: true, tab: ELessonPlan.LessonPlanType.GAME.code as any }))}
        >
          {tl('add_popup.tab_game')}
        </button>
      </div>

      <div
        className={`mt-3 w-full border border-slate-200 rounded-[10px] bg-slate-50 px-3.5 py-3 transition-colors duration-200 dark:border-white/10 dark:bg-white/5 ${currentState.tab === 'TASK' ? 'rounded-tl-[10px]' : 'rounded-tr-[10px]'}`}
      >
        <div className="text-[12px] uppercase tracking-wide font-bold text-slate-500 dark:text-slate-400">{tl('add_popup.content_label')}</div>

        <div hidden={currentState.tab !== 'TASK'}>
          <div>
            <div className="mt-2 mx-auto w-fit flex gap-1.5 p-1 rounded-full bg-slate-100 border border-slate-200 dark:bg-white/5 dark:border-white/10">
              <button
                type="button"
                className={`min-w-[100px] border-0 rounded-full px-3.5 py-1.5 text-[13px] font-bold cursor-pointer transition-all duration-200 ${currentState.taskType === 'ESSAY' ? 'bg-blue-600 text-white shadow-[0_2px_8px_rgba(37,99,235,0.35)]' : 'bg-transparent text-slate-900 hover:bg-blue-600/10 dark:text-slate-100'}`}
                onClick={() => setCurrentState((s) => ({ ...s, taskType: 'ESSAY' }))}
              >
                {tl('add_popup.task_type_essay')}
              </button>
              <button
                type="button"
                className={`min-w-[100px] border-0 rounded-full px-3.5 py-1.5 text-[13px] font-bold cursor-pointer transition-all duration-200 ${currentState.taskType === 'MULTIPLE_CHOICE' ? 'bg-blue-600 text-white shadow-[0_2px_8px_rgba(37,99,235,0.35)]' : 'bg-transparent text-slate-900 hover:bg-blue-600/10 dark:text-slate-100'}`}
                onClick={() => setCurrentState((s) => ({ ...s, taskType: 'MULTIPLE_CHOICE' }))}
              >
                {tl('add_popup.task_type_multiple_choice')}
              </button>
            </div>

            {currentState.taskType === 'ESSAY' && <div className="mt-2 text-[13px] text-slate-800 dark:text-slate-200">{tl('add_popup.task_line', { section: currentLabel })}</div>}

            {currentState.taskType === 'MULTIPLE_CHOICE' && (
              <div className="flex flex-col gap-2.5 mt-2.5">
                {currentState.questions.map((q, idx) => (
                  <div key={idx} className="flex flex-col gap-1.5 p-2.5 border border-slate-200 rounded-lg bg-white dark:bg-white/5 dark:border-white/10">
                    <div className="flex gap-2 items-center">
                      <span className="text-[11px] font-semibold text-slate-500 min-w-[50px]">Câu {idx + 1}</span>
                      <input
                        type="text"
                        className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 dark:bg-white/5 dark:border-white/10 dark:text-slate-200"
                        placeholder={tl('add_popup.question_placeholder')}
                        value={q.question}
                        onChange={(e) => handleUpdateQuestion(idx, 'question', e.target.value)}
                      />
                      <input
                        type="text"
                        className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 dark:bg-white/5 dark:border-white/10 dark:text-slate-200"
                        placeholder={tl('add_popup.correct_answer_placeholder')}
                        value={q.correctAnswer}
                        onChange={(e) => handleUpdateQuestion(idx, 'correctAnswer', e.target.value)}
                      />
                      <button
                        type="button"
                        className="px-3 py-1.5 border border-dashed border-slate-400 rounded-lg bg-transparent text-slate-500 text-[12px] font-semibold cursor-pointer w-fit hover:border-blue-600 hover:text-blue-600"
                        onClick={() => handleRemoveQuestion(idx)}
                      >
                        ✕
                      </button>
                    </div>
                    <div className="flex flex-col gap-1 mt-1">
                      {(q.wrongAnswers || []).map((wa, wIdx) => (
                        <div key={wIdx} className="flex gap-1.5 items-center">
                          <span className="text-[11px] font-semibold text-slate-400 min-w-[18px]">{String.fromCharCode(65 + wIdx + 1)}</span>
                          <input
                            type="text"
                            className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 dark:bg-white/5 dark:border-white/10 dark:text-slate-200"
                            value={wa}
                            onChange={(e) => {
                              const updated = [...(q.wrongAnswers || [])];
                              updated[wIdx] = e.target.value;
                              handleUpdateQuestion(idx, 'wrongAnswers', updated);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="mt-1.5 px-3 py-1.5 border border-blue-600 rounded-lg bg-transparent text-blue-600 text-[12px] font-semibold cursor-pointer w-fit hover:bg-blue-600/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleGenerateWrongAnswers(idx)}
                      disabled={q.generating}
                    >
                      {q.generating ? 'Đang tạo...' : tl('add_popup.generate_wrong_answers')}
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="mt-2 px-3 py-1.5 border border-dashed border-slate-400 rounded-lg bg-transparent text-slate-500 text-[12px] font-semibold cursor-pointer w-fit hover:border-blue-600 hover:text-blue-600"
                  onClick={handleAddQuestion}
                >
                  + {tl('add_popup.add_question')}
                </button>
              </div>
            )}
          </div>
        </div>

        {currentState.gameVisited ? (
          <div hidden={currentState.tab !== 'GAME'}>
            <div className="mt-2 mx-auto w-fit flex gap-1.5 p-1 rounded-full bg-slate-100 border border-slate-200 dark:bg-white/5 dark:border-white/10">
              <button
                type="button"
                className={`min-w-[100px] border-0 rounded-full px-3.5 py-1.5 text-[13px] font-bold text-slate-900 bg-transparent cursor-pointer transition-all duration-200 hover:bg-blue-600/10 dark:text-slate-100 ${currentState.gameType === EGame.GameType.FLASHCARD.code ? 'bg-blue-600 text-white shadow-[0_2px_8px_rgba(37,99,235,0.35)]' : ''}`}
                onClick={() => setCurrentState((s) => ({ ...s, gameType: EGame.GameType.FLASHCARD.code as any }))}
              >
                {EGame.GameType.FLASHCARD.name}
              </button>
              <button
                type="button"
                className={`min-w-[100px] border-0 rounded-full px-3.5 py-1.5 text-[13px] font-bold text-slate-900 bg-transparent cursor-pointer transition-all duration-200 hover:bg-blue-600/10 dark:text-slate-100 ${currentState.gameType === EGame.GameType.CROSSWORD.code ? 'bg-blue-600 text-white shadow-[0_2px_8px_rgba(37,99,235,0.35)]' : ''}`}
                onClick={() => setCurrentState((s) => ({ ...s, gameType: EGame.GameType.CROSSWORD.code as any }))}
              >
                {EGame.GameType.CROSSWORD.name}
              </button>
            </div>
            <div hidden={currentState.gameType !== EGame.GameType.FLASHCARD.code}>
              <FlashcardModal flashcard={currentFlashcard} />
            </div>
            <div hidden={currentState.gameType !== EGame.GameType.CROSSWORD.code}>
              <div className="mt-2 text-[13px] text-slate-800 dark:text-slate-200">{tl('add_popup.crossword_placeholder')}</div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
