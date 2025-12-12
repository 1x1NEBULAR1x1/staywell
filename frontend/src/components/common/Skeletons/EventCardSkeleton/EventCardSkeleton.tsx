import { Shimmer } from "@/components/styles/ui/Shimmer/Shimmer";
import classes from "./EventCardSkeleton.module.scss";

export const EventCardSkeleton = () => {
  return (
    <div className={classes.card}>
      {/* Image skeleton */}
      <div className={classes.image_container}>
        <Shimmer className={classes.image} />
        <div className={classes.badge_container}>
          <Shimmer className={classes.badge} />
        </div>
      </div>

      {/* Content skeleton */}
      <div className={classes.content}>
        {/* Title */}
        <Shimmer className={classes.title} />

        {/* Info rows */}
        <div className={classes.info}>
          <Shimmer className={classes.info_row} />
          <Shimmer className={classes.info_row} />
          <Shimmer className={classes.info_row} />
        </div>

        {/* Description */}
        <Shimmer className={classes.description} />

        {/* Availability */}
        <Shimmer className={classes.availability} />
      </div>
    </div>
  );
};
