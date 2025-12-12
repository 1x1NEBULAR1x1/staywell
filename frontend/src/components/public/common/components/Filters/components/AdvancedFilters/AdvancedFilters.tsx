"use client";

import type { ApartmentsFilters } from "@shared/src/types/apartments-section";
import { RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useRef } from "react";
import classes from "./AdvancedFilters.module.scss";
import { CustomCheckbox, RangeSlider } from "./components";

type AdvancedFiltersProps = {
  is_open: boolean;
  onToggle: () => void;
  onClose: () => void;
  filters: Partial<ApartmentsFilters>;
  updateFilters: (new_filters: Partial<ApartmentsFilters>) => void;
};

export const AdvancedFilters = ({
  is_open,
  onToggle,
  onClose,
  filters,
  updateFilters,
}: AdvancedFiltersProps) => {
  const dropdown_ref = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdown_ref.current &&
        !dropdown_ref.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (is_open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [is_open, onClose]);

  const handlePriceRangeChange = (range: [number, number]) => {
    updateFilters({
      min_price: range[0],
      max_price: range[1],
    });
  };

  const handleReset = () => {
    updateFilters({
      min_price: undefined,
      max_price: undefined,
      is_pet_friendly: undefined,
      is_smoking: undefined,
    });
  };

  const activeFiltersCount = Object.keys(filters).filter(
    (key) =>
      ["min_price", "max_price", "is_pet_friendly", "is_smoking"].includes(
        key,
      ) &&
      filters[key as keyof typeof filters] !== undefined &&
      filters[key as keyof typeof filters] !== null &&
      filters[key as keyof typeof filters] !== "",
  ).length;

  const has_active_filters = activeFiltersCount > 0;

  const getFiltersText = () => {
    if (activeFiltersCount === 0) return "No filters selected";
    return `${activeFiltersCount} ${activeFiltersCount === 1 ? "filter" : "filters"} selected`;
  };

  return (
    <div className={classes.container} ref={dropdown_ref}>
      <button
        type="button"
        className={`${classes.filter_button} ${has_active_filters ? classes.button_active : ""}`}
        onClick={onToggle}
      >
        <SlidersHorizontal className={classes.icon} />
        <div className={classes.text_content}>
          <span className={classes.label}>More Filters</span>
          <span
            className={`${classes.value} ${!has_active_filters ? classes.placeholder : ""}`}
          >
            {getFiltersText()}
          </span>
        </div>
      </button>

      {is_open && (
        <div className={classes.dropdown}>
          <div className={classes.header}>
            <h3 className={classes.title}>Advanced Filters</h3>
            <div className={classes.header_actions}>
              {has_active_filters && (
                <button
                  type="button"
                  className={classes.reset_button}
                  onClick={handleReset}
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
              )}
              <button
                type="button"
                className={classes.close_icon}
                onClick={onClose}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className={classes.content}>
            <div className={classes.section}>
              <h4 className={classes.section_title}>Price Range</h4>
              <RangeSlider
                label="Price per night"
                min={0}
                max={1000}
                step={10}
                value={[filters.min_price || 0, filters.max_price || 1000]}
                onChange={handlePriceRangeChange}
                prefix="$"
              />
            </div>

            <div className={classes.section}>
              <h4 className={classes.section_title}>Preferences</h4>
              <div className={classes.checkboxes}>
                <CustomCheckbox
                  label="Pet Friendly"
                  description="Allows pets"
                  checked={filters.is_pet_friendly || false}
                  onChange={(checked) =>
                    updateFilters({
                      is_pet_friendly: checked ? true : undefined,
                    })
                  }
                />
                <CustomCheckbox
                  label="Smoking Allowed"
                  description="Smoking permitted"
                  checked={filters.is_smoking || false}
                  onChange={(checked) =>
                    updateFilters({ is_smoking: checked ? true : undefined })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
