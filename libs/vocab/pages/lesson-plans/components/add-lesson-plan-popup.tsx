'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BasePopup, useToast } from '@/core/components';
import { ClipboardList, BookOpen, List, Headphones, Edit3, MessageCircle, Info } from 'lucide-react';
import { EGame, ELessonPlan } from '@/core/enums';
import type { CreateLessonPlanDto, MultipleChoiceQuestionDto, QuestionState, SegmentState, TabKey } from '@/core/api/lesson_plans/dtos';
import type { GameType, LessonPlanType } from '@/core/api/lesson_plans/types';
import { generateWrongAnswers } from '@/core/api/lesson_plans';

import { useAddEditLessonPlan } from '../hooks/add-edit-lesson-plan';
import { useFlashcardWordManager } from '../hooks/flash-card';
import { FlashcardModal } from './flashcard-modal';
import { SectionForm } from './create/section-form';
import { useAppTheme } from '@/vocab/providers';

// ==============================================================================
// 1. SHARED TYPES & UTILS
// ==============================================================================

const initialSegmentState = (): SegmentState => ({
  tab: ELessonPlan.LessonPlanType.TASK.code as LessonPlanType,
  gameType: EGame.GameType.FLASHCARD.code as GameType,
  gameVisited: false,
  taskType: 'ESSAY',
  questions: [],
});

interface AddLessonPlanPopupProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export const AddLessonPlanPopup = ({ open, onClose, onCreated }: AddLessonPlanPopupProps) => {
  const { t: tl } = useTranslation('lesson_plans');
  const { t: tc } = useTranslation('common');
  const toast = useToast();
  const theme = useAppTheme();
  const { handleSaveLessonPlan } = useAddEditLessonPlan();

  const warmUpFlash = useFlashcardWordManager();
  const vocabFlash = useFlashcardWordManager();
  const grammarFlash = useFlashcardWordManager();
  const listeningFlash = useFlashcardWordManager();
  const writingFlash = useFlashcardWordManager();
  const speakingFlash = useFlashcardWordManager();

  const [activeTab, setActiveTab] = useState<TabKey>('info');

  const [warmUp, setWarmUp] = useState(initialSegmentState);
  const [vocab, setVocab] = useState(initialSegmentState);
  const [grammar, setGrammar] = useState(initialSegmentState);
  const [listening, setListening] = useState(initialSegmentState);
  const [writing, setWriting] = useState(initialSegmentState);
  const [speaking, setSpeaking] = useState(initialSegmentState);
  const [isSaving, setIsSaving] = useState(false);

  const [lessonPlan, setLessonPlan] = useState<Partial<CreateLessonPlanDto>>({
    name: '',
    level: ELessonPlan.LessonLevel.A1,
  });

  const resetAll = () => {
    setLessonPlan({ name: '', level: ELessonPlan.LessonLevel.A1 });
    setWarmUp(initialSegmentState());
    setVocab(initialSegmentState());
    setGrammar(initialSegmentState());
    setListening(initialSegmentState());
    setWriting(initialSegmentState());
    setSpeaking(initialSegmentState());
    warmUpFlash.clear();
    vocabFlash.clear();
    grammarFlash.clear();
    listeningFlash.clear();
    writingFlash.clear();
    speakingFlash.clear();
    setActiveTab('info');
  };

  const handleCreateLessonPlan = async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      const payload: Partial<CreateLessonPlanDto> = {
        ...lessonPlan,
        warmUp: {
          words: warmUpFlash.words,
          refType: warmUp.tab,
          gameType: warmUp.gameType,
          taskType: warmUp.taskType,
          questions: warmUp.questions,
        },
        vocab: {
          words: vocabFlash.words,
          refType: vocab.tab,
          gameType: vocab.gameType,
          taskType: vocab.taskType,
          questions: vocab.questions,
        },
        grammar: {
          words: grammarFlash.words,
          refType: grammar.tab,
          gameType: grammar.gameType,
          taskType: grammar.taskType,
          questions: grammar.questions,
        },
        listening: {
          words: listeningFlash.words,
          refType: listening.tab,
          gameType: listening.gameType,
          taskType: listening.taskType,
          questions: listening.questions,
        },
        writing: {
          words: writingFlash.words,
          refType: writing.tab,
          gameType: writing.gameType,
          taskType: writing.taskType,
          questions: writing.questions,
        },
        speaking: {
          words: speakingFlash.words,
          refType: speaking.tab,
          gameType: speaking.gameType,
          taskType: speaking.taskType,
          questions: speaking.questions,
        },
      };

