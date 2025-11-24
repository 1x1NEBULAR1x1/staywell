// Get days of the month
export const getDaysInMonth = ({ date }: { date: Date }) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const first_day = new Date(year, month, 1);
  const last_day = new Date(year, month + 1, 0);
  const days = [];

  // Add empty days at the beginning of the month
  const first_day_of_week = first_day.getDay();
  const start_offset = first_day_of_week === 0 ? 6 : first_day_of_week - 1; // Monday = 0

  for (let i = 0; i < start_offset; i++) {
    days.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= last_day.getDate(); day++) {
    days.push(new Date(year, month, day));
  }

  return days;
};


export const isDateInRange = ({ date, selected_range }: { date: Date, selected_range: { start?: Date; end?: Date } }) => {
  if (!selected_range.start) return false;

  if (selected_range.start && selected_range.end) {
    return date >= selected_range.start && date <= selected_range.end;
  }

  return date.getTime() === new Date(selected_range.start).getTime();
};

export const isDateRangeStart = ({ date, selected_range }: { date: Date, selected_range: { start?: Date; end?: Date } }) => {
  return selected_range.start && date.getTime() === new Date(selected_range.start).getTime();
};

export const isDateRangeEnd = ({ date, selected_range }: { date: Date, selected_range: { start?: Date; end?: Date } }) => {
  return selected_range.end && date.getTime() === new Date(selected_range.end).getTime();
};