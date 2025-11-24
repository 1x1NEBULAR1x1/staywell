'use client';

import classes from './Dates.module.scss';
import { useParams } from 'next/navigation';
import { useBookingDates } from '@/hooks/public';
import { Calendar } from '@/components/styles/ui/Calendar';
import { Header, StateData, ApartmentData, Summary } from './components';
import { ExtendedApartment } from '@shared/src/types/apartments-section/extended.types';
import { useModel } from '@/hooks/admin/queries';
import { useBookingStore } from '@/stores/public/pages/booking/useBookingStore';

export const Dates = ({ initial_data }: { initial_data: ExtendedApartment }) => {
  const { id } = useParams<{ id: string }>();
  const { guests, setGuests, selected_dates, setSelectedDates, selected_booking_variant_id, setSelectedBookingVariantId } = useBookingStore();
  const {
    current_month,
    isLoading,
    error,
    isDateAvailable,
    navigateMonth,
  } = useBookingDates({ apartment_id: id });
  const { data: apartment } = useModel('APARTMENT').find(id, { initial_data: { data: initial_data } });

  const handleRangeSelect = (range: { start: Date | null; end: Date | null }) => {
    setSelectedRange(range);
  };

  const handleSetGuests = (guests: number) => {
    if (guests < 1 || guests > (apartment?.max_capacity ?? 0)) return;
    setGuests(guests);

    // Automatically select suitable booking variant after guests change
    if (apartment) {
      const suitable_variants = apartment.booking_variants.filter(
        variant => variant.capacity >= guests && variant.is_available
      );

      if (suitable_variants.length > 0) {
        const current_variant = suitable_variants.find(v => v.id === selected_booking_variant_id);
        if (!current_variant) {
          // Select the cheapest variant
          const cheapest_variant = suitable_variants.reduce((cheapest, current) =>
            current.price < cheapest.price ? current : cheapest
          );
          setSelectedBookingVariantId(cheapest_variant.id);
        }
      } else {
        setSelectedBookingVariantId(null);
      }
    }
  };

  return apartment && (
    <div className={classes.container}>
      <Header />

      <div className={classes.content}>
        <ApartmentData apartment={apartment} />

        <div className={classes.selector}>
          <StateData
            guests={guests}
            setGuests={handleSetGuests}
            error={error}
          />

          <Calendar
            current_month={current_month}
            selected_range={selected_range}
            onRangeSelect={handleRangeSelect}
            onNavigateMonth={navigateMonth}
            isDateAvailable={isDateAvailable}
            is_loading={isLoading}
          />
        </div>
      </div>

      {apartment && (
        <Summary
          apartment={apartment}
          selected_range={selected_range}
          guests={guests}
        />
      )}
    </div>
  );
};