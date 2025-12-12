import { Shimmer } from "@/components/styles/ui/Shimmer/Shimmer";
import classes from "./ApartmentCardSkeleton.module.scss";

export const ApartmentCardSkeleton = () => {
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
        {/* Title and number */}
        <div className={classes.header}>
          <Shimmer className={classes.title} />
          <Shimmer className={classes.number} />
        </div>

        {/* Info rows */}
        <div className={classes.info}>
          <Shimmer className={classes.info_row} />
          <Shimmer className={classes.info_row} />
          <Shimmer className={classes.info_row} />
        </div>

        {/* Description */}
        <Shimmer className={classes.description} />

        {/* Tags */}
        <div className={classes.tags}>
          <Shimmer className={classes.tag} />
          <Shimmer className={classes.tag} />
        </div>
      </div>
    </div>
  );
};
