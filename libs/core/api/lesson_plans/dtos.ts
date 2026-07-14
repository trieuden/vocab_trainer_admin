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
