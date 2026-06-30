'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Cookies from 'js-cookie';

const ThemeContext = createContext({
  isDarkMode: 'dark',
  toggleTheme: () => {},
});

export const useThemeMode = () => useContext(ThemeContext);

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

  const theme = createTheme({
    palette: {
      mode: isDarkMode === 'dark' ? 'dark' : 'light',
      primary: {
        main: '#3b82f6', // blue-500
      },
      background: {
        default: isDarkMode === 'dark' ? '#020617' : '#f8fafc',
        paper: isDarkMode === 'dark' ? '#0f172a' : '#ffffff',
      },
      text: {
        primary: isDarkMode === 'dark' ? '#f8fafc' : '#0f172a',
        secondary: isDarkMode === 'dark' ? '#94a3b8' : '#64748b',
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
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

