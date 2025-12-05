import type { ExtendedApartment } from "@shared/src/types/apartments-section/extended.types";
import type { BookingStep } from "../../config";
import { AdditionalOptions, Confirmation, Dates, Events } from "./components";

export const StepContent = ({
  current_step,
  initial_data,
}: {
  current_step: BookingStep;
  initial_data: ExtendedApartment;
}) => {
  switch (current_step) {
    case "dates":
      return <Dates initial_data={initial_data} />;
    case "events":
      return <Events />;
    case "additional_options":
      return <AdditionalOptions />;
    case "confirmation":
      return <Confirmation initial_data={initial_data} />;
    default:
      return null;
  }
};
