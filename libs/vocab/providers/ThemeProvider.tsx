'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Cookies from 'js-cookie';

export type ThemeColors = {
  primary: {
    main: string;
    text: string;
  };
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
};

export const lightThemeColors: ThemeColors = {
  primary: {
    main: '#2563eb', // blue-600
    text: '#ffffff',
  },
  background: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#e2e8f0',
  },
  text: {
    primary: '#0f172a',
    secondary: '#475569',
    tertiary: '#94a3b8',
  },
};

export const darkThemeColors: ThemeColors = {
  primary: {
    main: '#3b82f6', // blue-500 for better visibility in dark mode
    text: '#ffffff',
  },
  background: {
    primary: '#020617',
    secondary: '#0f172a',
    tertiary: '#1e293b',
  },
  text: {
    primary: '#f8fafc',
    secondary: '#94a3b8',
    tertiary: '#64748b',
  },
};

const ThemeContext = createContext({
  isDarkMode: 'dark',
  toggleTheme: () => {},
  theme: darkThemeColors,
});

export const useThemeMode = () => useContext(ThemeContext);

export const useAppTheme = () => useContext(ThemeContext).theme;

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState('dark');

  useEffect(() => {
    const savedTheme = Cookies.get('darkMode') || 'dark';
    setIsDarkMode(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkMode === 'dark' ? 'light' : 'dark';
    setIsDarkMode(newTheme);
    Cookies.set('darkMode', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const currentThemeColors = isDarkMode === 'dark' ? darkThemeColors : lightThemeColors;

  const theme = createTheme({
    palette: {
      mode: isDarkMode === 'dark' ? 'dark' : 'light',
      primary: {
        main: currentThemeColors.primary.main,
      },
      background: {
        default: currentThemeColors.background.primary,
        paper: currentThemeColors.background.secondary,
      },
      text: {
        primary: currentThemeColors.text.primary,
        secondary: currentThemeColors.text.secondary,
      },
      divider: isDarkMode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme: currentThemeColors }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

