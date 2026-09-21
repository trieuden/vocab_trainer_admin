import type { PageRequest } from '../base-dtos';
import type { LessonPlanType, GameType } from './types';

export type TaskQuestionType = 'MULTIPLE_CHOICE' | 'ESSAY';

export interface GetLessonPlansDto extends PageRequest {
  name?: string;
  level?: string;
}

export interface WordDto {
  word: string;
  audio: string;
  phonetic: string;
  definition: string;
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

  [key: string]: any;
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
    type: "flashcard" | "quiz" | "skip";
    data: LessonPlanSectionBlock;
}
