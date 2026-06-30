type DateFormatType = 'date' | 'datetime' | 'time' | 'monthYear' | 'full';

const formatOptions: Record<DateFormatType, Intl.DateTimeFormatOptions> = {
  date: { year: 'numeric', month: '2-digit', day: '2-digit' }, // 15/10/2025
  datetime: { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }, // 15/10/2025 14:30
  time: { hour: '2-digit', minute: '2-digit' }, // 14:30
  monthYear: { month: 'short', year: 'numeric' }, // Oct 2025
  full: { dateStyle: 'full', timeStyle: 'short' }, // Wednesday, October 15, 2025 at 2:30 PM
};

export const formatDate = (dateString: string | Date | undefined, type: DateFormatType = 'date') => {
  if (!dateString) return '--';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '--';

  return new Intl.DateTimeFormat('en-US', formatOptions[type]).format(date);
};
