'use client'
import { GettableTypes, GETTABLE_NAMES, GETTABLE_DATA } from '@shared/src';
import { List, Filters } from './components';
import { AdminPage } from '../AdminPage';
import { formatToTitle } from '@/lib/api/utils';

import { useModel, useModelFilters } from '@/hooks/admin/queries';
import { ReactNode } from 'react';

type ListPageProps<M extends GETTABLE_NAMES> = {
  model: M;
  filters_menu: ReactNode;
  render_item: (item: GettableTypes<M>['model']) => ReactNode;
  shimmer_item: (key: string) => ReactNode;
  columns: string[];
  sort_by_list: string[];
}

export const ListPage = <M extends GETTABLE_NAMES>({
  model,
  filters_menu,
  render_item,
  shimmer_item,
  columns,
  sort_by_list,
}: ListPageProps<M>) => {
  const { filters, updateFilters } = useModelFilters({ model })
  const { data } = useModel(model).get(filters)

  return (
    <AdminPage title={formatToTitle(GETTABLE_DATA[model])}>
      <Filters<M>
        filters={filters}
        updateFilters={updateFilters}
        filters_menu={filters_menu}
        sort_by_list={sort_by_list}
      />
      <List<GettableTypes<M>['model']>
        render={render_item}
        items={data?.items}
        shimmer={shimmer_item}
        columns={columns}
        header={formatToTitle(GETTABLE_DATA[model])}
      />
    </AdminPage>
  )
};