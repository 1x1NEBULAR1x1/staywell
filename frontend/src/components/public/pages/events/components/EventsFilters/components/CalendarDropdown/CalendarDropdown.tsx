"use client";

import type { EventsFilters } from "@shared/src/types/events-section";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Calendar } from "@/components/styles/ui/Calendar";
import classes from "./CalendarDropdown.module.scss";

type CalendarDropdownProps = {
  filters: Partial<EventsFilters>;
  updateFilters: (new_filters: Partial<EventsFilters>) => void;
};

export const CalendarDropdown = ({
  filters,
  updateFilters,
}: CalendarDropdownProps) => {
  const [is_open, setIsOpen] = useState(false);
  const dropdown_ref = useRef<HTMLDivElement>(null);
  const [current_month, setCurrentMonth] = useState(new Date());

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdown_ref.current &&
        !dropdown_ref.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (is_open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [is_open]);

  const handleRangeSelect = (range: { start?: Date; end?: Date }) => {
    updateFilters({
      min_start: range.start,
      max_end: range.end,
    });
  };

  const handleNavigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      if (direction === "next") {
        newMonth.setMonth(newMonth.getMonth() + 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() - 1);
      }
      return newMonth;
    });
  };

  const has_selected_dates = filters.min_start || filters.max_end;

  const getDateDisplayText = () => {
    if (!filters.min_start) return "Select dates";
    if (filters.min_start && !filters.max_end) {
      return format(filters.min_start, "MMM d");
    } else if (filters.min_start && filters.max_end) {
      return `${format(filters.min_start, "MMM d")} - ${format(filters.max_end, "MMM d")}`;
    }
    return "Select dates";
  };

  return (
    <div className={classes.container} ref={dropdown_ref}>
      <button
        type="button"
        className={`${classes.filter_button} ${has_selected_dates ? classes.button_active : ""}`}
        onClick={() => setIsOpen(!is_open)}
      >
        <CalendarDays className={classes.icon} />
        <div className={classes.text_content}>
          <span className={classes.label}>Check Available</span>
          <span
            className={`${classes.value} ${!has_selected_dates ? classes.placeholder : ""}`}
          >
            {getDateDisplayText()}
          </span>
        </div>
      </button>

      {is_open && (
        <div className={classes.dropdown}>
          <Calendar
            current_month={current_month}
            selected_range={{
              start: filters.min_start
                ? new Date(filters.min_start)
                : undefined,
              end: filters.max_end ? new Date(filters.max_end) : undefined,
            }}
            onRangeSelect={handleRangeSelect}
            onNavigateMonth={handleNavigateMonth}
            isDateAvailable={(date) => date.getTime() >= Date.now()}
          />
        </div>
      )}
    </div>
  );
};
