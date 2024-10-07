export const convertMinutesToHoursAndMinutes = (
  durationInMinutes: number
): string => {
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;
  return `${hours}h${minutes.toString().padStart(2, '0')}m`;
};

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
