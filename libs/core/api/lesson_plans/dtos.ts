import type { PageRequest } from '../base-dtos';
import type { LessonPlanType, GameType } from './types';

export type TaskQuestionType = 'MULTIPLE_CHOICE' | 'ESSAY';

export interface GetLessonPlansDto extends PageRequest {
  name?: string;
  level?: string;
}

export interface WordDto {
  word: string;
  audio?: string;
  phonetic?: string;
  phoneticText?: string;
  definition?: string;
}

export interface MultipleChoiceQuestionDto {
  question: string;
  correctAnswer: string;
  wrongAnswers?: string[];
}

export interface SectionInputDto {
  words?: WordDto[];
  gameType?: GameType;
  taskName?: string;
  taskType?: TaskQuestionType;
  questions?: MultipleChoiceQuestionDto[];
  refId?: string;
  refType?: LessonPlanType;
  isTouched?: boolean;
}

export class CreateLessonPlanDto {
  name?: string;
  level?: string;
  description?: string;
  userId?: string;

  warmUp?: SectionInputDto;
  vocab?: SectionInputDto;
  grammar?: SectionInputDto;
  listening?: SectionInputDto;
  reading?: SectionInputDto;
  writing?: SectionInputDto;
  speaking?: SectionInputDto;
}

export interface UpdateLessonPlanDto {
  id: string;
  name?: string;
  level?: string;
  description?: string;
  warmUp?: SectionInputDto;
  vocab?: SectionInputDto;
  grammar?: SectionInputDto;
  listening?: SectionInputDto;
  writing?: SectionInputDto;
}

export interface QuestionState extends MultipleChoiceQuestionDto {
  generating?: boolean;
}

export interface SegmentState {
  tab: LessonPlanType;
  gameType: GameType;
  gameVisited: boolean;
  taskType: TaskQuestionType;
  questions: QuestionState[];
  isTouched?: boolean;
}

export type TabKey = 'info' | 'warmUp' | 'vocab' | 'grammar' | 'listening' | 'writing' | 'speaking';

export interface LessonPlanWordDto {
  id?: string;
  words: string;
  phoneticText?: string;
  definition?: string;
  audio?: string;
}

export interface LessonPlanAnswerDto {
  id?: string;
  answer: string;
  isRight: boolean;
}

export interface LessonPlanQuestionDto {
  id?: string;
  question: string;
  type?: string;
  key?: string;
  answers: LessonPlanAnswerDto[];
}

export interface LessonPlanSectionBlock {
  id?: string;
  name?: string;
  type?: string;
  words?: LessonPlanWordDto[];
  questions?: LessonPlanQuestionDto[];
}

export interface LessonPlanSlideSection {
  key: string;
  label: string;
  type: 'flashcard' | 'quiz' | 'skip';
  data: LessonPlanSectionBlock;
}

export interface LessonPlanItem {
  id: string;
  name: string;
  level: string;
  description?: string;
  userId: string;
  user?: { id: string; name: string };
  warmUp?: { id?: string; name?: string; type?: string } | null;
  vocab?: { id?: string; name?: string; type?: string } | null;
  grammar?: { id?: string; name?: string; type?: string } | null;
  listening?: { id?: string; name?: string; type?: string } | null;
  writing?: { id?: string; name?: string; type?: string } | null;
  speaking?: { id?: string; name?: string; type?: string } | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface LessonPlanDetailData {
  id: string;
  name?: string;
  description?: string;
  level?: string;
  user?: { id: string; name: string };
  warmUp?: LessonPlanSectionBlock | null;
  warmUpType?: string | null;
  vocab?: LessonPlanSectionBlock | null;
  vocabType?: string | null;
  grammar?: LessonPlanSectionBlock | null;
  grammarType?: string | null;
  listening?: LessonPlanSectionBlock | null;
  listeningType?: string | null;
  writing?: LessonPlanSectionBlock | null;
  writingType?: string | null;
  speaking?: LessonPlanSectionBlock | null;
  speakingType?: string | null;
}
