'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Play } from 'lucide-react';
import {
  BaseAdvancedSearch,
  BaseConfirmDialog,
  BaseLoading,
  BasePagination,
  BaseTable,
  BaseTableColumn,
  BaseActionCell,
  BaseAddButton,
  BasePageHeader,
  BaseToolbar,
  useToast,
} from '../../../core/components';
import { getLessonPlanDetail, deleteLessonPlan } from '@/core/api/lesson_plans';
import { AddLessonPlanPopup, LessonPlanDetail, LessonPlanSlideshow } from './components';
import { useLessonPlans } from './hooks';
import { enumData } from '@/core/enums/enumData';
import { useIsMounted } from '@/core/hooks/useIsMounted';
import type { GetLessonPlansDto, LessonPlanItem, LessonPlanDetailData } from '@/core/api/lesson_plans/dtos';

const { PAGE_SIZE, PAGE_INDEX } = enumData.PageRequest;

export const LessonPlansPage = () => {
  const { t } = useTranslation('common');
  const { t: tl } = useTranslation('lesson_plans');
  const { success, error } = useToast();
  const isMounted = useIsMounted();
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LessonPlanItem | null>(null);
  const [slideshowData, setSlideshowData] = useState<LessonPlanDetailData | null>(null);
  const [slideshowLoading, setSlideshowLoading] = useState(false);
  const [filters, setFilters] = useState<Partial<GetLessonPlansDto>>({
    pageIndex: PAGE_INDEX,
    pageSize: PAGE_SIZE,
  });
  const { data, total, loading, setRefresh } = useLessonPlans(filters as GetLessonPlansDto);

  if (!isMounted) return null;

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteLessonPlan(deleteTarget.id);
      success('Xóa giáo án thành công!');
      setDeleteTarget(null);
      setRefresh(new Date().getTime());
    } catch {
      error('Xóa giáo án thất bại!');
    }
  };

  const columns: BaseTableColumn<LessonPlanItem>[] = [
    { key: 'id', title: tl('col_id'), width: 80, sortable: true, defaultVisible: false },
    {
      key: 'name',
      title: tl('col_name'),
      width: 180,
      sortable: true,
      render: (row) => <span className="font-medium text-slate-900 dark:text-white">{row.name ?? '—'}</span>,
    },
    {
      key: 'user.name',
      title: tl('col_teacher'),
      width: 160,
      sortable: true,
      render: (row) => <span className="font-medium text-slate-700 dark:text-slate-300">{row.user?.name ?? '—'}</span>,
    },
    {
      key: 'level',
      title: tl('col_level'),
      width: 100,
      sortable: true,
      render: (row) => <span>{row.level ?? '—'}</span>,
    },
    {
      key: 'warmUp',
      title: tl('col_warm_up'),
      width: 180,
      render: (row) => row.warmUp?.name || '—',
    },
    {
      key: 'vocab',
      title: tl('col_vocab'),
      width: 180,
      render: (row) => row.vocab?.name || '—',
    },
    {
      key: 'grammar',
      title: tl('col_grammar'),
      width: 180,
      render: (row) => row.grammar?.name || '—',
    },
    {
      key: 'listening',
      title: tl('col_listening'),
      width: 180,
      render: (row) => row.listening?.name || '—',
    },
    {
      key: 'writing',
      title: tl('col_writing'),
      width: 180,
      render: (row) => row.writing?.name || '—',
    },
    {
      key: 'speaking',
      title: tl('col_speaking'),
      width: 180,
      render: (row) => row.speaking?.name || '—',
    },
    {
      key: 'actions',
      title: tl('col_actions'),
      width: 150,
      hideable: false,
      pinned: 'right',
      render: (row) => (
        <div className="flex items-center gap-1">
          <BaseActionCell
            onView={() => setDetailId(row.id)}
            onDelete={() => setDeleteTarget(row)}
            labels={{
              view: tl('action_view'),
              edit: tl('action_edit'),
              delete: t('delete'),
            }}
          />
          <button
            title={tl('detail.slideshow')}
            onClick={async () => {
              setSlideshowLoading(true);
              try {
                const detail = await getLessonPlanDetail(row.id);
                setSlideshowData(detail);
              } catch {
                error('Không thể tải dữ liệu trình chiếu');
              } finally {
                setSlideshowLoading(false);
              }
            }}
            disabled={slideshowLoading}
            className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-slate-200 bg-slate-50 text-blue-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-white/5 dark:text-blue-400 disabled:opacity-50"
          >
            <Play size={12} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <BasePageHeader title={tl('title')} description={tl('description')} />

      <BaseToolbar>
        <BaseAdvancedSearch
          panelTitle={tl('advanced_search.title')}
          searchLabel={tl('advanced_search.search')}
          resetLabel={tl('advanced_search.reset')}
          fields={[
            {
              key: 'name',
              label: tl('advanced_search.teacher'),
              placeholder: tl('advanced_search.teacher_placeholder'),
              width: 350,
            },
            {
              key: 'level',
              label: tl('advanced_search.level'),
              placeholder: tl('advanced_search.level_placeholder'),
              width: 350,
            },
          ]}
          values={filters as Record<string, string>}
          onChange={(key, value) => setFilters((prev) => ({ ...prev, [key as keyof GetLessonPlansDto]: value }))}
          onSearch={() => setRefresh(new Date().getTime())}
          onReset={() => setFilters({ pageSize: PAGE_SIZE, pageIndex: PAGE_INDEX })}
        />
        <span className="text-xs text-slate-400 ml-auto">
          {data.length} {t('results')}
        </span>
        <BaseAddButton label={tl('add')} onClick={() => setShowAddPopup(true)} />
      </BaseToolbar>

      {loading ? (
        <BaseLoading label={t('loading')} />
      ) : (
        <BaseTable columns={columns} data={data} rowKey={(r) => r.id} emptyText={t('no_data')} />
      )}

      <BasePagination page={PAGE_INDEX} pageSize={PAGE_SIZE} total={total} onPageChange={() => {}} />

      <BaseConfirmDialog
        open={!!deleteTarget}
        title={tl('delete_title')}
        message={t('delete_confirm_msg').replace('{{name}}', deleteTarget?.name || '')}
        confirmLabel={t('delete')}
        cancelLabel={t('cancel')}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <AddLessonPlanPopup
        open={showAddPopup}
        onClose={() => setShowAddPopup(false)}
        onCreated={() => setRefresh(new Date().getTime())}
      />

      <LessonPlanDetail
        id={detailId}
        open={detailId !== null}
        onClose={() => setDetailId(null)}
      />

      {slideshowData && (
        <LessonPlanSlideshow
          data={slideshowData}
          onClose={() => setSlideshowData(null)}
        />
      )}
    </div>
  );
};
