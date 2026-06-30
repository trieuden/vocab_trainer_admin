'use client';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';
import Cookies from 'js-cookie';

/**
 * Hook to switch between locales by replacing the URL prefix
 * AND updating the 'lang' cookie to satisfy middleware.ts requirements.
 */
export function useLanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = (params?.locale as string) || 'vi';

  const switchLocale = useCallback(
    (newLocale: string) => {
      if (newLocale === currentLocale) return;

      // Update cookie BEFORE navigation so middleware allows the new locale
      Cookies.set('lang', newLocale, { expires: 365 });

      // Replace the locale segment in the pathname
      const segments = pathname.split('/');
      // Pathname usually starts with / so segments[0] is ""
      if (segments[1] === 'en' || segments[1] === 'vi') {
        segments[1] = newLocale;
      } else {
        // Fallback if pathname doesn't have locale yet
        segments.splice(1, 0, newLocale);
      }
      
      const newPath = segments.join('/');
      router.push(newPath);
    },
    [currentLocale, pathname, router]
  );

  return { currentLocale, switchLocale };
}
