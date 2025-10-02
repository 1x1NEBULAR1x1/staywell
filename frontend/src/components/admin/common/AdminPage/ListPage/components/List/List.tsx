import classes from './List.module.scss';

import { ColumnNames } from './components';
import { GETTABLE_NAMES, GettableTypes } from '@shared/src';
import { ReactNode } from 'react';

type ListProps<T extends GettableTypes<GETTABLE_NAMES>['model']> = {
  render: (item: T) => ReactNode;
  items?: T[];
  shimmer: (key: string) => ReactNode;
  shimmer_count?: number;
  columns: string[];
  header: string;
}

export const List = <T extends GettableTypes<GETTABLE_NAMES>['model']>({
  render,
  items,
  shimmer,
  columns,
  header,
  shimmer_count = 3,
}: ListProps<T>) => {
  return (
    <div className={classes.list}>
      <div className={classes.list_header}>{header}</div>
      <table className={classes.list_table}>
        <ColumnNames columns={columns} />
        <tbody>
          {items
            ? items.map((item) => render(item))
            : Array.from({ length: shimmer_count }).map((_, index) => shimmer(`${index}-shimmer-item`))
          }
        </tbody>
      </table>
    </div>
  )
}