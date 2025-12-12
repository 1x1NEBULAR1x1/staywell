"use client";

import { ApartmentType } from "@shared/src";
import type { ApartmentsFilters } from "@shared/src/types/apartments-section";
import { Hotel, UserRoundPen } from "lucide-react";
import { useState } from "react";
import { AdvancedFilters } from "./components/AdvancedFilters/AdvancedFilters";
import { CalendarDropdown } from "./components/CalendarDropdown/CalendarDropdown";
import { CustomSelect } from "./components/CustomSelect/CustomSelect";
import classes from "./Filters.module.scss";

type FiltersProps = {
  filters: Partial<ApartmentsFilters>;
  updateFilters: (new_filters: Partial<ApartmentsFilters>) => void;
};

const guestOptions = [
  { label: "1 Guest", value: 1 },
  { label: "2 Guests", value: 2 },
  { label: "3 Guests", value: 3 },
  { label: "4 Guests", value: 4 },
  { label: "5+ Guests", value: 5 },
];

const roomTypeOptions = [
  { label: "Any Type", value: undefined },
  { label: "Standard Room", value: ApartmentType.STANDARD },
  { label: "Superior Room", value: ApartmentType.SUPERIOR },
  { label: "Exclusive Room", value: ApartmentType.EXCLUSIVE },
  { label: "Luxury Suite", value: ApartmentType.LUXURY },
  { label: "Budget Room", value: ApartmentType.BUDGET },
];

export const Filters = ({ filters, updateFilters }: FiltersProps) => {
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);

  return (
    <section className={classes.section_filters}>
      <CalendarDropdown filters={filters} updateFilters={updateFilters} />

      <CustomSelect
        label="Guests"
        value={filters.min_capacity}
        options={guestOptions}
        onChange={(value) => updateFilters({ min_capacity: Number(value) })}
        icon={<UserRoundPen size={16} />}
      />

      <CustomSelect
        label="Room Type"
        value={filters.type}
        options={roomTypeOptions}
        onChange={(value) =>
          updateFilters({ type: value as ApartmentType | undefined })
        }
        icon={<Hotel size={16} />}
      />

      <AdvancedFilters
        is_open={isAdvancedFiltersOpen}
        onToggle={() => setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)}
        onClose={() => setIsAdvancedFiltersOpen(false)}
        filters={filters}
        updateFilters={updateFilters}
      />
    </section>
  );
};
