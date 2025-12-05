import type { ExtendedApartment } from "@shared/src";
import classes from "./Apartment.module.scss";
import { ApartmentInfo, Header, Images } from "./components";

export const Apartment = ({
  initial_data,
}: {
  initial_data: ExtendedApartment;
}) => {
  return (
    <div className={classes.page}>
      <Header title={initial_data.name || "Superior Room"} />
      <Images apartment={initial_data} />
      <ApartmentInfo apartment={initial_data} />
    </div>
  );
};
