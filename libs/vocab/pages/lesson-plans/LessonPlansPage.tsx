'use client';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ClipboardList, Gamepad2, Play } from 'lucide-react';
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
} from '../../../core/components';
import { getLessonPlanDetail } from '@/core/api/lesson_plans';
import { AddLessonPlanPopup, LessonPlanDetail } from './components';
import { LessonPlanSlideshow } from './components/slideshow/lesson-plan-slideshow';
import { useLessonPlans } from './hooks';
import { enumData } from '@/core/enums/enumData';
import { useIsMounted } from '@/core/hooks/useIsMounted';
import type { GetLessonPlansDto } from '@/core/api/lesson_plans/dtos';

const { PAGE_SIZE, PAGE_INDEX } = enumData.PageRequest;

function TypeIcon({ type }: { type?: string }) {
  const t = String(type || '').toUpperCase();
  if (t === 'GAME') {
    return (
      <span title="GAME" style={{ display: 'inline-flex', flexShrink: 0 }}>
        <Gamepad2 size={14} style={{ color: '#8b5cf6' }} />
      </span>
    );
  }
  if (t === 'TASK') {
    return (
      <span title="TASK" style={{ display: 'inline-flex', flexShrink: 0 }}>
        <ClipboardList size={14} style={{ color: '#059669' }} />
      </span>
    );
  }
  return null;
}

function SegmentCell({ name, type, block }: { name?: string; type?: string; block?: any }) {
  const displayName = name || block?.name || block?.type || '—';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, maxWidth: 200 }}>
      <TypeIcon type={type} />
      <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {displayName}
      </span>
    </span>
  );
}

export const LessonPlansPage = () => {
  const { t } = useTranslation('common');
  const { t: tl } = useTranslation('lesson_plans');
  const isMounted = useIsMounted();
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [slideshowData, setSlideshowData] = useState<any | null>(null);
  const [slideshowLoading, setSlideshowLoading] = useState(false);
  const [filters, setFilters] = useState<Partial<GetLessonPlansDto>>({
    pageIndex: PAGE_INDEX,
    pageSize: PAGE_SIZE,
  });
  const { data, total, loading, setRefresh } = useLessonPlans(filters as GetLessonPlansDto);

  if (!isMounted) return null;

  const columns: BaseTableColumn<any>[] = [
    { key: 'id', title: tl('col_id'), width: 80, sortable: true, defaultVisible: false },
    {
      key: 'name',
      title: tl('col_name'),
      width: 180,
      sortable: true,
      render: (row) => <span style={{ fontWeight: 500 }}>{row?.name ?? '—'}</span>,
    },
    {
      key: 'user.name',
      title: tl('col_teacher'),
      width: 160,
      sortable: true,
      render: (row) => <span style={{ fontWeight: 500 }}>{row?.user?.name ?? '—'}</span>,
    },
    {
      key: 'level',
      title: tl('col_level'),
      width: 100,
      sortable: true,
      render: (row) => <span>{row?.level ?? '—'}</span>,
    },
    {
      key: 'warmUp',
      title: tl('col_warm_up'),
      width: 200,
      render: (row) => <SegmentCell block={row?.warmUp} type={row?.warmUpType} />,
    },
    {
      key: 'vocab',
      title: tl('col_vocab'),
      width: 200,
      render: (row) => <SegmentCell block={row?.vocab} type={row?.vocabType} />,
    },
    {
      key: 'grammar',
      title: tl('col_grammar'),
      width: 200,
      render: (row) => <SegmentCell block={row?.grammar} type={row?.grammarType} />,
    },
    {
      key: 'listening',
      title: tl('col_listening'),
      width: 200,
      render: (row) => <SegmentCell block={row?.listening} type={row?.listeningType} />,
    },
    {
      key: 'writing',
      title: tl('col_writing'),
      width: 200,
      render: (row) => <SegmentCell block={row?.writing} type={row?.writingType} />,
    },
    {
      key: 'speaking',
      title: tl('col_speaking'),
      width: 200,
      render: (row) => <SegmentCell block={row?.speaking} type={row?.speakingType} />,
    },
    {
      key: 'actions',
      title: tl('col_actions'),
      width: 150,
      hideable: false,
      pinned: 'right',
      render: (row) => (
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <BaseActionCell
            onView={() => setDetailId(row.id)}
            onEdit={() => {}}
            onDownload={() => {}}
            labels={{
              view: tl('action_view'),
              edit: tl('action_edit'),
              download: tl('action_download'),
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
                // ignore
              } finally {
                setSlideshowLoading(false);
              }
            }}
            disabled={slideshowLoading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 28,
              height: 28,
              borderRadius: 6,
              border: '1px solid #e2e8f0',
              background: '#f8fafc',
              cursor: slideshowLoading ? 'not-allowed' : 'pointer',
              color: '#2563eb',
              opacity: slideshowLoading ? 0.5 : 1,
            }}
          >
            <Play size={12} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
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
            },
            {
              key: 'level',
              label: tl('advanced_search.level'),
              placeholder: tl('advanced_search.level_placeholder'),
            },
          ]}
          values={filters as Record<string, string>}
          onChange={(key, value) => setFilters((prev) => ({ ...prev, [key as keyof GetLessonPlansDto]: value }))}
          onSearch={() => setRefresh(new Date().getTime())}
          onReset={() => setFilters({ pageSize: PAGE_SIZE, pageIndex: PAGE_INDEX })}
        />
        <span style={{ fontSize: 12, color: '#9ca3af', marginLeft: 'auto' }}>
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
        open={false}
        title={tl('delete_title')}
        message={t('delete_confirm_msg').replace('{{name}}', '')}
        confirmLabel={t('delete')}
        cancelLabel={t('cancel')}
        onConfirm={() => {}}
        onCancel={() => {}}
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
