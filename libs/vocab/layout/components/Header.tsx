'use client';

import React, { useState } from 'react';
import { Sun, Moon, Bell, Search, User, LogOut, ChevronDown } from 'lucide-react';
import { useThemeMode } from '../../providers/ThemeProvider';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useLanguageSwitcher } from '../../../core/hooks/useLanguageSwitcher';
import { clearAuthCookies } from '../../../core/auth/authCookies';

// Map route segments to nav translation keys
const ROUTE_LABEL_MAP: Record<string, string> = {
  dashboard: 'nav.dashboard',
  users: 'nav.users',
  teachers: 'nav.teachers',
  students: 'nav.students',
  'lesson-plans': 'nav.lesson_plans',
  minigame: 'nav.minigame',
  settings: 'nav.settings',
};

export function Header() {
  const { isDarkMode, toggleTheme } = useThemeMode();
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation('layout');
  const { currentLocale, switchLocale } = useLanguageSwitcher();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Build breadcrumb from path
  const pathSegments = pathname?.split('/').filter(Boolean) || [];
  // Skip locale segment (first segment)
  const pageSegments = pathSegments.slice(1);
  const currentSegment = pageSegments[pageSegments.length - 1] || 'dashboard';
  const currentPage = t(ROUTE_LABEL_MAP[currentSegment] || `nav.${currentSegment}`, { defaultValue: currentSegment.charAt(0).toUpperCase() + currentSegment.slice(1) });
  const parentSegment = pageSegments.length > 1 ? pageSegments[pageSegments.length - 2] : null;
  const parentPage = parentSegment ? t(ROUTE_LABEL_MAP[parentSegment] || `nav.${parentSegment}`, { defaultValue: parentSegment }) : null;

  const handleLogout = () => {
    clearAuthCookies();
    setIsProfileMenuOpen(false);
    const locale = pathname?.split('/')[1] === 'en' ? 'en' : 'vi';
    router.push(`/${locale}/login`);
  };

  return (
    <header className="sticky top-0 z-30 h-16 w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#020617] px-4 sm:px-8 flex items-center justify-between transition-colors duration-300">
      {/* Left: breadcrumb */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 transition-colors">
            {currentPage}
          </h2>
          <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">
            <span>{t('header.admin', { defaultValue: 'ADMIN' })}</span>
            {parentPage && (
              <>
                <span>/</span>
                <span>{parentPage}</span>
              </>
            )}
            <span>/</span>
            <span className="text-blue-500 dark:text-blue-400">{currentPage}</span>
          </div>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search */}
        <button
          className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-all hidden md:flex items-center gap-2 cursor-pointer"
          title={t('header.search_placeholder')}
        >
          <Search size={17} />
        </button>

        {/* Notifications */}
        <button
          className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-all cursor-pointer"
          title={t('header.notifications')}
        >
          <Bell size={17} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-[#020617]" />
        </button>

        <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-1" />

        {/* Language switcher VIE / ENG */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 rounded-lg p-1">
          {(['vi', 'en'] as const).map((lng) => (
            <button
              key={lng}
              onClick={() => switchLocale(lng)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider transition-all duration-200 cursor-pointer ${
                currentLocale === lng
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title={lng === 'vi' ? 'Tiếng Việt' : 'English'}
            >
              {lng === 'vi' ? 'VIE' : 'ENG'}
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-1" />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-600 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400 rounded-lg transition-all flex items-center justify-center group cursor-pointer"
          title={isDarkMode === 'dark' ? t('header.switch_to_light') : t('header.switch_to_dark')}
        >
          {isDarkMode === 'dark' ? (
            <Sun size={18} className="group-hover:rotate-45 transition-transform duration-500" />
          ) : (
            <Moon size={18} className="group-hover:-rotate-12 transition-transform duration-500" />
          )}
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen((v) => !v)}
            className="p-2 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
            title="Account"
          >
            <User size={17} />
            <ChevronDown size={14} />
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] z-50 min-w-[180px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl p-2">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 px-2 py-1">Tai khoan</div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
                title="Logout"
              >
                <LogOut size={16} />
                <span className="text-sm font-semibold">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
