'use client';

import { useState } from 'react';
import { FilterDropdown, TextInput, NumberInput, DateInput, SelectInput, BooleanSelect } from '@/components/admin/common/AdminPage/ListPage/components/Filters/components/DynamicFiltersMenu/FilterDropdown/components';
import { FiltersConfig } from '../../types';
import { GettableTypes } from '@shared/src/models/types';
import { GETTABLE_NAMES } from '@shared/src/models/data';

type DynamicFiltersMenuProps<M extends GETTABLE_NAMES> = {
  config: FiltersConfig;
  filters: GettableTypes<M>['filters'];
  setFilters: (filters: GettableTypes<M>['filters']) => void;
}

export const DynamicFiltersMenu = <M extends GETTABLE_NAMES>({ config, filters, setFilters }: DynamicFiltersMenuProps<M>) => {
  const [is_open, setIsOpen] = useState(false);

  const renderFilterField = <M extends GETTABLE_NAMES>(key: string) => {
    const fieldConfig = config[key];
    const label = fieldConfig.label || key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const value = filters[key as keyof GettableTypes<M>['filters']];

    const onChange = (newValue: any) => {
      setFilters({ ...filters, [key]: newValue });
    };

    switch (fieldConfig.type) {
      case 'string':
        return (
          <TextInput
            key={key}
            label={label}
            value={value ? String(value) : undefined}
            onChange={onChange}
            placeholder={fieldConfig.placeholder}
          />
        );

      case 'number':
      case 'integer':
        return (
          <NumberInput
            key={key}
            step={fieldConfig.type === 'integer' ? 1 : (fieldConfig.step || 0.01)}
            label={label}
            value={value ? Number(value) : undefined}
            onChange={onChange}
            min={fieldConfig.min}
            max={fieldConfig.max}
            placeholder={fieldConfig.placeholder}
          />
        );

      case 'date':
        return (
          <DateInput
            key={key}
            label={label}
            value={value ? new Date(String(value)) : undefined}
            onChange={onChange}
          />
        );

      case 'enum':
        return (
          <SelectInput
            key={key}
            label={label}
            value={value ? String(value) : undefined}
            onChange={onChange}
            options={fieldConfig.options.map(opt => ({ label: opt, value: opt }))}
          />
        );

      case 'boolean':
        return (
          <BooleanSelect
            key={key}
            label={label}
            value={value ? Boolean(value) : undefined}
            onChange={onChange}
          />
        );

      default:
        return null;
    }
  };

  return (
    <FilterDropdown
      is_open={is_open}
      onToggle={() => setIsOpen(!is_open)}
      onClose={() => setIsOpen(false)}
    >
      {Object.keys(config).map(key => renderFilterField(key))}
    </FilterDropdown>
  );
};

