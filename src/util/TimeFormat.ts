/*
 * Converts a 24:00 time into a 12 hour format
 */
export function convert24hourTo12Hour(timeInput: string){
  const [hour, minute ] = timeInput.split(":");

  const hourInt = parseInt(hour);

  const words = hourInt === 24 || hourInt < 12? "AM" : "PM";

  return `${hourInt % 12}:${minute} ${words}`;
}

/**
 * Removes the seconds in the time format to convert
 * 14:00:00 into 14:00
 *
 * @param time time in format of HH:MM:SS
 */
export function removeSeconds(time: string){
  const [hour, minute] = time.split(":");
  return `${hour}:${minute}`;
}
