'use client';
import { ReactNode, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import Cookies from 'js-cookie';
import i18n from '../../../i18n';

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  useEffect(() => {
    const lang = Cookies.get('lang') || 'vi';
    if (i18n.language !== lang) {
      void i18n.changeLanguage(lang);
    }
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}
