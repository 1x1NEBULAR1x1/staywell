export type FilterFieldType = 'string' | 'number' | 'integer' | 'date' | 'enum' | 'boolean';

export type BaseFilterConfig = {
  label?: string;
}

export type StringFilterConfig = BaseFilterConfig & {
  type: 'string';
  placeholder?: string;
}

export type NumberFilterConfig = BaseFilterConfig & {
  type: 'number' | 'integer';
  step?: number;
  min?: number;
  max?: number;
  placeholder?: string;
}

export type DateFilterConfig = BaseFilterConfig & {
  type: 'date';
  placeholder?: string;
}

export type EnumFilterConfig = BaseFilterConfig & {
  type: 'enum';
  options: readonly string[] | string[];
  placeholder?: string;
}

export type BooleanFilterConfig = BaseFilterConfig & {
  type: 'boolean';
}

export type FilterConfig =
  | StringFilterConfig
  | NumberFilterConfig
  | DateFilterConfig
  | EnumFilterConfig
  | BooleanFilterConfig;

export type FiltersConfig = Record<string, FilterConfig>;

