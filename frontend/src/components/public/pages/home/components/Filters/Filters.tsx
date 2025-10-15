'use client';

import { useState } from 'react';
import classes from './Filters.module.scss';
import { CalendarDays, ChevronDown, Hotel, UserRoundPen, Filter } from 'lucide-react';
import { FiltersModal } from './components';
import { useHomePageStore } from '@/stores/public/pages/home/useHomePageStore';
import { ApartmentsFilters } from '@shared/src';

export const Filters = () => {
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const { filters, setFilters } = useHomePageStore();

  const handleApplyFilters = (newFilters: Partial<ApartmentsFilters>) => {
    setFilters({
      ...newFilters,
      skip: 0,
      take: filters.take,
    });
  };

  const hasActiveFilters = Object.keys(filters).some(
    key => key !== 'skip' && key !== 'take' && filters[key as keyof typeof filters] !== undefined
  );

  return (
    <>
      <section className={classes.section_filters}>
        <div className={classes.buttons}>
          <button className={classes.button}>
            <CalendarDays />
            <p>Check Available</p>
          </button>
          <button className={classes.button}>
            <UserRoundPen />
            <p>Person</p>
            <p>{filters.max_capacity || 2}</p>
            <ChevronDown />
          </button>
          <button className={classes.button}>
            <Hotel />
            <p>Room Category</p>
          </button>
          <button
            className={`${classes.button} ${hasActiveFilters ? classes.button_active : ''}`}
            onClick={() => setIsFiltersModalOpen(true)}
          >
            <Filter />
            <p>All Filters</p>
            {hasActiveFilters && <span className={classes.filter_badge}>●</span>}
          </button>
          <button className={classes.search_button}>Search</button>
        </div>
      </section>

      {isFiltersModalOpen && <FiltersModal
        onClose={() => setIsFiltersModalOpen(false)}
        currentFilters={filters}
        onApplyFilters={handleApplyFilters}
      />}
    </>
  );
};