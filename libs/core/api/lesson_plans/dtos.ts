import type { PageRequest } from '../base-dtos';
import type { LessonPlanType, GameType } from './types';

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

export interface SectionInputDto {
  words?: WordDto[];
  gameType?: GameType;
  taskName?: string;
  refId?: string;
  refType?: LessonPlanType;
}

export class CreateLessonPlanDto {
  name?: string;
  level?: string;
  description?: string;

  warmUp?: SectionInputDto;
  vocab?: SectionInputDto;
  grammar?: SectionInputDto;
  listening?: SectionInputDto;
  reading?: SectionInputDto;
  writing?: SectionInputDto;
  speaking?: SectionInputDto;
}
