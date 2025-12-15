import clsx from "clsx";
import type { HTMLAttributes, ReactNode } from "react";
import classes from "./Shimmer.module.scss";

type ShimmerProps = HTMLAttributes<HTMLDivElement> & {
  show_animation?: boolean;
  children?: ReactNode;
};

/**
 * Shimmer component creates gray element with loading animation.
 * When show_animation=true, shows gray background with animation.
 * When show_animation=false, shows children without animation.
 *
 * All sizes and shapes are inherited from parent via CSS.
 */
export const Shimmer = ({
  className,
  show_animation = true,
  children,
  ...props
}: ShimmerProps) => (
  <div
    className={clsx(className, show_animation && classes.shimmer)}
    {...props}
  >
    {!show_animation ? children : <>&nbsp;</>}
  </div>
);
