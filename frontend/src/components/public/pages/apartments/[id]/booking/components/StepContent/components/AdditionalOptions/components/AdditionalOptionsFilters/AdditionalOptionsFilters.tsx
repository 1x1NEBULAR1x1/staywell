"use client";

import type { AdditionalOptionsFilters as AdditionalOptionsFiltersType } from "@shared/src";
import { Search } from "lucide-react";
import { useState } from "react";
import {
  NumberInput,
  TextInput,
} from "@/components/admin/common/AdminPage/ListPage/components/Filters/components/DynamicFiltersMenu/FilterDropdown/components";
import classes from "./AdditionalOptionsFilters.module.scss";
import { FilterDropdown } from "./components/FilterDropdown/FilterDropdown";

type AdditionalOptionsFiltersProps = {
  filters: Partial<AdditionalOptionsFiltersType>;
  setFilters: (filters: Partial<AdditionalOptionsFiltersType>) => void;
};

export const AdditionalOptionsFilters = ({
  filters,
  setFilters,
}: AdditionalOptionsFiltersProps) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleSearchChange = (search: string) => {
    setFilters({ ...filters, search: search || undefined });
  };

  const handleFilterChange = (key: string, value: unknown) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className={classes.container}>
      <div className={classes.search_container}>
        <Search className={classes.search_icon} size={16} />
        <input
          type="text"
          className={classes.search_input}
          placeholder="Search additional options"
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
      </FilterDropdown>
    </div>
  );
};
