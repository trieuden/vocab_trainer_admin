"use client";

import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/core/utils/cn";
import styles from "./base-collapsible-section.module.css";

export interface BaseCollapsibleSectionProps {
    title: React.ReactNode;
    expanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    /** Thêm class lên header (ví dụ màu nền theo từng mục) */
    headerClassName?: string;
    className?: string;
    bodyClassName?: string;
    toggleAriaLabel?: string;
}

export function BaseCollapsibleSection({
    title,
    expanded,
    onToggle,
    children,
    headerClassName,
    className,
    bodyClassName,
    toggleAriaLabel,
}: BaseCollapsibleSectionProps) {
    return (
        <div className={cn(styles.root, className)}>
            <button
                type="button"
                className={cn(styles.header, headerClassName)}
                onClick={onToggle}
                aria-expanded={expanded}
                aria-label={toggleAriaLabel}
            >
                <span className={styles.title}>{title}</span>
                <span className={styles.chevron} aria-hidden>
                    {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </span>
            </button>

            <div className={cn(styles.body, bodyClassName, !expanded && styles.bodyHidden)}>{children}</div>
        </div>
    );
}
