import { vocabApiClient } from '@/core/connectors';
import type { LoginRequestDto, } from './dtos';

const ENDPOINTS = {
  LOGIN: '/auth/login',
} as const;

async function login(body: LoginRequestDto) {
  const { data } = await vocabApiClient.post(ENDPOINTS.LOGIN, body);
  return data;
}

export { login };
