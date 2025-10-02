export interface BaseListResult<T> {
  items: T[];
  total: number;
  skip: number;
  take: number;
}
