import classes from './SortBySelect.module.scss';

import { GETTABLE_NAMES } from '@shared/src';

type SortBySelectProps = {
  sort_by_list?: string[];
  setSortBy: (sort_by: string) => void;
}

export const SortBySelect = ({
  sort_by_list,
  setSortBy
}: SortBySelectProps) => (
  <select className={classes.sort_by_select} onChange={(e) => setSortBy(e.currentTarget.value)}>
    <option value=''>Sort by</option>
    {sort_by_list?.map((sort_by) => (
      <option key={`sort-by-${sort_by.toString()}`} value={sort_by.toString()}>{sort_by.toString()}</option>
    ))}
  </select>
)