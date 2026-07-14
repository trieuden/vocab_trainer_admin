'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, X, ChevronLeft, ChevronRight, User } from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

interface SidebarProps {
  items: NavItem[];
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

function SidebarNavItem({ item, isActive, level = 0, isCollapsed = false }: { item: NavItem; isActive: (href: string) => boolean; level?: number; isCollapsed?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isItemActive = item.href ? isActive(item.href) : false;
  const isChildActive = hasChildren && item.children?.some(child => child.href && isActive(child.href));

  useEffect(() => {
    if (isChildActive) setIsOpen(true);
  }, [isChildActive]);

  const content = (
    <div 
      className={`
        group relative flex items-center justify-between px-3 py-2.5 mx-2 my-1 rounded-xl cursor-pointer 
        transition-all duration-300 ease-out
        ${isItemActive 
          ? 'bg-blue-600/10 dark:bg-blue-600/15 text-blue-600 dark:text-blue-400 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.3)]' 
          : 'text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-500 dark:hover:text-slate-400'
        }
      `}
      style={{ paddingLeft: level > 0 ? `${(level * 0.75) + 0.75}rem` : undefined }}
    >
      {/* Active Indicator Glow */}
      {isItemActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
      )}

      <div className="flex items-center gap-3 flex-1 min-w-0">
        {item.icon && (
          <span className={`
            flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300
            ${isItemActive ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 scale-110' : 'text-slate-900 dark:text-slate-100 group-hover:text-slate-500 dark:group-hover:text-slate-400 group-hover:scale-110'}
          `}>
            {item.icon}
          </span>
        )}
        <span className={`
          text-sm font-medium transition-all duration-300 whitespace-nowrap overflow-hidden
          ${isCollapsed && level === 0 ? 'w-0 opacity-0' : 'w-auto opacity-100'}
        `}>
          {item.label}
        </span>
      </div>

      {hasChildren && !isCollapsed && (
        <ChevronDown className={`
          w-4 h-4 transition-transform duration-300 ease-in-out
          ${isOpen ? 'rotate-180' : ''}
          ${isItemActive || isChildActive ? 'text-blue-500' : 'text-slate-900 dark:text-slate-100 group-hover:text-slate-500 dark:group-hover:text-slate-400'}
        `} />
      )}
    </div>
  );

  return (
    <div className="w-full">
      {hasChildren ? (
        <div onClick={() => !isCollapsed && setIsOpen(!isOpen)}>
          {content}
        </div>
      ) : (
        <Link href={item.href || '#'}>
          {content}
        </Link>
      )}

      {hasChildren && isOpen && !isCollapsed && (
        <div className="grid grid-cols-1 overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-top-1">
          {item.children!.map((child) => (
            <SidebarNavItem key={child.id} item={child} isActive={isActive} level={level + 1} isCollapsed={isCollapsed} />
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar({ items, isCollapsed, onToggleCollapse }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const handleIsActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + '/');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-30 lg:hidden transition-all duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-200 rounded-xl lg:hidden shadow-xl"
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Desktop Collapse Toggle */}
      <button
        onClick={onToggleCollapse}
        className={`
          hidden lg:flex fixed top-6 z-50 p-1.5 
          bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-blue-500 dark:hover:text-white rounded-lg 
          shadow-lg transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${isCollapsed ? 'left-[4.5rem]' : 'left-[15rem]'}
        `}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <aside className={`
        fixed top-0 left-0 h-screen z-40 
        bg-white dark:bg-[#020617] border-r border-slate-200 dark:border-slate-800
        flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${isCollapsed ? 'lg:w-[5.5rem] w-64' : 'w-64'} 
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Subtle Decorative Gradient */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-600/5 to-transparent pointer-events-none" />

        {/* Header / Logo */}
        <div className={`
          h-20 flex items-center px-6 shrink-0 relative
          ${isCollapsed ? 'lg:px-0 lg:justify-center' : ''}
        `}>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                <span className="text-white font-black text-lg">V</span>
              </div>
            </div>
            <div className={`
              flex flex-col transition-all duration-500 overflow-hidden
              ${isCollapsed ? 'lg:w-0 lg:opacity-0' : 'w-auto opacity-100'}
            `}>
              <span className="text-slate-900 dark:text-white font-bold tracking-tight text-lg leading-tight uppercase">Vocab</span>
              <span className="text-blue-500 font-medium text-xs tracking-[0.2em] uppercase">Trainer</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto pt-2 pb-6 custom-scrollbar relative">
          {items.map((item) => (
            <SidebarNavItem key={item.id} item={item} isActive={handleIsActive} isCollapsed={isCollapsed} />
          ))}
        </nav>
      </aside>
    </>
  );
}


