'use client';

import { Box, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const StartPage = () => {
  const { t } = useTranslation('start');

  return (
    <Stack className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-8">
        <div className="inline-flex items-center justify-center w-34 h-34 bg-primary rounded-full mb-6">
          <Box component="img" src="/images/logo.png" alt="" />
        </div>
        <div>
          <h1 suppressHydrationWarning className="text-4xl font-bold text-balance mb-4">{t('title')}</h1>
          <p suppressHydrationWarning className="text-xl text-muted-foreground text-pretty max-w-md mx-auto">{t('description')}</p>
        </div>
      </div>
    </Stack>
  );
};
