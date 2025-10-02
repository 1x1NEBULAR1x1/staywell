import classes from './Shimmer.module.scss';

import type { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

type ShimmerProps = HTMLAttributes<HTMLDivElement> & {
  show_animation?: boolean;
  children?: ReactNode;
}

/**
 * Компонент Shimmer создает серый элемент с анимацией загрузки.
 * Когда show_animation=true, показывает серый фон с анимацией.
 * Когда show_animation=false, показывает children без анимации.
 *
 * Все размеры и формы наследуются от родителя через CSS.
 */
export const Shimmer = ({
  className,
  show_animation = true,
  children,
  ...props
}: ShimmerProps) => (
  <div
    className={clsx(
      className,
      show_animation && classes.shimmer
    )}
    {...props}
  >
    {!show_animation ? children : <>&nbsp;</>}
  </div>
);  