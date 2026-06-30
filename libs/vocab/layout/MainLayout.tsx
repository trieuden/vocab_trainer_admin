'use client';

import React, { useState } from 'react';
import { Sidebar, NavItem } from './components/Sidebar';
import { Header } from './components/Header';
import {
  LayoutDashboard, Users, Settings, GamepadIcon,
  GraduationCap, UserCheck, FileStack,
} from 'lucide-react';
import { cn } from '../../core/utils/cn';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useIsMounted } from '../../core/hooks/useIsMounted';

function useMenuItems(): NavItem[] {
  const { t } = useTranslation('layout');
  const isMounted = useIsMounted();

  // Return specific keys on server/initial client to match exactly
  // then update with translations once mounted
  return [
    {
      id: 'dashboard',
      label: isMounted ? t('nav.dashboard') : 'nav.dashboard',
      href: '/',
      icon: <LayoutDashboard size={18} />,
    },
    {
      id: 'users',
      label: isMounted ? t('nav.users') : 'nav.users',
      icon: <Users size={18} />,
      children: [
        { id: 'teachers', label: isMounted ? t('nav.teachers') : 'nav.teachers', href: '/users/teachers', icon: <UserCheck size={16} /> },
        { id: 'students', label: isMounted ? t('nav.students') : 'nav.students', href: '/users/students', icon: <GraduationCap size={16} /> },
      ],
    },
    {
      id: 'lesson-plans',
      label: isMounted ? t('nav.lesson_plans') : 'nav.lesson_plans',
      href: '/lesson-plans',
      icon: <FileStack size={18} />,
    },
    {
      id: 'minigame',
      label: isMounted ? t('nav.minigame') : 'nav.minigame',
      href: '/minigame',
      icon: <GamepadIcon size={18} />,
    },
    {
      id: 'settings',
      label: isMounted ? t('nav.settings') : 'nav.settings',
      href: '/settings',
      icon: <Settings size={18} />,
    },
  ];
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const menuItems = useMenuItems();
  const isMounted = useIsMounted();
  const pathname = usePathname();
  const isLoginPage = pathname?.endsWith('/login') || pathname?.endsWith('/login/');

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <main className="p-6 md:p-8 w-full min-h-screen flex items-center justify-center">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
      <Sidebar
        items={menuItems}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      <main className={cn(
        'flex-1 overflow-y-auto custom-scrollbar transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] bg-background',
        isCollapsed ? 'lg:ml-[5.5rem]' : 'lg:ml-64'
      )}>
        {isMounted ? <Header /> : <div className="h-16 border-b border-slate-200 dark:border-slate-800" />}
        <div className="p-6 md:p-8 w-full min-h-[calc(100vh-4rem)]">
          {children}
        </div>
      </main>
    </div>
  );
}
