"use client";

import type { EventsFilters as EventsFiltersType } from "@shared/src/types/events-section";
import { UserRoundPen } from "lucide-react";
import { useState } from "react";
import { AdvancedFilters } from "./components/AdvancedFilters/AdvancedFilters";
import { CalendarDropdown } from "./components/CalendarDropdown/CalendarDropdown";
import { CustomSelect } from "./components/CustomSelect/CustomSelect";
import classes from "./EventsFilters.module.scss";

type EventsFiltersProps = {
  filters: Partial<EventsFiltersType>;
  updateFilters: (new_filters: Partial<EventsFiltersType>) => void;
};

const guestOptions = [
  { label: "1 Guest", value: 1 },
  { label: "2 Guests", value: 2 },
  { label: "3 Guests", value: 3 },
  { label: "4 Guests", value: 4 },
  { label: "5+ Guests", value: 5 },
];

export const EventsFilters = ({
  filters,
  updateFilters,
}: EventsFiltersProps) => {
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
