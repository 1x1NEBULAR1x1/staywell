import type { ExtendedApartment } from "@shared/src/types/apartments-section/extended.types";
import { Calendar } from "@/components/styles/ui/Calendar";
import { useBookingDates } from "@/hooks/public/booking/useBookingDates";
import { useBookingStore } from "@/stores/public/pages/booking/useBookingStore";
import classes from "./Content.module.scss";
import { ApartmentData, StateData } from "./components";

type ContentProps = {
  apartment: ExtendedApartment;
  guests: number;
};

export const Content = ({ apartment, guests }: ContentProps) => {
  const { setGuests, selected_dates, setSelectedDates } = useBookingStore();

  const { current_month, isLoading, error, isDateAvailable, navigateMonth } =
    useBookingDates({ apartment_id: apartment.id });

  const handleSetGuests = (guests: number) => {
    if (guests < 1) return;
    // Allow setting guests to 1 even if apartment is not loaded yet
    if (apartment?.max_capacity && guests > apartment.max_capacity) return;
    setGuests(guests);
  };

  return (
    <div className={classes.content}>
      <ApartmentData apartment={apartment} />

      <div className={classes.selector}>
        <StateData guests={guests} setGuests={handleSetGuests} error={error} />

        <Calendar
          current_month={current_month}
          selected_range={selected_dates}
          onRangeSelect={setSelectedDates}
          onNavigateMonth={navigateMonth}
          isDateAvailable={isDateAvailable}
          is_loading={isLoading}
        />
      </div>
    </div>
  );
};
