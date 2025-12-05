import type { BaseListResult } from "@shared/src/common/base-types/base-list-result.interface";
import type { ExtendedApartment } from "@shared/src/types/apartments-section/extended.types";
import { Features, Filters, Hero, Recomendations } from "./components";
import classes from "./Home.module.scss";

export const Home = ({
  initial_data,
}: {
  initial_data?: BaseListResult<ExtendedApartment>;
}) => {
  return (
    <div className={classes.page}>
      <Hero />

      <Filters />

      <Recomendations initial_data={initial_data} />

      <Features />
    </div>
  );
};
