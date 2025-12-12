"use client";

import type { ApartmentsFilters } from "@shared/src/types/apartments-section";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Calendar } from "@/components/styles/ui/Calendar";
import classes from "./CalendarDropdown.module.scss";

type CalendarDropdownProps = {
  filters: Partial<ApartmentsFilters>;
  updateFilters: (new_filters: Partial<ApartmentsFilters>) => void;
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

  const selected_range = {
    start: filters.start_date ? new Date(filters.start_date) : undefined,
    end: filters.end_date ? new Date(filters.end_date) : undefined,
  };

  const handleRangeSelect = (range: { start?: Date; end?: Date }) => {
    updateFilters({
      start_date: range.start,
      end_date: range.end,
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

  const has_selected_dates = filters.start_date || filters.end_date;

  const getDateDisplayText = () => {
    if (!filters.start_date) return "Select dates";
    if (filters.start_date && !filters.end_date) {
      return format(filters.start_date, "MMM d");
    } else if (filters.start_date && filters.end_date) {
      return `${format(filters.start_date, "MMM d")} - ${format(filters.end_date, "MMM d")}`;
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
            selected_range={selected_range}
            onRangeSelect={handleRangeSelect}
            onNavigateMonth={handleNavigateMonth}
            isDateAvailable={(date) => date.getTime() >= Date.now()}
          />
        </div>
      )}
    </div>
  );
};
