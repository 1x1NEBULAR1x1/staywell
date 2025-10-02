import classes from './Filters.module.scss';

import { ReactNode } from 'react';
import { GETTABLE_NAMES, GettableTypes } from '@shared/src';

import { SortDirection as SortDirectionEnum } from '@shared/src/common/base-types/sort-direction.enum';

import { SearchInput, SortBySelect, SortDirectionSelect } from './components';

type FiltersProps<T extends GETTABLE_NAMES> = {
  sort_by_list?: string[];
  filters: GettableTypes<T>['filters'];
  updateFilters: (filters: GettableTypes<T>['filters']) => void;
  filters_menu: ReactNode
}

export const Filters = <T extends GETTABLE_NAMES>({ filters, updateFilters, sort_by_list, filters_menu }: FiltersProps<T>) => {
  return (
    <div className={classes.filters}>
      <div className={classes.left}>
        <SearchInput
          search={filters.search}
          setSearch={(search: string) => updateFilters({ ...filters, search })}
        />
      </div>
      <div className={classes.right}>
        <SortBySelect
          sort_by_list={sort_by_list}
          setSortBy={(sort_field: string) => updateFilters({ ...filters, sort_field: sort_field as keyof GettableTypes<T>['model'] })}
        />
        <SortDirectionSelect
          setSortDirection={(sort_direction: string) => updateFilters({ ...filters, sort_direction: sort_direction as SortDirectionEnum })}
        />
        {filters_menu}
      </div>
    </div>
  )
};