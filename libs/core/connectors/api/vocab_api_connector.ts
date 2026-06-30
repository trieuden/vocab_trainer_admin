import axios from 'axios';
import { getAccessTokenFromCookie } from '@/core/auth/authCookies';

function getBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_API_URL;
  return String(raw).replace(/\/$/, '');
}

export const vocabApiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

vocabApiClient.interceptors.request.use((config) => {
  const token = getAccessTokenFromCookie();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
