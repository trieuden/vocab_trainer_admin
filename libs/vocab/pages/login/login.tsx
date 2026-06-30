'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useLogin } from './hooks';

export function LoginForm() {
  const { t } = useTranslation('login');
  const { handleSubmit, loading } = useLogin();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');

  return (
    <Stack
      className="min-h-[calc(100vh-8rem)] w-full max-w-md mx-auto justify-center"
      spacing={3}
    >
      <Box className="text-center space-y-2">
        <Box
          className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-2 overflow-hidden bg-slate-100 dark:bg-slate-800"
          sx={{ alignItems: 'center', justifyContent: 'center' }}
        >
          <Box component="img" src="/images/logo.png" alt="" sx={{ maxHeight: 48, maxWidth: 48 }} />
        </Box>
        <Typography variant="h4" component="h1" fontWeight={700}>
          {t('title')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('subtitle')}
        </Typography>
      </Box>

      <Card elevation={0} className="border border-slate-200 dark:border-slate-800 shadow-lg">
        <CardContent className="pt-6 pb-2">
          <div>
            <Stack spacing={2.5}>
              <TextField
                label={t('username')}
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                fullWidth
                disabled={loading}
              />
              <TextField
                label="Mật khẩu"
                type="password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                disabled={loading}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                sx={{ py: 1.25, fontWeight: 600 }}
                onClick={() => handleSubmit({ username, password })}
              >
                {loading ? t('submitting') : t('submit')}
              </Button>
            </Stack>
          </div>
        </CardContent>
      </Card>
    </Stack>
  );
}
