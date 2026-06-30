'use client';

import React from 'react';
import { Download, Eye, Pencil, Trash2, type LucideIcon } from 'lucide-react';

const btnBase: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 30,
  height: 30,
  borderRadius: 7,
  border: '1px solid #e5e7eb',
  background: 'transparent',
  cursor: 'pointer',
  transition: 'all 0.15s',
};

const VARIANTS: Record<
  'view' | 'edit' | 'download' | 'delete',
  { color: string; hoverBg: string; hoverBorder: string; Icon: LucideIcon }
> = {
  view: { color: '#64748b', hoverBg: '#f1f5f9', hoverBorder: '#64748b', Icon: Eye },
  edit: { color: '#3b82f6', hoverBg: '#eff6ff', hoverBorder: '#3b82f6', Icon: Pencil },
  download: { color: '#059669', hoverBg: '#ecfdf5', hoverBorder: '#059669', Icon: Download },
  delete: { color: '#ef4444', hoverBg: '#fef2f2', hoverBorder: '#ef4444', Icon: Trash2 },
};

const DEFAULT_LABELS = {
  view: 'Xem',
  edit: 'Sửa',
  download: 'Tải xuống',
  delete: 'Xóa',
} as const;

function ActionIconButton({
  variant,
  title,
  onClick,
}: {
  variant: keyof typeof VARIANTS;
  title: string;
  onClick: () => void;
}) {
  const v = VARIANTS[variant];
  const Icon = v.Icon;
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      style={{ ...btnBase, color: v.color }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = v.hoverBg;
        e.currentTarget.style.borderColor = v.hoverBorder;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.borderColor = '#e5e7eb';
      }}
    >
      <Icon size={13} />
    </button>
  );
}

export interface BaseActionCellProps {
  onView?: () => void;
  onEdit?: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
  /** Tooltip / title cho từng nút; các key không truyền dùng mặc định tiếng Việt */
  labels?: Partial<{
    view: string;
    edit: string;
    download: string;
    delete: string;
  }>;
}

/**
 * Cột tác vụ dùng chung: chỉ render nút khi có handler tương ứng.
 * Thực tế hiển thị: Xem -> Sửa -> Tải xuống -> Xóa.
 */
export function BaseActionCell({ onView, onEdit, onDownload, onDelete, labels }: BaseActionCellProps) {
  const L = { ...DEFAULT_LABELS, ...labels };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      {onView && <ActionIconButton variant="view" title={L.view} onClick={onView} />}
      {onEdit && <ActionIconButton variant="edit" title={L.edit} onClick={onEdit} />}
      {onDownload && <ActionIconButton variant="download" title={L.download} onClick={onDownload} />}
      {onDelete && <ActionIconButton variant="delete" title={L.delete} onClick={onDelete} />}
    </span>
  );
}
