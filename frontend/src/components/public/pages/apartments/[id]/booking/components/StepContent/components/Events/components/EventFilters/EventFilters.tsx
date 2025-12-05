"use client";

import type { EventsFilters } from "@shared/src";
import { Search } from "lucide-react";
import { useState } from "react";
import { NumberInput, TextInput } from "./components/FilterDropdown/components";
import { FilterDropdown } from "./components/FilterDropdown/FilterDropdown";
import classes from "./EventFilters.module.scss";

type EventFiltersProps = {
  filters: Partial<EventsFilters>;
  setFilters: (filters: Partial<EventsFilters>) => void;
};

export const EventFilters = ({ filters, setFilters }: EventFiltersProps) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleSearchChange = (search: string) => {
    setFilters({ ...filters, search: search || undefined });
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className={classes.container}>
      <div className={classes.search_container}>
        <Search className={classes.search_icon} size={16} />
        <input
          type="text"
          className={classes.search_input}
          placeholder="Search events"
          value={filters.search || ""}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      <FilterDropdown
        is_open={isFiltersOpen}
        onToggle={() => setIsFiltersOpen(!isFiltersOpen)}
        onClose={() => setIsFiltersOpen(false)}
      >
        <TextInput
          label="Name"
          value={filters.name || ""}
          onChange={(value) => handleFilterChange("name", value)}
          placeholder="Filter by name..."
        />
        <NumberInput
          label="Min Price"
          value={filters.min_price}
          onChange={(value) => handleFilterChange("min_price", value)}
          placeholder="Minimum price..."
          min={0}
        />
        <NumberInput
          label="Max Price"
          value={filters.max_price}
          onChange={(value) => handleFilterChange("max_price", value)}
          placeholder="Maximum price..."
          min={0}
        />
        <NumberInput
          label="Min Capacity"
          value={filters.min_capacity}
          onChange={(value) => handleFilterChange("min_capacity", value)}
          placeholder="Minimum capacity..."
          min={1}
        />
        <NumberInput
          label="Max Capacity"
          value={filters.max_capacity}
          onChange={(value) => handleFilterChange("max_capacity", value)}
          placeholder="Maximum capacity..."
          min={1}
        />
      </FilterDropdown>
    </div>
  );
};
