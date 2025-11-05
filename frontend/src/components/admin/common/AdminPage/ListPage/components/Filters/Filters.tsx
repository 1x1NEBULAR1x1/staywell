import classes from './Filters.module.scss';

import type { ReactElement } from 'react';
import type { GETTABLE_NAMES, GettableTypes } from '@shared/src';
import type { FiltersConfig } from './types';

import { SearchInput, SortBySelect, SortDirectionSelect, DynamicFiltersMenu } from './components';

type FiltersProps<T extends GETTABLE_NAMES> = {
  sort_by_list?: string[];
  filters: GettableTypes<T>['filters'];
  setFilters: (filters: GettableTypes<T>['filters']) => void;
  filters_config?: FiltersConfig;
  create_button?: ReactElement
}

export const Filters = <T extends GETTABLE_NAMES>({
  filters,
  setFilters,
  sort_by_list,
  filters_config,
  create_button
}: FiltersProps<T>) => {
  return (
    <div className={classes.filters}>
      <div className={classes.left}>
        <SearchInput
          search={filters.search}
          setSearch={(search: string) => setFilters({ ...filters, search })}
        />
      </div>
      <div className={classes.right}>
        {create_button}
        <SortBySelect
          sort_by_list={sort_by_list}
          setSortBy={(sort_field) => setFilters({ ...filters, sort_field })}
        />
        <SortDirectionSelect
          setSortDirection={(sort_direction) => setFilters({ ...filters, sort_direction })}
        />
        {filters_config && (
          <DynamicFiltersMenu
            config={filters_config}
            filters={filters}
            setFilters={setFilters}
          />
        )}
      </div>
    </div>
  )
};