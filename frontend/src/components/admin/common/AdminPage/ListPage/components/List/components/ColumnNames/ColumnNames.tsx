import classes from './ColumnNames.module.scss';
import { SortDirection } from '@shared/src';
import clsx from 'clsx';
import { ChevronDown, ChevronUp } from 'lucide-react';

export type ColumnConfig<T extends string | number | symbol = string> = {
  label: string;
  field: T;
  sortable?: boolean;
}

type ColumnNamesProps<T extends string | number | symbol = string> = {
  columns: ColumnConfig<T>[];
  current_sort_field?: T;
  current_sort_direction?: SortDirection;
  onSort?: (field: T) => void;
}

export const ColumnNames = <T extends string | number | symbol>({
  columns,
  current_sort_field,
  current_sort_direction,
  onSort
}: ColumnNamesProps<T>) => {
  const handleSort = (column: ColumnConfig<T>) => {
    if (column.sortable !== false && onSort) {
      onSort(column.field);
    }
  };

  return (
    <thead className={classes.column_names}>
      <tr>
        {columns.map((column) => (
          <th
            key={`${String(column.field)}-column-name`}
            className={`${classes.column_name} ${column.sortable !== false ? classes.sortable : ''}`}
            onClick={() => handleSort(column)}
          >
            <span className={clsx(
              classes.column_name_label,
              current_sort_field === column.field && current_sort_direction === SortDirection.asc && classes.active
            )}>{column.label} <ChevronUp size={16} /></span>
          </th>
        ))}
      </tr>
    </thead>
  );
};