      const response = await handleSaveLessonPlan(payload);

      if (response?.message) {
        toast.success(`✅ ${response.message}`, 5500);
        resetAll();
        onCreated?.();
        onClose();
      }
    } finally {
      setIsSaving(false);
    }
  };

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'info', label: tl('add_popup.info'), icon: <Info size={16} /> },
    { key: 'warmUp', label: tl('col_warm_up'), icon: <ClipboardList size={16} /> },
    { key: 'vocab', label: tl('col_vocab'), icon: <BookOpen size={16} /> },
    { key: 'grammar', label: tl('col_grammar'), icon: <List size={16} /> },
    { key: 'listening', label: tl('col_listening'), icon: <Headphones size={16} /> },
    { key: 'writing', label: tl('col_writing'), icon: <Edit3 size={16} /> },
    { key: 'speaking', label: tl('col_speaking'), icon: <MessageCircle size={16} /> },
  ];

  return (
    <BasePopup open={open} onClose={onClose} title={tl('add_popup.title')}>
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
                  <input
                    type="text"
                    value={lessonPlan.name || ''}
                    onChange={(e) => setLessonPlan((s) => ({ ...s, name: e.target.value }))}
                    placeholder={tl('add_popup.name_placeholder')}
                    className="flex-1 px-2.5 py-1.5 rounded-lg border text-[13px] outline-none"
                    style={{
                      backgroundColor: theme.background.secondary,
                      color: theme.text.primary,
                      borderColor: theme.background.tertiary,
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-[12px] font-semibold uppercase tracking-wide" style={{ color: theme.text.secondary }}>
                    {tl('add_popup.level')}
                  </label>
                  <select
                    value={lessonPlan.level || ELessonPlan.LessonLevel.A1}
                    onChange={(e) => setLessonPlan((s) => ({ ...s, level: e.target.value }))}
                    className="flex-1 px-2.5 py-1.5 rounded-lg border text-[13px] outline-none"
                    style={{
                      backgroundColor: theme.background.secondary,
                      color: theme.text.primary,
                      borderColor: theme.background.tertiary,
                    }}
                  >
                    {Object.values(ELessonPlan.LessonLevel).map((lv) => (
                      <option key={lv} value={lv}>
                        {lv}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 min-w-0">
              <div hidden={activeTab !== 'warmUp'}>
                <SectionForm currentState={warmUp} setCurrentState={setWarmUp} currentLabel={tl('col_warm_up')} currentFlashcard={warmUpFlash} />
              </div>
              <div hidden={activeTab !== 'vocab'}>
                <SectionForm currentState={vocab} setCurrentState={setVocab} currentLabel={tl('col_vocab')} currentFlashcard={vocabFlash} />
              </div>
              <div hidden={activeTab !== 'grammar'}>
                <SectionForm currentState={grammar} setCurrentState={setGrammar} currentLabel={tl('col_grammar')} currentFlashcard={grammarFlash} />
              </div>
              <div hidden={activeTab !== 'listening'}>
                <SectionForm currentState={listening} setCurrentState={setListening} currentLabel={tl('col_listening')} currentFlashcard={listeningFlash} />
              </div>
              <div hidden={activeTab !== 'writing'}>
                <SectionForm currentState={writing} setCurrentState={setWriting} currentLabel={tl('col_writing')} currentFlashcard={writingFlash} />
              </div>
              <div hidden={activeTab !== 'speaking'}>
                <SectionForm currentState={speaking} setCurrentState={setSpeaking} currentLabel={tl('col_speaking')} currentFlashcard={speakingFlash} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2.5">
        <button
          type="button"
          className="border rounded-[10px] px-4 py-2.5 text-[14px] font-semibold cursor-pointer bg-transparent"
          style={{ borderColor: theme.background.tertiary, color: theme.text.primary }}
          onClick={onClose}
        >
          {tc('cancel')}
        </button>
        <button
          type="button"
          className="border border-transparent rounded-[10px] px-4 py-2.5 text-[14px] font-semibold cursor-pointer bg-blue-600 text-white"
          onClick={handleCreateLessonPlan}
          disabled={isSaving}
        >
          {isSaving ? 'Đang tạo...' : tl('add_popup.save')}
        </button>
      </div>
    </BasePopup>
  );
};
