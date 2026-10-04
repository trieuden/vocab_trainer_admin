'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  BaseTable,
  BaseTableColumn,
  BasePageHeader,
  BaseActionCell,
  BasePopup,
  useToast,
} from '../../../core/components';
import { getSystemConfigs, updateSystemConfig, SystemConfigItem } from '../../../core/api/system-config';
import { Eye, EyeOff, Save, X, Settings2 } from 'lucide-react';

export function SettingsPage() {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [configs, setConfigs] = useState<SystemConfigItem[]>([]);

  // Edit modal state
  const [editItem, setEditItem] = useState<SystemConfigItem | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [showSecret, setShowSecret] = useState(false);

  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const data = await getSystemConfigs();
      setConfigs(data || []);
    } catch (err) {
      console.error(err);
      error('Không thể tải danh sách cấu hình hệ thống!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleOpenEdit = (item: SystemConfigItem) => {
    setEditItem(item);
    setEditValue(item.value || '');
    setEditDescription(item.description || '');
    setShowSecret(false);
  };

  const handleCloseEdit = () => {
    setEditItem(null);
    setEditValue('');
    setEditDescription('');
    setShowSecret(false);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem) return;

    setSaving(true);
    try {
      await updateSystemConfig(editItem.code, editValue.trim(), editDescription.trim());
      success(`Cập nhật cấu hình [${editItem.code}] thành công!`);
      handleCloseEdit();
      await fetchConfigs();
    } catch (err) {
      console.error(err);
      error(`Lưu cấu hình [${editItem.code}] thất bại!`);
    } finally {
      setSaving(false);
    }
  };

  const columns = useMemo<BaseTableColumn<SystemConfigItem>[]>(
    () => [
      {
        key: 'stt',
        title: 'STT',
        width: 70,
        align: 'center',
        render: (_row, index) => <span className="text-slate-500 font-medium">{index + 1}</span>,
      },
      {
        key: 'code',
        title: 'Code',
        width: 220,
        render: (row) => (
          <span className="font-mono font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-1 rounded text-xs">
            {row.code}
          </span>
        ),
      },
      {
        key: 'description',
        title: 'Description',
        width: 320,
        render: (row) => (
          <span className="text-slate-600 dark:text-slate-300 text-sm">
            {row.description || '—'}
          </span>
        ),
      },
      {
        key: 'value',
        title: 'Value',
        width: 300,
        render: (row) => {
          const isSecretKey = row.code.toUpperCase().includes('KEY') || row.code.toUpperCase().includes('SECRET');
          const displayValue = isSecretKey && row.value
            ? `${row.value.slice(0, 6)}••••••••${row.value.slice(-4)}`
            : row.value;

          return (
            <span
              className={`text-sm ${
                isSecretKey
                  ? 'font-mono text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded'
                  : 'text-slate-800 dark:text-slate-200 font-medium'
              }`}
            >
              {displayValue || <i className="text-slate-400 font-normal">Chưa có giá trị</i>}
            </span>
          );
        },
      },
      {
        key: 'actions',
        title: 'Thao tác',
        width: 100,
        align: 'center',
        render: (row) => (
          <BaseActionCell
            onEdit={() => handleOpenEdit(row)}
          />
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <BasePageHeader
        title="Quản lý Cấu hình Hệ thống (System Config)"
        description="Danh sách các biến cấu hình hệ thống và AI. Mã cấu hình (Code) cố định không thể chỉnh sửa."
      />

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-blue-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Danh sách cấu hình</h2>
          </div>
        </div>

        <BaseTable<SystemConfigItem>
          columns={columns}
          data={configs}
          loading={loading}
          emptyText="Không có cấu hình hệ thống nào"
          rowKey={(row) => row.id || row.code}
        />
      </div>

      {/* Popup Edit Modal */}
      <BasePopup
        open={!!editItem}
        title={`Chỉnh sửa cấu hình [${editItem?.code || ''}]`}
        onClose={handleCloseEdit}
      >
        <form onSubmit={handleSaveEdit} className="space-y-4 p-2">
          {/* Read-only Code field */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Code (Không thể chỉnh sửa)
            </label>
            <input
              type="text"
              value={editItem?.code || ''}
              disabled
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono text-sm cursor-not-allowed"
            />
          </div>

          {/* Description field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description (Mô tả)
            </label>
            <textarea
              rows={2}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Nhập mô tả cho cấu hình này..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Value field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Value (Giá trị)
            </label>
            <div className="relative">
              {editItem?.code.toUpperCase().includes('KEY') || editItem?.code.toUpperCase().includes('SECRET') ? (
                <>
                  <input
                    type={showSecret ? 'text' : 'password'}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    placeholder="Nhập giá trị..."
                    className="w-full pl-3.5 pr-10 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </>
              ) : (
                <textarea
                  rows={3}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  placeholder="Nhập giá trị..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleCloseEdit}
              disabled={saving}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </BasePopup>
    </div>
  );
}
