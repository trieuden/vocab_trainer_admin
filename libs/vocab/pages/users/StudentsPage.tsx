'use client';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BaseAdvancedSearch,
  BaseConfirmDialog,
  BaseLoading,
  BasePagination,
  BaseTable,
  BaseTableColumn,
  BaseToggle,
  BaseActionCell,
  BaseAddButton,
  BasePageHeader,
  BaseToolbar,
} from '../../../core/components';
import { Phone } from 'lucide-react';
import { useUsers } from './hooks';
import { enumData } from '@/core/enums/enumData';
import { useIsMounted } from '@/core/hooks/useIsMounted';
import type { GetUsersDto } from '@/core/api/users/dtos';
import { EUser } from '@/core/enums';

const { PAGE_SIZE, PAGE_INDEX } = enumData.PageRequest;

export const StudentsPage = () => {
  const { t } = useTranslation('common');
  const { t: ts } = useTranslation('students');
  const isMounted = useIsMounted();
  const [filters, setFilters] = useState<Partial<GetUsersDto>>({
    pageIndex: PAGE_INDEX,
    pageSize: PAGE_SIZE,
    type: EUser.EUserType.STUDENT,
  });
  const { data, total, loading, setRefresh } = useUsers(filters as GetUsersDto);

  if (!isMounted) return null;

  const columns: BaseTableColumn<any>[] = [
    { key: 'id', title: ts('col_id'), width: 90, sortable: true, defaultVisible: false },
    {
      key: 'name', title: ts('col_name'), width: 200, sortable: true,
      render: row => (
        <span style={{ display:'inline-flex', alignItems:'center', gap:10 }}>
          <img src={row.avatar} alt="" width={30} height={30} style={{ borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
          <span style={{ fontWeight:500 }}>{row?.name}</span>
        </span>
      ),
    },
    { key: 'email', title: ts('col_email'), width: 230, sortable: true },
    { key: 'username', title: ts('col_username'), width: 120, sortable: true },
    {
      key: 'phone', title: ts('col_phone'), width: 110, align:'right', sortable: true,
      render: row => (
        <span style={{ display:'inline-flex', alignItems:'center', gap:4, justifyContent:'flex-end' }}>
          <Phone size={11} style={{ color:'#8b5cf6' }} />
          <span style={{ fontWeight:600 }}>{row.phone}</span>
        </span>
      ),
    },
    {
      key: 'isDeleted', title: ts('col_status'), width: 160,
      render: row => (
        <BaseToggle
          checked={row.isDeleted === true}
          onChange={() => {}}
          label={row.isDeleted === true ? t('active') : t('locked')}
          size="sm"
        />
      ),
    },
    {
      key: 'actions', title: ts('col_actions'), width: 100, hideable: false,
      render: row => (
        <BaseActionCell onEdit={() => {}} onDelete={() => {}} />
      ),
    },
  ];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {/* Header */}
      <BasePageHeader title={ts('title')} description={ts('description')} />

      {/* Toolbar */}
      <BaseToolbar>
        <BaseAdvancedSearch
          panelTitle={ts('advanced_search.title')}
          searchLabel={ts('advanced_search.search')}
          resetLabel={ts('advanced_search.reset')}
          fields={[
            { key: 'name', label: ts('advanced_search.name'), placeholder: ts('advanced_search.name_placeholder') },
            { key: 'username', label: ts('advanced_search.username'), placeholder: ts('advanced_search.username_placeholder') },
            { key: 'email', label: ts('advanced_search.email'), placeholder: ts('advanced_search.email_placeholder') },
            { key: 'phone', label: ts('advanced_search.phone'), placeholder: ts('advanced_search.phone_placeholder') },
          ]}
          values={filters as Record<string, string>}
          onChange={(key, value) => setFilters((prev) => ({ ...prev, [key as keyof GetUsersDto]: value }))}
          onSearch={() => setRefresh(new Date().getTime())}
          onReset={() => setFilters({ pageSize: PAGE_SIZE, pageIndex: PAGE_INDEX })}
        />
        <span style={{ fontSize:12, color:'#9ca3af', marginLeft:'auto' }}>{data.length} {t('results')}</span>
        <BaseAddButton label={ts('add')} onClick={() => {}} />
      </BaseToolbar>

      {/* Table */}
      {loading ? (
        <BaseLoading label={t('loading')} />
      ) : (
        <BaseTable columns={columns} data={data} rowKey={(r) => r.id} emptyText={t('no_data')} />
      )}

      {/* Pagination */}
      <BasePagination page={PAGE_INDEX} pageSize={PAGE_SIZE} total={total} onPageChange={() => {}} />

      {/* Confirm Dialog */}
      <BaseConfirmDialog open={false} title={ts('delete_title')} message={t('delete_confirm_msg').replace('{{name}}', '')} confirmLabel={t('delete')} cancelLabel={t('cancel')} onConfirm={() => {}} onCancel={() => {}} />
    </div>
  );
}
