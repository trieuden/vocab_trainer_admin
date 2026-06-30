import { vocabApiClient } from '@/core/connectors';
import type { GetUsersDto } from './dtos';

const ENDPOINTS = {
  GET_LIST: '/users/list',
} as const;

async function getUsers(body: GetUsersDto) {
  const { data } = await vocabApiClient.post(ENDPOINTS.GET_LIST, body);
  return data;
}

export { getUsers };
