import classes from './ToolTip.module.scss';

import { ReactNode } from 'react';
import clsx from 'clsx';

interface ToolTipProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode,
  label: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  variant?: 'white' | 'main' | 'light' | 'green' | 'red' | 'yellow';
}

export const ToolTip = ({ children, label, position = 'top', variant = 'white', className, ...props }: ToolTipProps) => (
  <div className={clsx(classes.tooltip_wrapper, className)} {...props}>
    {children}
    <span className={clsx(classes.tooltip_text, classes[`tooltip_text_position_${position}`], classes[`tooltip_text_variant_${variant}`])}>{label}</span>
  </div>
);