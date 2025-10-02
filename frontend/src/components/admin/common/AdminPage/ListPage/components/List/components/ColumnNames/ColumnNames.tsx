import classes from './ColumnNames.module.scss';

type ColumnNamesProps = {
  columns: string[];
}

export const ColumnNames = ({ columns }: ColumnNamesProps) => (
  <thead className={classes.column_names}>
    <tr>
      {columns.map((column) => (
        <th key={`${column}-column-name`} className={classes.column_name}>{column}</th>
      ))}
    </tr>
  </thead>
);