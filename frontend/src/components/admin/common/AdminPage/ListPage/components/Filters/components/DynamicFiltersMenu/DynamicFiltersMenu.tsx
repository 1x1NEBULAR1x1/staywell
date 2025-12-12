"use client";

import type { GETTABLE_NAMES } from "@shared/src/models/data";
import type { GettableTypes } from "@shared/src/models/types";
import { useState } from "react";
import {
  BooleanSelect,
  DateInput,
  FilterDropdown,
  NumberInput,
  SelectInput,
  TextInput,
} from "@/components/admin/common/AdminPage/ListPage/components/Filters/components/DynamicFiltersMenu/FilterDropdown/components";
import type { FiltersConfig } from "../../types";

type DynamicFiltersMenuProps<M extends GETTABLE_NAMES> = {
  config: FiltersConfig;
  filters: GettableTypes<M>["filters"];
  setFilters: (filters: GettableTypes<M>["filters"]) => void;
};

export const DynamicFiltersMenu = <M extends GETTABLE_NAMES>({
  config,
  filters,
  setFilters,
}: DynamicFiltersMenuProps<M>) => {
  const [is_open, setIsOpen] = useState(false);

  const renderFilterField = <M extends GETTABLE_NAMES>(key: string) => {
    const field_config = config[key];
    const label =
      field_config.label ||
      key
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    const value = filters[key as keyof GettableTypes<M>["filters"]];

    const onChange = (new_value: unknown) => {
      setFilters({ ...filters, [key]: new_value });
    };

    switch (field_config.type) {
      case "string":
        return (
          <TextInput
            key={key}
            label={label}
            value={value ? String(value) : undefined}
            onChange={onChange}
            placeholder={field_config.placeholder}
          />
        );

      case "number":
      case "integer":
        return (
          <NumberInput
            key={key}
            step={
              field_config.type === "integer" ? 1 : field_config.step || 0.01
            }
            label={label}
            value={value ? Number(value) : undefined}
            onChange={onChange}
            min={field_config.min}
            max={field_config.max}
            placeholder={field_config.placeholder}
          />
        );

      case "date":
        return (
          <DateInput
            key={key}
            label={label}
            value={value ? new Date(String(value)) : undefined}
            onChange={onChange}
          />
        );

      case "enum":
        return (
          <SelectInput
            key={key}
            label={label}
            value={value ? String(value) : undefined}
            onChange={onChange}
            options={field_config.options.map((opt) => ({
              label: opt,
              value: opt,
            }))}
          />
        );

      case "boolean":
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
      {Object.keys(config).map((key) => renderFilterField(key))}
    </FilterDropdown>
  );
};
