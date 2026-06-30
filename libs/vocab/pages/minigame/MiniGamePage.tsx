'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BaseTable,
  BaseTableColumn,
  BaseConfirmDialog,
  BasePagination,
  BaseToggle,
  useToast,
  BaseActionCell,
  BaseAddButton,
  BasePageHeader,
  BaseSearchInput,
  BaseToolbar,
} from '../../../core/components';
import { useIsMounted } from '../../../core/hooks/useIsMounted';

type GameType = 'quiz' | 'matching' | 'flashcard' | 'word_scramble';

const GAME_TYPE_LABEL: Record<GameType, string> = {
  quiz: 'Quiz',
  matching: 'Ghép cặp',
  flashcard: 'Flashcard',
  word_scramble: 'Sắp chữ',
};

interface MiniGame {
  id: string;
  name: string;
  type: GameType;
  description: string;
  status: 'active' | 'locked';
  updatedAt: string;
}

const MOCK_MINI_GAMES: MiniGame[] = [
  {
    id: 'mg-1',
    name: 'Quiz từ vựng A1',
    type: 'quiz',
    description: '20 câu trắc nghiệm theo chủ đề',
    status: 'active',
    updatedAt: '2025-03-01',
  },
  {
    id: 'mg-2',
    name: 'Ghép từ – nghĩa',
    type: 'matching',
    description: 'Kéo thả ghép cặp',
    status: 'active',
    updatedAt: '2025-03-02',
  },
  {
    id: 'mg-3',
    name: 'Flashcard ôn tập',
    type: 'flashcard',
    description: 'Lật thẻ học nhanh',
    status: 'locked',
    updatedAt: '2025-02-15',
  },
];

const PAGE_SIZE = 6;

const searchFn = (item: MiniGame, q: string) => {
  const s = q.toLowerCase();
  return (
    item.name.toLowerCase().includes(s) ||
    item.description.toLowerCase().includes(s) ||
    GAME_TYPE_LABEL[item.type].toLowerCase().includes(s)
  );
};

export function MiniGamePage() {
  const { t } = useTranslation('common');
  const { t: tm } = useTranslation('minigame');
  const isMounted = useIsMounted();
  const tt = (key: string) => (isMounted ? tm(key) : key);
  const tc = (key: string) => (isMounted ? t(key) : key);
  const toast = useToast();
  const [data, setData] = useState<MiniGame[]>(MOCK_MINI_GAMES);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<MiniGame | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((item) => searchFn(item, q));
  }, [data, search]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const handleSearch = useCallback((q: string) => {
    setSearch(q);
    setPage(1);
  }, []);

  const toggleStatus = useCallback(
    (id: string) => {
      setData((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status: item.status === 'active' ? 'locked' : 'active' }
            : item
        )
      );
      toast.success(t('toast_update_success'));
    },
    [toast, t]
  );

  const confirmDelete = useCallback((item: MiniGame) => setDeleteTarget(item), []);
  const cancelDelete = useCallback(() => setDeleteTarget(null), []);

  const executeDelete = useCallback(() => {
    if (!deleteTarget) return;
    setData((prev) => prev.filter((item) => item.id !== deleteTarget.id));
    toast.success(t('toast_delete_success'));
    setDeleteTarget(null);
    setPage((p) => {
      const newTotal = filtered.length - 1;
      const newMax = Math.max(1, Math.ceil(newTotal / PAGE_SIZE));
      return Math.min(p, newMax);
    });
  }, [deleteTarget, filtered.length, toast, t]);

  const columns: BaseTableColumn<MiniGame>[] = [
    { key: 'id', title: tt('col_id'), width: 90, sortable: true },
    { key: 'name', title: tt('col_name'), width: 200, sortable: true },
    {
      key: 'type',
      title: tt('col_type'),
      width: 130,
      sortable: true,
      render: (row) => <span style={{ fontWeight: 500 }}>{GAME_TYPE_LABEL[row.type]}</span>,
    },
    {
      key: 'description',
      title: tt('col_desc'),
      width: 240,
      defaultVisible: true,
    },
    {
      key: 'status',
      title: tt('col_status'),
      width: 160,
      render: (row) => (
        <BaseToggle
          checked={row.status === 'active'}
          onChange={() => toggleStatus(row.id)}
          label={row.status === 'active' ? tc('active') : tc('locked')}
          size="sm"
        />
      ),
    },
    {
      key: 'updatedAt',
      title: tt('col_updated'),
      width: 120,
      sortable: true,
      defaultVisible: false,
    },
    {
      key: 'actions',
      title: tt('col_actions'),
      width: 100,
      hideable: false,
      render: (row) => (
        <BaseActionCell
          onEdit={() => toast.info(`${tc('edit')}: ${row.name}`)}
          onDelete={() => confirmDelete(row)}
        />
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <BasePageHeader title={tt('title')} description={tt('description')} />

      <BaseToolbar>
        <BaseSearchInput value={search} onChange={handleSearch} placeholder={tt('search')} />
        <span style={{ fontSize: 12, color: '#9ca3af', marginLeft: 'auto' }}>
          {filtered.length} {tc('results')}
        </span>
        <BaseAddButton label={tt('add')} onClick={() => toast.info(tt('add'))} />
      </BaseToolbar>

      <BaseTable<MiniGame>
        columns={columns}
        data={paginated}
        rowKey={(r) => r.id}
        emptyText={tc('no_data')}
      />

      <BasePagination
        page={page}
        pageSize={PAGE_SIZE}
        total={filtered.length}
        onPageChange={setPage}
      />

      <BaseConfirmDialog
        open={!!deleteTarget}
        title={tt('delete_title')}
        message={tc('delete_confirm_msg').replace('{{name}}', deleteTarget?.name ?? '')}
        confirmLabel={tc('delete')}
        cancelLabel={tc('cancel')}
        onConfirm={executeDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
