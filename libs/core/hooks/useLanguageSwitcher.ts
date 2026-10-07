'use client';
import { useState, useCallback, useEffect } from 'react';
import Cookies from 'js-cookie';
import i18n from '../../../i18n';

/**
 * Hook to switch between locales by saving to cookie 'lang' and updating i18n.
 * URLs remain clean without language prefixes.
 */
export function useLanguageSwitcher() {
  const [currentLocale, setCurrentLocale] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return Cookies.get('lang') || i18n.language || 'vi';
    }
    return 'vi';
  });

  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      setCurrentLocale(lng);
    };
    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  const switchLocale = useCallback((newLocale: string) => {
    Cookies.set('lang', newLocale, { expires: 365, path: '/' });
    void i18n.changeLanguage(newLocale);
    setCurrentLocale(newLocale);
  }, []);

  return { currentLocale, switchLocale };
}
