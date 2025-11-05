'use client'
import { GettableTypes, GETTABLE_NAMES, GETTABLE_DATA, SortDirection } from '@shared/src';
import { List, Filters, CreateButton } from './components';
import { AdminPage } from '../AdminPage';
import { formatToTitle } from '@/lib/api/utils';
import { FiltersConfig } from './components/Filters/types';
import { ColumnConfig } from './components/List/components';
import { useModel } from '@/hooks/admin/queries';
import { useModelFilters } from '@/hooks/admin/actions/useModelFilters';
import { ReactElement, useState, cloneElement } from 'react';

type ListPageProps<M extends GETTABLE_NAMES> = {
  model: M;
  type?: 'table' | 'cards';
  create_modal?: ReactElement<{ onClose: () => void }>;
  filters_config?: FiltersConfig | (() => FiltersConfig);
  render_item: (item: GettableTypes<M>['model']) => ReactElement;
  shimmer_item: (key: string) => ReactElement;
  columns: ColumnConfig<keyof GettableTypes<M>['model']>[];
  sort_by_list: string[];
}

export const ListPage = <M extends GETTABLE_NAMES>({
  model,
  type = 'table',
  create_modal,
  filters_config,
  render_item,
  shimmer_item,
  columns,
  sort_by_list,
}: ListPageProps<M>) => {
  const { filters, setFilters } = useModelFilters({ model })
  const [is_modal_open, setIsModalOpen] = create_modal ? useState(false) : [undefined, () => { }];
  const { data } = useModel(model).get(filters)

  const handleSort = (field: keyof GettableTypes<M>['model']) => {
    // Toggle sort direction if clicking on the same field
    if (filters.sort_field === field) {
      const new_direction = filters.sort_direction === SortDirection.asc
        ? SortDirection.desc
        : SortDirection.asc;
      setFilters({ sort_direction: new_direction } as Partial<GettableTypes<M>['filters']>);
    } else {
      // Set new field with ascending order by default
      setFilters({
        sort_field: field,
        sort_direction: SortDirection.asc
      } as Partial<GettableTypes<M>['filters']>);
    }
  };

  return (
    <AdminPage title={formatToTitle(GETTABLE_DATA[model])}>
      <Filters<M>
        filters={filters}
        setFilters={setFilters}
        filters_config={typeof filters_config === 'function' ? filters_config() : filters_config}
        sort_by_list={sort_by_list}
        create_button={create_modal && <CreateButton label={`Create ${model.toLowerCase()}`} onClick={() => setIsModalOpen(true)} />}
      />
      <List<GettableTypes<M>['model']>
        type={type}
        render={render_item}
        items={data?.items}
        shimmer={shimmer_item}
        columns={columns}
        header={formatToTitle(GETTABLE_DATA[model])}
        current_sort_field={filters.sort_field as keyof GettableTypes<M>['model']}
        current_sort_direction={filters.sort_direction}
        onSort={handleSort}
      />
      {is_modal_open && create_modal && cloneElement(create_modal, { onClose: () => setIsModalOpen(false) })}
    </AdminPage>
  )
};