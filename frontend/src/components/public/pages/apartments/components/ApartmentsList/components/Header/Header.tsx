import { Shimmer } from "@/components/styles/ui";
import classes from "./Header.module.scss";

export const Header = ({
  isLoading,
  total,
}: {
  isLoading: boolean;
  total: number;
}) => {
  if (isLoading) {
    return (
      <div className={classes.results_header}>
        <div className={classes.count}>
          <Shimmer className={classes.count_shimmer} />
          <span>apartments found</span>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.results_header}>
      <p className={classes.count}>
        {total} {total === 1 ? "apartment" : "apartments"} found
      </p>
    </div>
  );
};
