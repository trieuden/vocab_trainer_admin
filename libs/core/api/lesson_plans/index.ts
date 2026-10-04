import { vocabApiClient } from '@/core/connectors';
import type { CreateLessonPlanDto, GetLessonPlansDto, UpdateLessonPlanDto, LessonPlanDetailData } from './dtos';

const ENDPOINTS = {
  GET_LIST: '/lesson-plans/list',
  CREATE: '/lesson-plans',
  UPDATE: '/lesson-plans/update',
  DETAIL: '/lesson-plans/detail',
  DELETE: (id: string) => `/lesson-plans/${id}`,
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

async function updateLessonPlan(body: UpdateLessonPlanDto) {
  const { data } = await vocabApiClient.put(ENDPOINTS.UPDATE, body);
  return data;
}

async function deleteLessonPlan(id: string) {
  const { data } = await vocabApiClient.delete(ENDPOINTS.DELETE(id));
  return data;
}

async function getLessonPlanDetail(id: string): Promise<LessonPlanDetailData> {
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

export {
  getLessonPlans,
  createLessonPlan,
  updateLessonPlan,
  deleteLessonPlan,
  getLessonPlanDetail,
  generateWrongAnswers,
};
