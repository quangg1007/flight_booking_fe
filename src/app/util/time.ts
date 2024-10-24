// @Input: 600m
// @Output: 12h30m
export const convertMinutesToHoursAndMinutes = (
  durationInMinutes: number
): string => {
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h${minutes.toString().padStart(2, '0')}m`;
};

// @Input: 2024-10-30T01:40:00
// @Output: 12:00 AM
export const convertToAMPMFormat = (dateTime: string | number): string => {
  const date = new Date(dateTime);
  return date
    .toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
    .toUpperCase();
};

// @Input: 2024-10-30T01:40:00
// @Output: Thu, Oct 31
export const formatDateToShortString = (dateTimeString: string): string => {
  const date = new Date(dateTimeString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

// @Input: startTime: 2024-10-30T01:40:00
// @Input: endTime: 2024-10-30T05:00:00
// @Output: 3h20m
export const calculateDuration = (
  endTime: string,
  startTime: string
): string => {
  const end = new Date(endTime);
  const start = new Date(startTime);
  const durationMs = end.getTime() - start.getTime();

  return convertMinutesToHoursAndMinutes(durationMs / (1000 * 60));
};

// @Input: 2024-10-30T01:40:00
// @Output: Wed 01:40 AM
export const formatDateToShortStringWithTime = (
  dateTimeString: string
): string => {
  const date = new Date(dateTimeString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};
