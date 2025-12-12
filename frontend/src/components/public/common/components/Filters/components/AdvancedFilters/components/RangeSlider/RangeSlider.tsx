"use client";

import classes from "./RangeSlider.module.scss";

type RangeSliderProps = {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  prefix?: string;
  suffix?: string;
};

export const RangeSlider = ({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  prefix = "",
  suffix = "",
}: RangeSliderProps) => {
  const [minValue, maxValue] = value;

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), maxValue - step);
    onChange([newMin, maxValue]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), minValue + step);
    onChange([minValue, newMax]);
  };

  const min_percent = ((minValue - min) / (max - min)) * 100;
  const max_percent = ((maxValue - min) / (max - min)) * 100;

  return (
    <div className={classes.container}>
      <label htmlFor={`range-slider-${label}`} className={classes.label}>
        {label}
      </label>

      <div className={classes.range_container}>
        <div className={classes.slider_track}>
          <div
            className={classes.slider_range}
            style={{
              left: `${min_percent}%`,
              width: `${max_percent - min_percent}%`,
            }}
          />
        </div>

        <input
          type="range"
          id={`range-slider-${label}`}
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={handleMinChange}
          className={`${classes.slider} ${classes.slider_min}`}
        />

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={handleMaxChange}
          className={`${classes.slider} ${classes.slider_max}`}
        />
      </div>

      <div className={classes.values}>
        <span className={classes.value}>
          {prefix}
          {minValue}
          {suffix}
        </span>
        <span className={classes.separator}>-</span>
        <span className={classes.value}>
          {prefix}
          {maxValue}
          {suffix}
        </span>
      </div>
    </div>
  );
};
