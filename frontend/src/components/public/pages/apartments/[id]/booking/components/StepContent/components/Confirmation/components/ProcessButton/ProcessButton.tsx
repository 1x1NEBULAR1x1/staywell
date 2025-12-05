"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useBookingCheckout } from "@/hooks/public/booking";
import { useBookingStore } from "@/stores/public/pages/booking/useBookingStore";
import classes from "./ProcessButton.module.scss";

export const ProcessButton = ({
  total_price,
  nights,
}: {
  total_price: number;
  nights: number;
}) => {
  const { selected_dates, selected_booking_variant_id } = useBookingStore();
  const booking_checkout_mutation = useBookingCheckout();
  const router = useRouter();

  const validateBookingData = () => {
    const errors: string[] = [];

    if (!selected_booking_variant_id) {
      errors.push("Booking variant not selected");
    }

    console.log(selected_dates);
    if (
      !selected_dates.start ||
      !selected_dates.end ||
      selected_dates.start >= selected_dates.end ||
      nights < 1
    ) {
      errors.push("Invalid booking dates");
    }

    if (total_price <= 0) {
      errors.push("Invalid booking price");
    }

    return errors;
  };

  const handleConfirmClick = async () => {
    const validationErrors = validateBookingData();
    if (validationErrors.length > 0) {
      console.error("Validation errors:", validationErrors);
      return;
    }

    try {
      // Create booking
      const data = await booking_checkout_mutation.mutateAsync();
      if (data?.session_url) router.push(data.session_url);
    } catch (error: any) {
      console.error("Error creating booking:", error);

      // Define the type of error and show the corresponding message
      let errorMessage = "An unknown error occurred while creating the booking";

      if (error?.response?.status === 409) {
        errorMessage = "Dates are already taken. Please select other dates.";
      } else if (error?.response?.status === 400) {
        errorMessage =
          "Invalid booking data. Please check the entered information.";
      } else if (error?.response?.status === 401) {
        errorMessage = "You need to be logged in to create a booking.";
      } else if (error?.response?.status === 403) {
        errorMessage =
          "You do not have enough permissions to create a booking.";
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      // Here you can add a toast notification or error state
      alert(errorMessage);
    }
  };

  return (
    <div className={classes.confirmation}>
      <h3>Confirm and pay</h3>
      {booking_checkout_mutation.isPending && (
        <div className={classes.processing}>
          <Loader2 size={24} className={classes.spinner} />
          <span>Processing payment...</span>
        </div>
      )}

      {booking_checkout_mutation.isError && (
        <div className={classes.error}>
          <AlertCircle size={24} />
          <span>
            An error occurred while processing the payment. Please try again.
          </span>
        </div>
      )}

      <button
        type="button"
        className={classes.confirmButton}
        onClick={handleConfirmClick}
        disabled={booking_checkout_mutation.isPending}
      >
        {booking_checkout_mutation.isPending
          ? "Processing..."
          : "Go to payment page"}
      </button>
    </div>
  );
};
