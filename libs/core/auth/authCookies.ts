import Cookies from 'js-cookie';
import type { AuthUserDto } from '@/core/api/auth/dtos';

export const AUTH_COOKIE_KEY = 'vocab_auth';

const baseOpts = {
  path: '/',
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
};

interface AuthCookiePayload {
  accessToken: string;
  refreshToken: string;
  user: AuthUserDto;
}

export function setAuthCookies(params: {
  accessToken: string;
  refreshToken: string;
  user: AuthUserDto;
}) {
  const payload: AuthCookiePayload = {
    accessToken: params.accessToken,
    refreshToken: params.refreshToken,
    user: params.user,
  };

  Cookies.set(AUTH_COOKIE_KEY, JSON.stringify(payload), {
    ...baseOpts,
    expires: 14,
  });
}

export function clearAuthCookies() {
  Cookies.remove(AUTH_COOKIE_KEY, { path: '/' });
}

function getAuthCookiePayload(): AuthCookiePayload | undefined {
  const raw = Cookies.get(AUTH_COOKIE_KEY);
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as AuthCookiePayload;
  } catch {
    return undefined;
  }
}

export function getAccessTokenFromCookie(): string | undefined {
  return getAuthCookiePayload()?.accessToken;
}

export function getAuthUserFromCookie(): AuthUserDto | undefined {
  return getAuthCookiePayload()?.user;
}
