import classes from './SortDirectionSelect.module.scss';

import { SortDirection } from '@shared/src';

type SortDirectionSelectProps = {
  setSortDirection: (sort_direction: string) => void;
}

export const SortDirectionSelect = ({ setSortDirection }: SortDirectionSelectProps) => (
  <select className={classes.sort_direction_select} onChange={(e) => setSortDirection(e.currentTarget.value)}>
    <option value=''>Sort direction</option>
    {Object.values(SortDirection).map((sort_direction) => (
      <option
        key={`sort-direction-${sort_direction.toString()}`}
        value={sort_direction.toString()}
      >
        {sort_direction.toString()}
      </option>
    ))}
  </select>
)