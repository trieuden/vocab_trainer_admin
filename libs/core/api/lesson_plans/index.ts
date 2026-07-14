import { vocabApiClient } from '@/core/connectors';
import type { CreateLessonPlanDto, GetLessonPlansDto } from './dtos';

const ENDPOINTS = {
  GET_LIST: '/lesson-plans/list',
  CREATE: '/lesson-plans',
  DETAIL: '/lesson-plans/detail',
  GEMINI_WRONG_ANSWERS: '/integration/gemini/generate-wrong-answers',
} as const;

async function getLessonPlans(body: GetLessonPlansDto) {
  const { data } = await vocabApiClient.post(ENDPOINTS.GET_LIST, body);
  return data;
}

async function createLessonPlan(body: CreateLessonPlanDto) {
  const { data } = await vocabApiClient.post(ENDPOINTS.CREATE, body);
  return data;
}

async function getLessonPlanDetail(id: string) {
  const { data } = await vocabApiClient.post(ENDPOINTS.DETAIL, { id });
  return data;
}

async function generateWrongAnswers(question: string, correctAnswer: string) {
  const { data } = await vocabApiClient.post(ENDPOINTS.GEMINI_WRONG_ANSWERS, {
    question,
    correctAnswer,
  });
  return data;
}

export { getLessonPlans, createLessonPlan, getLessonPlanDetail, generateWrongAnswers };
