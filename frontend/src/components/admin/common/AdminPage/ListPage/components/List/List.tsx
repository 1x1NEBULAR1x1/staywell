import classes from './List.module.scss';

import { ColumnNames, ColumnConfig } from './components';
import { GETTABLE_NAMES, GettableTypes, SortDirection } from '@shared/src';
import { ReactNode, useEffect, useState } from 'react';

type ListProps<T extends GettableTypes<GETTABLE_NAMES>['model']> = {
  type: 'table' | 'cards';
  render: (item: T) => ReactNode;
  items?: T[];
  shimmer: (key: string) => ReactNode;
  shimmer_count?: number;
  columns: ColumnConfig<keyof T>[];
  header: string;
  current_sort_field?: keyof T;
  current_sort_direction?: SortDirection;
  onSort?: (field: keyof T) => void;
}

export const List = <T extends GettableTypes<GETTABLE_NAMES>['model']>({
  type,
  render,
  items,
  shimmer,
  columns,
  header,
  current_sort_field,
  current_sort_direction,
  onSort,
  shimmer_count = 3,
}: ListProps<T>) => {
  const [is_loaded, setIsLoaded] = useState(false);
  const [show_shimmer, setShowShimmer] = useState(true);

  useEffect(() => {
    if (items) {
      // First fade out shimmer
      setShowShimmer(false);
      // Then show items with animation
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setIsLoaded(false);
      setShowShimmer(true);
    }
  }, [items]);

  return (
    <div className={classes.list}>
      <div className={classes.list_header}>{header}</div>
      {type === 'table'
        ? <table className={classes.list_table}>
          <ColumnNames
            columns={columns}
            current_sort_field={current_sort_field}
            current_sort_direction={current_sort_direction}
            onSort={onSort}
          />
          <tbody className={`${is_loaded ? classes.loaded : ''} ${!show_shimmer && !is_loaded ? classes.transitioning : ''}`}>
            {!is_loaded
              ? Array.from({ length: shimmer_count }).map((_, index) => shimmer(`${index}-shimmer-item`))
              : items?.map((item) => render(item))
            }
          </tbody>
        </table>
        : <div className={`${classes.list_cards} ${is_loaded ? classes.loaded : ''} ${!show_shimmer && !is_loaded ? classes.transitioning : ''}`}>
          {!is_loaded
            ? Array.from({ length: shimmer_count }).map((_, index) => (
              <div key={`${index}-shimmer-item`} className={classes.shimmer_item}>
                {shimmer(`${index}-shimmer-item`)}
              </div>
            ))
            : items?.map((item, index) => (
              <div
                key={(item as any).id || index}
                className={classes.animated_card}
                style={{ ['--animation-order' as any]: index }}
              >
                {render(item)}
              </div>
            ))
          }
        </div>}
    </div>
  )
}