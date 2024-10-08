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

// @Output: 12:00 AM
export const convertToAMPMFormat = (dateTimeString: string): string => {
  const date = new Date(dateTimeString);
  return date
    .toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
    .toUpperCase();
};

// @Output: Thu, Oct 31
export const formatDateToShortString = (dateTimeString: string): string => {
  const date = new Date(dateTimeString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

export const calculateLayoverDuration = (
  endTime: string,
  startTime: string
): string => {
  const end = new Date(endTime);
  const start = new Date(startTime);
  const durationMs = end.getTime() - start.getTime();

  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h${minutes}m`;
};
